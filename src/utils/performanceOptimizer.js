/**
 * Performance Optimization Utilities
 * Handles code splitting, lazy loading, performance monitoring, and compression
 */

import { lazy } from 'react';
import { CacheCompressor, compressionUtils } from './compressionUtils';
import { lazyLoadData, ProgressiveLoader } from './lazyLoader.jsx';

/**
 * Enhanced lazy loading with error boundaries and loading states
 */
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    fallback = null,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const LazyComponent = lazy(() => {
    return retryImport(importFunc, retryCount, retryDelay);
  });

  return LazyComponent;
};

/**
 * Retry import with exponential backoff
 */
const retryImport = async (importFunc, retryCount, retryDelay) => {
  try {
    return await importFunc();
  } catch (error) {
    if (retryCount > 0) {
      console.warn(`Import failed, retrying in ${retryDelay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return retryImport(importFunc, retryCount - 1, retryDelay * 2);
    }
    throw error;
  }
};

/**
 * Preload components for better performance
 */
export const preloadComponent = (importFunc) => {
  const componentImport = importFunc();
  return componentImport;
};

/**
 * Intersection Observer for lazy loading
 */
export class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
    
    this.loadedElements = new Set();
  }

  observe(element, callback) {
    if (!element || this.loadedElements.has(element)) return;
    
    element._lazyCallback = callback;
    this.observer.observe(element);
  }

  unobserve(element) {
    if (element) {
      this.observer.unobserve(element);
      this.loadedElements.add(element);
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const callback = element._lazyCallback;
        
        if (callback) {
          callback(element);
        }
        
        this.unobserve(element);
      }
    });
  }

  disconnect() {
    this.observer.disconnect();
    this.loadedElements.clear();
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    
    this.setupPerformanceObserver();
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.recordMetric('navigation', entry);
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.recordMetric('resource', entry);
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Monitor largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.recordMetric('lcp', entry);
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor first input delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.recordMetric('fid', entry);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  recordMetric(type, entry) {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }
    
    this.metrics.get(type).push({
      ...entry.toJSON(),
      timestamp: Date.now()
    });
  }

  startTiming(label) {
    performance.mark(`${label}-start`);
  }

  endTiming(label) {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    this.recordMetric('custom', {
      name: label,
      duration: measure.duration,
      startTime: measure.startTime
    });
    
    return measure.duration;
  }

  getMetrics(type = null) {
    if (type) {
      return this.metrics.get(type) || [];
    }
    return Object.fromEntries(this.metrics);
  }

  getCoreWebVitals() {
    const lcp = this.metrics.get('lcp');
    const fid = this.metrics.get('fid');
    const cls = this.getCLS();

    return {
      lcp: lcp ? lcp[lcp.length - 1]?.startTime : null,
      fid: fid ? fid[0]?.processingStart - fid[0]?.startTime : null,
      cls: cls
    };
  }

  getCLS() {
    // Cumulative Layout Shift calculation
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && 
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
          }
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    return clsValue;
  }

  clear() {
    this.metrics.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * Bundle size analyzer
 */
export const analyzeBundleSize = () => {
  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(r => r.name.includes('.js'));
  const cssResources = resources.filter(r => r.name.includes('.css'));
  
  const totalJSSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const totalCSSSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  
  return {
    javascript: {
      count: jsResources.length,
      totalSize: totalJSSize,
      resources: jsResources.map(r => ({
        name: r.name,
        size: r.transferSize,
        loadTime: r.duration
      }))
    },
    css: {
      count: cssResources.length,
      totalSize: totalCSSSize,
      resources: cssResources.map(r => ({
        name: r.name,
        size: r.transferSize,
        loadTime: r.duration
      }))
    },
    total: totalJSSize + totalCSSSize
  };
};

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      percentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
    };
  }
  return null;
};

/**
 * Network information
 */
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

/**
 * Debounce function for performance
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Image lazy loading with intersection observer
 */
export const setupImageLazyLoading = () => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  return imageObserver;
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as || 'script';
    if (resource.type) link.type = resource.type;
    document.head.appendChild(link);
  });
};

/**
 * Enhanced caching with compression
 */
export class OptimizedCache {
  constructor() {
    this.compressor = new CacheCompressor();
    this.memoryCache = new Map();
    this.maxMemoryItems = 50;
  }

  // Set item with automatic compression
  set(key, data, options = {}) {
    const { ttl = 3600000, compress = true } = options; // 1 hour default TTL
    
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
      compressed: compress
    };

    // Memory cache for frequently accessed items
    if (this.memoryCache.size >= this.maxMemoryItems) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    this.memoryCache.set(key, item);

    // Persistent cache with compression
    if (compress) {
      this.compressor.setCompressed(key, item);
    } else {
      localStorage.setItem(key, JSON.stringify(item));
    }
  }

  // Get item with automatic decompression
  get(key) {
    // Check memory cache first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && this.isValid(memoryItem)) {
      return memoryItem.data;
    }

    // Check persistent cache
    const persistentItem = this.compressor.getCompressed(key);
    if (persistentItem && this.isValid(persistentItem)) {
      // Update memory cache
      this.memoryCache.set(key, persistentItem);
      return persistentItem.data;
    }

    return null;
  }

  // Check if cached item is still valid
  isValid(item) {
    if (!item.timestamp || !item.ttl) return true;
    return (Date.now() - item.timestamp) < item.ttl;
  }

  // Clear expired items
  clearExpired() {
    // Clear memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (!this.isValid(item)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear localStorage (simplified check)
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item.timestamp && item.ttl && !this.isValid(item)) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // Not a cached item, skip
        }
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      memoryItems: this.memoryCache.size,
      ...this.compressor.getCacheStats()
    };
  }
}

/**
 * Progressive data loader with compression
 */
export class OptimizedDataLoader {
  constructor() {
    this.cache = new OptimizedCache();
    this.loaders = new Map();
  }

  // Load data with caching and compression
  async loadData(key, loaderFn, options = {}) {
    const { useCache = true, compress = true, ttl = 3600000 } = options;

    // Check cache first
    if (useCache) {
      const cached = this.cache.get(key);
      if (cached) {
        return cached;
      }
    }

    // Load data
    const data = await loaderFn();
    
    // Compress large datasets
    const processedData = compress ? this.compressData(data, key) : data;

    // Cache the result
    if (useCache) {
      this.cache.set(key, processedData, { ttl, compress });
    }

    return processedData;
  }

  // Compress data based on type
  compressData(data, key) {
    if (key.includes('resume')) {
      return compressionUtils.compressResume(data);
    }
    if (key.includes('job')) {
      return compressionUtils.compressJobDescription(data);
    }
    if (key.includes('template')) {
      return compressionUtils.compressTemplate(data);
    }
    if (key.includes('analytics')) {
      return compressionUtils.compressAnalytics(data);
    }
    return data;
  }

  // Preload critical data
  async preloadCriticalData() {
    const criticalLoaders = [
      { key: 'templates-tech', loader: () => lazyLoadData.templates() },
      { key: 'career-paths', loader: () => lazyLoadData.careerPaths() },
      { key: 'interview-questions-common', loader: () => lazyLoadData.interviewQuestions() }
    ];

    const promises = criticalLoaders.map(({ key, loader }) =>
      this.loadData(key, loader, { compress: true, ttl: 86400000 }) // 24 hours
    );

    return Promise.allSettled(promises);
  }
}

/**
 * Resource optimization manager
 */
export class ResourceOptimizer {
  constructor() {
    this.optimizedResources = new Set();
    this.compressionRatio = 0;
  }

  // Optimize images
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (this.optimizedResources.has(img.src)) return;

      // Add loading optimization
      if (!img.loading) {
        img.loading = 'lazy';
      }

      // Add decoding optimization
      if (!img.decoding) {
        img.decoding = 'async';
      }

      // Optimize for different screen sizes
      this.addResponsiveImages(img);

      this.optimizedResources.add(img.src);
    });
  }

  // Add responsive images
  addResponsiveImages(img) {
    if (img.srcset) return; // Already optimized

    const src = img.src;
    const breakpoints = [320, 640, 768, 1024, 1280];
    
    const srcset = breakpoints
      .map(width => `${src}?w=${width} ${width}w`)
      .join(', ');
    
    img.srcset = srcset;
    img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
  }

  // Optimize fonts
  optimizeFonts() {
    // Preload critical fonts
    const criticalFonts = [
      { href: '/fonts/inter-var.woff2', type: 'font/woff2' }
    ];

    criticalFonts.forEach(font => {
      if (document.querySelector(`link[href="${font.href}"]`)) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.href;
      link.as = 'font';
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Add font-display: swap to existing fonts
    const fontFaces = document.styleSheets;
    Array.from(fontFaces).forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        Array.from(rules).forEach(rule => {
          if (rule.type === CSSRule.FONT_FACE_RULE) {
            if (!rule.style.fontDisplay) {
              rule.style.fontDisplay = 'swap';
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheet, skip
      }
    });
  }

  // Optimize CSS
  optimizeCSS() {
    // Remove unused CSS (basic implementation)
    const usedClasses = new Set();
    
    // Collect used classes
    document.querySelectorAll('*').forEach(element => {
      element.classList.forEach(cls => usedClasses.add(cls));
    });

    // Mark critical CSS
    const criticalElements = document.querySelectorAll('[data-critical]');
    criticalElements.forEach(element => {
      element.classList.forEach(cls => usedClasses.add(cls));
    });

    return Array.from(usedClasses);
  }

  // Get optimization report
  getOptimizationReport() {
    return {
      optimizedImages: this.optimizedResources.size,
      compressionRatio: this.compressionRatio,
      memoryUsage: getMemoryUsage(),
      networkInfo: getNetworkInfo(),
      bundleSize: analyzeBundleSize()
    };
  }
}

// Create singleton instances
export const lazyLoader = new LazyLoader();
export const performanceMonitor = new PerformanceMonitor();
export const optimizedCache = new OptimizedCache();
export const dataLoader = new OptimizedDataLoader();
export const resourceOptimizer = new ResourceOptimizer();

// Initialize optimizations
export const initializeOptimizations = () => {
  // Clear expired cache items
  optimizedCache.clearExpired();
  
  // Optimize resources
  resourceOptimizer.optimizeImages();
  resourceOptimizer.optimizeFonts();
  resourceOptimizer.optimizeCSS();
  
  // Preload critical data
  dataLoader.preloadCriticalData();
  
  // Setup periodic cleanup
  setInterval(() => {
    optimizedCache.clearExpired();
  }, 300000); // Every 5 minutes
};

// Export default utilities
export default {
  createLazyComponent,
  preloadComponent,
  LazyLoader,
  PerformanceMonitor,
  OptimizedCache,
  OptimizedDataLoader,
  ResourceOptimizer,
  analyzeBundleSize,
  getMemoryUsage,
  getNetworkInfo,
  debounce,
  throttle,
  setupImageLazyLoading,
  preloadCriticalResources,
  initializeOptimizations,
  lazyLoader,
  performanceMonitor,
  optimizedCache,
  dataLoader,
  resourceOptimizer
};