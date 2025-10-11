/**
 * ATS Format Detector - Analyzes resume formatting for ATS compatibility
 * Provides detailed feedback on formatting issues and recommendations
 */

export class ATSFormatDetector {
  constructor() {
    this.atsRules = this.initializeATSRules();
    this.formatPatterns = this.initializeFormatPatterns();
  }

  /**
   * Main method to analyze ATS formatting compatibility
   */
  analyzeATSCompatibility(resumeText) {
    const analysis = {
      overallScore: 0,
      issues: [],
      recommendations: [],
      strengths: [],
      details: {}
    };

    // Run all ATS compatibility checks
    const checks = [
      this.checkFileFormat(resumeText),
      this.checkSectionHeaders(resumeText),
      this.checkBulletPoints(resumeText),
      this.checkFontAndFormatting(resumeText),
      this.checkContactInformation(resumeText),
      this.checkDateFormats(resumeText),
      this.checkKeywordPlacement(resumeText),
      this.checkLength(resumeText),
      this.checkSpecialCharacters(resumeText),
      this.checkTableAndColumns(resumeText)
    ];

    // Aggregate results
    let totalScore = 0;
    checks.forEach(check => {
      totalScore += check.score;
      analysis.issues.push(...check.issues);
      analysis.recommendations.push(...check.recommendations);
      analysis.strengths.push(...check.strengths);
      analysis.details[check.category] = check;
    });

    analysis.overallScore = Math.round(totalScore / checks.length);
    
    // Remove duplicates and limit arrays
    analysis.issues = [...new Set(analysis.issues)].slice(0, 8);
    analysis.recommendations = [...new Set(analysis.recommendations)].slice(0, 8);
    analysis.strengths = [...new Set(analysis.strengths)].slice(0, 5);

    return analysis;
  }

  /**
   * Initialize ATS compatibility rules
   */
  initializeATSRules() {
    return {
      requiredSections: ['experience', 'education', 'skills'],
      preferredSections: ['summary', 'objective', 'contact', 'work history'],
      avoidElements: ['tables', 'text boxes', 'headers/footers', 'images', 'graphics'],
      preferredFormats: ['.docx', '.pdf', '.txt'],
      maxLength: 2, // pages
      minLength: 1, // page
      preferredFonts: ['Arial', 'Calibri', 'Times New Roman', 'Helvetica'],
      fontSize: { min: 10, max: 12, headers: { min: 12, max: 16 } }
    };
  }

