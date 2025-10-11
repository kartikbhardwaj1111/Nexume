/**
 * Error Handler Hook
 * React hook for error handling, user feedback, and recovery
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import errorHandler from '../services/error/ErrorHandler';

const useErrorHandler = (options = {}) => {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const listenerRef = useRef(null);

  const {
    maxRetries = 3,
    retryDelay = 1000,
    showUserFeedback = true,
    category = 'unknown',
    context = 'component',
  } = options;

  // Set up error listener
  useEffect(() => {
    if (listenerRef.current) {
      listenerRef.current();
    }

    listenerRef.current = errorHandler.addListener((errorInfo) => {
      if (errorInfo.category === category || category === 'all') {
        setErrors(prev => [errorInfo, ...prev.slice(0, 9)]); // Keep last 10 errors
      }
    });

    return () => {
      if (listenerRef.current) {
        listenerRef.current();
      }
    };
  }, [category]);

  /**
   * Handle error with automatic retry logic
   */
  const handleError = useCallback(async (error, errorOptions = {}) => {
    const errorInfo = errorHandler.handleError(error, {
      category,
      context,
      ...errorOptions,
    });

    if (showUserFeedback) {
      setErrors(prev => [errorInfo, ...prev.slice(0, 9)]);
    }

    return errorInfo;
  }, [category, context, showUserFeedback]);

  /**
   * Execute async operation with error handling and retry logic
   */
  const executeWithRetry = useCallback(async (operation, operationOptions = {}) => {
    const {
      maxRetries: opMaxRetries = maxRetries,
      retryDelay: opRetryDelay = retryDelay,
      retryCondition = () => true,
      onRetry = () => {},
      onSuccess = () => {},
      onFailure = () => {},
    } = operationOptions;

    setIsLoading(true);
    setRetryCount(0);

    let lastError = null;
    let attempt = 0;

    while (attempt <= opMaxRetries) {
      try {
        const result = await operation();
        setIsLoading(false);
        setRetryCount(0);
        onSuccess(result);
        return result;
      } catch (error) {
        lastError = error;
        attempt++;

        const errorInfo = await handleError(error, {
          retryable: attempt <= opMaxRetries,
          metadata: { attempt, maxRetries: opMaxRetries },
        });

        if (attempt <= opMaxRetries && retryCondition(error, attempt)) {
          setRetryCount(attempt);
          onRetry(error, attempt);
          
          // Wait before retry
          if (opRetryDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, opRetryDelay * attempt));
          }
        } else {
          break;
        }
      }
    }

    setIsLoading(false);
    onFailure(lastError);
    throw lastError;
  }, [maxRetries, retryDelay, handleError]);

  /**
   * Clear specific error
   */
  const clearError = useCallback((errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setRetryCount(0);
  }, []);

  /**
   * Retry last failed operation
   */
  const retryLastOperation = useCallback((operation) => {
    if (retryCount < maxRetries) {
      return executeWithRetry(operation);
    }
    return Promise.reject(new Error('Maximum retry attempts exceeded'));
  }, [retryCount, maxRetries, executeWithRetry]);

  /**
   * Get error by ID
   */
  const getError = useCallback((errorId) => {
    return errors.find(error => error.id === errorId);
  }, [errors]);

  /**
   * Get errors by category
   */
  const getErrorsByCategory = useCallback((errorCategory) => {
    return errors.filter(error => error.category === errorCategory);
  }, [errors]);

  /**
   * Get errors by severity
   */
  const getErrorsBySeverity = useCallback((severity) => {
    return errors.filter(error => error.severity === severity);
  }, [errors]);

  /**
   * Check if there are any critical errors
   */
  const hasCriticalErrors = useCallback(() => {
    return errors.some(error => error.severity === 'critical');
  }, [errors]);

  /**
   * Check if there are any recent errors (last 5 minutes)
   */
  const hasRecentErrors = useCallback(() => {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    return errors.some(error => 
      new Date(error.timestamp).getTime() > fiveMinutesAgo
    );
  }, [errors]);

  /**
   * Get error statistics
   */
  const getErrorStats = useCallback(() => {
    const stats = {
      total: errors.length,
      bySeverity: {},
      byCategory: {},
      recent: 0,
    };

    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    errors.forEach(error => {
      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      
      // Count by category
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
      
      // Count recent errors
      if (new Date(error.timestamp).getTime() > oneHourAgo) {
        stats.recent++;
      }
    });

    return stats;
  }, [errors]);

  return {
    // State
    errors,
    isLoading,
    retryCount,
    
    // Actions
    handleError,
    executeWithRetry,
    clearError,
    clearAllErrors,
    retryLastOperation,
    
    // Getters
    getError,
    getErrorsByCategory,
    getErrorsBySeverity,
    getErrorStats,
    
    // Checks
    hasCriticalErrors,
    hasRecentErrors,
    hasErrors: errors.length > 0,
    
    // Utils
    errorHandler,
  };
};

