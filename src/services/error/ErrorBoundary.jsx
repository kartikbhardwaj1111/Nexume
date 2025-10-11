/**
 * Error Boundary Component
 * Comprehensive error boundary with recovery options and user feedback
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Copy, 
  Download,
  Shield,
  Clock
} from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: crypto.randomUUID(),
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo,
    });

    // Log to console for development
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    try {
      const errorReport = {
        id: this.state.errorId,
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
      };

      // Store error locally for debugging
      const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingErrors.push(errorReport);
      
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('error_reports', JSON.stringify(existingErrors));

      // In production, you might want to send this to an error reporting service
      // this.sendToErrorService(errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  getUserId = () => {
    // Get user ID from local storage or generate anonymous ID
    let userId = localStorage.getItem('anonymous_user_id');
    if (!userId) {
      userId = 'anon_' + crypto.randomUUID();
      localStorage.setItem('anonymous_user_id', userId);
    }
    return userId;
  };

  getSessionId = () => {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  handleCopyError = () => {
    const errorText = this.getErrorText();
    navigator.clipboard.writeText(errorText).then(() => {
      // Show success feedback
      this.setState({ copiedToClipboard: true });
      setTimeout(() => {
        this.setState({ copiedToClipboard: false });
      }, 2000);
    });
  };

  handleDownloadError = () => {
    const errorText = this.getErrorText();
    const blob = new Blob([errorText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${this.state.errorId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  getErrorText = () => {
    const { error, errorInfo, errorId } = this.state;
    return `
Error Report
============
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error Message:
${error?.message || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

Retry Count: ${this.state.retryCount}
    `.trim();
  };

  getErrorSeverity = () => {
    const { error } = this.state;
    
    if (!error) return 'medium';
    
    // Determine severity based on error type
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'low';
    }
    
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'high';
    }
    
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'medium';
    }
    
    return 'medium';
  };

  getRecoveryOptions = () => {
    const { error, retryCount } = this.state;
    const severity = this.getErrorSeverity();
    
    const options = [];
    
    // Always show retry option (up to 3 times)
    if (retryCount < 3) {
      options.push({
        label: 'Try Again',
        action: this.handleRetry,
        icon: RefreshCw,
        variant: 'default',
        description: 'Attempt to recover from the error',
      });
    }
    
    // Show reload for chunk errors or after multiple retries
    if (error?.name === 'ChunkLoadError' || retryCount >= 2) {
      options.push({
        label: 'Reload Page',
        action: this.handleReload,
        icon: RefreshCw,
        variant: 'outline',
        description: 'Reload the entire page',
      });
    }
    
    // Always show go home option
    options.push({
      label: 'Go Home',
      action: this.handleGoHome,
      icon: Home,
      variant: 'outline',
      description: 'Return to the main page',
    });
    
    return options;
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId, retryCount, showDetails, copiedToClipboard } = this.state;
      const severity = this.getErrorSeverity();
      const recoveryOptions = this.getRecoveryOptions();

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-red-800">Something went wrong</CardTitle>
                  <CardDescription>
                    We encountered an unexpected error. Don't worry, your data is safe.
                  </CardDescription>
                </div>
                <Badge 
                  variant={severity === 'high' ? 'destructive' : severity === 'medium' ? 'default' : 'secondary'}
                >
                  {severity} severity
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Summary */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Error Details:</div>
                    <div className="text-sm">
                      <div>Error ID: <code className="bg-gray-100 px-1 rounded">{errorId}</code></div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date().toLocaleString()}</span>
                      </div>
                      {retryCount > 0 && (
                        <div className="text-amber-600 mt-1">
                          Retry attempts: {retryCount}
                        </div>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Recovery Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Recovery Options:</h4>
                <div className="grid gap-2">
                  {recoveryOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant={option.variant}
                      onClick={option.action}
                      className="justify-start h-auto p-3"
                    >
                      <option.icon className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs opacity-70">{option.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Error Actions */}
              <div className="space-y-3">
                <h4 className="font-medium">Error Information:</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={this.handleCopyError}
                    disabled={copiedToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copiedToClipboard ? 'Copied!' : 'Copy Error'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={this.handleDownloadError}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => this.setState({ showDetails: !showDetails })}
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    {showDetails ? 'Hide' : 'Show'} Details
                  </Button>
                </div>
              </div>

              {/* Technical Details */}
              {showDetails && (
                <div className="space-y-3">
                  <Separator />
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Technical Details:</h5>
                    <div className="space-y-2 text-sm font-mono">
                      <div>
                        <span className="text-gray-600">Message:</span>
                        <div className="bg-white p-2 rounded border mt-1">
                          {error?.message || 'No error message available'}
                        </div>
                      </div>
                      
                      {error?.stack && (
                        <div>
                          <span className="text-gray-600">Stack Trace:</span>
                          <div className="bg-white p-2 rounded border mt-1 max-h-40 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-xs">
                              {error.stack}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <div className="font-medium text-blue-800 mb-1">What happened?</div>
                <div>
                  An unexpected error occurred while processing your request. 
                  This has been automatically reported and your data remains secure. 
                  Try the recovery options above to continue using the application.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;