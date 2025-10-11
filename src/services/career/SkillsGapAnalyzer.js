/**
 * SkillsGapAnalyzer - Analyzes skills gaps and generates learning paths
 */

import { ROLE_CLASSIFICATIONS, CAREER_PROGRESSION_PATHS, INDUSTRY_SKILLS } from '../../data/career-paths/careerData.js';
import { LEARNING_RESOURCES } from '../../data/career-paths/learningResources.js';

export class SkillsGapAnalyzer {
  constructor() {
    this.learningPathGenerator = new LearningPathGenerator();
    this.progressTracker = new ProgressTracker();
  }

  /**
   * Analyze skills gap between current skills and target role
   * @param {Object} currentAssessment - Current career assessment
   * @param {string} targetRole - Target role identifier
   * @param {string} targetLevel - Target experience level
   * @returns {Promise<Object>} Skills gap analysis
   */
  async analyzeSkillsGap(currentAssessment, targetRole, targetLevel = null) {
    try {
      const targetRequirements = this.getTargetRequirements(targetRole, targetLevel);
      const currentSkills = currentAssessment.skills;
      
      const analysis = {
        targetRole: targetRole,
        targetLevel: targetLevel || this.suggestTargetLevel(currentAssessment.experienceLevel),
        missingSkills: this.identifyMissingSkills(currentSkills, targetRequirements),
        skillsToImprove: this.identifySkillsToImprove(currentSkills, targetRequirements),
        strengthSkills: this.identifyStrengthSkills(currentSkills, targetRequirements),
        timeline: this.estimateTimeline(currentSkills, targetRequirements),
        priority: this.prioritizeSkills(currentSkills, targetRequirements),
        learningPath: await this.learningPathGenerator.generatePath(currentSkills, targetRequirements),
        milestones: this.generateMilestones(currentSkills, targetRequirements)
      };
      
      return analysis;
    } catch (error) {
      console.error('Error in skills gap analysis:', error);
      throw new Error('Failed to analyze skills gap');
    }
  }

  /**
   * Get target role requirements
   * @param {string} targetRole - Target role identifier
   * @param {string} targetLevel - Target experience level
   * @returns {Object} Target requirements
   */
  getTargetRequirements(targetRole, targetLevel) {
    const roleData = ROLE_CLASSIFICATIONS[targetRole];
    const careerPath = CAREER_PROGRESSION_PATHS[targetRole];
    
    if (!roleData) {
      throw new Error(`Unknown target role: ${targetRole}`);
    }
    
    const requirements = {
      coreSkills: roleData.requiredSkills,
      responsibilities: roleData.responsibilities,
      levelSpecificSkills: [],
      salaryRange: null
    };
    
    // Add level-specific requirements if available
    if (careerPath && targetLevel && careerPath.levels[targetLevel]) {
      const levelData = careerPath.levels[targetLevel];
      requirements.levelSpecificSkills = levelData.skills;
      requirements.salaryRange = levelData.salaryRange;
      requirements.responsibilities = [...requirements.responsibilities, ...levelData.responsibilities];
    }
    
    return requirements;
  }

  /**
   * Suggest appropriate target level based on current level
   * @param {string} currentLevel - Current experience level
   * @returns {string} Suggested target level
   */
  suggestTargetLevel(currentLevel) {
    const levelProgression = {
      'entry': 'mid',
      'mid': 'senior',
      'senior': 'lead',
      'lead': 'executive',
      'executive': 'executive'
    };
    
    return levelProgression[currentLevel] || 'mid';
  }

  /**
   * Identify missing skills
   * @param {Array} currentSkills - User's current skills
   * @param {Object} targetRequirements - Target role requirements
   * @returns {Array} Missing skills with details
   */
  identifyMissingSkills(currentSkills, targetRequirements) {
    const currentSkillNames = currentSkills.map(skill => skill.name.toLowerCase());
    const allRequiredSkills = [
      ...targetRequirements.coreSkills,
      ...targetRequirements.levelSpecificSkills
    ];
    
    const missingSkills = allRequiredSkills
      .filter(requiredSkill => 
        !currentSkillNames.some(currentSkill => 
          currentSkill.includes(requiredSkill.toLowerCase()) ||
          requiredSkill.toLowerCase().includes(currentSkill)
        )
      )
      .map(skill => ({
        name: skill,
        importance: this.calculateSkillImportance(skill, targetRequirements),
        category: this.categorizeSkill(skill),
        estimatedLearningTime: this.estimateLearningTime(skill, 'beginner')
      }));
    
    return missingSkills.sort((a, b) => b.importance - a.importance);
  }

  /**
   * Identify skills that need improvement
   * @param {Array} currentSkills - User's current skills
   * @param {Object} targetRequirements - Target role requirements
   * @returns {Array} Skills needing improvement
   */
  identifySkillsToImprove(currentSkills, targetRequirements) {
    const allRequiredSkills = [
      ...targetRequirements.coreSkills,
      ...targetRequirements.levelSpecificSkills
    ];
    
    const skillsToImprove = currentSkills
      .filter(currentSkill => {
        // Check if skill is required and proficiency is below target
        const isRequired = allRequiredSkills.some(requiredSkill =>
          currentSkill.name.toLowerCase().includes(requiredSkill.toLowerCase()) ||
          requiredSkill.toLowerCase().includes(currentSkill.name.toLowerCase())
        );
        
        return isRequired && currentSkill.proficiency < 4; // Below expert level
      })
      .map(skill => ({
        ...skill,
        targetProficiency: 4,
        improvementNeeded: 4 - skill.proficiency,
        estimatedLearningTime: this.estimateLearningTime(skill.name, 'intermediate')
      }));
    
    return skillsToImprove.sort((a, b) => b.improvementNeeded - a.improvementNeeded);
  }

  /**
   * Identify strength skills that align with target role
   * @param {Array} currentSkills - User's current skills
   * @param {Object} targetRequirements - Target role requirements
   * @returns {Array} Strength skills
   */
  identifyStrengthSkills(currentSkills, targetRequirements) {
    const allRequiredSkills = [
      ...targetRequirements.coreSkills,
      ...targetRequirements.levelSpecificSkills
    ];
    
    return currentSkills
      .filter(skill => {
        const isRequired = allRequiredSkills.some(requiredSkill =>
          skill.name.toLowerCase().includes(requiredSkill.toLowerCase()) ||
          requiredSkill.toLowerCase().includes(skill.name.toLowerCase())
        );
        
        return isRequired && skill.proficiency >= 4;
      })
      .sort((a, b) => b.proficiency - a.proficiency);
  }

  /**
   * Estimate timeline for skill development
   * @param {Array} currentSkills - User's current skills
   * @param {Object} targetRequirements - Target role requirements
   * @returns {Object} Timeline estimation
   */
  estimateTimeline(currentSkills, targetRequirements) {
    const missingSkills = this.identifyMissingSkills(currentSkills, targetRequirements);
    const skillsToImprove = this.identifySkillsToImprove(currentSkills, targetRequirements);
    
    const totalLearningTime = [
      ...missingSkills.map(skill => skill.estimatedLearningTime),
      ...skillsToImprove.map(skill => skill.estimatedLearningTime)
    ].reduce((total, time) => total + time, 0);
    
    // Assume 10 hours per week of learning
    const weeksNeeded = Math.ceil(totalLearningTime / 10);
    const monthsNeeded = Math.ceil(weeksNeeded / 4);
    
    return {
      totalHours: totalLearningTime,
      weeks: weeksNeeded,
      months: monthsNeeded,
      phases: this.createLearningPhases(missingSkills, skillsToImprove)
    };
  }

  /**
   * Prioritize skills based on importance and impact
   * @param {Array} currentSkills - User's current skills
   * @param {Object} targetRequirements - Target role requirements
   * @returns {Object} Prioritized skills
   */
  prioritizeSkills(currentSkills, targetRequirements) {
    const missingSkills = this.identifyMissingSkills(currentSkills, targetRequirements);
    const skillsToImprove = this.identifySkillsToImprove(currentSkills, targetRequirements);
    
    const allSkills = [
      ...missingSkills.map(skill => ({ ...skill, type: 'missing' })),
      ...skillsToImprove.map(skill => ({ ...skill, type: 'improve' }))
    ];
    
    // Sort by importance and learning time
    const prioritized = allSkills.sort((a, b) => {
      const scoreA = a.importance - (a.estimatedLearningTime / 100);
      const scoreB = b.importance - (b.estimatedLearningTime / 100);
      return scoreB - scoreA;
    });
    
    return {
      high: prioritized.slice(0, 3),
      medium: prioritized.slice(3, 8),
      low: prioritized.slice(8)
    };
  }

  /**
   * Generate learning milestones
   * @param {Array} currentSkills - User's current skills
   * @param {Object} targetRequirements - Target role requirements
   * @returns {Array} Learning milestones
   */
  generateMilestones(currentSkills, targetRequirements) {
    const priority = this.prioritizeSkills(currentSkills, targetRequirements);
    const milestones = [];
    
    // Milestone 1: High priority skills
    if (priority.high.length > 0) {
      milestones.push({
        id: 1,
        title: 'Foundation Skills',
        description: 'Master the most critical skills for your target role',
        skills: priority.high,
        estimatedWeeks: Math.ceil(priority.high.reduce((total, skill) => 
          total + skill.estimatedLearningTime, 0) / 40), // 40 hours per week
        completionCriteria: 'Complete all high-priority skill requirements'
      });
    }
    
    // Milestone 2: Medium priority skills
    if (priority.medium.length > 0) {
      milestones.push({
        id: 2,
        title: 'Intermediate Competencies',
        description: 'Develop supporting skills and deepen expertise',
        skills: priority.medium,
        estimatedWeeks: Math.ceil(priority.medium.reduce((total, skill) => 
          total + skill.estimatedLearningTime, 0) / 40),
        completionCriteria: 'Achieve proficiency in medium-priority skills'
      });
    }
    
    // Milestone 3: Advanced skills and specialization
    if (priority.low.length > 0) {
      milestones.push({
        id: 3,
        title: 'Advanced Specialization',
        description: 'Master advanced skills and develop unique expertise',
        skills: priority.low,
        estimatedWeeks: Math.ceil(priority.low.reduce((total, skill) => 
          total + skill.estimatedLearningTime, 0) / 40),
        completionCriteria: 'Complete all skill development goals'
      });
    }
    
    return milestones;
  }

  /**
   * Calculate skill importance based on role requirements
   * @param {string} skill - Skill name
   * @param {Object} targetRequirements - Target requirements
   * @returns {number} Importance score (0-10)
   */
  calculateSkillImportance(skill, targetRequirements) {
    let importance = 5; // Base importance
    
    // Core skills are more important
    if (targetRequirements.coreSkills.includes(skill)) {
      importance += 3;
    }
    
    // Level-specific skills are important
    if (targetRequirements.levelSpecificSkills.includes(skill)) {
      importance += 2;
    }
    
    // Technical skills often have higher importance
    if (this.categorizeSkill(skill) === 'technical') {
      importance += 1;
    }
    
    return Math.min(importance, 10);
  }

  /**
   * Categorize a skill
   * @param {string} skill - Skill name
   * @returns {string} Skill category
   */
  categorizeSkill(skill) {
    const technicalKeywords = [
      'programming', 'javascript', 'python', 'java', 'react', 'sql',
      'aws', 'docker', 'kubernetes', 'machine learning', 'ai'
    ];
    
    const softKeywords = [
      'leadership', 'communication', 'management', 'teamwork', 'presentation'
    ];
    
    const skillLower = skill.toLowerCase();
    
    if (technicalKeywords.some(keyword => skillLower.includes(keyword))) {
      return 'technical';
    } else if (softKeywords.some(keyword => skillLower.includes(keyword))) {
      return 'soft';
    } else {
      return 'domain';
    }
  }

  /**
   * Estimate learning time for a skill
   * @param {string} skill - Skill name
   * @param {string} level - Learning level (beginner, intermediate, advanced)
   * @returns {number} Estimated hours
   */
  estimateLearningTime(skill, level = 'beginner') {
    const baseHours = {
      beginner: 40,
      intermediate: 60,
      advanced: 100
    };
    
    const skillMultipliers = {
      'programming': 1.5,
      'machine learning': 2.0,
      'system design': 1.8,
      'leadership': 1.2,
      'communication': 0.8,
      'project management': 1.0
    };
    
    const skillLower = skill.toLowerCase();
    let multiplier = 1.0;
    
    Object.keys(skillMultipliers).forEach(keyword => {
      if (skillLower.includes(keyword)) {
        multiplier = skillMultipliers[keyword];
      }
    });
    
    return Math.round(baseHours[level] * multiplier);
  }

  /**
   * Create learning phases for timeline
   * @param {Array} missingSkills - Missing skills
   * @param {Array} skillsToImprove - Skills to improve
   * @returns {Array} Learning phases
   */
  createLearningPhases(missingSkills, skillsToImprove) {
    const phases = [];
    
    // Phase 1: Foundation (missing high-priority skills)
    const foundationSkills = missingSkills
      .filter(skill => skill.importance >= 7)
      .slice(0, 3);
    
    if (foundationSkills.length > 0) {
      phases.push({
        name: 'Foundation Phase',
        duration: Math.ceil(foundationSkills.reduce((total, skill) => 
          total + skill.estimatedLearningTime, 0) / 40),
        skills: foundationSkills,
        description: 'Build essential skills required for the target role'
      });
    }
    
    // Phase 2: Development (remaining missing skills + improvements)
    const developmentSkills = [
      ...missingSkills.filter(skill => skill.importance < 7),
      ...skillsToImprove.slice(0, 3)
    ];
    
    if (developmentSkills.length > 0) {
      phases.push({
        name: 'Development Phase',
        duration: Math.ceil(developmentSkills.reduce((total, skill) => 
          total + skill.estimatedLearningTime, 0) / 40),
        skills: developmentSkills,
        description: 'Develop intermediate skills and improve existing competencies'
      });
    }
    
    // Phase 3: Mastery (remaining improvements)
    const masterySkills = skillsToImprove.slice(3);
    
    if (masterySkills.length > 0) {
      phases.push({
        name: 'Mastery Phase',
        duration: Math.ceil(masterySkills.reduce((total, skill) => 
          total + skill.estimatedLearningTime, 0) / 40),
        skills: masterySkills,
        description: 'Achieve mastery and develop advanced expertise'
      });
    }
    
    return phases;
  }
}

/**
 * LearningPathGenerator - Generates personalized learning paths
 */
class LearningPathGenerator {
  constructor() {
    this.resourceDatabase = LEARNING_RESOURCES;
  }

  /**
   * Generate learning path for skills gap
   * @param {Array} currentSkills - Current skills
   * @param {Object} targetRequirements - Target requirements
   * @returns {Promise<Array>} Learning path with resources
   */
  async generatePath(currentSkills, targetRequirements) {
    const skillsGapAnalyzer = new SkillsGapAnalyzer();
    const missingSkills = skillsGapAnalyzer.identifyMissingSkills(currentSkills, targetRequirements);
    const skillsToImprove = skillsGapAnalyzer.identifySkillsToImprove(currentSkills, targetRequirements);
    
    const learningPath = [];
    
    // Generate learning modules for missing skills
    for (const skill of missingSkills.slice(0, 5)) { // Limit to top 5
      const module = await this.createLearningModule(skill, 'beginner');
      learningPath.push(module);
    }
    
    // Generate learning modules for skills to improve
    for (const skill of skillsToImprove.slice(0, 3)) { // Limit to top 3
      const module = await this.createLearningModule(skill, 'intermediate');
      learningPath.push(module);
    }
    
    return learningPath.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Create learning module for a skill
   * @param {Object} skill - Skill object
   * @param {string} level - Learning level
   * @returns {Promise<Object>} Learning module
   */
  async createLearningModule(skill, level) {
    const resources = this.findLearningResources(skill.name, level);
    
    return {
      skillName: skill.name,
      level: level,
      estimatedHours: skill.estimatedLearningTime || 40,
      priority: skill.importance || 5,
      resources: resources,
      milestones: this.createSkillMilestones(skill.name, level),
      assessments: this.createAssessments(skill.name, level)
    };
  }

  /**
   * Find learning resources for a skill
   * @param {string} skillName - Name of the skill
   * @param {string} level - Learning level
   * @returns {Array} Learning resources
   */
  findLearningResources(skillName, level) {
    const skillLower = skillName.toLowerCase();
    const resources = [];
    
    // Find matching resources from database
    if (this.resourceDatabase[skillLower]) {
      const skillResources = this.resourceDatabase[skillLower][level] || 
                           this.resourceDatabase[skillLower]['beginner'] || [];
      resources.push(...skillResources);
    }
    
    // Add generic resources if no specific ones found
    if (resources.length === 0) {
      resources.push(...this.getGenericResources(skillName, level));
    }
    
    return resources.slice(0, 5); // Limit to 5 resources per skill
  }

  /**
   * Get generic learning resources
   * @param {string} skillName - Skill name
   * @param {string} level - Learning level
   * @returns {Array} Generic resources
   */
  getGenericResources(skillName, level) {
    return [
      {
        type: 'course',
        title: `${skillName} ${level} Course`,
        provider: 'Online Learning Platform',
        duration: '4-6 weeks',
        cost: 'Free/Paid',
        url: '#',
        rating: 4.5
      },
      {
        type: 'documentation',
        title: `Official ${skillName} Documentation`,
        provider: 'Official Docs',
        duration: 'Self-paced',
        cost: 'Free',
        url: '#',
        rating: 4.0
      },
      {
        type: 'practice',
        title: `${skillName} Practice Projects`,
        provider: 'GitHub/CodePen',
        duration: '2-4 weeks',
        cost: 'Free',
        url: '#',
        rating: 4.2
      }
    ];
  }

  /**
   * Create skill-specific milestones
   * @param {string} skillName - Skill name
   * @param {string} level - Learning level
   * @returns {Array} Skill milestones
   */
  createSkillMilestones(skillName, level) {
    const baseMilestones = [
      {
        id: 1,
        title: `Understand ${skillName} Fundamentals`,
        description: `Learn the basic concepts and principles of ${skillName}`,
        estimatedHours: 10
      },
      {
        id: 2,
        title: `Practice ${skillName} Basics`,
        description: `Complete hands-on exercises and simple projects`,
        estimatedHours: 15
      },
      {
        id: 3,
        title: `Build ${skillName} Project`,
        description: `Create a complete project demonstrating ${skillName} skills`,
        estimatedHours: 15
      }
    ];
    
    if (level === 'intermediate' || level === 'advanced') {
      baseMilestones.push({
        id: 4,
        title: `Advanced ${skillName} Techniques`,
        description: `Master advanced concepts and best practices`,
        estimatedHours: 20
      });
    }
    
    return baseMilestones;
  }

  /**
   * Create skill assessments
   * @param {string} skillName - Skill name
   * @param {string} level - Learning level
   * @returns {Array} Assessments
   */
  createAssessments(skillName, level) {
    return [
      {
        type: 'quiz',
        title: `${skillName} Knowledge Check`,
        description: `Test your understanding of ${skillName} concepts`,
        questions: 10,
        passingScore: 80
      },
      {
        type: 'project',
        title: `${skillName} Practical Assessment`,
        description: `Demonstrate your ${skillName} skills through a practical project`,
        requirements: [`Use ${skillName} effectively`, 'Follow best practices', 'Document your work'],
        estimatedHours: 8
      }
    ];
  }
}

/**
 * ProgressTracker - Tracks learning progress and milestones
 */
class ProgressTracker {
  constructor() {
    this.storageKey = 'career-progress';
  }

  /**
   * Track skill completion
   * @param {string} userId - User identifier
   * @param {string} skillName - Completed skill
   * @param {Object} completionData - Completion details
   * @returns {Object} Updated progress
   */
  trackSkillCompletion(userId, skillName, completionData) {
    const progress = this.getProgress(userId);
    
    if (!progress.completedSkills) {
      progress.completedSkills = [];
    }
    
    progress.completedSkills.push({
      skill: skillName,
      completedAt: new Date().toISOString(),
      ...completionData
    });
    
    this.saveProgress(userId, progress);
    return progress;
  }

  /**
   * Track milestone completion
   * @param {string} userId - User identifier
   * @param {number} milestoneId - Milestone ID
   * @param {Object} milestoneData - Milestone details
   * @returns {Object} Updated progress
   */
  trackMilestoneCompletion(userId, milestoneId, milestoneData) {
    const progress = this.getProgress(userId);
    
    if (!progress.completedMilestones) {
      progress.completedMilestones = [];
    }
    
    progress.completedMilestones.push({
      milestoneId: milestoneId,
      completedAt: new Date().toISOString(),
      ...milestoneData
    });
    
    this.saveProgress(userId, progress);
    return progress;
  }

  /**
   * Get user progress
   * @param {string} userId - User identifier
   * @returns {Object} User progress data
   */
  getProgress(userId) {
    try {
      const stored = localStorage.getItem(`${this.storageKey}-${userId}`);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading progress:', error);
      return {};
    }
  }

  /**
   * Save user progress
   * @param {string} userId - User identifier
   * @param {Object} progress - Progress data
   */
  saveProgress(userId, progress) {
    try {
      localStorage.setItem(`${this.storageKey}-${userId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  /**
   * Calculate overall progress percentage
   * @param {string} userId - User identifier
   * @param {Array} totalMilestones - All milestones
   * @returns {number} Progress percentage
   */
  calculateProgressPercentage(userId, totalMilestones) {
    const progress = this.getProgress(userId);
    const completedCount = progress.completedMilestones?.length || 0;
    const totalCount = totalMilestones.length;
    
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  }
}

export default SkillsGapAnalyzer;