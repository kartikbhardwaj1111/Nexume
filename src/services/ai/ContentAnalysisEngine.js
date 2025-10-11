/**
 * Content Analysis Engine - Advanced rule-based scoring system for offline analysis
 * Provides comprehensive resume analysis without requiring external AI services
 */

import { atsFormatDetector } from './ATSFormatDetector.js';

export class ContentAnalysisEngine {
  constructor() {
    this.skillsDatabase = this.initializeSkillsDatabase();
    this.industryKeywords = this.initializeIndustryKeywords();
    this.atsKeywords = this.initializeATSKeywords();
    this.experiencePatterns = this.initializeExperiencePatterns();
  }

  /**
   * Main analysis method - provides comprehensive content analysis
   */
  analyzeContent(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Perform comprehensive analysis
    const skillsAnalysis = this.analyzeSkills(resumeText, jobDescription);
    const experienceAnalysis = this.analyzeExperience(resumeText, jobDescription);
    const educationAnalysis = this.analyzeEducation(resumeText, jobDescription);
    const formatAnalysis = this.analyzeFormatting(resumeText);
    const keywordAnalysis = this.analyzeKeywords(resumeText, jobDescription);
    const industryAnalysis = this.analyzeIndustryFit(resumeText, jobDescription);
    const atsAnalysis = atsFormatDetector.analyzeATSCompatibility(resumeText);
    
    // Calculate weighted scores
    const scores = this.calculateWeightedScores({
      skillsAnalysis,
      experienceAnalysis,
      educationAnalysis,
      formatAnalysis,
      keywordAnalysis,
      industryAnalysis,
      atsAnalysis
    });
    
    // Generate recommendations
    const recommendations = this.generateDetailedRecommendations({
      skillsAnalysis,
      experienceAnalysis,
      educationAnalysis,
      formatAnalysis,
      keywordAnalysis,
      industryAnalysis,
      atsAnalysis
    });
    
    return {
      overall_score: scores.overall,
      confidence: scores.confidence,
      pillars: {
        core_skills: {
          score: scores.skills,
          matched: skillsAnalysis.matchedSkills,
          required_count: skillsAnalysis.requiredSkills.length
        },
        relevant_experience: {
          score: scores.experience,
          candidate_years: experienceAnalysis.candidateYears,
          jd_years: experienceAnalysis.requiredYears,
          evidence: experienceAnalysis.evidence
        },
        tools_methodologies: {
          score: scores.tools,
          matched: skillsAnalysis.matchedTools
        },
        education_credentials: {
          score: scores.education,
          degree: educationAnalysis.degree,
          notes: educationAnalysis.notes
        }
      },
      recommendations,
      errors: [],
      analysisDetails: {
        skillsAnalysis,
        experienceAnalysis,
        educationAnalysis,
        formatAnalysis,
        keywordAnalysis,
        industryAnalysis,
        atsAnalysis
      }
    };
  }

