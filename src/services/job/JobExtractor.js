/**
 * Job URL Extractor Service
 * Extracts job details from various job posting websites
 */

import { JOB_EXTRACTION_CONFIG, ERROR_TYPES, ERROR_MESSAGES } from '../../config/interfaces.js';
import { geminiService } from '../ai/GeminiService.js';

class JobExtractor {
  constructor() {
    this.supportedSites = JOB_EXTRACTION_CONFIG.supportedSites;
    this.timeout = JOB_EXTRACTION_CONFIG.timeout;
    this.cache = new Map(); // Cache extracted job details
  }

  /**
   * Main method to extract job details from URL
   */
  async extractJobDetails(url) {
    try {
      // Validate URL
      if (!this.validateJobUrl(url)) {
        throw new Error('Invalid or unsupported job URL');
      }

      // Check cache first
      const cacheKey = this.getCacheKey(url);
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        // Return cached result if less than 24 hours old
        if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
          return {
            success: true,
            data: cached.data,
            method: 'cached',
            confidence: cached.confidence,
            extractionTime: 0
          };
        }
      }

      const startTime = Date.now();

      // Determine extraction method based on site
      const site = this.identifySiteEnhanced(url);
      let result;

      if (site && site.isSupported) {
        // Try CSS selector-based extraction first for supported sites
        result = await this.extractWithSelectors(url, site);

        if (!result.success) {
          // Fall back to AI-powered extraction
          result = await this.extractWithAI(url);
        }
      } else if (site) {
        // Known site but not fully supported - provide guidance
        result = {
          success: false,
          error: `${site.key} detected but requires manual input.`,
          method: 'guided',
          confidence: 0,
          siteInfo: site,
          guidance: `This appears to be a ${site.category} job site. Please copy the job posting content for analysis.`
        };
      } else {
        // Unknown site - use AI extraction
        result = await this.extractWithAI(url);
      }

      const extractionTime = Date.now() - startTime;
      result.extractionTime = extractionTime;

      // Cache successful results
      if (result.success) {
        this.cache.set(cacheKey, {
          data: result.data,
          confidence: result.confidence,
          timestamp: Date.now()
        });
      }

