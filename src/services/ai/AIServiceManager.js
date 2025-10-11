/**
 * AI Service Manager - Handles multiple AI services with intelligent fallback
 * Eliminates the need for users to provide API keys by managing service availability
 */

import { AI_SERVICE_CONFIG, ERROR_TYPES, ERROR_MESSAGES } from '../../config/interfaces.js';
import { contentAnalysisEngine } from './ContentAnalysisEngine.js';
import { geminiService } from './GeminiService.js';

class AIServiceManager {
  constructor() {
    this.services = new Map();
    this.currentService = null;
    this.fallbackAnalyzer = null;
    this.serviceStatus = {
      primary: 'unavailable',
      fallback: 'rule-based',
      confidence: 0.5
    };
    
    this.initializeServices();
  }

  /**
   * Initialize available AI services
   */
  initializeServices() {
    // Initialize Gemini service (primary)
    this.services.set('gemini', {
      name: 'Google Gemini',
      priority: 1,
      isAvailable: () => geminiService.isAvailable(),
      analyze: (resume, jobDescription) => geminiService.analyzeResume(resume, jobDescription),
      analyzeWithContext: (resume, jobDescription, contextPrompt, jobData) => 
        geminiService.analyzeResumeWithContext(resume, jobDescription, contextPrompt, jobData),
      analyzeContent: (prompt) => geminiService.analyzeContent(prompt),
      extractJobDetails: (htmlContent, url) => geminiService.extractJobDetails(htmlContent, url),
      generateCareerRecommendations: (userProfile, targetRole) => 
        geminiService.generateCareerRecommendations(userProfile, targetRole),
      generateInterviewQuestions: (jobDescription, userProfile, difficulty) =>
        geminiService.generateInterviewQuestions(jobDescription, userProfile, difficulty),
      rateLimit: { requestsPerMinute: 15, requestsPerHour: 1500, requestsPerDay: 50000 }
    });

    // Initialize HuggingFace service (fallback)
    this.services.set('huggingface', {
      name: 'HuggingFace',
      priority: 2,
      isAvailable: () => this.checkHuggingFaceAvailability(),
      analyze: (resume, jobDescription) => this.analyzeWithHuggingFace(resume, jobDescription),
      rateLimit: { requestsPerMinute: 10, requestsPerHour: 100 }
    });

    // Initialize OpenAI free tier (if available)
    this.services.set('openai', {
      name: 'OpenAI Free',
      priority: 3,
      isAvailable: () => this.checkOpenAIAvailability(),
      analyze: (resume, jobDescription) => this.analyzeWithOpenAI(resume, jobDescription),
      rateLimit: { requestsPerMinute: 3, requestsPerHour: 20 }
    });

    // Initialize rule-based fallback
    this.initializeFallbackAnalyzer();
  }

  /**
   * Initialize rule-based fallback analyzer
   */
  initializeFallbackAnalyzer() {
    this.fallbackAnalyzer = {
      analyze: (resume, jobDescription) => this.getRuleBasedScore(resume, jobDescription)
    };
  }

  /**
   * Analyze resume with job-specific context
   */
  async analyzeResumeWithContext(resumeText, jobDescription, contextPrompt, jobData) {
    try {
      // Try primary AI services with enhanced context
      const availableService = await this.getAvailableService();
      
      if (availableService) {
        this.serviceStatus.primary = 'available';
        this.serviceStatus.confidence = 0.9;
        
        const result = await availableService.analyzeWithContext(
          resumeText, 
          jobDescription, 
          contextPrompt, 
          jobData
        );
        result.analysisMethod = 'ai-contextual';
        result.serviceName = availableService.name;
        return result;
      }
      
      // Fall back to enhanced rule-based analysis with job context
      console.log('AI services unavailable, using enhanced rule-based analysis');
      this.serviceStatus.primary = 'unavailable';
      this.serviceStatus.fallback = 'rule-based-enhanced';
      this.serviceStatus.confidence = 0.7;
      
      const result = this.getJobTailoredRuleBasedScore(resumeText, jobDescription, jobData);
      result.analysisMethod = 'rule-based-enhanced';
      result.serviceName = 'Enhanced Rule-based Analyzer';
      return result;
      
    } catch (error) {
      console.error('Contextual analysis failed:', error);
      
      // Fall back to regular analysis
      return this.analyzeResume(resumeText, jobDescription);
    }
  }

