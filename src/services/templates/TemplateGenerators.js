/**
 * Template Generators
 * HTML generators for different template styles and categories
 */

class TemplateGenerators {
  /**
   * Generate HTML for modern style templates
   */
  static generateModernTemplate(template, userData) {
    const { colors, fonts, spacing } = template.styling;
    const sections = template.sections || [];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${this.getFullName(userData)}</title>
    <style>
        ${this.getModernStyles(colors, fonts, spacing)}
    </style>
</head>
<body>
    <div class="resume-container">
        ${this.generateHeader(userData, 'modern')}
        ${this.generateSections(sections, userData, 'modern')}
    </div>
</body>
</html>`;
  }

  /**
   * Generate HTML for classic style templates
   */
  static generateClassicTemplate(template, userData) {
    const { colors, fonts, spacing } = template.styling;
    const sections = template.sections || [];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${this.getFullName(userData)}</title>
    <style>
        ${this.getClassicStyles(colors, fonts, spacing)}
    </style>
</head>
<body>
    <div class="resume-container">
        ${this.generateHeader(userData, 'classic')}
        ${this.generateSections(sections, userData, 'classic')}
    </div>
</body>
</html>`;
  }

  /**
   * Generate HTML for minimal style templates
   */
  static generateMinimalTemplate(template, userData) {
    const { colors, fonts, spacing } = template.styling;
    const sections = template.sections || [];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${this.getFullName(userData)}</title>
    <style>
        ${this.getMinimalStyles(colors, fonts, spacing)}
    </style>
</head>
<body>
    <div class="resume-container">
        ${this.generateHeader(userData, 'minimal')}
        ${this.generateSections(sections, userData, 'minimal')}
    </div>
</body>
</html>`;
  }

  /**
   * Generate HTML for creative style templates
   */
  static generateCreativeTemplate(template, userData) {
    const { colors, fonts, spacing } = template.styling;
    const sections = template.sections || [];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${this.getFullName(userData)}</title>
    <style>
        ${this.getCreativeStyles(colors, fonts, spacing)}
    </style>
</head>
<body>
    <div class="resume-container">
        ${this.generateHeader(userData, 'creative')}
        ${this.generateSections(sections, userData, 'creative')}
    </div>
</body>
</html>`;
  }

