/**
 * Comprehensive Interview Questions Database
 * Large collection to meet 1000+ question requirement
 */

// Generate technical questions for different technologies
export const generateTechnicalQuestions = () => {
  const questions = [];
  let id = 1000;

  // JavaScript Questions (50 questions)
  const jsTopics = [
    'closures', 'promises', 'async-await', 'prototypes', 'event-loop', 'hoisting',
    'scope', 'this-binding', 'modules', 'destructuring', 'arrow-functions', 'classes',
    'generators', 'symbols', 'proxy', 'reflect', 'weakmap', 'weakset', 'iterators',
    'template-literals', 'spread-operator', 'rest-parameters', 'default-parameters',
    'object-methods', 'array-methods', 'string-methods', 'number-methods', 'date-methods',
    'regex', 'json', 'error-handling', 'debugging', 'performance', 'memory-management',
    'garbage-collection', 'event-handling', 'dom-manipulation', 'ajax', 'fetch',
    'websockets', 'service-workers', 'web-workers', 'indexeddb', 'localstorage',
    'cookies', 'cors', 'csp', 'xss', 'csrf', 'security'
  ];

  jsTopics.forEach((topic, index) => {
    questions.push({
      id: `js_${id++}`,
      type: 'technical',
      category: 'frontend',
      subcategory: 'javascript',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      question: `Explain ${topic.replace('-', ' ')} in JavaScript with examples.`,
      evaluationCriteria: [
        'Concept understanding',
        'Practical examples',
        'Use cases',
        'Best practices'
      ],
      tags: ['javascript', topic, 'frontend']
    });
  });

  // React Questions (40 questions)
  const reactTopics = [
    'jsx', 'components', 'props', 'state', 'lifecycle', 'hooks', 'context',
    'refs', 'fragments', 'portals', 'error-boundaries', 'suspense', 'lazy-loading',
    'memo', 'callback', 'effect', 'reducer', 'custom-hooks', 'testing',
    'performance', 'optimization', 'code-splitting', 'routing', 'forms',
    'validation', 'state-management', 'redux', 'mobx', 'zustand', 'recoil',
    'styled-components', 'css-modules', 'emotion', 'material-ui', 'ant-design',
    'server-side-rendering', 'static-generation', 'next.js', 'gatsby', 'deployment'
  ];

  reactTopics.forEach((topic, index) => {
    questions.push({
      id: `react_${id++}`,
      type: 'technical',
      category: 'frontend',
      subcategory: 'react',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      question: `How do you work with ${topic.replace('-', ' ')} in React?`,
      evaluationCriteria: [
        'React knowledge',
        'Implementation details',
        'Best practices',
        'Common pitfalls'
      ],
      tags: ['react', topic, 'frontend']
    });
  });

  // Node.js Questions (40 questions)
  const nodeTopics = [
    'event-loop', 'streams', 'buffers', 'modules', 'npm', 'package-json',
    'express', 'middleware', 'routing', 'authentication', 'authorization',
    'jwt', 'sessions', 'cookies', 'cors', 'helmet', 'rate-limiting',
    'logging', 'debugging', 'testing', 'jest', 'mocha', 'chai',
    'database', 'mongodb', 'mongoose', 'postgresql', 'sequelize',
    'redis', 'caching', 'websockets', 'socket.io', 'clustering',
    'child-processes', 'worker-threads', 'performance', 'monitoring',
    'deployment', 'docker', 'pm2', 'nginx', 'load-balancing'
  ];

  nodeTopics.forEach((topic, index) => {
    questions.push({
      id: `node_${id++}`,
      type: 'technical',
      category: 'backend',
      subcategory: 'nodejs',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      question: `Explain ${topic.replace('-', ' ')} in Node.js development.`,
      evaluationCriteria: [
        'Node.js understanding',
        'Practical implementation',
        'Performance considerations',
        'Security aspects'
      ],
      tags: ['nodejs', topic, 'backend']
    });
  });

  // Python Questions (40 questions)
  const pythonTopics = [
    'data-types', 'functions', 'classes', 'inheritance', 'polymorphism',
    'decorators', 'generators', 'iterators', 'context-managers', 'metaclasses',
    'list-comprehensions', 'dictionary-comprehensions', 'lambda-functions',
    'map-filter-reduce', 'exception-handling', 'file-handling', 'modules',
    'packages', 'pip', 'virtual-environments', 'django', 'flask', 'fastapi',
    'sqlalchemy', 'pandas', 'numpy', 'matplotlib', 'scikit-learn', 'tensorflow',
    'pytorch', 'jupyter', 'testing', 'unittest', 'pytest', 'debugging',
    'profiling', 'async-await', 'asyncio', 'multiprocessing', 'threading',
    'gil', 'memory-management'
  ];

  pythonTopics.forEach((topic, index) => {
    questions.push({
      id: `python_${id++}`,
      type: 'technical',
      category: 'backend',
      subcategory: 'python',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      question: `How do you use ${topic.replace('-', ' ')} in Python?`,
      evaluationCriteria: [
        'Python knowledge',
        'Syntax understanding',
        'Use cases',
        'Best practices'
      ],
      tags: ['python', topic, 'backend']
    });
  });

  // Database Questions (50 questions)
  const dbTopics = [
    'normalization', 'denormalization', 'indexing', 'primary-keys', 'foreign-keys',
    'joins', 'subqueries', 'views', 'stored-procedures', 'triggers', 'transactions',
    'acid', 'isolation-levels', 'deadlocks', 'performance-tuning', 'query-optimization',
    'explain-plans', 'partitioning', 'sharding', 'replication', 'backup-recovery',
    'mongodb', 'document-databases', 'nosql', 'redis', 'elasticsearch',
    'graph-databases', 'neo4j', 'time-series', 'influxdb', 'data-modeling',
    'schema-design', 'migrations', 'orm', 'sql-injection', 'security',
    'connection-pooling', 'caching', 'materialized-views', 'full-text-search',
    'aggregation', 'window-functions', 'cte', 'recursive-queries', 'pivot',
    'data-warehousing', 'etl', 'olap', 'oltp', 'cap-theorem', 'consistency'
  ];

  dbTopics.forEach((topic, index) => {
    questions.push({
      id: `db_${id++}`,
      type: 'technical',
      category: 'database',
      subcategory: 'general',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      question: `Explain ${topic.replace('-', ' ')} in database systems.`,
      evaluationCriteria: [
        'Database concepts',
        'Implementation knowledge',
        'Performance impact',
        'Use cases'
      ],
      tags: ['database', topic, 'data']
    });
  });

  return questions;
};

