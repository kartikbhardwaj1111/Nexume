/**
 * Gemini Integration Test
 * Simple test to verify Gemini API is working correctly
 */

import { geminiService } from '../services/ai/GeminiService.js';
import { aiServiceManager } from '../services/ai/AIServiceManager.js';

/**
 * Test Gemini service directly
 */
export async function testGeminiService() {
  console.log('Testing Gemini service...');
  
  try {
    // Test service availability
    const isAvailable = await geminiService.isAvailable();
    console.log('Gemini service available:', isAvailable);
    
    if (!isAvailable) {
      return {
        success: false,
        error: 'Gemini service not available'
      };
    }
    
    // Test simple content analysis
    const testPrompt = 'Analyze this text and return "SUCCESS" if you can process it: This is a test message.';
    const result = await geminiService.analyzeContent(testPrompt);
    
    console.log('Gemini test result:', result);
    
    return {
      success: result.success,
      response: result.content,
      confidence: result.confidence
    };
    
  } catch (error) {
    console.error('Gemini test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test resume analysis with Gemini
 */
export async function testResumeAnalysis() {
  console.log('Testing resume analysis with Gemini...');
  
  const sampleResume = `
    John Doe
    Software Engineer
    Email: john@example.com
    Phone: (555) 123-4567
    
    Experience:
    - 3 years of JavaScript development
    - React and Node.js expertise
    - AWS cloud experience
    
    Education:
    - Bachelor's in Computer Science
    
    Skills:
    - JavaScript, React, Node.js
    - AWS, Docker, Git
  `;
  
  const sampleJob = `
    We are looking for a Senior Software Engineer with:
    - 3+ years of JavaScript experience
    - React and Node.js skills
    - Cloud experience (AWS preferred)
    - Bachelor's degree in Computer Science
  `;
  
  try {
    const result = await aiServiceManager.analyzeResume(sampleResume, sampleJob);
    
    console.log('Resume analysis result:', result);
    
    return {
      success: true,
      atsScore: result.overall_score,
      confidence: result.confidence,
      method: result.analysisMethod,
      service: result.serviceName
    };
    
  } catch (error) {
    console.error('Resume analysis test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test job extraction with Gemini
 */
export async function testJobExtraction() {
  console.log('Testing job extraction with Gemini...');
  
  const sampleJobContent = `
    Senior Software Engineer - Tech Company Inc.
    
    Location: San Francisco, CA
    
    We are seeking a talented Senior Software Engineer to join our team.
    
    Requirements:
    - 5+ years of software development experience
    - Proficiency in JavaScript, Python, or Java
    - Experience with React, Angular, or Vue.js
    - Knowledge of cloud platforms (AWS, GCP, Azure)
    - Bachelor's degree in Computer Science or related field
    
    Responsibilities:
    - Design and develop scalable web applications
    - Collaborate with cross-functional teams
    - Mentor junior developers
    - Participate in code reviews
    
    Benefits:
    - Competitive salary ($120k - $180k)
    - Health insurance
    - 401k matching
    - Remote work options
  `;
  
  try {
    const result = await geminiService.extractJobDetails(sampleJobContent, 'https://example.com/job');
    
    console.log('Job extraction result:', result);
    
    return {
      success: true,
      jobTitle: result.title,
      company: result.company,
      skillsCount: result.skills?.length || 0,
      requirementsCount: result.requirements?.length || 0
    };
    
  } catch (error) {
    console.error('Job extraction test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('Running Gemini integration tests...');
  
  const results = {
    serviceTest: await testGeminiService(),
    resumeAnalysisTest: await testResumeAnalysis(),
    jobExtractionTest: await testJobExtraction()
  };
  
  console.log('All test results:', results);
  
  const allPassed = Object.values(results).every(result => result.success);
  
  return {
    success: allPassed,
    results,
    summary: {
      total: 3,
      passed: Object.values(results).filter(r => r.success).length,
      failed: Object.values(results).filter(r => !r.success).length
    }
  };
}

// Export for use in components or debugging
export default {
  testGeminiService,
  testResumeAnalysis,
  testJobExtraction,
  runAllTests
};