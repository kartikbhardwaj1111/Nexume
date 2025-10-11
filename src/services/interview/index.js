/**
 * Interview Services Index
 * Exports all interview-related services and utilities
 */

import QuestionManager from './QuestionManager.js';
import InterviewSessionManager from './InterviewSessionManager.js';
import InterviewAI from './InterviewAI.js';
import InterviewEvaluator from './InterviewEvaluator.js';

// Create singleton instances
const questionManager = new QuestionManager();
const sessionManager = new InterviewSessionManager();
const interviewAI = new InterviewAI();
const interviewEvaluator = new InterviewEvaluator();

export { 
  questionManager, 
  QuestionManager,
  sessionManager,
  InterviewSessionManager,
  interviewAI,
  InterviewAI,
  interviewEvaluator,
  InterviewEvaluator
};

// Export question database for direct access if needed
export * from '../../data/interview-questions/questionDatabase.js';

// Utility functions for common operations
export const interviewUtils = {
  /**
   * Get recommended questions for a specific interview scenario
   */
  getRecommendedQuestions: (scenario) => {
    const { role, company, level, duration = 60 } = scenario;
    
    return questionManager.generateInterviewSet({
      role,
      company,
      difficulty: level === 'senior' ? ['medium', 'hard'] : ['easy', 'medium'],
      duration,
      questionTypes: ['technical', 'behavioral', 'situational']
    });
  },

  /**
   * Get practice questions for skill improvement
   */
  getPracticeQuestions: (skillArea, difficulty = 'medium', count = 10) => {
    return questionManager.getQuestions({
      tags: [skillArea],
      difficulty: [difficulty],
      limit: count,
      shuffle: true
    });
  },

  /**
   * Get company-specific interview preparation
   */
  getCompanyPrep: (company) => {
    return questionManager.getQuestionsByCompany(company, {
      limit: 25
    });
  },

  /**
   * Get role-specific technical questions
   */
  getTechnicalQuestions: (role, level = 'medium') => {
    return questionManager.getQuestionsByRole(role, {
      difficulty: [level],
      limit: 20
    });
  },

  /**
   * Get behavioral questions for leadership assessment
   */
  getBehavioralQuestions: (focus = 'general') => {
    const focusMap = {
      leadership: ['leadership', 'team-building', 'management'],
      communication: ['communication', 'stakeholder-management'],
      problem_solving: ['problem-solving', 'innovation', 'adaptability'],
      general: ['teamwork', 'communication', 'problem-solving']
    };

    return questionManager.getQuestions({
      type: ['behavioral'],
      tags: focusMap[focus] || focusMap.general,
      limit: 15,
      shuffle: true
    });
  }
};

export default {
  questionManager,
  QuestionManager,
  sessionManager,
  InterviewSessionManager,
  interviewAI,
  InterviewAI,
  interviewEvaluator,
  InterviewEvaluator,
  interviewUtils
};