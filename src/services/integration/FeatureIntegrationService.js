/**
 * Feature Integration Service
 * Connects career progression, resume optimization, job analysis, and interview prep
 */

import { CareerAnalyzer } from '../career/CareerAnalyzer';
import { SkillsGapAnalyzer } from '../career/SkillsGapAnalyzer';
import { aiServiceManager } from '../ai/AIServiceManager';
import { jobExtractor } from '../job/JobExtractor';
import InterviewSessionManager from '../interview/InterviewSessionManager';
import QuestionManager from '../interview/QuestionManager';
import LocalStorageManager from '../storage/LocalStorageManager';

export class FeatureIntegrationService {
  constructor() {
    this.careerAnalyzer = new CareerAnalyzer();
    this.skillsGapAnalyzer = new SkillsGapAnalyzer();
    this.aiServiceManager = aiServiceManager;
    this.jobExtractor = jobExtractor;
    this.interviewManager = new InterviewSessionManager();
    this.questionManager = new QuestionManager();
  }

  /**
   * Analyze resume and connect with career progression
   */
  async analyzeResumeWithCareerContext(resumeContent, targetRole = null) {
    try {
      // Basic resume analysis
      const resumeAnalysis = await this.aiServiceManager.analyzeResume(resumeContent);
      
      // Career level assessment
      const careerAssessment = await this.careerAnalyzer.assessCurrentLevel(resumeContent);
      
      // Skills gap analysis if target role provided
      let skillsGap = null;
      if (targetRole) {
        skillsGap = await this.skillsGapAnalyzer.analyzeSkillsGap(
          careerAssessment,
          targetRole
        );
      }
      
      // Generate integrated recommendations
      const recommendations = this.generateIntegratedRecommendations(
        resumeAnalysis,
        careerAssessment,
        skillsGap
      );
      
      // Store integrated analysis
      const integratedAnalysis = {
        resumeAnalysis,
        careerAssessment,
        skillsGap,
        recommendations,
        timestamp: new Date().toISOString()
      };
      
      LocalStorageManager.saveIntegratedAnalysis(integratedAnalysis);
      
      return integratedAnalysis;
    } catch (error) {
      console.error('Error in integrated resume analysis:', error);
      throw error;
    }
  }

  /**
   * Analyze job posting and connect with user's profile
   */
  async analyzeJobWithUserContext(jobUrl, userResumeContent = null) {
    try {
      // Extract job details
      const jobDetails = await this.jobExtractor.extractJobDetails(jobUrl);
      
      // If user has resume, analyze fit
      let jobFitAnalysis = null;
      if (userResumeContent) {
        jobFitAnalysis = await this.analyzeJobFit(jobDetails, userResumeContent);
      }
      
      // Generate interview questions for this job
      const interviewQuestions = this.questionManager.getQuestionsForJob(
        jobDetails.title,
        jobDetails.company,
        jobDetails.skills
      );
      
      // Create learning path for missing skills
      let learningPath = null;
      if (jobFitAnalysis?.missingSkills?.length > 0) {
        learningPath = await this.skillsGapAnalyzer.generateLearningPath(
          jobFitAnalysis.missingSkills
        );
      }
      
      const jobAnalysis = {
        jobDetails,
        jobFitAnalysis,
        interviewQuestions: interviewQuestions.slice(0, 10), // Top 10 questions
        learningPath,
        timestamp: new Date().toISOString()
      };
      
      LocalStorageManager.saveJobAnalysis(jobAnalysis);
      
      return jobAnalysis;
    } catch (error) {
      console.error('Error in integrated job analysis:', error);
      throw error;
    }
  }

  /**
   * Analyze how well user fits a specific job
   */
  async analyzeJobFit(jobDetails, resumeContent) {
    try {
      const careerAssessment = await this.careerAnalyzer.assessCurrentLevel(resumeContent);
      
      // Extract user skills from resume
      const userSkills = careerAssessment.skills.map(skill => skill.name.toLowerCase());
      const requiredSkills = jobDetails.skills.map(skill => skill.toLowerCase());
      
      // Calculate skill match
      const matchingSkills = requiredSkills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.includes(skill) || skill.includes(userSkill)
        )
      );
      
      const missingSkills = requiredSkills.filter(skill => 
        !userSkills.some(userSkill => 
          userSkill.includes(skill) || skill.includes(userSkill)
        )
      );
      
      // Calculate experience match
      const experienceMatch = this.calculateExperienceMatch(
        careerAssessment.experienceLevel,
        jobDetails.experienceYears
      );
      
