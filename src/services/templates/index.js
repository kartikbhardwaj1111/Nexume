/**
 * Templates Service Index
 * Exports all template-related services and utilities
 */

export { templateEngine, default as TemplateEngine } from './TemplateEngine.js';
export { templateDataManager, default as TemplateDataManager } from './TemplateDataManager.js';
export { templateExporter, default as TemplateExporter } from './TemplateExporter.js';
export { default as TemplateGenerators } from './TemplateGenerators.js';

// Re-export template categories for convenience
export { 
  templateCategories, 
  getAllTemplates, 
  getTemplatesByCategory, 
  getTemplatesByStyle, 
  getTemplateById,
  getTemplateStats
} from '../../templates/categories/index.js';

/**
 * Initialize template services
 */
export const initializeTemplateServices = () => {
  // Template engine is initialized automatically
  // Template data manager is initialized automatically
  return {
    templateEngine,
    templateDataManager
  };
};

/**
 * Get template service status
 */
export const getTemplateServiceStatus = () => {
  const templates = templateEngine.getTemplates();
  const analytics = templateDataManager.getTemplateAnalytics();
  
  return {
    isReady: templates.length > 0,
    templateCount: templates.length,
    categoryCount: analytics.categories.length,
    averageAtsScore: analytics.overview.averageAtsScore,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Template service configuration
 */
export const TEMPLATE_SERVICE_CONFIG = {
  version: '1.0.0',
  supportedFormats: ['html', 'pdf', 'docx'],
  supportedStyles: ['modern', 'classic', 'minimal', 'creative'],
  supportedCategories: ['tech', 'finance', 'healthcare', 'marketing', 'education'],
  features: {
    customization: true,
    preview: true,
    export: true,
    analytics: true,
    search: true,
    recommendations: true
  }
};