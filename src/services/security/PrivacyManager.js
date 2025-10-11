/**
 * Privacy Manager
 * Handles GDPR compliance, consent management, and privacy controls
 */

import SecureStorageManager from './SecureStorageManager.js';

class PrivacyManager {
  constructor() {
    this.storageManager = new SecureStorageManager();
    this.consentKey = 'privacy_consent';
    this.preferencesKey = 'privacy_preferences';
    this.initialized = false;
  }

  /**
   * Initialize privacy manager
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      await this.storageManager.initialize();
      this.initialized = true;
      
      // Clean expired data on initialization
      await this.storageManager.cleanExpiredData();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize privacy manager:', error);
      return false;
    }
  }

  /**
   * Check if user has given consent
   * @returns {Promise<Object>} Consent status
   */
  async getConsentStatus() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const consent = await this.storageManager.getSecureItem(this.consentKey);
      
      if (!consent) {
        return {
          hasConsent: false,
          consentDate: null,
          consentVersion: null,
          categories: {},
        };
      }

      return {
        hasConsent: true,
        consentDate: consent.date,
        consentVersion: consent.version,
        categories: consent.categories || {},
      };
    } catch (error) {
      console.error('Failed to get consent status:', error);
      return { hasConsent: false, consentDate: null, consentVersion: null, categories: {} };
    }
  }

  /**
   * Record user consent
   * @param {Object} consentData - Consent information
   * @returns {Promise<boolean>} Success status
   */
  async recordConsent(consentData) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const consent = {
        date: new Date().toISOString(),
        version: '1.0',
        categories: {
          essential: true, // Always required
          analytics: consentData.analytics || false,
          marketing: consentData.marketing || false,
          personalization: consentData.personalization || false,
        },
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
      };

      await this.storageManager.setSecureItem(this.consentKey, consent, {
        type: 'consent',
        sensitive: true,
      });

      return true;
    } catch (error) {
      console.error('Failed to record consent:', error);
      return false;
    }
  }

  /**
   * Update consent preferences
   * @param {Object} preferences - Updated preferences
   * @returns {Promise<boolean>} Success status
   */
  async updateConsentPreferences(preferences) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const currentConsent = await this.storageManager.getSecureItem(this.consentKey);
      
      if (!currentConsent) {
        throw new Error('No existing consent found');
      }

      const updatedConsent = {
        ...currentConsent,
        categories: {
          essential: true, // Always required
          analytics: preferences.analytics || false,
          marketing: preferences.marketing || false,
          personalization: preferences.personalization || false,
        },
        lastUpdated: new Date().toISOString(),
      };

      await this.storageManager.setSecureItem(this.consentKey, updatedConsent, {
        type: 'consent',
        sensitive: true,
      });

      return true;
    } catch (error) {
      console.error('Failed to update consent preferences:', error);
      return false;
    }
  }

  /**
   * Get privacy preferences
   * @returns {Promise<Object>} Privacy preferences
   */
  async getPrivacyPreferences() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const preferences = await this.storageManager.getSecureItem(this.preferencesKey);
      
      return preferences || {
        dataRetention: 30, // days
        shareWithThirdParties: false,
        allowAnalytics: false,
        allowMarketing: false,
        allowPersonalization: false,
        autoDeleteExpired: true,
      };
    } catch (error) {
      console.error('Failed to get privacy preferences:', error);
      return {};
    }
  }

  /**
   * Update privacy preferences
   * @param {Object} preferences - New preferences
   * @returns {Promise<boolean>} Success status
   */
  async updatePrivacyPreferences(preferences) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const currentPreferences = await this.getPrivacyPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences,
        lastUpdated: new Date().toISOString(),
      };

      await this.storageManager.setSecureItem(this.preferencesKey, updatedPreferences, {
        type: 'preferences',
        sensitive: false,
      });

      return true;
    } catch (error) {
      console.error('Failed to update privacy preferences:', error);
      return false;
    }
  }

  /**
   * Export all user data (GDPR Article 20)
   * @returns {Promise<Object>} Exported data
   */
  async exportUserData() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const exportData = await this.storageManager.exportAllData();
      
      // Add privacy-specific information
      exportData.privacyInfo = {
        consentStatus: await this.getConsentStatus(),
        preferences: await this.getPrivacyPreferences(),
        dataCategories: await this.getDataCategories(),
      };

      return exportData;
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * Delete all user data (GDPR Article 17 - Right to be forgotten)
   * @returns {Promise<boolean>} Success status
   */
  async deleteAllUserData() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const success = await this.storageManager.deleteAllData();
      
      if (success) {
        // Log deletion for compliance
        console.log('User data deletion completed:', new Date().toISOString());
      }

      return success;
    } catch (error) {
      console.error('Failed to delete user data:', error);
      return false;
    }
  }

  /**
   * Get data categories and their purposes
   * @returns {Promise<Array>} Data categories
   */
  async getDataCategories() {
    try {
      const dataKeys = await this.storageManager.getAllDataKeys();
      
      const categories = {
        essential: [],
        analytics: [],
        personalization: [],
        temporary: [],
      };

      dataKeys.forEach(keyInfo => {
        switch (keyInfo.type) {
          case 'resume_data':
          case 'user_profile':
          case 'preferences':
            categories.essential.push({
              key: keyInfo.key,
              purpose: 'Core application functionality',
              retention: 'Until user deletion',
            });
            break;
          case 'analytics':
            categories.analytics.push({
              key: keyInfo.key,
              purpose: 'Usage analytics and improvement',
              retention: '30 days',
            });
            break;
          case 'personalization':
            categories.personalization.push({
              key: keyInfo.key,
              purpose: 'Personalized recommendations',
              retention: '90 days',
            });
            break;
          default:
            categories.temporary.push({
              key: keyInfo.key,
              purpose: 'Temporary processing',
              retention: '7 days',
            });
        }
      });

      return categories;
    } catch (error) {
      console.error('Failed to get data categories:', error);
      return {};
    }
  }

  /**
   * Check if consent is required for a specific action
   * @param {string} category - Data category
   * @returns {Promise<boolean>} Whether consent is required
   */
  async requiresConsent(category) {
    const consentStatus = await this.getConsentStatus();
    
    if (!consentStatus.hasConsent) {
      return true;
    }

    switch (category) {
      case 'essential':
        return false; // Essential data doesn't require explicit consent
      case 'analytics':
        return !consentStatus.categories.analytics;
      case 'marketing':
        return !consentStatus.categories.marketing;
      case 'personalization':
        return !consentStatus.categories.personalization;
      default:
        return true;
    }
  }

  /**
   * Get client IP address (for consent logging)
   * @returns {Promise<string>} IP address
   */
  async getClientIP() {
    try {
      // Use a privacy-friendly IP detection service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Generate privacy report
   * @returns {Promise<Object>} Privacy report
   */
  async generatePrivacyReport() {
    try {
      const consentStatus = await this.getConsentStatus();
      const preferences = await this.getPrivacyPreferences();
      const dataCategories = await this.getDataCategories();
      const dataKeys = await this.storageManager.getAllDataKeys();

      return {
        reportDate: new Date().toISOString(),
        consentStatus,
        preferences,
        dataCategories,
        dataInventory: {
          totalItems: dataKeys.length,
          sensitiveItems: dataKeys.filter(k => k.sensitive).length,
          expiredItems: dataKeys.filter(k => k.expiresAt && Date.now() > k.expiresAt).length,
        },
        complianceStatus: {
          hasValidConsent: consentStatus.hasConsent,
          dataMinimization: true, // We only store necessary data
          purposeLimitation: true, // Data used only for stated purposes
          storageMinimization: preferences.autoDeleteExpired,
        },
      };
    } catch (error) {
      console.error('Failed to generate privacy report:', error);
      throw error;
    }
  }
}

export default PrivacyManager;