/**
 * Hook for handling form errors specifically
 */
export const useFormErrorHandler = (formName = 'form') => {
  const {
    errors,
    handleError,
    clearError,
    clearAllErrors,
    getErrorsByCategory,
  } = useErrorHandler({
    category: 'validation',
    context: formName,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Handle field-specific error
   */
  const handleFieldError = useCallback((fieldName, error, value = null) => {
    const errorInfo = handleError(error, {
      metadata: { fieldName, value },
      userFriendlyMessage: `Invalid ${fieldName}: ${error.message}`,
    });

    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorInfo,
    }));

    return errorInfo;
  }, [handleError]);

  /**
   * Clear field error
   */
  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const updated = { ...prev };
      if (updated[fieldName]) {
        clearError(updated[fieldName].id);
        delete updated[fieldName];
      }
      return updated;
    });
  }, [clearError]);

  /**
   * Clear all field errors
   */
  const clearAllFieldErrors = useCallback(() => {
    Object.values(fieldErrors).forEach(error => {
      if (error && error.id) {
        clearError(error.id);
      }
    });
    setFieldErrors({});
  }, [fieldErrors, clearError]);

  /**
   * Validate field with error handling
   */
  const validateField = useCallback(async (fieldName, validator, value) => {
    try {
      clearFieldError(fieldName);
      const result = await validator(value);
      return result;
    } catch (error) {
      handleFieldError(fieldName, error, value);
      throw error;
    }
  }, [clearFieldError, handleFieldError]);

  return {
    // State
    errors,
    fieldErrors,
    
    // Actions
    handleError,
    handleFieldError,
    clearError,
    clearFieldError,
    clearAllErrors,
    clearAllFieldErrors,
    validateField,
    
    // Getters
    getErrorsByCategory,
    
    // Checks
    hasErrors: errors.length > 0,
    hasFieldErrors: Object.keys(fieldErrors).length > 0,
  };
};

/**
 * Hook for handling async operations with loading states
 */
export const useAsyncErrorHandler = (options = {}) => {
  const {
    handleError,
    executeWithRetry,
    isLoading,
    retryCount,
    clearAllErrors,
  } = useErrorHandler(options);

  const [operationState, setOperationState] = useState({
    data: null,
    error: null,
    isSuccess: false,
    isError: false,
  });

  /**
   * Execute async operation with state management
   */
  const execute = useCallback(async (operation, operationOptions = {}) => {
    setOperationState({
      data: null,
      error: null,
      isSuccess: false,
      isError: false,
    });

    try {
      const result = await executeWithRetry(operation, operationOptions);
      setOperationState({
        data: result,
        error: null,
        isSuccess: true,
        isError: false,
      });
      return result;
    } catch (error) {
      setOperationState({
        data: null,
        error,
        isSuccess: false,
        isError: true,
      });
      throw error;
    }
  }, [executeWithRetry]);

  /**
   * Reset operation state
   */
  const reset = useCallback(() => {
    setOperationState({
      data: null,
      error: null,
      isSuccess: false,
      isError: false,
    });
    clearAllErrors();
  }, [clearAllErrors]);

  return {
    // State
    ...operationState,
    isLoading,
    retryCount,
    
    // Actions
    execute,
    reset,
    handleError,
    
    // Checks
    isIdle: !isLoading && !operationState.isSuccess && !operationState.isError,
  };
};

export default useErrorHandler;