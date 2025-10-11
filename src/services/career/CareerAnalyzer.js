/**
 * CareerAnalyzer - Analyzes career progression and provides skill assessments
 */

import { CAREER_LEVELS, ROLE_CLASSIFICATIONS, SKILL_CATEGORIES } from '../../data/career-paths/careerData.js';

export class CareerAnalyzer {
  constructor() {
    this.skillExtractor = new SkillExtractor();
    this.experienceAnalyzer = new ExperienceAnalyzer();
    this.marketAnalyzer = new MarketAnalyzer();
  }

  /**
   * Assess current career level based on resume content
   * @param {string} resumeText - Raw resume text
   * @returns {Promise<CareerAssessment>}
   */
  async assessCurrentLevel(resumeText) {
    try {
      const skills = await this.skillExtractor.extractSkills(resumeText);
      const experience = this.experienceAnalyzer.analyzeExperience(resumeText);
      const roleClassification = this.classifyRole(resumeText, skills);
      const marketPosition = await this.marketAnalyzer.analyzePosition(roleClassification, skills, experience);

      return {
        currentRole: roleClassification.primaryRole,
        experienceLevel: this.determineExperienceLevel(experience),
        skills: skills,
        strengths: this.identifyStrengths(skills, experience),
        marketPosition: marketPosition,
        confidence: this.calculateConfidence(skills, experience, roleClassification)
      };
    } catch (error) {
      console.error('Error in career assessment:', error);
      throw new Error('Failed to assess career level');
    }
  }

  /**
   * Classify role based on resume content and skills
   * @param {string} resumeText - Raw resume text
   * @param {Array} skills - Extracted skills
   * @returns {Object} Role classification
   */
  classifyRole(resumeText, skills) {
    const roleKeywords = this.extractRoleKeywords(resumeText);
    const skillCategories = this.categorizeSkills(skills);
    
    // Score each role category based on keywords and skills
    const roleScores = {};
    
    Object.keys(ROLE_CLASSIFICATIONS).forEach(category => {
      const classification = ROLE_CLASSIFICATIONS[category];
      let score = 0;
      
      // Score based on title keywords
      classification.titleKeywords.forEach(keyword => {
        if (roleKeywords.titles.some(title => 
          title.toLowerCase().includes(keyword.toLowerCase())
        )) {
          score += 3;
        }
      });
      
      // Score based on skill alignment
      classification.requiredSkills.forEach(skill => {
        if (skills.some(userSkill => 
          userSkill.name.toLowerCase().includes(skill.toLowerCase())
        )) {
          score += 2;
        }
      });
      
      // Score based on responsibility keywords
      classification.responsibilities.forEach(responsibility => {
        if (resumeText.toLowerCase().includes(responsibility.toLowerCase())) {
          score += 1;
        }
      });
      
      roleScores[category] = score;
    });
    
    // Find the highest scoring role
    const primaryRole = Object.keys(roleScores).reduce((a, b) => 
      roleScores[a] > roleScores[b] ? a : b
    );
    
    return {
      primaryRole,
      confidence: roleScores[primaryRole] / 10, // Normalize to 0-1
      alternativeRoles: Object.keys(roleScores)
        .filter(role => role !== primaryRole)
        .sort((a, b) => roleScores[b] - roleScores[a])
        .slice(0, 2)
    };
  }

  /**
   * Determine experience level based on career history
   * @param {Object} experience - Experience analysis
   * @returns {string} Experience level
   */
  determineExperienceLevel(experience) {
    const totalYears = experience.totalYears;
    const leadershipIndicators = experience.leadershipIndicators;
    const seniorityKeywords = experience.seniorityKeywords;
    
    if (totalYears >= 10 && (leadershipIndicators >= 3 || seniorityKeywords.includes('executive'))) {
      return 'executive';
    } else if (totalYears >= 7 && (leadershipIndicators >= 2 || seniorityKeywords.includes('lead'))) {
      return 'lead';
    } else if (totalYears >= 4 && (leadershipIndicators >= 1 || seniorityKeywords.includes('senior'))) {
      return 'senior';
    } else if (totalYears >= 2) {
      return 'mid';
    } else {
      return 'entry';
    }
  }

