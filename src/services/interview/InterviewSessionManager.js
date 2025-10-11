/**
 * Interview Session Manager
 * Handles interview session lifecycle, timing, and data persistence
 */

import QuestionManager from './QuestionManager.js';

class InterviewSessionManager {
  constructor() {
    this.questionManager = new QuestionManager();
    this.activeSessions = new Map();
    this.sessionHistory = this.loadSessionHistory();
  }

  /**
   * Create a new interview session
   */
  createSession(config = {}) {
    const sessionId = `interview_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const defaultConfig = {
      duration: 60, // minutes
      difficulty: ['medium', 'hard'],
      questionTypes: ['technical', 'behavioral', 'situational'],
      allowSkip: true,
      recordAudio: false,
      timePerQuestion: 5, // minutes
      role: null,
      company: null
    };

    const sessionConfig = { ...defaultConfig, ...config };
    
    // Generate questions based on config
    const questions = this.generateSessionQuestions(sessionConfig);
    
    const session = {
      id: sessionId,
      config: sessionConfig,
      questions,
      responses: [],
      startTime: null,
      endTime: null,
      pausedTime: 0,
      currentQuestionIndex: 0,
      status: 'created', // created, active, paused, completed, abandoned
      metadata: {
        totalQuestions: questions.length,
        estimatedDuration: sessionConfig.duration,
        createdAt: new Date().toISOString()
      }
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Generate questions for session based on config
   */
  generateSessionQuestions(config) {
    const {
      role,
      company,
      difficulty,
      duration,
      questionTypes
    } = config;

    // Calculate question distribution based on duration
    const questionsPerMinute = 0.5;
    const totalQuestions = Math.floor(duration * questionsPerMinute);

    let questions = [];

    // Role-specific questions
    if (role) {
      const roleQuestions = this.questionManager.getQuestionsByRole(role, {
        difficulty,
        limit: Math.floor(totalQuestions * 0.6),
        shuffle: true
      });
      questions.push(...roleQuestions);
    }

    // Company-specific questions
    if (company) {
      const companyQuestions = this.questionManager.getQuestionsByCompany(company, {
        difficulty,
        limit: 3
      });
      questions.push(...companyQuestions);
    }

    // Fill remaining slots with general questions
    const remainingSlots = totalQuestions - questions.length;
    if (remainingSlots > 0) {
      const generalQuestions = this.questionManager.getQuestions({
        type: questionTypes,
        difficulty,
        limit: remainingSlots,
        shuffle: true
      });
      questions.push(...generalQuestions);
    }

    // Shuffle final question set
    return this.questionManager.shuffleArray(questions.slice(0, totalQuestions));
  }

  /**
   * Start an interview session
   */
  startSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'active';
    session.startTime = new Date().toISOString();
    
    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Pause an interview session
   */
  pauseSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'paused';
    session.pauseStartTime = new Date().toISOString();
    
    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Resume a paused session
   */
  resumeSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.pauseStartTime) {
      const pauseDuration = new Date() - new Date(session.pauseStartTime);
      session.pausedTime += pauseDuration;
      delete session.pauseStartTime;
    }

    session.status = 'active';
    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Submit a response for current question
   */
  submitResponse(sessionId, response) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) {
      throw new Error('No current question found');
    }

    const responseData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      response: response.text || response,
      timeSpent: response.timeSpent || 0,
      timestamp: new Date().toISOString(),
      audioBlob: response.audioBlob || null,
      skipped: response.skipped || false,
      metadata: {
        questionIndex: session.currentQuestionIndex,
        questionType: currentQuestion.type,
        questionDifficulty: currentQuestion.difficulty
      }
    };

    session.responses.push(responseData);
    session.currentQuestionIndex++;

    // Check if session is complete
    if (session.currentQuestionIndex >= session.questions.length) {
      session.status = 'completed';
      session.endTime = new Date().toISOString();
      this.saveSessionToHistory(session);
    }

    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Skip current question
   */
  skipQuestion(sessionId, timeSpent = 0) {
    return this.submitResponse(sessionId, {
      text: '[SKIPPED]',
      timeSpent,
      skipped: true
    });
  }

  /**
   * Complete session early
   */
  completeSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'completed';
    session.endTime = new Date().toISOString();
    
    this.saveSessionToHistory(session);
    this.activeSessions.delete(sessionId);
    
    return session;
  }

  /**
   * Abandon session
   */
  abandonSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'abandoned';
    session.endTime = new Date().toISOString();
    
    this.saveSessionToHistory(session);
    this.activeSessions.delete(sessionId);
    
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId) {
    return this.activeSessions.get(sessionId) || 
           this.sessionHistory.find(s => s.id === sessionId);
  }

  /**
   * Get all active sessions
   */
  getActiveSessions() {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Get session history
   */
  getSessionHistory(filters = {}) {
    let history = [...this.sessionHistory];

    // Filter by status
    if (filters.status) {
      history = history.filter(s => s.status === filters.status);
    }

    // Filter by date range
    if (filters.startDate) {
      history = history.filter(s => 
        new Date(s.metadata.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      history = history.filter(s => 
        new Date(s.metadata.createdAt) <= new Date(filters.endDate)
      );
    }

    // Filter by role
    if (filters.role) {
      history = history.filter(s => s.config.role === filters.role);
    }

    // Sort by creation date (newest first)
    history.sort((a, b) => 
      new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt)
    );

    return history;
  }

  /**
   * Calculate session statistics
   */
  calculateSessionStats(session) {
    const totalTime = session.endTime && session.startTime
      ? (new Date(session.endTime) - new Date(session.startTime) - session.pausedTime) / 1000
      : 0;

    const completedQuestions = session.responses.length;
    const skippedQuestions = session.responses.filter(r => r.skipped).length;
    const answeredQuestions = completedQuestions - skippedQuestions;

    const averageTimePerQuestion = answeredQuestions > 0
      ? session.responses
          .filter(r => !r.skipped)
          .reduce((sum, r) => sum + (r.timeSpent || 0), 0) / answeredQuestions
      : 0;

    const completionRate = (completedQuestions / session.questions.length) * 100;

    return {
      totalTime: Math.round(totalTime),
      totalTimeFormatted: this.formatTime(totalTime),
      completedQuestions,
      answeredQuestions,
      skippedQuestions,
      totalQuestions: session.questions.length,
      averageTimePerQuestion: Math.round(averageTimePerQuestion),
      completionRate: Math.round(completionRate),
      status: session.status,
      questionTypes: this.getQuestionTypeBreakdown(session.questions),
      difficultyBreakdown: this.getDifficultyBreakdown(session.questions)
    };
  }

  /**
   * Get question type breakdown
   */
  getQuestionTypeBreakdown(questions) {
    const breakdown = {};
    questions.forEach(q => {
      breakdown[q.type] = (breakdown[q.type] || 0) + 1;
    });
    return breakdown;
  }

  /**
   * Get difficulty breakdown
   */
  getDifficultyBreakdown(questions) {
    const breakdown = {};
    questions.forEach(q => {
      breakdown[q.difficulty] = (breakdown[q.difficulty] || 0) + 1;
    });
    return breakdown;
  }

  /**
   * Format time in seconds to MM:SS
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Save session to history
   */
  saveSessionToHistory(session) {
    // Remove from active sessions
    this.activeSessions.delete(session.id);
    
    // Add to history if not already there
    const existingIndex = this.sessionHistory.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      this.sessionHistory[existingIndex] = session;
    } else {
      this.sessionHistory.push(session);
    }

    // Keep only last 50 sessions
    if (this.sessionHistory.length > 50) {
      this.sessionHistory = this.sessionHistory
        .sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt))
        .slice(0, 50);
    }

    this.persistSessionHistory();
  }

  /**
   * Load session history from storage
   */
  loadSessionHistory() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('interview_session_history');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading session history:', error);
      return [];
    }
  }

  /**
   * Persist session history to storage
   */
  persistSessionHistory() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('interview_session_history', JSON.stringify(this.sessionHistory));
      }
    } catch (error) {
      console.error('Error persisting session history:', error);
    }
  }

  /**
   * Export session data
   */
  exportSession(sessionId, format = 'json') {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const stats = this.calculateSessionStats(session);
    const exportData = {
      session,
      statistics: stats,
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }

    // Add other formats as needed (CSV, PDF, etc.)
    return exportData;
  }

  /**
   * Clean up old sessions
   */
  cleanup() {
    // Remove sessions older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.sessionHistory = this.sessionHistory.filter(session =>
      new Date(session.metadata.createdAt) > thirtyDaysAgo
    );

    this.persistSessionHistory();
  }
}

export default InterviewSessionManager;