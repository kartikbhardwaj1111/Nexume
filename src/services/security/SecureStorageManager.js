/**
 * Secure Storage Manager
 * Manages encrypted storage of sensitive user data with GDPR compliance
 */

import EncryptionService from './EncryptionService.js';

class SecureStorageManager {
  constructor() {
    this.encryptionService = new EncryptionService();
    this.keyPrefix = 'resume_fit_';
    this.metadataKey = 'resume_fit_metadata';
    this.sessionKey = null;
    this.isInitialized = false;
  }

  /**
   * Initialize secure storage with session-based encryption
   * @param {string} sessionId - Unique session identifier
   * @returns {Promise<boolean>} Success status
   */
  async initialize(sessionId = null) {
    try {
      const salt = this.getOrCreateSalt();
      const password = sessionId || this.generateSessionId();
      
      this.sessionKey = await this.encryptionService.deriveKey(password, salt);
      this.isInitialized = true;
      
      // Initialize metadata if not exists
      await this.initializeMetadata();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize secure storage:', error);
      return false;
    }
  }

  /**
   * Store encrypted data
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @param {Object} options - Storage options
   * @returns {Promise<boolean>} Success status
   */
  async setSecureItem(key, data, options = {}) {
    if (!this.isInitialized) {
      throw new Error('SecureStorageManager not initialized');
    }

    try {
      const serializedData = JSON.stringify(data);
      const encryptedData = await this.encryptionService.encrypt(serializedData, this.sessionKey);
      
      const storageItem = {
        data: encryptedData,
        timestamp: Date.now(),
        type: options.type || 'user_data',
        sensitive: options.sensitive !== false,
        expiresAt: options.expiresAt || null,
      };

      localStorage.setItem(this.keyPrefix + key, JSON.stringify(storageItem));
      
      // Update metadata
      await this.updateMetadata(key, {
        type: storageItem.type,
        sensitive: storageItem.sensitive,
        timestamp: storageItem.timestamp,
        expiresAt: storageItem.expiresAt,
      });

      return true;
    } catch (error) {
      console.error('Failed to store secure item:', error);
      return false;
    }
  }

  /**
   * Retrieve and decrypt data
   * @param {string} key - Storage key
   * @returns {Promise<any>} Decrypted data or null
   */
  async getSecureItem(key) {
    if (!this.isInitialized) {
      throw new Error('SecureStorageManager not initialized');
    }

    try {
      const storageItem = localStorage.getItem(this.keyPrefix + key);
      if (!storageItem) {
        return null;
      }

      const parsedItem = JSON.parse(storageItem);
      
      // Check expiration
      if (parsedItem.expiresAt && Date.now() > parsedItem.expiresAt) {
        await this.removeSecureItem(key);
        return null;
      }

      const decryptedData = await this.encryptionService.decrypt(parsedItem.data, this.sessionKey);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      return null;
    }
  }

  /**
   * Remove encrypted data
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} Success status
   */
  async removeSecureItem(key) {
    try {
      localStorage.removeItem(this.keyPrefix + key);
      await this.removeFromMetadata(key);
      return true;
    } catch (error) {
      console.error('Failed to remove secure item:', error);
      return false;
    }
  }

  /**
   * Get all stored data keys (for GDPR compliance)
   * @returns {Promise<Array>} List of stored data keys with metadata
   */
  async getAllDataKeys() {
    try {
      const metadata = await this.getMetadata();
      return Object.entries(metadata.items || {}).map(([key, info]) => ({
        key,
        type: info.type,
        sensitive: info.sensitive,
        timestamp: info.timestamp,
        expiresAt: info.expiresAt,
      }));
    } catch (error) {
      console.error('Failed to get data keys:', error);
      return [];
    }
  }

  /**
   * Export all user data (GDPR compliance)
   * @returns {Promise<Object>} All user data
   */
  async exportAllData() {
    if (!this.isInitialized) {
      throw new Error('SecureStorageManager not initialized');
    }

    try {
      const dataKeys = await this.getAllDataKeys();
      const exportData = {
        exportDate: new Date().toISOString(),
        dataItems: {},
      };

      for (const keyInfo of dataKeys) {
        const data = await this.getSecureItem(keyInfo.key);
        if (data) {
          exportData.dataItems[keyInfo.key] = {
            data,
            metadata: keyInfo,
          };
        }
      }

      return exportData;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Delete all user data (GDPR compliance)
   * @returns {Promise<boolean>} Success status
   */
  async deleteAllData() {
    try {
      const dataKeys = await this.getAllDataKeys();
      
      for (const keyInfo of dataKeys) {
        await this.removeSecureItem(keyInfo.key);
      }

      // Clear metadata
      localStorage.removeItem(this.metadataKey);
      
      // Clear salt
      localStorage.removeItem(this.keyPrefix + 'salt');

      return true;
    } catch (error) {
      console.error('Failed to delete all data:', error);
      return false;
    }
  }

  /**
   * Clean expired data
   * @returns {Promise<number>} Number of items cleaned
   */
  async cleanExpiredData() {
    try {
      const dataKeys = await this.getAllDataKeys();
      let cleanedCount = 0;
      const now = Date.now();

      for (const keyInfo of dataKeys) {
        if (keyInfo.expiresAt && now > keyInfo.expiresAt) {
          await this.removeSecureItem(keyInfo.key);
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Failed to clean expired data:', error);
      return 0;
    }
  }

  /**
   * Get or create salt for key derivation
   * @returns {Uint8Array} Salt
   */
  getOrCreateSalt() {
    const saltKey = this.keyPrefix + 'salt';
    let salt = localStorage.getItem(saltKey);
    
    if (!salt) {
      const newSalt = this.encryptionService.generateSalt();
      localStorage.setItem(saltKey, JSON.stringify(Array.from(newSalt)));
      return newSalt;
    }
    
    return new Uint8Array(JSON.parse(salt));
  }

  /**
   * Generate unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return crypto.randomUUID() + '_' + Date.now();
  }

  /**
   * Initialize metadata storage
   */
  async initializeMetadata() {
    const existing = localStorage.getItem(this.metadataKey);
    if (!existing) {
      const metadata = {
        version: '1.0',
        created: Date.now(),
        items: {},
      };
      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
    }
  }

  /**
   * Get metadata
   * @returns {Promise<Object>} Metadata
   */
  async getMetadata() {
    const metadata = localStorage.getItem(this.metadataKey);
    return metadata ? JSON.parse(metadata) : { items: {} };
  }

  /**
   * Update metadata for a key
   * @param {string} key - Data key
   * @param {Object} info - Key information
   */
  async updateMetadata(key, info) {
    const metadata = await this.getMetadata();
    metadata.items[key] = info;
    localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
  }

  /**
   * Remove key from metadata
   * @param {string} key - Data key
   */
  async removeFromMetadata(key) {
    const metadata = await this.getMetadata();
    delete metadata.items[key];
    localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
  }
}

export default SecureStorageManager;