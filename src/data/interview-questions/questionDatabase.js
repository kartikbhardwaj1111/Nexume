/**
 * Interview Question Database
 * Comprehensive collection of interview questions categorized by type, role, and difficulty
 */

// Technical Questions by Role/Technology
export const technicalQuestions = {
  // Frontend Development
  frontend: [
    {
      id: 'fe_001',
      type: 'technical',
      category: 'frontend',
      subcategory: 'react',
      difficulty: 'medium',
      question: 'Explain the difference between useState and useReducer hooks in React. When would you use each?',
      evaluationCriteria: [
        'Understanding of hook fundamentals',
        'Knowledge of state management patterns',
        'Ability to explain use cases',
        'Code examples or practical scenarios'
      ],
      expectedAnswer: 'useState for simple state, useReducer for complex state logic with multiple sub-values or when next state depends on previous one',
      tags: ['react', 'hooks', 'state-management']
    },
    {
      id: 'fe_002',
      type: 'technical',
      category: 'frontend',
      subcategory: 'javascript',
      difficulty: 'hard',
      question: 'What is the event loop in JavaScript? How does it handle asynchronous operations?',
      evaluationCriteria: [
        'Understanding of call stack',
        'Knowledge of callback queue',
        'Explanation of microtasks vs macrotasks',
        'Real-world examples'
      ],
      expectedAnswer: 'Event loop manages execution of code, handles async operations through callback queue and microtask queue',
      tags: ['javascript', 'async', 'event-loop', 'performance']
    },
    {
      id: 'fe_003',
      type: 'technical',
      category: 'frontend',
      subcategory: 'css',
      difficulty: 'medium',
      question: 'Explain CSS Grid vs Flexbox. When would you use each layout system?',
      evaluationCriteria: [
        'Understanding of 1D vs 2D layouts',
        'Knowledge of use cases',
        'Practical examples',
        'Browser support considerations'
      ],
      expectedAnswer: 'Flexbox for 1D layouts (rows or columns), Grid for 2D layouts (rows and columns)',
      tags: ['css', 'layout', 'grid', 'flexbox']
    }
  ],

  // Backend Development
  backend: [
    {
      id: 'be_001',
      type: 'technical',
      category: 'backend',
      subcategory: 'nodejs',
      difficulty: 'medium',
      question: 'How does Node.js handle concurrent requests with its single-threaded architecture?',
      evaluationCriteria: [
        'Understanding of event-driven architecture',
        'Knowledge of libuv and thread pool',
        'Explanation of non-blocking I/O',
        'Performance implications'
      ],
      expectedAnswer: 'Uses event loop and libuv for non-blocking I/O operations, thread pool for CPU-intensive tasks',
      tags: ['nodejs', 'concurrency', 'event-loop', 'performance']
    },
    {
      id: 'be_002',
      type: 'technical',
      category: 'backend',
      subcategory: 'database',
      difficulty: 'hard',
      question: 'Explain ACID properties in database transactions. Provide examples of each.',
      evaluationCriteria: [
        'Definition of each ACID property',
        'Real-world examples',
        'Understanding of transaction isolation',
        'Knowledge of consistency models'
      ],
      expectedAnswer: 'Atomicity, Consistency, Isolation, Durability - ensures reliable database transactions',
      tags: ['database', 'transactions', 'acid', 'consistency']
    }
  ],

  // Data Science
  datascience: [
    {
      id: 'ds_001',
      type: 'technical',
      category: 'datascience',
      subcategory: 'machine-learning',
      difficulty: 'medium',
      question: 'Explain the bias-variance tradeoff in machine learning. How do you address high bias vs high variance?',
      evaluationCriteria: [
        'Understanding of bias and variance concepts',
        'Knowledge of overfitting/underfitting',
        'Practical solutions and techniques',
        'Model evaluation methods'
      ],
      expectedAnswer: 'Bias: error from oversimplified assumptions, Variance: error from sensitivity to small fluctuations',
      tags: ['machine-learning', 'bias-variance', 'overfitting', 'model-evaluation']
    }
  ],

  // DevOps
  devops: [
    {
      id: 'do_001',
      type: 'technical',
      category: 'devops',
      subcategory: 'containers',
      difficulty: 'medium',
      question: 'What are the advantages of using Docker containers over virtual machines?',
      evaluationCriteria: [
        'Understanding of containerization',
        'Knowledge of resource efficiency',
        'Deployment and scaling benefits',
        'Security considerations'
      ],
      expectedAnswer: 'Lightweight, faster startup, better resource utilization, consistent environments',
      tags: ['docker', 'containers', 'virtualization', 'deployment']
    }
  ]
};

