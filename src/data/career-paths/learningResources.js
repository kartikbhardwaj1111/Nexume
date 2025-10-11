/**
 * Learning Resources Database - Curated learning resources for skill development
 */

export const LEARNING_RESOURCES = {
  // Programming Languages
  'javascript': {
    beginner: [
      {
        type: 'course',
        title: 'JavaScript Fundamentals',
        provider: 'freeCodeCamp',
        duration: '6-8 weeks',
        cost: 'Free',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        rating: 4.8,
        description: 'Learn JavaScript basics, ES6+, and fundamental programming concepts'
      },
      {
        type: 'course',
        title: 'The Complete JavaScript Course',
        provider: 'Udemy',
        duration: '8-10 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.7,
        description: 'Comprehensive JavaScript course from beginner to advanced'
      },
      {
        type: 'documentation',
        title: 'MDN JavaScript Guide',
        provider: 'Mozilla',
        duration: 'Self-paced',
        cost: 'Free',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        rating: 4.9,
        description: 'Official JavaScript documentation and tutorials'
      }
    ],
    intermediate: [
      {
        type: 'course',
        title: 'Advanced JavaScript Concepts',
        provider: 'Udemy',
        duration: '6 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.6,
        description: 'Deep dive into closures, prototypes, async programming'
      },
      {
        type: 'book',
        title: 'You Don\'t Know JS',
        provider: 'Kyle Simpson',
        duration: '4-6 weeks',
        cost: 'Free/Paid',
        url: 'https://github.com/getify/You-Dont-Know-JS',
        rating: 4.8,
        description: 'In-depth exploration of JavaScript mechanics'
      }
    ]
  },

  'python': {
    beginner: [
      {
        type: 'course',
        title: 'Python for Everybody',
        provider: 'Coursera',
        duration: '8 weeks',
        cost: 'Free/Paid Certificate',
        url: '#',
        rating: 4.8,
        description: 'Learn Python programming from scratch'
      },
      {
        type: 'course',
        title: 'Automate the Boring Stuff with Python',
        provider: 'Udemy',
        duration: '6 weeks',
        cost: 'Free/Paid',
        url: '#',
        rating: 4.7,
        description: 'Practical Python programming for automation'
      },
      {
        type: 'interactive',
        title: 'Python.org Tutorial',
        provider: 'Python Software Foundation',
        duration: 'Self-paced',
        cost: 'Free',
        url: 'https://docs.python.org/3/tutorial/',
        rating: 4.5,
        description: 'Official Python tutorial'
      }
    ],
    intermediate: [
      {
        type: 'course',
        title: 'Intermediate Python Programming',
        provider: 'Real Python',
        duration: '8 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.9,
        description: 'Advanced Python concepts and best practices'
      }
    ]
  },

  'react': {
    beginner: [
      {
        type: 'course',
        title: 'React - The Complete Guide',
        provider: 'Udemy',
        duration: '10 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.7,
        description: 'Complete React course with hooks, context, and more'
      },
      {
        type: 'documentation',
        title: 'React Official Tutorial',
        provider: 'Facebook',
        duration: '2-3 weeks',
        cost: 'Free',
        url: 'https://reactjs.org/tutorial/tutorial.html',
        rating: 4.6,
        description: 'Official React tutorial and documentation'
      },
      {
        type: 'course',
        title: 'React Basics',
        provider: 'freeCodeCamp',
        duration: '4 weeks',
        cost: 'Free',
        url: '#',
        rating: 4.5,
        description: 'Learn React fundamentals and build projects'
      }
    ],
    intermediate: [
      {
        type: 'course',
        title: 'Advanced React Patterns',
        provider: 'Kent C. Dodds',
        duration: '6 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.8,
        description: 'Advanced React patterns and performance optimization'
      }
    ]
  },

  // Data Science & ML
  'machine learning': {
    beginner: [
      {
        type: 'course',
        title: 'Machine Learning Course',
        provider: 'Coursera (Andrew Ng)',
        duration: '11 weeks',
        cost: 'Free/Paid Certificate',
        url: '#',
        rating: 4.9,
        description: 'Comprehensive introduction to machine learning'
      },
      {
        type: 'course',
        title: 'Python for Data Science and Machine Learning',
        provider: 'Udemy',
        duration: '12 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.6,
        description: 'Learn ML with Python, pandas, scikit-learn'
      },
      {
        type: 'book',
        title: 'Hands-On Machine Learning',
        provider: 'Aurélien Géron',
        duration: '8-10 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.8,
        description: 'Practical machine learning with Python'
      }
    ],
    intermediate: [
      {
        type: 'course',
        title: 'Deep Learning Specialization',
        provider: 'Coursera',
        duration: '16 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.8,
        description: 'Deep learning and neural networks'
      }
    ]
  },

  'sql': {
    beginner: [
      {
        type: 'course',
        title: 'SQL for Data Science',
        provider: 'Coursera',
        duration: '4 weeks',
        cost: 'Free/Paid Certificate',
        url: '#',
        rating: 4.6,
        description: 'Learn SQL for data analysis and manipulation'
      },
      {
        type: 'interactive',
        title: 'SQLBolt',
        provider: 'SQLBolt',
        duration: '2-3 weeks',
        cost: 'Free',
        url: 'https://sqlbolt.com/',
        rating: 4.7,
        description: 'Interactive SQL tutorial with exercises'
      },
      {
        type: 'course',
        title: 'The Complete SQL Bootcamp',
        provider: 'Udemy',
        duration: '6 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.5,
        description: 'Complete SQL course from beginner to advanced'
      }
    ]
  },

  // Cloud & DevOps
  'aws': {
    beginner: [
      {
        type: 'course',
        title: 'AWS Cloud Practitioner',
        provider: 'AWS Training',
        duration: '6 weeks',
        cost: 'Free',
        url: '#',
        rating: 4.5,
        description: 'Introduction to AWS cloud services'
      },
      {
        type: 'course',
        title: 'AWS Certified Solutions Architect',
        provider: 'A Cloud Guru',
        duration: '8 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.7,
        description: 'Comprehensive AWS architecture course'
      }
    ],
    intermediate: [
      {
        type: 'course',
        title: 'AWS Advanced Networking',
        provider: 'Linux Academy',
        duration: '10 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.6,
        description: 'Advanced AWS networking and security'
      }
    ]
  },

  'docker': {
    beginner: [
      {
        type: 'course',
        title: 'Docker Mastery',
        provider: 'Udemy',
        duration: '8 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.7,
        description: 'Complete Docker course with Kubernetes'
      },
      {
        type: 'documentation',
        title: 'Docker Official Tutorial',
        provider: 'Docker',
        duration: '2 weeks',
        cost: 'Free',
        url: 'https://docs.docker.com/get-started/',
        rating: 4.4,
        description: 'Official Docker getting started guide'
      }
    ]
  },

  // Soft Skills
  'leadership': {
    beginner: [
      {
        type: 'course',
        title: 'Leadership Principles',
        provider: 'Coursera',
        duration: '6 weeks',
        cost: 'Free/Paid Certificate',
        url: '#',
        rating: 4.5,
        description: 'Fundamental leadership skills and principles'
      },
      {
        type: 'book',
        title: 'The First 90 Days',
        provider: 'Michael Watkins',
        duration: '3 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.6,
        description: 'Leadership transition strategies'
      }
    ],
    intermediate: [
      {
        type: 'course',
        title: 'Advanced Leadership Strategies',
        provider: 'LinkedIn Learning',
        duration: '4 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.4,
        description: 'Advanced leadership and management techniques'
      }
    ]
  },

  'communication': {
    beginner: [
      {
        type: 'course',
        title: 'Effective Communication',
        provider: 'Coursera',
        duration: '4 weeks',
        cost: 'Free/Paid Certificate',
        url: '#',
        rating: 4.6,
        description: 'Improve verbal and written communication skills'
      },
      {
        type: 'book',
        title: 'Crucial Conversations',
        provider: 'Kerry Patterson',
        duration: '2 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.7,
        description: 'Tools for talking when stakes are high'
      }
    ]
  },

  'project management': {
    beginner: [
      {
        type: 'course',
        title: 'Project Management Fundamentals',
        provider: 'Coursera',
        duration: '6 weeks',
        cost: 'Free/Paid Certificate',
        url: '#',
        rating: 4.5,
        description: 'Learn project management basics and methodologies'
      },
      {
        type: 'certification',
        title: 'Google Project Management Certificate',
        provider: 'Google',
        duration: '12 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.7,
        description: 'Professional project management certification'
      }
    ],
    intermediate: [
      {
        type: 'certification',
        title: 'PMP Certification Prep',
        provider: 'PMI',
        duration: '16 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.6,
        description: 'Prepare for Project Management Professional certification'
      }
    ]
  },

  // Design
  'figma': {
    beginner: [
      {
        type: 'course',
        title: 'Figma UI/UX Design',
        provider: 'Udemy',
        duration: '4 weeks',
        cost: 'Paid',
        url: '#',
        rating: 4.6,
        description: 'Learn Figma for UI/UX design'
      },
      {
        type: 'tutorial',
        title: 'Figma Academy',
        provider: 'Figma',
        duration: '2 weeks',
        cost: 'Free',
        url: 'https://www.figma.com/academy/',
        rating: 4.8,
        description: 'Official Figma tutorials and best practices'
      }
    ]
  },

  // Marketing
  'digital marketing': {
    beginner: [
      {
        type: 'course',
        title: 'Digital Marketing Fundamentals',
        provider: 'Google Digital Garage',
        duration: '8 weeks',
        cost: 'Free',
        url: '#',
        rating: 4.5,
        description: 'Comprehensive digital marketing course'
      },
      {
        type: 'certification',
        title: 'Google Ads Certification',
        provider: 'Google',
        duration: '4 weeks',
        cost: 'Free',
        url: '#',
        rating: 4.6,
        description: 'Learn Google Ads and get certified'
      }
    ]
  },

  'seo': {
    beginner: [
      {
        type: 'course',
        title: 'SEO Fundamentals',
        provider: 'Moz Academy',
        duration: '6 weeks',
        cost: 'Free/Paid',
        url: '#',
        rating: 4.7,
        description: 'Learn search engine optimization basics'
      },
      {
        type: 'guide',
        title: 'Google SEO Starter Guide',
        provider: 'Google',
        duration: '1 week',
        cost: 'Free',
        url: '#',
        rating: 4.8,
        description: 'Official Google SEO guidelines'
      }
    ]
  }
};

