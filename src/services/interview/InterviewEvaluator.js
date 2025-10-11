/**
 * Interview Evaluator
 * Provides detailed feedback and scoring using STAR method criteria
 */

import InterviewAI from './InterviewAI.js';

class InterviewEvaluator {
  constructor() {
    this.interviewAI = new InterviewAI();
    this.evaluationHistory = this.loadEvaluationHistory();
  }

  /**
   * Evaluate a complete interview session
   */
  async evaluateSession(session) {
    const evaluations = [];
    
    // Evaluate each response
    for (const response of session.responses) {
      if (!response.skipped) {
        const question = session.questions.find(q => q.id === response.questionId);
        const evaluation = await this.evaluateResponse(question, response);
        evaluations.push(evaluation);
      }
    }

    // Calculate overall session score
    const overallScore = this.calculateOverallScore(evaluations);
    
    // Generate comprehensive feedback
    const feedback = this.generateSessionFeedback(session, evaluations, overallScore);
    
    // Track performance over time
    const performanceTracking = this.trackPerformance(session, overallScore);

    const sessionEvaluation = {
      sessionId: session.id,
      overallScore,
      evaluations,
      feedback,
      performanceTracking,
      evaluatedAt: new Date().toISOString(),
      metadata: {
        totalQuestions: session.questions.length,
        answeredQuestions: session.responses.filter(r => !r.skipped).length,
        skippedQuestions: session.responses.filter(r => r.skipped).length,
        sessionDuration: this.calculateSessionDuration(session)
      }
    };

    // Save evaluation
    this.saveEvaluation(sessionEvaluation);
    
    return sessionEvaluation;
  }

  /**
   * Evaluate individual response
   */
  async evaluateResponse(question, response) {
    const evaluation = {
      questionId: question.id,
      questionType: question.type,
      questionDifficulty: question.difficulty,
      response: response.response,
      timeSpent: response.timeSpent,
      scores: {},
      feedback: {},
      suggestions: []
    };

    // Type-specific evaluation
    switch (question.type) {
      case 'behavioral':
        evaluation.scores = await this.evaluateBehavioralResponse(question, response);
        break;
      case 'technical':
        evaluation.scores = await this.evaluateTechnicalResponse(question, response);
        break;
      case 'situational':
        evaluation.scores = await this.evaluateSituationalResponse(question, response);
        break;
      default:
        evaluation.scores = await this.evaluateGeneralResponse(question, response);
    }

    // Generate AI-powered feedback
    try {
      const aiAnalysis = await this.interviewAI.analyzeResponse(question, response.response);
      evaluation.feedback.ai = aiAnalysis;
    } catch (error) {
      console.error('AI analysis failed:', error);
      evaluation.feedback.ai = this.getFallbackAnalysis(question.type);
    }

    // Calculate composite score
    evaluation.compositeScore = this.calculateCompositeScore(evaluation.scores);
    
    // Generate improvement suggestions
    evaluation.suggestions = this.generateSuggestions(evaluation);

    return evaluation;
  }

  /**
   * Evaluate behavioral response using STAR method
   */
  async evaluateBehavioralResponse(question, response) {
    const starEvaluation = this.interviewAI.evaluateSTARMethod(response.response);
    
    const scores = {
      star: {
        situation: starEvaluation.breakdown.situation ? 25 : 0,
        task: starEvaluation.breakdown.task ? 25 : 0,
        action: starEvaluation.breakdown.action ? 25 : 0,
        result: starEvaluation.breakdown.result ? 25 : 0,
        total: starEvaluation.score
      },
      clarity: this.evaluateClarity(response.response),
      relevance: this.evaluateRelevance(question, response.response),
      depth: this.evaluateDepth(response.response),
      specificity: this.evaluateSpecificity(response.response)
    };

    return scores;
  }

  /**
   * Evaluate technical response
   */
  async evaluateTechnicalResponse(question, response) {
    const scores = {
      technicalAccuracy: this.evaluateTechnicalAccuracy(question, response.response),
      completeness: this.evaluateCompleteness(question, response.response),
      clarity: this.evaluateClarity(response.response),
      practicalApplication: this.evaluatePracticalApplication(response.response),
      problemSolving: this.evaluateProblemSolving(response.response)
    };

    return scores;
  }

