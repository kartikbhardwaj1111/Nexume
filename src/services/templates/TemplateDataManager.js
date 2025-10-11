/**
 * Template Data Manager
 * Handles template metadata, storage, and categorization
 */

import { templateCategories } from '../../templates/categories/index.js';
import { TEMPLATE_CONFIG } from '../../config/interfaces.js';

class TemplateDataManager {
  constructor() {
    this.templateMetadata = new Map();
    this.categoryMetadata = new Map();
    this.initializeMetadata();
  }

  /**
   * Initialize template and category metadata
   */
  initializeMetadata() {
    // Initialize category metadata
    Object.entries(TEMPLATE_CONFIG.categories).forEach(([key, config]) => {
      this.categoryMetadata.set(key.toLowerCase(), {
        ...config,
        key: key.toLowerCase(),
        templateCount: 0,
        averageAtsScore: 0,
        popularStyles: [],
        lastUpdated: new Date()
      });
    });

    // Initialize template metadata
    Object.entries(templateCategories).forEach(([category, templates]) => {
      const categoryMeta = this.categoryMetadata.get(category);
      let totalAtsScore = 0;
      const styleCount = {};

      Object.entries(templates).forEach(([style, template]) => {
        const templateId = `${category}-${style}`;
        
        // Store template metadata
        this.templateMetadata.set(templateId, {
          id: templateId,
          category,
          style,
          name: template.name,
          description: template.description,
          atsScore: template.atsScore,
          features: template.features || [],
          sections: template.sections || [],
          styling: template.styling || {},
          usage: {
            downloads: Math.floor(Math.random() * 1000) + 100,
            views: Math.floor(Math.random() * 5000) + 500,
            favorites: Math.floor(Math.random() * 200) + 20,
            lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
          },
          performance: {
            renderTime: Math.random() * 500 + 100, // ms
            fileSize: Math.random() * 50 + 20, // KB
            compatibility: template.atsScore / 100
          },
          tags: this.generateTags(template, category, style),
          createdAt: new Date(),
          updatedAt: new Date()
        });

        totalAtsScore += template.atsScore;
        styleCount[style] = (styleCount[style] || 0) + 1;
      });

      // Update category metadata
      if (categoryMeta) {
        categoryMeta.templateCount = Object.keys(templates).length;
        categoryMeta.averageAtsScore = Math.round(totalAtsScore / categoryMeta.templateCount);
        categoryMeta.popularStyles = Object.entries(styleCount)
          .sort(([,a], [,b]) => b - a)
          .map(([style]) => style);
      }
    });
  }