  /**
   * Initialize comprehensive skills database
   */
  initializeSkillsDatabase() {
    return {
      programming: {
        languages: ['javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'matlab'],
        frameworks: ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', 'flutter', 'xamarin'],
        databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite', 'cassandra', 'dynamodb'],
        cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github actions'],
        tools: ['git', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop', 'illustrator']
      },
      business: {
        analytics: ['excel', 'powerbi', 'tableau', 'looker', 'google analytics', 'sql', 'r', 'python', 'sas', 'spss'],
        marketing: ['seo', 'sem', 'ppc', 'social media', 'content marketing', 'email marketing', 'hubspot', 'salesforce', 'marketo'],
        finance: ['financial modeling', 'valuation', 'risk management', 'bloomberg', 'reuters', 'quickbooks', 'sap', 'oracle financials'],
        project: ['agile', 'scrum', 'kanban', 'waterfall', 'pmp', 'prince2', 'jira', 'asana', 'trello', 'monday.com']
      },
      healthcare: {
        clinical: ['patient care', 'medical records', 'hipaa', 'epic', 'cerner', 'meditech', 'allscripts'],
        research: ['clinical trials', 'gcp', 'fda regulations', 'statistical analysis', 'medical writing'],
        administration: ['healthcare management', 'quality assurance', 'compliance', 'billing', 'coding']
      },
      education: {
        teaching: ['curriculum development', 'lesson planning', 'classroom management', 'assessment', 'differentiated instruction'],
        technology: ['lms', 'blackboard', 'canvas', 'moodle', 'google classroom', 'zoom', 'teams'],
        research: ['academic writing', 'grant writing', 'statistical analysis', 'literature review']
      }
    };
  }

  /**
   * Initialize industry-specific keywords
   */
  initializeIndustryKeywords() {
    return {
      technology: ['software', 'development', 'programming', 'coding', 'algorithm', 'architecture', 'scalability', 'performance', 'security', 'api', 'microservices', 'devops', 'ci/cd', 'agile', 'scrum'],
      finance: ['financial', 'investment', 'portfolio', 'risk', 'compliance', 'audit', 'accounting', 'budgeting', 'forecasting', 'analysis', 'modeling', 'valuation', 'derivatives', 'trading'],
      healthcare: ['patient', 'clinical', 'medical', 'healthcare', 'treatment', 'diagnosis', 'therapy', 'nursing', 'pharmaceutical', 'research', 'compliance', 'hipaa', 'quality'],
      marketing: ['brand', 'campaign', 'digital', 'social media', 'content', 'seo', 'analytics', 'conversion', 'engagement', 'roi', 'lead generation', 'customer acquisition'],
      education: ['teaching', 'curriculum', 'student', 'learning', 'assessment', 'instruction', 'classroom', 'academic', 'research', 'pedagogy', 'educational technology']
    };
  }

  /**
   * Initialize ATS-friendly keywords and formatting patterns
   */
  initializeATSKeywords() {
    return {
      actionVerbs: ['achieved', 'managed', 'led', 'developed', 'implemented', 'created', 'designed', 'optimized', 'improved', 'increased', 'reduced', 'streamlined', 'coordinated', 'executed', 'delivered'],
      quantifiers: ['%', 'percent', 'million', 'thousand', 'billion', '$', 'revenue', 'cost', 'budget', 'team', 'projects', 'clients', 'users', 'customers'],
      certifications: ['certified', 'certification', 'license', 'accredited', 'credential', 'pmp', 'cissp', 'aws', 'azure', 'google', 'microsoft', 'cisco', 'comptia'],
      softSkills: ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'creative', 'detail oriented', 'time management', 'adaptability', 'collaboration']
    };
  }

  /**
   * Initialize experience extraction patterns
   */
  initializeExperiencePatterns() {
    return {
      years: [
        /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi,
        /(\d+)\+?\s*(year|yr)\s*(experience|exp)/gi,
        /(\d+)\+?\s*(years?|yrs?)/gi
      ],
      positions: [
        /(senior|sr\.?|lead|principal|chief|head|director|manager|supervisor|coordinator|specialist|analyst|engineer|developer|designer|consultant)/gi
      ],
      companies: [
        /(worked\s+at|employed\s+by|position\s+at|role\s+at|experience\s+at)/gi
      ]
    };
  }

  /**
   * Analyze skills match between resume and job description
   */
  analyzeSkills(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Extract all skills from database
    const allSkills = [];
    const allTools = [];
    
    Object.values(this.skillsDatabase).forEach(category => {
      Object.values(category).forEach(skillArray => {
        if (Array.isArray(skillArray)) {
          allSkills.push(...skillArray);
        }
      });
    });
    
    // Find skills in resume and job description
    const resumeSkills = allSkills.filter(skill => resume.includes(skill.toLowerCase()));
    const requiredSkills = allSkills.filter(skill => jd.includes(skill.toLowerCase()));
    const matchedSkills = resumeSkills.filter(skill => requiredSkills.includes(skill));
    
    // Analyze tools and methodologies
    const toolKeywords = ['agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'testing', 'debugging', 'api', 'microservices', 'cloud', 'docker', 'kubernetes'];
    const resumeTools = toolKeywords.filter(tool => resume.includes(tool));
    const requiredTools = toolKeywords.filter(tool => jd.includes(tool));
    const matchedTools = resumeTools.filter(tool => requiredTools.includes(tool));
    
    // Calculate skill density and relevance
    const skillDensity = resumeSkills.length / Math.max(1, resumeText.split(/\s+/).length / 100);
    const skillRelevance = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 0;
    
    return {
      resumeSkills,
      requiredSkills,
      matchedSkills,
      resumeTools,
      requiredTools,
      matchedTools,
      skillDensity,
      skillRelevance,
      totalSkillsFound: resumeSkills.length,
      criticalSkillsMissing: requiredSkills.filter(skill => !matchedSkills.includes(skill))
    };
  }

  /**
   * Analyze experience level and relevance
   */
  analyzeExperience(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Extract years of experience
    let candidateYears = 0;
    let requiredYears = 0;
    
    // Try multiple patterns for candidate years
    for (const pattern of this.experiencePatterns.years) {
      const matches = resume.match(pattern);
      if (matches) {
        const years = matches.map(match => {
          const nums = match.match(/\d+/g);
          return nums ? Math.max(...nums.map(Number)) : 0;
        });
        candidateYears = Math.max(candidateYears, ...years);
      }
    }
    
    // Extract required years from job description
    for (const pattern of this.experiencePatterns.years) {
      const matches = jd.match(pattern);
      if (matches) {
        const years = matches.map(match => {
          const nums = match.match(/\d+/g);
          return nums ? Math.max(...nums.map(Number)) : 0;
        });
        requiredYears = Math.max(requiredYears, ...years);
      }
    }
    
    // If no specific years found, estimate from content
    if (candidateYears === 0) {
      const positions = (resume.match(/(position|role|job|work)/g) || []).length;
      const companies = (resume.match(/(company|corporation|inc|llc|ltd)/g) || []).length;
      candidateYears = Math.min(positions * 1.5, companies * 2, 15); // Estimate
    }
    
    if (requiredYears === 0) {
      // Default based on job level indicators
      if (jd.includes('senior') || jd.includes('lead')) requiredYears = 5;
      else if (jd.includes('junior') || jd.includes('entry')) requiredYears = 1;
      else requiredYears = 3;
    }
    
    // Analyze experience quality
    const evidence = [];
    const actionVerbs = this.atsKeywords.actionVerbs.filter(verb => resume.includes(verb));
    const quantifiers = this.atsKeywords.quantifiers.filter(quant => resume.includes(quant));
    
    if (actionVerbs.length > 0) evidence.push(`${actionVerbs.length} action verbs found`);
    if (quantifiers.length > 0) evidence.push(`${quantifiers.length} quantifiable achievements`);
    
    // Check for leadership indicators
    const leadershipTerms = ['led', 'managed', 'supervised', 'coordinated', 'directed', 'team', 'project'];
    const leadershipCount = leadershipTerms.filter(term => resume.includes(term)).length;
    if (leadershipCount > 2) evidence.push('Leadership experience indicated');
    
    return {
      candidateYears,
      requiredYears,
      evidence,
      actionVerbCount: actionVerbs.length,
      quantifierCount: quantifiers.length,
      leadershipIndicators: leadershipCount,
      experienceQuality: this.calculateExperienceQuality(actionVerbs.length, quantifiers.length, leadershipCount)
    };
  }

  /**
   * Analyze education background
   */
  analyzeEducation(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Education level detection
    let educationLevel = 'none';
    let degree = 'Not specified';
    let notes = '';
    
    if (resume.includes('phd') || resume.includes('doctorate') || resume.includes('doctoral')) {
      educationLevel = 'doctorate';
      degree = 'Doctoral degree (PhD)';
    } else if (resume.includes('master') || resume.includes('mba') || resume.includes('ms') || resume.includes('ma')) {
      educationLevel = 'masters';
      degree = 'Master\'s degree';
    } else if (resume.includes('bachelor') || resume.includes('bs') || resume.includes('ba') || resume.includes('bsc')) {
      educationLevel = 'bachelors';
      degree = 'Bachelor\'s degree';
    } else if (resume.includes('associate') || resume.includes('aa') || resume.includes('as')) {
      educationLevel = 'associates';
      degree = 'Associate degree';
    } else if (resume.includes('diploma') || resume.includes('certificate') || resume.includes('certification')) {
      educationLevel = 'certificate';
      degree = 'Certificate/Diploma';
    } else if (resume.includes('university') || resume.includes('college') || resume.includes('school')) {
      educationLevel = 'some';
      degree = 'Some college education';
    }
    
    // Check for relevant field of study
    const relevantFields = this.extractRelevantFields(jd);
    const hasRelevantField = relevantFields.some(field => resume.includes(field));
    
    if (hasRelevantField) {
      notes = 'Relevant field of study detected';
    }
    
    // Check for certifications
    const certifications = this.atsKeywords.certifications.filter(cert => resume.includes(cert));
    if (certifications.length > 0) {
      notes += notes ? '; ' : '';
      notes += `${certifications.length} professional certifications found`;
    }
    
    return {
      educationLevel,
      degree,
      notes,
      hasRelevantField,
      certifications,
      certificationCount: certifications.length
    };
  }

  /**
   * Analyze resume formatting and ATS compatibility
   */
  analyzeFormatting(resumeText) {
    const text = resumeText;
    const lines = text.split('\n');
    
    // Check for proper sections
    const sections = ['experience', 'education', 'skills', 'summary', 'objective', 'work', 'employment'];
    const foundSections = sections.filter(section => 
      new RegExp(section, 'i').test(text)
    );
    
    // Check for bullet points
    const bulletPatterns = [/^\s*[•\-\*]/gm, /^\s*\d+\./gm];
    const hasBulletPoints = bulletPatterns.some(pattern => pattern.test(text));
    
    // Check for proper headers
    const headerPatterns = [
      /^[A-Z\s]{3,}$/gm, // All caps headers
      /^[A-Za-z\s]+:$/gm, // Headers with colons
      /^\s*[A-Z][a-z\s]+\s*$/gm // Title case headers
    ];
    const hasHeaders = headerPatterns.some(pattern => pattern.test(text));
    
    // Check length and structure
    const wordCount = text.split(/\s+/).length;
    const characterCount = text.length;
    const lineCount = lines.length;
    
    // Check for contact information
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phonePattern = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
    const hasEmail = emailPattern.test(text);
    const hasPhone = phonePattern.test(text);
    
    // Check for dates
    const datePattern = /\b(19|20)\d{2}\b|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/i;
    const hasDates = datePattern.test(text);
    
    return {
      foundSections,
      sectionCount: foundSections.length,
      hasBulletPoints,
      hasHeaders,
      wordCount,
      characterCount,
      lineCount,
      hasEmail,
      hasPhone,
      hasDates,
      atsCompatibility: this.calculateATSCompatibility({
        foundSections: foundSections.length,
        hasBulletPoints,
        hasHeaders,
        wordCount,
        hasEmail,
        hasPhone
      })
    };
  }

  /**
   * Analyze keyword optimization
   */
  analyzeKeywords(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Extract important keywords from job description
    const jdWords = jd.split(/\s+/).filter(word => word.length > 3);
    const jdKeywords = [...new Set(jdWords)]; // Remove duplicates
    
    // Find keyword matches
    const matchedKeywords = jdKeywords.filter(keyword => resume.includes(keyword));
    const keywordDensity = matchedKeywords.length / Math.max(1, jdKeywords.length);
    
    // Analyze action verbs usage
    const actionVerbs = this.atsKeywords.actionVerbs.filter(verb => resume.includes(verb));
    
    // Analyze soft skills
    const softSkills = this.atsKeywords.softSkills.filter(skill => resume.includes(skill));
    
    return {
      jdKeywords: jdKeywords.slice(0, 20), // Top 20 keywords
      matchedKeywords: matchedKeywords.slice(0, 15), // Top 15 matches
      keywordDensity,
      actionVerbs,
      softSkills,
      keywordOptimization: keywordDensity * 100
    };
  }

  /**
   * Analyze industry fit
   */
  analyzeIndustryFit(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Determine industry from job description
    let detectedIndustry = 'general';
    let industryScore = 0;
    
    for (const [industry, keywords] of Object.entries(this.industryKeywords)) {
      const matchCount = keywords.filter(keyword => jd.includes(keyword)).length;
      if (matchCount > industryScore) {
        industryScore = matchCount;
        detectedIndustry = industry;
      }
    }
    
    // Check resume alignment with detected industry
    const industryKeywords = this.industryKeywords[detectedIndustry] || [];
    const resumeIndustryMatches = industryKeywords.filter(keyword => resume.includes(keyword));
    const industryAlignment = industryKeywords.length > 0 ? 
      resumeIndustryMatches.length / industryKeywords.length : 0;
    
    return {
      detectedIndustry,
      industryAlignment,
      industryKeywords: industryKeywords.slice(0, 10),
      resumeIndustryMatches,
      industryFitScore: industryAlignment * 100
    };
  }

  /**
   * Calculate weighted scores for all analysis components
   */
  calculateWeightedScores(analysis) {
    const {
      skillsAnalysis,
      experienceAnalysis,
      educationAnalysis,
      formatAnalysis,
      keywordAnalysis,
      industryAnalysis,
      atsAnalysis
    } = analysis;
    
    // Skills score (max 40 points)
    let skillsScore = 0;
    if (skillsAnalysis.totalSkillsFound > 0) skillsScore += 10;
    skillsScore += Math.min(30, skillsAnalysis.skillRelevance * 30);
    
    // Experience score (max 30 points)
    let experienceScore = 0;
    if (experienceAnalysis.candidateYears > 0) experienceScore += 10;
    const expRatio = Math.min(1, experienceAnalysis.candidateYears / Math.max(1, experienceAnalysis.requiredYears));
    experienceScore += expRatio * 15;
    experienceScore += Math.min(5, experienceAnalysis.experienceQuality);
    
    // Tools score (max 20 points)
    let toolsScore = 0;
    toolsScore += Math.min(10, skillsAnalysis.matchedTools.length * 2);
    toolsScore += Math.min(10, keywordAnalysis.keywordOptimization / 10);
    
    // Education score (max 10 points)
    let educationScore = 0;
    const eduLevels = { 'doctorate': 10, 'masters': 8, 'bachelors': 6, 'associates': 4, 'certificate': 3, 'some': 2, 'none': 0 };
    educationScore += eduLevels[educationAnalysis.educationLevel] || 0;
    if (educationAnalysis.hasRelevantField) educationScore += 2;
    if (educationAnalysis.certificationCount > 0) educationScore += Math.min(3, educationAnalysis.certificationCount);
    educationScore = Math.min(10, educationScore);
    
    const overall = skillsScore + experienceScore + toolsScore + educationScore;
    
    // Calculate confidence based on analysis quality
    let confidence = 0.6; // Base confidence for rule-based analysis
    if (formatAnalysis.atsCompatibility > 0.7) confidence += 0.1;
    if (industryAnalysis.industryAlignment > 0.5) confidence += 0.1;
    if (skillsAnalysis.skillRelevance > 0.3) confidence += 0.1;
    if (experienceAnalysis.experienceQuality > 3) confidence += 0.1;
    if (atsAnalysis.overallScore > 70) confidence += 0.1;
    
    return {
      overall: Math.max(20, Math.min(95, Math.round(overall))),
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      tools: Math.round(toolsScore),
      education: Math.round(educationScore),
      confidence: Math.min(0.9, confidence)
    };
  }

  /**
   * Generate detailed recommendations based on analysis
   */
  generateDetailedRecommendations(analysis) {
    const recommendations = [];
    const {
      skillsAnalysis,
      experienceAnalysis,
      educationAnalysis,
      formatAnalysis,
      keywordAnalysis,
      industryAnalysis,
      atsAnalysis
    } = analysis;
    
    // Skills recommendations
    if (skillsAnalysis.skillRelevance < 0.5) {
      recommendations.push(`Add ${skillsAnalysis.criticalSkillsMissing.slice(0, 3).join(', ')} to better match job requirements`);
    }
    
    if (skillsAnalysis.totalSkillsFound < 5) {
      recommendations.push('Include more technical skills relevant to your field');
    }
    
    // Experience recommendations
    if (experienceAnalysis.candidateYears < experienceAnalysis.requiredYears) {
      recommendations.push('Highlight transferable skills and relevant project experience');
    }
    
    if (experienceAnalysis.actionVerbCount < 5) {
      recommendations.push('Use more action verbs to describe your achievements (achieved, managed, led, etc.)');
    }
    
    if (experienceAnalysis.quantifierCount < 3) {
      recommendations.push('Add quantifiable metrics to demonstrate impact (percentages, dollar amounts, team sizes)');
    }
    
    // Formatting recommendations
    if (formatAnalysis.sectionCount < 3) {
      recommendations.push('Add clear section headers (Experience, Education, Skills, Summary)');
    }
    
    if (!formatAnalysis.hasBulletPoints) {
      recommendations.push('Use bullet points to improve readability and ATS parsing');
    }
    
    if (formatAnalysis.wordCount < 200) {
      recommendations.push('Expand your resume with more detailed descriptions of your experience');
    }
    
    // Keyword recommendations
    if (keywordAnalysis.keywordOptimization < 30) {
      recommendations.push('Include more keywords from the job description throughout your resume');
    }
    
    // Industry recommendations
    if (industryAnalysis.industryAlignment < 0.4) {
      recommendations.push(`Add more ${industryAnalysis.detectedIndustry}-specific terminology and experience`);
    }
    
    // Education recommendations
    if (educationAnalysis.educationLevel === 'none' && educationAnalysis.certificationCount === 0) {
      recommendations.push('Consider adding relevant certifications or educational background');
    }

    // ATS formatting recommendations
    if (atsAnalysis.overallScore < 70) {
      recommendations.push(...atsAnalysis.recommendations.slice(0, 2));
    }
    
    return recommendations.slice(0, 8); // Limit to top 8 recommendations
  }

  /**
   * Helper method to calculate experience quality
   */
  calculateExperienceQuality(actionVerbs, quantifiers, leadership) {
    let quality = 0;
    if (actionVerbs > 0) quality += Math.min(2, actionVerbs / 2);
    if (quantifiers > 0) quality += Math.min(2, quantifiers / 2);
    if (leadership > 0) quality += Math.min(1, leadership / 3);
    return Math.round(quality);
  }

  /**
   * Helper method to calculate ATS compatibility
   */
  calculateATSCompatibility(formatData) {
    let score = 0;
    if (formatData.foundSections >= 3) score += 0.3;
    if (formatData.hasBulletPoints) score += 0.2;
    if (formatData.hasHeaders) score += 0.2;
    if (formatData.wordCount >= 200 && formatData.wordCount <= 800) score += 0.2;
    if (formatData.hasEmail && formatData.hasPhone) score += 0.1;
    return Math.min(1, score);
  }

  /**
   * Helper method to extract relevant fields from job description
   */
  extractRelevantFields(jobDescription) {
    const fields = [
      'computer science', 'engineering', 'business', 'marketing', 'finance', 'accounting',
      'healthcare', 'nursing', 'medicine', 'education', 'psychology', 'communications',
      'design', 'art', 'mathematics', 'statistics', 'data science', 'information technology'
    ];
    
    return fields.filter(field => jobDescription.toLowerCase().includes(field));
  }
}

// Export singleton instance
export const contentAnalysisEngine = new ContentAnalysisEngine();
export default ContentAnalysisEngine;