  /**
   * Evaluate situational response
   */
  async evaluateSituationalResponse(question, response) {
    const scores = {
      problemAnalysis: this.evaluateProblemAnalysis(response.response),
      decisionMaking: this.evaluateDecisionMaking(response.response),
      stakeholderConsideration: this.evaluateStakeholderConsideration(response.response),
      riskAssessment: this.evaluateRiskAssessment(response.response),
      communication: this.evaluateCommunication(response.response)
    };

    return scores;
  }

  /**
   * Evaluate general response
   */
  async evaluateGeneralResponse(question, response) {
    const scores = {
      relevance: this.evaluateRelevance(question, response.response),
      clarity: this.evaluateClarity(response.response),
      completeness: this.evaluateCompleteness(question, response.response),
      engagement: this.evaluateEngagement(response.response)
    };

    return scores;
  }

  /**
   * Evaluate clarity of response
   */
  evaluateClarity(responseText) {
    const factors = {
      structure: this.hasGoodStructure(responseText),
      vocabulary: this.hasAppropriateVocabulary(responseText),
      coherence: this.isCoherent(responseText),
      conciseness: this.isConcise(responseText)
    };

    const score = Object.values(factors).reduce((sum, val) => sum + (val ? 25 : 0), 0);
    return { score, factors };
  }

  /**
   * Evaluate relevance to question
   */
  evaluateRelevance(question, responseText) {
    const keywords = this.extractKeywords(question.question);
    const responseKeywords = this.extractKeywords(responseText);
    
    const overlap = keywords.filter(keyword => 
      responseKeywords.some(rk => rk.toLowerCase().includes(keyword.toLowerCase()))
    );

    const relevanceScore = Math.min(100, (overlap.length / keywords.length) * 100);
    
    return {
      score: relevanceScore,
      matchedKeywords: overlap,
      totalKeywords: keywords.length
    };
  }

  /**
   * Evaluate depth of response
   */
  evaluateDepth(responseText) {
    const factors = {
      examples: this.hasConcreteExamples(responseText),
      details: this.hasAdequateDetails(responseText),
      analysis: this.showsAnalyticalThinking(responseText),
      insights: this.providesInsights(responseText)
    };

    const score = Object.values(factors).reduce((sum, val) => sum + (val ? 25 : 0), 0);
    return { score, factors };
  }

  /**
   * Evaluate specificity
   */
  evaluateSpecificity(responseText) {
    const specificityIndicators = [
      /\d+/g, // Numbers
      /specific|particular|exact|precise/gi,
      /for example|such as|including/gi,
      /\$\d+|\d+%|\d+ (days|weeks|months|years)/gi // Metrics
    ];

    let score = 0;
    specificityIndicators.forEach(indicator => {
      if (indicator.test(responseText)) {
        score += 25;
      }
    });

    return Math.min(100, score);
  }

  /**
   * Generate improvement suggestions based on evaluation
   */
  generateSuggestions(evaluation) {
    const suggestions = [];
    
    // Analyze scores and provide specific suggestions
    Object.entries(evaluation.scores).forEach(([skill, scoreData]) => {
      const score = typeof scoreData === 'number' ? scoreData : 
                   scoreData?.score || scoreData?.total || 0;
      
      if (score < 70) {
        const suggestion = this.getSkillSuggestion(skill, score);
        if (suggestion) suggestions.push(suggestion);
      }
    });

    // Add general suggestions based on question type
    const generalSuggestions = this.getGeneralSuggestions(evaluation.questionType);
    suggestions.push(...generalSuggestions);

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  }

  getSkillSuggestion(skill, score) {
    const suggestions = {
      clarity: 'Structure your responses with clear introduction, main points, and conclusion',
      relevance: 'Stay focused on the question and address all parts directly',
      depth: 'Provide more detailed explanations and concrete examples',
      specificity: 'Include specific numbers, dates, and measurable outcomes',
      technicalAccuracy: 'Review fundamental concepts and stay current with best practices',
      star: 'Practice the STAR method: Situation, Task, Action, Result'
    };

    return suggestions[skill] || `Focus on improving ${skill} through targeted practice`;
  }

  getGeneralSuggestions(questionType) {
    const suggestions = {
      technical: [
        'Explain your thought process step by step',
        'Consider edge cases and error handling'
      ],
      behavioral: [
        'Use the STAR method for structured responses',
        'Choose examples that highlight relevant skills'
      ],
      situational: [
        'Think through multiple perspectives and stakeholders',
        'Explain your decision-making process clearly'
      ]
    };

    return suggestions[questionType] || suggestions.technical;
  }

