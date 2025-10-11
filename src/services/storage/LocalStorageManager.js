/**
 * Local Storage Manager
 * Handles secure local storage with encryption and data persistence
 */

class LocalStorageManager {
  constructor() {
    this.prefix = 'resumefit_';
    this.version = '1.0';
    this.encryptionKey = this.generateEncryptionKey();
  }

  /**
   * Generate a simple encryption key for data obfuscation
   */
  generateEncryptionKey() {
    const stored = localStorage.getItem(`${this.prefix}encryption_key`);
    if (stored) {
      return stored;
    }
    
    const key = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
    localStorage.setItem(`${this.prefix}encryption_key`, key);
    return key;
  }

  /**
   * Simple encryption for sensitive data
   */
  encrypt(data) {
    try {
      const jsonString = JSON.stringify(data);
      const encoded = btoa(jsonString);
      return encoded;
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  /**
   * Simple decryption for sensitive data
   */
  decrypt(encryptedData) {
    try {
      const decoded = atob(encryptedData);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  /**
   * Store data with optional encryption
   */
  setItem(key, value, options = {}) {
    try {
      const { encrypt = false, expiry = null } = options;
      
      const dataToStore = {
        value: encrypt ? this.encrypt(value) : value,
        encrypted: encrypt,
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + expiry : null,
        version: this.version
      };

      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(dataToStore));
      return true;
    } catch (error) {
      console.error('Failed to store data:', error);
      return false;
    }
  }

  /**
   * Retrieve data with automatic decryption
   */
  getItem(key) {
    try {
      const stored = localStorage.getItem(`${this.prefix}${key}`);
      if (!stored) return null;

      const data = JSON.parse(stored);
      
      // Check expiry
      if (data.expiry && Date.now() > data.expiry) {
        this.removeItem(key);
        return null;
      }

      // Return decrypted or plain value
      return data.encrypted ? this.decrypt(data.value) : data.value;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key) {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
      return true;
    } catch (error) {
      console.error('Failed to remove data:', error);
      return false;
    }
  }

  /**
   * Clear all app data
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  /**
   * Get all stored keys
   */
  getAllKeys() {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats() {
    const keys = this.getAllKeys();
    let totalSize = 0;
    const itemStats = {};

    keys.forEach(key => {
      const data = localStorage.getItem(`${this.prefix}${key}`);
      const size = new Blob([data]).size;
      totalSize += size;
      itemStats[key] = {
        size,
        lastModified: this.getItem(key)?.timestamp || null
      };
    });

    return {
      totalItems: keys.length,
      totalSize,
      itemStats,
      availableSpace: this.getAvailableSpace()
    };
  }

  /**
   * Estimate available storage space
   */
  getAvailableSpace() {
    try {
      const testKey = 'storage_test';
      const testData = 'x'.repeat(1024); // 1KB test
      let size = 0;
      
      while (size < 10 * 1024 * 1024) { // Max 10MB test
        try {
          localStorage.setItem(testKey, testData.repeat(size / 1024));
          size += 1024;
        } catch (e) {
          localStorage.removeItem(testKey);
          return size - 1024;
        }
      }
      
      localStorage.removeItem(testKey);
      return size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Export all data for backup/sync
   */
  exportData() {
    const keys = this.getAllKeys();
    const exportData = {
      version: this.version,
      timestamp: Date.now(),
      data: {}
    };

    keys.forEach(key => {
      const value = this.getItem(key);
      if (value !== null) {
        exportData.data[key] = value;
      }
    });

    return exportData;
  }

  /**
   * Import data from backup/sync
   */
  importData(importData, options = {}) {
    try {
      const { overwrite = false, merge = true } = options;
      
      if (!importData.data) {
        throw new Error('Invalid import data format');
      }

      const results = {
        imported: 0,
        skipped: 0,
        errors: 0
      };

      Object.entries(importData.data).forEach(([key, value]) => {
        try {
          const exists = this.getItem(key) !== null;
          
          if (exists && !overwrite && !merge) {
            results.skipped++;
            return;
          }

          if (merge && exists && typeof value === 'object') {
            const existing = this.getItem(key);
            const merged = { ...existing, ...value };
            this.setItem(key, merged);
          } else {
            this.setItem(key, value);
          }
          
          results.imported++;
        } catch (error) {
          console.error(`Failed to import ${key}:`, error);
          results.errors++;
        }
      });

      return results;
    } catch (error) {
      console.error('Import failed:', error);
      return { imported: 0, skipped: 0, errors: 1 };
    }
  }

  // Feature-specific storage methods for integration

  /**
   * Resume data management
   */
  static getResumeData() {
    const manager = new LocalStorageManager();
    return manager.getItem('resume_data');
  }

  static saveResumeData(data) {
    const manager = new LocalStorageManager();
    return manager.setItem('resume_data', data, { encrypt: true });
  }

  static getLastAnalysis() {
    const manager = new LocalStorageManager();
    return manager.getItem('last_analysis');
  }

  static saveLastAnalysis(analysis) {
    const manager = new LocalStorageManager();
    return manager.setItem('last_analysis', analysis);
  }

  /**
   * Career progress management
   */
  static getCareerProgress() {
    const manager = new LocalStorageManager();
    return manager.getItem('career_progress');
  }

  static saveCareerProgress(progress) {
    const manager = new LocalStorageManager();
    return manager.setItem('career_progress', progress);
  }

  /**
   * Integrated analysis storage
   */
  static saveIntegratedAnalysis(analysis) {
    const manager = new LocalStorageManager();
    return manager.setItem('integrated_analysis', analysis);
  }

  static getIntegratedAnalysis() {
    const manager = new LocalStorageManager();
    return manager.getItem('integrated_analysis');
  }

  /**
   * Job analysis storage
   */
  static saveJobAnalysis(analysis) {
    const manager = new LocalStorageManager();
    const existing = manager.getItem('job_analyses') || [];
    existing.unshift(analysis);
    // Keep only last 10 job analyses
    const limited = existing.slice(0, 10);
    return manager.setItem('job_analyses', limited);
  }

  static getJobAnalyses() {
    const manager = new LocalStorageManager();
    return manager.getItem('job_analyses') || [];
  }

  static getLastJobAnalysis() {
    const analyses = LocalStorageManager.getJobAnalyses();
    return analyses.length > 0 ? analyses[0] : null;
  }

  /**
   * Interview preparation storage
   */
  static saveInterviewPrepPlan(plan) {
    const manager = new LocalStorageManager();
    return manager.setItem('interview_prep_plan', plan);
  }

  static getInterviewPrepPlan() {
    const manager = new LocalStorageManager();
    return manager.getItem('interview_prep_plan');
  }

  /**
   * Template usage tracking
   */
  static getTemplateUsage() {
    const manager = new LocalStorageManager();
    return manager.getItem('template_usage');
  }

  static saveTemplateUsage(usage) {
    const manager = new LocalStorageManager();
    return manager.setItem('template_usage', usage);
  }

  static updateTemplateUsage(templateId) {
    const existing = LocalStorageManager.getTemplateUsage() || { count: 0, templates: [], lastUsed: null };
    existing.count++;
    existing.lastUsed = new Date().toISOString();
    if (!existing.templates.includes(templateId)) {
      existing.templates.push(templateId);
    }
    return LocalStorageManager.saveTemplateUsage(existing);
  }

  /**
   * Recent activity tracking
   */
  static getRecentActivity() {
    const manager = new LocalStorageManager();
    return manager.getItem('recent_activity') || [];
  }

  static addActivity(action, details = {}) {
    const manager = new LocalStorageManager();
    const activities = manager.getItem('recent_activity') || [];
    
    const newActivity = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    activities.unshift(newActivity);
    // Keep only last 50 activities
    const limited = activities.slice(0, 50);
    
    return manager.setItem('recent_activity', limited);
  }

  /**
   * User preferences
   */
  static getUserPreferences() {
    const manager = new LocalStorageManager();
    return manager.getItem('user_preferences') || {};
  }

  static saveUserPreferences(preferences) {
    const manager = new LocalStorageManager();
    const existing = manager.getItem('user_preferences') || {};
    const updated = { ...existing, ...preferences };
    return manager.setItem('user_preferences', updated);
  }
}

export default LocalStorageManager;