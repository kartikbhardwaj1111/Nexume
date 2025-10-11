/**
 * Interface definitions and data structures for the Career Acceleration Platform
 * These serve as documentation and validation schemas for the application
 */

// AI Service Manager Configuration
export const AI_SERVICE_CONFIG = {
  services: {
    GEMINI: {
      name: 'Google Gemini',
      priority: 1,
      endpoint: 'https://generativelanguage.googleapis.com',
      models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
      apiKey: null // API key should be loaded from environment variables
    },
    HUGGING_FACE: {
      name: 'HuggingFace',
      priority: 2,
      endpoint: 'https://api-inference.huggingface.co',
      models: ['microsoft/DialoGPT-medium', 'facebook/blenderbot-400M-distill']
    },
    OPENAI_FREE: {
      name: 'OpenAI Free Tier',
      priority: 3,
      endpoint: 'https://api.openai.com/v1',
      models: ['gpt-3.5-turbo']
    }
  },
  fallbackMethods: ['rule-based', 'content-analysis', 'offline'],
  rateLimit: {
    requestsPerMinute: 15,
    requestsPerHour: 1500,
    requestsPerDay: 50000
  }
};

// Job Extraction Configuration
export const JOB_EXTRACTION_CONFIG = {
  supportedSites: {
    LINKEDIN: {
      domain: 'linkedin.com',
      selectors: {
        title: '.top-card-layout__title',
        company: '.topcard__org-name-link',
        location: '.topcard__flavor--bullet',
        description: '.description__text',
        requirements: '.description__text'
      }
    },
    INDEED: {
      domain: 'indeed.com',
      selectors: {
        title: '[data-jk] h1',
        company: '[data-testid="inlineHeader-companyName"]',
        location: '[data-testid="job-location"]',
        description: '#jobDescriptionText'
      }
    },
    GLASSDOOR: {
      domain: 'glassdoor.com',
      selectors: {
        title: '[data-test="job-title"]',
        company: '[data-test="employer-name"]',
        location: '[data-test="job-location"]',
        description: '[data-test="jobDescriptionContent"]'
      }
    },
    MONSTER: {
      domain: 'monster.com',
      selectors: {
        title: '.job-header-title',
        company: '.company-name',
        location: '.location',
        description: '.job-description'
      }
    }
  },
  extractionMethods: ['css', 'ai', 'hybrid'],
  timeout: 45000 // 45 seconds
};

// Resume Template Configuration
export const TEMPLATE_CONFIG = {
  categories: {
    TECH: {
      name: 'Technology',
      description: 'Software engineering, data science, DevOps',
      icon: '💻',
      atsOptimized: true
    },
    FINANCE: {
      name: 'Finance',
      description: 'Banking, accounting, investment',
      icon: '💰',
      atsOptimized: true
    },
    HEALTHCARE: {
      name: 'Healthcare',
      description: 'Medical, nursing, administration',
      icon: '🏥',
      atsOptimized: true
    },
    MARKETING: {
      name: 'Marketing',
      description: 'Digital marketing, content, brand management',
      icon: '📈',
      atsOptimized: true
    },
    EDUCATION: {
      name: 'Education',
      description: 'Teaching, administration, research',
      icon: '🎓',
      atsOptimized: true
    }
  },
  styles: ['modern', 'classic', 'creative', 'minimal'],
  layouts: ['single-column', 'two-column', 'three-column'],
  exportFormats: ['pdf', 'docx', 'html'],
  customizationOptions: {
    colors: true,
    fonts: true,
    layout: true,
    sections: true
  }
};

// Career Progression Configuration
export const CAREER_CONFIG = {
  experienceLevels: ['entry', 'mid', 'senior', 'lead', 'executive'],
  skillCategories: ['technical', 'soft', 'industry', 'tool'],
  skillLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
  marketDemandLevels: ['low', 'medium', 'high', 'very-high'],
  learningResourceTypes: ['course', 'book', 'project', 'certification', 'practice'],
  costTypes: ['free', 'paid', 'subscription'],
  difficultyLevels: ['beginner', 'intermediate', 'advanced']
};

// Interview Preparation Configuration
export const INTERVIEW_CONFIG = {
  questionTypes: ['behavioral', 'technical', 'situational', 'company-specific'],
  difficultyLevels: ['easy', 'medium', 'hard'],
  evaluationCriteria: {
    STAR_METHOD: ['situation', 'task', 'action', 'result'],
    COMMUNICATION: ['clarity', 'structure', 'confidence', 'engagement'],
    TECHNICAL: ['accuracy', 'approach', 'explanation', 'optimization']
  },
  sessionDurations: [15, 30, 45, 60], // minutes
  questionDatabase: {
    behavioral: 200,
    technical: 500,
    situational: 150,
    companySpecific: 100
  }
};

