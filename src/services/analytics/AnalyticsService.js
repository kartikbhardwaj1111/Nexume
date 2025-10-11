/**
 * Privacy-Compliant Analytics Service
 * Tracks feature usage and performance without collecting personal data
 */

import { LocalStorageManager } from '../storage/LocalStorageManager';

export class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.isEnabled = this.checkAnalyticsConsent();
    
    // Initialize session
    if (this.isEnabled) {
      this.trackEvent('session_start', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if user has consented to analytics
   */
  checkAnalyticsConsent() {
    const preferences = LocalStorageManager.getUserPreferences();
    return preferences.analyticsConsent !== false; // Default to true (opt-out)
  }

  /**
   * Set analytics consent
   */
  setAnalyticsConsent(consent) {
    LocalStorageManager.saveUserPreferences({ analyticsConsent: consent });
    this.isEnabled = consent;
    
    if (!consent) {
      // Clear existing analytics data
      this.clearAnalyticsData();
    }
  }

  /**
   * Track feature usage event
   */
  trackEvent(eventName, properties = {}) {
    if (!this.isEnabled) return;

    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.sessionId,
      eventName,
      properties: this.sanitizeProperties(properties),
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      referrer: document.referrer || null
    };

    this.events.push(event);
    this.saveEvent(event);
    
    // Trigger real-time analytics if needed
    this.processEvent(event);
  }

  /**
   * Track page view
   */
  trackPageView(pageName, properties = {}) {
    this.trackEvent('page_view', {
      pageName,
      ...properties
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName, action, properties = {}) {
    this.trackEvent('feature_usage', {
      feature: featureName,
      action,
      ...properties
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName, value, properties = {}) {
    this.trackEvent('performance_metric', {
      metric: metricName,
      value,
      ...properties
    });
  }

  /**
   * Track user flow
   */
  trackUserFlow(flowName, step, properties = {}) {
    this.trackEvent('user_flow', {
      flow: flowName,
      step,
      ...properties
    });
  }

  /**
   * Track errors (without sensitive data)
   */
  trackError(errorType, errorMessage, properties = {}) {
    // Sanitize error message to remove potential sensitive data
    const sanitizedMessage = this.sanitizeErrorMessage(errorMessage);
    
    this.trackEvent('error', {
      errorType,
      errorMessage: sanitizedMessage,
      ...properties
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(conversionType, properties = {}) {
    this.trackEvent('conversion', {
      type: conversionType,
      ...properties
    });
  }

  /**
   * Sanitize properties to remove sensitive data
   */
  sanitizeProperties(properties) {
    const sanitized = { ...properties };
    
    // Remove or hash sensitive fields
    const sensitiveFields = ['email', 'name', 'phone', 'address', 'ssn', 'password'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        delete sanitized[key];
      }
      
      // Truncate long strings that might contain sensitive data
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100) + '...';
      }
    });
    
    return sanitized;
  }

  /**
   * Sanitize error messages
   */
  sanitizeErrorMessage(message) {
    if (!message) return 'Unknown error';
    
    // Remove potential file paths, URLs, and other sensitive data
    return message
      .replace(/\/[^\s]+/g, '[PATH]') // Remove file paths
      .replace(/https?:\/\/[^\s]+/g, '[URL]') // Remove URLs
      .replace(/\b\d{3,}\b/g, '[NUMBER]') // Replace long numbers
      .substring(0, 200); // Limit length
  }

  /**
   * Save event to local storage
   */
  saveEvent(event) {
    try {
      const manager = new LocalStorageManager();
      const existingEvents = manager.getItem('analytics_events') || [];
      
      existingEvents.push(event);
      
      // Keep only last 1000 events to prevent storage bloat
      const limitedEvents = existingEvents.slice(-1000);
      
      manager.setItem('analytics_events', limitedEvents, {
        expiry: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    } catch (error) {
      console.warn('Failed to save analytics event:', error);
    }
  }

  /**
   * Process event for real-time analytics
   */
  processEvent(event) {
    // Update real-time metrics
    this.updateSessionMetrics(event);
    
    // Trigger any real-time handlers
    this.triggerEventHandlers(event);
  }

  /**
   * Update session metrics
   */
  updateSessionMetrics(event) {
    const manager = new LocalStorageManager();
    const sessionMetrics = manager.getItem('session_metrics') || {
      sessionId: this.sessionId,
      startTime: this.startTime,
      eventCount: 0,
      features: {},
      pages: {},
      errors: 0,
      conversions: 0
    };

    sessionMetrics.eventCount++;
    sessionMetrics.lastActivity = Date.now();

    // Update feature usage
    if (event.eventName === 'feature_usage') {
      const feature = event.properties.feature;
      sessionMetrics.features[feature] = (sessionMetrics.features[feature] || 0) + 1;
    }

    // Update page views
    if (event.eventName === 'page_view') {
      const page = event.properties.pageName;
      sessionMetrics.pages[page] = (sessionMetrics.pages[page] || 0) + 1;
    }

    // Update error count
    if (event.eventName === 'error') {
      sessionMetrics.errors++;
    }

    // Update conversion count
    if (event.eventName === 'conversion') {
      sessionMetrics.conversions++;
    }

    manager.setItem('session_metrics', sessionMetrics);
  }

  /**
   * Trigger event handlers
   */
  triggerEventHandlers(event) {
    // Performance monitoring
    if (event.eventName === 'performance_metric') {
      this.handlePerformanceMetric(event);
    }

    // Error monitoring
    if (event.eventName === 'error') {
      this.handleError(event);
    }

    // Feature usage insights
    if (event.eventName === 'feature_usage') {
      this.handleFeatureUsage(event);
    }
  }

  /**
   * Handle performance metrics
   */
  handlePerformanceMetric(event) {
    const { metric, value } = event.properties;
    
    // Alert on poor performance
    if (metric === 'page_load_time' && value > 5000) {
      console.warn('Slow page load detected:', value + 'ms');
    }
    
    if (metric === 'api_response_time' && value > 10000) {
      console.warn('Slow API response detected:', value + 'ms');
    }
  }

  /**
   * Handle errors
   */
  handleError(event) {
    const { errorType, errorMessage } = event.properties;
    
    // Log critical errors
    if (errorType === 'critical') {
      console.error('Critical error tracked:', errorMessage);
    }
    
    // Update error rate metrics
    this.updateErrorRate();
  }

  /**
   * Handle feature usage
   */
  handleFeatureUsage(event) {
    const { feature, action } = event.properties;
    
    // Track feature adoption
    this.updateFeatureAdoption(feature, action);
    
    // Trigger feature-specific analytics
    this.triggerFeatureAnalytics(feature, action);
  }

  /**
   * Update error rate
   */
  updateErrorRate() {
    const manager = new LocalStorageManager();
    const errorMetrics = manager.getItem('error_metrics') || {
      totalErrors: 0,
      errorsByType: {},
      lastError: null
    };

    errorMetrics.totalErrors++;
    errorMetrics.lastError = new Date().toISOString();

    manager.setItem('error_metrics', errorMetrics);
  }

  /**
   * Update feature adoption metrics
   */
  updateFeatureAdoption(feature, action) {
    const manager = new LocalStorageManager();
    const adoptionMetrics = manager.getItem('feature_adoption') || {};

    if (!adoptionMetrics[feature]) {
      adoptionMetrics[feature] = {
        firstUsed: new Date().toISOString(),
        totalUsage: 0,
        actions: {}
      };
    }

    adoptionMetrics[feature].totalUsage++;
    adoptionMetrics[feature].lastUsed = new Date().toISOString();
    adoptionMetrics[feature].actions[action] = (adoptionMetrics[feature].actions[action] || 0) + 1;

    manager.setItem('feature_adoption', adoptionMetrics);
  }

  /**
   * Trigger feature-specific analytics
   */
  triggerFeatureAnalytics(feature, action) {
    // Resume analysis completion
    if (feature === 'ats-checker' && action === 'analysis_complete') {
      this.trackConversion('resume_analyzed');
    }

    // Template usage
    if (feature === 'templates' && action === 'template_downloaded') {
      this.trackConversion('template_used');
    }

    // Interview completion
    if (feature === 'interview-prep' && action === 'session_complete') {
      this.trackConversion('interview_practiced');
    }

    // Career analysis
    if (feature === 'career' && action === 'roadmap_generated') {
      this.trackConversion('career_planned');
    }
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    if (!this.isEnabled) {
      return { enabled: false };
    }

    const manager = new LocalStorageManager();
    const sessionMetrics = manager.getItem('session_metrics') || {};
    const featureAdoption = manager.getItem('feature_adoption') || {};
    const errorMetrics = manager.getItem('error_metrics') || {};

    return {
      enabled: true,
      session: {
        id: this.sessionId,
        duration: Date.now() - this.startTime,
        eventCount: sessionMetrics.eventCount || 0,
        features: sessionMetrics.features || {},
        pages: sessionMetrics.pages || {},
        errors: sessionMetrics.errors || 0,
        conversions: sessionMetrics.conversions || 0
      },
      adoption: featureAdoption,
      errors: errorMetrics,
      consent: this.isEnabled
    };
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData() {
    if (!this.isEnabled) return null;

    const manager = new LocalStorageManager();
    return {
      events: manager.getItem('analytics_events') || [],
      sessionMetrics: manager.getItem('session_metrics') || {},
      featureAdoption: manager.getItem('feature_adoption') || {},
      errorMetrics: manager.getItem('error_metrics') || {},
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear all analytics data
   */
  clearAnalyticsData() {
    const manager = new LocalStorageManager();
    manager.removeItem('analytics_events');
    manager.removeItem('session_metrics');
    manager.removeItem('feature_adoption');
    manager.removeItem('error_metrics');
    
    this.events = [];
    console.log('Analytics data cleared');
  }

  /**
   * End session
   */
  endSession() {
    if (this.isEnabled) {
      this.trackEvent('session_end', {
        duration: Date.now() - this.startTime,
        eventCount: this.events.length
      });
    }
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

export default AnalyticsService;