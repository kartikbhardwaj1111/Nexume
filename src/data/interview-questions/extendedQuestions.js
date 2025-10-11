/**
 * Extended Interview Questions Database
 * Additional questions to reach 1000+ comprehensive collection
 */

// Mobile Development Questions
export const mobileQuestions = [
  {
    id: 'mob_001',
    type: 'technical',
    category: 'mobile',
    subcategory: 'ios',
    difficulty: 'medium',
    question: 'Explain the iOS app lifecycle. What happens when an app moves between foreground and background?',
    evaluationCriteria: [
      'Understanding of app states',
      'Lifecycle method knowledge',
      'Memory management',
      'Background processing'
    ],
    tags: ['ios', 'app-lifecycle', 'memory-management', 'background-processing']
  },
  {
    id: 'mob_002',
    type: 'technical',
    category: 'mobile',
    subcategory: 'android',
    difficulty: 'medium',
    question: 'What is the difference between Activity and Fragment in Android? When would you use each?',
    evaluationCriteria: [
      'Component understanding',
      'Lifecycle differences',
      'Use case scenarios',
      'Best practices'
    ],
    tags: ['android', 'activity', 'fragment', 'architecture']
  },
  {
    id: 'mob_003',
    type: 'technical',
    category: 'mobile',
    subcategory: 'react-native',
    difficulty: 'hard',
    question: 'How does React Native bridge work? What are the performance implications?',
    evaluationCriteria: [
      'Bridge architecture understanding',
      'Performance considerations',
      'Native module integration',
      'Optimization strategies'
    ],
    tags: ['react-native', 'bridge', 'performance', 'native-modules']
  }
];

// Cloud and Infrastructure Questions
export const cloudQuestions = [
  {
    id: 'cloud_001',
    type: 'technical',
    category: 'cloud',
    subcategory: 'aws',
    difficulty: 'medium',
    question: 'Explain the difference between EC2, ECS, and Lambda. When would you use each?',
    evaluationCriteria: [
      'Service understanding',
      'Use case scenarios',
      'Cost considerations',
      'Scalability factors'
    ],
    tags: ['aws', 'ec2', 'ecs', 'lambda', 'serverless']
  },
  {
    id: 'cloud_002',
    type: 'technical',
    category: 'cloud',
    subcategory: 'kubernetes',
    difficulty: 'hard',
    question: 'How do you handle service discovery and load balancing in Kubernetes?',
    evaluationCriteria: [
      'Kubernetes networking',
      'Service types understanding',
      'Ingress controllers',
      'Load balancing strategies'
    ],
    tags: ['kubernetes', 'service-discovery', 'load-balancing', 'networking']
  }
];

// Security Questions
export const securityQuestions = [
  {
    id: 'sec_001',
    type: 'technical',
    category: 'security',
    subcategory: 'web-security',
    difficulty: 'medium',
    question: 'What is CORS and why is it important? How do you configure it properly?',
    evaluationCriteria: [
      'CORS understanding',
      'Security implications',
      'Configuration methods',
      'Best practices'
    ],
    tags: ['cors', 'web-security', 'browser-security', 'api-security']
  },
  {
    id: 'sec_002',
    type: 'technical',
    category: 'security',
    subcategory: 'authentication',
    difficulty: 'hard',
    question: 'Compare JWT tokens vs session-based authentication. What are the security trade-offs?',
    evaluationCriteria: [
      'Authentication methods',
      'Security considerations',
      'Scalability factors',
      'Implementation details'
    ],
    tags: ['jwt', 'sessions', 'authentication', 'security', 'scalability']
  }
];

// Database Questions
export const databaseQuestions = [
  {
    id: 'db_001',
    type: 'technical',
    category: 'database',
    subcategory: 'sql',
    difficulty: 'medium',
    question: 'Explain database indexing. How do you decide which columns to index?',
    evaluationCriteria: [
      'Index types understanding',
      'Performance implications',
      'Query optimization',
      'Trade-offs analysis'
    ],
    tags: ['sql', 'indexing', 'performance', 'query-optimization']
  },
  {
    id: 'db_002',
    type: 'technical',
    category: 'database',
    subcategory: 'nosql',
    difficulty: 'hard',
    question: 'When would you choose MongoDB over PostgreSQL? What are the trade-offs?',
    evaluationCriteria: [
      'Database types comparison',
      'Use case analysis',
      'Scalability considerations',
      'Consistency models'
    ],
    tags: ['mongodb', 'postgresql', 'nosql', 'database-design']
  }
];

