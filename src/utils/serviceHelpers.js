/**
 * Service Helper Utilities
 * Common utilities for service operations
 */

import { validateData, VALIDATION_SCHEMAS, ERROR_TYPES, ERROR_MESSAGES } from '../config/interfaces.js';

/**
 * Retry mechanism for service calls
 */
export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  constructor(requestsPerMinute = 10) {
    this.requestsPerMinute = requestsPerMinute;
    this.requests = [];
  }
  
  async checkLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Remove old requests
    this.requests = this.requests.filter(time => time > oneMinuteAgo);
    
    if (this.requests.length >= this.requestsPerMinute) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = 60000 - (now - oldestRequest);
      
      if (waitTime > 0) {
        throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
      }
    }
    
    this.requests.push(now);
  }
}

/**
 * Service health checker
 */
export class ServiceHealthChecker {
  constructor() {
    this.healthStatus = new Map();
  }
  
  async checkHealth(serviceName, healthCheckFn) {
    try {
      const startTime = Date.now();
      const isHealthy = await healthCheckFn();
      const responseTime = Date.now() - startTime;
      
      this.healthStatus.set(serviceName, {
        healthy: isHealthy,
        responseTime,
        lastChecked: new Date(),
        consecutiveFailures: isHealthy ? 0 : (this.getConsecutiveFailures(serviceName) + 1)
      });
      
      return isHealthy;
    } catch (error) {
      this.healthStatus.set(serviceName, {
        healthy: false,
        error: error.message,
        lastChecked: new Date(),
        consecutiveFailures: this.getConsecutiveFailures(serviceName) + 1
      });
      
      return false;
    }
  }
  
  getConsecutiveFailures(serviceName) {
    const status = this.healthStatus.get(serviceName);
    return status ? status.consecutiveFailures : 0;
  }
  
  isServiceHealthy(serviceName) {
    const status = this.healthStatus.get(serviceName);
    return status ? status.healthy : false;
  }
  
  getServiceStatus(serviceName) {
    return this.healthStatus.get(serviceName);
  }
  
  getAllStatus() {
    return Object.fromEntries(this.healthStatus);
  }
}

/**
 * Data sanitization helpers
 */
export function sanitizeInput(input, type = 'text') {
  if (typeof input !== 'string') {
    return '';
  }
  
  switch (type) {
    case 'text':
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/[<>]/g, '')
                  .trim();
    
    case 'url':
      try {
        const url = new URL(input);
        return url.toString();
      } catch {
        return '';
      }
    
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input) ? input.toLowerCase().trim() : '';
    
    case 'phone':
      return input.replace(/[^\d\-\(\)\+\s]/g, '').trim();
    
    default:
      return input.trim();
  }
}

/**
 * Response formatter for consistent API responses
 */
export function formatResponse(success, data = null, error = null, metadata = {}) {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
    ...metadata
  };
}

/**
 * Error handler for services
 */
export function handleServiceError(error, serviceName, operation) {
  console.error(`${serviceName} ${operation} error:`, error);
  
  // Determine error type
  let errorType = ERROR_TYPES.NETWORK_ERROR;
  
  if (error.message.includes('API key')) {
    errorType = ERROR_TYPES.INVALID_API_KEY;
  } else if (error.message.includes('rate limit')) {
    errorType = ERROR_TYPES.RATE_LIMIT_EXCEEDED;
  } else if (error.message.includes('parse') || error.message.includes('JSON')) {
    errorType = ERROR_TYPES.PARSING_ERROR;
  } else if (error.message.includes('validation')) {
    errorType = ERROR_TYPES.VALIDATION_ERROR;
  }
  
  return {
    type: errorType,
    message: ERROR_MESSAGES[errorType] || error.message,
    originalError: error.message,
    serviceName,
    operation,
    timestamp: new Date().toISOString()
  };
}

/**
 * Cache manager for service responses
 */
export class CacheManager {
  constructor(maxSize = 100, ttl = 3600000) { // 1 hour default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  
  set(key, value, customTTL = null) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: customTTL || this.ttl
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
  
  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Performance monitor for service operations
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }
  
  startTimer(operationId) {
    this.metrics.set(operationId, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }
  
  endTimer(operationId) {
    const metric = this.metrics.get(operationId);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
    }
    return metric;
  }
  
  getMetric(operationId) {
    return this.metrics.get(operationId);
  }
  
  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }
  
  clearMetrics() {
    this.metrics.clear();
  }
}

/**
 * Service configuration validator
 */
export function validateServiceConfig(config, requiredFields = []) {
  const errors = [];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * URL validation helper
 */
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Text processing utilities
 */
export function extractKeywords(text, minLength = 3, maxCount = 50) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length >= minLength && 
      !stopWords.has(word) && 
      !/^\d+$/.test(word)
    );
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxCount)
    .map(([word]) => word);
}

/**
 * File type validation
 */
export function validateFileType(file, allowedTypes = []) {
  if (!file || !file.type) {
    return false;
  }
  
  return allowedTypes.length === 0 || allowedTypes.includes(file.type);
}

/**
 * Generate unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`;
}

// Export singleton instances
export const globalRateLimiter = new RateLimiter(10);
export const globalHealthChecker = new ServiceHealthChecker();
export const globalCache = new CacheManager();
export const globalPerformanceMonitor = new PerformanceMonitor();