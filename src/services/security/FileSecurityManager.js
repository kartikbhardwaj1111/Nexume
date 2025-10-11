/**
 * File Security Manager
 * Advanced file upload security and validation
 */

import InputValidator from './InputValidator.js';

class FileSecurityManager {
  constructor() {
    this.validator = new InputValidator();
    this.maxConcurrentUploads = 3;
    this.activeUploads = new Set();
    
    // File signature patterns for type verification
    this.fileSignatures = {
      'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
      'application/msword': [0xD0, 0xCF, 0x11, 0xE0], // MS Office
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4B, 0x03, 0x04], // ZIP-based
      'text/plain': null, // No specific signature
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/gif': [0x47, 0x49, 0x46],
    };

    // Suspicious content patterns
    this.suspiciousPatterns = [
      // Executable signatures
      [0x4D, 0x5A], // MZ (PE executable)
      [0x7F, 0x45, 0x4C, 0x46], // ELF executable
      [0xCA, 0xFE, 0xBA, 0xBE], // Java class file
      [0xFE, 0xED, 0xFA, 0xCE], // Mach-O executable
      
      // Script patterns in text
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];
  }

  /**
   * Comprehensive file security validation
   * @param {File} file - File to validate
   * @param {string} category - File category
   * @returns {Promise<Object>} Validation result
   */
  async validateFileSecurely(file, category = 'general') {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      securityChecks: {
        basicValidation: false,
        typeVerification: false,
        contentScan: false,
        malwareCheck: false,
      },
    };

    try {
      // Step 1: Basic validation
      const basicValidation = this.validator.validateFile(file, category);
      result.securityChecks.basicValidation = basicValidation.isValid;
      
      if (!basicValidation.isValid) {
        result.isValid = false;
        result.errors.push(...basicValidation.errors);
        return result;
      }

      result.warnings.push(...basicValidation.warnings);

      // Step 2: File type verification by content
      const typeVerification = await this.verifyFileType(file);
      result.securityChecks.typeVerification = typeVerification.isValid;
      
      if (!typeVerification.isValid) {
        result.isValid = false;
        result.errors.push(...typeVerification.errors);
        return result;
      }

      result.warnings.push(...typeVerification.warnings);

      // Step 3: Content scanning
      const contentScan = await this.scanFileContent(file, category);
      result.securityChecks.contentScan = contentScan.isValid;
      
      if (!contentScan.isValid) {
        result.isValid = false;
        result.errors.push(...contentScan.errors);
        return result;
      }

      result.warnings.push(...contentScan.warnings);

      // Step 4: Basic malware detection
      const malwareCheck = await this.basicMalwareDetection(file);
      result.securityChecks.malwareCheck = malwareCheck.isValid;
      
      if (!malwareCheck.isValid) {
        result.isValid = false;
        result.errors.push(...malwareCheck.errors);
        return result;
      }

      result.warnings.push(...malwareCheck.warnings);

    } catch (error) {
      result.isValid = false;
      result.errors.push('Security validation failed: ' + error.message);
    }

    return result;
  }

  /**
   * Verify file type by examining file content
   * @param {File} file - File to verify
   * @returns {Promise<Object>} Verification result
   */
  async verifyFileType(file) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Read first 512 bytes for signature checking
      const buffer = await this.readFileBytes(file, 0, 512);
      const signature = this.fileSignatures[file.type];

      if (signature) {
        const matches = signature.every((byte, index) => buffer[index] === byte);
        
        if (!matches) {
          // Check if it might be a different valid type
          const detectedType = this.detectFileTypeBySignature(buffer);
          
          if (detectedType && detectedType !== file.type) {
            result.warnings.push(`File appears to be ${detectedType} but uploaded as ${file.type}`);
          } else {
            result.isValid = false;
            result.errors.push('File content does not match declared file type');
          }
        }
      }

      // Additional checks for specific file types
      if (file.type.startsWith('text/')) {
        const textValidation = await this.validateTextFile(file);
        if (!textValidation.isValid) {
          result.isValid = false;
          result.errors.push(...textValidation.errors);
        }
      }

    } catch (error) {
      result.warnings.push('Could not verify file type: ' + error.message);
    }

    return result;
  }

  /**
   * Scan file content for suspicious patterns
   * @param {File} file - File to scan
   * @param {string} category - File category
   * @returns {Promise<Object>} Scan result
   */
  async scanFileContent(file, category) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // For text files, scan the entire content
      if (file.type.startsWith('text/') || category === 'resume') {
        const content = await this.readFileAsText(file);
        const contentValidation = this.validator.validateText(content, 'safeText', {
          maxLength: 1000000, // 1MB text limit
        });

        if (!contentValidation.isValid) {
          result.isValid = false;
          result.errors.push(...contentValidation.errors);
        }

        // Check for suspicious patterns in text
        const hasSuspiciousContent = this.suspiciousPatterns.some(pattern => {
          if (pattern instanceof RegExp) {
            return pattern.test(content);
          }
          return false;
        });

        if (hasSuspiciousContent) {
          result.isValid = false;
          result.errors.push('File contains potentially malicious content');
        }
      }

      // For binary files, scan first few KB
      else {
        const buffer = await this.readFileBytes(file, 0, 8192); // First 8KB
        const hasSuspiciousBytes = this.suspiciousPatterns.some(pattern => {
          if (Array.isArray(pattern)) {
            return this.findBytePattern(buffer, pattern);
          }
          return false;
        });

        if (hasSuspiciousBytes) {
          result.isValid = false;
          result.errors.push('File contains suspicious binary patterns');
        }
      }

    } catch (error) {
      result.warnings.push('Could not scan file content: ' + error.message);
    }

    return result;
  }

  /**
   * Basic malware detection using heuristics
   * @param {File} file - File to check
   * @returns {Promise<Object>} Detection result
   */
  async basicMalwareDetection(file) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Check file entropy (high entropy might indicate encryption/packing)
      const entropy = await this.calculateFileEntropy(file);
      
      if (entropy > 7.5) {
        result.warnings.push('File has high entropy, might be compressed or encrypted');
      }

      // Check for suspicious file characteristics
      const suspiciousChecks = [
        this.checkSuspiciousFileName(file.name),
        this.checkSuspiciousSize(file.size, file.type),
        await this.checkSuspiciousMetadata(file),
      ];

      const suspiciousCount = suspiciousChecks.filter(check => check.suspicious).length;
      
      if (suspiciousCount >= 2) {
        result.isValid = false;
        result.errors.push('File exhibits multiple suspicious characteristics');
      } else if (suspiciousCount === 1) {
        result.warnings.push('File exhibits some suspicious characteristics');
      }

    } catch (error) {
      result.warnings.push('Could not perform malware detection: ' + error.message);
    }

    return result;
  }

  /**
   * Read specific bytes from file
   * @param {File} file - File to read
   * @param {number} start - Start position
   * @param {number} length - Number of bytes to read
   * @returns {Promise<Uint8Array>} File bytes
   */
  async readFileBytes(file, start, length) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const blob = file.slice(start, start + length);
      
      reader.onload = () => {
        resolve(new Uint8Array(reader.result));
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(blob);
    });
  }

  /**
   * Read file as text
   * @param {File} file - File to read
   * @returns {Promise<string>} File content
   */
  async readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file as text'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Detect file type by signature
   * @param {Uint8Array} buffer - File buffer
   * @returns {string|null} Detected MIME type
   */
  detectFileTypeBySignature(buffer) {
    for (const [mimeType, signature] of Object.entries(this.fileSignatures)) {
      if (signature && signature.every((byte, index) => buffer[index] === byte)) {
        return mimeType;
      }
    }
    return null;
  }

  /**
   * Find byte pattern in buffer
   * @param {Uint8Array} buffer - Buffer to search
   * @param {Array} pattern - Byte pattern to find
   * @returns {boolean} Whether pattern was found
   */
  findBytePattern(buffer, pattern) {
    for (let i = 0; i <= buffer.length - pattern.length; i++) {
      if (pattern.every((byte, index) => buffer[i + index] === byte)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Calculate file entropy
   * @param {File} file - File to analyze
   * @returns {Promise<number>} Entropy value
   */
  async calculateFileEntropy(file) {
    try {
      const sampleSize = Math.min(file.size, 8192); // Sample first 8KB
      const buffer = await this.readFileBytes(file, 0, sampleSize);
      
      const frequency = new Array(256).fill(0);
      
      for (let i = 0; i < buffer.length; i++) {
        frequency[buffer[i]]++;
      }
      
      let entropy = 0;
      for (let i = 0; i < 256; i++) {
        if (frequency[i] > 0) {
          const probability = frequency[i] / buffer.length;
          entropy -= probability * Math.log2(probability);
        }
      }
      
      return entropy;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check for suspicious file name patterns
   * @param {string} fileName - File name to check
   * @returns {Object} Check result
   */
  checkSuspiciousFileName(fileName) {
    const suspicious = [
      fileName.includes('..'), // Path traversal
      fileName.includes('\\'), // Windows path separators
      fileName.includes('/'), // Unix path separators
      fileName.length > 255, // Extremely long names
      /[<>:"|?*]/.test(fileName), // Invalid characters
      /\.(exe|bat|cmd|scr|pif|com|jar|vbs|js)$/i.test(fileName), // Executable extensions
    ].some(check => check);

    return { suspicious, reason: suspicious ? 'Suspicious file name pattern' : null };
  }

  /**
   * Check for suspicious file size
   * @param {number} size - File size
   * @param {string} type - File type
   * @returns {Object} Check result
   */
  checkSuspiciousSize(size, type) {
    let suspicious = false;
    let reason = null;

    // Extremely small files might be suspicious
    if (size < 10 && !type.startsWith('text/')) {
      suspicious = true;
      reason = 'Unusually small file size';
    }

    // Check for size/type mismatches
    if (type === 'application/pdf' && size < 100) {
      suspicious = true;
      reason = 'PDF file too small to be valid';
    }

    return { suspicious, reason };
  }

  /**
   * Check file metadata for suspicious patterns
   * @param {File} file - File to check
   * @returns {Promise<Object>} Check result
   */
  async checkSuspiciousMetadata(file) {
    let suspicious = false;
    let reason = null;

    // Check last modified date
    if (file.lastModified) {
      const modifiedDate = new Date(file.lastModified);
      const now = new Date();
      
      // File modified in the future
      if (modifiedDate > now) {
        suspicious = true;
        reason = 'File modified date is in the future';
      }
      
      // File modified more than 50 years ago
      const fiftyYearsAgo = new Date(now.getFullYear() - 50, 0, 1);
      if (modifiedDate < fiftyYearsAgo) {
        suspicious = true;
        reason = 'File modified date is suspiciously old';
      }
    }

    return { suspicious, reason };
  }

  /**
   * Validate text file content
   * @param {File} file - Text file to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateTextFile(file) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      const content = await this.readFileAsText(file);
      
      // Check for null bytes (shouldn't be in text files)
      if (content.includes('\0')) {
        result.isValid = false;
        result.errors.push('Text file contains null bytes');
      }

      // Check for extremely long lines (potential DoS)
      const lines = content.split('\n');
      const maxLineLength = 10000;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > maxLineLength) {
          result.warnings.push(`Line ${i + 1} is extremely long (${lines[i].length} characters)`);
        }
      }

      // Check total line count
      if (lines.length > 100000) {
        result.warnings.push('File has an extremely large number of lines');
      }

    } catch (error) {
      result.errors.push('Failed to validate text file: ' + error.message);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Sanitize file name for safe storage
   * @param {string} fileName - Original file name
   * @returns {string} Sanitized file name
   */
  sanitizeFileName(fileName) {
    return fileName
      .replace(/[<>:"|?*\\\/]/g, '_') // Replace invalid characters
      .replace(/\.\./g, '_') // Remove path traversal
      .replace(/^\.+/, '') // Remove leading dots
      .substring(0, 255) // Limit length
      .trim();
  }

  /**
   * Generate secure file ID
   * @returns {string} Secure file identifier
   */
  generateSecureFileId() {
    return crypto.randomUUID() + '_' + Date.now();
  }
}

export default FileSecurityManager;