  /**
   * Calculate composite score from individual scores
   */
  calculateCompositeScore(scores) {
    const allScores = [];
    
    Object.values(scores).forEach(scoreObj => {
      if (typeof scoreObj === 'number') {
        allScores.push(scoreObj);
      } else if (scoreObj && typeof scoreObj.score === 'number') {
        allScores.push(scoreObj.score);
      } else if (scoreObj && typeof scoreObj.total === 'number') {
        allScores.push(scoreObj.total);
      }
    });

    return allScores.length > 0 
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : 0;
  }

  /**
   * Calculate overall session score
   */
  calculateOverallScore(evaluations) {
    if (evaluations.length === 0) return 0;

    const totalScore = evaluations.reduce((sum, evaluation) => sum + evaluation.compositeScore, 0);
    const averageScore = totalScore / evaluations.length;

    // Apply bonuses/penalties
    let adjustedScore = averageScore;

    // Consistency bonus
    const scoreVariance = this.calculateVariance(evaluations.map(e => e.compositeScore));
    if (scoreVariance < 100) { // Low variance = consistent performance
      adjustedScore += 5;
    }

    // Time management assessment
    const avgTimePerQuestion = evaluations.reduce((sum, evaluation) => sum + evaluation.timeSpent, 0) / evaluations.length;
    if (avgTimePerQuestion > 300) { // More than 5 minutes per question
      adjustedScore -= 5;
    } else if (avgTimePerQuestion < 60) { // Less than 1 minute per question
      adjustedScore -= 10;
    }

    return Math.max(0, Math.min(100, Math.round(adjustedScore)));
  }

  /**
   * Generate comprehensive session feedback
   */
  generateSessionFeedback(session, evaluations, overallScore) {
    const feedback = {
      overall: this.generateOverallFeedback(overallScore),
      strengths: this.identifyStrengths(evaluations),
      weaknesses: this.identifyWeaknesses(evaluations),
      recommendations: this.generateRecommendations(evaluations),
      skillBreakdown: this.generateSkillBreakdown(evaluations),
      improvementPlan: this.generateImprovementPlan(evaluations)
    };

    return feedback;
  }

  /**
   * Generate skill breakdown analysis
   */
  generateSkillBreakdown(evaluations) {
    const skillData = {};
    
    evaluations.forEach(evaluation => {
      Object.entries(evaluation.scores).forEach(([skill, scoreData]) => {
        if (!skillData[skill]) {
          skillData[skill] = { scores: [], total: 0, count: 0 };
        }
        
        const score = typeof scoreData === 'number' ? scoreData : 
                     scoreData?.score || scoreData?.total || 0;
        
        skillData[skill].scores.push(score);
        skillData[skill].total += score;
        skillData[skill].count += 1;
      });
    });

    // Calculate statistics for each skill
    const breakdown = {};
    Object.entries(skillData).forEach(([skill, data]) => {
      breakdown[skill] = {
        average: data.total / data.count,
        min: Math.min(...data.scores),
        max: Math.max(...data.scores),
        consistency: this.calculateConsistency(data.scores)
      };
    });

    return breakdown;
  }

  /**
   * Generate improvement plan
   */
  generateImprovementPlan(evaluations) {
    const weaknesses = this.identifyWeaknesses(evaluations);
    const plan = {
      immediate: [], // Next 1-2 weeks
      shortTerm: [], // 1-2 months
      longTerm: []   // 3+ months
    };

    weaknesses.forEach(weakness => {
      const recommendation = this.getImprovementRecommendation(weakness.skill);
      const timeframe = this.categorizeTimeframe(recommendation.timeline);
      
      plan[timeframe].push({
        skill: weakness.skill,
        priority: weakness.priority,
        actions: recommendation.actions,
        resources: recommendation.resources
      });
    });

    return plan;
  }

  categorizeTimeframe(timeline) {
    if (timeline.includes('1-2 weeks') || timeline.includes('week')) {
      return 'immediate';
    } else if (timeline.includes('month') || timeline.includes('4-8 weeks')) {
      return 'shortTerm';
    } else {
      return 'longTerm';
    }
  }

  calculateConsistency(scores) {
    if (scores.length < 2) return 100;
    
    const variance = this.calculateVariance(scores);
    const maxVariance = 1000; // Arbitrary max for normalization
    
    return Math.max(0, 100 - (variance / maxVariance) * 100);
  }

