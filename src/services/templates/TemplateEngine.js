/**
 * Template Engine Service
 * Manages resume templates with ATS optimization and customization
 */

import { TEMPLATE_CONFIG, ERROR_TYPES, ERROR_MESSAGES } from '../../config/interfaces.js';
import { templateCategories, getAllTemplates, getTemplatesByCategory, getTemplatesByStyle, getTemplateById } from '../../templates/categories/index.js';
import TemplateGenerators from './TemplateGenerators.js';

class TemplateEngine {
  constructor() {
    this.templates = new Map();
    this.customizations = new Map();
    this.initializeTemplates();
  }

  /**
   * Initialize default templates
   */
  initializeTemplates() {
    // Load templates from the template categories
    const allTemplates = getAllTemplates();
    
    allTemplates.forEach(template => {
      // Enhance template with additional metadata
      const enhancedTemplate = this.enhanceTemplate(template);
      this.templates.set(enhancedTemplate.id, enhancedTemplate);
    });
  }

  /**
   * Enhance template with additional metadata and functionality
   */
  enhanceTemplate(template) {
    const categoryConfig = TEMPLATE_CONFIG.categories[template.category.toUpperCase()];
    
    return {
      ...template,
      customizable: TEMPLATE_CONFIG.customizationOptions,
      preview: this.generatePreviewHTML(template.category, template.style),
      structure: this.createTemplateStructure(template),
      metadata: {
        description: template.description,
        icon: categoryConfig?.icon || '📄',
        tags: [template.category, template.style, 'ats-optimized'],
        createdAt: new Date(),
        downloads: Math.floor(Math.random() * 1000) + 100,
        features: template.features || []
      }
    };
  }

  /**
   * Get templates with optional filtering
   */
  getTemplates(category = null, style = null, sortBy = 'atsScore') {
    let templates = Array.from(this.templates.values());

    if (category) {
      templates = templates.filter(t => t.category === category.toLowerCase());
    }

    if (style) {
      templates = templates.filter(t => t.style === style.toLowerCase());
    }

    // Sort templates based on criteria
    return this.sortTemplates(templates, sortBy);
  }

  /**
   * Sort templates by specified criteria
   */
  sortTemplates(templates, sortBy) {
    switch (sortBy) {
      case 'atsScore':
        return templates.sort((a, b) => b.atsScore - a.atsScore);
      case 'name':
        return templates.sort((a, b) => a.name.localeCompare(b.name));
      case 'downloads':
        return templates.sort((a, b) => b.metadata.downloads - a.metadata.downloads);
      case 'category':
        return templates.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return templates.sort((a, b) => {
          if (b.atsScore !== a.atsScore) {
            return b.atsScore - a.atsScore;
          }
          return b.metadata.downloads - a.metadata.downloads;
        });
    }
  }

  /**
   * Get templates by category using the new template system
   */
  getTemplatesByCategory(category) {
    return getTemplatesByCategory(category).map(template => 
      this.templates.get(template.id) || this.enhanceTemplate(template)
    );
  }

  /**
   * Get templates by style using the new template system
   */
  getTemplatesByStyle(style) {
    return getTemplatesByStyle(style).map(template => 
      this.templates.get(template.id) || this.enhanceTemplate(template)
    );
  }

  /**
   * Search templates by name, description, or features
   */
  searchTemplates(query) {
    const searchTerm = query.toLowerCase();
    const templates = Array.from(this.templates.values());
    
    return templates.filter(template => {
      return (
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.metadata.features.some(feature => 
          feature.toLowerCase().includes(searchTerm)
        ) ||
        template.category.toLowerCase().includes(searchTerm) ||
        template.style.toLowerCase().includes(searchTerm)
      );
    });
  }

  /**
   * Get template categories with counts
   */
  getTemplateCategories() {
    const categories = {};
    const templates = Array.from(this.templates.values());
    
    templates.forEach(template => {
      if (!categories[template.category]) {
        categories[template.category] = {
          name: template.category,
          count: 0,
          templates: []
        };
      }
      categories[template.category].count++;
      categories[template.category].templates.push(template);
    });
    
    return categories;
  }

