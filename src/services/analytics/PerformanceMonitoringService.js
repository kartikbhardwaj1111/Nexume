/**
 * Performance Monitoring Service
 * Tracks application performance metrics and identifies bottlenecks
 */

import { analyticsService } from './AnalyticsService';

export class PerformanceMonitoringService {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.thresholds = {
      pageLoadTime: 3000, // 3 seconds
      apiResponseTime: 5000, // 5 seconds
      renderTime: 100, // 100ms
      memoryUsage: 100 * 1024 * 1024, // 100MB
      bundleSize: 5 * 1024 * 1024 // 5MB
    };
    
    this.initializeMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  initializeMonitoring() {
    // Monitor page load performance
    this.monitorPageLoad();
    
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor network performance
    this.monitorNetworkPerformance();
    
    // Monitor React rendering performance
    this.monitorRenderPerformance();
  }

  /**
   * Monitor page load performance
   */
  monitorPageLoad() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            const firstPaint = this.getFirstPaint();
            const firstContentfulPaint = this.getFirstContentfulPaint();

            this.recordMetric('page_load_time', loadTime);
            this.recordMetric('dom_content_loaded', domContentLoaded);
            
            if (firstPaint) {
              this.recordMetric('first_paint', firstPaint);
            }
            
            if (firstContentfulPaint) {
              this.recordMetric('first_contentful_paint', firstContentfulPaint);
            }

