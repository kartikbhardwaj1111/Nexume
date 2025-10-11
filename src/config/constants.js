// Platform Constants and Configuration

// AI Service Configuration
export const AI_SERVICES = {
  HUGGING_FACE: 'huggingface',
  OPENAI: 'openai',
  RULE_BASED: 'rule-based'
};

export const SERVICE_PRIORITIES = [
  AI_SERVICES.HUGGING_FACE,
  AI_SERVICES.OPENAI,
  AI_SERVICES.RULE_BASED
];

// Job Site Configuration
export const SUPPORTED_JOB_SITES = {
  LINKEDIN: 'linkedin.com',
  INDEED: 'indeed.com',
  GLASSDOOR: 'glassdoor.com',
  MONSTER: 'monster.com'
};

// Template Categories
export const TEMPLATE_CATEGORIES = {
  TECH: 'tech',
  FINANCE: 'finance',
  HEALTHCARE: 'healthcare',
  MARKETING: 'marketing',
  EDUCATION: 'education',
  SALES: 'sales',
  OPERATIONS: 'operations',
  CREATIVE: 'creative',
  LEGAL: 'legal',
  CONSULTING: 'consulting'
};

// Template Styles
export const TEMPLATE_STYLES = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  CREATIVE: 'creative',
  MINIMAL: 'minimal',
  EXECUTIVE: 'executive'
};

// Experience Levels
export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive'
};

// Skill Levels
export const SKILL_LEVELS = {
  NOVICE: 'novice',
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Question Types
export const QUESTION_TYPES = {
  BEHAVIORAL: 'behavioral',
  TECHNICAL: 'technical',
  SITUATIONAL: 'situational',
  COMPANY_SPECIFIC: 'company-specific',
  CASE_STUDY: 'case-study',
  CODING: 'coding',
  SYSTEM_DESIGN: 'system-design'
};

// API Endpoints and Timeouts
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT_DELAY: 1000
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  RESUME_DATA: 'resume_data',
  CAREER_PROGRESS: 'career_progress',
  INTERVIEW_SESSIONS: 'interview_sessions',
  TEMPLATE_PREFERENCES: 'template_preferences',
  AI_SERVICE_STATUS: 'ai_service_status'
};