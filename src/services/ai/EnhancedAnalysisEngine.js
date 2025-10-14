/**
 * Enhanced Analysis Engine
 * Advanced resume analysis with industry-specific insights and job matching
 */

import { aiServiceManager } from './AIServiceManager.js';
import { contentAnalysisEngine } from './ContentAnalysisEngine.js';

export class EnhancedAnalysisEngine {
  constructor() {
    this.industryProfiles = this.initializeIndustryProfiles();
    this.skillsDatabase = this.initializeSkillsDatabase();
    this.atsOptimizationRules = this.initializeATSRules();
  }

  /**
   * Perform comprehensive resume analysis with industry context
   */
  async analyzeResumeComprehensive(resumeText, jobDescription, options = {}) {
    const {
      includeIndustryAnalysis = true,
      includeSkillGapAnalysis = true,
      includeATSOptimization = true,
      includeCareerProgression = true,
      targetIndustry = null
    } = options;

    try {
      // Step 1: Basic AI analysis
      const baseAnalysis = await aiServiceManager.analyzeResume(resumeText, jobDescription);

      // Step 2: Industry-specific analysis
      let industryAnalysis = null;
      if (includeIndustryAnalysis) {
        const detectedIndustry = targetIndustry || this.detectIndustry(jobDescription);
        industryAnalysis = await this.performIndustryAnalysis(
          resumeText, 
          jobDescription, 
          detectedIndustry
        );
      }

      // Step 3: Advanced skill gap analysis
      let skillGapAnalysis = null;
      if (includeSkillGapAnalysis) {
        skillGapAnalysis = this.performSkillGapAnalysis(resumeText, jobDescription);
      }

      // Step 4: ATS optimization analysis
      let atsOptimization = null;
      if (includeATSOptimization) {
        atsOptimization = this.performATSOptimization(resumeText, jobDescription);
      }

      // Step 5: Career progression analysis
      let careerProgression = null;
      if (includeCareerProgression) {
        careerProgression = this.analyzeCareerProgression(resumeText, jobDescription);
      }

      // Combine all analyses
      const enhancedAnalysis = this.combineAnalyses({
        baseAnalysis,
        industryAnalysis,
        skillGapAnalysis,
        atsOptimization,
        careerProgression
      });

      return enhancedAnalysis;

    } catch (error) {
      console.error('Enhanced analysis failed:', error);
      // Fallback to basic analysis
      return await aiServiceManager.analyzeResume(resumeText, jobDescription);
    }
  }

  /**
   * Detect industry from job description
   */
  detectIndustry(jobDescription) {
    const jd = jobDescription.toLowerCase();
    
    const industryKeywords = {
      technology: ['software', 'developer', 'engineer', 'programming', 'tech', 'ai', 'machine learning', 'data science'],
      healthcare: ['medical', 'healthcare', 'nurse', 'doctor', 'clinical', 'patient', 'hospital'],
      finance: ['financial', 'banking', 'investment', 'accounting', 'finance', 'analyst', 'trading'],
      marketing: ['marketing', 'advertising', 'brand', 'campaign', 'digital marketing', 'seo', 'content'],
      education: ['teacher', 'education', 'academic', 'university', 'school', 'curriculum', 'instruction'],
      consulting: ['consultant', 'consulting', 'advisory', 'strategy', 'management consulting'],
      retail: ['retail', 'sales', 'customer service', 'merchandising', 'store', 'commerce'],
      manufacturing: ['manufacturing', 'production', 'operations', 'supply chain', 'quality control']
    };

    let maxScore = 0;
    let detectedIndustry = 'general';

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const score = keywords.filter(keyword => jd.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedIndustry = industry;
      }
    }