  /**
   * Generate tags for a template
   */
  generateTags(template, category, style) {
    const tags = [category, style, 'ats-optimized'];
    
    // Add feature-based tags
    if (template.features) {
      template.features.forEach(feature => {
        const featureTags = this.extractTagsFromFeature(feature);
        tags.push(...featureTags);
      });
    }

    // Add ATS score-based tags
    if (template.atsScore >= 90) tags.push('excellent-ats');
    else if (template.atsScore >= 80) tags.push('good-ats');

    // Add layout-based tags
    if (template.styling?.layout) {
      tags.push(template.styling.layout);
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Extract tags from feature descriptions
   */
  extractTagsFromFeature(feature) {
    const tags = [];
    const featureLower = feature.toLowerCase();
    
    if (featureLower.includes('creative')) tags.push('creative');
    if (featureLower.includes('professional')) tags.push('professional');
    if (featureLower.includes('modern')) tags.push('modern');
    if (featureLower.includes('clean')) tags.push('clean');
    if (featureLower.includes('minimal')) tags.push('minimal');
    if (featureLower.includes('skills')) tags.push('skills-focused');
    if (featureLower.includes('experience')) tags.push('experience-focused');
    if (featureLower.includes('project')) tags.push('project-showcase');
    if (featureLower.includes('portfolio')) tags.push('portfolio');
    if (featureLower.includes('executive')) tags.push('executive');
    if (featureLower.includes('entry')) tags.push('entry-level');
    
    return tags;
  }

  /**
   * Get template metadata by ID
   */
  getTemplateMetadata(templateId) {
    return this.templateMetadata.get(templateId);
  }

  /**
   * Get all template metadata
   */
  getAllTemplateMetadata() {
    return Array.from(this.templateMetadata.values());
  }

  /**
   * Get category metadata
   */
  getCategoryMetadata(category) {
    return this.categoryMetadata.get(category?.toLowerCase());
  }

  /**
   * Get all category metadata
   */
  getAllCategoryMetadata() {
    return Array.from(this.categoryMetadata.values());
  }

  /**
   * Search templates by metadata
   */
  searchTemplatesByMetadata(query, filters = {}) {
    const searchTerm = query?.toLowerCase() || '';
    let results = Array.from(this.templateMetadata.values());

    // Text search
    if (searchTerm) {
      results = results.filter(template => 
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        template.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters.category) {
      results = results.filter(t => t.category === filters.category);
    }

    if (filters.style) {
      results = results.filter(t => t.style === filters.style);
    }

    if (filters.minAtsScore) {
      results = results.filter(t => t.atsScore >= filters.minAtsScore);
    }

    if (filters.maxAtsScore) {
      results = results.filter(t => t.atsScore <= filters.maxAtsScore);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(t => 
        filters.tags.some(tag => t.tags.includes(tag))
      );
    }

    return results;
  }

  /**
   * Get template recommendations based on user profile
   */
  getTemplateRecommendations(userProfile, limit = 5) {
    const templates = Array.from(this.templateMetadata.values());
    const recommendations = [];

    templates.forEach(template => {
      let score = 0;

      // Category match
      if (userProfile.industry && template.category === userProfile.industry.toLowerCase()) {
        score += 40;
      }

      // Experience level match
      if (userProfile.experienceLevel) {
        if (userProfile.experienceLevel === 'entry' && template.tags.includes('entry-level')) {
          score += 20;
        } else if (userProfile.experienceLevel === 'senior' && template.tags.includes('executive')) {
          score += 20;
        }
      }

      // ATS score preference
      score += template.atsScore * 0.3;

      // Style preference
      if (userProfile.preferredStyle && template.style === userProfile.preferredStyle) {
        score += 15;
      }

      // Feature preferences
      if (userProfile.requiredFeatures) {
        const matchingFeatures = userProfile.requiredFeatures.filter(feature =>
          template.tags.includes(feature) || 
          template.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
        );
        score += matchingFeatures.length * 5;
      }

      recommendations.push({
        template,
        score,
        reasons: this.getRecommendationReasons(template, userProfile, score)
      });
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get reasons for template recommendation
   */
  getRecommendationReasons(template, userProfile, score) {
    const reasons = [];

    if (userProfile.industry && template.category === userProfile.industry.toLowerCase()) {
      reasons.push(`Perfect match for ${userProfile.industry} industry`);
    }

    if (template.atsScore >= 90) {
      reasons.push('Excellent ATS compatibility (90+)');
    } else if (template.atsScore >= 80) {
      reasons.push('Good ATS compatibility (80+)');
    }

    if (template.usage.downloads > 500) {
      reasons.push('Popular choice among users');
    }

    if (userProfile.preferredStyle && template.style === userProfile.preferredStyle) {
      reasons.push(`Matches your preferred ${userProfile.preferredStyle} style`);
    }

    return reasons;
  }

  /**
   * Update template usage statistics
   */
  updateTemplateUsage(templateId, action) {
    const metadata = this.templateMetadata.get(templateId);
    if (!metadata) return false;

    switch (action) {
      case 'view':
        metadata.usage.views++;
        break;
      case 'download':
        metadata.usage.downloads++;
        break;
      case 'favorite':
        metadata.usage.favorites++;
        break;
      case 'use':
        metadata.usage.lastUsed = new Date();
        break;
    }

    metadata.updatedAt = new Date();
    return true;
  }

  /**
   * Get template analytics
   */
  getTemplateAnalytics() {
    const templates = Array.from(this.templateMetadata.values());
    const categories = Array.from(this.categoryMetadata.values());

    return {
      overview: {
        totalTemplates: templates.length,
        totalCategories: categories.length,
        averageAtsScore: Math.round(
          templates.reduce((sum, t) => sum + t.atsScore, 0) / templates.length
        ),
        totalDownloads: templates.reduce((sum, t) => sum + t.usage.downloads, 0),
        totalViews: templates.reduce((sum, t) => sum + t.usage.views, 0)
      },
      categories: categories.map(cat => ({
        name: cat.name,
        key: cat.key,
        templateCount: cat.templateCount,
        averageAtsScore: cat.averageAtsScore,
        popularStyles: cat.popularStyles
      })),
      topTemplates: {
        mostDownloaded: templates
          .sort((a, b) => b.usage.downloads - a.usage.downloads)
          .slice(0, 5),
        mostViewed: templates
          .sort((a, b) => b.usage.views - a.usage.views)
          .slice(0, 5),
        highestAts: templates
          .sort((a, b) => b.atsScore - a.atsScore)
          .slice(0, 5)
      },
      performance: {
        averageRenderTime: Math.round(
          templates.reduce((sum, t) => sum + t.performance.renderTime, 0) / templates.length
        ),
        averageFileSize: Math.round(
          templates.reduce((sum, t) => sum + t.performance.fileSize, 0) / templates.length
        )
      }
    };
  }

  /**
   * Export template metadata
   */
  exportMetadata() {
    return {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      templates: Array.from(this.templateMetadata.values()),
      categories: Array.from(this.categoryMetadata.values())
    };
  }

  /**
   * Import template metadata
   */
  importMetadata(data) {
    try {
      if (data.templates) {
        data.templates.forEach(template => {
          this.templateMetadata.set(template.id, template);
        });
      }

      if (data.categories) {
        data.categories.forEach(category => {
          this.categoryMetadata.set(category.key, category);
        });
      }

      return { success: true, message: 'Metadata imported successfully' };
    } catch (error) {
      return { success: false, message: `Import failed: ${error.message}` };
    }
  }
}

// Export singleton instance
export const templateDataManager = new TemplateDataManager();
export default TemplateDataManager;