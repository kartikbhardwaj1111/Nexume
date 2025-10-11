/**
 * Error Handler Service
 * Centralized error handling, logging, and user notification system
 */

class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.listeners = new Set();
    
    // Error categories for better handling
    this.errorCategories = {
      NETWORK: 'network',
      VALIDATION: 'validation',
      SECURITY: 'security',
      STORAGE: 'storage',
      AI_SERVICE: 'ai_service',
      FILE_PROCESSING: 'file_processing',
      USER_INPUT: 'user_input',
      SYSTEM: 'system',
      UNKNOWN: 'unknown',
    };

    // Error severity levels
    this.severityLevels = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical',
    };

    // Initialize global error handlers
    this.initializeGlobalHandlers();
  }

  /**
   * Initialize global error handlers
   */
  initializeGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        category: this.errorCategories.SYSTEM,
        severity: this.severityLevels.HIGH,
        context: 'unhandled_promise_rejection',
      });
    });

    // Handle global JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        category: this.errorCategories.SYSTEM,
        severity: this.severityLevels.HIGH,
        context: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError(new Error(`Resource loading failed: ${event.target.src || event.target.href}`), {
          category: this.errorCategories.NETWORK,
          severity: this.severityLevels.MEDIUM,
          context: 'resource_loading',
        });
      }
    }, true);
  }

  /**
   * Main error handling method
   * @param {Error|string} error - Error object or message
   * @param {Object} options - Error handling options
   */
  handleError(error, options = {}) {
    try {
      const errorInfo = this.processError(error, options);
      
      // Add to error queue
      this.addToQueue(errorInfo);
      
      // Log error
      this.logError(errorInfo);
      
      // Notify listeners
      this.notifyListeners(errorInfo);
      
      // Handle recovery if possible
      this.attemptRecovery(errorInfo);
      
      return errorInfo;
    } catch (handlingError) {
      console.error('Error in error handler:', handlingError);
    }
  }

  /**
   * Process and normalize error information
   * @param {Error|string} error - Error to process
   * @param {Object} options - Processing options
   * @returns {Object} Processed error information
   */
  processError(error, options = {}) {
    const errorInfo = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message: '',
      stack: '',
      category: options.category || this.errorCategories.UNKNOWN,
      severity: options.severity || this.severityLevels.MEDIUM,
      context: options.context || 'unknown',
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      retryable: options.retryable !== false,
      userFriendlyMessage: options.userFriendlyMessage || null,
      recoveryActions: options.recoveryActions || [],
      metadata: options.metadata || {},
    };

    // Process error object
    if (error instanceof Error) {
      errorInfo.message = error.message;
      errorInfo.stack = error.stack;
      errorInfo.name = error.name;
      
      // Categorize based on error type
      if (!options.category) {
        errorInfo.category = this.categorizeError(error);
      }
      
      // Determine severity
      if (!options.severity) {
        errorInfo.severity = this.determineSeverity(error);
      }
    } else if (typeof error === 'string') {
      errorInfo.message = error;
    } else {
      errorInfo.message = 'Unknown error occurred';
      errorInfo.metadata.originalError = error;
    }

    // Generate user-friendly message if not provided
    if (!errorInfo.userFriendlyMessage) {
      errorInfo.userFriendlyMessage = this.generateUserFriendlyMessage(errorInfo);
    }

    return errorInfo;
  }

  /**
   * Categorize error based on error object
   * @param {Error} error - Error to categorize
   * @returns {string} Error category
   */
  categorizeError(error) {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('network') || message.includes('fetch') || message.includes('network')) {
      return this.errorCategories.NETWORK;
    }

    if (name.includes('validation') || message.includes('invalid') || message.includes('validation')) {
      return this.errorCategories.VALIDATION;
    }

    if (message.includes('security') || message.includes('unauthorized') || message.includes('forbidden')) {
      return this.errorCategories.SECURITY;
    }

    if (message.includes('storage') || message.includes('quota') || message.includes('localstorage')) {
      return this.errorCategories.STORAGE;
    }

    if (message.includes('ai') || message.includes('api') || message.includes('service')) {
      return this.errorCategories.AI_SERVICE;
    }

    if (message.includes('file') || message.includes('upload') || message.includes('download')) {
      return this.errorCategories.FILE_PROCESSING;
    }

    if (name === 'typeerror' || name === 'referenceerror') {
      return this.errorCategories.SYSTEM;
    }

    return this.errorCategories.UNKNOWN;
  }

  /**
   * Determine error severity
   * @param {Error} error - Error to analyze
   * @returns {string} Severity level
   */
  determineSeverity(error) {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // Critical errors
    if (name === 'securityerror' || message.includes('security')) {
      return this.severityLevels.CRITICAL;
    }

    // High severity errors
    if (name === 'referenceerror' || name === 'typeerror' || message.includes('crash')) {
      return this.severityLevels.HIGH;
    }

    // Low severity errors
    if (name === 'validationerror' || message.includes('validation') || message.includes('input')) {
      return this.severityLevels.LOW;
    }

    // Default to medium
    return this.severityLevels.MEDIUM;
  }

  /**
   * Generate user-friendly error message
   * @param {Object} errorInfo - Error information
   * @returns {string} User-friendly message
   */
  generateUserFriendlyMessage(errorInfo) {
    switch (errorInfo.category) {
      case this.errorCategories.NETWORK:
        return 'Network connection issue. Please check your internet connection and try again.';
      
      case this.errorCategories.VALIDATION:
        return 'Please check your input and try again.';
      
      case this.errorCategories.SECURITY:
        return 'Security validation failed. Please ensure your data is safe and try again.';
      
      case this.errorCategories.STORAGE:
        return 'Storage issue encountered. Your browser storage might be full.';
      
      case this.errorCategories.AI_SERVICE:
        return 'AI service is temporarily unavailable. Falling back to alternative analysis.';
      
      case this.errorCategories.FILE_PROCESSING:
        return 'File processing failed. Please check your file and try again.';
      
      case this.errorCategories.USER_INPUT:
        return 'Invalid input detected. Please review your data and try again.';
      
      case this.errorCategories.SYSTEM:
        return 'A system error occurred. Please refresh the page and try again.';
      
      default:
        return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
    }
  }

  /**
   * Add error to processing queue
   * @param {Object} errorInfo - Error information
   */
  addToQueue(errorInfo) {
    this.errorQueue.push(errorInfo);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * Log error to console and storage
   * @param {Object} errorInfo - Error information
   */
  logError(errorInfo) {
    // Console logging based on severity
    switch (errorInfo.severity) {
      case this.severityLevels.CRITICAL:
        console.error('CRITICAL ERROR:', errorInfo);
        break;
      case this.severityLevels.HIGH:
        console.error('HIGH SEVERITY ERROR:', errorInfo);
        break;
      case this.severityLevels.MEDIUM:
        console.warn('MEDIUM SEVERITY ERROR:', errorInfo);
        break;
      case this.severityLevels.LOW:
        console.info('LOW SEVERITY ERROR:', errorInfo);
        break;
    }

    // Store in local storage for debugging
    try {
      const storedErrors = JSON.parse(localStorage.getItem('error_logs') || '[]');
      storedErrors.push({
        id: errorInfo.id,
        timestamp: errorInfo.timestamp,
        message: errorInfo.message,
        category: errorInfo.category,
        severity: errorInfo.severity,
        context: errorInfo.context,
      });
      
      // Keep only last 50 errors
      if (storedErrors.length > 50) {
        storedErrors.splice(0, storedErrors.length - 50);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(storedErrors));
    } catch (storageError) {
      console.warn('Failed to store error log:', storageError);
    }
  }

  /**
   * Notify error listeners
   * @param {Object} errorInfo - Error information
   */
  notifyListeners(errorInfo) {
    this.listeners.forEach(listener => {
      try {
        listener(errorInfo);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }

  /**
   * Attempt error recovery
   * @param {Object} errorInfo - Error information
   */
  attemptRecovery(errorInfo) {
    if (!errorInfo.retryable) {
      return;
    }

    const retryKey = `${errorInfo.category}_${errorInfo.context}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;

    if (currentRetries >= this.maxRetries) {
      return;
    }

    // Increment retry count
    this.retryAttempts.set(retryKey, currentRetries + 1);

    // Execute recovery actions
    errorInfo.recoveryActions.forEach(action => {
      try {
        if (typeof action === 'function') {
          action(errorInfo);
        }
      } catch (recoveryError) {
        console.error('Error in recovery action:', recoveryError);
      }
    });
  }

  /**
   * Add error listener
   * @param {Function} listener - Error listener function
   */
  addListener(listener) {
    this.listeners.add(listener);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const recentErrors = this.errorQueue.filter(error => 
      new Date(error.timestamp).getTime() > oneHourAgo
    );

    const dailyErrors = this.errorQueue.filter(error => 
      new Date(error.timestamp).getTime() > oneDayAgo
    );

    const categoryCounts = {};
    const severityCounts = {};

    this.errorQueue.forEach(error => {
      categoryCounts[error.category] = (categoryCounts[error.category] || 0) + 1;
      severityCounts[error.severity] = (severityCounts[error.severity] || 0) + 1;
    });

    return {
      total: this.errorQueue.length,
      recentCount: recentErrors.length,
      dailyCount: dailyErrors.length,
      categoryCounts,
      severityCounts,
      retryAttempts: Object.fromEntries(this.retryAttempts),
    };
  }

  /**
   * Clear error queue
   */
  clearErrors() {
    this.errorQueue = [];
    this.retryAttempts.clear();
  }

  /**
   * Get user ID for error tracking
   * @returns {string} User ID
   */
  getUserId() {
    let userId = localStorage.getItem('anonymous_user_id');
    if (!userId) {
      userId = 'anon_' + crypto.randomUUID();
      localStorage.setItem('anonymous_user_id', userId);
    }
    return userId;
  }

  /**
   * Get session ID for error tracking
   * @returns {string} Session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Create error with context
   * @param {string} message - Error message
   * @param {Object} options - Error options
   * @returns {Object} Error information
   */
  createError(message, options = {}) {
    const error = new Error(message);
    return this.handleError(error, options);
  }

  /**
   * Handle async operation with error handling
   * @param {Function} operation - Async operation
   * @param {Object} options - Error handling options
   * @returns {Promise} Operation result or error
   */
  async handleAsync(operation, options = {}) {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, options);
      throw error;
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;