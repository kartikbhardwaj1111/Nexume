/**
 * Input Validator
 * Comprehensive input validation and sanitization for security
 */

class InputValidator {
  constructor() {
    // File type whitelist for uploads
    this.allowedFileTypes = {
      resume: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/rtf',
      ],
      image: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ],
    };

    // File size limits (in bytes)
    this.fileSizeLimits = {
      resume: 10 * 1024 * 1024, // 10MB
      image: 5 * 1024 * 1024,   // 5MB
      general: 25 * 1024 * 1024, // 25MB
    };

    // URL validation patterns
    this.urlPatterns = {
      jobSites: /^https?:\/\/(www\.)?(linkedin\.com|indeed\.com|glassdoor\.com|monster\.com|ziprecruiter\.com|careerbuilder\.com)/i,
      general: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
    };

    // Text validation patterns
    this.textPatterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\+]?[1-9][\d]{0,15}$/,
      name: /^[a-zA-Z\s\-'\.]{1,100}$/,
      alphanumeric: /^[a-zA-Z0-9\s\-_\.]{1,255}$/,
      safeText: /^[a-zA-Z0-9\s\-_\.\,\!\?\(\)\[\]]{1,1000}$/,
    };

    // XSS prevention patterns
    this.xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
      /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
      /onclick=/gi,
      /onmouseover=/gi,
    ];
  }

  /**
   * Validate file upload
   * @param {File} file - File to validate
   * @param {string} category - File category (resume, image, general)
   * @returns {Object} Validation result
   */
  validateFile(file, category = 'general') {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!file) {
      result.isValid = false;
      result.errors.push('No file provided');
      return result;
    }

    // Check file size
    const sizeLimit = this.fileSizeLimits[category] || this.fileSizeLimits.general;
    if (file.size > sizeLimit) {
      result.isValid = false;
      result.errors.push(`File size exceeds limit of ${this.formatFileSize(sizeLimit)}`);
    }

    // Check file type
    const allowedTypes = this.allowedFileTypes[category];
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      result.isValid = false;
      result.errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file name for suspicious patterns
    const fileName = file.name.toLowerCase();
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar', '.vbs', '.js'];
    const hasSuspiciousExtension = suspiciousExtensions.some(ext => fileName.endsWith(ext));
    
    if (hasSuspiciousExtension) {
      result.isValid = false;
      result.errors.push('File type not allowed for security reasons');
    }

    // Check for double extensions
    const extensionCount = (fileName.match(/\./g) || []).length;
    if (extensionCount > 1) {
      result.warnings.push('File has multiple extensions, please verify it is safe');
    }

    // Check file name length
    if (file.name.length > 255) {
      result.isValid = false;
      result.errors.push('File name is too long (max 255 characters)');
    }

    return result;
  }

  /**
   * Validate URL input
   * @param {string} url - URL to validate
   * @param {string} type - URL type (jobSites, general)
   * @returns {Object} Validation result
   */
  validateUrl(url, type = 'general') {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      sanitizedUrl: url,
    };

    if (!url || typeof url !== 'string') {
      result.isValid = false;
      result.errors.push('URL is required');
      return result;
    }

    // Trim and normalize
    const trimmedUrl = url.trim();
    
    if (trimmedUrl.length === 0) {
      result.isValid = false;
      result.errors.push('URL cannot be empty');
      return result;
    }

    if (trimmedUrl.length > 2048) {
      result.isValid = false;
      result.errors.push('URL is too long (max 2048 characters)');
      return result;
    }

    // Check URL pattern
    const pattern = this.urlPatterns[type] || this.urlPatterns.general;
    if (!pattern.test(trimmedUrl)) {
      result.isValid = false;
      if (type === 'jobSites') {
        result.errors.push('URL must be from a supported job site (LinkedIn, Indeed, Glassdoor, etc.)');
      } else {
        result.errors.push('Invalid URL format');
      }
      return result;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i,
    ];

    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(trimmedUrl));
    if (hasSuspiciousPattern) {
      result.isValid = false;
      result.errors.push('URL contains suspicious protocol');
      return result;
    }

    // Validate domain
    try {
      const urlObj = new URL(trimmedUrl);
      
      // Check for IP addresses (potential security risk)
      const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      if (ipPattern.test(urlObj.hostname)) {
        result.warnings.push('URL uses IP address instead of domain name');
      }

      // Check for suspicious ports
      const suspiciousPorts = ['22', '23', '25', '53', '110', '143', '993', '995'];
      if (urlObj.port && suspiciousPorts.includes(urlObj.port)) {
        result.warnings.push('URL uses unusual port number');
      }

      result.sanitizedUrl = urlObj.toString();
    } catch (error) {
      result.isValid = false;
      result.errors.push('Invalid URL format');
    }

    return result;
  }

  /**
   * Validate text input
   * @param {string} text - Text to validate
   * @param {string} type - Text type (email, phone, name, etc.)
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateText(text, type = 'safeText', options = {}) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      sanitizedText: text,
    };

    if (text === null || text === undefined) {
      if (options.required) {
        result.isValid = false;
        result.errors.push('Text is required');
      }
      return result;
    }

    if (typeof text !== 'string') {
      result.isValid = false;
      result.errors.push('Input must be text');
      return result;
    }

    // Trim whitespace
    const trimmedText = text.trim();
    
    if (trimmedText.length === 0 && options.required) {
      result.isValid = false;
      result.errors.push('Text cannot be empty');
      return result;
    }

    // Check length limits
    const minLength = options.minLength || 0;
    const maxLength = options.maxLength || 10000;
    
    if (trimmedText.length < minLength) {
      result.isValid = false;
      result.errors.push(`Text must be at least ${minLength} characters`);
    }

    if (trimmedText.length > maxLength) {
      result.isValid = false;
      result.errors.push(`Text must be no more than ${maxLength} characters`);
    }

    // Check pattern if specified
    const pattern = this.textPatterns[type];
    if (pattern && trimmedText.length > 0 && !pattern.test(trimmedText)) {
      result.isValid = false;
      result.errors.push(`Invalid ${type} format`);
    }

    // XSS prevention
    const sanitizedText = this.sanitizeText(trimmedText);
    if (sanitizedText !== trimmedText) {
      result.warnings.push('Potentially unsafe content was removed');
    }

    result.sanitizedText = sanitizedText;
    return result;
  }

  /**
   * Sanitize text to prevent XSS attacks
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  sanitizeText(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    let sanitized = text;

    // Remove XSS patterns
    this.xssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Encode HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  /**
   * Validate JSON input
   * @param {string} jsonString - JSON string to validate
   * @param {Object} schema - Optional schema validation
   * @returns {Object} Validation result
   */
  validateJson(jsonString, schema = null) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      parsedData: null,
    };

    if (!jsonString || typeof jsonString !== 'string') {
      result.isValid = false;
      result.errors.push('JSON string is required');
      return result;
    }

    try {
      const parsed = JSON.parse(jsonString);
      result.parsedData = parsed;

      // Check for potentially dangerous properties
      const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
      const hasDangerousKeys = this.checkForDangerousKeys(parsed, dangerousKeys);
      
      if (hasDangerousKeys) {
        result.isValid = false;
        result.errors.push('JSON contains potentially dangerous properties');
        return result;
      }

      // Basic schema validation if provided
      if (schema) {
        const schemaValidation = this.validateAgainstSchema(parsed, schema);
        if (!schemaValidation.isValid) {
          result.isValid = false;
          result.errors.push(...schemaValidation.errors);
        }
      }

    } catch (error) {
      result.isValid = false;
      result.errors.push('Invalid JSON format');
    }

    return result;
  }

  /**
   * Validate form data
   * @param {Object} formData - Form data to validate
   * @param {Object} rules - Validation rules
   * @returns {Object} Validation result
   */
  validateFormData(formData, rules) {
    const result = {
      isValid: true,
      errors: {},
      warnings: {},
      sanitizedData: {},
    };

    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field];
      const fieldValidation = this.validateText(value, rule.type, rule.options);
      
      if (!fieldValidation.isValid) {
        result.isValid = false;
        result.errors[field] = fieldValidation.errors;
      }

      if (fieldValidation.warnings.length > 0) {
        result.warnings[field] = fieldValidation.warnings;
      }

      result.sanitizedData[field] = fieldValidation.sanitizedText;
    }

    return result;
  }

  /**
   * Check for dangerous keys in object
   * @param {any} obj - Object to check
   * @param {Array} dangerousKeys - Keys to check for
   * @returns {boolean} Whether dangerous keys were found
   */
  checkForDangerousKeys(obj, dangerousKeys) {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    if (Array.isArray(obj)) {
      return obj.some(item => this.checkForDangerousKeys(item, dangerousKeys));
    }

    for (const key of Object.keys(obj)) {
      if (dangerousKeys.includes(key)) {
        return true;
      }
      
      if (this.checkForDangerousKeys(obj[key], dangerousKeys)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Basic schema validation
   * @param {any} data - Data to validate
   * @param {Object} schema - Schema to validate against
   * @returns {Object} Validation result
   */
  validateAgainstSchema(data, schema) {
    const result = {
      isValid: true,
      errors: [],
    };

    if (schema.type && typeof data !== schema.type) {
      result.isValid = false;
      result.errors.push(`Expected type ${schema.type}, got ${typeof data}`);
    }

    if (schema.required && Array.isArray(schema.required)) {
      for (const requiredField of schema.required) {
        if (!(requiredField in data)) {
          result.isValid = false;
          result.errors.push(`Required field '${requiredField}' is missing`);
        }
      }
    }

    return result;
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Create validation rules for common form fields
   * @returns {Object} Common validation rules
   */
  getCommonValidationRules() {
    return {
      email: {
        type: 'email',
        options: { required: true, maxLength: 254 },
      },
      name: {
        type: 'name',
        options: { required: true, minLength: 1, maxLength: 100 },
      },
      phone: {
        type: 'phone',
        options: { required: false, maxLength: 20 },
      },
      jobTitle: {
        type: 'alphanumeric',
        options: { required: true, minLength: 2, maxLength: 100 },
      },
      company: {
        type: 'alphanumeric',
        options: { required: true, minLength: 1, maxLength: 100 },
      },
      description: {
        type: 'safeText',
        options: { required: false, maxLength: 5000 },
      },
      url: {
        type: 'safeText',
        options: { required: false, maxLength: 2048 },
      },
    };
  }
}

export default InputValidator;