/**
 * Gemini AI Configuration
 * Centralized configuration for Google Gemini API
 */

export const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'demo-key-not-functional',
  model: 'gemini-1.5-flash',
  endpoint: 'https://generativelanguage.googleapis.com',
  
  // Generation configuration
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
  
  // Rate limits
  rateLimits: {
    requestsPerMinute: 15,
    requestsPerHour: 1500,
    requestsPerDay: 50000
  },
  
  // Safety settings
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ],
  
  // Retry configuration
  retryConfig: {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000
  }
};

export default GEMINI_CONFIG;