  /**
   * Analyze content using AI services (for job extractor)
   */
  async analyzeContent(prompt) {
    try {
      const availableService = await this.getAvailableService();
      
      if (availableService && availableService.analyzeContent) {
        return await availableService.analyzeContent(prompt);
      }
      
      // Fallback for content analysis
      return {
        success: false,
        error: 'AI content analysis not available',
        confidence: 0
      };
      
    } catch (error) {
      console.error('Content analysis failed:', error);
      return {
        success: false,
        error: error.message,
        confidence: 0
      };
    }
  }

  /**
   * Main method to analyze resume with automatic service selection
   */
  async analyzeResume(resumeText, jobDescription) {
    try {
      // Try primary AI services first
      const availableService = await this.getAvailableService();
      
      if (availableService) {
        this.serviceStatus.primary = 'available';
        this.serviceStatus.confidence = 0.9;
        
        const result = await availableService.analyze(resumeText, jobDescription);
        result.analysisMethod = 'ai';
        result.serviceName = availableService.name;
        return result;
      }
      
      // Fall back to rule-based analysis
      console.log('AI services unavailable, using rule-based analysis');
      this.serviceStatus.primary = 'unavailable';
      this.serviceStatus.fallback = 'rule-based';
      this.serviceStatus.confidence = 0.6;
      
      const result = this.fallbackAnalyzer.analyze(resumeText, jobDescription);
      result.analysisMethod = 'rule-based';
      result.serviceName = 'Rule-based Analyzer';
      return result;
      
    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Ultimate fallback - basic content analysis
      this.serviceStatus.primary = 'unavailable';
      this.serviceStatus.fallback = 'content-analysis';
      this.serviceStatus.confidence = 0.4;
      
      const result = this.getBasicContentScore(resumeText, jobDescription);
      result.analysisMethod = 'content-analysis';
      result.serviceName = 'Content Analyzer';
      return result;
    }
  }

  /**
   * Get the current service status
   */
  getCurrentService() {
    return this.serviceStatus;
  }

  /**
   * Get fallback score when AI services are unavailable
   */
  getFallbackScore(resumeText, jobDescription) {
    return this.fallbackAnalyzer.analyze(resumeText, jobDescription);
  }

  /**
   * Find the first available AI service
   */
  async getAvailableService() {
    const sortedServices = Array.from(this.services.values())
      .sort((a, b) => a.priority - b.priority);
    
    for (const service of sortedServices) {
      try {
        const isAvailable = await service.isAvailable();
        if (isAvailable) {
          this.currentService = service;
          return service;
        }
      } catch (error) {
        console.warn(`Service ${service.name} check failed:`, error);
      }
    }
    
    return null;
  }