  /**
   * Identify key strengths based on skills and experience
   * @param {Array} skills - User skills
   * @param {Object} experience - Experience analysis
   * @returns {Array} List of strengths
   */
  identifyStrengths(skills, experience) {
    const strengths = [];
    
    // Technical strengths
    const technicalSkills = skills.filter(skill => skill.category === 'technical');
    if (technicalSkills.length >= 5) {
      strengths.push('Strong Technical Foundation');
    }
    
    // Leadership strengths
    if (experience.leadershipIndicators >= 2) {
      strengths.push('Leadership Experience');
    }
    
    // Domain expertise
    const domainSkills = skills.filter(skill => skill.proficiency >= 4);
    if (domainSkills.length >= 3) {
      strengths.push('Domain Expertise');
    }
    
    // Communication skills
    const communicationKeywords = ['presentation', 'communication', 'training', 'mentoring'];
    if (communicationKeywords.some(keyword => 
      experience.responsibilities.some(resp => resp.includes(keyword))
    )) {
      strengths.push('Communication Skills');
    }
    
    // Problem-solving
    const problemSolvingKeywords = ['optimization', 'improvement', 'solution', 'innovation'];
    if (problemSolvingKeywords.some(keyword => 
      experience.achievements.some(achievement => achievement.includes(keyword))
    )) {
      strengths.push('Problem Solving');
    }
    
    return strengths.slice(0, 5); // Return top 5 strengths
  }

  /**
   * Extract role-related keywords from resume
   * @param {string} resumeText - Raw resume text
   * @returns {Object} Extracted keywords
   */
  extractRoleKeywords(resumeText) {
    const lines = resumeText.split('\n');
    const titles = [];
    const responsibilities = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Extract job titles (usually standalone lines or after company names)
      if (this.isLikelyJobTitle(trimmedLine)) {
        titles.push(trimmedLine);
      }
      
      // Extract responsibility bullets
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        responsibilities.push(trimmedLine.substring(1).trim());
      }
    });
    
    return { titles, responsibilities };
  }

  /**
   * Check if a line is likely a job title
   * @param {string} line - Text line
   * @returns {boolean}
   */
  isLikelyJobTitle(line) {
    const titleKeywords = [
      'engineer', 'developer', 'manager', 'analyst', 'specialist', 'coordinator',
      'director', 'lead', 'senior', 'junior', 'associate', 'consultant',
      'architect', 'designer', 'scientist', 'researcher', 'administrator'
    ];
    
    return titleKeywords.some(keyword => 
      line.toLowerCase().includes(keyword)
    ) && line.length < 100; // Reasonable title length
  }

  /**
   * Categorize skills into different categories
   * @param {Array} skills - User skills
   * @returns {Object} Categorized skills
   */
  categorizeSkills(skills) {
    const categories = {
      technical: [],
      soft: [],
      domain: [],
      tools: []
    };
    
    skills.forEach(skill => {
      if (skill.category) {
        categories[skill.category] = categories[skill.category] || [];
        categories[skill.category].push(skill);
      }
    });
    
    return categories;
  }

  /**
   * Calculate confidence score for the assessment
   * @param {Array} skills - Extracted skills
   * @param {Object} experience - Experience analysis
   * @param {Object} roleClassification - Role classification
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(skills, experience, roleClassification) {
    let confidence = 0;
    
    // Skills confidence (0.4 weight)
    if (skills.length >= 10) confidence += 0.4;
    else confidence += (skills.length / 10) * 0.4;
    
    // Experience confidence (0.3 weight)
    if (experience.totalYears >= 1) confidence += 0.3;
    else confidence += experience.totalYears * 0.3;
    
    // Role classification confidence (0.3 weight)
    confidence += roleClassification.confidence * 0.3;
    
    return Math.min(confidence, 1);
  }
}

/**
 * SkillExtractor - Extracts and categorizes skills from resume text
 */