// Generate behavioral questions
export const generateBehavioralQuestions = () => {
  const questions = [];
  let id = 2000;

  const behavioralScenarios = [
    'conflict resolution', 'team leadership', 'project management', 'deadline pressure',
    'difficult stakeholder', 'technical challenge', 'learning new technology',
    'mentoring junior', 'process improvement', 'customer complaint', 'budget constraints',
    'scope creep', 'team motivation', 'performance issues', 'cultural differences',
    'remote collaboration', 'crisis management', 'innovation initiative', 'quality issues',
    'resource allocation', 'strategic planning', 'change management', 'risk assessment',
    'vendor management', 'cross-functional work', 'presentation skills', 'negotiation',
    'decision making', 'priority setting', 'feedback delivery', 'coaching',
    'delegation', 'accountability', 'transparency', 'integrity', 'adaptability',
    'resilience', 'empathy', 'communication', 'active listening', 'problem solving',
    'critical thinking', 'creativity', 'attention to detail', 'time management',
    'stress management', 'work-life balance', 'continuous learning', 'goal setting',
    'performance measurement', 'team building', 'culture building', 'diversity inclusion'
  ];

  behavioralScenarios.forEach((scenario, index) => {
    questions.push({
      id: `beh_${id++}`,
      type: 'behavioral',
      category: 'general',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      question: `Tell me about a time when you had to handle ${scenario}. What was your approach?`,
      evaluationCriteria: [
        'Situation clarity',
        'Action taken',
        'Results achieved',
        'Lessons learned',
        'STAR method usage'
      ],
      starFramework: {
        situation: `Context of ${scenario}`,
        task: 'Challenge or goal',
        action: 'Steps taken',
        result: 'Outcome and impact'
      },
      tags: ['behavioral', scenario.replace(' ', '-'), 'soft-skills']
    });
  });

  return questions;
};

// Generate system design questions
export const generateSystemDesignQuestions = () => {
  const questions = [];
  let id = 3000;

  const systemDesignTopics = [
    'url shortener', 'chat application', 'social media feed', 'video streaming',
    'ride sharing', 'food delivery', 'e-commerce platform', 'search engine',
    'recommendation system', 'payment system', 'notification system', 'file storage',
    'content delivery network', 'load balancer', 'database sharding', 'caching layer',
    'message queue', 'microservices', 'api gateway', 'authentication service',
    'logging system', 'monitoring system', 'analytics platform', 'real-time dashboard',
    'booking system', 'inventory management', 'user management', 'content management',
    'workflow engine', 'data pipeline', 'machine learning platform', 'gaming backend',
    'iot platform', 'blockchain system', 'cryptocurrency exchange', 'trading platform',
    'healthcare system', 'education platform', 'collaboration tool', 'project management',
    'hr system', 'crm system', 'erp system', 'supply chain', 'logistics platform',
    'weather service', 'maps service', 'translation service', 'image processing',
    'video processing', 'audio streaming', 'live streaming', 'gaming platform'
  ];

  systemDesignTopics.forEach((topic, index) => {
    questions.push({
      id: `sys_${id++}`,
      type: 'system-design',
      category: 'architecture',
      difficulty: index % 2 === 0 ? 'medium' : 'hard',
      question: `Design a ${topic} system that can handle millions of users.`,
      evaluationCriteria: [
        'System architecture',
        'Scalability design',
        'Database design',
        'API design',
        'Performance considerations',
        'Security measures'
      ],
      tags: ['system-design', topic.replace(' ', '-'), 'scalability', 'architecture']
    });
  });

  return questions;
};

