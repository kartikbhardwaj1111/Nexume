/**
 * Question Manager Service
 * Handles CRUD operations and filtering for interview questions
 */

import {
  technicalQuestions,
  behavioralQuestions,
  companyQuestions,
  situationalQuestions,
  industryQuestions,
  difficultyLevels,
  questionCategories,
  systemDesignQuestions,
  codingQuestions,
  productQuestions,
  leadershipQuestions
} from '../../data/interview-questions/questionDatabase.js';

import {
  extendedQuestionCollections
} from '../../data/interview-questions/extendedQuestions.js';

import {
  comprehensiveQuestions
} from '../../data/interview-questions/comprehensiveQuestions.js';

import {
  additionalQuestionCollections
} from '../../data/interview-questions/additionalQuestions.js';

class QuestionManager {
  constructor() {
    this.questions = this.initializeQuestions();
    this.customQuestions = this.loadCustomQuestions();
  }

  /**
   * Initialize all questions from the database
   */
  initializeQuestions() {
    const allQuestions = [];

    // Add technical questions
    Object.values(technicalQuestions).forEach(categoryQuestions => {
      allQuestions.push(...categoryQuestions);
    });

    // Add behavioral questions
    allQuestions.push(...behavioralQuestions);

    // Add company-specific questions
    Object.values(companyQuestions).forEach(companyQuestionList => {
      allQuestions.push(...companyQuestionList);
    });

    // Add situational questions
    allQuestions.push(...situationalQuestions);

    // Add industry-specific questions
    Object.values(industryQuestions).forEach(industryQuestionList => {
      allQuestions.push(...industryQuestionList);
    });

    // Add system design questions
    allQuestions.push(...systemDesignQuestions);

    // Add coding questions
    allQuestions.push(...codingQuestions);

    // Add product questions
    allQuestions.push(...productQuestions);

    // Add leadership questions
    allQuestions.push(...leadershipQuestions);

    // Add extended question collections
    Object.values(extendedQuestionCollections).forEach(collection => {
      if (Array.isArray(collection)) {
        allQuestions.push(...collection);
      } else {
        // Handle nested collections (like extendedIndustry)
        Object.values(collection).forEach(subCollection => {
          if (Array.isArray(subCollection)) {
            allQuestions.push(...subCollection);
          }
        });
      }
    });

    // Add comprehensive question collections
    Object.values(comprehensiveQuestions).forEach(collection => {
      if (Array.isArray(collection)) {
        allQuestions.push(...collection);
      }
    });

    // Add additional question collections
    Object.values(additionalQuestionCollections).forEach(collection => {
      if (Array.isArray(collection)) {
        allQuestions.push(...collection);
      } else {
        // Handle nested collections (like company-specific)
        Object.values(collection).forEach(subCollection => {
          if (Array.isArray(subCollection)) {
            allQuestions.push(...subCollection);
          }
        });
      }
    });

    return allQuestions;
  }

  /**
   * Load custom questions from local storage
   */
  loadCustomQuestions() {
    try {
      // Check if localStorage is available (browser environment)
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('interview_custom_questions');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading custom questions:', error);
      return [];
    }
  }