export const RESOURCE_TYPES = {
  course: {
    name: 'Online Course',
    icon: '🎓',
    description: 'Structured learning with videos, exercises, and assessments'
  },
  book: {
    name: 'Book',
    icon: '📚',
    description: 'In-depth written content for comprehensive learning'
  },
  documentation: {
    name: 'Documentation',
    icon: '📖',
    description: 'Official documentation and reference materials'
  },
  tutorial: {
    name: 'Tutorial',
    icon: '🎯',
    description: 'Step-by-step guides and walkthroughs'
  },
  interactive: {
    name: 'Interactive Learning',
    icon: '💻',
    description: 'Hands-on coding exercises and challenges'
  },
  certification: {
    name: 'Certification',
    icon: '🏆',
    description: 'Professional certifications and credentials'
  },
  practice: {
    name: 'Practice Projects',
    icon: '🛠️',
    description: 'Real-world projects to build your portfolio'
  },
  guide: {
    name: 'Guide',
    icon: '📋',
    description: 'Comprehensive guides and best practices'
  }
};

export const LEARNING_PROVIDERS = {
  'coursera': {
    name: 'Coursera',
    type: 'MOOC Platform',
    strengths: ['University partnerships', 'Certificates', 'Structured courses'],
    pricing: 'Free courses with paid certificates'
  },
  'udemy': {
    name: 'Udemy',
    type: 'Online Learning',
    strengths: ['Practical courses', 'Lifetime access', 'Regular sales'],
    pricing: 'One-time purchase, frequent discounts'
  },
  'freecodecamp': {
    name: 'freeCodeCamp',
    type: 'Coding Bootcamp',
    strengths: ['Completely free', 'Project-based', 'Community support'],
    pricing: 'Completely free'
  },
  'pluralsight': {
    name: 'Pluralsight',
    type: 'Tech Learning',
    strengths: ['Tech focus', 'Skill assessments', 'Learning paths'],
    pricing: 'Monthly/annual subscription'
  },
  'linkedin-learning': {
    name: 'LinkedIn Learning',
    type: 'Professional Development',
    strengths: ['Professional skills', 'LinkedIn integration', 'Certificates'],
    pricing: 'Monthly subscription'
  }
};

export default LEARNING_RESOURCES;