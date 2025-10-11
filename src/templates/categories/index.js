/**
 * Template Categories Index
 * Exports all template categories for the resume template library
 */

import { techTemplates } from './tech.js';
import { financeTemplates } from './finance.js';
import { healthcareTemplates } from './healthcare.js';
import { marketingTemplates } from './marketing.js';
import { educationTemplates } from './education.js';

export const templateCategories = {
  tech: techTemplates,
  finance: financeTemplates,
  healthcare: healthcareTemplates,
  marketing: marketingTemplates,
  education: educationTemplates
};

/**
 * Get all templates across all categories
 */
export const getAllTemplates = () => {
  const allTemplates = [];
  
  Object.entries(templateCategories).forEach(([category, templates]) => {
    Object.entries(templates).forEach(([style, template]) => {
      allTemplates.push({
        id: `${category}-${style}`,
        category,
        style,
        ...template
      });
    });
  });
  
  return allTemplates;
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category) => {
  const categoryTemplates = templateCategories[category.toLowerCase()];
  if (!categoryTemplates) return [];
  
  return Object.entries(categoryTemplates).map(([style, template]) => ({
    id: `${category}-${style}`,
    category,
    style,
    ...template
  }));
};

/**
 * Get templates by style
 */
export const getTemplatesByStyle = (style) => {
  const styleTemplates = [];
  
  Object.entries(templateCategories).forEach(([category, templates]) => {
    if (templates[style]) {
      styleTemplates.push({
        id: `${category}-${style}`,
        category,
        style,
        ...templates[style]
      });
    }
  });
  
  return styleTemplates;
};

/**
 * Get template by ID
 */
export const getTemplateById = (templateId) => {
  const [category, style] = templateId.split('-');
  const categoryTemplates = templateCategories[category];
  
  if (!categoryTemplates || !categoryTemplates[style]) {
    return null;
  }
  
  return {
    id: templateId,
    category,
    style,
    ...categoryTemplates[style]
  };
};

/**
 * Get template statistics
 */
export const getTemplateStats = () => {
  const stats = {
    totalTemplates: 0,
    categoryCounts: {},
    styleCounts: {},
    averageAtsScore: 0
  };
  
  let totalAtsScore = 0;
  
  Object.entries(templateCategories).forEach(([category, templates]) => {
    stats.categoryCounts[category] = Object.keys(templates).length;
    
    Object.entries(templates).forEach(([style, template]) => {
      stats.totalTemplates++;
      totalAtsScore += template.atsScore;
      
      if (!stats.styleCounts[style]) {
        stats.styleCounts[style] = 0;
      }
      stats.styleCounts[style]++;
    });
  });
  
  stats.averageAtsScore = Math.round(totalAtsScore / stats.totalTemplates);
  
  return stats;
};

export default templateCategories;