class SkillExtractor {
  constructor() {
    this.skillDatabase = SKILL_CATEGORIES;
  }

  /**
   * Extract skills from resume text
   * @param {string} resumeText - Raw resume text
   * @returns {Promise<Array>} Extracted skills with proficiency estimates
   */
  async extractSkills(resumeText) {
    const extractedSkills = [];
    const text = resumeText.toLowerCase();
    
    // Extract skills from each category
    Object.keys(this.skillDatabase).forEach(category => {
      const categorySkills = this.skillDatabase[category];
      
      categorySkills.forEach(skillData => {
        const skill = skillData.name || skillData;
        const aliases = skillData.aliases || [skill];
        
        // Check if skill is mentioned in resume
        const isPresent = aliases.some(alias => 
          text.includes(alias.toLowerCase())
        );
        
        if (isPresent) {
          const proficiency = this.estimateProficiency(skill, resumeText);
          extractedSkills.push({
            name: skill,
            category: category,
            proficiency: proficiency,
            yearsExperience: this.estimateYearsExperience(skill, resumeText)
          });
        }
      });
    });
    
    return extractedSkills;
  }

  /**
   * Estimate skill proficiency based on context
   * @param {string} skill - Skill name
   * @param {string} resumeText - Resume text
   * @returns {number} Proficiency score (1-5)
   */
  estimateProficiency(skill, resumeText) {
    const text = resumeText.toLowerCase();
    const skillLower = skill.toLowerCase();
    
    let proficiency = 1; // Base proficiency
    
    // Check for proficiency indicators
    const expertKeywords = ['expert', 'advanced', 'lead', 'architect', 'senior'];
    const intermediateKeywords = ['experienced', 'proficient', 'skilled'];
    const beginnerKeywords = ['basic', 'beginner', 'learning', 'familiar'];
    
    if (expertKeywords.some(keyword => 
      text.includes(`${keyword} ${skillLower}`) || 
      text.includes(`${skillLower} ${keyword}`)
    )) {
      proficiency = 5;
    } else if (intermediateKeywords.some(keyword => 
      text.includes(`${keyword} ${skillLower}`) || 
      text.includes(`${skillLower} ${keyword}`)
    )) {
      proficiency = 4;
    } else if (beginnerKeywords.some(keyword => 
      text.includes(`${keyword} ${skillLower}`) || 
      text.includes(`${skillLower} ${keyword}`)
    )) {
      proficiency = 2;
    } else {
      // Default to intermediate if no indicators
      proficiency = 3;
    }
    
    return proficiency;
  }

  /**
   * Estimate years of experience with a skill
   * @param {string} skill - Skill name
   * @param {string} resumeText - Resume text
   * @returns {number} Estimated years
   */
  estimateYearsExperience(skill, resumeText) {
    const yearPattern = /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience\s*)?(?:with\s*)?/gi;
    const matches = resumeText.match(yearPattern);
    
    if (matches) {
      // Find the highest year mentioned near the skill
      const years = matches.map(match => {
        const num = parseInt(match.match(/\d+/)[0]);
        return num;
      });
      
      return Math.max(...years, 1);
    }
    
    return 1; // Default to 1 year if no specific mention
  }
}

/**
 * ExperienceAnalyzer - Analyzes work experience and career progression
 */
class ExperienceAnalyzer {
  /**
   * Analyze work experience from resume
   * @param {string} resumeText - Raw resume text
   * @returns {Object} Experience analysis
   */
  analyzeExperience(resumeText) {
    const experience = {
      totalYears: this.calculateTotalYears(resumeText),
      leadershipIndicators: this.countLeadershipIndicators(resumeText),
      seniorityKeywords: this.extractSeniorityKeywords(resumeText),
      responsibilities: this.extractResponsibilities(resumeText),
      achievements: this.extractAchievements(resumeText),
      companies: this.extractCompanies(resumeText)
    };
    
    return experience;
  }

