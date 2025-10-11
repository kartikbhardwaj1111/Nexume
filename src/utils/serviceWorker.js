/**
 * Service Worker Registration and Management
 * Handles PWA functionality and offline capabilities
 */

// Check if service workers are supported
const isSupported = 'serviceWorker' in navigator;

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    
    this.setupOnlineOfflineListeners();
  }

  /**
   * Register the service worker
   */
  async register() {
    if (!isSupported) {
      console.warn('Service Workers not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event.data);
      });

      // Check for existing service worker
      if (this.registration.active) {
        console.log('Service Worker already active');
      }

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Handle service worker updates
   */
  handleUpdate() {
    const newWorker = this.registration.installing;
    
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker is available
          this.notifyListeners('update_available', {
            message: 'A new version is available. Refresh to update.',
            action: 'refresh'
          });
        }
      });
    }
  }

  /**
   * Handle messages from service worker
   */
  handleMessage(data) {
    const { type, message } = data;
    
    switch (type) {
      case 'BACKGROUND_SYNC':
        this.notifyListeners('background_sync', { message });
        break;
        
      case 'CACHE_UPDATE':
        this.notifyListeners('cache_update', data);
        break;
        
      default:
        console.log('Service Worker message:', data);
    }
  }

  /**
   * Setup online/offline event listeners
   */
  setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners('online', { 
        message: 'Connection restored',
        online: true 
      });
      
      // Trigger background sync
      this.requestBackgroundSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners('offline', { 
        message: 'You are now offline. Some features may be limited.',
        online: false 
      });
    });
  }

  /**
   * Request background sync when online
   */
  async requestBackgroundSync() {
    if (this.registration && this.registration.sync) {
      try {
        await this.registration.sync.register('background-sync');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  /**
   * Cache specific URLs for offline access
   */
  async cacheUrls(urls) {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({
        type: 'CACHE_URLS',
        data: { urls }
      });
    }
  }

  /**
   * Clear cache
   */
  async clearCache(cacheName = null) {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({
        type: 'CLEAR_CACHE',
        data: { cacheName }
      });
    }
  }

  /**
   * Update service worker
   */
  async update() {
    if (this.registration) {
      try {
        await this.registration.update();
        console.log('Service Worker update check completed');
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  /**
   * Add event listener
   */
  addEventListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Service Worker listener error:', error);
      }
    });
  }

  /**
   * Get service worker status
   */
  getStatus() {
    return {
      supported: isSupported,
      registered: !!this.registration,
      active: !!(this.registration && this.registration.active),
      online: this.isOnline
    };
  }

  /**
   * Unregister service worker
   */
  async unregister() {
    if (this.registration) {
      try {
        await this.registration.unregister();
        console.log('Service Worker unregistered');
        return true;
      } catch (error) {
        console.error('Service Worker unregistration failed:', error);
        return false;
      }
    }
    return false;
  }
}

// Create singleton instance
const serviceWorkerManager = new ServiceWorkerManager();

// Auto-register on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    serviceWorkerManager.register();
  });
}

export default serviceWorkerManager;

// Export utilities
export const registerServiceWorker = () => serviceWorkerManager.register();
export const updateServiceWorker = () => serviceWorkerManager.update();
export const skipWaiting = () => serviceWorkerManager.skipWaiting();
export const cacheUrls = (urls) => serviceWorkerManager.cacheUrls(urls);
export const clearCache = (cacheName) => serviceWorkerManager.clearCache(cacheName);
export const getServiceWorkerStatus = () => serviceWorkerManager.getStatus();
export const addServiceWorkerListener = (callback) => serviceWorkerManager.addEventListener(callback);

// Auto-register service worker in production
if (import.meta.env.PROD) {
  serviceWorkerManager.register().catch(console.error);
}