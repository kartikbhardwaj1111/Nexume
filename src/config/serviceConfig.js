// Service Configuration for AI, Job Extraction, and External APIs

export const aiServiceConfig = {
  huggingface: {
    name: 'HuggingFace',
    endpoint: 'https://api-inference.huggingface.co/models',
    priority: 1,
    timeout: 30000,
    retryAttempts: 3,
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerHour: 1000
    }
  },
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    priority: 2,
    timeout: 30000,
    retryAttempts: 3,
    rateLimit: {
      requestsPerMinute: 20,
      requestsPerHour: 500
    }
  },
  ruleBased: {
    name: 'Rule-Based Analysis',
    priority: 3,
    timeout: 5000,
    retryAttempts: 1,
    offline: true
  }
};

export const jobSiteSelectors = {
  'linkedin.com': {
    domain: 'linkedin.com',
    name: 'LinkedIn',
    selectors: {
      title: '.top-card-layout__title',
      company: '.topcard__org-name-link',
      description: '.description__text',
      requirements: '.description__text',
      location: '.topcard__flavor--bullet'
    },
    extractionRules: {
      requirementsPattern: /requirements?:?\s*(.*?)(?=responsibilities?|qualifications?|$)/i,
      skillsPattern: /skills?:?\s*(.*?)(?=experience|education|$)/i,
      experiencePattern: /(\d+)[\+\-\s]*years?\s*(?:of\s*)?experience/i
    }
  },
  'indeed.com': {
    domain: 'indeed.com',
    name: 'Indeed',
    selectors: {
      title: '[data-testid="jobsearch-JobInfoHeader-title"]',
      company: '[data-testid="inlineHeader-companyName"]',
      description: '#jobDescriptionText',
      requirements: '#jobDescriptionText',
      location: '[data-testid="job-location"]'
    },
    extractionRules: {
      requirementsPattern: /requirements?:?\s*(.*?)(?=responsibilities?|qualifications?|$)/i,
      skillsPattern: /skills?:?\s*(.*?)(?=experience|education|$)/i,
      experiencePattern: /(\d+)[\+\-\s]*years?\s*(?:of\s*)?experience/i
    }
  },
  'glassdoor.com': {
    domain: 'glassdoor.com',
    name: 'Glassdoor',
    selectors: {
      title: '[data-test="job-title"]',
      company: '[data-test="employer-name"]',
      description: '#JobDescriptionContainer',
      requirements: '#JobDescriptionContainer',
      location: '[data-test="job-location"]'
    },
    extractionRules: {
      requirementsPattern: /requirements?:?\s*(.*?)(?=responsibilities?|qualifications?|$)/i,
      skillsPattern: /skills?:?\s*(.*?)(?=experience|education|$)/i,
      experiencePattern: /(\d+)[\+\-\s]*years?\s*(?:of\s*)?experience/i
    }
  }
};

export const templateConfig = {
  categories: {
    tech: {
      name: 'Technology',
      description: 'Templates optimized for software engineering, data science, and IT roles',
      keywords: ['programming', 'software', 'development', 'engineering', 'data', 'IT']
    },
    finance: {
      name: 'Finance',
      description: 'Templates for banking, accounting, and financial services',
      keywords: ['finance', 'banking', 'accounting', 'investment', 'analyst']
    },
    healthcare: {
      name: 'Healthcare',
      description: 'Templates for medical, nursing, and healthcare administration',
      keywords: ['medical', 'healthcare', 'nursing', 'clinical', 'patient']
    },
    marketing: {
      name: 'Marketing',
      description: 'Templates for digital marketing, content, and brand management',
      keywords: ['marketing', 'digital', 'content', 'brand', 'social media']
    },
    education: {
      name: 'Education',
      description: 'Templates for teaching, administration, and educational roles',
      keywords: ['teaching', 'education', 'academic', 'curriculum', 'student']
    }
  },
  atsOptimization: {
    fonts: ['Arial', 'Calibri', 'Times New Roman', 'Helvetica'],
    maxColors: 2,
    minFontSize: 10,
    maxFontSize: 14,
    requiredSections: ['contact', 'experience', 'education', 'skills']
  }
};

export const careerPathsConfig = {
  progressionRules: {
    experienceMultiplier: 1.2,
    skillGapWeight: 0.3,
    marketDemandWeight: 0.4,
    educationWeight: 0.3
  },
  timelineEstimates: {
    skillAcquisition: {
      beginner: 4, // weeks
      intermediate: 8,
      advanced: 16,
      expert: 32
    },
    roleTransition: {
      lateral: 12, // weeks
      promotion: 24,
      careerChange: 52
    }
  }
};