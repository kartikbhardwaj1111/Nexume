/**
 * useDataSync Hook
 * React hook for cross-device data synchronization
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import DataSyncManager from '../services/storage/DataSyncManager.js';

// Global sync manager instance
let syncManager = null;

const getSyncManager = () => {
  if (!syncManager) {
    syncManager = new DataSyncManager();
    syncManager.startAutoCleanup();
  }
  return syncManager;
};

export const useDataSync = (key, initialValue = null, options = {}) => {
  const {
    syncAcrossTabs = true,
    encrypt = false,
    autoSave = true,
    debounceMs = 500
  } = options;

  const [data, setData] = useState(() => {
    const manager = getSyncManager();
    const stored = manager.loadUserData(key);
    return stored !== null ? stored : initialValue;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  
  const debounceRef = useRef(null);
  const managerRef = useRef(getSyncManager());

  // Save data to storage
  const saveData = useCallback(async (newData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = managerRef.current.saveUserData(key, newData, {
        syncAcrossTabs,
        encrypt
      });
      
      if (success) {
        setLastSync(Date.now());
      } else {
        throw new Error('Failed to save data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Save error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [key, syncAcrossTabs, encrypt]);

  // Update data with optional auto-save
  const updateData = useCallback((newData) => {
    setData(newData);
    
    if (autoSave) {
      // Debounce saves to avoid excessive storage writes
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        saveData(newData);
      }, debounceMs);
    }
  }, [autoSave, debounceMs, saveData]);

  // Manual save function
  const save = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    return saveData(data);
  }, [data, saveData]);

  // Delete data
  const deleteData = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = managerRef.current.deleteUserData(key);
      if (success) {
        setData(initialValue);
        setLastSync(Date.now());
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Delete error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  // Listen for cross-tab changes
  useEffect(() => {
    const manager = managerRef.current;
    
    const handleSyncEvent = (event, eventData) => {
      if (event === 'storage_change' && eventData.key === key) {
        try {
          const newValue = eventData.newValue ? 
            JSON.parse(eventData.newValue).value : null;
          
          if (newValue !== null) {
            setData(newValue);
            setLastSync(Date.now());
          }
        } catch (err) {
          console.error('Sync event error:', err);
        }
      }
    };

    const unsubscribe = manager.addListener(handleSyncEvent);
    
    return () => {
      unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [key]);

  return {
    data,
    updateData,
    save,
    deleteData,
    isLoading,
    error,
    lastSync
  };
};

// Hook for managing sync operations
export const useSyncManager = () => {
  const [syncCode, setSyncCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);
  
  const managerRef = useRef(getSyncManager());

  // Generate sync code for sharing data
  const generateSyncCode = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const code = managerRef.current.generateSyncCode();
      setSyncCode(code);
      
      return code;
    } catch (err) {
      setError(err.message);
      console.error('Generate sync code error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Import data from sync code
  const importFromCode = useCallback(async (code, options = {}) => {
    try {
      setIsImporting(true);
      setError(null);
      
      const results = managerRef.current.importFromSyncCode(code, options);
      return results;
    } catch (err) {
      setError(err.message);
      console.error('Import from code error:', err);
      return null;
    } finally {
      setIsImporting(false);
    }
  }, []);

  // Export all data
  const exportData = useCallback(() => {
    try {
      return managerRef.current.exportAllData();
    } catch (err) {
      setError(err.message);
      console.error('Export data error:', err);
      return null;
    }
  }, []);

  // Import data from file/object
  const importData = useCallback((importData, options = {}) => {
    try {
      setError(null);
      return managerRef.current.importData(importData, options);
    } catch (err) {
      setError(err.message);
      console.error('Import data error:', err);
      return null;
    }
  }, []);

  // Get storage statistics
  const getStorageStats = useCallback(() => {
    return managerRef.current.getStorageStats();
  }, []);

  // Get active sessions
  const getActiveSessions = useCallback(() => {
    return managerRef.current.getActiveSessions();
  }, []);

  // Clear sync code
  const clearSyncCode = useCallback(() => {
    setSyncCode(null);
  }, []);

  return {
    syncCode,
    generateSyncCode,
    importFromCode,
    exportData,
    importData,
    getStorageStats,
    getActiveSessions,
    clearSyncCode,
    isGenerating,
    isImporting,
    error
  };
};

// Hook for session management
export const useSessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  
  const managerRef = useRef(getSyncManager());

  useEffect(() => {
    const manager = managerRef.current;
    
    // Get current session
    const session = manager.loadUserData('session_data');
    setCurrentSession(session);
    
    // Get all active sessions
    const activeSessions = manager.getActiveSessions();
    setSessions(activeSessions);
    
    // Listen for session changes
    const handleSyncEvent = (event, eventData) => {
      if (event === 'storage_change' && eventData.key.startsWith('session_')) {
        const activeSessions = manager.getActiveSessions();
        setSessions(activeSessions);
      }
    };

    const unsubscribe = manager.addListener(handleSyncEvent);
    
    // Update sessions periodically
    const interval = setInterval(() => {
      const activeSessions = manager.getActiveSessions();
      setSessions(activeSessions);
    }, 30000); // Every 30 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    sessions,
    currentSession,
    deviceId: managerRef.current.deviceId
  };
};

export default useDataSync;