  /**
   * Get template styles with counts
   */
  getTemplateStyles() {
    const styles = {};
    const templates = Array.from(this.templates.values());
    
    templates.forEach(template => {
      if (!styles[template.style]) {
        styles[template.style] = {
          name: template.style,
          count: 0,
          templates: []
        };
      }
      styles[template.style].count++;
      styles[template.style].templates.push(template);
    });
    
    return styles;
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  /**
   * Render template with user data
   */
  renderTemplate(templateId, userData) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    try {
      const renderedHTML = this.populateTemplate(template, userData);
      return {
        html: renderedHTML,
        template: template,
        userData: userData,
        renderedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to render template: ${error.message}`);
    }
  }

  /**
   * Customize template with user preferences
   */
  customizeTemplate(templateId, customizations) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const customizedTemplate = JSON.parse(JSON.stringify(template));
    
    // Apply customizations
    if (customizations.colorScheme) {
      customizedTemplate.styling.colors = this.getColorScheme(customizations.colorScheme);
    }

    if (customizations.fontFamily) {
      customizedTemplate.styling.fonts.heading = customizations.fontFamily;
      customizedTemplate.styling.fonts.body = customizations.fontFamily;
    }

    if (customizations.layoutDensity) {
      customizedTemplate.styling.spacing = this.getSpacingForDensity(customizations.layoutDensity);
    }

    if (customizations.sectionOrder) {
      customizedTemplate.structure.sections = this.reorderSections(
        customizedTemplate.structure.sections,
        customizations.sectionOrder
      );
    }

    // Generate new ID for customized template
    const customId = `${templateId}-custom-${Date.now()}`;
    customizedTemplate.id = customId;
    customizedTemplate.name += ' (Customized)';

    // Store customization
    this.customizations.set(customId, {
      originalId: templateId,
      customizations,
      createdAt: new Date()
    });

    return customizedTemplate;
  }

  /**
   * Generate preview HTML for template
   */
  generatePreviewHTML(category, style) {
    // Generate a simple HTML preview based on category and style
    const categoryConfig = TEMPLATE_CONFIG.categories[category?.toUpperCase()] || {};
    const styleClass = `template-${style}`;
    
    return `
      <div class="template-preview ${styleClass}">
        <div class="template-header">
          <h1>John Doe</h1>
          <p>Software Engineer</p>
        </div>
        <div class="template-content">
          <section class="experience">
            <h2>Experience</h2>
            <div class="job">
              <h3>Senior Developer</h3>
              <p>Tech Company • 2020-Present</p>
            </div>
          </section>
          <section class="skills">
            <h2>Skills</h2>
            <p>JavaScript, React, Node.js</p>
          </section>
        </div>
      </div>
    `;
  }

  /**
   * Generate preview data for template
   */
  generatePreview(template, userData = null) {
    const sampleData = userData || this.getSampleUserData(template.category);
    
    try {
      const html = this.populateTemplate(template, sampleData);
      const thumbnail = this.generateThumbnail(html);
      
      return {
        html,
        thumbnail,
        template: template,
        sampleData,
        generatedAt: new Date()
      };
    } catch (error) {
      return {
        html: '<div>Preview unavailable</div>',
        thumbnail: '',
        error: error.message
      };
    }
  }

  /**
   * Calculate ATS score for template style
   */
  calculateATSScore(style) {
    const baseScore = 85; // All templates are ATS-optimized
    
    const styleModifiers = {
      'classic': 5,    // Most ATS-friendly
      'modern': 3,     // Very ATS-friendly
      'minimal': 2,    // Good ATS compatibility
      'creative': -2   // Slightly less ATS-friendly but still good
    };

    return Math.min(100, baseScore + (styleModifiers[style] || 0));
  }

  /**
   * Create template structure from template data
   */
  createTemplateStructure(template) {
    // Use sections from template data if available, otherwise create default
    const sections = template.sections || this.getDefaultSections(template.category);
    
    return {
      sections: sections.map(section => ({
        ...section,
        type: this.getSectionType(section.id)
      })),
      layout: template.styling?.layout || 'single-column'
    };
  }

  /**
   * Get default sections for a category
   */
  getDefaultSections(category) {
    const baseSections = [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Professional Summary', required: false, order: 2 },
      { id: 'experience', name: 'Work Experience', required: true, order: 3 },
      { id: 'skills', name: 'Skills', required: true, order: 4 },
      { id: 'education', name: 'Education', required: true, order: 5 }
    ];

    // Add category-specific sections
    if (category === 'tech') {
      baseSections.push(
        { id: 'projects', name: 'Projects', required: false, order: 6 },
        { id: 'certifications', name: 'Certifications', required: false, order: 7 }
      );
    } else if (category === 'healthcare') {
      baseSections.push(
        { id: 'licenses', name: 'Licenses', required: false, order: 6 },
        { id: 'certifications', name: 'Certifications', required: false, order: 7 }
      );
    }

    return baseSections;
  }

  /**
   * Get section type based on section ID
   */
  getSectionType(sectionId) {
    const typeMap = {
      header: 'header',
      summary: 'summary',
      experience: 'experience',
      skills: 'skills',
      education: 'education',
      projects: 'custom',
      certifications: 'custom',
      licenses: 'custom',
      achievements: 'custom',
      campaigns: 'custom',
      portfolio: 'custom',
      research: 'custom',
      innovations: 'custom'
    };
    
    return typeMap[sectionId] || 'custom';
  }

  /**
   * Get template styling (now uses template data)
   */
  getTemplateStyling(template) {
    // Use styling from template data if available
    if (template.styling) {
      return template.styling;
    }
    
    // Fallback to default styling
    return this.createDefaultStyling(template.style);
  }

  /**
   * Create default styling for backward compatibility
   */
  createDefaultStyling(style) {
    const baseColors = {
      classic: {
        primary: '#2c3e50',
        secondary: '#34495e',
        text: '#2c3e50',
        background: '#ffffff'
      },
      modern: {
        primary: '#3498db',
        secondary: '#2980b9',
        text: '#2c3e50',
        background: '#ffffff'
      },
      minimal: {
        primary: '#000000',
        secondary: '#666666',
        text: '#333333',
        background: '#ffffff'
      },
      creative: {
        primary: '#e74c3c',
        secondary: '#c0392b',
        text: '#2c3e50',
        background: '#ffffff'
      }
    };

    const baseFonts = {
      classic: { heading: 'Times New Roman', body: 'Times New Roman' },
      modern: { heading: 'Arial', body: 'Arial' },
      minimal: { heading: 'Helvetica', body: 'Helvetica' },
      creative: { heading: 'Georgia', body: 'Arial' }
    };

    return {
      colors: baseColors[style] || baseColors.modern,
      fonts: {
        ...baseFonts[style] || baseFonts.modern,
        size: {
          name: '20px',
          heading: '14px',
          body: '11px',
          small: '10px'
        }
      },
      spacing: {
        margin: '0.75in',
        padding: '8px',
        lineHeight: '1.4'
      }
    };
  }

  /**
   * Populate template with user data using new generators
   */
  populateTemplate(template, userData) {
    // Use the appropriate generator based on template style
    switch (template.style) {
      case 'modern':
        return TemplateGenerators.generateModernTemplate(template, userData);
      case 'classic':
        return TemplateGenerators.generateClassicTemplate(template, userData);
      case 'minimal':
        return TemplateGenerators.generateMinimalTemplate(template, userData);
      case 'creative':
        return TemplateGenerators.generateCreativeTemplate(template, userData);
      default:
        // Fallback to legacy method
        return this.populateTemplateLegacy(template, userData);
    }
  }

  /**
   * Legacy template population method (for backward compatibility)
   */
  populateTemplateLegacy(template, userData) {
    let html = this.getBaseHTML(template);

    // Replace placeholders with actual data
    html = html.replace(/\{\{name\}\}/g, this.getFullName(userData));
    html = html.replace(/\{\{email\}\}/g, userData.personalInfo?.email || 'email@example.com');
    html = html.replace(/\{\{phone\}\}/g, userData.personalInfo?.phone || '(555) 123-4567');
    html = html.replace(/\{\{location\}\}/g, userData.personalInfo?.location || 'City, State');
    html = html.replace(/\{\{linkedin\}\}/g, userData.personalInfo?.linkedIn || '');
    html = html.replace(/\{\{portfolio\}\}/g, userData.personalInfo?.portfolio || '');

    // Populate sections
    html = html.replace(/\{\{summary\}\}/g, this.renderSummary(userData));
    html = html.replace(/\{\{experience\}\}/g, this.renderExperience(userData));
    html = html.replace(/\{\{skills\}\}/g, this.renderSkills(userData));
    html = html.replace(/\{\{education\}\}/g, this.renderEducation(userData));
    html = html.replace(/\{\{projects\}\}/g, this.renderProjects(userData));
    html = html.replace(/\{\{certifications\}\}/g, this.renderCertifications(userData));

    return html;
  }

  /**
   * Get base HTML structure for template
   */
  getBaseHTML(template) {
    const styling = this.getTemplateStyling(template);
    const { colors, fonts, spacing } = styling;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - {{name}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body}, sans-serif;
            font-size: ${fonts.size.body};
            line-height: ${spacing.lineHeight};
            color: ${colors.text};
            background: ${colors.background};
            margin: ${spacing.margin};
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid ${colors.primary};
        }
        
        .name {
            font-family: ${fonts.heading}, serif;
            font-size: 24px;
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 8px;
        }
        
        .contact-info {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
        }
        
        .section {
            margin-bottom: 18px;
        }
        
        .section-title {
            font-family: ${fonts.heading}, serif;
            font-size: 14px;
            font-weight: bold;
            color: ${colors.primary};
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid ${colors.secondary};
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 12px;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
        }
        
        .item-title {
            font-weight: bold;
            color: ${colors.primary};
        }
        
        .item-company, .item-school {
            font-style: italic;
            color: ${colors.secondary};
        }
        
        .item-date {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
        }
        
        .item-description {
            margin-top: 4px;
        }
        
        .item-description ul {
            margin-left: 15px;
        }
        
        .item-description li {
            margin-bottom: 2px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        
        .skill-category {
            margin-bottom: 8px;
        }
        
        .skill-category-title {
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 3px;
        }
        
        .skill-list {
            font-size: ${fonts.size.small};
            color: ${colors.text};
        }
        
        @media print {
            body { margin: 0.5in; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">{{name}}</div>
        <div class="contact-info">
            {{email}} • {{phone}} • {{location}}
            <span style="display: {{linkedin}} ? 'inline' : 'none'"> • {{linkedin}}</span>
            <span style="display: {{portfolio}} ? 'inline' : 'none'"> • {{portfolio}}</span>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div>{{summary}}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Experience</div>
        {{experience}}
    </div>
    
    <div class="section">
        <div class="section-title">Skills</div>
        {{skills}}
    </div>
    
    <div class="section">
        <div class="section-title">Education</div>
        {{education}}
    </div>
    
    <div class="section" style="display: {{projects}} ? 'block' : 'none'">
        <div class="section-title">Projects</div>
        {{projects}}
    </div>
    
    <div class="section" style="display: {{certifications}} ? 'block' : 'none'">
        <div class="section-title">Certifications</div>
        {{certifications}}
    </div>
</body>
</html>`;
  }

  /**
   * Helper methods for rendering sections
   */
  getFullName(userData) {
    const { firstName = 'John', lastName = 'Doe' } = userData.personalInfo || {};
    return `${firstName} ${lastName}`;
  }

  renderSummary(userData) {
    return userData.resume?.sections?.find(s => s.type === 'summary')?.content ||
           'Experienced professional with a proven track record of success in delivering high-quality results and driving organizational growth.';
  }

  renderExperience(userData) {
    const experiences = userData.resume?.experience || [];
    
    if (experiences.length === 0) {
      return '<div class="experience-item"><div class="item-title">Add your work experience</div></div>';
    }

    return experiences.map(exp => `
      <div class="experience-item">
        <div class="item-header">
          <div>
            <div class="item-title">${exp.position}</div>
            <div class="item-company">${exp.company}</div>
          </div>
          <div class="item-date">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}</div>
        </div>
        <div class="item-description">
          <div>${exp.description}</div>
          ${exp.achievements && exp.achievements.length > 0 ? `
            <ul>
              ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  renderSkills(userData) {
    const skills = userData.resume?.skills || [];
    
    if (skills.length === 0) {
      return '<div class="skills-grid"><div class="skill-category"><div class="skill-category-title">Technical Skills</div><div class="skill-list">Add your skills here</div></div></div>';
    }

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      const category = skill.category || 'Technical';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {});

    return `
      <div class="skills-grid">
        ${Object.entries(skillsByCategory).map(([category, skillList]) => `
          <div class="skill-category">
            <div class="skill-category-title">${category}</div>
            <div class="skill-list">${skillList.join(', ')}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderEducation(userData) {
    const education = userData.resume?.education || [];
    
    if (education.length === 0) {
      return '<div class="education-item"><div class="item-title">Add your education</div></div>';
    }

    return education.map(edu => `
      <div class="education-item">
        <div class="item-header">
          <div>
            <div class="item-title">${edu.degree} in ${edu.field}</div>
            <div class="item-school">${edu.institution}</div>
          </div>
          <div class="item-date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</div>
        </div>
        ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
        ${edu.honors && edu.honors.length > 0 ? `<div>Honors: ${edu.honors.join(', ')}</div>` : ''}
      </div>
    `).join('');
  }

  renderProjects(userData) {
    // This would be implemented based on user data structure
    return '';
  }

  renderCertifications(userData) {
    const certifications = userData.resume?.certifications || [];
    
    return certifications.map(cert => `
      <div class="certification-item">
        <div class="item-header">
          <div class="item-title">${cert.name}</div>
          <div class="item-date">${this.formatDate(cert.issueDate)}</div>
        </div>
        <div class="item-company">${cert.issuer}</div>
      </div>
    `).join('');
  }

  /**
   * Utility methods
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  generateThumbnail(html) {
    // This would generate a thumbnail image of the template
    // For now, return a placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkN2IFByZXZpZXc8L3RleHQ+PC9zdmc+';
  }

  getSampleUserData(category) {
    return {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        location: 'New York, NY',
        linkedIn: 'linkedin.com/in/johndoe'
      },
      resume: {
        experience: [{
          position: 'Senior Developer',
          company: 'Tech Company',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          current: false,
          description: 'Led development of web applications',
          achievements: ['Improved performance by 40%', 'Mentored junior developers']
        }],
        education: [{
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          institution: 'University Name',
          startDate: new Date('2016-09-01'),
          endDate: new Date('2020-05-01')
        }],
        skills: [
          { name: 'JavaScript', category: 'Programming' },
          { name: 'React', category: 'Frameworks' },
          { name: 'Node.js', category: 'Backend' }
        ]
      }
    };
  }

  getColorScheme(schemeName) {
    const schemes = {
      blue: { primary: '#3498db', secondary: '#2980b9', text: '#2c3e50', background: '#ffffff' },
      green: { primary: '#27ae60', secondary: '#229954', text: '#2c3e50', background: '#ffffff' },
      purple: { primary: '#8e44ad', secondary: '#7d3c98', text: '#2c3e50', background: '#ffffff' },
      red: { primary: '#e74c3c', secondary: '#c0392b', text: '#2c3e50', background: '#ffffff' },
      dark: { primary: '#2c3e50', secondary: '#34495e', text: '#2c3e50', background: '#ffffff' }
    };
    return schemes[schemeName] || schemes.blue;
  }

  getSpacingForDensity(density) {
    const spacings = {
      compact: { margin: '0.5in', padding: '4px', lineHeight: '1.2' },
      normal: { margin: '0.75in', padding: '8px', lineHeight: '1.4' },
      spacious: { margin: '1in', padding: '12px', lineHeight: '1.6' }
    };
    return spacings[density] || spacings.normal;
  }

  reorderSections(sections, newOrder) {
    const reordered = [];
    for (const sectionId of newOrder) {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        reordered.push({ ...section, order: reordered.length + 1 });
      }
    }
    // Add any sections not in the new order
    for (const section of sections) {
      if (!newOrder.includes(section.id)) {
        reordered.push({ ...section, order: reordered.length + 1 });
      }
    }
    return reordered;
  }

  /**
   * Get template analytics and statistics
   */
  getTemplateAnalytics() {
    const templates = Array.from(this.templates.values());
    const analytics = {
      totalTemplates: templates.length,
      averageAtsScore: 0,
      categoryDistribution: {},
      styleDistribution: {},
      atsScoreDistribution: {
        excellent: 0, // 90+
        good: 0,      // 80-89
        fair: 0,      // 70-79
        poor: 0       // <70
      },
      popularTemplates: [],
      recentTemplates: []
    };

    let totalAtsScore = 0;
    let totalDownloads = 0;

    templates.forEach(template => {
      // ATS Score analytics
      totalAtsScore += template.atsScore;
      
      if (template.atsScore >= 90) analytics.atsScoreDistribution.excellent++;
      else if (template.atsScore >= 80) analytics.atsScoreDistribution.good++;
      else if (template.atsScore >= 70) analytics.atsScoreDistribution.fair++;
      else analytics.atsScoreDistribution.poor++;

      // Category distribution
      analytics.categoryDistribution[template.category] = 
        (analytics.categoryDistribution[template.category] || 0) + 1;

      // Style distribution
      analytics.styleDistribution[template.style] = 
        (analytics.styleDistribution[template.style] || 0) + 1;

      totalDownloads += template.metadata.downloads;
    });

    analytics.averageAtsScore = Math.round(totalAtsScore / templates.length);
    analytics.totalDownloads = totalDownloads;

    // Popular templates (top 5 by downloads)
    analytics.popularTemplates = templates
      .sort((a, b) => b.metadata.downloads - a.metadata.downloads)
      .slice(0, 5)
      .map(t => ({ id: t.id, name: t.name, downloads: t.metadata.downloads }));

    // Recent templates (top 5 by creation date)
    analytics.recentTemplates = templates
      .sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt))
      .slice(0, 5)
      .map(t => ({ id: t.id, name: t.name, createdAt: t.metadata.createdAt }));

    return analytics;
  }

  /**
   * Validate template structure and data
   */
  validateTemplate(template) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    if (!template.id) errors.push('Template ID is required');
    if (!template.name) errors.push('Template name is required');
    if (!template.category) errors.push('Template category is required');
    if (!template.style) errors.push('Template style is required');
    if (typeof template.atsScore !== 'number') errors.push('ATS score must be a number');

    // ATS Score validation
    if (template.atsScore < 0 || template.atsScore > 100) {
      errors.push('ATS score must be between 0 and 100');
    } else if (template.atsScore < 70) {
      warnings.push('ATS score is below recommended threshold (70)');
    }

    // Category validation
    const validCategories = Object.keys(TEMPLATE_CONFIG.categories).map(c => c.toLowerCase());
    if (!validCategories.includes(template.category.toLowerCase())) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }

    // Style validation
    if (!TEMPLATE_CONFIG.styles.includes(template.style)) {
      errors.push(`Invalid style. Must be one of: ${TEMPLATE_CONFIG.styles.join(', ')}`);
    }

    // Sections validation
    if (template.sections) {
      const requiredSections = template.sections.filter(s => s.required);
      if (requiredSections.length === 0) {
        warnings.push('No required sections defined');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Export template data for backup or sharing
   */
  exportTemplateData(templateId = null) {
    if (templateId) {
      const template = this.templates.get(templateId);
      return template ? JSON.stringify(template, null, 2) : null;
    }
    
    // Export all templates
    const allTemplates = Array.from(this.templates.values());
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      version: '1.0',
      templates: allTemplates
    }, null, 2);
  }

  /**
   * Import template data from backup
   */
  importTemplateData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (data.templates && Array.isArray(data.templates)) {
        // Import multiple templates
        const imported = [];
        const errors = [];
        
        data.templates.forEach(template => {
          const validation = this.validateTemplate(template);
          if (validation.isValid) {
            this.templates.set(template.id, template);
            imported.push(template.id);
          } else {
            errors.push({ id: template.id, errors: validation.errors });
          }
        });
        
        return { imported, errors };
      } else {
        // Import single template
        const validation = this.validateTemplate(data);
        if (validation.isValid) {
          this.templates.set(data.id, data);
          return { imported: [data.id], errors: [] };
        } else {
          return { imported: [], errors: [{ id: data.id, errors: validation.errors }] };
        }
      }
    } catch (error) {
      throw new Error(`Failed to import template data: ${error.message}`);
    }
  }
}

// Export singleton instance
export const templateEngine = new TemplateEngine();
export default TemplateEngine;