      // Calculate overall fit score
      const skillMatchScore = (matchingSkills.length / requiredSkills.length) * 100;
      const overallFitScore = (skillMatchScore * 0.7) + (experienceMatch * 0.3);
      
      return {
        overallFitScore: Math.round(overallFitScore),
        skillMatchScore: Math.round(skillMatchScore),
        experienceMatch: Math.round(experienceMatch),
        matchingSkills,
        missingSkills,
        recommendations: this.generateJobFitRecommendations(
          overallFitScore,
          missingSkills,
          experienceMatch
        )
      };
    } catch (error) {
      console.error('Error analyzing job fit:', error);
      throw error;
    }
  }

  /**
   * Generate personalized interview preparation based on job and user profile
   */
  async generatePersonalizedInterviewPrep(jobDetails, userResumeContent) {
    try {
      const careerAssessment = await this.careerAnalyzer.assessCurrentLevel(userResumeContent);
      
      // Get role-specific questions
      const roleQuestions = this.questionManager.getQuestionsForRole(jobDetails.title);
      
      // Get company-specific questions if available
      const companyQuestions = this.questionManager.getQuestionsForCompany(jobDetails.company);
      
      // Get behavioral questions based on user's experience level
      const behavioralQuestions = this.questionManager.getBehavioralQuestions(
        careerAssessment.experienceLevel
      );
      
      // Get technical questions based on required skills
      const technicalQuestions = this.questionManager.getTechnicalQuestions(
        jobDetails.skills
      );
      
      // Create personalized prep plan
      const prepPlan = {
        jobDetails,
        userLevel: careerAssessment.experienceLevel,
        questionSets: {
          roleSpecific: roleQuestions.slice(0, 5),
          companySpecific: companyQuestions.slice(0, 3),
          behavioral: behavioralQuestions.slice(0, 7),
          technical: technicalQuestions.slice(0, 5)
        },
        preparationTips: this.generatePreparationTips(jobDetails, careerAssessment),
        estimatedPrepTime: this.calculatePrepTime(careerAssessment.experienceLevel),
        timestamp: new Date().toISOString()
      };
      
      LocalStorageManager.saveInterviewPrepPlan(prepPlan);
      
      return prepPlan;
    } catch (error) {
      console.error('Error generating personalized interview prep:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive user progress across all features
   */
  getUserProgress() {
    try {
      const resumeData = LocalStorageManager.getResumeData();
      const lastAnalysis = LocalStorageManager.getLastAnalysis();
      const careerProgress = LocalStorageManager.getCareerProgress();
      const interviewStats = this.interviewManager.getSessionStats();
      const templateUsage = LocalStorageManager.getTemplateUsage();
      
      return {
        resume: {
          hasResume: !!resumeData,
          lastScore: lastAnalysis?.score || null,
          lastAnalyzed: lastAnalysis?.timestamp || null
        },
        career: {
          currentLevel: careerProgress?.experienceLevel || null,
          skillsIdentified: careerProgress?.skills?.length || 0,
          learningPathActive: !!careerProgress?.learningPath
        },
        interview: {
          sessionsCompleted: interviewStats?.totalSessions || 0,
          averageScore: interviewStats?.averageScore || null,
          lastSession: interviewStats?.lastSession || null
        },
        templates: {
          templatesUsed: templateUsage?.count || 0,
          lastUsed: templateUsage?.lastUsed || null
        },
        overall: {
          completionPercentage: this.calculateOverallCompletion({
            resumeData,
            lastAnalysis,
            careerProgress,
            interviewStats,
            templateUsage
          })
        }
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  /**
   * Generate integrated recommendations across all features
   */
  generateIntegratedRecommendations(resumeAnalysis, careerAssessment, skillsGap) {
    const recommendations = [];
    
    // Resume optimization recommendations
    if (resumeAnalysis.score < 80) {
      recommendations.push({
        type: 'resume',
        priority: 'high',
        title: 'Optimize Resume for ATS',
        description: `Your resume scores ${resumeAnalysis.score}%. Focus on keyword optimization and formatting.`,
        actions: ['Add missing keywords', 'Improve formatting', 'Quantify achievements'],
        estimatedImpact: 'High',
        timeRequired: '2-3 hours'
      });
    }
    
    // Career development recommendations
    if (skillsGap?.missingSkills?.length > 0) {
      recommendations.push({
        type: 'career',
        priority: 'medium',
        title: 'Develop Key Skills',
        description: `${skillsGap.missingSkills.length} skills needed for your target role.`,
        actions: skillsGap.missingSkills.slice(0, 3).map(skill => `Learn ${skill}`),
        estimatedImpact: 'High',
        timeRequired: skillsGap.timeline?.total || '3-6 months'
      });
    }
    
    // Interview preparation recommendations
    const interviewStats = this.interviewManager.getSessionStats();
    if (!interviewStats || interviewStats.totalSessions < 5) {
      recommendations.push({
        type: 'interview',
        priority: 'medium',
        title: 'Practice Mock Interviews',
        description: 'Build confidence with targeted interview practice sessions.',
        actions: ['Complete behavioral questions', 'Practice technical questions', 'Record responses'],
        estimatedImpact: 'Medium',
        timeRequired: '1-2 weeks'
      });
    }
    
    // Template recommendations
    if (!LocalStorageManager.getTemplateUsage()) {
      recommendations.push({
        type: 'template',
        priority: 'low',
        title: 'Try Professional Templates',
        description: 'Create a polished resume with industry-specific templates.',
        actions: ['Browse templates', 'Customize design', 'Download PDF'],
        estimatedImpact: 'Medium',
        timeRequired: '30 minutes'
      });
    }
    
    return recommendations;
  }

  /**
   * Calculate experience match percentage
   */
  calculateExperienceMatch(userLevel, requiredYears) {
    const levelToYears = {
      'entry': 1,
      'mid': 3,
      'senior': 7,
      'lead': 10,
      'executive': 15
    };
    
    const userYears = levelToYears[userLevel] || 1;
    
    if (userYears >= requiredYears) {
      return 100;
    } else {
      return Math.max(0, (userYears / requiredYears) * 100);
    }
  }

  /**
   * Generate job fit recommendations
   */
  generateJobFitRecommendations(fitScore, missingSkills, experienceMatch) {
    const recommendations = [];
    
    if (fitScore >= 80) {
      recommendations.push('Excellent fit! Apply with confidence.');
      recommendations.push('Highlight matching skills prominently in your resume.');
    } else if (fitScore >= 60) {
      recommendations.push('Good fit with some skill gaps to address.');
      if (missingSkills.length > 0) {
        recommendations.push(`Focus on developing: ${missingSkills.slice(0, 3).join(', ')}`);
      }
    } else {
      recommendations.push('Consider developing more skills before applying.');
      recommendations.push('Use this as a learning opportunity to identify growth areas.');
    }
    
    if (experienceMatch < 70) {
      recommendations.push('Emphasize relevant experience and transferable skills.');
    }
    
    return recommendations;
  }

  /**
   * Generate preparation tips based on job and user profile
   */
  generatePreparationTips(jobDetails, careerAssessment) {
    const tips = [];
    
    // Company-specific tips
    tips.push(`Research ${jobDetails.company}'s recent news and company culture`);
    
    // Role-specific tips
    tips.push(`Prepare examples demonstrating ${jobDetails.skills.slice(0, 3).join(', ')}`);
    
    // Experience level tips
    if (careerAssessment.experienceLevel === 'entry') {
      tips.push('Focus on academic projects, internships, and transferable skills');
      tips.push('Prepare to discuss your learning mindset and growth potential');
    } else if (careerAssessment.experienceLevel === 'senior') {
      tips.push('Prepare leadership examples and strategic thinking scenarios');
      tips.push('Be ready to discuss mentoring and team development experience');
    }
    
    // General tips
    tips.push('Practice the STAR method for behavioral questions');
    tips.push('Prepare thoughtful questions about the role and team');
    
    return tips;
  }

  /**
   * Calculate estimated preparation time
   */
  calculatePrepTime(experienceLevel) {
    const baseTimes = {
      'entry': '8-12 hours',
      'mid': '6-8 hours',
      'senior': '4-6 hours',
      'lead': '3-4 hours',
      'executive': '2-3 hours'
    };
    
    return baseTimes[experienceLevel] || '6-8 hours';
  }

  /**
   * Calculate overall completion percentage
   */
  calculateOverallCompletion(data) {
    let completed = 0;
    let total = 4; // Four main features
    
    if (data.resumeData && data.lastAnalysis) completed++;
    if (data.careerProgress) completed++;
    if (data.interviewStats?.totalSessions > 0) completed++;
    if (data.templateUsage?.count > 0) completed++;
    
    return Math.round((completed / total) * 100);
  }
}

export default FeatureIntegrationService;