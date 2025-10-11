/**
 * Gemini AI Service
 * Handles all interactions with Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../../config/gemini.js';

class GeminiService {
  constructor() {
    this.config = GEMINI_CONFIG;
    this.apiKey = this.config.apiKey;
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
    this.rateLimiter = {
      requestsPerMinute: this.config.rateLimits.requestsPerMinute,
      requestsPerHour: this.config.rateLimits.requestsPerHour,
      requestsPerDay: this.config.rateLimits.requestsPerDay,
      currentMinute: { count: 0, timestamp: Date.now() },
      currentHour: { count: 0, timestamp: Date.now() },
      currentDay: { count: 0, timestamp: Date.now() }
    };
    
    this.initialize();
  }

  /**
   * Initialize Gemini AI service
   */
  async initialize() {
    try {
      // Check if we have a valid API key
      if (!this.apiKey || this.apiKey === 'demo-key-not-functional' || this.apiKey.length < 20) {
        console.warn('No valid Gemini API key provided. Service will not be available.');
        this.isInitialized = false;
        return;
      }

      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: this.config.model,
        generationConfig: this.config.generationConfig,
        safetySettings: this.config.safetySettings
      });
      this.isInitialized = true;
      console.log('Gemini AI service initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize Gemini AI service:', error.message);
      this.isInitialized = false;
    }
  }

  /**
   * Check if service is available
   */
  async isAvailable() {
    // Quick check for API key
    if (!this.apiKey || this.apiKey === 'demo-key-not-functional' || this.apiKey.length < 20) {
      return false;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isInitialized) {
      return false;
    }

    // Check rate limits
    if (!this.checkRateLimit()) {
      return false;
    }

    try {
      // Test with a simple request
      const result = await this.model.generateContent('Test');
      return result && result.response;
    } catch (error) {
      console.warn('Gemini availability check failed:', error.message);
      return false;
    }
  }

  /**
   * Check rate limits
   */
  checkRateLimit() {
    const now = Date.now();
    
    // Reset counters if time windows have passed
    if (now - this.rateLimiter.currentMinute.timestamp > 60000) {
      this.rateLimiter.currentMinute = { count: 0, timestamp: now };
    }
    if (now - this.rateLimiter.currentHour.timestamp > 3600000) {
      this.rateLimiter.currentHour = { count: 0, timestamp: now };
    }
    if (now - this.rateLimiter.currentDay.timestamp > 86400000) {
      this.rateLimiter.currentDay = { count: 0, timestamp: now };
    }

    // Check limits
    return (
      this.rateLimiter.currentMinute.count < this.rateLimiter.requestsPerMinute &&
      this.rateLimiter.currentHour.count < this.rateLimiter.requestsPerHour &&
      this.rateLimiter.currentDay.count < this.rateLimiter.requestsPerDay
    );
  }

  /**
   * Increment rate limit counters
   */
  incrementRateLimit() {
    this.rateLimiter.currentMinute.count++;
    this.rateLimiter.currentHour.count++;
    this.rateLimiter.currentDay.count++;
  }

  /**
   * Analyze resume with job description
   */
  async analyzeResume(resumeText, jobDescription) {
    if (!this.isInitialized || !this.checkRateLimit()) {
      throw new Error('Gemini service not available or rate limit exceeded');
    }

    try {
      const prompt = this.buildResumeAnalysisPrompt(resumeText, jobDescription);
      
      const result = await this.model.generateContent(prompt);
      this.incrementRateLimit();
      
      const response = result.response;
      const text = response.text();
      
      return this.parseResumeAnalysisResponse(text);
    } catch (error) {
      console.error('Gemini resume analysis failed:', error);
      throw new Error(`Resume analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze resume with enhanced job context
   */
  async analyzeResumeWithContext(resumeText, jobDescription, contextPrompt, jobData) {
    if (!this.isInitialized || !this.checkRateLimit()) {
      throw new Error('Gemini service not available or rate limit exceeded');
    }

    try {
      const prompt = this.buildContextualAnalysisPrompt(
        resumeText, 
        jobDescription, 
        contextPrompt, 
        jobData
      );
      
      const result = await this.model.generateContent(prompt);
      this.incrementRateLimit();
      
      const response = result.response;
      const text = response.text();
      
      return this.parseContextualAnalysisResponse(text, jobData);
    } catch (error) {
      console.error('Gemini contextual analysis failed:', error);
      throw new Error(`Contextual analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze content for job extraction
   */
  async analyzeContent(prompt) {
    if (!this.isInitialized || !this.checkRateLimit()) {
      throw new Error('Gemini service not available or rate limit exceeded');
    }

    try {
      const result = await this.model.generateContent(prompt);
      this.incrementRateLimit();
      
      const response = result.response;
      const text = response.text();
      
      return {
        success: true,
        content: text,
        confidence: 0.9
      };
    } catch (error) {
      console.error('Gemini content analysis failed:', error);
      return {
        success: false,
        error: error.message,
        confidence: 0
      };
    }
  }

  /**
   * Extract job details from URL content
   */
  async extractJobDetails(htmlContent, url) {
    if (!this.isInitialized || !this.checkRateLimit()) {
      throw new Error('Gemini service not available or rate limit exceeded');
    }

    try {
      const prompt = this.buildJobExtractionPrompt(htmlContent, url);
      
      const result = await this.model.generateContent(prompt);
      this.incrementRateLimit();
      
      const response = result.response;
      const text = response.text();
      
      return this.parseJobExtractionResponse(text, url);
    } catch (error) {
      console.error('Gemini job extraction failed:', error);
      throw new Error(`Job extraction failed: ${error.message}`);
    }
  }

  /**
   * Generate career recommendations
   */
  async generateCareerRecommendations(userProfile, targetRole) {
    if (!this.isInitialized || !this.checkRateLimit()) {
      throw new Error('Gemini service not available or rate limit exceeded');
    }

    try {
      const prompt = this.buildCareerRecommendationPrompt(userProfile, targetRole);
      
      const result = await this.model.generateContent(prompt);
      this.incrementRateLimit();
      
      const response = result.response;
      const text = response.text();
      
      return this.parseCareerRecommendationResponse(text);
    } catch (error) {
      console.error('Gemini career recommendation failed:', error);
      throw new Error(`Career recommendation failed: ${error.message}`);
    }
  }

  /**
   * Generate interview questions
   */
  async generateInterviewQuestions(jobDescription, userProfile, difficulty = 'medium') {
    if (!this.isInitialized || !this.checkRateLimit()) {
      throw new Error('Gemini service not available or rate limit exceeded');
    }

    try {
      const prompt = this.buildInterviewQuestionsPrompt(jobDescription, userProfile, difficulty);
      
      const result = await this.model.generateContent(prompt);
      this.incrementRateLimit();
      
      const response = result.response;
      const text = response.text();
      
      return this.parseInterviewQuestionsResponse(text);
    } catch (error) {
      console.error('Gemini interview questions generation failed:', error);
      throw new Error(`Interview questions generation failed: ${error.message}`);
    }
  }

  /**
   * Build resume analysis prompt
   */
  buildResumeAnalysisPrompt(resumeText, jobDescription) {
    return `
You are an expert ATS (Applicant Tracking System) analyzer and career consultant. Analyze the following resume against the job description and provide a detailed ATS compatibility score.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please analyze and provide a JSON response with the following structure:
{
  "overall_score": <number between 0-100>,
  "confidence": <number between 0-1>,
  "pillars": {
    "core_skills": {
      "score": <number between 0-40>,
      "matched": [<array of matched skills>],
      "required_count": <number of required skills>
    },
    "relevant_experience": {
      "score": <number between 0-30>,
      "candidate_years": <number>,
      "jd_years": <number>,
      "evidence": [<array of experience evidence>]
    },
    "tools_methodologies": {
      "score": <number between 0-20>,
      "matched": [<array of matched tools/methodologies>]
    },
    "education_credentials": {
      "score": <number between 0-10>,
      "degree": "<degree level>",
      "notes": "<education notes>"
    }
  },
  "recommendations": [<array of specific improvement recommendations>],
  "errors": [<array of any errors or issues found>]
}

Focus on:
1. Keyword matching between resume and job description
2. ATS-friendly formatting
3. Relevant experience alignment
4. Skills gap analysis
5. Education requirements match
6. Industry-specific terminology usage

Provide actionable recommendations for improving ATS compatibility.
`;
  }

  /**
   * Build contextual analysis prompt
   */
  buildContextualAnalysisPrompt(resumeText, jobDescription, contextPrompt, jobData) {
    return `
${contextPrompt}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

JOB DATA:
- Title: ${jobData.jobTitle || 'Not specified'}
- Company: ${jobData.company || 'Not specified'}
- Required Skills: ${jobData.requiredSkills?.join(', ') || 'Not specified'}
- Experience Years: ${jobData.experienceYears || 'Not specified'}
- Location: ${jobData.location || 'Not specified'}

Provide a comprehensive analysis in the same JSON format as before, but with enhanced job-specific insights and recommendations tailored to this specific role and company.
`;
  }

  /**
   * Build job extraction prompt
   */
  buildJobExtractionPrompt(htmlContent, url) {
    return `
Extract job details from the following HTML content from ${url}:

${htmlContent.substring(0, 5000)} // Limit content to avoid token limits

Please extract and return a JSON object with the following structure:
{
  "title": "<job title>",
  "company": "<company name>",
  "location": "<job location>",
  "description": "<job description>",
  "requirements": [<array of job requirements>],
  "skills": [<array of required skills>],
  "experienceYears": <number of years required>,
  "education": "<education requirements>",
  "salary": {
    "min": <minimum salary if mentioned>,
    "max": <maximum salary if mentioned>,
    "currency": "<currency>"
  },
  "benefits": [<array of benefits if mentioned>],
  "jobType": "<full-time/part-time/contract/etc>",
  "remote": <true/false if remote work is mentioned>
}

Focus on extracting:
1. Clear job title and company name
2. Specific technical skills and requirements
3. Years of experience needed
4. Education requirements
5. Job responsibilities and duties
6. Any salary or benefits information
7. Work arrangement (remote, hybrid, on-site)

If any information is not clearly available, use null or empty array as appropriate.
`;
  }

  /**
   * Build career recommendation prompt
   */
  buildCareerRecommendationPrompt(userProfile, targetRole) {
    return `
As a career counselor, analyze the user's profile and provide personalized career advancement recommendations for their target role.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

TARGET ROLE: ${targetRole}

Provide recommendations in JSON format:
{
  "skillsGap": [<array of skills to develop>],
  "learningPath": [
    {
      "skill": "<skill name>",
      "priority": "<high/medium/low>",
      "timeframe": "<estimated time to learn>",
      "resources": [<array of learning resources>]
    }
  ],
  "experienceRecommendations": [<array of experience-building suggestions>],
  "certifications": [<array of relevant certifications>],
  "networkingTips": [<array of networking suggestions>],
  "timeline": "<estimated timeline to reach target role>",
  "nextSteps": [<array of immediate action items>]
}
`;
  }

  /**
   * Build interview questions prompt
   */
  buildInterviewQuestionsPrompt(jobDescription, userProfile, difficulty) {
    return `
Generate interview questions for the following job and candidate profile:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE:
${JSON.stringify(userProfile, null, 2)}

DIFFICULTY LEVEL: ${difficulty}

Generate questions in JSON format:
{
  "behavioral": [
    {
      "question": "<question text>",
      "category": "<category>",
      "difficulty": "<easy/medium/hard>",
      "tips": "<tips for answering>"
    }
  ],
  "technical": [
    {
      "question": "<question text>",
      "category": "<category>",
      "difficulty": "<easy/medium/hard>",
      "expectedAnswer": "<brief expected answer outline>"
    }
  ],
  "situational": [
    {
      "question": "<question text>",
      "scenario": "<scenario description>",
      "difficulty": "<easy/medium/hard>",
      "evaluationCriteria": [<array of evaluation points>]
    }
  ]
}

Generate 5 questions of each type, tailored to the specific job and candidate background.
`;
  }

  /**
   * Parse resume analysis response
   */
  parseResumeAnalysisResponse(text) {
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the response
      return {
        overall_score: Math.max(0, Math.min(100, parsed.overall_score || 0)),
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.8)),
        pillars: {
          core_skills: {
            score: Math.max(0, Math.min(40, parsed.pillars?.core_skills?.score || 0)),
            matched: Array.isArray(parsed.pillars?.core_skills?.matched) 
              ? parsed.pillars.core_skills.matched 
              : [],
            required_count: parsed.pillars?.core_skills?.required_count || 0
          },
          relevant_experience: {
            score: Math.max(0, Math.min(30, parsed.pillars?.relevant_experience?.score || 0)),
            candidate_years: parsed.pillars?.relevant_experience?.candidate_years || 0,
            jd_years: parsed.pillars?.relevant_experience?.jd_years || 0,
            evidence: Array.isArray(parsed.pillars?.relevant_experience?.evidence)
              ? parsed.pillars.relevant_experience.evidence
              : []
          },
          tools_methodologies: {
            score: Math.max(0, Math.min(20, parsed.pillars?.tools_methodologies?.score || 0)),
            matched: Array.isArray(parsed.pillars?.tools_methodologies?.matched)
              ? parsed.pillars.tools_methodologies.matched
              : []
          },
          education_credentials: {
            score: Math.max(0, Math.min(10, parsed.pillars?.education_credentials?.score || 0)),
            degree: parsed.pillars?.education_credentials?.degree || 'Not specified',
            notes: parsed.pillars?.education_credentials?.notes || ''
          }
        },
        recommendations: Array.isArray(parsed.recommendations) 
          ? parsed.recommendations.slice(0, 10) 
          : [],
        errors: Array.isArray(parsed.errors) ? parsed.errors : []
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Parse contextual analysis response
   */
  parseContextualAnalysisResponse(text, jobData) {
    const baseResponse = this.parseResumeAnalysisResponse(text);
    
    // Add job-specific metadata
    baseResponse.jobSpecific = {
      targetRole: jobData.jobTitle,
      targetCompany: jobData.company,
      analysisType: 'contextual'
    };
    
    return baseResponse;
  }

  /**
   * Parse job extraction response
   */
  parseJobExtractionResponse(text, url) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in job extraction response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        title: parsed.title || 'Job Title Not Found',
        company: parsed.company || 'Company Not Found',
        location: parsed.location || 'Location Not Specified',
        description: parsed.description || 'Description not available',
        requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experienceYears: parsed.experienceYears || 0,
        education: parsed.education || 'Not specified',
        salary: parsed.salary || null,
        benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
        jobType: parsed.jobType || 'Not specified',
        remote: parsed.remote || false,
        url: url,
        extractedAt: new Date()
      };
    } catch (error) {
      console.error('Failed to parse job extraction response:', error);
      throw new Error('Failed to parse job extraction response');
    }
  }

  /**
   * Parse career recommendation response
   */
  parseCareerRecommendationResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in career recommendation response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse career recommendation response:', error);
      throw new Error('Failed to parse career recommendation response');
    }
  }

  /**
   * Parse interview questions response
   */
  parseInterviewQuestionsResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in interview questions response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse interview questions response:', error);
      throw new Error('Failed to parse interview questions response');
    }
  }

  /**
   * Get service statistics
   */
  getServiceStats() {
    return {
      isInitialized: this.isInitialized,
      rateLimits: {
        minute: {
          used: this.rateLimiter.currentMinute.count,
          limit: this.rateLimiter.requestsPerMinute
        },
        hour: {
          used: this.rateLimiter.currentHour.count,
          limit: this.rateLimiter.requestsPerHour
        },
        day: {
          used: this.rateLimiter.currentDay.count,
          limit: this.rateLimiter.requestsPerDay
        }
      }
    };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default GeminiService;