// Machine Learning Questions
export const mlQuestions = [
  {
    id: 'ml_001',
    type: 'technical',
    category: 'machine-learning',
    subcategory: 'algorithms',
    difficulty: 'medium',
    question: 'Explain the difference between supervised and unsupervised learning with examples.',
    evaluationCriteria: [
      'Learning paradigms understanding',
      'Algorithm examples',
      'Use case scenarios',
      'Practical applications'
    ],
    tags: ['supervised-learning', 'unsupervised-learning', 'algorithms', 'classification']
  },
  {
    id: 'ml_002',
    type: 'technical',
    category: 'machine-learning',
    subcategory: 'deep-learning',
    difficulty: 'hard',
    question: 'How do you prevent overfitting in neural networks? Explain different regularization techniques.',
    evaluationCriteria: [
      'Overfitting understanding',
      'Regularization techniques',
      'Implementation knowledge',
      'Performance evaluation'
    ],
    tags: ['deep-learning', 'overfitting', 'regularization', 'neural-networks']
  }
];

// Additional Behavioral Questions by Category
export const extendedBehavioralQuestions = [
  // Time Management
  {
    id: 'bh_time_001',
    type: 'behavioral',
    category: 'time-management',
    difficulty: 'medium',
    question: 'Tell me about a time when you had to manage multiple competing priorities. How did you handle it?',
    evaluationCriteria: [
      'Prioritization skills',
      'Time management',
      'Stress handling',
      'Results delivery'
    ],
    starFramework: {
      situation: 'Multiple competing deadlines',
      task: 'Priority management challenge',
      action: 'Prioritization and execution strategy',
      result: 'Successful delivery outcomes'
    },
    tags: ['time-management', 'prioritization', 'multitasking', 'stress-management']
  },
  
  // Customer Focus
  {
    id: 'bh_customer_001',
    type: 'behavioral',
    category: 'customer-focus',
    difficulty: 'medium',
    question: 'Describe a situation where you had to advocate for the customer against internal pressure.',
    evaluationCriteria: [
      'Customer advocacy',
      'Stakeholder management',
      'Decision-making courage',
      'Long-term thinking'
    ],
    starFramework: {
      situation: 'Customer vs internal conflict',
      task: 'Advocacy challenge',
      action: 'Customer-focused approach',
      result: 'Customer satisfaction outcome'
    },
    tags: ['customer-focus', 'advocacy', 'stakeholder-management', 'decision-making']
  },

  // Mentorship
  {
    id: 'bh_mentor_001',
    type: 'behavioral',
    category: 'mentorship',
    difficulty: 'medium',
    question: 'Tell me about a time when you mentored someone. What was your approach and what was the outcome?',
    evaluationCriteria: [
      'Mentoring approach',
      'Teaching skills',
      'Patience and empathy',
      'Development outcomes'
    ],
    starFramework: {
      situation: 'Mentoring opportunity',
      task: 'Development goals',
      action: 'Mentoring strategy',
      result: 'Mentee growth and success'
    },
    tags: ['mentorship', 'teaching', 'leadership', 'development']
  }
];

// Industry-Specific Questions Extended
export const extendedIndustryQuestions = {
  ecommerce: [
    {
      id: 'ecom_001',
      type: 'industry-specific',
      category: 'ecommerce',
      difficulty: 'medium',
      question: 'How would you design a recommendation system for an e-commerce platform?',
      evaluationCriteria: [
        'Recommendation algorithms',
        'Data collection strategies',
        'Personalization approaches',
        'Performance metrics'
      ],
      tags: ['ecommerce', 'recommendations', 'personalization', 'algorithms']
    }
  ],
  
  gaming: [
    {
      id: 'game_001',
      type: 'industry-specific',
      category: 'gaming',
      difficulty: 'hard',
      question: 'How do you handle real-time multiplayer synchronization in online games?',
      evaluationCriteria: [
        'Network programming',
        'Latency handling',
        'State synchronization',
        'Cheat prevention'
      ],
      tags: ['gaming', 'multiplayer', 'networking', 'real-time']
    }
  ],

  education: [
    {
      id: 'edu_001',
      type: 'industry-specific',
      category: 'education',
      difficulty: 'medium',
      question: 'How would you design an adaptive learning system that adjusts to individual student needs?',
      evaluationCriteria: [
        'Learning theory understanding',
        'Adaptive algorithms',
        'User experience design',
        'Progress tracking'
      ],
      tags: ['education', 'adaptive-learning', 'personalization', 'learning-theory']
    }
  ]
};