// Behavioral Questions using STAR method
export const behavioralQuestions = [
  {
    id: 'bh_001',
    type: 'behavioral',
    category: 'leadership',
    difficulty: 'medium',
    question: 'Tell me about a time when you had to lead a team through a challenging project. How did you handle it?',
    evaluationCriteria: [
      'Clear situation description',
      'Specific task/challenge identified',
      'Actions taken as a leader',
      'Measurable results achieved',
      'Leadership skills demonstrated'
    ],
    starFramework: {
      situation: 'Context and background',
      task: 'Specific challenge or goal',
      action: 'Steps taken to address the situation',
      result: 'Outcome and lessons learned'
    },
    tags: ['leadership', 'teamwork', 'project-management', 'problem-solving']
  },
  {
    id: 'bh_002',
    type: 'behavioral',
    category: 'problem-solving',
    difficulty: 'medium',
    question: 'Describe a situation where you had to solve a complex technical problem under tight deadlines.',
    evaluationCriteria: [
      'Problem complexity understanding',
      'Systematic approach to solution',
      'Time management skills',
      'Technical decision-making',
      'Results and impact'
    ],
    starFramework: {
      situation: 'Technical challenge context',
      task: 'Deadline and requirements',
      action: 'Problem-solving approach',
      result: 'Solution effectiveness'
    },
    tags: ['problem-solving', 'technical-skills', 'time-management', 'pressure']
  },
  {
    id: 'bh_003',
    type: 'behavioral',
    category: 'communication',
    difficulty: 'easy',
    question: 'Give me an example of when you had to explain a complex technical concept to a non-technical stakeholder.',
    evaluationCriteria: [
      'Audience awareness',
      'Simplification techniques',
      'Communication clarity',
      'Feedback incorporation',
      'Successful outcome'
    ],
    starFramework: {
      situation: 'Technical concept and audience',
      task: 'Communication challenge',
      action: 'Explanation approach',
      result: 'Understanding achieved'
    },
    tags: ['communication', 'technical-explanation', 'stakeholder-management']
  }
];

// Company-specific Questions
export const companyQuestions = {
  google: [
    {
      id: 'goog_001',
      type: 'company-specific',
      category: 'culture',
      company: 'Google',
      difficulty: 'medium',
      question: 'How would you improve Google Search for users in developing countries with limited internet connectivity?',
      evaluationCriteria: [
        'Understanding of user constraints',
        'Technical solution creativity',
        'Scalability considerations',
        'Impact measurement'
      ],
      tags: ['product-thinking', 'accessibility', 'global-impact', 'optimization']
    }
  ],
  microsoft: [
    {
      id: 'msft_001',
      type: 'company-specific',
      category: 'culture',
      company: 'Microsoft',
      difficulty: 'medium',
      question: 'How does Microsoft\'s mission to "empower every person and organization on the planet to achieve more" align with your career goals?',
      evaluationCriteria: [
        'Understanding of company mission',
        'Personal alignment demonstration',
        'Specific examples',
        'Future contribution potential'
      ],
      tags: ['company-culture', 'mission-alignment', 'career-goals']
    }
  ],
  amazon: [
    {
      id: 'amzn_001',
      type: 'company-specific',
      category: 'leadership-principles',
      company: 'Amazon',
      difficulty: 'hard',
      question: 'Give me an example of when you had to make a decision with incomplete information. How did you apply "Bias for Action"?',
      evaluationCriteria: [
        'Understanding of Amazon LP',
        'Decision-making under uncertainty',
        'Risk assessment',
        'Action-oriented approach',
        'Learning from outcomes'
      ],
      tags: ['leadership-principles', 'decision-making', 'bias-for-action', 'uncertainty']
    }
  ]
};

// Situational Questions
export const situationalQuestions = [
  {
    id: 'sit_001',
    type: 'situational',
    category: 'conflict-resolution',
    difficulty: 'medium',
    question: 'How would you handle a situation where two team members have conflicting approaches to solving a critical bug?',
    evaluationCriteria: [
      'Conflict resolution skills',
      'Technical decision-making',
      'Team dynamics understanding',
      'Communication approach',
      'Solution-oriented thinking'
    ],
    tags: ['conflict-resolution', 'teamwork', 'technical-decisions', 'leadership']
  },
  {
    id: 'sit_002',
    type: 'situational',
    category: 'prioritization',
    difficulty: 'hard',
    question: 'You have three high-priority tasks due today, but you can only complete two. How do you decide which one to postpone?',
    evaluationCriteria: [
      'Prioritization framework',
      'Stakeholder consideration',
      'Impact assessment',
      'Communication strategy',
      'Risk evaluation'
    ],
    tags: ['prioritization', 'time-management', 'decision-making', 'stakeholder-management']
  }
];

