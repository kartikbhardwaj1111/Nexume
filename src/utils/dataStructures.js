// Data Structure Utilities and Factories for JavaScript

// Factory functions for creating consistent data structures

export const createATSScore = (overallScore = 0, breakdown = {}, recommendations = []) => ({
  overall: overallScore,
  breakdown: {
    keywords: breakdown.keywords || 0,
    formatting: breakdown.formatting || 0,
    experience: breakdown.experience || 0,
    skills: breakdown.skills || 0,
    education: breakdown.education || 0,
    ...breakdown
  },
  recommendations: Array.isArray(recommendations) ? recommendations : [],
  confidence: breakdown.confidence || 0.5,
  analysisMethod: breakdown.analysisMethod || 'rule-based',
  processingTime: breakdown.processingTime || 0,
  timestamp: new Date()
});

export const createJobDetails = (data = {}) => ({
  title: data.title || '',
  company: data.company || '',
  requirements: Array.isArray(data.requirements) ? data.requirements : [],
  skills: Array.isArray(data.skills) ? data.skills : [],
  experienceYears: data.experienceYears || 0,
  education: data.education || '',
  location: data.location || '',
  salary: data.salary || null,
  benefits: Array.isArray(data.benefits) ? data.benefits : [],
  jobType: data.jobType || 'full-time',
  industry: data.industry || '',
  department: data.department || '',
  extractedAt: new Date(),
  sourceUrl: data.sourceUrl || '',
  confidence: data.confidence || 0.5
});

export const createTemplate = (data = {}) => ({
  id: data.id || generateId(),
  name: data.name || 'Untitled Template',
  category: data.category || 'tech',
  style: data.style || 'modern',
  atsScore: data.atsScore || 0,
  customizable: data.customizable || {
    colors: true,
    fonts: true,
    layout: true,
    sections: true,
    spacing: true
  },
  preview: data.preview || '',
  metadata: {
    author: data.metadata?.author || 'System',
    version: data.metadata?.version || '1.0.0',
    description: data.metadata?.description || '',
    tags: Array.isArray(data.metadata?.tags) ? data.metadata.tags : [],
    atsOptimized: data.metadata?.atsOptimized || true,
    lastUpdated: new Date(),
    usageCount: data.metadata?.usageCount || 0,
    rating: data.metadata?.rating || 0
  },
  structure: data.structure || createTemplateStructure(),
  styling: data.styling || createTemplateStyling()
});

export const createTemplateStructure = (data = {}) => ({
  sections: Array.isArray(data.sections) ? data.sections : [],
  layout: data.layout || 'single-column',
  pageCount: data.pageCount || 1,
  wordLimit: data.wordLimit || 500
});

export const createTemplateStyling = (data = {}) => ({
  colors: {
    primary: data.colors?.primary || '#000000',
    secondary: data.colors?.secondary || '#666666',
    accent: data.colors?.accent || '#0066cc',
    text: data.colors?.text || '#000000',
    background: data.colors?.background || '#ffffff',
    atsCompliant: data.colors?.atsCompliant !== false
  },
  fonts: {
    heading: {
      family: data.fonts?.heading?.family || 'Arial',
      size: data.fonts?.heading?.size || 14,
      weight: data.fonts?.heading?.weight || 700,
      lineHeight: data.fonts?.heading?.lineHeight || 1.2,
      atsCompliant: data.fonts?.heading?.atsCompliant !== false
    },
    body: {
      family: data.fonts?.body?.family || 'Arial',
      size: data.fonts?.body?.size || 11,
      weight: data.fonts?.body?.weight || 400,
      lineHeight: data.fonts?.body?.lineHeight || 1.4,
      atsCompliant: data.fonts?.body?.atsCompliant !== false
    }
  },
  spacing: {
    margin: data.spacing?.margin || 0.5,
    padding: data.spacing?.padding || 0.25,
    sectionGap: data.spacing?.sectionGap || 0.5,
    itemGap: data.spacing?.itemGap || 0.25
  }
});

export const createUserProfile = (data = {}) => ({
  id: data.id || generateId(),
  personalInfo: {
    firstName: data.personalInfo?.firstName || '',
    lastName: data.personalInfo?.lastName || '',
    email: data.personalInfo?.email || '',
    phone: data.personalInfo?.phone || '',
    location: data.personalInfo?.location || '',
    website: data.personalInfo?.website || '',
    linkedin: data.personalInfo?.linkedin || '',
    github: data.personalInfo?.github || ''
  },
  resume: data.resume || createResumeData(),
  preferences: data.preferences || createUserPreferences(),
  careerGoals: data.careerGoals || createCareerGoals(),
  progress: data.progress || createProgressTracking(),
  createdAt: data.createdAt || new Date(),
  lastActive: new Date()
});