  /**
   * Generate overall feedback based on score
   */
  generateOverallFeedback(score) {
    if (score >= 90) {
      return {
        level: 'Excellent',
        message: 'Outstanding performance! You demonstrated strong technical knowledge and excellent communication skills.',
        color: 'green'
      };
    } else if (score >= 80) {
      return {
        level: 'Very Good',
        message: 'Strong performance with good technical understanding and clear communication.',
        color: 'blue'
      };
    } else if (score >= 70) {
      return {
        level: 'Good',
        message: 'Solid performance with room for improvement in some areas.',
        color: 'yellow'
      };
    } else if (score >= 60) {
      return {
        level: 'Fair',
        message: 'Adequate performance but significant improvement needed.',
        color: 'orange'
      };
    } else {
      return {
        level: 'Needs Improvement',
        message: 'Performance below expectations. Focus on fundamental skills and practice.',
        color: 'red'
      };
    }
  }

  /**
   * Identify strengths from evaluations
   */
  identifyStrengths(evaluations) {
    const strengths = [];
    const scoreThreshold = 80;

    // Analyze score patterns
    const avgScores = this.calculateAverageScores(evaluations);
    
    Object.entries(avgScores).forEach(([skill, score]) => {
      if (score >= scoreThreshold) {
        strengths.push({
          skill: this.formatSkillName(skill),
          score,
          description: this.getSkillDescription(skill, 'strength')
        });
      }
    });

    return strengths;
  }

  /**
   * Identify weaknesses from evaluations
   */
  identifyWeaknesses(evaluations) {
    const weaknesses = [];
    const scoreThreshold = 60;

    const avgScores = this.calculateAverageScores(evaluations);
    
    Object.entries(avgScores).forEach(([skill, score]) => {
      if (score < scoreThreshold) {
        weaknesses.push({
          skill: this.formatSkillName(skill),
          score,
          description: this.getSkillDescription(skill, 'weakness'),
          priority: score < 40 ? 'high' : score < 50 ? 'medium' : 'low'
        });
      }
    });

    return weaknesses.sort((a, b) => a.score - b.score);
  }

  /**
   * Generate improvement recommendations
   */
  generateRecommendations(evaluations) {
    const recommendations = [];
    const weaknesses = this.identifyWeaknesses(evaluations);

    weaknesses.forEach(weakness => {
      const recommendation = this.getImprovementRecommendation(weakness.skill);
      if (recommendation) {
        recommendations.push({
          area: weakness.skill,
          priority: weakness.priority,
          actions: recommendation.actions,
          resources: recommendation.resources,
          timeline: recommendation.timeline
        });
      }
    });

    return recommendations;
  }

  /**
   * Track performance over time
   */
  trackPerformance(session, overallScore) {
    const userId = session.config.userId || 'anonymous';
    const performanceData = {
      userId,
      sessionId: session.id,
      score: overallScore,
      date: new Date().toISOString(),
      role: session.config.role,
      difficulty: session.config.difficulty,
      questionTypes: session.config.questionTypes
    };

    // Get historical performance
    const history = this.getPerformanceHistory(userId);
    history.push(performanceData);

    // Calculate trends
    const trends = this.calculatePerformanceTrends(history);

    return {
      current: performanceData,
      history: history.slice(-10), // Last 10 sessions
      trends,
      improvement: this.calculateImprovement(history)
    };
  }