// Startup and Scale-up Questions
export const startupQuestions = [
  {
    id: 'startup_001',
    type: 'startup',
    category: 'growth',
    difficulty: 'hard',
    question: 'How do you balance technical debt with feature development in a fast-growing startup?',
    evaluationCriteria: [
      'Technical debt understanding',
      'Business priority balance',
      'Risk assessment',
      'Long-term planning'
    ],
    tags: ['startup', 'technical-debt', 'growth', 'prioritization']
  },
  {
    id: 'startup_002',
    type: 'startup',
    category: 'scaling',
    difficulty: 'hard',
    question: 'Your application suddenly gets 10x more traffic. Walk me through your scaling strategy.',
    evaluationCriteria: [
      'Scaling strategies',
      'Performance monitoring',
      'Infrastructure planning',
      'Crisis management'
    ],
    tags: ['scaling', 'performance', 'infrastructure', 'growth']
  }
];

// Remote Work Questions
export const remoteWorkQuestions = [
  {
    id: 'remote_001',
    type: 'behavioral',
    category: 'remote-work',
    difficulty: 'medium',
    question: 'How do you maintain productivity and collaboration while working remotely?',
    evaluationCriteria: [
      'Self-management skills',
      'Communication strategies',
      'Collaboration tools usage',
      'Work-life balance'
    ],
    tags: ['remote-work', 'productivity', 'collaboration', 'self-management']
  }
];

// Ethics and AI Questions
export const ethicsQuestions = [
  {
    id: 'ethics_001',
    type: 'ethics',
    category: 'ai-ethics',
    difficulty: 'hard',
    question: 'How do you ensure fairness and prevent bias in machine learning models?',
    evaluationCriteria: [
      'Bias understanding',
      'Fairness metrics',
      'Ethical considerations',
      'Mitigation strategies'
    ],
    tags: ['ethics', 'ai-bias', 'fairness', 'responsible-ai']
  }
];

// Performance and Optimization Questions
export const performanceQuestions = [
  {
    id: 'perf_001',
    type: 'technical',
    category: 'performance',
    subcategory: 'web-performance',
    difficulty: 'medium',
    question: 'What are Core Web Vitals and how do you optimize for them?',
    evaluationCriteria: [
      'Web performance metrics',
      'Optimization techniques',
      'Measurement tools',
      'User experience impact'
    ],
    tags: ['web-performance', 'core-web-vitals', 'optimization', 'user-experience']
  }
];

// Testing Questions
export const testingQuestions = [
  {
    id: 'test_001',
    type: 'technical',
    category: 'testing',
    subcategory: 'test-strategy',
    difficulty: 'medium',
    question: 'How do you design a comprehensive testing strategy for a new feature?',
    evaluationCriteria: [
      'Testing pyramid understanding',
      'Test planning',
      'Coverage strategies',
      'Quality assurance'
    ],
    tags: ['testing', 'test-strategy', 'quality-assurance', 'test-planning']
  }
];

// Export all extended collections
export const extendedQuestionCollections = {
  mobile: mobileQuestions,
  cloud: cloudQuestions,
  security: securityQuestions,
  database: databaseQuestions,
  machineLearning: mlQuestions,
  extendedBehavioral: extendedBehavioralQuestions,
  extendedIndustry: extendedIndustryQuestions,
  startup: startupQuestions,
  remoteWork: remoteWorkQuestions,
  ethics: ethicsQuestions,
  performance: performanceQuestions,
  testing: testingQuestions
};