  /**
   * Calculate total years of experience
   * @param {string} resumeText - Resume text
   * @returns {number} Total years
   */
  calculateTotalYears(resumeText) {
    const datePattern = /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/gi;
    const matches = resumeText.match(datePattern);
    
    if (!matches) return 0;
    
    let totalYears = 0;
    const currentYear = new Date().getFullYear();
    
    matches.forEach(match => {
      const [start, end] = match.split(/[-–—]/).map(s => s.trim());
      const startYear = parseInt(start);
      const endYear = end.toLowerCase().includes('present') || end.toLowerCase().includes('current') 
        ? currentYear 
        : parseInt(end);
      
      if (startYear && endYear && endYear >= startYear) {
        totalYears += (endYear - startYear);
      }
    });
    
    return totalYears;
  }

  /**
   * Count leadership indicators in resume
   * @param {string} resumeText - Resume text
   * @returns {number} Leadership indicator count
   */
  countLeadershipIndicators(resumeText) {
    const leadershipKeywords = [
      'led', 'managed', 'supervised', 'directed', 'coordinated',
      'mentored', 'trained', 'guided', 'oversaw', 'headed'
    ];
    
    const text = resumeText.toLowerCase();
    return leadershipKeywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  /**
   * Extract seniority keywords
   * @param {string} resumeText - Resume text
   * @returns {Array} Seniority keywords found
   */
  extractSeniorityKeywords(resumeText) {
    const seniorityKeywords = [
      'senior', 'lead', 'principal', 'staff', 'director', 
      'manager', 'head', 'chief', 'executive', 'vice president'
    ];
    
    const text = resumeText.toLowerCase();
    return seniorityKeywords.filter(keyword => 
      text.includes(keyword)
    );
  }

  /**
   * Extract responsibility statements
   * @param {string} resumeText - Resume text
   * @returns {Array} Responsibility statements
   */
  extractResponsibilities(resumeText) {
    const lines = resumeText.split('\n');
    const responsibilities = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if ((trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) 
          && trimmed.length > 20) {
        responsibilities.push(trimmed.substring(1).trim());
      }
    });
    
    return responsibilities;
  }

  /**
   * Extract achievement statements
   * @param {string} resumeText - Resume text
   * @returns {Array} Achievement statements
   */
  extractAchievements(resumeText) {
    const achievementKeywords = [
      'achieved', 'improved', 'increased', 'reduced', 'optimized',
      'delivered', 'implemented', 'launched', 'created', 'developed'
    ];
    
    const responsibilities = this.extractResponsibilities(resumeText);
    return responsibilities.filter(resp => 
      achievementKeywords.some(keyword => 
        resp.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * Extract company names
   * @param {string} resumeText - Resume text
   * @returns {Array} Company names
   */
  extractCompanies(resumeText) {
    // This is a simplified extraction - in practice, you'd use more sophisticated NLP
    const lines = resumeText.split('\n');
    const companies = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      // Look for lines that might be company names (heuristic approach)
      if (trimmed.length > 3 && trimmed.length < 50 && 
          !trimmed.includes('•') && !trimmed.includes('-') &&
          /^[A-Z]/.test(trimmed)) {
        companies.push(trimmed);
      }
    });
    
    return companies.slice(0, 10); // Limit to reasonable number
  }
}

/**
 * MarketAnalyzer - Analyzes market position and provides insights
 */
