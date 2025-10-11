/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics collector
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.thresholds = {
      FCP: 1800, // First Contentful Paint
      LCP: 2500, // Largest Contentful Paint
      FID: 100,  // First Input Delay
      CLS: 0.1,  // Cumulative Layout Shift
      TTFB: 800  // Time to First Byte
    };
    
    this.initializeObservers();
  }

  // Initialize performance observers
  initializeObservers() {
    // Core Web Vitals
    this.observeWebVitals();
    
    // Resource loading
    this.observeResourceTiming();
    
    // Navigation timing
    this.observeNavigationTiming();
    
    // Long tasks
    this.observeLongTasks();
  }

  // Observe Core Web Vitals
  observeWebVitals() {
    // First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime);
        }
      });
    });

    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      entries.forEach(entry => {
        this.recordMetric('LCP', entry.startTime);
      });
    });

    // First Input Delay
    this.observePerformanceEntry('first-input', (entries) => {
      entries.forEach(entry => {
        this.recordMetric('FID', entry.processingStart - entry.startTime);
      });
    });

    // Cumulative Layout Shift
    this.observePerformanceEntry('layout-shift', (entries) => {
      let clsValue = 0;
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.recordMetric('CLS', clsValue);
    });
  }

  // Observe resource timing
  observeResourceTiming() {
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach(entry => {
        const resourceType = this.getResourceType(entry.name);
        const loadTime = entry.responseEnd - entry.startTime;
        
        this.recordMetric(`${resourceType}_load_time`, loadTime);
        
        // Track slow resources
        if (loadTime > 1000) {
          this.recordSlowResource(entry);
        }
      });
    });
  }

  // Observe navigation timing
  observeNavigationTiming() {
    this.observePerformanceEntry('navigation', (entries) => {
      entries.forEach(entry => {
        const ttfb = entry.responseStart - entry.requestStart;
        const domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
        const loadComplete = entry.loadEventEnd - entry.loadEventStart;
        
        this.recordMetric('TTFB', ttfb);
        this.recordMetric('DOM_CONTENT_LOADED', domContentLoaded);
        this.recordMetric('LOAD_COMPLETE', loadComplete);
      });
    });
  }

  // Observe long tasks
  observeLongTasks() {
    this.observePerformanceEntry('longtask', (entries) => {
      entries.forEach(entry => {
        this.recordMetric('LONG_TASK', entry.duration);
        
        // Log long tasks for debugging
        if (entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution
          });
        }
      });
    });
  }

  // Generic performance observer
  observePerformanceEntry(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ type, buffered: true });
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Performance observer not supported: ${type}`, error);
    }
  }

  // Record performance metric
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      value,
      timestamp: Date.now(),
      url: window.location.pathname
    });

    // Check thresholds
    this.checkThreshold(name, value);
  }

  // Check performance thresholds
  checkThreshold(name, value) {
    const threshold = this.thresholds[name];
    if (threshold && value > threshold) {
      console.warn(`Performance threshold exceeded: ${name}`, {
        value,
        threshold,
        url: window.location.pathname
      });
      
      // Trigger performance optimization
      this.triggerOptimization(name, value);
    }
  }

  // Trigger performance optimization
  triggerOptimization(metric, value) {
    switch (metric) {
      case 'LCP':
        this.optimizeLCP();
        break;
      case 'FID':
        this.optimizeFID();
        break;
      case 'CLS':
        this.optimizeCLS();
        break;
      case 'TTFB':
        this.optimizeTTFB();
        break;
    }
  }

  // Optimize Largest Contentful Paint
  optimizeLCP() {
    // Preload critical resources
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
      if (!img.loading) {
        img.loading = 'eager';
      }
    });

    // Optimize font loading
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }

  // Optimize First Input Delay
  optimizeFID() {
    // Break up long tasks
    if ('scheduler' in window && 'postTask' in window.scheduler) {
      // Use scheduler API if available
      this.scheduleNonCriticalTasks();
    } else {
      // Fallback to setTimeout
      this.deferNonCriticalTasks();
    }
  }

  // Optimize Cumulative Layout Shift
  optimizeCLS() {
    // Add size attributes to images without them
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      if (img.naturalWidth && img.naturalHeight) {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      }
    });
  }

  // Optimize Time to First Byte
  optimizeTTFB() {
    // Enable service worker caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'OPTIMIZE_CACHING',
          url: window.location.pathname
        });
      });
    }
  }

  // Schedule non-critical tasks
  scheduleNonCriticalTasks() {
    const nonCriticalTasks = this.getNonCriticalTasks();
    
    nonCriticalTasks.forEach(task => {
      window.scheduler.postTask(task, { priority: 'background' });
    });
  }

  // Defer non-critical tasks
  deferNonCriticalTasks() {
    const nonCriticalTasks = this.getNonCriticalTasks();
    
    nonCriticalTasks.forEach(task => {
      setTimeout(task, 0);
    });
  }

  // Get non-critical tasks
  getNonCriticalTasks() {
    return [
      () => this.initializeAnalytics(),
      () => this.preloadNextPageResources(),
      () => this.optimizeImages(),
      () => this.cleanupUnusedResources()
    ];
  }

  // Get resource type from URL
  getResourceType(url) {
    if (url.match(/\.(js)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    return 'other';
  }

  // Record slow resource
  recordSlowResource(entry) {
    console.warn('Slow resource detected:', {
      url: entry.name,
      loadTime: entry.responseEnd - entry.startTime,
      size: entry.transferSize,
      type: this.getResourceType(entry.name)
    });
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = {};
    
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        const latest = values[values.length - 1];
        const average = values.reduce((sum, entry) => sum + entry.value, 0) / values.length;
        
        summary[name] = {
          latest: latest.value,
          average: Math.round(average),
          count: values.length,
          threshold: this.thresholds[name],
          status: this.thresholds[name] ? 
            (latest.value <= this.thresholds[name] ? 'good' : 'poor') : 'unknown'
        };
      }
    });
    
    return summary;
  }

  // Initialize analytics (non-critical)
  initializeAnalytics() {
    // Placeholder for analytics initialization
    console.log('Analytics initialized (deferred)');
  }

  // Preload next page resources (non-critical)
  preloadNextPageResources() {
    const links = document.querySelectorAll('a[href^="/"]');
    const nextPages = Array.from(links)
      .slice(0, 3) // Limit to first 3 internal links
      .map(link => link.href);
    
    nextPages.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Optimize images (non-critical)
  optimizeImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Add intersection observer for lazy images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Cleanup unused resources (non-critical)
  cleanupUnusedResources() {
    // Remove unused stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(sheet => {
      if (sheet.sheet && sheet.sheet.cssRules.length === 0) {
        console.log('Removing unused stylesheet:', sheet.href);
        sheet.remove();
      }
    });
  }

  // Disconnect all observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Bundle size analyzer
export class BundleSizeAnalyzer {
  constructor() {
    this.chunks = new Map();
    this.loadTimes = new Map();
  }

  // Analyze loaded chunks
  analyzeChunks() {
    const scripts = document.querySelectorAll('script[src]');
    
    scripts.forEach(script => {
      const src = script.src;
      const size = this.estimateScriptSize(script);
      
      this.chunks.set(src, {
        size,
        loaded: script.readyState === 'complete',
        critical: script.hasAttribute('data-critical')
      });
    });
    
    return this.getChunkAnalysis();
  }

  // Estimate script size (rough estimation)
  estimateScriptSize(script) {
    // This is a rough estimation - in production, you'd get actual sizes
    const src = script.src;
    if (src.includes('vendor')) return 150000; // ~150KB for vendor chunks
    if (src.includes('chunk')) return 50000;   // ~50KB for feature chunks
    return 25000; // ~25KB for other scripts
  }

  // Get chunk analysis
  getChunkAnalysis() {
    const totalSize = Array.from(this.chunks.values())
      .reduce((sum, chunk) => sum + chunk.size, 0);
    
    const criticalSize = Array.from(this.chunks.values())
      .filter(chunk => chunk.critical)
      .reduce((sum, chunk) => sum + chunk.size, 0);
    
    return {
      totalChunks: this.chunks.size,
      totalSize: Math.round(totalSize / 1024), // KB
      criticalSize: Math.round(criticalSize / 1024), // KB
      nonCriticalSize: Math.round((totalSize - criticalSize) / 1024), // KB
      recommendations: this.getOptimizationRecommendations(totalSize, criticalSize)
    };
  }

  // Get optimization recommendations
  getOptimizationRecommendations(totalSize, criticalSize) {
    const recommendations = [];
    
    if (criticalSize > 100000) { // > 100KB
      recommendations.push('Consider reducing critical bundle size');
    }
    
    if (totalSize > 500000) { // > 500KB
      recommendations.push('Consider implementing more aggressive code splitting');
    }
    
    if (this.chunks.size > 10) {
      recommendations.push('Consider consolidating small chunks');
    }
    
    return recommendations;
  }
}

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  const monitor = new PerformanceMonitor();
  const analyzer = new BundleSizeAnalyzer();
  
  // Expose to window for debugging
  window.performanceMonitor = monitor;
  window.bundleAnalyzer = analyzer;
  
  // Log performance summary after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('Performance Summary:', monitor.getPerformanceSummary());
      console.log('Bundle Analysis:', analyzer.analyzeChunks());
    }, 2000);
  });
  
  return { monitor, analyzer };
};

export default {
  PerformanceMonitor,
  BundleSizeAnalyzer,
  initializePerformanceMonitoring
};