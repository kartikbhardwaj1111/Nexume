/**
 * AI-Powered Interview Assistant
 * Generates follow-up questions and provides intelligent interview guidance
 */

import AIServiceManager from '../ai/AIServiceManager.js';

class InterviewAI {
  constructor() {
    this.aiService = new AIServiceManager();
  }

  /**
   * Generate follow-up questions based on user response
   */
  async generateFollowUpQuestions(originalQuestion, userResponse, context = {}) {
    const prompt = this.buildFollowUpPrompt(originalQuestion, userResponse, context);
    
    try {
      const response = await this.aiService.analyzeContent(prompt);
      return this.parseFollowUpResponse(response);
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return this.getFallbackFollowUpQuestions(originalQuestion.type);
    }
  }

  /**
   * Analyze response quality and provide suggestions
   */
  async analyzeResponse(question, response, context = {}) {
    const prompt = this.buildAnalysisPrompt(question, response, context);
    
    try {
      const analysis = await this.aiService.analyzeContent(prompt);
      return this.parseAnalysisResponse(analysis);
    } catch (error) {
      console.error('Error analyzing response:', error);
      return this.getFallbackAnalysis(question.type);
    }
  }

  /**
   * Generate personalized interview questions based on resume/profile
   */
  async generatePersonalizedQuestions(profile, role, difficulty = 'medium') {
    const prompt = this.buildPersonalizationPrompt(profile, role, difficulty);
    
    try {
      const response = await this.aiService.analyzeContent(prompt);
      return this.parsePersonalizedQuestions(response);
    } catch (error) {
      console.error('Error generating personalized questions:', error);
      return [];
    }
  }

  /**
   * Provide real-time interview coaching
   */
  async provideCoaching(sessionData, currentResponse) {
    const prompt = this.buildCoachingPrompt(sessionData, currentResponse);
    
    try {
      const coaching = await this.aiService.analyzeContent(prompt);
      return this.parseCoachingResponse(coaching);
    } catch (error) {
      console.error('Error providing coaching:', error);
      return this.getFallbackCoaching();
    }
  }

  /**
   * Build follow-up question prompt
   */
  buildFollowUpPrompt(originalQuestion, userResponse, context) {
    return `
You are an experienced interviewer conducting a ${context.role || 'technical'} interview.

Original Question: "${originalQuestion.question}"
Question Type: ${originalQuestion.type}
Difficulty: ${originalQuestion.difficulty}

Candidate's Response: "${userResponse}"

Based on the candidate's response, generate 2-3 relevant follow-up questions that:
1. Dig deeper into their experience
2. Test their understanding of concepts mentioned
3. Explore practical applications or challenges they've faced

Format your response as JSON:
{
  "followUpQuestions": [
    {
      "question": "Follow-up question text",
      "purpose": "Why this question is relevant",
      "difficulty": "easy|medium|hard"
    }
  ],
  "responseQuality": "brief assessment of the response quality",
  "suggestedAreas": ["areas to explore further"]
}
`;
  }

  /**
   * Build response analysis prompt
   */
  buildAnalysisPrompt(question, response, context) {
    return `
Analyze this interview response for quality and completeness.

Question: "${question.question}"
Type: ${question.type}
Expected Criteria: ${question.evaluationCriteria?.join(', ') || 'General assessment'}

Response: "${response}"

Provide analysis in JSON format:
{
  "score": 1-10,
  "strengths": ["what the candidate did well"],
  "weaknesses": ["areas for improvement"],
  "suggestions": ["specific advice for better responses"],
  "completeness": "how well they addressed the question",
  "clarity": "how clear and structured their response was",
  "examples": "quality of examples provided (if any)"
}
`;
  }

  /**
   * Build personalization prompt
   */
  buildPersonalizationPrompt(profile, role, difficulty) {
    return `
Generate personalized interview questions based on this candidate profile:

Role: ${role}
Experience Level: ${profile.experienceLevel || 'Not specified'}
Skills: ${profile.skills?.join(', ') || 'Not specified'}
Previous Roles: ${profile.previousRoles?.join(', ') || 'Not specified'}
Industry: ${profile.industry || 'Not specified'}
Difficulty: ${difficulty}

Generate 5 questions that are specifically tailored to their background.
Focus on their actual experience and skills mentioned.

Format as JSON:
{
  "questions": [
    {
      "question": "Question text",
      "type": "technical|behavioral|situational",
      "difficulty": "easy|medium|hard",
      "reasoning": "Why this question is relevant to their profile",
      "evaluationCriteria": ["what to look for in their response"]
    }
  ]
}
`;
  }

  /**
   * Build coaching prompt
   */
  buildCoachingPrompt(sessionData, currentResponse) {
    return `
Provide real-time interview coaching based on this session data:

Current Question Type: ${sessionData.currentQuestion?.type}
Response So Far: "${currentResponse}"
Session Progress: ${sessionData.currentQuestionIndex + 1}/${sessionData.totalQuestions}
Time Elapsed: ${sessionData.timeElapsed} seconds

Provide coaching in JSON format:
{
  "encouragement": "positive reinforcement message",
  "suggestions": ["immediate tips for improving current response"],
  "timeManagement": "advice about pacing",
  "nextSteps": "what to focus on for remaining questions"
}
`;
  }