// Industry-specific Questions
export const industryQuestions = {
  fintech: [
    {
      id: 'fin_001',
      type: 'industry-specific',
      category: 'fintech',
      difficulty: 'hard',
      question: 'How would you design a system to detect fraudulent transactions in real-time while minimizing false positives?',
      evaluationCriteria: [
        'Understanding of fraud patterns',
        'Real-time processing knowledge',
        'Machine learning applications',
        'System architecture design',
        'Performance considerations'
      ],
      tags: ['fraud-detection', 'real-time-systems', 'machine-learning', 'fintech']
    }
  ],
  healthcare: [
    {
      id: 'health_001',
      type: 'industry-specific',
      category: 'healthcare',
      difficulty: 'medium',
      question: 'What considerations would you make when developing a patient data management system regarding HIPAA compliance?',
      evaluationCriteria: [
        'HIPAA knowledge',
        'Data security understanding',
        'Privacy by design principles',
        'Audit trail requirements',
        'Access control mechanisms'
      ],
      tags: ['hipaa', 'data-privacy', 'healthcare', 'compliance', 'security']
    }
  ]
};

// Question difficulty levels
export const difficultyLevels = {
  easy: {
    level: 1,
    description: 'Basic concepts, entry-level knowledge',
    timeAllocation: '5-10 minutes',
    expectedDepth: 'Surface-level understanding with basic examples'
  },
  medium: {
    level: 2,
    description: 'Intermediate concepts, practical application',
    timeAllocation: '10-15 minutes',
    expectedDepth: 'Good understanding with practical examples and trade-offs'
  },
  hard: {
    level: 3,
    description: 'Advanced concepts, system design, complex scenarios',
    timeAllocation: '15-25 minutes',
    expectedDepth: 'Deep understanding with multiple approaches and edge cases'
  }
};

// Question categories for filtering
export const questionCategories = {
  technical: {
    subcategories: ['frontend', 'backend', 'datascience', 'devops', 'mobile', 'security']
  },
  behavioral: {
    subcategories: ['leadership', 'teamwork', 'communication', 'problem-solving', 'adaptability']
  },
  situational: {
    subcategories: ['conflict-resolution', 'prioritization', 'decision-making', 'crisis-management']
  },
  'company-specific': {
    subcategories: ['culture', 'values', 'leadership-principles', 'product-thinking']
  },
  'industry-specific': {
    subcategories: ['fintech', 'healthcare', 'ecommerce', 'gaming', 'education']
  }
};

// Additional Technical Questions - Frontend
technicalQuestions.frontend.push(
  {
    id: 'fe_004',
    type: 'technical',
    category: 'frontend',
    subcategory: 'performance',
    difficulty: 'hard',
    question: 'How would you optimize the performance of a React application that renders large lists?',
    evaluationCriteria: [
      'Understanding of virtualization',
      'Knowledge of React.memo and useMemo',
      'Lazy loading techniques',
      'Bundle optimization strategies'
    ],
    expectedAnswer: 'Use virtualization, memoization, code splitting, and lazy loading',
    tags: ['react', 'performance', 'optimization', 'virtualization']
  },
  {
    id: 'fe_005',
    type: 'technical',
    category: 'frontend',
    subcategory: 'testing',
    difficulty: 'medium',
    question: 'What is the difference between unit tests, integration tests, and end-to-end tests in frontend development?',
    evaluationCriteria: [
      'Understanding of testing pyramid',
      'Knowledge of testing tools',
      'Test scope and purpose',
      'Best practices'
    ],
    expectedAnswer: 'Unit: individual components, Integration: component interactions, E2E: full user flows',
    tags: ['testing', 'jest', 'cypress', 'quality-assurance']
  },
  {
    id: 'fe_006',
    type: 'technical',
    category: 'frontend',
    subcategory: 'accessibility',
    difficulty: 'medium',
    question: 'How do you ensure your web application is accessible to users with disabilities?',
    evaluationCriteria: [
      'WCAG guidelines knowledge',
      'ARIA attributes usage',
      'Keyboard navigation',
      'Screen reader compatibility'
    ],
    expectedAnswer: 'Follow WCAG guidelines, use semantic HTML, ARIA labels, keyboard navigation',
    tags: ['accessibility', 'wcag', 'aria', 'inclusive-design']
  }
);