class MarketAnalyzer {
  /**
   * Analyze market position for a role and skill set
   * @param {Object} roleClassification - Role classification
   * @param {Array} skills - User skills
   * @param {Object} experience - Experience analysis
   * @returns {Promise<Object>} Market position analysis
   */
  async analyzePosition(roleClassification, skills, experience) {
    // This would typically integrate with market data APIs
    // For now, we'll use static analysis based on role and skills
    
    const marketPosition = {
      competitiveness: this.calculateCompetitiveness(skills, experience),
      salaryRange: this.estimateSalaryRange(roleClassification.primaryRole, experience.totalYears),
      demandLevel: this.assessDemandLevel(roleClassification.primaryRole, skills),
      recommendations: this.generateMarketRecommendations(roleClassification, skills, experience)
    };
    
    return marketPosition;
  }

  /**
   * Calculate market competitiveness score
   * @param {Array} skills - User skills
   * @param {Object} experience - Experience data
   * @returns {number} Competitiveness score (0-1)
   */
  calculateCompetitiveness(skills, experience) {
    let score = 0;
    
    // Skills diversity (0.4 weight)
    const skillCount = skills.length;
    score += Math.min(skillCount / 15, 1) * 0.4;
    
    // Experience level (0.3 weight)
    score += Math.min(experience.totalYears / 10, 1) * 0.3;
    
    // Leadership indicators (0.3 weight)
    score += Math.min(experience.leadershipIndicators / 5, 1) * 0.3;
    
    return score;
  }

  /**
   * Estimate salary range based on role and experience
   * @param {string} role - Primary role
   * @param {number} years - Years of experience
   * @returns {Object} Salary range
   */
  estimateSalaryRange(role, years) {
    // Simplified salary estimation - would use real market data in production
    const baseSalaries = {
      'software-engineer': 70000,
      'data-scientist': 80000,
      'product-manager': 85000,
      'designer': 65000,
      'marketing-manager': 60000,
      'financial-analyst': 65000
    };
    
    const base = baseSalaries[role] || 60000;
    const experienceMultiplier = 1 + (years * 0.1);
    
    return {
      min: Math.round(base * experienceMultiplier * 0.8),
      max: Math.round(base * experienceMultiplier * 1.3),
      median: Math.round(base * experienceMultiplier)
    };
  }

  /**
   * Assess demand level for role and skills
   * @param {string} role - Primary role
   * @param {Array} skills - User skills
   * @returns {string} Demand level
   */
  assessDemandLevel(role, skills) {
    // Simplified demand assessment
    const highDemandRoles = ['software-engineer', 'data-scientist', 'cybersecurity-specialist'];
    const highDemandSkills = ['python', 'javascript', 'react', 'aws', 'machine learning'];
    
    const hasHighDemandRole = highDemandRoles.includes(role);
    const highDemandSkillCount = skills.filter(skill => 
      highDemandSkills.some(demandSkill => 
        skill.name.toLowerCase().includes(demandSkill)
      )
    ).length;
    
    if (hasHighDemandRole && highDemandSkillCount >= 3) {
      return 'high';
    } else if (hasHighDemandRole || highDemandSkillCount >= 2) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Generate market-based recommendations
   * @param {Object} roleClassification - Role classification
   * @param {Array} skills - User skills
   * @param {Object} experience - Experience data
   * @returns {Array} Recommendations
   */
  generateMarketRecommendations(roleClassification, skills, experience) {
    const recommendations = [];
    
    // Skill recommendations
    if (skills.length < 10) {
      recommendations.push({
        type: 'skill-development',
        priority: 'high',
        message: 'Expand your skill set to increase market competitiveness'
      });
    }
    
    // Leadership recommendations
    if (experience.totalYears >= 3 && experience.leadershipIndicators < 2) {
      recommendations.push({
        type: 'leadership',
        priority: 'medium',
        message: 'Consider taking on leadership responsibilities to advance your career'
      });
    }
    
    // Specialization recommendations
    if (roleClassification.confidence < 0.7) {
      recommendations.push({
        type: 'specialization',
        priority: 'medium',
        message: 'Focus on developing expertise in a specific domain'
      });
    }
    
    return recommendations;
  }
}

export default CareerAnalyzer;