  /**
   * Calculate performance trends
   */
  calculatePerformanceTrends(history) {
    if (history.length < 2) return null;

    const recentSessions = history.slice(-5);
    const olderSessions = history.slice(-10, -5);

    if (olderSessions.length === 0) return null;

    const recentAvg = recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) => sum + s.score, 0) / olderSessions.length;

    const trend = recentAvg - olderAvg;

    return {
      direction: trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable',
      magnitude: Math.abs(trend),
      recentAverage: Math.round(recentAvg),
      previousAverage: Math.round(olderAvg)
    };
  }

  /**
   * Specific evaluation methods
   */
  evaluateTechnicalAccuracy(question, responseText) {
    // Basic technical accuracy scoring based on keywords and concepts
    const technicalKeywords = this.extractTechnicalKeywords(question.question);
    const responseKeywords = this.extractKeywords(responseText);
    
    const accuracy = technicalKeywords.filter(keyword => 
      responseKeywords.some(rk => rk.toLowerCase().includes(keyword.toLowerCase()))
    ).length;

    return Math.min(100, (accuracy / Math.max(technicalKeywords.length, 1)) * 100);
  }

  evaluateCompleteness(question, responseText) {
    const criteria = question.evaluationCriteria || [];
    if (criteria.length === 0) return 75; // Default score if no criteria

    let score = 0;
    criteria.forEach(criterion => {
      const keywords = criterion.toLowerCase().split(' ');
      const hasKeyword = keywords.some(keyword => 
        responseText.toLowerCase().includes(keyword)
      );
      if (hasKeyword) score += 100 / criteria.length;
    });

    return Math.round(score);
  }

  evaluatePracticalApplication(responseText) {
    const practicalIndicators = [
      /project|experience|implemented|built|developed/gi,
      /example|instance|case study/gi,
      /production|real.world|actual/gi
    ];

    let score = 0;
    practicalIndicators.forEach(indicator => {
      if (indicator.test(responseText)) score += 33;
    });

    return Math.min(100, score);
  }

  evaluateProblemSolving(responseText) {
    const problemSolvingIndicators = [
      /approach|strategy|solution|method/gi,
      /analyze|consider|evaluate|assess/gi,
      /because|therefore|since|due to/gi
    ];

    let score = 0;
    problemSolvingIndicators.forEach(indicator => {
      if (indicator.test(responseText)) score += 33;
    });

    return Math.min(100, score);
  }

  evaluateProblemAnalysis(responseText) {
    const analysisIndicators = [
      /identify|analyze|break down|examine/gi,
      /root cause|underlying|factors/gi,
      /consider|evaluate|assess/gi
    ];

    let score = 0;
    analysisIndicators.forEach(indicator => {
      if (indicator.test(responseText)) score += 33;
    });

    return Math.min(100, score);
  }

  evaluateDecisionMaking(responseText) {
    const decisionIndicators = [
      /decide|choose|select|determine/gi,
      /criteria|factors|considerations/gi,
      /weigh|compare|evaluate options/gi
    ];

    let score = 0;
    decisionIndicators.forEach(indicator => {
      if (indicator.test(responseText)) score += 33;
    });

    return Math.min(100, score);
  }

  evaluateStakeholderConsideration(responseText) {
    const stakeholderIndicators = [
      /stakeholder|team|client|customer/gi,
      /communicate|discuss|collaborate/gi,
      /impact|affect|consider/gi
    ];

    let score = 0;
    stakeholderIndicators.forEach(indicator => {
      if (indicator.test(responseText)) score += 33;
    });

    return Math.min(100, score);
  }

  evaluateRiskAssessment(responseText) {
    const riskIndicators = [
      /risk|challenge|issue|problem/gi,
      /mitigation|prevention|contingency/gi,
      /potential|possible|might|could/gi
    ];

    let score = 0;
    riskIndicators.forEach(indicator => {
      if (indicator.test(responseText)) score += 33;
    });

    return Math.min(100, score);
  }

  evaluateCommunication(responseText) {
    return this.evaluateClarity(responseText).score;
  }

  evaluateEngagement(responseText) {
    const engagementIndicators = [
      responseText.length > 100, // Adequate length
      /I|my|we|our/gi.test(responseText), // Personal involvement
      /excited|passionate|interested|enjoy/gi.test(responseText) // Enthusiasm
    ];

    const score = engagementIndicators.filter(Boolean).length * 33;
    return Math.min(100, score);
  }

  extractTechnicalKeywords(questionText) {
    const technicalTerms = [
      'react', 'javascript', 'node', 'database', 'api', 'algorithm', 'data structure',
      'performance', 'security', 'testing', 'deployment', 'architecture', 'design pattern',
      'framework', 'library', 'optimization', 'scalability', 'microservices', 'cloud'
    ];

    return technicalTerms.filter(term => 
      questionText.toLowerCase().includes(term.toLowerCase())
    );
  }

  /**
   * Helper methods for evaluation
   */
  hasGoodStructure(text) {
    return text.includes('.') && text.length > 50;
  }

  hasAppropriateVocabulary(text) {
    const complexWords = text.match(/\b\w{7,}\b/g) || [];
    return complexWords.length >= 3;
  }

  isCoherent(text) {
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return sentences.length >= 2;
  }

  isConcise(text) {
    return text.length >= 100 && text.length <= 500;
  }

  extractKeywords(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
  }

  hasConcreteExamples(text) {
    return /example|instance|case|situation|project|experience/i.test(text);
  }

  hasAdequateDetails(text) {
    return text.length > 150;
  }

  showsAnalyticalThinking(text) {
    return /because|therefore|however|although|analysis|consider/i.test(text);
  }

  providesInsights(text) {
    return /learned|realized|discovered|insight|understanding/i.test(text);
  }

  calculateVariance(scores) {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return variance;
  }

  /**
   * Storage methods
   */
  loadEvaluationHistory() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('interview_evaluation_history');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading evaluation history:', error);
      return [];
    }
  }

  saveEvaluation(evaluation) {
    try {
      this.evaluationHistory.push(evaluation);
      
      // Keep only last 100 evaluations
      if (this.evaluationHistory.length > 100) {
        this.evaluationHistory = this.evaluationHistory.slice(-100);
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('interview_evaluation_history', JSON.stringify(this.evaluationHistory));
      }
    } catch (error) {
      console.error('Error saving evaluation:', error);
    }
  }

  getPerformanceHistory(userId) {
    return this.evaluationHistory
      .filter(evaluation => evaluation.performanceTracking?.current?.userId === userId)
      .map(evaluation => evaluation.performanceTracking.current)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Utility methods
   */
  calculateSessionDuration(session) {
    if (!session.startTime || !session.endTime) return 0;
    return (new Date(session.endTime) - new Date(session.startTime)) / 1000;
  }

  formatSkillName(skill) {
    return skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  getSkillDescription(skill, type) {
    const descriptions = {
      clarity: {
        strength: 'Excellent communication with clear, well-structured responses',
        weakness: 'Responses could be clearer and better organized'
      },
      relevance: {
        strength: 'Consistently addresses the question directly and thoroughly',
        weakness: 'Sometimes strays from the main question or lacks focus'
      },
      depth: {
        strength: 'Provides detailed analysis with concrete examples',
        weakness: 'Responses lack depth and specific examples'
      }
    };

    return descriptions[skill]?.[type] || `${type} in ${skill}`;
  }

  calculateAverageScores(evaluations) {
    const skillScores = {};
    
    evaluations.forEach(evaluation => {
      Object.entries(evaluation.scores).forEach(([skill, scoreData]) => {
        if (!skillScores[skill]) skillScores[skill] = [];
        
        const score = typeof scoreData === 'number' ? scoreData : 
                     scoreData?.score || scoreData?.total || 0;
        skillScores[skill].push(score);
      });
    });

    const avgScores = {};
    Object.entries(skillScores).forEach(([skill, scores]) => {
      avgScores[skill] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    return avgScores;
  }

  getImprovementRecommendation(skill) {
    const recommendations = {
      'Clarity': {
        actions: [
          'Practice structuring responses with clear introduction, body, and conclusion',
          'Use the STAR method for behavioral questions',
          'Pause and organize thoughts before speaking'
        ],
        resources: ['Communication skills courses', 'Public speaking practice'],
        timeline: '2-4 weeks'
      },
      'Technical Accuracy': {
        actions: [
          'Review fundamental concepts in your technology stack',
          'Practice coding problems regularly',
          'Stay updated with latest industry practices'
        ],
        resources: ['Technical documentation', 'Online coding platforms', 'Tech blogs'],
        timeline: '4-8 weeks'
      },
      'STAR': {
        actions: [
          'Practice behavioral questions using STAR method',
          'Prepare specific examples from your experience',
          'Focus on quantifiable results and outcomes'
        ],
        resources: ['STAR method guides', 'Behavioral interview prep'],
        timeline: '1-2 weeks'
      }
    };

    return recommendations[skill] || {
      actions: [`Focus on improving ${skill.toLowerCase()} through targeted practice`],
      resources: ['Relevant learning materials'],
      timeline: '2-4 weeks'
    };
  }

  getFallbackAnalysis(questionType) {
    return {
      score: 6,
      strengths: ['Provided a response', 'Showed engagement'],
      weaknesses: ['Could be more specific', 'Could provide more examples'],
      suggestions: ['Use concrete examples', 'Structure your response clearly'],
      completeness: 'Response addresses the question but could be more comprehensive',
      clarity: 'Response is understandable but could be clearer',
      examples: 'Consider adding specific examples to support your points'
    };
  }

  calculateImprovement(history) {
    if (history.length < 2) return null;

    const firstScore = history[0].score;
    const lastScore = history[history.length - 1].score;
    const improvement = lastScore - firstScore;

    return {
      points: improvement,
      percentage: Math.round((improvement / firstScore) * 100),
      direction: improvement > 0 ? 'improved' : improvement < 0 ? 'declined' : 'stable'
    };
  }
}

export default InterviewEvaluator;