  /**
   * Save custom questions to local storage
   */
  saveCustomQuestions() {
    try {
      // Check if localStorage is available (browser environment)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('interview_custom_questions', JSON.stringify(this.customQuestions));
      }
    } catch (error) {
      console.error('Error saving custom questions:', error);
    }
  }

  /**
   * Get all questions with optional filtering
   */
  getQuestions(filters = {}) {
    const allQuestions = [...this.questions, ...this.customQuestions];

    return this.applyFilters(allQuestions, filters);
  }

  /**
   * Apply filters to question list
   */
  applyFilters(questions, filters) {
    let filteredQuestions = [...questions];

    // Filter by type
    if (filters.type && filters.type.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        filters.type.includes(q.type)
      );
    }

    // Filter by category
    if (filters.category && filters.category.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        filters.category.includes(q.category)
      );
    }

    // Filter by subcategory
    if (filters.subcategory && filters.subcategory.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        filters.subcategory.includes(q.subcategory)
      );
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        filters.difficulty.includes(q.difficulty)
      );
    }

    // Filter by company
    if (filters.company) {
      filteredQuestions = filteredQuestions.filter(q =>
        q.company === filters.company || !q.company
      );
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        q.tags && filters.tags.some(tag => q.tags.includes(tag))
      );
    }

    // Search in question text
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q =>
        q.question.toLowerCase().includes(searchTerm) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    // Limit results
    if (filters.limit) {
      filteredQuestions = filteredQuestions.slice(0, filters.limit);
    }

    // Shuffle for random selection
    if (filters.shuffle) {
      filteredQuestions = this.shuffleArray(filteredQuestions);
    }

    return filteredQuestions;
  }

  /**
   * Get questions by specific role/technology
   */
  getQuestionsByRole(role, options = {}) {
    const roleMapping = {
      'frontend-developer': ['frontend', 'javascript', 'react', 'css'],
      'backend-developer': ['backend', 'nodejs', 'database', 'api'],
      'fullstack-developer': ['frontend', 'backend', 'javascript', 'database'],
      'data-scientist': ['datascience', 'machine-learning', 'python', 'statistics'],
      'devops-engineer': ['devops', 'containers', 'cloud', 'automation'],
      'mobile-developer': ['mobile', 'ios', 'android', 'react-native'],
      'product-manager': ['product-thinking', 'strategy', 'analytics'],
      'engineering-manager': ['leadership', 'management', 'technical-leadership']
    };

    const roleTags = roleMapping[role] || [];

    const filters = {
      tags: roleTags,
      difficulty: options.difficulty || ['easy', 'medium', 'hard'],
      limit: options.limit || 50,
      shuffle: options.shuffle || false
    };

    return this.getQuestions(filters);
  }

  /**
   * Get questions by company
   */
  getQuestionsByCompany(company, options = {}) {
    const filters = {
      company: company.toLowerCase(),
      difficulty: options.difficulty || ['medium', 'hard'],
      limit: options.limit || 20
    };

    const companySpecific = this.getQuestions(filters);

    // Add general behavioral questions for company interviews
    const generalFilters = {
      type: ['behavioral', 'situational'],
      difficulty: options.difficulty || ['medium', 'hard'],
      limit: options.limit || 30,
      shuffle: true
    };

    const generalQuestions = this.getQuestions(generalFilters);

    return [...companySpecific, ...generalQuestions];
  }

  /**
   * Get questions by difficulty level
   */
  getQuestionsByDifficulty(difficulty, options = {}) {
    const filters = {
      difficulty: [difficulty],
      limit: options.limit || 25,
      shuffle: options.shuffle || false
    };

    return this.getQuestions(filters);
  }

  /**
   * Create a new custom question
   */
  createQuestion(questionData) {
    const newQuestion = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      type: questionData.type || 'custom',
      category: questionData.category || 'general',
      difficulty: questionData.difficulty || 'medium',
      question: questionData.question,
      evaluationCriteria: questionData.evaluationCriteria || [],
      tags: questionData.tags || [],
      isCustom: true,
      createdAt: new Date().toISOString(),
      ...questionData
    };

    this.customQuestions.push(newQuestion);
    this.saveCustomQuestions();

    return newQuestion;
  }

  /**
   * Update an existing custom question
   */
  updateQuestion(questionId, updates) {
    const questionIndex = this.customQuestions.findIndex(q => q.id === questionId);

    if (questionIndex === -1) {
      throw new Error('Question not found or cannot be updated');
    }

    this.customQuestions[questionIndex] = {
      ...this.customQuestions[questionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveCustomQuestions();
    return this.customQuestions[questionIndex];
  }

  /**
   * Delete a custom question
   */
  deleteQuestion(questionId) {
    const questionIndex = this.customQuestions.findIndex(q => q.id === questionId);

    if (questionIndex === -1) {
      throw new Error('Question not found or cannot be deleted');
    }

    const deletedQuestion = this.customQuestions.splice(questionIndex, 1)[0];
    this.saveCustomQuestions();

    return deletedQuestion;
  }

  /**
   * Get question by ID
   */
  getQuestionById(questionId) {
    const allQuestions = [...this.questions, ...this.customQuestions];
    return allQuestions.find(q => q.id === questionId);
  }

  /**
   * Get question statistics
   */
  getQuestionStats() {
    const allQuestions = [...this.questions, ...this.customQuestions];

    const stats = {
      total: allQuestions.length,
      byType: {},
      byDifficulty: {},
      byCategory: {},
      custom: this.customQuestions.length
    };

    allQuestions.forEach(question => {
      // Count by type
      stats.byType[question.type] = (stats.byType[question.type] || 0) + 1;

      // Count by difficulty
      stats.byDifficulty[question.difficulty] = (stats.byDifficulty[question.difficulty] || 0) + 1;

      // Count by category
      stats.byCategory[question.category] = (stats.byCategory[question.category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Generate interview question set
   */
  generateInterviewSet(config = {}) {
    const {
      role,
      company,
      difficulty = ['medium', 'hard'],
      duration = 60, // minutes
      questionTypes = ['technical', 'behavioral', 'situational']
    } = config;

    // Calculate question distribution based on duration
    const questionsPerMinute = 0.5; // Rough estimate
    const totalQuestions = Math.floor(duration * questionsPerMinute);

    const distribution = {
      technical: Math.floor(totalQuestions * 0.6),
      behavioral: Math.floor(totalQuestions * 0.3),
      situational: Math.floor(totalQuestions * 0.1)
    };

    const interviewSet = [];

    // Add technical questions if role specified
    if (role && questionTypes.includes('technical')) {
      const technicalQs = this.getQuestionsByRole(role, {
        difficulty,
        limit: distribution.technical,
        shuffle: true
      });
      interviewSet.push(...technicalQs.slice(0, distribution.technical));
    }

    // Add behavioral questions
    if (questionTypes.includes('behavioral')) {
      const behavioralQs = this.getQuestions({
        type: ['behavioral'],
        difficulty,
        limit: distribution.behavioral,
        shuffle: true
      });
      interviewSet.push(...behavioralQs);
    }

    // Add situational questions
    if (questionTypes.includes('situational')) {
      const situationalQs = this.getQuestions({
        type: ['situational'],
        difficulty,
        limit: distribution.situational,
        shuffle: true
      });
      interviewSet.push(...situationalQs);
    }

    // Add company-specific questions if specified
    if (company) {
      const companyQs = this.getQuestionsByCompany(company, {
        difficulty,
        limit: 3
      });
      interviewSet.push(...companyQs.slice(0, 3));
    }

    return {
      questions: this.shuffleArray(interviewSet),
      metadata: {
        totalQuestions: interviewSet.length,
        estimatedDuration: duration,
        difficulty,
        role,
        company,
        distribution
      }
    };
  }

  /**
   * Get available filter options
   */
  getFilterOptions() {
    return {
      types: Object.keys(questionCategories),
      categories: questionCategories,
      difficulties: Object.keys(difficultyLevels),
      companies: Object.keys(companyQuestions),
      roles: [
        'frontend-developer',
        'backend-developer',
        'fullstack-developer',
        'data-scientist',
        'devops-engineer',
        'mobile-developer',
        'product-manager',
        'engineering-manager'
      ]
    };
  }

  /**
   * Utility function to shuffle array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Export questions to JSON
   */
  exportQuestions(filters = {}) {
    const questions = this.getQuestions(filters);
    const exportData = {
      questions,
      metadata: {
        exportDate: new Date().toISOString(),
        totalQuestions: questions.length,
        filters
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import questions from JSON
   */
  importQuestions(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      const importedQuestions = data.questions || data;

      const validQuestions = importedQuestions.filter(q =>
        q.question && q.type && q.category
      );

      validQuestions.forEach(question => {
        this.createQuestion(question);
      });

      return {
        success: true,
        imported: validQuestions.length,
        total: importedQuestions.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default QuestionManager;