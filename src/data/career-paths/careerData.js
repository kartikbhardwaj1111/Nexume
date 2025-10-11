/**
 * Career Data - Role classifications, skill categories, and career progression data
 */

export const CAREER_LEVELS = {
  entry: {
    name: 'Entry Level',
    yearsRange: [0, 2],
    description: 'Beginning career, learning fundamentals'
  },
  mid: {
    name: 'Mid Level',
    yearsRange: [2, 5],
    description: 'Developing expertise, taking on more responsibility'
  },
  senior: {
    name: 'Senior Level',
    yearsRange: [5, 8],
    description: 'Expert in domain, mentoring others'
  },
  lead: {
    name: 'Lead/Principal',
    yearsRange: [7, 12],
    description: 'Leading teams and technical decisions'
  },
  executive: {
    name: 'Executive',
    yearsRange: [10, 30],
    description: 'Strategic leadership and organizational impact'
  }
};

export const ROLE_CLASSIFICATIONS = {
  'software-engineer': {
    name: 'Software Engineer',
    titleKeywords: [
      'software engineer', 'developer', 'programmer', 'software developer',
      'full stack developer', 'backend developer', 'frontend developer'
    ],
    requiredSkills: [
      'programming', 'javascript', 'python', 'java', 'react', 'node.js',
      'git', 'sql', 'api', 'debugging'
    ],
    responsibilities: [
      'develop', 'code', 'implement', 'debug', 'test', 'deploy',
      'maintain', 'optimize', 'refactor', 'collaborate'
    ],
    careerPath: ['junior developer', 'software engineer', 'senior engineer', 'tech lead', 'engineering manager']
  },
  'data-scientist': {
    name: 'Data Scientist',
    titleKeywords: [
      'data scientist', 'data analyst', 'machine learning engineer',
      'ai engineer', 'research scientist', 'quantitative analyst'
    ],
    requiredSkills: [
      'python', 'r', 'sql', 'machine learning', 'statistics', 'pandas',
      'numpy', 'scikit-learn', 'tensorflow', 'data visualization'
    ],
    responsibilities: [
      'analyze', 'model', 'predict', 'research', 'experiment',
      'visualize', 'interpret', 'recommend', 'validate'
    ],
    careerPath: ['data analyst', 'data scientist', 'senior data scientist', 'principal data scientist', 'head of data']
  },
  'product-manager': {
    name: 'Product Manager',
    titleKeywords: [
      'product manager', 'product owner', 'program manager',
      'project manager', 'product lead', 'product director'
    ],
    requiredSkills: [
      'product management', 'agile', 'scrum', 'roadmap', 'stakeholder management',
      'user research', 'analytics', 'prioritization', 'communication'
    ],
    responsibilities: [
      'manage', 'prioritize', 'coordinate', 'plan', 'communicate',
      'analyze', 'define', 'launch', 'optimize', 'strategize'
    ],
    careerPath: ['associate pm', 'product manager', 'senior pm', 'principal pm', 'vp product']
  },
  'designer': {
    name: 'Designer',
    titleKeywords: [
      'designer', 'ux designer', 'ui designer', 'product designer',
      'graphic designer', 'visual designer', 'interaction designer'
    ],
    requiredSkills: [
      'design', 'figma', 'sketch', 'adobe', 'prototyping', 'user research',
      'wireframing', 'visual design', 'interaction design', 'usability'
    ],
    responsibilities: [
      'design', 'prototype', 'research', 'test', 'iterate',
      'collaborate', 'present', 'conceptualize', 'visualize'
    ],
    careerPath: ['junior designer', 'designer', 'senior designer', 'design lead', 'design director']
  },
  'marketing-manager': {
    name: 'Marketing Manager',
    titleKeywords: [
      'marketing manager', 'digital marketing', 'content marketing',
      'growth marketing', 'brand manager', 'marketing specialist'
    ],
    requiredSkills: [
      'marketing', 'digital marketing', 'content creation', 'seo', 'sem',
      'social media', 'analytics', 'campaign management', 'branding'
    ],
    responsibilities: [
      'campaign', 'promote', 'analyze', 'create', 'manage',
      'optimize', 'measure', 'strategize', 'engage', 'convert'
    ],
    careerPath: ['marketing coordinator', 'marketing specialist', 'marketing manager', 'senior marketing manager', 'marketing director']
  },
  'financial-analyst': {
    name: 'Financial Analyst',
    titleKeywords: [
      'financial analyst', 'business analyst', 'investment analyst',
      'finance manager', 'financial planner', 'budget analyst'
    ],
    requiredSkills: [
      'financial analysis', 'excel', 'financial modeling', 'accounting',
      'budgeting', 'forecasting', 'valuation', 'risk analysis'
    ],
    responsibilities: [
      'analyze', 'forecast', 'budget', 'model', 'evaluate',
      'report', 'recommend', 'assess', 'monitor', 'calculate'
    ],
    careerPath: ['financial analyst', 'senior analyst', 'finance manager', 'finance director', 'cfo']
  },
  'sales-representative': {
    name: 'Sales Representative',
    titleKeywords: [
      'sales representative', 'account manager', 'sales manager',
      'business development', 'sales executive', 'account executive'
    ],
    requiredSkills: [
      'sales', 'negotiation', 'crm', 'lead generation', 'customer relationship',
      'presentation', 'communication', 'closing', 'prospecting'
    ],
    responsibilities: [
      'sell', 'negotiate', 'present', 'prospect', 'close',
      'manage', 'develop', 'maintain', 'follow up', 'exceed'
    ],
    careerPath: ['sales associate', 'sales representative', 'senior sales rep', 'sales manager', 'sales director']
  },
  'operations-manager': {
    name: 'Operations Manager',
    titleKeywords: [
      'operations manager', 'operations analyst', 'process manager',
      'supply chain manager', 'logistics manager', 'operations director'
    ],
    requiredSkills: [
      'operations', 'process improvement', 'project management', 'logistics',
      'supply chain', 'lean', 'six sigma', 'analytics', 'optimization'
    ],
    responsibilities: [
      'manage', 'optimize', 'coordinate', 'improve', 'monitor',
      'implement', 'streamline', 'oversee', 'analyze', 'execute'
    ],
    careerPath: ['operations analyst', 'operations coordinator', 'operations manager', 'senior ops manager', 'vp operations']
  }
};