    return detectedIndustry;
  }

  /**
   * Perform industry-specific analysis
   */
  async performIndustryAnalysis(resumeText, jobDescription, industry) {
    const industryProfile = this.industryProfiles[industry];
    if (!industryProfile) {
      return { industry, analysis: 'Industry profile not available' };
    }

    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();

    // Check for industry-specific skills
    const industrySkills = industryProfile.keySkills.filter(skill => 
      resume.includes(skill.toLowerCase())
    );

    // Check for industry-specific experience
    const industryExperience = industryProfile.experienceIndicators.filter(indicator =>
      resume.includes(indicator.toLowerCase())
    );

    // Check for industry-specific certifications
    const industryCertifications = industryProfile.certifications.filter(cert =>
      resume.includes(cert.toLowerCase())
    );

    // Calculate industry fit score
    const skillsScore = (industrySkills.length / industryProfile.keySkills.length) * 40;
    const experienceScore = Math.min(industryExperience.length * 10, 30);
    const certificationScore = Math.min(industryCertifications.length * 15, 30);
    
    const industryFitScore = Math.round(skillsScore + experienceScore + certificationScore);

    return {
      industry,
      fitScore: industryFitScore,
      matchedSkills: industrySkills,
      matchedExperience: industryExperience,
      matchedCertifications: industryCertifications,
      recommendations: this.generateIndustryRecommendations(
        industry, 
        industrySkills, 
        industryProfile.keySkills
      ),
      careerPaths: industryProfile.careerPaths,
      salaryRange: industryProfile.salaryRange
    };
  }

  /**
   * Perform advanced skill gap analysis
   */
  performSkillGapAnalysis(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();

    // Extract skills from both resume and job description
    const resumeSkills = this.extractSkillsAdvanced(resume);
    const requiredSkills = this.extractSkillsAdvanced(jd);

    // Categorize skills
    const skillCategories = {
      technical: [],
      soft: [],
      industry: [],
      tools: [],
      certifications: []
    };

    // Analyze skill gaps
    const skillGaps = {
      critical: [], // Must-have skills missing
      important: [], // Nice-to-have skills missing
      emerging: [], // Future-relevant skills missing
      transferable: [] // Skills that can be leveraged
    };

    // Categorize required skills
    requiredSkills.forEach(skill => {
      const category = this.categorizeSkill(skill);
      const priority = this.getSkillPriority(skill, jd);
      
      if (!resumeSkills.includes(skill)) {
        if (priority === 'critical') {
          skillGaps.critical.push(skill);
        } else if (priority === 'important') {
          skillGaps.important.push(skill);
        } else {
          skillGaps.emerging.push(skill);
        }
      }
    });

    // Find transferable skills
    resumeSkills.forEach(skill => {
      if (!requiredSkills.includes(skill)) {
        const transferability = this.assessSkillTransferability(skill, requiredSkills);
        if (transferability > 0.7) {
          skillGaps.transferable.push({
            skill,
            transferability,
            relatedSkills: this.findRelatedSkills(skill, requiredSkills)
          });
        }
      }
    });

    return {
      resumeSkills,
      requiredSkills,
      skillGaps,
      skillCategories,
      recommendations: this.generateSkillGapRecommendations(skillGaps),
      learningPath: this.generateLearningPath(skillGaps.critical, skillGaps.important)
    };
  }

  /**
   * Perform ATS optimization analysis
   */
  performATSOptimization(resumeText, jobDescription) {
    const optimization = {
      score: 0,
      issues: [],
      recommendations: [],
      keywords: {
        missing: [],
        present: [],
        density: 0
      },
      formatting: {
        score: 0,
        issues: []
      }
    };

    // Keyword analysis
    const keywordAnalysis = this.analyzeKeywords(resumeText, jobDescription);
    optimization.keywords = keywordAnalysis;
    optimization.score += keywordAnalysis.score * 0.4;

    // Formatting analysis
    const formatAnalysis = this.analyzeFormatting(resumeText);
    optimization.formatting = formatAnalysis;
    optimization.score += formatAnalysis.score * 0.3;

    // Section analysis
    const sectionAnalysis = this.analyzeSections(resumeText);
    optimization.score += sectionAnalysis.score * 0.3;

    // Generate recommendations
    optimization.recommendations = this.generateATSRecommendations(
      keywordAnalysis,
      formatAnalysis,
      sectionAnalysis
    );

    return optimization;
  }

  /**
   * Analyze career progression potential
   */
  analyzeCareerProgression(resumeText, jobDescription) {
    const currentLevel = this.assessCareerLevel(resumeText);
    const targetLevel = this.assessJobLevel(jobDescription);
    
    const progression = {
      currentLevel,
      targetLevel,
      gap: targetLevel - currentLevel,
      feasibility: this.assessProgressionFeasibility(resumeText, jobDescription),
      timeline: this.estimateProgressionTimeline(currentLevel, targetLevel),
      requirements: this.getProgressionRequirements(currentLevel, targetLevel),
      recommendations: []
    };

    progression.recommendations = this.generateProgressionRecommendations(progression);

    return progression;
  }

  /**
   * Combine all analyses into comprehensive result
   */
  combineAnalyses(analyses) {
    const { 
      baseAnalysis, 
      industryAnalysis, 
      skillGapAnalysis, 
      atsOptimization, 
      careerProgression 
    } = analyses;

    // Calculate enhanced overall score
    let enhancedScore = baseAnalysis.overall_score;
    
    if (industryAnalysis) {
      // Boost score based on industry fit
      const industryBonus = Math.min(10, industryAnalysis.fitScore * 0.1);
      enhancedScore += industryBonus;
    }

    if (atsOptimization) {
      // Adjust score based on ATS optimization
      const atsBonus = Math.min(5, (atsOptimization.score - 70) * 0.1);
      enhancedScore += atsBonus;
    }

    // Cap the score at 100
    enhancedScore = Math.min(100, Math.round(enhancedScore));

    // Combine recommendations
    const allRecommendations = [
      ...baseAnalysis.recommendations,
      ...(industryAnalysis?.recommendations || []),
      ...(skillGapAnalysis?.recommendations || []),
      ...(atsOptimization?.recommendations || []),
      ...(careerProgression?.recommendations || [])
    ];

    // Remove duplicates and prioritize
    const uniqueRecommendations = [...new Set(allRecommendations)].slice(0, 10);

    return {
      ...baseAnalysis,
      overall_score: enhancedScore,
      confidence: Math.min(0.95, baseAnalysis.confidence + 0.1),
      recommendations: uniqueRecommendations,
      enhancedAnalysis: {
        industryAnalysis,
        skillGapAnalysis,
        atsOptimization,
        careerProgression
      },
      analysisType: 'comprehensive',
      analysisTimestamp: new Date().toISOString()
    };
  }

  /**
   * Initialize industry profiles
   */
  initializeIndustryProfiles() {
    return {
      technology: {
        keySkills: [
          'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
          'TypeScript', 'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'Kubernetes', 'Jenkins'
        ],
        experienceIndicators: [
          'software development', 'web development', 'mobile development', 'devops',
          'system architecture', 'database design', 'api development', 'cloud computing'
        ],
        certifications: [
          'AWS Certified', 'Google Cloud', 'Microsoft Azure', 'Certified Kubernetes',
          'Oracle Certified', 'Cisco Certified', 'CompTIA', 'Scrum Master'
        ],
        careerPaths: [
          'Senior Developer', 'Tech Lead', 'Software Architect', 'Engineering Manager',
          'DevOps Engineer', 'Data Engineer', 'Product Manager'
        ],
        salaryRange: { min: 70000, max: 200000, currency: 'USD' }
      },
      healthcare: {
        keySkills: [
          'Patient Care', 'Medical Records', 'HIPAA', 'Clinical Assessment', 'Healthcare Management',
          'Electronic Health Records', 'Medical Terminology', 'Quality Assurance'
        ],
        experienceIndicators: [
          'patient care', 'clinical experience', 'healthcare administration', 'medical practice',
          'hospital operations', 'healthcare compliance', 'medical research'
        ],
        certifications: [
          'RN', 'MD', 'CNA', 'LPN', 'RHIA', 'CCS', 'CPHIMS', 'PMP Healthcare'
        ],
        careerPaths: [
          'Senior Nurse', 'Nurse Manager', 'Healthcare Administrator', 'Clinical Director',
          'Medical Director', 'Healthcare Consultant'
        ],
        salaryRange: { min: 50000, max: 150000, currency: 'USD' }
      },
      finance: {
        keySkills: [
          'Financial Analysis', 'Risk Management', 'Investment Analysis', 'Financial Modeling',
          'Excel', 'Bloomberg', 'SQL', 'Python', 'R', 'Tableau', 'PowerBI'
        ],
        experienceIndicators: [
          'financial analysis', 'investment banking', 'portfolio management', 'risk assessment',
          'financial planning', 'accounting', 'auditing', 'compliance'
        ],
        certifications: [
          'CFA', 'CPA', 'FRM', 'PMP', 'Six Sigma', 'Series 7', 'Series 63', 'CAIA'
        ],
        careerPaths: [
          'Senior Analyst', 'Portfolio Manager', 'Investment Director', 'CFO',
          'Risk Manager', 'Financial Consultant', 'Investment Banker'
        ],
        salaryRange: { min: 60000, max: 250000, currency: 'USD' }
      }
      // Add more industries as needed
    };
  }

  /**
   * Initialize comprehensive skills database
   */
  initializeSkillsDatabase() {
    return {
      technical: {
        programming: ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust'],
        frameworks: ['React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring'],
        databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'SQLite'],
        cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
        tools: ['Git', 'JIRA', 'Confluence', 'Slack', 'Figma', 'Adobe Creative Suite']
      },
      soft: {
        leadership: ['Team Leadership', 'Project Management', 'Strategic Planning', 'Decision Making'],
        communication: ['Public Speaking', 'Technical Writing', 'Presentation Skills', 'Cross-functional Collaboration'],
        analytical: ['Problem Solving', 'Critical Thinking', 'Data Analysis', 'Research Skills'],
        interpersonal: ['Teamwork', 'Mentoring', 'Conflict Resolution', 'Customer Relations']
      },
      industry: {
        healthcare: ['Patient Care', 'Medical Records', 'HIPAA Compliance', 'Clinical Assessment'],
        finance: ['Financial Analysis', 'Risk Management', 'Investment Analysis', 'Regulatory Compliance'],
        marketing: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Brand Management'],
        education: ['Curriculum Development', 'Instructional Design', 'Student Assessment', 'Educational Technology']
      }
    };
  }

  /**
   * Initialize ATS optimization rules
   */
  initializeATSRules() {
    return {
      keywords: {
        density: { min: 0.02, max: 0.05 }, // 2-5% keyword density
        placement: ['summary', 'experience', 'skills'],
        variations: true // Use keyword variations
      },
      formatting: {
        sections: ['contact', 'summary', 'experience', 'education', 'skills'],
        bulletPoints: true,
        consistentDates: true,
        standardFonts: ['Arial', 'Calibri', 'Times New Roman', 'Helvetica'],
        fileFormats: ['PDF', 'DOCX']
      },
      content: {
        quantifiableAchievements: true,
        actionVerbs: true,
        industryTerminology: true,
        relevantExperience: true
      }
    };
  }

  // Helper methods for analysis
  extractSkillsAdvanced(text) {
    // Implementation for advanced skill extraction
    const skills = [];
    const skillPatterns = Object.values(this.skillsDatabase).flat();
    
    skillPatterns.forEach(category => {
      if (Array.isArray(category)) {
        category.forEach(skill => {
          if (text.includes(skill.toLowerCase())) {
            skills.push(skill);
          }
        });
      }
    });

    return [...new Set(skills)];
  }

  categorizeSkill(skill) {
    // Implementation for skill categorization
    for (const [category, subcategories] of Object.entries(this.skillsDatabase)) {
      for (const subcategory of Object.values(subcategories)) {
        if (Array.isArray(subcategory) && subcategory.includes(skill)) {
          return category;
        }
      }
    }
    return 'general';
  }

  getSkillPriority(skill, jobDescription) {
    const jd = jobDescription.toLowerCase();
    const skillLower = skill.toLowerCase();
    
    // Check for priority indicators
    if (jd.includes(`required ${skillLower}`) || jd.includes(`must have ${skillLower}`)) {
      return 'critical';
    }
    if (jd.includes(`preferred ${skillLower}`) || jd.includes(`nice to have ${skillLower}`)) {
      return 'important';
    }
    return 'emerging';
  }

  assessSkillTransferability(skill, requiredSkills) {
    // Simple transferability assessment
    const relatedCount = this.findRelatedSkills(skill, requiredSkills).length;
    return Math.min(1, relatedCount / 3);
  }

  findRelatedSkills(skill, skillsList) {
    // Find skills related to the given skill
    return skillsList.filter(s => 
      s.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(s.toLowerCase())
    );
  }

  generateIndustryRecommendations(industry, matchedSkills, allSkills) {
    const missingSkills = allSkills.filter(skill => !matchedSkills.includes(skill));
    const recommendations = [];

    if (missingSkills.length > 0) {
      recommendations.push(
        `Develop ${industry} industry skills: ${missingSkills.slice(0, 3).join(', ')}`
      );
    }

    recommendations.push(
      `Consider pursuing ${industry}-specific certifications to strengthen your profile`
    );

    return recommendations;
  }

  generateSkillGapRecommendations(skillGaps) {
    const recommendations = [];

    if (skillGaps.critical.length > 0) {
      recommendations.push(
        `Priority: Learn critical skills - ${skillGaps.critical.slice(0, 3).join(', ')}`
      );
    }

    if (skillGaps.important.length > 0) {
      recommendations.push(
        `Consider developing: ${skillGaps.important.slice(0, 3).join(', ')}`
      );
    }

    if (skillGaps.transferable.length > 0) {
      recommendations.push(
        `Highlight transferable skills: ${skillGaps.transferable.slice(0, 2).map(t => t.skill).join(', ')}`
      );
    }

    return recommendations;
  }

  generateLearningPath(criticalSkills, importantSkills) {
    const path = [];

    // Phase 1: Critical skills (0-3 months)
    if (criticalSkills.length > 0) {
      path.push({
        phase: 1,
        duration: '0-3 months',
        focus: 'Critical Skills',
        skills: criticalSkills.slice(0, 3),
        priority: 'high'
      });
    }

    // Phase 2: Important skills (3-6 months)
    if (importantSkills.length > 0) {
      path.push({
        phase: 2,
        duration: '3-6 months',
        focus: 'Important Skills',
        skills: importantSkills.slice(0, 3),
        priority: 'medium'
      });
    }

    return path;
  }

  analyzeKeywords(resumeText, jobDescription) {
    // Implementation for keyword analysis
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    const jdWords = jd.split(/\s+/).filter(word => word.length > 3);
    const uniqueJdWords = [...new Set(jdWords)];
    
    const presentKeywords = uniqueJdWords.filter(word => resume.includes(word));
    const missingKeywords = uniqueJdWords.filter(word => !resume.includes(word));
    
    const density = presentKeywords.length / resumeText.split(/\s+/).length;
    const score = Math.min(100, (presentKeywords.length / uniqueJdWords.length) * 100);

    return {
      present: presentKeywords.slice(0, 20),
      missing: missingKeywords.slice(0, 10),
      density,
      score
    };
  }

  analyzeFormatting(resumeText) {
    const issues = [];
    let score = 100;

    // Check for proper sections
    const requiredSections = ['experience', 'education', 'skills'];
    const missingSections = requiredSections.filter(section => 
      !new RegExp(section, 'i').test(resumeText)
    );

    if (missingSections.length > 0) {
      issues.push(`Missing sections: ${missingSections.join(', ')}`);
      score -= missingSections.length * 15;
    }

    // Check for bullet points
    if (!/[•\-\*]/.test(resumeText)) {
      issues.push('No bullet points found - use bullet points for better readability');
      score -= 10;
    }

    // Check for dates
    if (!/\b(19|20)\d{2}\b/.test(resumeText)) {
      issues.push('No dates found - include employment dates');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  analyzeSections(resumeText) {
    const sections = ['summary', 'experience', 'education', 'skills'];
    const foundSections = sections.filter(section => 
      new RegExp(section, 'i').test(resumeText)
    );

    const score = (foundSections.length / sections.length) * 100;
    
    return { 
      score, 
      foundSections, 
      missingSections: sections.filter(s => !foundSections.includes(s))
    };
  }

  generateATSRecommendations(keywordAnalysis, formatAnalysis, sectionAnalysis) {
    const recommendations = [];

    if (keywordAnalysis.missing.length > 0) {
      recommendations.push(
        `Include missing keywords: ${keywordAnalysis.missing.slice(0, 5).join(', ')}`
      );
    }

    if (formatAnalysis.issues.length > 0) {
      recommendations.push(...formatAnalysis.issues);
    }

    if (sectionAnalysis.missingSections.length > 0) {
      recommendations.push(
        `Add missing sections: ${sectionAnalysis.missingSections.join(', ')}`
      );
    }

    return recommendations;
  }

  assessCareerLevel(resumeText) {
    // Simple career level assessment based on keywords and experience
    const resume = resumeText.toLowerCase();
    
    if (resume.includes('senior') || resume.includes('lead') || resume.includes('principal')) {
      return 4; // Senior level
    }
    if (resume.includes('manager') || resume.includes('director')) {
      return 5; // Management level
    }
    if (resume.includes('junior') || resume.includes('entry')) {
      return 1; // Entry level
    }
    
    // Count years of experience
    const expMatch = resume.match(/(\d+)\s*years?\s*(?:of\s*)?experience/);
    if (expMatch) {
      const years = parseInt(expMatch[1]);
      if (years >= 8) return 4;
      if (years >= 5) return 3;
      if (years >= 2) return 2;
      return 1;
    }
    
    return 2; // Default to mid-level
  }

  assessJobLevel(jobDescription) {
    const jd = jobDescription.toLowerCase();
    
    if (jd.includes('senior') || jd.includes('lead') || jd.includes('principal')) {
      return 4;
    }
    if (jd.includes('manager') || jd.includes('director')) {
      return 5;
    }
    if (jd.includes('junior') || jd.includes('entry')) {
      return 1;
    }
    
    return 3; // Default to mid-level
  }

  assessProgressionFeasibility(resumeText, jobDescription) {
    // Simple feasibility assessment
    const skillMatch = this.performSkillGapAnalysis(resumeText, jobDescription);
    const skillMatchPercentage = skillMatch.resumeSkills.length / 
      (skillMatch.requiredSkills.length || 1);
    
    if (skillMatchPercentage >= 0.8) return 'high';
    if (skillMatchPercentage >= 0.6) return 'medium';
    return 'low';
  }

  estimateProgressionTimeline(currentLevel, targetLevel) {
    const gap = targetLevel - currentLevel;
    
    if (gap <= 0) return 'Ready now';
    if (gap === 1) return '6-12 months';
    if (gap === 2) return '1-2 years';
    return '2+ years';
  }

  getProgressionRequirements(currentLevel, targetLevel) {
    const gap = targetLevel - currentLevel;
    const requirements = [];

    if (gap > 0) {
      requirements.push('Develop additional technical skills');
      requirements.push('Gain more relevant experience');
    }

    if (gap > 1) {
      requirements.push('Consider leadership or management experience');
      requirements.push('Pursue relevant certifications');
    }

    if (gap > 2) {
      requirements.push('Build strategic thinking capabilities');
      requirements.push('Develop industry expertise');
    }

    return requirements;
  }

  generateProgressionRecommendations(progression) {
    const recommendations = [];

    if (progression.gap > 0) {
      recommendations.push(
        `Focus on bridging the ${progression.gap}-level gap through targeted skill development`
      );
    }

    if (progression.feasibility === 'low') {
      recommendations.push(
        'Consider intermediate roles to build required experience and skills'
      );
    }

    recommendations.push(
      `Estimated timeline for progression: ${progression.timeline}`
    );

    return recommendations;
  }
}

// Export singleton instance
export const enhancedAnalysisEngine = new EnhancedAnalysisEngine();
export default EnhancedAnalysisEngine;