export const createResumeData = (data = {}) => ({
  sections: Array.isArray(data.sections) ? data.sections : [],
  skills: Array.isArray(data.skills) ? data.skills : [],
  experience: Array.isArray(data.experience) ? data.experience : [],
  education: Array.isArray(data.education) ? data.education : [],
  certifications: Array.isArray(data.certifications) ? data.certifications : [],
  projects: Array.isArray(data.projects) ? data.projects : [],
  achievements: Array.isArray(data.achievements) ? data.achievements : [],
  lastUpdated: new Date(),
  version: data.version || 1
});

export const createUserPreferences = (data = {}) => ({
  theme: data.theme || 'system',
  language: data.language || 'en',
  notifications: {
    email: data.notifications?.email !== false,
    browser: data.notifications?.browser !== false,
    careerUpdates: data.notifications?.careerUpdates !== false,
    interviewReminders: data.notifications?.interviewReminders !== false,
    skillRecommendations: data.notifications?.skillRecommendations !== false,
    marketInsights: data.notifications?.marketInsights !== false
  },
  privacy: {
    dataSharing: data.privacy?.dataSharing === true,
    analytics: data.privacy?.analytics !== false,
    profileVisibility: data.privacy?.profileVisibility || 'private',
    resumeSharing: data.privacy?.resumeSharing === true,
    careerDataSharing: data.privacy?.careerDataSharing === true
  },
  ai: {
    preferredService: data.ai?.preferredService || 'huggingface',
    fallbackEnabled: data.ai?.fallbackEnabled !== false,
    confidenceThreshold: data.ai?.confidenceThreshold || 0.7,
    detailedFeedback: data.ai?.detailedFeedback !== false,
    autoAnalysis: data.ai?.autoAnalysis === true
  }
});

export const createCareerGoals = (data = {}) => ({
  targetRole: data.targetRole || '',
  targetCompany: data.targetCompany || '',
  targetIndustry: data.targetIndustry || '',
  targetSalary: data.targetSalary || null,
  timeframe: data.timeframe || 12, // months
  priorities: Array.isArray(data.priorities) ? data.priorities : [],
  willingToRelocate: data.willingToRelocate === true,
  remotePreference: data.remotePreference || 'flexible'
});

export const createProgressTracking = (data = {}) => ({
  careerProgress: {
    currentPhase: data.careerProgress?.currentPhase || 'exploring',
    completedMilestones: Array.isArray(data.careerProgress?.completedMilestones) 
      ? data.careerProgress.completedMilestones : [],
    nextMilestone: data.careerProgress?.nextMilestone || '',
    overallProgress: data.careerProgress?.overallProgress || 0,
    estimatedCompletion: data.careerProgress?.estimatedCompletion || null,
    lastUpdated: new Date()
  },
  skillProgress: Array.isArray(data.skillProgress) ? data.skillProgress : [],
  interviewProgress: {
    totalSessions: data.interviewProgress?.totalSessions || 0,
    averageScore: data.interviewProgress?.averageScore || 0,
    bestScore: data.interviewProgress?.bestScore || 0,
    improvementRate: data.interviewProgress?.improvementRate || 0,
    readinessLevel: data.interviewProgress?.readinessLevel || 'beginner',
    strongAreas: Array.isArray(data.interviewProgress?.strongAreas) 
      ? data.interviewProgress.strongAreas : [],
    improvementAreas: Array.isArray(data.interviewProgress?.improvementAreas) 
      ? data.interviewProgress.improvementAreas : [],
    lastSession: data.interviewProgress?.lastSession || null
  },
  resumeProgress: {
    atsScore: data.resumeProgress?.atsScore || 0,
    atsScoreHistory: Array.isArray(data.resumeProgress?.atsScoreHistory) 
      ? data.resumeProgress.atsScoreHistory : [],
    templatesUsed: Array.isArray(data.resumeProgress?.templatesUsed) 
      ? data.resumeProgress.templatesUsed : [],
    optimizationLevel: data.resumeProgress?.optimizationLevel || 'basic',
    lastOptimized: data.resumeProgress?.lastOptimized || null
  },
  achievements: Array.isArray(data.achievements) ? data.achievements : []
});

// Utility functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};