export const SKILL_CATEGORIES = {
  technical: [
    // Programming Languages
    { name: 'JavaScript', aliases: ['js', 'javascript', 'node.js', 'nodejs'] },
    { name: 'Python', aliases: ['python', 'py'] },
    { name: 'Java', aliases: ['java'] },
    { name: 'C++', aliases: ['c++', 'cpp'] },
    { name: 'C#', aliases: ['c#', 'csharp'] },
    { name: 'PHP', aliases: ['php'] },
    { name: 'Ruby', aliases: ['ruby', 'rails'] },
    { name: 'Go', aliases: ['go', 'golang'] },
    { name: 'Rust', aliases: ['rust'] },
    { name: 'Swift', aliases: ['swift'] },
    { name: 'Kotlin', aliases: ['kotlin'] },
    { name: 'TypeScript', aliases: ['typescript', 'ts'] },
    
    // Web Technologies
    { name: 'React', aliases: ['react', 'reactjs'] },
    { name: 'Angular', aliases: ['angular', 'angularjs'] },
    { name: 'Vue.js', aliases: ['vue', 'vuejs'] },
    { name: 'HTML', aliases: ['html', 'html5'] },
    { name: 'CSS', aliases: ['css', 'css3'] },
    { name: 'SASS', aliases: ['sass', 'scss'] },
    { name: 'Bootstrap', aliases: ['bootstrap'] },
    { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'] },
    
    // Databases
    { name: 'SQL', aliases: ['sql', 'mysql', 'postgresql', 'sqlite'] },
    { name: 'MongoDB', aliases: ['mongodb', 'mongo'] },
    { name: 'Redis', aliases: ['redis'] },
    { name: 'Elasticsearch', aliases: ['elasticsearch', 'elastic'] },
    
    // Cloud & DevOps
    { name: 'AWS', aliases: ['aws', 'amazon web services'] },
    { name: 'Azure', aliases: ['azure', 'microsoft azure'] },
    { name: 'Google Cloud', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
    { name: 'Docker', aliases: ['docker'] },
    { name: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
    { name: 'Jenkins', aliases: ['jenkins'] },
    { name: 'Git', aliases: ['git', 'github', 'gitlab'] },
    
    // Data Science & ML
    { name: 'Machine Learning', aliases: ['machine learning', 'ml', 'artificial intelligence', 'ai'] },
    { name: 'TensorFlow', aliases: ['tensorflow'] },
    { name: 'PyTorch', aliases: ['pytorch'] },
    { name: 'Pandas', aliases: ['pandas'] },
    { name: 'NumPy', aliases: ['numpy'] },
    { name: 'Scikit-learn', aliases: ['scikit-learn', 'sklearn'] },
    { name: 'R', aliases: ['r programming'] },
    { name: 'Tableau', aliases: ['tableau'] },
    { name: 'Power BI', aliases: ['power bi', 'powerbi'] }
  ],
  
  soft: [
    { name: 'Leadership', aliases: ['leadership', 'team leadership', 'leading teams'] },
    { name: 'Communication', aliases: ['communication', 'verbal communication', 'written communication'] },
    { name: 'Problem Solving', aliases: ['problem solving', 'analytical thinking', 'critical thinking'] },
    { name: 'Project Management', aliases: ['project management', 'program management'] },
    { name: 'Team Collaboration', aliases: ['collaboration', 'teamwork', 'cross-functional'] },
    { name: 'Mentoring', aliases: ['mentoring', 'coaching', 'training'] },
    { name: 'Presentation', aliases: ['presentation', 'public speaking', 'presenting'] },
    { name: 'Negotiation', aliases: ['negotiation', 'negotiating'] },
    { name: 'Time Management', aliases: ['time management', 'prioritization'] },
    { name: 'Adaptability', aliases: ['adaptability', 'flexibility', 'agile mindset'] }
  ],
  
  domain: [
    // Finance
    { name: 'Financial Analysis', aliases: ['financial analysis', 'financial modeling'] },
    { name: 'Accounting', aliases: ['accounting', 'bookkeeping'] },
    { name: 'Investment Analysis', aliases: ['investment analysis', 'portfolio management'] },
    { name: 'Risk Management', aliases: ['risk management', 'risk assessment'] },
    
    // Marketing
    { name: 'Digital Marketing', aliases: ['digital marketing', 'online marketing'] },
    { name: 'SEO', aliases: ['seo', 'search engine optimization'] },
    { name: 'Content Marketing', aliases: ['content marketing', 'content creation'] },
    { name: 'Social Media Marketing', aliases: ['social media', 'social media marketing'] },
    { name: 'Email Marketing', aliases: ['email marketing'] },
    
    // Sales
    { name: 'Sales Strategy', aliases: ['sales strategy', 'sales planning'] },
    { name: 'Customer Relationship Management', aliases: ['crm', 'customer relations'] },
    { name: 'Lead Generation', aliases: ['lead generation', 'prospecting'] },
    { name: 'Account Management', aliases: ['account management', 'client management'] },
    
    // Operations
    { name: 'Supply Chain Management', aliases: ['supply chain', 'logistics'] },
    { name: 'Process Improvement', aliases: ['process improvement', 'lean', 'six sigma'] },
    { name: 'Quality Assurance', aliases: ['quality assurance', 'qa', 'quality control'] },
    { name: 'Inventory Management', aliases: ['inventory management', 'inventory control'] }
  ],
  
  tools: [
    // Design Tools
    { name: 'Figma', aliases: ['figma'] },
    { name: 'Sketch', aliases: ['sketch'] },
    { name: 'Adobe Creative Suite', aliases: ['adobe', 'photoshop', 'illustrator', 'indesign'] },
    { name: 'Canva', aliases: ['canva'] },
    
    // Project Management
    { name: 'Jira', aliases: ['jira'] },
    { name: 'Trello', aliases: ['trello'] },
    { name: 'Asana', aliases: ['asana'] },
    { name: 'Monday.com', aliases: ['monday', 'monday.com'] },
    
    // Analytics
    { name: 'Google Analytics', aliases: ['google analytics', 'ga'] },
    { name: 'Mixpanel', aliases: ['mixpanel'] },
    { name: 'Amplitude', aliases: ['amplitude'] },
    
    // Office Suite
    { name: 'Microsoft Excel', aliases: ['excel', 'microsoft excel'] },
    { name: 'Google Sheets', aliases: ['google sheets', 'sheets'] },
    { name: 'PowerPoint', aliases: ['powerpoint', 'presentations'] },
    { name: 'Slack', aliases: ['slack'] },
    { name: 'Microsoft Teams', aliases: ['teams', 'microsoft teams'] }
  ]
};

export const CAREER_PROGRESSION_PATHS = {
  'software-engineer': {
    levels: {
      entry: {
        title: 'Junior Developer',
        skills: ['programming basics', 'version control', 'debugging'],
        responsibilities: ['write code', 'fix bugs', 'learn from seniors'],
        salaryRange: [50000, 70000]
      },
      mid: {
        title: 'Software Engineer',
        skills: ['full-stack development', 'testing', 'code review'],
        responsibilities: ['feature development', 'code reviews', 'mentoring juniors'],
        salaryRange: [70000, 100000]
      },
      senior: {
        title: 'Senior Software Engineer',
        skills: ['system design', 'architecture', 'performance optimization'],
        responsibilities: ['technical leadership', 'system design', 'cross-team collaboration'],
        salaryRange: [100000, 140000]
      },
      lead: {
        title: 'Tech Lead / Principal Engineer',
        skills: ['technical strategy', 'team leadership', 'stakeholder management'],
        responsibilities: ['technical vision', 'team leadership', 'strategic planning'],
        salaryRange: [140000, 180000]
      },
      executive: {
        title: 'Engineering Manager / Director',
        skills: ['people management', 'business strategy', 'organizational leadership'],
        responsibilities: ['team management', 'strategic planning', 'organizational impact'],
        salaryRange: [160000, 250000]
      }
    }
  },
  'data-scientist': {
    levels: {
      entry: {
        title: 'Data Analyst',
        skills: ['sql', 'excel', 'basic statistics'],
        responsibilities: ['data analysis', 'reporting', 'data cleaning'],
        salaryRange: [55000, 75000]
      },
      mid: {
        title: 'Data Scientist',
        skills: ['machine learning', 'python/r', 'statistical modeling'],
        responsibilities: ['predictive modeling', 'experiment design', 'insights generation'],
        salaryRange: [80000, 120000]
      },
      senior: {
        title: 'Senior Data Scientist',
        skills: ['advanced ml', 'deep learning', 'model deployment'],
        responsibilities: ['complex modeling', 'technical leadership', 'strategy development'],
        salaryRange: [120000, 160000]
      },
      lead: {
        title: 'Principal Data Scientist',
        skills: ['research leadership', 'business strategy', 'team mentoring'],
        responsibilities: ['research direction', 'cross-functional leadership', 'innovation'],
        salaryRange: [160000, 200000]
      },
      executive: {
        title: 'Head of Data Science',
        skills: ['organizational leadership', 'data strategy', 'business acumen'],
        responsibilities: ['data strategy', 'team building', 'organizational impact'],
        salaryRange: [180000, 300000]
      }
    }
  }
  // Add more career paths as needed
};

export const INDUSTRY_SKILLS = {
  technology: {
    core: ['programming', 'system design', 'algorithms', 'data structures'],
    trending: ['cloud computing', 'microservices', 'devops', 'machine learning'],
    tools: ['git', 'docker', 'kubernetes', 'aws']
  },
  finance: {
    core: ['financial analysis', 'accounting', 'risk management', 'compliance'],
    trending: ['fintech', 'blockchain', 'algorithmic trading', 'regulatory technology'],
    tools: ['excel', 'bloomberg', 'sql', 'python']
  },
  healthcare: {
    core: ['patient care', 'medical knowledge', 'healthcare regulations', 'clinical skills'],
    trending: ['telemedicine', 'health informatics', 'precision medicine', 'ai in healthcare'],
    tools: ['ehr systems', 'medical devices', 'healthcare analytics']
  },
  marketing: {
    core: ['brand management', 'customer acquisition', 'market research', 'campaign management'],
    trending: ['digital marketing', 'growth hacking', 'marketing automation', 'data-driven marketing'],
    tools: ['google analytics', 'hubspot', 'salesforce', 'social media platforms']
  }
};

export default {
  CAREER_LEVELS,
  ROLE_CLASSIFICATIONS,
  SKILL_CATEGORIES,
  CAREER_PROGRESSION_PATHS,
  INDUSTRY_SKILLS
};