// Data Validation Schemas
export const VALIDATION_SCHEMAS = {
  atsScore: {
    overall_score: { type: 'number', min: 0, max: 100, required: true },
    confidence: { type: 'number', min: 0, max: 1, required: true },
    pillars: {
      core_skills: {
        score: { type: 'number', min: 0, max: 40, required: true },
        matched: { type: 'array', required: true },
        required_count: { type: 'number', min: 0, required: true }
      },
      relevant_experience: {
        score: { type: 'number', min: 0, max: 30, required: true },
        candidate_years: { type: 'number', min: 0, required: true },
        jd_years: { type: 'number', min: 0, required: true },
        evidence: { type: 'array', required: true }
      },
      tools_methodologies: {
        score: { type: 'number', min: 0, max: 20, required: true },
        matched: { type: 'array', required: true }
      },
      education_credentials: {
        score: { type: 'number', min: 0, max: 10, required: true },
        degree: { type: 'string', required: true },
        notes: { type: 'string', required: false }
      }
    },
    recommendations: { type: 'array', required: true },
    errors: { type: 'array', required: false }
  },
  
  jobDetails: {
    title: { type: 'string', required: true },
    company: { type: 'string', required: true },
    requirements: { type: 'array', required: true },
    skills: { type: 'array', required: true },
    experienceYears: { type: 'number', min: 0, required: true },
    education: { type: 'string', required: true },
    location: { type: 'string', required: true },
    description: { type: 'string', required: true },
    url: { type: 'string', required: true },
    extractedAt: { type: 'date', required: true }
  },
  
  template: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    category: { type: 'string', enum: Object.keys(TEMPLATE_CONFIG.categories), required: true },
    style: { type: 'string', enum: TEMPLATE_CONFIG.styles, required: true },
    atsScore: { type: 'number', min: 0, max: 100, required: true },
    preview: { type: 'string', required: true }
  }
};

// Error Types and Messages
export const ERROR_TYPES = {
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PARSING_ERROR: 'PARSING_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_PROCESSING_ERROR: 'FILE_PROCESSING_ERROR',
  TEMPLATE_GENERATION_ERROR: 'TEMPLATE_GENERATION_ERROR'
};

export const ERROR_MESSAGES = {
  [ERROR_TYPES.AI_SERVICE_UNAVAILABLE]: 'AI service is temporarily unavailable. Using fallback analysis.',
  [ERROR_TYPES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please try again in a few minutes.',
  [ERROR_TYPES.INVALID_API_KEY]: 'Invalid API key. Please check your configuration.',
  [ERROR_TYPES.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
  [ERROR_TYPES.PARSING_ERROR]: 'Failed to parse response. Please try again.',
  [ERROR_TYPES.VALIDATION_ERROR]: 'Invalid data format. Please check your input.',
  [ERROR_TYPES.FILE_PROCESSING_ERROR]: 'Failed to process file. Please check the file format.',
  [ERROR_TYPES.TEMPLATE_GENERATION_ERROR]: 'Failed to generate template. Please try again.'
};

// Default Values
export const DEFAULT_VALUES = {
  atsScore: {
    overall_score: 0,
    confidence: 0.5,
    pillars: {
      core_skills: { score: 0, matched: [], required_count: 0 },
      relevant_experience: { score: 0, candidate_years: 0, jd_years: 0, evidence: [] },
      tools_methodologies: { score: 0, matched: [] },
      education_credentials: { score: 0, degree: 'Not specified', notes: '' }
    },
    recommendations: [],
    errors: []
  },
  
  userPreferences: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: false,
      browser: true,
      careerUpdates: true,
      interviewReminders: true,
      skillRecommendations: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      profileVisibility: 'private',
      searchable: false
    }
  },
  
  interviewConfig: {
    role: '',
    difficulty: 'medium',
    duration: 30,
    questionTypes: ['behavioral', 'technical'],
    focusAreas: []
  }
};

// Utility Functions for Data Validation
export const validateData = (data, schema) => {
  const errors = [];
  
  const validateField = (value, fieldSchema, fieldName) => {
    if (fieldSchema.required && (value === undefined || value === null)) {
      errors.push(`${fieldName} is required`);
      return;
    }
    
    if (value !== undefined && value !== null) {
      if (fieldSchema.type === 'number') {
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`${fieldName} must be a number`);
        } else {
          if (fieldSchema.min !== undefined && value < fieldSchema.min) {
            errors.push(`${fieldName} must be at least ${fieldSchema.min}`);
          }
          if (fieldSchema.max !== undefined && value > fieldSchema.max) {
            errors.push(`${fieldName} must be at most ${fieldSchema.max}`);
          }
        }
      } else if (fieldSchema.type === 'string') {
        if (typeof value !== 'string') {
          errors.push(`${fieldName} must be a string`);
        } else if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
          errors.push(`${fieldName} must be one of: ${fieldSchema.enum.join(', ')}`);
        }
      } else if (fieldSchema.type === 'array') {
        if (!Array.isArray(value)) {
          errors.push(`${fieldName} must be an array`);
        }
      } else if (fieldSchema.type === 'date') {
        if (!(value instanceof Date) && !Date.parse(value)) {
          errors.push(`${fieldName} must be a valid date`);
        }
      }
    }
  };
  
  const validateObject = (obj, objSchema, prefix = '') => {
    for (const [key, fieldSchema] of Object.entries(objSchema)) {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      const value = obj?.[key];
      
      if (typeof fieldSchema === 'object' && fieldSchema.type) {
        validateField(value, fieldSchema, fieldName);
      } else if (typeof fieldSchema === 'object') {
        validateObject(value, fieldSchema, fieldName);
      }
    }
  };
  
  validateObject(data, schema);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to create default data structures
export const createDefaultData = (type) => {
  return JSON.parse(JSON.stringify(DEFAULT_VALUES[type] || {}));
};