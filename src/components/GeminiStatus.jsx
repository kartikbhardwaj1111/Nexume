/**
 * Gemini Status Component
 * Shows the status of Gemini AI integration
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Activity,
  Brain,
  Sparkles
} from 'lucide-react';
import { geminiService } from '../services/ai/GeminiService.js';
import { runAllTests } from '../utils/testGemini.js';

const GeminiStatus = () => {
  const [status, setStatus] = useState({
    isInitialized: false,
    isAvailable: false,
    isLoading: true,
    error: null,
    stats: null
  });
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Check Gemini status on component mount
  useEffect(() => {
    checkGeminiStatus();
  }, []);

  const checkGeminiStatus = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Check if service is available
      const isAvailable = await geminiService.isAvailable();
      
      // Get service statistics
      const stats = geminiService.getServiceStats();
      
      setStatus({
        isInitialized: stats.isInitialized,
        isAvailable,
        isLoading: false,
        error: null,
        stats
      });
    } catch (error) {
      setStatus({
        isInitialized: false,
        isAvailable: false,
        isLoading: false,
        error: error.message,
        stats: null
      });
    }
  };

  const runTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await runAllTests();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusColor = () => {
    if (status.isLoading) return 'bg-blue-500';
    if (status.error) return 'bg-red-500';
    if (status.isAvailable) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (status.isLoading) return 'Checking...';
    if (status.error) return 'Error';
    if (status.isAvailable) return 'Available';
    return 'Unavailable';
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Gemini AI Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <div>
              <div className="font-medium">Service Status</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getStatusText()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {status.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {status.isAvailable && <CheckCircle className="w-4 h-4 text-green-600" />}
            {status.error && <AlertCircle className="w-4 h-4 text-red-600" />}
            
            <Badge variant={status.isAvailable ? 'default' : 'secondary'}>
              {status.isAvailable ? 'Ready' : 'Not Ready'}
            </Badge>
          </div>
        </div>

        {/* API Key Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">API Key</span>
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              {status.stats?.isInitialized ? 'Configured' : 'Not Set'}
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Model</span>
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300">
              Gemini 1.5 Flash
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        {status.stats?.rateLimits && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Rate Limits</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="font-medium">Per Minute</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {status.stats.rateLimits.minute.used}/{status.stats.rateLimits.minute.limit}
                </div>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="font-medium">Per Hour</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {status.stats.rateLimits.hour.used}/{status.stats.rateLimits.hour.limit}
                </div>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="font-medium">Per Day</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {status.stats.rateLimits.day.used}/{status.stats.rateLimits.day.limit}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {status.error && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              {status.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Test Results</div>
            <Alert className={testResults.success ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:bg-red-950/20'}>
              {testResults.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={testResults.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {testResults.success ? (
                  `All tests passed! (${testResults.summary?.passed}/${testResults.summary?.total})`
                ) : (
                  testResults.error || `Tests failed (${testResults.summary?.failed}/${testResults.summary?.total})`
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={checkGeminiStatus} 
            disabled={status.isLoading}
            variant="outline"
            size="sm"
          >
            {status.isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Activity className="w-4 h-4 mr-2" />
            )}
            Refresh Status
          </Button>
          
          <Button 
            onClick={runTests} 
            disabled={isRunningTests || !status.isAvailable}
            size="sm"
          >
            {isRunningTests ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Run Tests
          </Button>
        </div>

        {/* Features List */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-2">Gemini AI Features</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Resume Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Job Extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Career Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Interview Questions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiStatus;