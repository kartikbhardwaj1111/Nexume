/**
 * Career Services - Main exports for career progression functionality
 */

export { CareerAnalyzer } from './CareerAnalyzer.js';
export { SkillsGapAnalyzer } from './SkillsGapAnalyzer.js';

// Re-export career data for convenience
export { 
  CAREER_LEVELS, 
  ROLE_CLASSIFICATIONS, 
  SKILL_CATEGORIES, 
  CAREER_PROGRESSION_PATHS, 
  INDUSTRY_SKILLS 
} from '../../data/career-paths/careerData.js';

export { 
  LEARNING_RESOURCES, 
  RESOURCE_TYPES, 
  LEARNING_PROVIDERS 
} from '../../data/career-paths/learningResources.js';

// Default export for convenience
export default {
  CareerAnalyzer,
  SkillsGapAnalyzer
};