            // Track if performance is poor
            if (loadTime > this.thresholds.pageLoadTime) {
              analyticsService.trackError('performance', `Slow page load: ${loadTime}ms`, {
                loadTime,
                domContentLoaded,
                url: window.location.pathname
              });
            }
          }
        }, 0);
      });
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      this.recordMetric('largest_contentful_paint', lcp);
      
      if (lcp > 2500) { // Poor LCP threshold
        analyticsService.trackError('performance', `Poor LCP: ${lcp}ms`);
      }
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entries) => {
      entries.forEach(entry => {
        const fid = entry.processingStart - entry.startTime;
        this.recordMetric('first_input_delay', fid);
        
        if (fid > 100) { // Poor FID threshold
          analyticsService.trackError('performance', `Poor FID: ${fid}ms`);
        }
      });
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entries) => {
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.recordMetric('cumulative_layout_shift', clsValue);
      
      if (clsValue > 0.1) { // Poor CLS threshold
        analyticsService.trackError('performance', `Poor CLS: ${clsValue}`);
      }
    });
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usedMemory = memory.usedJSHeapSize;
        const totalMemory = memory.totalJSHeapSize;
        const memoryLimit = memory.jsHeapSizeLimit;

        this.recordMetric('memory_used', usedMemory);
        this.recordMetric('memory_total', totalMemory);
        this.recordMetric('memory_limit', memoryLimit);

        // Alert on high memory usage
        if (usedMemory > this.thresholds.memoryUsage) {
          analyticsService.trackError('performance', `High memory usage: ${Math.round(usedMemory / 1024 / 1024)}MB`);
        }

        // Alert on memory leaks (usage consistently increasing)
        this.detectMemoryLeaks(usedMemory);
      }, 30000); // Check every 30 seconds
    }
  }

  /**
   * Monitor network performance
   */
  monitorNetworkPerformance() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.recordMetric('api_response_time', duration, { url, status: response.status });
        
        if (duration > this.thresholds.apiResponseTime) {
          analyticsService.trackError('performance', `Slow API response: ${duration}ms`, { url });
        }
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        analyticsService.trackError('network', `API request failed: ${error.message}`, { url, duration });
        throw error;
      }
    };

    // Monitor resource loading
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach(entry => {
        const duration = entry.responseEnd - entry.startTime;
        const size = entry.transferSize || 0;
        
        this.recordMetric('resource_load_time', duration, {
          name: entry.name,
          type: entry.initiatorType,
          size
        });

        // Alert on large resources
        if (size > this.thresholds.bundleSize) {
          analyticsService.trackError('performance', `Large resource loaded: ${Math.round(size / 1024)}KB`, {
            resource: entry.name
          });
        }
      });
    });
  }

  /**
   * Monitor React rendering performance
   */
  monitorRenderPerformance() {
    // Monitor long tasks
    this.observePerformanceEntry('longtask', (entries) => {
      entries.forEach(entry => {
        const duration = entry.duration;
        this.recordMetric('long_task_duration', duration);
        
        if (duration > 50) { // Tasks longer than 50ms block the main thread
          analyticsService.trackError('performance', `Long task detected: ${duration}ms`);
        }
      });
    });

    // Monitor paint timing
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach(entry => {
        this.recordMetric(entry.name.replace('-', '_'), entry.startTime);
      });
    });
  }

  /**
   * Observe performance entries
   */
  observePerformanceEntry(type, callback) {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries());
        });
        
        observer.observe({ type, buffered: true });
        this.observers.set(type, observer);
      }
    } catch (error) {
      console.warn(`Failed to observe ${type} performance entries:`, error);
    }
  }

  /**
   * Record performance metric
   */
  recordMetric(name, value, metadata = {}) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    // Store in memory for analysis
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push(metric);

    // Keep only last 100 entries per metric
    const entries = this.metrics.get(name);
    if (entries.length > 100) {
      entries.shift();
    }

    // Send to analytics service
    analyticsService.trackPerformance(name, value, metadata);
  }

  /**
   * Get first paint timing
   */
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  /**
   * Get first contentful paint timing
   */
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  /**
   * Detect memory leaks
   */
  detectMemoryLeaks(currentMemory) {
    const memoryHistory = this.metrics.get('memory_used') || [];
    
    if (memoryHistory.length >= 10) {
      const recent = memoryHistory.slice(-10);
      const trend = this.calculateTrend(recent.map(m => m.value));
      
      // If memory consistently increases over 10 measurements
      if (trend > 0.8 && currentMemory > this.thresholds.memoryUsage) {
        analyticsService.trackError('performance', 'Potential memory leak detected', {
          currentMemory: Math.round(currentMemory / 1024 / 1024),
          trend
        });
      }
    }
  }

  /**
   * Calculate trend (simple linear regression slope)
   */
  calculateTrend(values) {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const summary = {};
    
    this.metrics.forEach((entries, name) => {
      if (entries.length > 0) {
        const values = entries.map(e => e.value);
        summary[name] = {
          count: entries.length,
          latest: values[values.length - 1],
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          p95: this.calculatePercentile(values, 95)
        };
      }
    });
    
    return summary;
  }

  /**
   * Calculate percentile
   */
  calculatePercentile(values, percentile) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  /**
   * Get performance score
   */
  getPerformanceScore() {
    const summary = this.getPerformanceSummary();
    let score = 100;
    
    // Deduct points for poor metrics
    if (summary.page_load_time?.latest > 3000) score -= 20;
    if (summary.first_contentful_paint?.latest > 1800) score -= 15;
    if (summary.largest_contentful_paint?.latest > 2500) score -= 15;
    if (summary.first_input_delay?.latest > 100) score -= 10;
    if (summary.cumulative_layout_shift?.latest > 0.1) score -= 10;
    if (summary.memory_used?.latest > this.thresholds.memoryUsage) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport() {
    const summary = this.getPerformanceSummary();
    const score = this.getPerformanceScore();
    
    return {
      score,
      summary,
      recommendations: this.generateRecommendations(summary),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations(summary) {
    const recommendations = [];
    
    if (summary.page_load_time?.latest > 3000) {
      recommendations.push({
        type: 'page_load',
        priority: 'high',
        message: 'Page load time is slow. Consider optimizing images and reducing bundle size.',
        metric: 'page_load_time',
        value: summary.page_load_time.latest
      });
    }
    
    if (summary.first_contentful_paint?.latest > 1800) {
      recommendations.push({
        type: 'rendering',
        priority: 'medium',
        message: 'First Contentful Paint is slow. Optimize critical rendering path.',
        metric: 'first_contentful_paint',
        value: summary.first_contentful_paint.latest
      });
    }
    
    if (summary.memory_used?.latest > this.thresholds.memoryUsage) {
      recommendations.push({
        type: 'memory',
        priority: 'medium',
        message: 'High memory usage detected. Check for memory leaks.',
        metric: 'memory_used',
        value: Math.round(summary.memory_used.latest / 1024 / 1024)
      });
    }
    
    return recommendations;
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

// Create singleton instance
export const performanceMonitoringService = new PerformanceMonitoringService();

export default PerformanceMonitoringService;