  /**
   * Generate modern styles
   */
  static getModernStyles(colors, fonts, spacing) {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body}, Arial, sans-serif;
            font-size: ${fonts.size.body};
            line-height: ${spacing.lineHeight || '1.4'};
            color: ${colors.text};
            background: ${colors.background};
        }
        
        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: ${spacing.margin};
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            padding: 30px 0;
            background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            color: white;
            margin: -${spacing.margin} -${spacing.margin} 30px -${spacing.margin};
            padding-left: ${spacing.margin};
            padding-right: ${spacing.margin};
        }
        
        .name {
            font-family: ${fonts.heading}, Arial, sans-serif;
            font-size: ${fonts.size.name || '24px'};
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .contact-info {
            font-size: ${fonts.size.small};
            opacity: 0.9;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .section {
            margin-bottom: ${spacing.sectionGap || '25px'};
        }
        
        .section-title {
            font-family: ${fonts.heading}, Arial, sans-serif;
            font-size: ${fonts.size.heading};
            font-weight: 600;
            color: ${colors.primary};
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${colors.primary};
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 50px;
            height: 2px;
            background: ${colors.secondary};
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: ${spacing.itemGap || '20px'};
            padding: 15px;
            border-left: 3px solid ${colors.accent || '#f0f0f0'};
            background: ${colors.accent || '#f9f9f9'};
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }
        
        .item-title {
            font-weight: 600;
            color: ${colors.primary};
            font-size: 13px;
        }
        
        .item-company, .item-school {
            font-style: italic;
            color: ${colors.secondary};
            font-size: 12px;
        }
        
        .item-date {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
            font-weight: 500;
        }
        
        .item-description {
            margin-top: 8px;
            line-height: 1.5;
        }
        
        .item-description ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        
        .item-description li {
            margin-bottom: 4px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .skill-category {
            background: ${colors.accent || '#f9f9f9'};
            padding: 15px;
            border-radius: 8px;
        }
        
        .skill-category-title {
            font-weight: 600;
            color: ${colors.primary};
            margin-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
        }
        
        .skill-list {
            font-size: ${fonts.size.small};
            color: ${colors.text};
            line-height: 1.6;
        }
        
        @media print {
            .resume-container { 
                box-shadow: none; 
                margin: 0;
                padding: 0.5in;
            }
            .header {
                margin: -0.5in -0.5in 20px -0.5in;
                padding: 20px 0.5in;
            }
            .section { page-break-inside: avoid; }
        }
    `;
  }

  /**
   * Generate classic styles
   */
  static getClassicStyles(colors, fonts, spacing) {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body}, "Times New Roman", serif;
            font-size: ${fonts.size.body};
            line-height: ${spacing.lineHeight || '1.4'};
            color: ${colors.text};
            background: ${colors.background};
        }
        
        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: ${spacing.margin};
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 3px solid ${colors.primary};
        }
        
        .name {
            font-family: ${fonts.heading}, "Times New Roman", serif;
            font-size: ${fonts.size.name || '22px'};
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .contact-info {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
            line-height: 1.6;
        }
        
        .contact-item {
            display: inline;
            margin: 0 10px;
        }
        
        .section {
            margin-bottom: ${spacing.sectionGap || '25px'};
        }
        
        .section-title {
            font-family: ${fonts.heading}, "Times New Roman", serif;
            font-size: ${fonts.size.heading};
            font-weight: bold;
            color: ${colors.primary};
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 1px solid ${colors.secondary};
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: ${spacing.itemGap || '18px'};
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 6px;
        }
        
        .item-title {
            font-weight: bold;
            color: ${colors.primary};
            font-size: 12px;
        }
        
        .item-company, .item-school {
            font-style: italic;
            color: ${colors.secondary};
            font-size: 11px;
        }
        
        .item-date {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
        }
        
        .item-description {
            margin-top: 6px;
        }
        
        .item-description ul {
            margin-left: 18px;
        }
        
        .item-description li {
            margin-bottom: 3px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .skill-category {
            margin-bottom: 10px;
        }
        
        .skill-category-title {
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 5px;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .skill-list {
            font-size: ${fonts.size.small};
            color: ${colors.text};
        }
        
        @media print {
            .resume-container { margin: 0; padding: 0.75in; }
            .section { page-break-inside: avoid; }
        }
    `;
  }

  /**
   * Generate minimal styles
   */
  static getMinimalStyles(colors, fonts, spacing) {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body}, Helvetica, Arial, sans-serif;
            font-size: ${fonts.size.body};
            line-height: ${spacing.lineHeight || '1.5'};
            color: ${colors.text};
            background: ${colors.background};
        }
        
        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: ${spacing.margin};
            background: white;
        }
        
        .header {
            margin-bottom: 40px;
        }
        
        .name {
            font-family: ${fonts.heading}, Helvetica, Arial, sans-serif;
            font-size: ${fonts.size.name || '28px'};
            font-weight: 300;
            color: ${colors.primary};
            margin-bottom: 15px;
            letter-spacing: -0.5px;
        }
        
        .contact-info {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
            font-weight: 300;
        }
        
        .contact-item {
            display: inline;
            margin-right: 20px;
        }
        
        .section {
            margin-bottom: ${spacing.sectionGap || '35px'};
        }
        
        .section-title {
            font-family: ${fonts.heading}, Helvetica, Arial, sans-serif;
            font-size: ${fonts.size.heading};
            font-weight: 400;
            color: ${colors.primary};
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: ${spacing.itemGap || '25px'};
            padding-bottom: 20px;
            border-bottom: 1px solid ${colors.accent || '#eee'};
        }
        
        .experience-item:last-child, .education-item:last-child, .project-item:last-child {
            border-bottom: none;
        }
        
        .item-header {
            margin-bottom: 8px;
        }
        
        .item-title {
            font-weight: 500;
            color: ${colors.primary};
            font-size: 13px;
            margin-bottom: 3px;
        }
        
        .item-company, .item-school {
            color: ${colors.secondary};
            font-size: 11px;
            font-weight: 300;
        }
        
        .item-date {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
            float: right;
            font-weight: 300;
        }
        
        .item-description {
            margin-top: 10px;
            clear: both;
        }
        
        .item-description ul {
            margin-left: 15px;
        }
        
        .item-description li {
            margin-bottom: 5px;
            font-weight: 300;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px;
        }
        
        .skill-category {
            margin-bottom: 15px;
        }
        
        .skill-category-title {
            font-weight: 400;
            color: ${colors.primary};
            margin-bottom: 8px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .skill-list {
            font-size: ${fonts.size.small};
            color: ${colors.text};
            font-weight: 300;
            line-height: 1.6;
        }
        
        @media print {
            .resume-container { margin: 0; padding: 0.75in; }
            .section { page-break-inside: avoid; }
        }
    `;
  }

  /**
   * Generate creative styles
   */
  static getCreativeStyles(colors, fonts, spacing) {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body}, Arial, sans-serif;
            font-size: ${fonts.size.body};
            line-height: ${spacing.lineHeight || '1.4'};
            color: ${colors.text};
            background: ${colors.background};
        }
        
        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: ${spacing.margin};
            background: white;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        
        .left-column {
            background: ${colors.accent || '#f8f9fa'};
            padding: 30px 20px;
            margin: -${spacing.margin} 0 -${spacing.margin} -${spacing.margin};
        }
        
        .right-column {
            padding: 20px 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            grid-column: 1 / -1;
            background: ${colors.primary};
            color: white;
            padding: 40px 30px;
            margin: -${spacing.margin} -${spacing.margin} 30px -${spacing.margin};
            position: relative;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 15px solid ${colors.primary};
        }
        
        .name {
            font-family: ${fonts.heading}, Georgia, serif;
            font-size: ${fonts.size.name || '26px'};
            font-weight: 400;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .contact-info {
            font-size: ${fonts.size.small};
            opacity: 0.9;
        }
        
        .contact-item {
            display: block;
            margin-bottom: 5px;
        }
        
        .section {
            margin-bottom: ${spacing.sectionGap || '25px'};
        }
        
        .section-title {
            font-family: ${fonts.heading}, Georgia, serif;
            font-size: ${fonts.size.heading};
            font-weight: 600;
            color: ${colors.primary};
            margin-bottom: 15px;
            position: relative;
            padding-left: 20px;
        }
        
        .section-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: ${colors.secondary};
            border-radius: 50%;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: ${spacing.itemGap || '20px'};
            position: relative;
            padding-left: 20px;
        }
        
        .experience-item::before, .education-item::before, .project-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 8px;
            height: 8px;
            background: ${colors.accent || '#ddd'};
            border-radius: 50%;
        }
        
        .item-header {
            margin-bottom: 8px;
        }
        
        .item-title {
            font-weight: 600;
            color: ${colors.primary};
            font-size: 12px;
            margin-bottom: 3px;
        }
        
        .item-company, .item-school {
            font-style: italic;
            color: ${colors.secondary};
            font-size: 11px;
        }
        
        .item-date {
            font-size: ${fonts.size.small};
            color: ${colors.secondary};
            background: ${colors.accent || '#f0f0f0'};
            padding: 2px 8px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 5px;
        }
        
        .item-description {
            margin-top: 8px;
        }
        
        .item-description ul {
            margin-left: 15px;
        }
        
        .item-description li {
            margin-bottom: 4px;
        }
        
        .skills-grid {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .skill-category {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .skill-category-title {
            font-weight: 600;
            color: ${colors.primary};
            margin-bottom: 8px;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .skill-list {
            font-size: ${fonts.size.small};
            color: ${colors.text};
        }
        
        @media print {
            .resume-container { 
                margin: 0; 
                padding: 0.5in;
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .left-column {
                margin: 0;
                padding: 20px;
            }
            .header {
                margin: -0.5in -0.5in 20px -0.5in;
                padding: 20px 0.5in;
            }
            .section { page-break-inside: avoid; }
        }
    `;
  }

  /**
   * Generate header section
   */
  static generateHeader(userData, style) {
    const name = this.getFullName(userData);
    const contact = userData.personalInfo || {};
    
    const contactItems = [
      contact.email && `<span class="contact-item">${contact.email}</span>`,
      contact.phone && `<span class="contact-item">${contact.phone}</span>`,
      contact.location && `<span class="contact-item">${contact.location}</span>`,
      contact.linkedIn && `<span class="contact-item">${contact.linkedIn}</span>`,
      contact.portfolio && `<span class="contact-item">${contact.portfolio}</span>`
    ].filter(Boolean).join('');

    return `
        <div class="header">
            <div class="name">${name}</div>
            <div class="contact-info">
                ${contactItems}
            </div>
        </div>
    `;
  }

  /**
   * Generate sections based on template configuration
   */
  static generateSections(sections, userData, style) {
    const sortedSections = sections.sort((a, b) => a.order - b.order);
    
    return sortedSections.map(section => {
      if (section.id === 'header') return ''; // Header is handled separately
      
      const content = this.generateSectionContent(section, userData, style);
      if (!content) return '';
      
      return `
          <div class="section">
              <div class="section-title">${section.name}</div>
              ${content}
          </div>
      `;
    }).join('');
  }

  /**
   * Generate content for a specific section
   */
  static generateSectionContent(section, userData, style) {
    switch (section.id) {
      case 'summary':
        return this.generateSummary(userData);
      case 'experience':
        return this.generateExperience(userData);
      case 'skills':
        return this.generateSkills(userData);
      case 'education':
        return this.generateEducation(userData);
      case 'projects':
        return this.generateProjects(userData);
      case 'certifications':
        return this.generateCertifications(userData);
      case 'licenses':
        return this.generateLicenses(userData);
      case 'achievements':
        return this.generateAchievements(userData);
      case 'campaigns':
        return this.generateCampaigns(userData);
      case 'portfolio':
        return this.generatePortfolio(userData);
      case 'research':
        return this.generateResearch(userData);
      case 'innovations':
        return this.generateInnovations(userData);
      default:
        return '';
    }
  }

  /**
   * Helper methods for generating section content
   */
  static getFullName(userData) {
    const { firstName = 'John', lastName = 'Doe' } = userData.personalInfo || {};
    return `${firstName} ${lastName}`;
  }

  static generateSummary(userData) {
    const summary = userData.resume?.sections?.find(s => s.type === 'summary')?.content ||
                   userData.resume?.summary ||
                   'Experienced professional with a proven track record of success in delivering high-quality results and driving organizational growth.';
    
    return `<div class="summary-content">${summary}</div>`;
  }

  static generateExperience(userData) {
    const experiences = userData.resume?.experience || [];
    
    if (experiences.length === 0) {
      return '<div class="experience-item"><div class="item-title">Add your work experience</div></div>';
    }

    return experiences.map(exp => `
        <div class="experience-item">
            <div class="item-header">
                <div>
                    <div class="item-title">${exp.position || 'Position Title'}</div>
                    <div class="item-company">${exp.company || 'Company Name'}</div>
                </div>
                <div class="item-date">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}</div>
            </div>
            <div class="item-description">
                <div>${exp.description || ''}</div>
                ${exp.achievements && exp.achievements.length > 0 ? `
                    <ul>
                        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        </div>
    `).join('');
  }

  static generateSkills(userData) {
    const skills = userData.resume?.skills || [];
    
    if (skills.length === 0) {
      return `
          <div class="skills-grid">
              <div class="skill-category">
                  <div class="skill-category-title">Technical Skills</div>
                  <div class="skill-list">Add your skills here</div>
              </div>
          </div>
      `;
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

  static generateEducation(userData) {
    const education = userData.resume?.education || [];
    
    if (education.length === 0) {
      return '<div class="education-item"><div class="item-title">Add your education</div></div>';
    }

    return education.map(edu => `
        <div class="education-item">
            <div class="item-header">
                <div>
                    <div class="item-title">${edu.degree || 'Degree'} in ${edu.field || 'Field of Study'}</div>
                    <div class="item-school">${edu.institution || 'Institution Name'}</div>
                </div>
                <div class="item-date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</div>
            </div>
            ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            ${edu.honors && edu.honors.length > 0 ? `<div>Honors: ${edu.honors.join(', ')}</div>` : ''}
        </div>
    `).join('');
  }

  static generateProjects(userData) {
    const projects = userData.resume?.projects || [];
    
    if (projects.length === 0) return '';

    return projects.map(project => `
        <div class="project-item">
            <div class="item-header">
                <div>
                    <div class="item-title">${project.name || 'Project Name'}</div>
                    ${project.technologies ? `<div class="item-company">${project.technologies.join(', ')}</div>` : ''}
                </div>
                <div class="item-date">${this.formatDate(project.startDate)} - ${this.formatDate(project.endDate)}</div>
            </div>
            <div class="item-description">
                <div>${project.description || ''}</div>
                ${project.achievements && project.achievements.length > 0 ? `
                    <ul>
                        ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        </div>
    `).join('');
  }

  static generateCertifications(userData) {
    const certifications = userData.resume?.certifications || [];
    
    if (certifications.length === 0) return '';

    return certifications.map(cert => `
        <div class="certification-item">
            <div class="item-header">
                <div class="item-title">${cert.name || 'Certification Name'}</div>
                <div class="item-date">${this.formatDate(cert.issueDate)}</div>
            </div>
            <div class="item-company">${cert.issuer || 'Issuing Organization'}</div>
            ${cert.expiryDate ? `<div class="item-description">Expires: ${this.formatDate(cert.expiryDate)}</div>` : ''}
        </div>
    `).join('');
  }

  static generateLicenses(userData) {
    const licenses = userData.resume?.licenses || [];
    
    if (licenses.length === 0) return '';

    return licenses.map(license => `
        <div class="license-item">
            <div class="item-header">
                <div class="item-title">${license.name || 'License Name'}</div>
                <div class="item-date">${this.formatDate(license.issueDate)}</div>
            </div>
            <div class="item-company">${license.issuer || 'Issuing Authority'}</div>
            ${license.licenseNumber ? `<div class="item-description">License #: ${license.licenseNumber}</div>` : ''}
        </div>
    `).join('');
  }

  static generateAchievements(userData) {
    const achievements = userData.resume?.achievements || [];
    
    if (achievements.length === 0) return '';

    return `
        <div class="achievements-list">
            <ul>
                ${achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        </div>
    `;
  }

  static generateCampaigns(userData) {
    const campaigns = userData.resume?.campaigns || [];
    
    if (campaigns.length === 0) return '';

    return campaigns.map(campaign => `
        <div class="campaign-item">
            <div class="item-header">
                <div class="item-title">${campaign.name || 'Campaign Name'}</div>
                <div class="item-date">${this.formatDate(campaign.startDate)} - ${this.formatDate(campaign.endDate)}</div>
            </div>
            <div class="item-description">
                <div>${campaign.description || ''}</div>
                ${campaign.results && campaign.results.length > 0 ? `
                    <ul>
                        ${campaign.results.map(result => `<li>${result}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        </div>
    `).join('');
  }

  static generatePortfolio(userData) {
    const portfolio = userData.resume?.portfolio || [];
    
    if (portfolio.length === 0) return '';

    return portfolio.map(item => `
        <div class="portfolio-item">
            <div class="item-header">
                <div class="item-title">${item.title || 'Portfolio Item'}</div>
                ${item.url ? `<div class="item-date"><a href="${item.url}" target="_blank">View Project</a></div>` : ''}
            </div>
            <div class="item-description">
                <div>${item.description || ''}</div>
                ${item.technologies ? `<div class="item-company">Technologies: ${item.technologies.join(', ')}</div>` : ''}
            </div>
        </div>
    `).join('');
  }

  static generateResearch(userData) {
    const research = userData.resume?.research || [];
    
    if (research.length === 0) return '';

    return research.map(item => `
        <div class="research-item">
            <div class="item-header">
                <div class="item-title">${item.title || 'Research Title'}</div>
                <div class="item-date">${this.formatDate(item.date)}</div>
            </div>
            <div class="item-description">
                <div>${item.description || ''}</div>
                ${item.publication ? `<div class="item-company">Published in: ${item.publication}</div>` : ''}
            </div>
        </div>
    `).join('');
  }

  static generateInnovations(userData) {
    const innovations = userData.resume?.innovations || [];
    
    if (innovations.length === 0) return '';

    return innovations.map(innovation => `
        <div class="innovation-item">
            <div class="item-header">
                <div class="item-title">${innovation.title || 'Innovation Title'}</div>
                <div class="item-date">${this.formatDate(innovation.date)}</div>
            </div>
            <div class="item-description">
                <div>${innovation.description || ''}</div>
                ${innovation.impact ? `<div class="item-company">Impact: ${innovation.impact}</div>` : ''}
            </div>
        </div>
    `).join('');
  }

  static formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}

export default TemplateGenerators;