  /**
   * Initialize format detection patterns
   */
  initializeFormatPatterns() {
    return {
      sectionHeaders: [
        /^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)$/im,
        /^(EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)$/im,
        /^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|EXPERTISE)$/im,
        /^(SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE)$/im,
        /^(CONTACT|CONTACT INFORMATION|PERSONAL DETAILS)$/im
      ],
      bulletPoints: [
        /^\s*[•\-\*\+]\s+/gm,
        /^\s*\d+\.\s+/gm,
        /^\s*[a-zA-Z]\.\s+/gm
      ],
      dates: [
        /\b(19|20)\d{2}\b/g,
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(19|20)?\d{2}\b/gi,
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
        /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g
      ],
      contact: {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phone: /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
        linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/gi,
        website: /https?:\/\/[^\s]+/g
      },
      specialChars: /[^\w\s\-.,;:()\[\]{}'"@#$%&+=\/\\|`~]/g,
      tables: /\|.*\|/g,
      columns: /\t{2,}|\s{4,}/g
    };
  }

  /**
   * Check file format compatibility
   */
  checkFileFormat(resumeText) {
    const result = {
      category: 'fileFormat',
      score: 85, // Assume good format since we're analyzing text
      issues: [],
      recommendations: [],
      strengths: []
    };

    // Since we're analyzing text, assume it's from a compatible format
    result.strengths.push('Resume content is accessible for ATS parsing');
    
    // Check for potential format issues in text
    if (resumeText.includes('\t')) {
      result.score -= 10;
      result.issues.push('Tab characters detected - may cause formatting issues');
      result.recommendations.push('Replace tabs with spaces for better compatibility');
    }

    if (resumeText.length < 500) {
      result.score -= 15;
      result.issues.push('Resume appears too short for comprehensive analysis');
      result.recommendations.push('Expand resume content with more detailed descriptions');
    }

    return result;
  }

  /**
   * Check section headers
   */
  checkSectionHeaders(resumeText) {
    const result = {
      category: 'sectionHeaders',
      score: 0,
      issues: [],
      recommendations: [],
      strengths: []
    };

    const foundSections = [];
    let headerScore = 0;

    // Check for required sections
    this.formatPatterns.sectionHeaders.forEach(pattern => {
      const matches = resumeText.match(pattern);
      if (matches) {
        foundSections.push(matches[0]);
        headerScore += 20;
      }
    });

    // Check for basic section indicators
    const basicSections = ['experience', 'education', 'skills', 'summary', 'work', 'employment'];
    basicSections.forEach(section => {
      if (new RegExp(section, 'i').test(resumeText) && !foundSections.some(found => 
        found.toLowerCase().includes(section))) {
        foundSections.push(section);
        headerScore += 10;
      }
    });

    result.score = Math.min(100, headerScore);

    if (foundSections.length >= 3) {
      result.strengths.push(`${foundSections.length} clear sections identified`);
    } else {
      result.issues.push('Missing clear section headers');
      result.recommendations.push('Add clear section headers like "EXPERIENCE", "EDUCATION", "SKILLS"');
    }

    if (foundSections.length < 2) {
      result.score = Math.max(20, result.score);
      result.issues.push('Very few sections detected');
      result.recommendations.push('Structure resume with standard sections');
    }

    return result;
  }

  /**
   * Check bullet point usage
   */
  checkBulletPoints(resumeText) {
    const result = {
      category: 'bulletPoints',
      score: 0,
      issues: [],
      recommendations: [],
      strengths: []
    };

    let bulletCount = 0;
    this.formatPatterns.bulletPoints.forEach(pattern => {
      const matches = resumeText.match(pattern);
      if (matches) {
        bulletCount += matches.length;
      }
    });

    if (bulletCount > 0) {
      result.score = Math.min(100, bulletCount * 10);
      result.strengths.push(`${bulletCount} bullet points found - good for readability`);
    } else {
      result.score = 30;
      result.issues.push('No bullet points detected');
      result.recommendations.push('Use bullet points to list achievements and responsibilities');
    }

    // Check for paragraph-heavy content
    const paragraphs = resumeText.split('\n\n').filter(p => p.trim().length > 100);
    if (paragraphs.length > 3 && bulletCount < 5) {
      result.score -= 20;
      result.issues.push('Too much paragraph text - difficult for ATS to parse');
      result.recommendations.push('Break down paragraphs into bullet points');
    }

    return result;
  }

  /**
   * Check font and formatting
   */
  checkFontAndFormatting(resumeText) {
    const result = {
      category: 'fontFormatting',
      score: 75, // Base score for plain text
      issues: [],
      recommendations: [],
      strengths: []
    };

    // Check for potential formatting issues
    const allCapsLines = resumeText.split('\n').filter(line => 
      line.length > 10 && line === line.toUpperCase() && /[A-Z]/.test(line)
    );

    if (allCapsLines.length > 5) {
      result.score -= 15;
      result.issues.push('Excessive use of ALL CAPS text');
      result.recommendations.push('Use title case for headers instead of ALL CAPS');
    } else if (allCapsLines.length > 0) {
      result.strengths.push('Appropriate use of capitalization for headers');
    }

    // Check for special formatting characters
    const specialFormatChars = resumeText.match(/[★☆●○■□▪▫]/g);
    if (specialFormatChars && specialFormatChars.length > 0) {
      result.score -= 10;
      result.issues.push('Special formatting characters detected');
      result.recommendations.push('Replace special characters with standard bullet points');
    }

    result.strengths.push('Text format is ATS-compatible');

    return result;
  }

  /**
   * Check contact information
   */
  checkContactInformation(resumeText) {
    const result = {
      category: 'contactInfo',
      score: 0,
      issues: [],
      recommendations: [],
      strengths: []
    };

    let contactScore = 0;
    const contactTypes = [];

    // Check for email
    if (this.formatPatterns.contact.email.test(resumeText)) {
      contactScore += 30;
      contactTypes.push('email');
    }

    // Check for phone
    if (this.formatPatterns.contact.phone.test(resumeText)) {
      contactScore += 25;
      contactTypes.push('phone');
    }

    // Check for LinkedIn
    if (this.formatPatterns.contact.linkedin.test(resumeText)) {
      contactScore += 20;
      contactTypes.push('LinkedIn');
    }

    // Check for website/portfolio
    if (this.formatPatterns.contact.website.test(resumeText)) {
      contactScore += 15;
      contactTypes.push('website');
    }

    result.score = Math.min(100, contactScore);

    if (contactTypes.length >= 2) {
      result.strengths.push(`Contact information includes: ${contactTypes.join(', ')}`);
    }

    if (!contactTypes.includes('email')) {
      result.issues.push('No email address detected');
      result.recommendations.push('Include a professional email address');
    }

    if (!contactTypes.includes('phone')) {
      result.issues.push('No phone number detected');
      result.recommendations.push('Include a phone number for contact');
    }

    if (contactTypes.length === 0) {
      result.score = 10;
      result.issues.push('No contact information detected');
      result.recommendations.push('Add contact information at the top of your resume');
    }

    return result;
  }

  /**
   * Check date formats
   */
  checkDateFormats(resumeText) {
    const result = {
      category: 'dateFormats',
      score: 70, // Base score
      issues: [],
      recommendations: [],
      strengths: []
    };

    let dateCount = 0;
    let standardDates = 0;

    this.formatPatterns.dates.forEach(pattern => {
      const matches = resumeText.match(pattern);
      if (matches) {
        dateCount += matches.length;
        if (pattern.source.includes('19|20')) {
          standardDates += matches.length;
        }
      }
    });

    if (dateCount > 0) {
      result.score = Math.min(100, 70 + (standardDates / dateCount) * 30);
      result.strengths.push(`${dateCount} dates found in resume`);
      
      if (standardDates / dateCount > 0.8) {
        result.strengths.push('Consistent date formatting used');
      } else {
        result.issues.push('Inconsistent date formats detected');
        result.recommendations.push('Use consistent date format (e.g., "Jan 2020" or "2020")');
      }
    } else {
      result.score = 40;
      result.issues.push('No dates detected in resume');
      result.recommendations.push('Include dates for education and work experience');
    }

    return result;
  }

  /**
   * Check keyword placement and density
   */
  checkKeywordPlacement(resumeText) {
    const result = {
      category: 'keywordPlacement',
      score: 60, // Base score
      issues: [],
      recommendations: [],
      strengths: []
    };

    // Check for skills section
    const hasSkillsSection = /skills|technical|competencies|expertise/i.test(resumeText);
    if (hasSkillsSection) {
      result.score += 20;
      result.strengths.push('Dedicated skills section detected');
    } else {
      result.issues.push('No clear skills section found');
      result.recommendations.push('Add a dedicated skills section');
    }

    // Check for action verbs
    const actionVerbs = ['achieved', 'managed', 'led', 'developed', 'implemented', 'created', 'designed', 'optimized'];
    const foundActionVerbs = actionVerbs.filter(verb => 
      new RegExp(`\\b${verb}`, 'i').test(resumeText)
    );

    if (foundActionVerbs.length >= 3) {
      result.score += 15;
      result.strengths.push(`${foundActionVerbs.length} action verbs used effectively`);
    } else {
      result.issues.push('Limited use of action verbs');
      result.recommendations.push('Use more action verbs to describe achievements');
    }

    // Check for quantifiable achievements
    const quantifiers = resumeText.match(/\d+%|\$\d+|increased|decreased|improved|reduced/gi);
    if (quantifiers && quantifiers.length >= 3) {
      result.score += 15;
      result.strengths.push('Quantifiable achievements included');
    } else {
      result.issues.push('Few quantifiable achievements found');
      result.recommendations.push('Add specific metrics and percentages to show impact');
    }

    return result;
  }

  /**
   * Check resume length
   */
  checkLength(resumeText) {
    const result = {
      category: 'length',
      score: 0,
      issues: [],
      recommendations: [],
      strengths: []
    };

    const wordCount = resumeText.split(/\s+/).length;
    const charCount = resumeText.length;

    // Estimate pages (roughly 250-300 words per page)
    const estimatedPages = wordCount / 275;

    if (estimatedPages >= 1 && estimatedPages <= 2.5) {
      result.score = 100;
      result.strengths.push(`Appropriate length (~${Math.round(estimatedPages * 10) / 10} pages)`);
    } else if (estimatedPages < 1) {
      result.score = 60;
      result.issues.push('Resume appears too short');
      result.recommendations.push('Expand with more detailed descriptions of experience');
    } else {
      result.score = 70;
      result.issues.push('Resume may be too long for ATS processing');
      result.recommendations.push('Consider condensing to 1-2 pages for better ATS compatibility');
    }

    if (wordCount < 200) {
      result.score = Math.min(result.score, 50);
      result.issues.push('Very limited content detected');
    }

    return result;
  }

  /**
   * Check for special characters that may cause issues
   */
  checkSpecialCharacters(resumeText) {
    const result = {
      category: 'specialCharacters',
      score: 90, // Start high
      issues: [],
      recommendations: [],
      strengths: []
    };

    const specialChars = resumeText.match(this.formatPatterns.specialChars);
    if (specialChars && specialChars.length > 0) {
      const uniqueChars = [...new Set(specialChars)];
      result.score -= Math.min(30, uniqueChars.length * 5);
      result.issues.push(`Special characters detected: ${uniqueChars.join(', ')}`);
      result.recommendations.push('Replace special characters with standard alternatives');
    } else {
      result.strengths.push('No problematic special characters found');
    }

    // Check for smart quotes and dashes
    const smartQuotes = resumeText.match(/[""'']/g);
    if (smartQuotes) {
      result.score -= 10;
      result.issues.push('Smart quotes detected');
      result.recommendations.push('Replace smart quotes with standard quotes');
    }

    return result;
  }

  /**
   * Check for tables and column formatting
   */
  checkTableAndColumns(resumeText) {
    const result = {
      category: 'tablesColumns',
      score: 85, // Base score
      issues: [],
      recommendations: [],
      strengths: []
    };

    // Check for table indicators
    const tableChars = resumeText.match(this.formatPatterns.tables);
    if (tableChars && tableChars.length > 0) {
      result.score -= 25;
      result.issues.push('Table formatting detected');
      result.recommendations.push('Convert tables to simple text format for better ATS compatibility');
    }

    // Check for excessive spacing (column indicators)
    const columnSpacing = resumeText.match(this.formatPatterns.columns);
    if (columnSpacing && columnSpacing.length > 3) {
      result.score -= 15;
      result.issues.push('Column-like spacing detected');
      result.recommendations.push('Use single spaces and line breaks instead of column formatting');
    }

    if (result.score >= 80) {
      result.strengths.push('Simple, ATS-friendly formatting detected');
    }

    return result;
  }

  /**
   * Get ATS compatibility summary
   */
  getCompatibilitySummary(analysis) {
    const { overallScore, issues, recommendations, strengths } = analysis;
    
    let level = 'Poor';
    let description = 'Significant ATS compatibility issues detected';
    
    if (overallScore >= 80) {
      level = 'Excellent';
      description = 'Resume is highly compatible with ATS systems';
    } else if (overallScore >= 65) {
      level = 'Good';
      description = 'Resume has good ATS compatibility with minor improvements needed';
    } else if (overallScore >= 50) {
      level = 'Fair';
      description = 'Resume has moderate ATS compatibility issues';
    }
    
    return {
      level,
      score: overallScore,
      description,
      topIssues: issues.slice(0, 3),
      topRecommendations: recommendations.slice(0, 3),
      keyStrengths: strengths.slice(0, 3)
    };
  }
}

// Export singleton instance
export const atsFormatDetector = new ATSFormatDetector();
export default ATSFormatDetector;