// Additional Technical Questions - Backend
technicalQuestions.backend.push(
  {
    id: 'be_003',
    type: 'technical',
    category: 'backend',
    subcategory: 'api-design',
    difficulty: 'medium',
    question: 'What are the principles of RESTful API design? How do you handle versioning?',
    evaluationCriteria: [
      'REST principles understanding',
      'HTTP methods usage',
      'Status codes knowledge',
      'Versioning strategies'
    ],
    expectedAnswer: 'Stateless, resource-based URLs, HTTP methods, proper status codes, versioning via headers or URLs',
    tags: ['rest', 'api-design', 'http', 'versioning']
  },
  {
    id: 'be_004',
    type: 'technical',
    category: 'backend',
    subcategory: 'security',
    difficulty: 'hard',
    question: 'How do you prevent SQL injection attacks? What other security vulnerabilities should you consider?',
    evaluationCriteria: [
      'SQL injection prevention',
      'OWASP Top 10 knowledge',
      'Authentication/authorization',
      'Input validation'
    ],
    expectedAnswer: 'Parameterized queries, input validation, authentication, HTTPS, CSRF protection',
    tags: ['security', 'sql-injection', 'owasp', 'authentication']
  },
  {
    id: 'be_005',
    type: 'technical',
    category: 'backend',
    subcategory: 'microservices',
    difficulty: 'hard',
    question: 'What are the trade-offs between microservices and monolithic architecture?',
    evaluationCriteria: [
      'Architecture patterns understanding',
      'Scalability considerations',
      'Complexity management',
      'Deployment strategies'
    ],
    expectedAnswer: 'Microservices: scalability, complexity; Monolith: simplicity, performance',
    tags: ['microservices', 'architecture', 'scalability', 'deployment']
  }
);

// Additional Behavioral Questions
behavioralQuestions.push(
  {
    id: 'bh_004',
    type: 'behavioral',
    category: 'adaptability',
    difficulty: 'medium',
    question: 'Tell me about a time when you had to quickly learn a new technology or framework for a project.',
    evaluationCriteria: [
      'Learning approach',
      'Time management',
      'Resource utilization',
      'Application of knowledge',
      'Results achieved'
    ],
    starFramework: {
      situation: 'New technology requirement',
      task: 'Learning timeline and goals',
      action: 'Learning strategy and execution',
      result: 'Successful implementation'
    },
    tags: ['learning', 'adaptability', 'technology', 'self-development']
  },
  {
    id: 'bh_005',
    type: 'behavioral',
    category: 'teamwork',
    difficulty: 'medium',
    question: 'Describe a situation where you had to work with a difficult team member. How did you handle it?',
    evaluationCriteria: [
      'Interpersonal skills',
      'Conflict resolution',
      'Professional approach',
      'Team dynamics',
      'Positive outcome'
    ],
    starFramework: {
      situation: 'Difficult team member context',
      task: 'Team collaboration challenge',
      action: 'Approach to resolution',
      result: 'Improved working relationship'
    },
    tags: ['teamwork', 'conflict-resolution', 'interpersonal-skills', 'collaboration']
  },
  {
    id: 'bh_006',
    type: 'behavioral',
    category: 'innovation',
    difficulty: 'hard',
    question: 'Give me an example of when you proposed and implemented an innovative solution to improve a process or product.',
    evaluationCriteria: [
      'Creative thinking',
      'Problem identification',
      'Solution development',
      'Implementation strategy',
      'Measurable impact'
    ],
    starFramework: {
      situation: 'Process or product limitation',
      task: 'Innovation opportunity',
      action: 'Solution design and implementation',
      result: 'Improvement metrics'
    },
    tags: ['innovation', 'creativity', 'process-improvement', 'impact']
  }
);

// Additional Company Questions
companyQuestions.apple = [
  {
    id: 'aapl_001',
    type: 'company-specific',
    category: 'design',
    company: 'Apple',
    difficulty: 'medium',
    question: 'How would you design a feature that maintains Apple\'s focus on simplicity while adding powerful functionality?',
    evaluationCriteria: [
      'Design thinking',
      'User experience focus',
      'Simplicity principles',
      'Feature prioritization'
    ],
    tags: ['design', 'user-experience', 'simplicity', 'product-thinking']
  }
];

companyQuestions.netflix = [
  {
    id: 'nflx_001',
    type: 'company-specific',
    category: 'culture',
    company: 'Netflix',
    difficulty: 'medium',
    question: 'How do you embody Netflix\'s culture of "Freedom and Responsibility" in your work?',
    evaluationCriteria: [
      'Cultural understanding',
      'Self-management skills',
      'Accountability demonstration',
      'Decision-making autonomy'
    ],
    tags: ['culture', 'autonomy', 'responsibility', 'self-management']
  }
];

