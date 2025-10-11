/**
 * Compression utilities for data and API responses
 */

// Text compression using LZ-string algorithm (simplified implementation)
export class TextCompressor {
  constructor() {
    this.dictionary = new Map();
    this.compressionRatio = 0;
  }

  // Simple compression using dictionary-based approach
  compress(text) {
    if (typeof text !== 'string') {
      return text;
    }

    try {
      // For small texts, compression might not be beneficial
      if (text.length < 100) {
        return text;
      }

      // Use built-in compression if available
      if ('CompressionStream' in window) {
        return this.compressWithStreams(text);
      }

      // Fallback to simple dictionary compression
      return this.dictionaryCompress(text);
    } catch (error) {
      console.warn('Compression failed, returning original text:', error);
      return text;
    }
  }

  // Decompress text
  decompress(compressedData) {
    if (typeof compressedData === 'string') {
      return compressedData; // Not compressed
    }

    try {
      if (compressedData.type === 'stream') {
        return this.decompressWithStreams(compressedData.data);
      }

      if (compressedData.type === 'dictionary') {
        return this.dictionaryDecompress(compressedData);
      }

      return compressedData;
    } catch (error) {
      console.warn('Decompression failed:', error);
      return compressedData;
    }
  }

  // Compress using Compression Streams API
  async compressWithStreams(text) {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    writer.write(new TextEncoder().encode(text));
    writer.close();

    const chunks = [];
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        chunks.push(value);
      }
    }

    return {
      type: 'stream',
      data: chunks,
      originalSize: text.length,
      compressedSize: chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    };
  }

  // Dictionary-based compression
  dictionaryCompress(text) {
    const words = text.split(/\s+/);
    const dictionary = new Map();
    const compressed = [];
    let dictIndex = 0;

    words.forEach(word => {
      if (!dictionary.has(word)) {
        dictionary.set(word, dictIndex++);
      }
      compressed.push(dictionary.get(word));
    });

    return {
      type: 'dictionary',
      dictionary: Array.from(dictionary.entries()),
      compressed,
      originalSize: text.length,
      compressedSize: JSON.stringify(compressed).length
    };
  }

  // Dictionary-based decompression
  dictionaryDecompress(compressedData) {
    const { dictionary, compressed } = compressedData;
    const wordMap = new Map(dictionary);
    const reverseMap = new Map();

    wordMap.forEach((index, word) => {
      reverseMap.set(index, word);
    });

    return compressed.map(index => reverseMap.get(index)).join(' ');
  }
}

// JSON compression for API responses
export class JSONCompressor {
  constructor() {
    this.compressor = new TextCompressor();
  }

  // Compress JSON data
  compressJSON(data) {
    try {
      const jsonString = JSON.stringify(data);
      const compressed = this.compressor.compress(jsonString);
      
      return {
        compressed: true,
        data: compressed,
        originalSize: jsonString.length,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('JSON compression failed:', error);
      return data;
    }
  }

  // Decompress JSON data
  decompressJSON(compressedData) {
    if (!compressedData.compressed) {
      return compressedData;
    }

    try {
      const decompressed = this.compressor.decompress(compressedData.data);
      return JSON.parse(decompressed);
    } catch (error) {
      console.warn('JSON decompression failed:', error);
      return compressedData;
    }
  }

  // Compress object properties selectively
  compressObjectProperties(obj, propertiesToCompress = []) {
    const result = { ...obj };

    propertiesToCompress.forEach(prop => {
      if (result[prop] && typeof result[prop] === 'string') {
        result[prop] = this.compressor.compress(result[prop]);
      }
    });

    return result;
  }
}

// Cache compression for localStorage
export class CacheCompressor {
  constructor() {
    this.jsonCompressor = new JSONCompressor();
    this.compressionThreshold = 1000; // Compress items larger than 1KB
  }

  // Set compressed item in localStorage
  setCompressed(key, data) {
    try {
      const serialized = JSON.stringify(data);
      
      if (serialized.length > this.compressionThreshold) {
        const compressed = this.jsonCompressor.compressJSON(data);
        localStorage.setItem(key, JSON.stringify(compressed));
      } else {
        localStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.warn('Failed to set compressed cache item:', error);
    }
  }

  // Get and decompress item from localStorage
  getCompressed(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      if (parsed.compressed) {
        return this.jsonCompressor.decompressJSON(parsed);
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to get compressed cache item:', error);
      return null;
    }
  }

  // Get cache statistics
  getCacheStats() {
    const stats = {
      totalItems: 0,
      compressedItems: 0,
      totalSize: 0,
      compressedSize: 0,
      compressionRatio: 0
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const item = localStorage.getItem(key);
      
      if (item) {
        stats.totalItems++;
        stats.totalSize += item.length;

        try {
          const parsed = JSON.parse(item);
          if (parsed.compressed) {
            stats.compressedItems++;
            stats.compressedSize += parsed.data.compressedSize || 0;
          }
        } catch (e) {
          // Not JSON, skip
        }
      }
    }

    if (stats.totalSize > 0) {
      stats.compressionRatio = (stats.compressedSize / stats.totalSize) * 100;
    }

    return stats;
  }
}

// Network request compression
export class NetworkCompressor {
  constructor() {
    this.jsonCompressor = new JSONCompressor();
  }

  // Compress request payload
  compressRequest(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Compress large text fields
    const textFields = ['description', 'content', 'resume', 'jobDescription'];
    return this.jsonCompressor.compressObjectProperties(data, textFields);
  }

  // Decompress response data
  decompressResponse(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (data.compressed) {
      return this.jsonCompressor.decompressJSON(data);
    }

    return data;
  }

  // Add compression headers to fetch requests
  addCompressionHeaders(headers = {}) {
    return {
      ...headers,
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Encoding': 'gzip'
    };
  }
}

// Batch compression for multiple items
export class BatchCompressor {
  constructor() {
    this.jsonCompressor = new JSONCompressor();
    this.batchSize = 10;
  }

  // Compress items in batches
  async compressBatch(items) {
    const results = [];
    
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);
      
      const batchResults = await Promise.all(
        batch.map(item => this.compressItem(item))
      );
      
      results.push(...batchResults);
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }

  // Compress single item
  async compressItem(item) {
    return new Promise(resolve => {
      setTimeout(() => {
        const compressed = this.jsonCompressor.compressJSON(item);
        resolve(compressed);
      }, 0);
    });
  }
}

// Compression utilities for different data types
export const compressionUtils = {
  // Compress resume data
  compressResume: (resumeData) => {
    const compressor = new JSONCompressor();
    const textFields = ['summary', 'experience', 'education', 'skills'];
    return compressor.compressObjectProperties(resumeData, textFields);
  },

  // Compress job description
  compressJobDescription: (jobData) => {
    const compressor = new JSONCompressor();
    const textFields = ['description', 'requirements', 'responsibilities'];
    return compressor.compressObjectProperties(jobData, textFields);
  },

  // Compress template data
  compressTemplate: (templateData) => {
    const compressor = new JSONCompressor();
    const textFields = ['html', 'css', 'content'];
    return compressor.compressObjectProperties(templateData, textFields);
  },

  // Compress analytics data
  compressAnalytics: (analyticsData) => {
    const compressor = new JSONCompressor();
    return compressor.compressJSON(analyticsData);
  }
};

export default {
  TextCompressor,
  JSONCompressor,
  CacheCompressor,
  NetworkCompressor,
  BatchCompressor,
  compressionUtils
};