/**
 * Data Synchronization Manager
 * Handles cross-device data synchronization and session management
 */

import LocalStorageManager from './LocalStorageManager.js';

class DataSyncManager {
  constructor() {
    this.storage = new LocalStorageManager();
    this.syncKey = 'data_sync';
    this.sessionKey = 'session_data';
    this.lastSyncKey = 'last_sync';
    this.deviceIdKey = 'device_id';
    
    this.deviceId = this.getOrCreateDeviceId();
    this.syncInterval = null;
    this.listeners = new Set();
    
    // Initialize session management
    this.initializeSession();
    this.setupStorageListener();
  }

  /**
   * Generate or retrieve device ID
   */
  getOrCreateDeviceId() {
    let deviceId = this.storage.getItem(this.deviceIdKey);
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      this.storage.setItem(this.deviceIdKey, deviceId);
    }
    return deviceId;
  }

  /**
   * Generate unique device ID
   */
  generateDeviceId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    const userAgent = navigator.userAgent.slice(0, 10).replace(/\W/g, '');
    return `${timestamp}-${random}-${userAgent}`;
  }

  /**
   * Initialize session management
   */
  initializeSession() {
    const sessionData = {
      deviceId: this.deviceId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      tabId: this.generateTabId(),
      url: window.location.href
    };

    this.storage.setItem(this.sessionKey, sessionData);
    this.updateLastActivity();
    
    // Update activity on user interaction
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
      document.addEventListener(event, this.updateLastActivity.bind(this), { passive: true });
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateLastActivity();
      }
    });
  }

  /**
   * Generate unique tab ID
   */
  generateTabId() {
    return `tab_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity() {
    const sessionData = this.storage.getItem(this.sessionKey) || {};
    sessionData.lastActivity = Date.now();
    sessionData.url = window.location.href;
    this.storage.setItem(this.sessionKey, sessionData);
  }

  /**
   * Setup storage event listener for cross-tab sync
   */
  setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key && event.key.includes('resumefit_')) {
        const key = event.key.replace('resumefit_', '');
        this.notifyListeners('storage_change', {
          key,
          oldValue: event.oldValue,
          newValue: event.newValue,
          source: 'external'
        });
      }
    });
  }

  /**
   * Add sync event listener
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of sync events
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Sync listener error:', error);
      }
    });
  }

  /**
   * Save user data with automatic sync
   */
  saveUserData(key, data, options = {}) {
    const { syncAcrossTabs = true, encrypt = false } = options;
    
    const success = this.storage.setItem(key, data, { encrypt });
    
    if (success && syncAcrossTabs) {
      this.notifyListeners('data_saved', { key, data });
      this.updateSyncTimestamp();
    }
    
    return success;
  }

  /**
   * Load user data
   */
  loadUserData(key) {
    return this.storage.getItem(key);
  }

  /**
   * Delete user data
   */
  deleteUserData(key) {
    const success = this.storage.removeItem(key);
    if (success) {
      this.notifyListeners('data_deleted', { key });
      this.updateSyncTimestamp();
    }
    return success;
  }

  /**
   * Update sync timestamp
   */
  updateSyncTimestamp() {
    this.storage.setItem(this.lastSyncKey, {
      timestamp: Date.now(),
      deviceId: this.deviceId
    });
  }

  /**
   * Get last sync information
   */
  getLastSync() {
    return this.storage.getItem(this.lastSyncKey);
  }

  /**
   * Export all user data for sync/backup
   */
  exportAllData() {
    const exportData = this.storage.exportData();
    
    // Add sync metadata
    exportData.syncMetadata = {
      deviceId: this.deviceId,
      exportTime: Date.now(),
      version: '1.0'
    };

    return exportData;
  }

  /**
   * Import data from another device/backup
   */
  importData(importData, options = {}) {
    const { 
      overwrite = false, 
      merge = true, 
      notifyListeners = true 
    } = options;

    const results = this.storage.importData(importData, { overwrite, merge });
    
    if (notifyListeners && results.imported > 0) {
      this.notifyListeners('data_imported', {
        results,
        source: importData.syncMetadata?.deviceId || 'unknown'
      });
      this.updateSyncTimestamp();
    }

    return results;
  }

  /**
   * Generate shareable sync code
   */
  generateSyncCode() {
    const exportData = this.exportAllData();
    const compressed = this.compressData(exportData);
    
    // Generate a temporary sync code (in real app, this would use a server)
    const syncCode = this.generateShortCode();
    
    // Store sync data temporarily (expires in 1 hour)
    this.storage.setItem(`sync_${syncCode}`, compressed, { 
      expiry: 60 * 60 * 1000 // 1 hour
    });

    return syncCode;
  }

  /**
   * Import data using sync code
   */
  importFromSyncCode(syncCode, options = {}) {
    const syncData = this.storage.getItem(`sync_${syncCode}`);
    
    if (!syncData) {
      throw new Error('Invalid or expired sync code');
    }

    const decompressed = this.decompressData(syncData);
    const results = this.importData(decompressed, options);
    
    // Clean up sync code after use
    this.storage.removeItem(`sync_${syncCode}`);
    
    return results;
  }

  /**
   * Generate short sync code
   */
  generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Simple data compression
   */
  compressData(data) {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(jsonString);
    } catch (error) {
      console.error('Compression failed:', error);
      return data;
    }
  }

  /**
   * Simple data decompression
   */
  decompressData(compressedData) {
    try {
      const jsonString = atob(compressedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decompression failed:', error);
      throw new Error('Invalid sync data format');
    }
  }

  /**
   * Get active sessions across tabs
   */
  getActiveSessions() {
    const sessions = [];
    const keys = this.storage.getAllKeys();
    
    keys.forEach(key => {
      if (key.startsWith('session_')) {
        const session = this.storage.getItem(key);
        if (session && Date.now() - session.lastActivity < 5 * 60 * 1000) { // Active in last 5 minutes
          sessions.push(session);
        }
      }
    });

    return sessions;
  }

  /**
   * Clean up expired sessions and data
   */
  cleanup() {
    const keys = this.storage.getAllKeys();
    let cleaned = 0;

    keys.forEach(key => {
      // Clean up old sessions (inactive for more than 1 hour)
      if (key.startsWith('session_')) {
        const session = this.storage.getItem(key);
        if (session && Date.now() - session.lastActivity > 60 * 60 * 1000) {
          this.storage.removeItem(key);
          cleaned++;
        }
      }
      
      // Clean up expired sync codes
      if (key.startsWith('sync_')) {
        const data = this.storage.getItem(key);
        if (!data) { // Will be null if expired
          cleaned++;
        }
      }
    });

    return cleaned;
  }

  /**
   * Get storage statistics
   */
  getStorageStats() {
    return this.storage.getStorageStats();
  }

  /**
   * Start automatic cleanup interval
   */
  startAutoCleanup(intervalMinutes = 30) {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Destroy sync manager and clean up
   */
  destroy() {
    this.stopAutoCleanup();
    this.listeners.clear();
    
    // Remove event listeners
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
      document.removeEventListener(event, this.updateLastActivity.bind(this));
    });
  }
}

export default DataSyncManager;