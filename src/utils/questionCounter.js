/**
 * Utility to count total questions in the database
 */

import QuestionManager from '../services/interview/QuestionManager.js';

export const getQuestionCount = () => {
  const questionManager = new QuestionManager();
  const stats = questionManager.getQuestionStats();
  
  console.log('Question Database Statistics:');
  console.log('Total Questions:', stats.total);
  console.log('By Type:', stats.byType);
  console.log('By Difficulty:', stats.byDifficulty);
  console.log('By Category:', stats.byCategory);
  console.log('Custom Questions:', stats.custom);
  
  return stats;
};

// Test the question count
if (typeof window !== 'undefined') {
  // Browser environment
  window.getQuestionCount = getQuestionCount;
} else {
  // Node environment for testing
  getQuestionCount();
}