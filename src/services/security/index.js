/**
 * Security Services Index
 * Centralized exports for all security-related services and components
 */

// Core Security Services
export { default as EncryptionService } from './EncryptionService.js';
export { default as SecureStorageManager } from './SecureStorageManager.js';
export { default as PrivacyManager } from './PrivacyManager.js';
export { default as InputValidator } from './InputValidator.js';
export { default as FileSecurityManager } from './FileSecurityManager.js';

// Error Handling Services
export { default as ErrorBoundary } from '../error/ErrorBoundary.jsx';
export { default as errorHandler } from '../error/ErrorHandler.js';

// React Components
export { default as PrivacyConsent } from '../../components/PrivacyConsent.jsx';
export { default as PrivacyPolicy } from '../../components/PrivacyPolicy.jsx';
export { default as SystemStatus } from '../../components/SystemStatus.jsx';

// React Hooks
export { default as useSecureInput, useSecureFileUpload, useSecureForm } from '../../hooks/useSecureInput.js';
export { default as useErrorHandler, useFormErrorHandler, useAsyncErrorHandler } from '../../hooks/useErrorHandler.js';

/**
 * Security Configuration
 */
export const SecurityConfig = {
  // Encryption settings
  encryption: {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12,
  },
  
  // File upload limits
  fileUpload: {
    maxSize: {
      resume: 10 * 1024 * 1024, // 10MB
      image: 5 * 1024 * 1024,   // 5MB
      general: 25 * 1024 * 1024, // 25MB
    },
    allowedTypes: {
      resume: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/rtf',
      ],
      image: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ],
    },
  },
  
  // Privacy settings
  privacy: {
    dataRetentionDays: {
      essential: -1, // Never expire
      analytics: 30,
      temporary: 7,
      personalization: 90,
    },
    consentVersion: '1.0',
    gdprCompliant: true,
  },
  
  // Error handling settings
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000,
    maxErrorQueue: 100,
    maxStoredErrors: 50,
  },
  
  // Input validation settings
  validation: {
    maxTextLength: 10000,
    maxUrlLength: 2048,
    maxFileNameLength: 255,
    xssProtection: true,
    sqlInjectionProtection: true,
  },
};

/**
 * Security Utilities
 */
export const SecurityUtils = {
  /**
   * Initialize security services
   */
  async initializeSecurity() {
    try {
      // Initialize privacy manager
      const privacyManager = new PrivacyManager();
      await privacyManager.initialize();
      
      // Set up global error handling
      errorHandler; // This initializes the singleton
      
      // Clean up expired data
      await privacyManager.storageManager.cleanExpiredData();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize security services:', error);
      return false;
    }
  },
  
  /**
   * Check security compliance
   */
  async checkCompliance() {
    try {
      const privacyManager = new PrivacyManager();
      await privacyManager.initialize();
      
      const report = await privacyManager.generatePrivacyReport();
      
      return {
        compliant: report.complianceStatus.hasValidConsent &&
                  report.complianceStatus.dataMinimization &&
                  report.complianceStatus.purposeLimitation &&
                  report.complianceStatus.storageMinimization,
        report,
      };
    } catch (error) {
      console.error('Failed to check compliance:', error);
      return { compliant: false, error: error.message };
    }
  },
  
  /**
   * Sanitize user input
   */
  sanitizeInput(input, type = 'safeText', options = {}) {
    const validator = new InputValidator();
    const validation = validator.validateText(input, type, options);
    return validation.sanitizedText;
  },
  
  /**
   * Validate file securely
   */
  async validateFile(file, category = 'general') {
    const fileSecurityManager = new FileSecurityManager();
    return await fileSecurityManager.validateFileSecurely(file, category);
  },
  
  /**
   * Generate secure ID
   */
  generateSecureId() {
    return crypto.randomUUID();
  },
  
  /**
   * Hash sensitive data
   */
  async hashData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
};

/**
 * Security Middleware for React Components
 */
export const withSecurity = (WrappedComponent, securityOptions = {}) => {
  return function SecurityWrappedComponent(props) {
    const {
      requireConsent = false,
      validateInput = false,
      errorBoundary = true,
    } = securityOptions;

    let component = <WrappedComponent {...props} />;

    // Wrap with error boundary if requested
    if (errorBoundary) {
      component = <ErrorBoundary>{component}</ErrorBoundary>;
    }

    // Add consent check if required
    if (requireConsent) {
      // This would need to be implemented based on your consent flow
      // For now, just return the component
    }

    return component;
  };
};

export default {
  SecurityConfig,
  SecurityUtils,
  withSecurity,
};