  /**
   * Parse follow-up response
   */
  parseFollowUpResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        followUpQuestions: parsed.followUpQuestions || [],
        responseQuality: parsed.responseQuality || '',
        suggestedAreas: parsed.suggestedAreas || []
      };
    } catch (error) {
      return this.getFallbackFollowUpQuestions('general');
    }
  }

  /**
   * Parse analysis response
   */
  parseAnalysisResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        score: parsed.score || 5,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        suggestions: parsed.suggestions || [],
        completeness: parsed.completeness || '',
        clarity: parsed.clarity || '',
        examples: parsed.examples || ''
      };
    } catch (error) {
      return this.getFallbackAnalysis('general');
    }
  }

  /**
   * Parse personalized questions
   */
  parsePersonalizedQuestions(response) {
    try {
      const parsed = JSON.parse(response);
      return parsed.questions || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Parse coaching response
   */
  parseCoachingResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        encouragement: parsed.encouragement || 'Keep going! You\'re doing great.',
        suggestions: parsed.suggestions || [],
        timeManagement: parsed.timeManagement || '',
        nextSteps: parsed.nextSteps || ''
      };
    } catch (error) {
      return this.getFallbackCoaching();
    }
  }

  /**
   * Fallback follow-up questions
   */
  getFallbackFollowUpQuestions(questionType) {
    const fallbacks = {
      technical: [
        {
          question: "Can you walk me through how you would implement this in a production environment?",
          purpose: "Test practical application knowledge",
          difficulty: "medium"
        },
        {
          question: "What challenges have you faced with this technology in real projects?",
          purpose: "Assess real-world experience",
          difficulty: "medium"
        }
      ],
      behavioral: [
        {
          question: "What would you do differently if you faced a similar situation again?",
          purpose: "Test learning and growth mindset",
          difficulty: "medium"
        },
        {
          question: "How did this experience change your approach to similar challenges?",
          purpose: "Assess self-reflection and improvement",
          difficulty: "medium"
        }
      ],
      situational: [
        {
          question: "What factors would you consider when making this decision?",
          purpose: "Test decision-making process",
          difficulty: "medium"
        },
        {
          question: "How would you communicate this decision to stakeholders?",
          purpose: "Assess communication skills",
          difficulty: "medium"
        }
      ]
    };

    return {
      followUpQuestions: fallbacks[questionType] || fallbacks.technical,
      responseQuality: 'Unable to analyze response quality at this time.',
      suggestedAreas: ['Consider providing more specific examples', 'Elaborate on the technical details']
    };
  }

  /**
   * Fallback analysis
   */
  getFallbackAnalysis(questionType) {
    return {
      score: 6,
      strengths: ['Provided a response', 'Showed engagement with the question'],
      weaknesses: ['Could provide more specific examples', 'Could elaborate on technical details'],
      suggestions: [
        'Use the STAR method for behavioral questions',
        'Provide concrete examples from your experience',
        'Explain your thought process clearly'
      ],
      completeness: 'Response addresses the basic question but could be more comprehensive.',
      clarity: 'Response is understandable but could be more structured.',
      examples: 'Consider adding specific examples to illustrate your points.'
    };
  }

  /**
   * Fallback coaching
   */
  getFallbackCoaching() {
    return {
      encouragement: 'You\'re doing well! Keep providing detailed responses.',
      suggestions: [
        'Take your time to think before answering',
        'Use specific examples from your experience',
        'Structure your responses clearly'
      ],
      timeManagement: 'You\'re maintaining good pace. Continue to be thorough but concise.',
      nextSteps: 'Focus on providing concrete examples and explaining your thought process.'
    };
  }

  /**
   * Generate interview tips based on question type
   */
  getInterviewTips(questionType) {
    const tips = {
      technical: [
        'Explain your thought process step by step',
        'Consider edge cases and error handling',
        'Discuss trade-offs and alternative approaches',
        'Use concrete examples from your experience'
      ],
      behavioral: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Be specific about your role and contributions',
        'Focus on what you learned and how you grew',
        'Choose examples that highlight relevant skills'
      ],
      situational: [
        'Think through the problem systematically',
        'Consider multiple stakeholders and perspectives',
        'Explain your decision-making process',
        'Discuss potential risks and mitigation strategies'
      ],
      'system-design': [
        'Start with clarifying questions and requirements',
        'Think about scale and performance from the beginning',
        'Consider data flow and system boundaries',
        'Discuss trade-offs between different approaches'
      ]
    };

    return tips[questionType] || tips.technical;
  }

  /**
   * Evaluate response using STAR method (for behavioral questions)
   */
  evaluateSTARMethod(response) {
    const starElements = {
      situation: /situation|context|background|setting/i,
      task: /task|goal|objective|challenge|problem/i,
      action: /action|did|implemented|decided|approached/i,
      result: /result|outcome|impact|achieved|learned/i
    };

    const evaluation = {};
    let score = 0;

    Object.entries(starElements).forEach(([element, regex]) => {
      const present = regex.test(response);
      evaluation[element] = present;
      if (present) score += 25;
    });

    return {
      score,
      breakdown: evaluation,
      missing: Object.keys(evaluation).filter(key => !evaluation[key]),
      suggestions: this.getSTARSuggestions(evaluation)
    };
  }

  /**
   * Get STAR method suggestions
   */
  getSTARSuggestions(evaluation) {
    const suggestions = [];
    
    if (!evaluation.situation) {
      suggestions.push('Provide more context about the situation or setting');
    }
    if (!evaluation.task) {
      suggestions.push('Clearly state the task, goal, or challenge you faced');
    }
    if (!evaluation.action) {
      suggestions.push('Describe the specific actions you took');
    }
    if (!evaluation.result) {
      suggestions.push('Explain the results or outcomes of your actions');
    }

    return suggestions;
  }
}

export default InterviewAI;