/**
 * User Feedback Collection Service
 * Collects user feedback and satisfaction metrics
 */

import { LocalStorageManager } from '../storage/LocalStorageManager';
import { analyticsService } from './AnalyticsService';

export class FeedbackService {
  constructor() {
    this.feedbackTypes = {
      RATING: 'rating',
      BUG_REPORT: 'bug_report',
      FEATURE_REQUEST: 'feature_request',
      GENERAL: 'general',
      NPS: 'nps', // Net Promoter Score
      SATISFACTION: 'satisfaction'
    };
    
    this.ratingScales = {
      FIVE_STAR: { min: 1, max: 5 },
      TEN_POINT: { min: 1, max: 10 },
      NPS: { min: 0, max: 10 }
    };
  }

  /**
   * Submit user feedback
   */
  submitFeedback(feedbackData) {
    try {
      const feedback = {
        id: this.generateFeedbackId(),
        ...feedbackData,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        userAgent: navigator.userAgent,
        sessionId: analyticsService.sessionId
      };

      // Validate feedback data
      if (!this.validateFeedback(feedback)) {
        throw new Error('Invalid feedback data');
      }

      // Sanitize feedback content
      feedback.content = this.sanitizeFeedbackContent(feedback.content);

      // Store feedback locally
      this.storeFeedback(feedback);

      // Track feedback submission
      analyticsService.trackEvent('feedback_submitted', {
        type: feedback.type,
        rating: feedback.rating,
        feature: feedback.feature
      });

      // Process feedback for insights
      this.processFeedback(feedback);

      return {
        success: true,
        feedbackId: feedback.id,
        message: 'Thank you for your feedback!'
      };
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Submit feature rating
   */
  submitFeatureRating(feature, rating, comment = '') {
    return this.submitFeedback({
      type: this.feedbackTypes.RATING,
      feature,
      rating,
      content: comment,
      scale: this.ratingScales.FIVE_STAR
    });
  }

  /**
   * Submit bug report
   */
  submitBugReport(description, steps = [], severity = 'medium') {
    return this.submitFeedback({
      type: this.feedbackTypes.BUG_REPORT,
      content: description,
      steps,
      severity,
      feature: this.getCurrentFeature()
    });
  }

  /**
   * Submit feature request
   */
  submitFeatureRequest(title, description, priority = 'medium') {
    return this.submitFeedback({
      type: this.feedbackTypes.FEATURE_REQUEST,
      title,
      content: description,
      priority
    });
  }

  /**
   * Submit NPS score
   */
  submitNPSScore(score, reason = '') {
    const category = this.categorizeNPSScore(score);
    
    return this.submitFeedback({
      type: this.feedbackTypes.NPS,
      rating: score,
      content: reason,
      category,
      scale: this.ratingScales.NPS
    });
  }

  /**
   * Submit satisfaction survey
   */
  submitSatisfactionSurvey(responses) {
    return this.submitFeedback({
      type: this.feedbackTypes.SATISFACTION,
      responses,
      overallRating: responses.overall || null
    });
  }

  /**
   * Generate feedback ID
   */
  generateFeedbackId() {
    return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate feedback data
   */
  validateFeedback(feedback) {
    // Required fields
    if (!feedback.type || !Object.values(this.feedbackTypes).includes(feedback.type)) {
      return false;
    }

    // Type-specific validation
    switch (feedback.type) {
      case this.feedbackTypes.RATING:
        if (!feedback.rating || !feedback.feature) return false;
        break;
      case this.feedbackTypes.BUG_REPORT:
        if (!feedback.content) return false;
        break;
      case this.feedbackTypes.FEATURE_REQUEST:
        if (!feedback.title || !feedback.content) return false;
        break;
      case this.feedbackTypes.NPS:
        if (feedback.rating === undefined || feedback.rating < 0 || feedback.rating > 10) return false;
        break;
    }

    return true;
  }

  /**
   * Sanitize feedback content
   */
  sanitizeFeedbackContent(content) {
    if (!content) return '';
    
    // Remove potential sensitive information
    return content
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD]') // Credit card
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
      .replace(/\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/g, '[PHONE]') // Phone
      .substring(0, 1000); // Limit length
  }

  /**
   * Store feedback locally
   */
  storeFeedback(feedback) {
    const manager = new LocalStorageManager();
    const existingFeedback = manager.getItem('user_feedback') || [];
    
    existingFeedback.push(feedback);
    
    // Keep only last 100 feedback items
    const limitedFeedback = existingFeedback.slice(-100);
    
    manager.setItem('user_feedback', limitedFeedback, {
      expiry: 90 * 24 * 60 * 60 * 1000 // 90 days
    });
  }

  /**
   * Process feedback for insights
   */
  processFeedback(feedback) {
    // Update feedback metrics
    this.updateFeedbackMetrics(feedback);
    
    // Trigger alerts for critical feedback
    this.checkCriticalFeedback(feedback);
    
    // Update feature satisfaction scores
    if (feedback.type === this.feedbackTypes.RATING) {
      this.updateFeatureSatisfaction(feedback.feature, feedback.rating);
    }
  }

  /**
   * Update feedback metrics
   */
  updateFeedbackMetrics(feedback) {
    const manager = new LocalStorageManager();
    const metrics = manager.getItem('feedback_metrics') || {
      totalFeedback: 0,
      byType: {},
      byFeature: {},
      averageRating: 0,
      npsScore: 0,
      lastFeedback: null
    };

    metrics.totalFeedback++;
    metrics.lastFeedback = feedback.timestamp;

    // Update by type
    metrics.byType[feedback.type] = (metrics.byType[feedback.type] || 0) + 1;

    // Update by feature
    if (feedback.feature) {
      if (!metrics.byFeature[feedback.feature]) {
        metrics.byFeature[feedback.feature] = { count: 0, totalRating: 0, averageRating: 0 };
      }
      metrics.byFeature[feedback.feature].count++;
      
      if (feedback.rating) {
        metrics.byFeature[feedback.feature].totalRating += feedback.rating;
        metrics.byFeature[feedback.feature].averageRating = 
          metrics.byFeature[feedback.feature].totalRating / metrics.byFeature[feedback.feature].count;
      }
    }

    // Update NPS score
    if (feedback.type === this.feedbackTypes.NPS) {
      this.updateNPSScore(feedback.rating);
    }

    manager.setItem('feedback_metrics', metrics);
  }

  /**
   * Check for critical feedback
   */
  checkCriticalFeedback(feedback) {
    let isCritical = false;
    
    // Critical bug reports
    if (feedback.type === this.feedbackTypes.BUG_REPORT && feedback.severity === 'high') {
      isCritical = true;
    }
    
    // Very low ratings
    if (feedback.rating && feedback.rating <= 2) {
      isCritical = true;
    }
    
    // NPS detractors
    if (feedback.type === this.feedbackTypes.NPS && feedback.rating <= 6) {
      isCritical = true;
    }
    
    if (isCritical) {
      analyticsService.trackEvent('critical_feedback', {
        type: feedback.type,
        rating: feedback.rating,
        feature: feedback.feature
      });
      
      console.warn('Critical feedback received:', feedback);
    }
  }

  /**
   * Update feature satisfaction
   */
  updateFeatureSatisfaction(feature, rating) {
    const manager = new LocalStorageManager();
    const satisfaction = manager.getItem('feature_satisfaction') || {};
    
    if (!satisfaction[feature]) {
      satisfaction[feature] = {
        ratings: [],
        average: 0,
        count: 0
      };
    }
    
    satisfaction[feature].ratings.push({
      rating,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 ratings per feature
    satisfaction[feature].ratings = satisfaction[feature].ratings.slice(-50);
    
    // Calculate new average
    const ratings = satisfaction[feature].ratings.map(r => r.rating);
    satisfaction[feature].average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    satisfaction[feature].count = ratings.length;
    
    manager.setItem('feature_satisfaction', satisfaction);
  }

  /**
   * Update NPS score
   */
  updateNPSScore(score) {
    const manager = new LocalStorageManager();
    const npsData = manager.getItem('nps_data') || {
      scores: [],
      promoters: 0,
      passives: 0,
      detractors: 0,
      npsScore: 0
    };
    
    npsData.scores.push({
      score,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 NPS scores
    npsData.scores = npsData.scores.slice(-100);
    
    // Recalculate NPS
    const scores = npsData.scores.map(s => s.score);
    npsData.promoters = scores.filter(s => s >= 9).length;
    npsData.passives = scores.filter(s => s >= 7 && s <= 8).length;
    npsData.detractors = scores.filter(s => s <= 6).length;
    
    const total = scores.length;
    npsData.npsScore = total > 0 ? 
      ((npsData.promoters - npsData.detractors) / total) * 100 : 0;
    
    manager.setItem('nps_data', npsData);
  }

  /**
   * Categorize NPS score
   */
  categorizeNPSScore(score) {
    if (score >= 9) return 'promoter';
    if (score >= 7) return 'passive';
    return 'detractor';
  }

  /**
   * Get current feature from URL
   */
  getCurrentFeature() {
    const path = window.location.pathname;
    if (path.includes('ats-checker')) return 'ats-checker';
    if (path.includes('career')) return 'career';
    if (path.includes('interview')) return 'interview-prep';
    if (path.includes('templates')) return 'templates';
    if (path.includes('job-analysis')) return 'job-analysis';
    return 'general';
  }

  /**
   * Get feedback summary
   */
  getFeedbackSummary() {
    const manager = new LocalStorageManager();
    const metrics = manager.getItem('feedback_metrics') || {};
    const satisfaction = manager.getItem('feature_satisfaction') || {};
    const npsData = manager.getItem('nps_data') || {};
    
    return {
      totalFeedback: metrics.totalFeedback || 0,
      byType: metrics.byType || {},
      featureSatisfaction: satisfaction,
      npsScore: npsData.npsScore || 0,
      npsBreakdown: {
        promoters: npsData.promoters || 0,
        passives: npsData.passives || 0,
        detractors: npsData.detractors || 0
      },
      lastFeedback: metrics.lastFeedback
    };
  }

  /**
   * Get recent feedback
   */
  getRecentFeedback(limit = 10) {
    const manager = new LocalStorageManager();
    const feedback = manager.getItem('user_feedback') || [];
    
    return feedback
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Export feedback data
   */
  exportFeedbackData() {
    const manager = new LocalStorageManager();
    
    return {
      feedback: manager.getItem('user_feedback') || [],
      metrics: manager.getItem('feedback_metrics') || {},
      satisfaction: manager.getItem('feature_satisfaction') || {},
      npsData: manager.getItem('nps_data') || {},
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear feedback data
   */
  clearFeedbackData() {
    const manager = new LocalStorageManager();
    manager.removeItem('user_feedback');
    manager.removeItem('feedback_metrics');
    manager.removeItem('feature_satisfaction');
    manager.removeItem('nps_data');
    
    console.log('Feedback data cleared');
  }

  /**
   * Show feedback prompt based on user behavior
   */
  shouldShowFeedbackPrompt() {
    const manager = new LocalStorageManager();
    const lastPrompt = manager.getItem('last_feedback_prompt');
    const sessionMetrics = manager.getItem('session_metrics') || {};
    
    // Don't show if prompted recently (within 7 days)
    if (lastPrompt && Date.now() - new Date(lastPrompt).getTime() < 7 * 24 * 60 * 60 * 1000) {
      return false;
    }
    
    // Show after significant usage
    const shouldShow = 
      sessionMetrics.eventCount > 20 || // Active session
      sessionMetrics.conversions > 1 || // Multiple conversions
      Object.keys(sessionMetrics.features || {}).length > 2; // Used multiple features
    
    if (shouldShow) {
      manager.setItem('last_feedback_prompt', new Date().toISOString());
    }
    
    return shouldShow;
  }
}

// Create singleton instance
export const feedbackService = new FeedbackService();

export default FeedbackService;