      return result;

    } catch (error) {
      console.error('Job extraction failed:', error);
      return {
        success: false,
        error: error.message,
        method: 'failed',
        confidence: 0,
        extractionTime: 0
      };
    }
  }

  /**
   * Validate if the URL is a supported job posting URL
   */
  validateJobUrl(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      // Check if it's a supported site
      const supportedDomains = Object.values(this.supportedSites).map(site => site.domain);
      const isSupported = supportedDomains.some(supportedDomain =>
        domain.includes(supportedDomain) || supportedDomain.includes(domain.replace('www.', ''))
      );

      // Also allow other job-related domains
      const jobKeywords = ['job', 'career', 'work', 'employment', 'hiring'];
      const hasJobKeywords = jobKeywords.some(keyword =>
        domain.includes(keyword) || urlObj.pathname.includes(keyword)
      );

      return isSupported || hasJobKeywords;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get list of supported job sites
   */
  getSupportedSites() {
    return Object.keys(this.supportedSites).map(key => ({
      name: key,
      domain: this.supportedSites[key].domain,
      displayName: this.formatSiteName(key),
      category: this.getSiteCategory(key),
      extractionMethod: 'css'
    }));
  }

  /**
   * Get comprehensive site support information
   */
  getAllKnownSites() {
    const supportedSites = this.getSupportedSites();

    const additionalSites = [
      { name: 'ZIPRECRUITER', domain: 'ziprecruiter.com', displayName: 'ZipRecruiter', category: 'general', extractionMethod: 'manual' },
      { name: 'CAREERBUILDER', domain: 'careerbuilder.com', displayName: 'CareerBuilder', category: 'general', extractionMethod: 'manual' },
      { name: 'DICE', domain: 'dice.com', displayName: 'Dice', category: 'tech', extractionMethod: 'manual' },
      { name: 'STACKOVERFLOW', domain: 'stackoverflow.com', displayName: 'Stack Overflow Jobs', category: 'tech', extractionMethod: 'manual' },
      { name: 'GITHUB', domain: 'github.com', displayName: 'GitHub Jobs', category: 'tech', extractionMethod: 'manual' },
      { name: 'ANGELLIST', domain: 'wellfound.com', displayName: 'Wellfound (AngelList)', category: 'startup', extractionMethod: 'manual' },
      { name: 'REMOTE', domain: 'remote.co', displayName: 'Remote.co', category: 'remote', extractionMethod: 'manual' },
      { name: 'FLEXJOBS', domain: 'flexjobs.com', displayName: 'FlexJobs', category: 'flexible', extractionMethod: 'manual' }
    ];

    return {
      supported: supportedSites,
      additional: additionalSites,
      total: supportedSites.length + additionalSites.length
    };
  }

  /**
   * Check if a URL is from a known job site
   */
  isKnownJobSite(url) {
    const site = this.identifySiteEnhanced(url);
    return site !== null;
  }

  /**
   * Get extraction capabilities for a specific URL
   */
  getExtractionCapabilities(url) {
    const site = this.identifySiteEnhanced(url);

    if (!site) {
      return {
        isKnown: false,
        isSupported: false,
        extractionMethods: ['ai', 'manual'],
        recommendation: 'Copy and paste the job description for AI-powered analysis'
      };
    }

    return {
      isKnown: true,
      isSupported: site.isSupported,
      siteName: site.key,
      category: site.category,
      extractionMethods: site.isSupported ? ['css', 'ai', 'manual'] : ['ai', 'manual'],
      recommendation: site.isSupported
        ? 'Automatic extraction available (currently requires manual input due to browser limitations)'
        : 'Copy and paste the job description for analysis',
      instructions: site.isSupported ? this.getSiteExtractionInstructions(site.key) : null
    };
  }

  /**
   * Identify which job site the URL belongs to
   */
  identifySite(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      for (const [siteKey, siteConfig] of Object.entries(this.supportedSites)) {
        if (domain.includes(siteConfig.domain) || siteConfig.domain.includes(domain.replace('www.', ''))) {
          return { key: siteKey, config: siteConfig };
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract job details using CSS selectors (for supported sites)
   */
  async extractWithSelectors(url, site) {
    try {
      // Since direct scraping is limited by CORS in browsers, we provide
      // site-specific guidance for manual extraction

      const siteInstructions = this.getSiteExtractionInstructions(site.key);

      return {
        success: false,
        error: 'Direct scraping not available in browser environment.',
        method: 'css',
        confidence: 0,
        siteInstructions: siteInstructions,
        supportedSite: true,
        extractionGuidance: `For ${site.key}, please copy the job posting content and we'll extract the details automatically.`
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        method: 'css',
        confidence: 0
      };
    }
  }

  /**
   * Get site-specific extraction instructions for users
   */
  getSiteExtractionInstructions(siteKey) {
    const instructions = {
      LINKEDIN: {
        title: 'Look for the job title at the top of the posting',
        company: 'Company name is usually below the job title',
        location: 'Location is typically shown near the company name',
        description: 'Copy the entire job description section',
        tips: ['Make sure to include the "About the job" section', 'Include requirements and qualifications']
      },
      INDEED: {
        title: 'Job title is prominently displayed at the top',
        company: 'Company name appears below the title',
        location: 'Location is shown with the company information',
        description: 'Copy the full job description',
        tips: ['Include both job summary and full description', 'Copy any listed benefits']
      },
      GLASSDOOR: {
        title: 'Job title is at the top of the job posting',
        company: 'Company name with rating is below the title',
        location: 'Location appears near company information',
        description: 'Copy the complete job overview',
        tips: ['Include company overview if available', 'Copy salary information if shown']
      },
      MONSTER: {
        title: 'Job title is prominently displayed',
        company: 'Company name appears below title',
        location: 'Location is shown with job details',
        description: 'Copy the entire job posting content',
        tips: ['Include job summary and detailed description', 'Copy requirements section']
      }
    };

    return instructions[siteKey] || {
      title: 'Look for the job title',
      company: 'Find the company name',
      location: 'Identify the job location',
      description: 'Copy the complete job description',
      tips: ['Include all relevant job details', 'Copy requirements and qualifications']
    };
  }

  /**
   * Enhanced site identification with more job sites
   */
  identifySiteEnhanced(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      const path = urlObj.pathname.toLowerCase();

      // Extended site detection
      const sitePatterns = {
        LINKEDIN: ['linkedin.com'],
        INDEED: ['indeed.com'],
        GLASSDOOR: ['glassdoor.com'],
        MONSTER: ['monster.com'],
        ZIPRECRUITER: ['ziprecruiter.com'],
        CAREERBUILDER: ['careerbuilder.com'],
        DICE: ['dice.com'],
        STACKOVERFLOW: ['stackoverflow.com/jobs'],
        GITHUB: ['github.com/jobs'],
        ANGELLIST: ['angel.co', 'wellfound.com'],
        REMOTE: ['remote.co', 'remoteok.io'],
        FLEXJOBS: ['flexjobs.com'],
        UPWORK: ['upwork.com'],
        FREELANCER: ['freelancer.com']
      };

      for (const [siteKey, patterns] of Object.entries(sitePatterns)) {
        for (const pattern of patterns) {
          if (domain.includes(pattern) || pattern.includes(domain.replace('www.', ''))) {
            return {
              key: siteKey,
              domain: pattern,
              isSupported: this.supportedSites[siteKey] !== undefined,
              category: this.getSiteCategory(siteKey)
            };
          }
        }
      }

      // Check for company career pages
      if (path.includes('career') || path.includes('job') || path.includes('hiring')) {
        return {
          key: 'COMPANY_CAREER_PAGE',
          domain: domain,
          isSupported: false,
          category: 'company'
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get site category for better handling
   */
  getSiteCategory(siteKey) {
    const categories = {
      LINKEDIN: 'general',
      INDEED: 'general',
      GLASSDOOR: 'general',
      MONSTER: 'general',
      ZIPRECRUITER: 'general',
      CAREERBUILDER: 'general',
      DICE: 'tech',
      STACKOVERFLOW: 'tech',
      GITHUB: 'tech',
      ANGELLIST: 'startup',
      REMOTE: 'remote',
      FLEXJOBS: 'flexible',
      UPWORK: 'freelance',
      FREELANCER: 'freelance'
    };

    return categories[siteKey] || 'general';
  }

  /**
   * Extract job details using AI-powered content analysis
   */
  async extractWithAI(url) {
    try {
      // Try to fetch the page content (may be limited by CORS)
      let htmlContent = '';

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.ok) {
          htmlContent = await response.text();
        }
      } catch (fetchError) {
        console.warn('Direct fetch failed, will require manual input:', fetchError);
      }

      if (htmlContent) {
        // Use Gemini to extract job details from HTML content
        const extractedData = await geminiService.extractJobDetails(htmlContent, url);

        return {
          success: true,
          data: extractedData,
          method: 'ai-gemini',
          confidence: 0.9,
          extractionTime: Date.now()
        };
      } else {
        // Return structured response indicating manual input needed
        return {
          success: false,
          error: 'Unable to fetch job content directly. Manual input required.',
          method: 'ai-gemini',
          confidence: 0,
          suggestion: 'Copy the job posting content and paste it below for AI-powered analysis.',
          aiCapable: true,
          requiresManualInput: true
        };
      }

    } catch (error) {
      console.error('AI extraction failed:', error);
      return {
        success: false,
        error: error.message,
        method: 'ai-gemini',
        confidence: 0,
        aiCapable: true,
        requiresManualInput: true
      };
    }
  }

  /**
   * Use AI to analyze manually provided job content
   */
  async analyzeJobContentWithAI(jobContent, jobUrl = '', additionalInfo = {}) {
    try {
      // Use Gemini service directly for job content analysis
      const extractedData = await geminiService.extractJobDetails(jobContent, jobUrl);

      // Validate and structure the response
      const jobDetails = {
        title: extractedData.title || additionalInfo.title || 'Position Title',
        company: extractedData.company || additionalInfo.company || 'Company Name',
        location: extractedData.location || 'Location not specified',
        experienceYears: extractedData.experienceYears || this.extractExperienceYears(jobContent),
        education: extractedData.education || this.extractEducation(jobContent),
        skills: Array.isArray(extractedData.skills) ? extractedData.skills : this.extractSkills(jobContent),
        requirements: Array.isArray(extractedData.requirements) ? extractedData.requirements : this.extractRequirements(jobContent),
        responsibilities: Array.isArray(extractedData.responsibilities) ? extractedData.responsibilities : [],
        benefits: Array.isArray(extractedData.benefits) ? extractedData.benefits : this.extractBenefits(jobContent),
        salary: extractedData.salary || this.extractSalary(jobContent),
        workType: extractedData.workType || this.extractWorkType(jobContent),
        employmentType: extractedData.employmentType || 'full-time',
        description: jobContent,
        url: jobUrl,
        extractedAt: new Date(),
        extractionMethod: 'ai'
      };

      // Cache the result
      const cacheKey = this.getCacheKey(jobUrl || `manual-${Date.now()}`);
      this.cache.set(cacheKey, {
        data: jobDetails,
        timestamp: Date.now(),
        confidence: 0.9
      });

      return {
        success: true,
        data: jobDetails,
        method: 'ai-gemini-manual',
        confidence: 0.9,
        extractionTime: Date.now()
      };

    } catch (error) {
      console.error('AI job content analysis failed:', error);
      // Fall back to rule-based extraction
      return this.parseJobDescription(jobContent, jobUrl, additionalInfo.title, additionalInfo.company);
    }
  }

  /**
   * Parse manually provided job description text
   */
  parseJobDescription(jobText, jobUrl = '', jobTitle = '', company = '') {
    try {
      // Extract comprehensive information using enhanced methods
      const extractedData = {
        title: jobTitle || this.extractTitle(jobText),
        company: company || this.extractCompany(jobText),
        location: this.extractLocation(jobText),
        requirements: this.extractRequirements(jobText),
        skills: this.extractSkillsAdvanced(jobText),
        responsibilities: this.extractResponsibilities(jobText),
        experienceYears: this.extractExperienceYears(jobText),
        education: this.extractEducation(jobText),
        salary: this.extractSalary(jobText),
        benefits: this.extractBenefits(jobText),
        workType: this.extractWorkType(jobText),
        employmentType: this.extractEmploymentType(jobText),
        description: jobText,
        url: jobUrl,
        extractedAt: new Date(),
        extractionMethod: 'rule-based'
      };

      // Validate the extracted data
      const validation = this.validateJobData(extractedData);

      return {
        success: true,
        data: extractedData,
        method: 'manual',
        confidence: validation.isValid ? 0.8 : 0.6,
        extractionTime: 0,
        validation: validation
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        method: 'manual',
        confidence: 0
      };
    }
  }

  /**
   * Extract employment type from job text
   */
  extractEmploymentType(text) {
    const textLower = text.toLowerCase();

    if (textLower.includes('part-time') || textLower.includes('part time')) {
      return 'part-time';
    }

    if (textLower.includes('contract') || textLower.includes('contractor') || textLower.includes('freelance')) {
      return 'contract';
    }

    if (textLower.includes('intern') || textLower.includes('internship')) {
      return 'internship';
    }

    if (textLower.includes('temporary') || textLower.includes('temp')) {
      return 'temporary';
    }

    // Default to full-time
    return 'full-time';
  }

  /**
   * Extract job title from text
   */
  extractTitle(text) {
    // Look for common title patterns
    const titlePatterns = [
      /job title[:\s]+([^\n\r]+)/i,
      /position[:\s]+([^\n\r]+)/i,
      /role[:\s]+([^\n\r]+)/i,
      /^([^\n\r]+(?:engineer|developer|manager|analyst|specialist|coordinator|director|lead))/i
    ];

    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback: use first line if it looks like a title
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length < 100 && firstLine.length > 5) {
      return firstLine;
    }

    return 'Position Title';
  }

  /**
   * Extract company name from text
   */
  extractCompany(text) {
    const companyPatterns = [
      /company[:\s]+([^\n\r]+)/i,
      /employer[:\s]+([^\n\r]+)/i,
      /organization[:\s]+([^\n\r]+)/i,
      /at\s+([A-Z][a-zA-Z\s&.,]+)(?:\s|$)/,
      /([A-Z][a-zA-Z\s&.,]+)\s+is\s+(?:seeking|looking|hiring)/i
    ];

    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        if (company.length < 50) {
          return company;
        }
      }
    }

    return 'Company Name';
  }

  /**
   * Extract requirements from job text
   */
  extractRequirements(text) {
    const requirements = [];
    const sections = text.split(/(?:requirements?|qualifications?|must have|essential)[:\s]*\n/i);

    if (sections.length > 1) {
      const reqSection = sections[1].split(/(?:responsibilities?|duties|about|benefits)/i)[0];
      const lines = reqSection.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 10 && trimmed.length < 200) {
          // Remove bullet points and clean up
          const cleaned = trimmed.replace(/^[-•*]\s*/, '').trim();
          if (cleaned.length > 5) {
            requirements.push(cleaned);
          }
        }
      }
    }

    // If no structured requirements found, extract key phrases
    if (requirements.length === 0) {
      const keyPhrases = [
        /(\d+\+?\s*years?\s*(?:of\s*)?experience)/gi,
        /(bachelor'?s?\s*(?:degree)?)/gi,
        /(master'?s?\s*(?:degree)?)/gi,
        /(experience\s+(?:with|in)\s+[^.]+)/gi
      ];

      for (const pattern of keyPhrases) {
        const matches = text.match(pattern);
        if (matches) {
          requirements.push(...matches.slice(0, 3));
        }
      }
    }

    return requirements.slice(0, 10); // Limit to 10 requirements
  }

  /**
   * Extract skills from job text
   */
  extractSkills(text) {
    const commonSkills = [
      // Programming languages
      'javascript', 'python', 'java', 'typescript', 'c#', 'c++', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      // Frameworks and libraries
      'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
      // Databases
      'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
      // Cloud and DevOps
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
      // Other technical skills
      'html', 'css', 'rest', 'api', 'microservices', 'agile', 'scrum', 'testing'
    ];

    const foundSkills = [];
    const textLower = text.toLowerCase();

    for (const skill of commonSkills) {
      if (textLower.includes(skill)) {
        foundSkills.push(skill);
      }
    }

    // Also look for skills in parentheses or after colons
    const skillPatterns = [
      /skills?[:\s]+([^.]+)/gi,
      /technologies?[:\s]+([^.]+)/gi,
      /tools?[:\s]+([^.]+)/gi
    ];

    for (const pattern of skillPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const skillText = match.split(':')[1] || match;
          const extractedSkills = skillText.split(/[,;]/).map(s => s.trim().toLowerCase());
          foundSkills.push(...extractedSkills.slice(0, 5));
        }
      }
    }

    return [...new Set(foundSkills)].slice(0, 15); // Remove duplicates and limit
  }

  /**
   * Extract experience years requirement
   */
  extractExperienceYears(text) {
    const expPatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /minimum\s*(?:of\s*)?(\d+)\s*years?/i,
      /at\s*least\s*(\d+)\s*years?/i,
      /(\d+)-\d+\s*years?\s*experience/i
    ];

    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }

    // Default based on seniority level
    const textLower = text.toLowerCase();
    if (textLower.includes('senior') || textLower.includes('lead')) return 5;
    if (textLower.includes('mid') || textLower.includes('intermediate')) return 3;
    if (textLower.includes('junior') || textLower.includes('entry')) return 1;

    return 2; // Default
  }

  /**
   * Extract education requirements
   */
  extractEducation(text) {
    const eduPatterns = [
      /(bachelor'?s?\s*(?:degree)?(?:\s*in\s*[^.]+)?)/gi,
      /(master'?s?\s*(?:degree)?(?:\s*in\s*[^.]+)?)/gi,
      /(phd|doctorate|doctoral)/gi,
      /(associate'?s?\s*degree)/gi,
      /(high\s*school|diploma)/gi
    ];

    for (const pattern of eduPatterns) {
      const match = text.match(pattern);
      if (match && match[0]) {
        return match[0].trim();
      }
    }

    return 'Not specified';
  }

  /**
   * Extract location from job text
   */
  extractLocation(text) {
    const locationPatterns = [
      /location[:\s]+([^\n\r]+)/i,
      /based\s+in\s+([^.\n\r]+)/i,
      /(?:remote|hybrid|on-site)/gi
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Look for common location formats
    const cityStatePattern = /([A-Z][a-z]+,\s*[A-Z]{2})/;
    const cityMatch = text.match(cityStatePattern);
    if (cityMatch) {
      return cityMatch[1];
    }

    return 'Location not specified';
  }

  /**
   * Extract salary information
   */
  extractSalary(text) {
    const salaryPatterns = [
      /\$(\d{2,3}),?(\d{3})\s*-\s*\$(\d{2,3}),?(\d{3})/,
      /\$(\d{2,3})k?\s*-\s*\$(\d{2,3})k?/i,
      /salary[:\s]+\$?([0-9,]+)/i
    ];

    for (const pattern of salaryPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Extract salary range if found
        if (match[1] && match[3]) {
          return {
            min: parseInt(match[1] + match[2]),
            max: parseInt(match[3] + match[4]),
            currency: 'USD',
            period: 'yearly'
          };
        }
      }
    }

    return null;
  }

  /**
   * Extract benefits from job text
   */
  extractBenefits(text) {
    const benefits = [];
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'vacation', 'pto', 'remote work', 'flexible hours',
      'stock options', 'bonus', 'training', 'development'
    ];

    const textLower = text.toLowerCase();
    for (const benefit of benefitKeywords) {
      if (textLower.includes(benefit)) {
        benefits.push(benefit);
      }
    }

    return benefits.slice(0, 8); // Limit to 8 benefits
  }

  /**
   * Extract work type (remote/hybrid/onsite) from job text
   */
  extractWorkType(text) {
    const textLower = text.toLowerCase();

    if (textLower.includes('remote') && !textLower.includes('no remote')) {
      if (textLower.includes('hybrid') || textLower.includes('flexible')) {
        return 'hybrid';
      }
      return 'remote';
    }

    if (textLower.includes('hybrid')) {
      return 'hybrid';
    }

    if (textLower.includes('on-site') || textLower.includes('onsite') || textLower.includes('office')) {
      return 'onsite';
    }

    return 'not specified';
  }

  /**
   * Enhanced skill extraction with better pattern matching
   */
  extractSkillsAdvanced(text) {
    const skills = new Set();

    // Technical skills database
    const skillDatabase = {
      programming: [
        'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
        'scala', 'r', 'matlab', 'perl', 'shell', 'bash', 'powershell'
      ],
      frameworks: [
        'react', 'angular', 'vue', 'svelte', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
        'rails', 'asp.net', '.net', 'jquery', 'bootstrap', 'tailwind'
      ],
      databases: [
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb',
        'oracle', 'sqlite', 'mariadb'
      ],
      cloud: [
        'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'terraform',
        'ansible', 'chef', 'puppet'
      ],
      tools: [
        'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'teams',
        'figma', 'sketch', 'adobe', 'photoshop', 'illustrator'
      ],
      methodologies: [
        'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd', 'microservices',
        'rest', 'graphql', 'api', 'soap'
      ]
    };

    const textLower = text.toLowerCase();

    // Extract from skill database
    Object.values(skillDatabase).flat().forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    });

    // Extract skills from structured sections
    const skillSections = text.match(/(?:skills?|technologies?|tools?|requirements?)[:\s]*([^.]+)/gi);
    if (skillSections) {
      skillSections.forEach(section => {
        const skillText = section.split(':')[1] || section;
        const extractedSkills = skillText.split(/[,;•\n]/)
          .map(s => s.trim().toLowerCase())
          .filter(s => s.length > 1 && s.length < 30);
        extractedSkills.forEach(skill => skills.add(skill));
      });
    }

    return Array.from(skills).slice(0, 20); // Limit to 20 skills
  }

  /**
   * Extract job responsibilities from text
   */
  extractResponsibilities(text) {
    const responsibilities = [];

    // Look for responsibility sections
    const respSections = text.split(/(?:responsibilities?|duties|role|what you.?ll do)[:\s]*\n/i);

    if (respSections.length > 1) {
      const respSection = respSections[1].split(/(?:requirements?|qualifications?|skills|benefits)/i)[0];
      const lines = respSection.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 15 && trimmed.length < 300) {
          const cleaned = trimmed.replace(/^[-•*]\s*/, '').trim();
          if (cleaned.length > 10) {
            responsibilities.push(cleaned);
          }
        }
      }
    }

    return responsibilities.slice(0, 8); // Limit to 8 responsibilities
  }

  /**
   * Validate extracted job data
   */
  validateJobData(jobData) {
    const errors = [];

    if (!jobData.title || jobData.title.length < 3) {
      errors.push('Job title is missing or too short');
    }

    if (!jobData.company || jobData.company.length < 2) {
      errors.push('Company name is missing or too short');
    }

    if (!Array.isArray(jobData.skills) || jobData.skills.length === 0) {
      errors.push('No skills extracted');
    }

    if (!Array.isArray(jobData.requirements) || jobData.requirements.length === 0) {
      errors.push('No requirements extracted');
    }

    if (typeof jobData.experienceYears !== 'number' || jobData.experienceYears < 0) {
      errors.push('Invalid experience years');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: errors.length > 0 ? ['Some job details may be incomplete'] : []
    };
  }

  /**
   * Generate cache key for URL
   */
  getCacheKey(url) {
    return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  /**
   * Format site name for display
   */
  formatSiteName(siteKey) {
    return siteKey.charAt(0).toUpperCase() + siteKey.slice(1).toLowerCase();
  }

  /**
   * Clear cache (for testing or memory management)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const jobExtractor = new JobExtractor();
export default JobExtractor;