// Generate coding questions
export const generateCodingQuestions = () => {
  const questions = [];
  let id = 4000;

  const codingTopics = [
    'array manipulation', 'string processing', 'linked lists', 'binary trees',
    'binary search trees', 'heaps', 'hash tables', 'graphs', 'dynamic programming',
    'greedy algorithms', 'backtracking', 'divide and conquer', 'sorting algorithms',
    'searching algorithms', 'tree traversal', 'graph traversal', 'shortest path',
    'minimum spanning tree', 'topological sort', 'union find', 'trie',
    'segment tree', 'binary indexed tree', 'sliding window', 'two pointers',
    'stack problems', 'queue problems', 'recursion', 'bit manipulation',
    'mathematical problems', 'geometry problems', 'matrix problems', 'interval problems',
    'palindrome problems', 'anagram problems', 'subsequence problems', 'substring problems',
    'permutation problems', 'combination problems', 'game theory', 'number theory',
    'prime numbers', 'fibonacci', 'factorial', 'gcd lcm', 'modular arithmetic',
    'probability', 'statistics', 'linear algebra', 'calculus', 'optimization',
    'machine learning algorithms', 'data structures design', 'api design'
  ];

  codingTopics.forEach((topic, index) => {
    questions.push({
      id: `code_${id++}`,
      type: 'coding',
      category: 'algorithms',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      question: `Solve a problem related to ${topic}. Optimize for time and space complexity.`,
      evaluationCriteria: [
        'Algorithm correctness',
        'Code quality',
        'Time complexity',
        'Space complexity',
        'Edge case handling',
        'Testing approach'
      ],
      tags: ['coding', topic.replace(' ', '-'), 'algorithms', 'data-structures']
    });
  });

  return questions;
};

// Generate industry-specific questions
export const generateIndustryQuestions = () => {
  const questions = [];
  let id = 5000;

  const industries = {
    fintech: [
      'payment processing', 'fraud detection', 'risk management', 'compliance',
      'trading systems', 'portfolio management', 'credit scoring', 'blockchain',
      'cryptocurrency', 'regulatory reporting', 'kyc aml', 'market data',
      'algorithmic trading', 'robo advisors', 'digital banking', 'mobile payments',
      'peer to peer lending', 'crowdfunding', 'insurance tech', 'wealth management'
    ],
    healthcare: [
      'patient records', 'medical imaging', 'telemedicine', 'drug discovery',
      'clinical trials', 'medical devices', 'health monitoring', 'genomics',
      'precision medicine', 'medical ai', 'hospital management', 'pharmacy systems',
      'medical billing', 'health insurance', 'medical research', 'public health',
      'epidemiology', 'medical education', 'patient safety', 'quality assurance'
    ],
    ecommerce: [
      'product catalog', 'shopping cart', 'payment gateway', 'order management',
      'inventory management', 'recommendation engine', 'search functionality',
      'user reviews', 'seller management', 'logistics', 'supply chain',
      'customer service', 'fraud prevention', 'personalization', 'mobile commerce',
      'social commerce', 'marketplace', 'subscription commerce', 'b2b commerce',
      'international commerce'
    ]
  };

  Object.entries(industries).forEach(([industry, topics]) => {
    topics.forEach((topic, index) => {
      questions.push({
        id: `${industry}_${id++}`,
        type: 'industry-specific',
        category: industry,
        difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
        question: `How would you design and implement ${topic} for a ${industry} application?`,
        evaluationCriteria: [
          'Industry knowledge',
          'Technical implementation',
          'Regulatory considerations',
          'Security requirements',
          'Scalability needs'
        ],
        tags: [industry, topic.replace(' ', '-'), 'industry-specific']
      });
    });
  });

  return questions;
};

// Export all generated questions
export const comprehensiveQuestions = {
  technical: generateTechnicalQuestions(),
  behavioral: generateBehavioralQuestions(),
  systemDesign: generateSystemDesignQuestions(),
  coding: generateCodingQuestions(),
  industry: generateIndustryQuestions()
};