// Additional Situational Questions
situationalQuestions.push(
  {
    id: 'sit_003',
    type: 'situational',
    category: 'crisis-management',
    difficulty: 'hard',
    question: 'Your production system is down during peak hours. Walk me through your response process.',
    evaluationCriteria: [
      'Incident response process',
      'Prioritization under pressure',
      'Communication strategy',
      'Problem-solving approach',
      'Post-incident analysis'
    ],
    tags: ['crisis-management', 'incident-response', 'production-issues', 'communication']
  },
  {
    id: 'sit_004',
    type: 'situational',
    category: 'stakeholder-management',
    difficulty: 'medium',
    question: 'How would you handle a situation where business stakeholders want a feature that you believe is technically unfeasible?',
    evaluationCriteria: [
      'Technical communication',
      'Alternative solutions',
      'Stakeholder alignment',
      'Compromise strategies',
      'Professional approach'
    ],
    tags: ['stakeholder-management', 'technical-communication', 'negotiation', 'problem-solving']
  }
);

// System Design Questions
export const systemDesignQuestions = [
  {
    id: 'sd_001',
    type: 'system-design',
    category: 'scalability',
    difficulty: 'hard',
    question: 'Design a URL shortening service like bit.ly. How would you handle 100 million URLs per day?',
    evaluationCriteria: [
      'System architecture design',
      'Database design',
      'Scalability considerations',
      'Caching strategies',
      'Load balancing'
    ],
    expectedAnswer: 'Distributed system with load balancers, database sharding, caching, CDN',
    tags: ['system-design', 'scalability', 'distributed-systems', 'databases']
  },
  {
    id: 'sd_002',
    type: 'system-design',
    category: 'real-time',
    difficulty: 'hard',
    question: 'Design a real-time chat application that supports millions of users.',
    evaluationCriteria: [
      'Real-time communication protocols',
      'Message delivery guarantees',
      'Scalability architecture',
      'Data consistency',
      'Performance optimization'
    ],
    expectedAnswer: 'WebSocket connections, message queues, horizontal scaling, eventual consistency',
    tags: ['system-design', 'real-time', 'websockets', 'messaging', 'scalability']
  }
];

// Coding Challenge Questions
export const codingQuestions = [
  {
    id: 'code_001',
    type: 'coding',
    category: 'algorithms',
    difficulty: 'medium',
    question: 'Implement a function to find the longest palindromic substring in a given string.',
    evaluationCriteria: [
      'Algorithm efficiency',
      'Code clarity',
      'Edge case handling',
      'Time/space complexity analysis'
    ],
    expectedComplexity: 'O(n²) time, O(1) space',
    tags: ['algorithms', 'strings', 'palindrome', 'optimization']
  },
  {
    id: 'code_002',
    type: 'coding',
    category: 'data-structures',
    difficulty: 'hard',
    question: 'Implement a LRU (Least Recently Used) cache with O(1) get and put operations.',
    evaluationCriteria: [
      'Data structure choice',
      'Implementation correctness',
      'Complexity requirements',
      'Code organization'
    ],
    expectedComplexity: 'O(1) for both operations',
    tags: ['data-structures', 'cache', 'hash-map', 'linked-list']
  }
];

// Product Management Questions
export const productQuestions = [
  {
    id: 'pm_001',
    type: 'product',
    category: 'strategy',
    difficulty: 'medium',
    question: 'How would you prioritize features for a new mobile app with limited development resources?',
    evaluationCriteria: [
      'Prioritization framework',
      'User research approach',
      'Business impact assessment',
      'Resource allocation',
      'Success metrics'
    ],
    tags: ['product-management', 'prioritization', 'strategy', 'resource-management']
  }
];

// Leadership Questions
export const leadershipQuestions = [
  {
    id: 'lead_001',
    type: 'leadership',
    category: 'team-building',
    difficulty: 'hard',
    question: 'How do you build and maintain a high-performing engineering team?',
    evaluationCriteria: [
      'Team building strategies',
      'Performance management',
      'Culture development',
      'Talent retention',
      'Growth mindset'
    ],
    tags: ['leadership', 'team-building', 'performance', 'culture', 'management']
  }
];

// Export all question collections
export const allQuestionCollections = {
  technical: technicalQuestions,
  behavioral: behavioralQuestions,
  company: companyQuestions,
  situational: situationalQuestions,
  industry: industryQuestions,
  systemDesign: systemDesignQuestions,
  coding: codingQuestions,
  product: productQuestions,
  leadership: leadershipQuestions
};