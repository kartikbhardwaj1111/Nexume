/**
 * Services Index
 * Central export point for all services
 */

// AI Services
export { aiServiceManager, default as AIServiceManager } from './ai/AIServiceManager.js';

// Job Services
export { jobExtractor, default as JobExtractor } from './job/JobExtractor.js';

// Template Services
export { templateEngine, default as TemplateEngine } from './templates/TemplateEngine.js';

// Integration Services
export { FeatureIntegrationService } from './integration/FeatureIntegrationService.js';

// Service instances for easy access
export const services = {
  ai: () => import('./ai/AIServiceManager.js').then(m => m.aiServiceManager),
  job: () => import('./job/JobExtractor.js').then(m => m.jobExtractor),
  template: () => import('./templates/TemplateEngine.js').then(m => m.templateEngine),
  integration: () => import('./integration/FeatureIntegrationService.js').then(m => new m.FeatureIntegrationService())
};

// Service status checker
export async function getServiceStatus() {
  try {
    const [ai, job, template] = await Promise.all([
      services.ai(),
      services.job(),
      services.template()
    ]);

    return {
      ai: {
        available: true,
        status: ai.getCurrentService(),
        name: 'AI Service Manager'
      },
      job: {
        available: true,
        supportedSites: job.getSupportedSites(),
        name: 'Job Extractor'
      },
      template: {
        available: true,
        templateCount: job.getTemplates().length,
        name: 'Template Engine'
      }
    };
  } catch (error) {
    console.error('Service status check failed:', error);
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize all services
export async function initializeServices() {
  try {
    console.log('Initializing Career Acceleration Platform services...');
    
    // Pre-load service instances
    await Promise.all([
      services.ai(),
      services.job(),
      services.template()
    ]);
    
    console.log('✅ All services initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    return false;
  }
}