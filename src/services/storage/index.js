/**
 * Storage Services Index
 * Exports all storage-related services
 */

import LocalStorageManager from './LocalStorageManager.js';
import DataSyncManager from './DataSyncManager.js';

// Create singleton instances
export const localStorageManager = new LocalStorageManager();
export const dataSyncManager = new DataSyncManager();

// Export classes for custom instances
export { LocalStorageManager, DataSyncManager };

// Export convenience functions
export const saveUserData = (key, data, options) => {
  return dataSyncManager.saveUserData(key, data, options);
};

export const loadUserData = (key) => {
  return dataSyncManager.loadUserData(key);
};

export const deleteUserData = (key) => {
  return dataSyncManager.deleteUserData(key);
};

export const exportAllData = () => {
  return dataSyncManager.exportAllData();
};

export const importData = (data, options) => {
  return dataSyncManager.importData(data, options);
};

export default {
  localStorageManager,
  dataSyncManager,
  saveUserData,
  loadUserData,
  deleteUserData,
  exportAllData,
  importData
};