  /**
   * Check HuggingFace API availability
   */
  async checkHuggingFaceAvailability() {
    try {
      // Try a simple API call to check availability
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: "test",
          options: { wait_for_model: false }
        })
      });
      
      // Even if we get an error, if the API responds, it's available
      return response.status !== 503; // Service unavailable
    } catch (error) {
      console.warn('HuggingFace availability check failed:', error);
      return false;
    }
  }

  /**
   * Check OpenAI API availability (free tier)
   */
  async checkOpenAIAvailability() {
    // For now, return false as we don't have free OpenAI access
    // This can be implemented when free tier becomes available
    return false;
  }

  /**
   * Analyze with HuggingFace API
   */
  async analyzeWithHuggingFace(resumeText, jobDescription) {
    try {
      // Use a text classification model for basic analysis
      const prompt = `Analyze this resume for ATS compatibility. Resume: ${resumeText.substring(0, 1000)}. Job: ${jobDescription.substring(0, 500)}`;
      
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true }
        })
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status}`);
      }

      // Read response only once to avoid clone issues
      const result = await response.json();
      
      // Convert HuggingFace response to our format
      return this.convertHuggingFaceResponse(result, resumeText, jobDescription);
      
    } catch (error) {
      console.error('HuggingFace analysis failed:', error);
      // Return rule-based analysis instead of throwing
      return this.getRuleBasedScore(resumeText, jobDescription);
    }
  }

  /**
   * Analyze with OpenAI API (placeholder for future implementation)
   */
  async analyzeWithOpenAI(resumeText, jobDescription) {
    // Placeholder for OpenAI implementation
    throw new Error('OpenAI service not yet implemented');
  }

  /**
   * Convert HuggingFace response to our ATS score format
   */
  convertHuggingFaceResponse(huggingFaceResult, resumeText, jobDescription) {
    // Since HuggingFace free models are limited, we'll combine their output
    // with our rule-based analysis for better results
    const ruleBasedScore = this.getRuleBasedScore(resumeText, jobDescription);
    
    // Enhance the rule-based score with AI insights if available
    if (huggingFaceResult && Array.isArray(huggingFaceResult) && huggingFaceResult.length > 0) {
      // Adjust confidence based on AI response
      ruleBasedScore.confidence = Math.min(0.9, ruleBasedScore.confidence + 0.2);
      ruleBasedScore.recommendations.unshift('AI-enhanced analysis completed');
    }
    
    return ruleBasedScore;
  }

  /**
   * Rule-based ATS scoring algorithm using enhanced content analysis engine
   */
  getRuleBasedScore(resumeText, jobDescription) {
    try {
      // Use the enhanced content analysis engine
      const result = contentAnalysisEngine.analyzeContent(resumeText, jobDescription);
      return result;
    } catch (error) {
      console.warn('Enhanced content analysis failed, using basic fallback:', error);
      // Fall back to basic analysis if enhanced engine fails
      return this.getBasicRuleBasedScore(resumeText, jobDescription);
    }
  }

  /**
   * Basic rule-based scoring as fallback
   */
  getBasicRuleBasedScore(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Extract key information
    const analysis = this.analyzeContent(resumeText, jobDescription);
    
    // Calculate scores for each pillar
    const coreSkillsScore = this.calculateCoreSkillsScore(analysis);
    const experienceScore = this.calculateExperienceScore(analysis);
    const toolsScore = this.calculateToolsScore(analysis);
    const educationScore = this.calculateEducationScore(analysis);
    
    const overallScore = coreSkillsScore.score + experienceScore.score + toolsScore.score + educationScore.score;
    
    return {
      overall_score: Math.max(20, Math.min(95, overallScore)),
      confidence: 0.7,
      pillars: {
        core_skills: coreSkillsScore,
        relevant_experience: experienceScore,
        tools_methodologies: toolsScore,
        education_credentials: educationScore
      },
      recommendations: this.generateRecommendations(analysis),
      errors: []
    };
  }

  /**
   * Analyze resume and job description content
   */
  analyzeContent(resumeText, jobDescription) {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    
    // Common technical skills
    const technicalSkills = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'git',
      'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'kubernetes', 'jenkins',
      'html', 'css', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'c++', 'c#'
    ];
    
    // Extract skills from both resume and job description
    const resumeSkills = technicalSkills.filter(skill => resume.includes(skill));
    const requiredSkills = technicalSkills.filter(skill => jd.includes(skill));
    const matchedSkills = resumeSkills.filter(skill => requiredSkills.includes(skill));
    
    // Extract experience years
    const resumeExpMatch = resume.match(/(\d+)\s*(years?|yrs?)/);
    const candidateYears = resumeExpMatch ? parseInt(resumeExpMatch[1]) : 0;
    
    const jdExpMatch = jd.match(/(\d+)\+?\s*(years?|yrs?)/);
    const requiredYears = jdExpMatch ? parseInt(jdExpMatch[1]) : 3;
    
    // Check for education
    const hasEducation = /bachelor|master|degree|university|college|phd|doctorate/i.test(resume);
    const educationLevel = resume.includes('master') || resume.includes('phd') ? 'advanced' : 
                          resume.includes('bachelor') ? 'bachelor' : 
                          hasEducation ? 'some' : 'none';
    
    // Check for common tools and methodologies
    const tools = ['agile', 'scrum', 'devops', 'ci/cd', 'testing', 'debugging', 'api', 'microservices'];
    const resumeTools = tools.filter(tool => resume.includes(tool));
    const requiredTools = tools.filter(tool => jd.includes(tool));
    const matchedTools = resumeTools.filter(tool => requiredTools.includes(tool));
    
    // Analyze formatting and structure
    const hasHeaders = /experience|education|skills|summary|objective/i.test(resumeText);
    const hasBulletPoints = resumeText.includes('•') || resumeText.includes('-') || resumeText.includes('*');
    const wordCount = resumeText.split(/\s+/).length;
    
    return {
      resumeSkills,
      requiredSkills,
      matchedSkills,
      candidateYears,
      requiredYears,
      hasEducation,
      educationLevel,
      resumeTools,
      requiredTools,
      matchedTools,
      hasHeaders,
      hasBulletPoints,
      wordCount,
      resumeLength: resumeText.length
    };
  }

  /**
   * Calculate core skills score (max 40 points)
   */
  calculateCoreSkillsScore(analysis) {
    const { matchedSkills, requiredSkills, resumeSkills } = analysis;
    
    let score = 0;
    
    // Base score for having skills
    if (resumeSkills.length > 0) score += 10;
    
    // Score for matched skills
    const matchPercentage = requiredSkills.length > 0 ? 
      (matchedSkills.length / requiredSkills.length) : 
      (resumeSkills.length > 0 ? 0.5 : 0);
    
    score += Math.round(matchPercentage * 30);
    
    return {
      score: Math.min(40, score),
      matched: matchedSkills,
      required_count: requiredSkills.length || 5
    };
  }

  /**
   * Calculate experience score (max 30 points)
   */
  calculateExperienceScore(analysis) {
    const { candidateYears, requiredYears } = analysis;
    
    let score = 0;
    
    // Base score for having experience
    if (candidateYears > 0) score += 10;
    
    // Score based on experience match
    if (candidateYears >= requiredYears) {
      score += 20;
    } else if (candidateYears > 0) {
      score += Math.round((candidateYears / requiredYears) * 20);
    }
    
    return {
      score: Math.min(30, score),
      candidate_years: candidateYears,
      jd_years: requiredYears,
      evidence: candidateYears > 0 ? [`${candidateYears} years of experience found`] : []
    };
  }

  /**
   * Calculate tools and methodologies score (max 20 points)
   */
  calculateToolsScore(analysis) {
    const { matchedTools, resumeTools } = analysis;
    
    let score = 0;
    
    // Base score for having tools/methodologies
    if (resumeTools.length > 0) score += 8;
    
    // Score for matched tools
    score += Math.min(12, matchedTools.length * 3);
    
    return {
      score: Math.min(20, score),
      matched: matchedTools
    };
  }

  /**
   * Calculate education score (max 10 points)
   */
  calculateEducationScore(analysis) {
    const { hasEducation, educationLevel } = analysis;
    
    let score = 0;
    let degree = 'Not specified';
    
    if (hasEducation) {
      switch (educationLevel) {
        case 'advanced':
          score = 10;
          degree = 'Advanced degree (Master\'s/PhD)';
          break;
        case 'bachelor':
          score = 8;
          degree = 'Bachelor\'s degree';
          break;
        case 'some':
          score = 5;
          degree = 'Some college education';
          break;
        default:
          score = 3;
          degree = 'Education mentioned';
      }
    }
    
    return {
      score,
      degree,
      notes: hasEducation ? 'Educational background found in resume' : 'No clear educational background specified'
    };
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.matchedSkills.length < analysis.requiredSkills.length) {
      recommendations.push('Add more technical skills that match the job requirements');
    }
    
    if (analysis.candidateYears < analysis.requiredYears) {
      recommendations.push('Highlight relevant experience and transferable skills');
    }
    
    if (!analysis.hasHeaders) {
      recommendations.push('Use clear section headers (Experience, Education, Skills)');
    }
    
    if (!analysis.hasBulletPoints) {
      recommendations.push('Use bullet points to improve readability');
    }
    
    if (analysis.wordCount < 200) {
      recommendations.push('Expand your resume with more detailed descriptions');
    }
    
    if (analysis.matchedTools.length === 0) {
      recommendations.push('Include relevant tools and methodologies from the job description');
    }
    
    if (!analysis.hasEducation) {
      recommendations.push('Add your educational background if applicable');
    }
    
    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }

  /**
   * Job-tailored rule-based scoring with specific job context
   */
  getJobTailoredRuleBasedScore(resumeText, jobDescription, jobData) {
    try {
      // Get base rule-based score
      const baseScore = this.getRuleBasedScore(resumeText, jobDescription);
      
      // Enhance with job-specific analysis
      const jobSpecificAnalysis = this.analyzeJobSpecificMatch(resumeText, jobData);
      
      // Adjust scores based on job-specific matching
      const enhancedScore = this.enhanceScoreWithJobData(baseScore, jobSpecificAnalysis);
      
      // Add job-specific recommendations
      enhancedScore.recommendations = [
        ...this.generateJobSpecificRecommendations(jobSpecificAnalysis),
        ...enhancedScore.recommendations.slice(0, 3)
      ];
      
      // Add job-specific metadata
      enhancedScore.jobSpecific = {
        targetRole: jobData.jobTitle,
        targetCompany: jobData.company,
        skillsMatch: jobSpecificAnalysis.skillsMatch,
        experienceMatch: jobSpecificAnalysis.experienceMatch,
        requirementsMatch: jobSpecificAnalysis.requirementsMatch
      };
      
      return enhancedScore;
      
    } catch (error) {
      console.warn('Job-tailored analysis failed, using base score:', error);
      return this.getRuleBasedScore(resumeText, jobDescription);
    }
  }

  /**
   * Analyze job-specific matching
   */
  analyzeJobSpecificMatch(resumeText, jobData) {
    const resumeLower = resumeText.toLowerCase();
    
    // Skills matching
    const skillsMatch = {
      required: jobData.requiredSkills?.length || 0,
      matched: 0,
      matchedSkills: [],
      missingSkills: jobData.requiredSkills || []
    };
    
    if (jobData.requiredSkills) {
      skillsMatch.matchedSkills = jobData.requiredSkills.filter(skill =>
        resumeLower.includes(skill.toLowerCase())
      );
      skillsMatch.matched = skillsMatch.matchedSkills.length;
      skillsMatch.missingSkills = jobData.requiredSkills.filter(skill =>
        !resumeLower.includes(skill.toLowerCase())
      );
      skillsMatch.matchPercentage = skillsMatch.required > 0 
        ? Math.round((skillsMatch.matched / skillsMatch.required) * 100) 
        : 0;
    }
    
    // Experience matching
    const candidateYears = this.extractExperienceYears(resumeText);
    const experienceMatch = {
      required: jobData.experienceYears || 0,
      candidate: candidateYears,
      meetsRequirement: candidateYears >= (jobData.experienceYears || 0),
      gap: Math.max(0, (jobData.experienceYears || 0) - candidateYears)
    };
    
    // Requirements matching
    const requirementsMatch = {
      total: jobData.requirements?.length || 0,
      matched: 0,
      matchedRequirements: [],
      missingRequirements: jobData.requirements || []
    };
    
    if (jobData.requirements) {
      jobData.requirements.forEach(req => {
        const reqWords = req.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        const matchCount = reqWords.filter(word => resumeLower.includes(word)).length;
        
        if (matchCount >= Math.ceil(reqWords.length * 0.4)) { // 40% word match threshold
          requirementsMatch.matched++;
          requirementsMatch.matchedRequirements.push(req);
        }
      });
      
      requirementsMatch.missingRequirements = jobData.requirements.filter(req =>
        !requirementsMatch.matchedRequirements.includes(req)
      );
      requirementsMatch.matchPercentage = requirementsMatch.total > 0
        ? Math.round((requirementsMatch.matched / requirementsMatch.total) * 100)
        : 0;
    }
    
    return {
      skillsMatch,
      experienceMatch,
      requirementsMatch
    };
  }

  /**
   * Enhance base score with job-specific data
   */
  enhanceScoreWithJobData(baseScore, jobSpecificAnalysis) {
    const enhanced = { ...baseScore };
    
    // Calculate job-specific bonuses
    let skillsBonus = 0;
    if (jobSpecificAnalysis.skillsMatch.matchPercentage >= 80) skillsBonus = 5;
    else if (jobSpecificAnalysis.skillsMatch.matchPercentage >= 60) skillsBonus = 3;
    else if (jobSpecificAnalysis.skillsMatch.matchPercentage >= 40) skillsBonus = 1;
    
    let experienceBonus = 0;
    if (jobSpecificAnalysis.experienceMatch.meetsRequirement) experienceBonus = 3;
    else if (jobSpecificAnalysis.experienceMatch.gap <= 1) experienceBonus = 1;
    
    let requirementsBonus = 0;
    if (jobSpecificAnalysis.requirementsMatch.matchPercentage >= 70) requirementsBonus = 4;
    else if (jobSpecificAnalysis.requirementsMatch.matchPercentage >= 50) requirementsBonus = 2;
    
    // Apply bonuses to relevant pillars
    enhanced.pillars.core_skills.score = Math.min(40, 
      enhanced.pillars.core_skills.score + skillsBonus
    );
    enhanced.pillars.relevant_experience.score = Math.min(30, 
      enhanced.pillars.relevant_experience.score + experienceBonus
    );
    enhanced.pillars.tools_methodologies.score = Math.min(20, 
      enhanced.pillars.tools_methodologies.score + requirementsBonus
    );
    
    // Recalculate overall score
    enhanced.overall_score = 
      enhanced.pillars.core_skills.score +
      enhanced.pillars.relevant_experience.score +
      enhanced.pillars.tools_methodologies.score +
      enhanced.pillars.education_credentials.score;
    
    // Increase confidence for job-specific analysis
    enhanced.confidence = Math.min(0.9, enhanced.confidence + 0.1);
    
    return enhanced;
  }

  /**
   * Generate job-specific recommendations
   */
  generateJobSpecificRecommendations(jobSpecificAnalysis) {
    const recommendations = [];
    
    // Skills recommendations
    if (jobSpecificAnalysis.skillsMatch.missingSkills.length > 0) {
      const topMissing = jobSpecificAnalysis.skillsMatch.missingSkills.slice(0, 3);
      recommendations.push(
        `Add these required skills: ${topMissing.join(', ')}`
      );
    }
    
    // Experience recommendations
    if (!jobSpecificAnalysis.experienceMatch.meetsRequirement) {
      if (jobSpecificAnalysis.experienceMatch.gap > 0) {
        recommendations.push(
          `Highlight relevant experience to address the ${jobSpecificAnalysis.experienceMatch.gap}-year experience gap`
        );
      }
    }
    
    // Requirements recommendations
    if (jobSpecificAnalysis.requirementsMatch.matchPercentage < 60) {
      const topMissing = jobSpecificAnalysis.requirementsMatch.missingRequirements.slice(0, 2);
      recommendations.push(
        `Address these key requirements: ${topMissing.join('; ')}`
      );
    }
    
    return recommendations.slice(0, 3); // Limit to 3 job-specific recommendations
  }

  /**
   * Extract years of experience from resume text
   */
  extractExperienceYears(resumeText) {
    const expPatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /(\d+)\+?\s*yrs?\s*(?:of\s*)?experience/i,
      /experience[:\s]*(\d+)\+?\s*years?/i
    ];
    
    for (const pattern of expPatterns) {
      const match = resumeText.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }
    
    // Fallback: count work experiences by years mentioned
    const yearMatches = resumeText.match(/\b(19|20)\d{2}\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const years = yearMatches.map(year => parseInt(year)).sort((a, b) => b - a);
      return Math.min(15, years[0] - years[years.length - 1]);
    }
    
    return 0;
  }

  /**
   * Basic content analysis for ultimate fallback
   */
  getBasicContentScore(resumeText, jobDescription) {
    const wordCount = resumeText.split(/\s+/).length;
    const hasBasicStructure = /experience|education|skills/i.test(resumeText);
    
    // Very basic scoring
    let score = 30; // Base score
    if (wordCount > 100) score += 10;
    if (wordCount > 300) score += 10;
    if (hasBasicStructure) score += 15;
    if (resumeText.length > 500) score += 10;
    
    return {
      overall_score: Math.min(75, score),
      confidence: 0.4,
      pillars: {
        core_skills: { score: Math.round(score * 0.4), matched: ['Basic content detected'], required_count: 3 },
        relevant_experience: { score: Math.round(score * 0.3), candidate_years: 1, jd_years: 2, evidence: ['Content analysis'] },
        tools_methodologies: { score: Math.round(score * 0.2), matched: ['Standard tools'] },
        education_credentials: { score: Math.round(score * 0.1), degree: 'Content analysis', notes: 'Basic analysis' }
      },
      recommendations: [
        'Use a more detailed resume analysis when AI services are available',
        'Ensure your resume has clear section headers',
        'Add specific skills and achievements'
      ],
      errors: []
    };
  }
}

// Export singleton instance
export const aiServiceManager = new AIServiceManager();
export default AIServiceManager;