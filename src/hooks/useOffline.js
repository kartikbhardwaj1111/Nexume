/**
 * useOffline Hook
 * React hook for handling offline functionality and network status
 */

import { useState, useEffect, useCallback } from 'react';
import serviceWorkerManager, { addServiceWorkerListener } from '../utils/serviceWorker';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState(null);

  useEffect(() => {
    // Update online status
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineMessage(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineMessage('You are offline. Some features may be limited.');
    };

    // Listen to network events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen to service worker events
    const unsubscribe = addServiceWorkerListener((event, data) => {
      switch (event) {
        case 'online':
          setIsOnline(true);
          setOfflineMessage(null);
          break;
          
        case 'offline':
          setIsOnline(false);
          setOfflineMessage(data.message);
          break;
          
        case 'update_available':
          setUpdateAvailable(true);
          break;
          
        case 'background_sync':
          // Handle background sync completion
          console.log('Background sync completed:', data.message);
          break;
          
        default:
          break;
      }
    });

    // Check service worker status
    const checkServiceWorker = () => {
      const status = serviceWorkerManager.getStatus();
      setIsServiceWorkerReady(status.active);
    };

    checkServiceWorker();
    const interval = setInterval(checkServiceWorker, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const updateApp = useCallback(() => {
    serviceWorkerManager.skipWaiting();
    window.location.reload();
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  const dismissOfflineMessage = useCallback(() => {
    setOfflineMessage(null);
  }, []);

  return {
    isOnline,
    isServiceWorkerReady,
    updateAvailable,
    offlineMessage,
    updateApp,
    dismissUpdate,
    dismissOfflineMessage
  };
};

export const useNetworkStatus = () => {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');

  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });

        // Determine connection speed category
        if (connection.effectiveType === '4g' && connection.downlink > 10) {
          setConnectionSpeed('fast');
        } else if (connection.effectiveType === '4g' || connection.effectiveType === '3g') {
          setConnectionSpeed('medium');
        } else {
          setConnectionSpeed('slow');
        }
      }
    };

    updateNetworkInfo();

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkInfo);
      
      return () => {
        navigator.connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  return {
    networkInfo,
    connectionSpeed,
    isSlowConnection: connectionSpeed === 'slow',
    isFastConnection: connectionSpeed === 'fast'
  };
};

export const useOfflineStorage = (key, initialValue = null) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveData = useCallback(async (newData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      localStorage.setItem(`offline_${key}`, JSON.stringify(newData));
      setData(newData);
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(`offline_${key}`);
      setData(initialValue);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [key, initialValue]);

  return {
    data,
    saveData,
    clearData,
    isLoading,
    error
  };
};

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load queue from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('offline_queue');
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }, []);

  // Save queue to storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }, [queue]);

  const addToQueue = useCallback((action) => {
    const queueItem = {
      id: Date.now() + Math.random(),
      action,
      timestamp: Date.now(),
      retries: 0
    };
    
    setQueue(prev => [...prev, queueItem]);
    return queueItem.id;
  }, []);

  const removeFromQueue = useCallback((id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0 || !navigator.onLine) {
      return;
    }

    setIsProcessing(true);

    for (const item of queue) {
      try {
        // Execute the queued action
        if (typeof item.action === 'function') {
          await item.action();
        } else if (item.action.type === 'fetch') {
          await fetch(item.action.url, item.action.options);
        }
        
        // Remove successful item from queue
        removeFromQueue(item.id);
      } catch (error) {
        console.error('Failed to process queue item:', error);
        
        // Increment retry count
        setQueue(prev => prev.map(queueItem => 
          queueItem.id === item.id 
            ? { ...queueItem, retries: queueItem.retries + 1 }
            : queueItem
        ));
        
        // Remove item if too many retries
        if (item.retries >= 3) {
          removeFromQueue(item.id);
        }
      }
    }

    setIsProcessing(false);
  }, [queue, isProcessing, removeFromQueue]);

  // Process queue when coming online
  useEffect(() => {
    if (navigator.onLine && queue.length > 0) {
      processQueue();
    }
  }, [navigator.onLine, queue.length, processQueue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    processQueue,
    clearQueue,
    isProcessing,
    queueLength: queue.length
  };
};

export default useOffline;