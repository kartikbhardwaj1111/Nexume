/**
 * AI Fallback Tests for JobExtractor Service
 * Tests AI service integration, fallback mechanisms, and complex job description parsing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import JobExtractor from '../JobExtractor.js';
import { geminiService } from '../../ai/GeminiService.js';

// Mock the GeminiService
vi.mock('../../ai/GeminiService.js', () => ({
  geminiService: {
    extractJobDetails: vi.fn(),
    isAvailable: vi.fn(() => true)
  }
}));

describe('JobExtractor AI Fallback Tests', () => {
  let jobExtractor;

  beforeEach(() => {
    jobExtractor = new JobExtractor();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complex Job Description Analysis', () => {
    it('should handle multi-language job postings', async () => {
      const multiLanguageContent = `
        Senior Software Engineer / Ingénieur Logiciel Senior
        
        Company: TechGlobal Inc. / Société TechGlobal Inc.
        Location: Montreal, QC / Montréal, QC
        
        English Description:
        We are seeking a Senior Software Engineer with 5+ years of experience.
        Required skills: JavaScript, React, Node.js, Python
        
        Description en Français:
        Nous recherchons un Ingénieur Logiciel Senior avec 5+ années d'expérience.
        Compétences requises: JavaScript, React, Node.js, Python
        
        Requirements / Exigences:
        - Bachelor's degree in Computer Science / Baccalauréat en informatique
        - Bilingual (English/French) / Bilingue (Anglais/Français)
      `;

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Senior Software Engineer',
        company: 'TechGlobal Inc.',
        location: 'Montreal, QC',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        requirements: [
          'Bachelor\'s degree in Computer Science',
          '5+ years of experience',
          'Bilingual (English/French)'
        ],
        experienceYears: 5,
        languages: ['English', 'French']
      });

      const result = await jobExtractor.analyzeJobContentWithAI(multiLanguageContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Senior Software Engineer');
      expect(result.data.location).toBe('Montreal, QC');
      expect(result.data.skills).toContain('JavaScript');
      expect(result.data.requirements).toContain('Bilingual (English/French)');
    });

    it('should extract information from startup job postings with unconventional formats', async () => {
      const startupJobContent = `
        🚀 Rockstar Full-Stack Developer Wanted! 🚀
        
        Hey there, coding ninja! 👋
        
        We're a fast-growing fintech startup looking for someone who:
        ✅ Loves building cool stuff with React & Node.js
        ✅ Has 3+ years making magic happen in JavaScript land
        ✅ Isn't afraid of AWS, Docker, or microservices
        ✅ Wants equity + competitive salary ($90k-$120k)
        
        What you'll do:
        🔥 Build features that millions will use
        🔥 Work directly with our CEO and CTO
        🔥 Shape our tech stack and architecture
        
        Perks:
        🏖️ Unlimited PTO (we actually mean it!)
        🏠 Remote-first culture
        🍕 Weekly team lunches
        📚 $2k learning budget
        
        Sound like your jam? Let's chat! 💬
      `;

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Full-Stack Developer',
        company: 'Fintech Startup',
        skills: ['React', 'Node.js', 'JavaScript', 'AWS', 'Docker', 'microservices'],
        experienceYears: 3,
        salary: {
          min: 90000,
          max: 120000,
          currency: 'USD',
          period: 'yearly'
        },
        benefits: [
          'Unlimited PTO',
          'Remote-first culture',
          'Weekly team lunches',
          '$2k learning budget',
          'Equity compensation'
        ],
        workType: 'remote',
        responsibilities: [
          'Build features that millions will use',
          'Work directly with CEO and CTO',
          'Shape tech stack and architecture'
        ]
      });

      const result = await jobExtractor.analyzeJobContentWithAI(startupJobContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Full-Stack Developer');
      expect(result.data.skills).toContain('React');
      expect(result.data.skills).toContain('Node.js');
      expect(result.data.salary.min).toBe(90000);
      expect(result.data.benefits).toContain('Unlimited PTO');
      expect(result.data.workType).toBe('remote');
    });

    it('should handle technical job postings with detailed requirements', async () => {
      const technicalJobContent = `
        Principal Software Architect - Cloud Infrastructure
        
        Location: San Francisco, CA (Hybrid)
        Salary: $180,000 - $250,000 + equity
        
        We're looking for a Principal Software Architect to lead our cloud infrastructure initiatives.
        
        Technical Requirements:
        • 8+ years of software engineering experience
        • 5+ years in distributed systems architecture
        • Expert-level knowledge of:
          - Kubernetes orchestration and service mesh (Istio/Linkerd)
          - Cloud platforms: AWS (EKS, ECS, Lambda), GCP (GKE), Azure (AKS)
          - Infrastructure as Code: Terraform, CloudFormation, Pulumi
          - Monitoring: Prometheus, Grafana, Jaeger, DataDog
          - CI/CD: Jenkins, GitLab CI, GitHub Actions, ArgoCD
        • Programming languages: Go, Python, Java, or Rust
        • Database technologies: PostgreSQL, MongoDB, Redis, Elasticsearch
        
        Architecture Experience:
        • Microservices architecture and domain-driven design
        • Event-driven architectures (Kafka, RabbitMQ, AWS SQS)
        • API design (REST, GraphQL, gRPC)
        • Security best practices (OAuth2, JWT, mTLS)
        • Performance optimization and scalability patterns
        
        Leadership Responsibilities:
        • Lead technical design reviews and architecture decisions
        • Mentor senior engineers and establish engineering standards
        • Collaborate with product and business stakeholders
        • Drive technical roadmap and technology adoption
        
        Education: MS/PhD in Computer Science or equivalent experience
        
        Benefits:
        • Comprehensive health, dental, vision insurance
        • 401(k) with 6% company match
        • $5,000 annual learning and development budget
        • Flexible PTO and sabbatical program
        • Top-tier equipment and home office stipend
      `;

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Principal Software Architect - Cloud Infrastructure',
        company: 'Tech Company',
        location: 'San Francisco, CA (Hybrid)',
        experienceYears: 8,
        skills: [
          'Kubernetes', 'Istio', 'Linkerd', 'AWS', 'EKS', 'ECS', 'Lambda',
          'GCP', 'GKE', 'Azure', 'AKS', 'Terraform', 'CloudFormation', 'Pulumi',
          'Prometheus', 'Grafana', 'Jaeger', 'DataDog', 'Jenkins', 'GitLab CI',
          'GitHub Actions', 'ArgoCD', 'Go', 'Python', 'Java', 'Rust',
          'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Microservices',
          'Kafka', 'RabbitMQ', 'AWS SQS', 'REST', 'GraphQL', 'gRPC',
          'OAuth2', 'JWT', 'mTLS'
        ],
        requirements: [
          '8+ years of software engineering experience',
          '5+ years in distributed systems architecture',
          'Expert-level knowledge of Kubernetes and service mesh',
          'MS/PhD in Computer Science or equivalent experience'
        ],
        responsibilities: [
          'Lead technical design reviews and architecture decisions',
          'Mentor senior engineers and establish engineering standards',
          'Collaborate with product and business stakeholders',
          'Drive technical roadmap and technology adoption'
        ],
        salary: {
          min: 180000,
          max: 250000,
          currency: 'USD',
          period: 'yearly',
          equity: true
        },
        benefits: [
          'Comprehensive health, dental, vision insurance',
          '401(k) with 6% company match',
          '$5,000 annual learning budget',
          'Flexible PTO and sabbatical program',
          'Home office stipend'
        ],
        workType: 'hybrid',
        education: 'MS/PhD in Computer Science'
      });

      const result = await jobExtractor.analyzeJobContentWithAI(technicalJobContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Principal Software Architect - Cloud Infrastructure');
      expect(result.data.experienceYears).toBe(8);
      expect(result.data.skills).toContain('Kubernetes');
      expect(result.data.skills).toContain('Terraform');
      expect(result.data.skills).toContain('Go');
      expect(result.data.salary.min).toBe(180000);
      expect(result.data.workType).toBe('hybrid');
    });

    it('should handle job postings with non-standard formatting and structure', async () => {
      const unstructuredJobContent = `
        URGENT HIRING!!! Software Developer needed ASAP
        
        Company Name: DevCorp Solutions
        We need someone NOW who can code in JavaScript and knows React
        Must have at least 2 years experience
        Will pay $70k to $85k depending on skills
        
        WHAT WE NEED:
        Someone who can work fast and deliver results
        Knowledge of databases (MySQL preferred)
        Git experience is a must
        Should know how to work in a team
        
        WHAT WE OFFER:
        Good salary as mentioned above
        Health insurance after 90 days
        Parking spot included
        Coffee and snacks in office
        
        This is a full-time position in our downtown office
        Some remote work possible but mostly in-office
        
        If interested, send resume immediately!
        We are interviewing this week and want to hire by Friday!
      `;

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Software Developer',
        company: 'DevCorp Solutions',
        location: 'Downtown office',
        experienceYears: 2,
        skills: ['JavaScript', 'React', 'MySQL', 'Git'],
        requirements: [
          'At least 2 years experience',
          'JavaScript and React knowledge',
          'Database experience (MySQL preferred)',
          'Git experience',
          'Team collaboration skills'
        ],
        salary: {
          min: 70000,
          max: 85000,
          currency: 'USD',
          period: 'yearly'
        },
        benefits: [
          'Health insurance after 90 days',
          'Parking spot included',
          'Coffee and snacks in office'
        ],
        workType: 'hybrid',
        employmentType: 'full-time',
        urgency: 'high'
      });

      const result = await jobExtractor.analyzeJobContentWithAI(unstructuredJobContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Software Developer');
      expect(result.data.company).toBe('DevCorp Solutions');
      expect(result.data.skills).toContain('JavaScript');
      expect(result.data.skills).toContain('React');
      expect(result.data.salary.min).toBe(70000);
    });
  });

  describe('AI Service Fallback Scenarios', () => {
    it('should gracefully fallback to rule-based extraction when AI fails', async () => {
      const jobContent = `
        Data Scientist Position
        Analytics Corp
        Remote Work Available
        
        Requirements:
        - 4+ years of data science experience
        - Python, R, SQL skills required
        - Machine learning expertise
        - PhD in Statistics or related field preferred
        
        Salary: $95,000 - $130,000 annually
        Benefits: Health insurance, 401k, flexible hours
      `;

      // Mock AI service failure
      geminiService.extractJobDetails.mockRejectedValue(new Error('AI service temporarily unavailable'));

      const result = await jobExtractor.analyzeJobContentWithAI(jobContent);

      expect(result.success).toBe(true);
      expect(result.method).toBe('manual');
      expect(result.data.title).toContain('Data Scientist');
      expect(result.data.company).toContain('Analytics Corp');
      expect(result.data.experienceYears).toBe(4);
      expect(result.data.skills).toContain('python');
      expect(result.data.skills).toContain('sql');
    });

    it('should handle partial AI responses and fill missing data', async () => {
      const jobContent = `
        Frontend Developer - React Specialist
        TechStart Inc.
        Austin, TX
        
        We need a React developer with 3+ years experience.
        Must know TypeScript, Redux, and modern CSS.
        Competitive salary and great benefits package.
      `;

      // Mock AI returning partial data
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Frontend Developer - React Specialist',
        skills: ['React', 'TypeScript', 'Redux']
        // Missing other fields
      });

      const result = await jobExtractor.analyzeJobContentWithAI(jobContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Frontend Developer - React Specialist');
      expect(result.data.skills).toContain('React');
      expect(result.data.skills).toContain('TypeScript');
      
      // Should fill in missing fields with defaults or extracted values
      expect(result.data.company).toBeDefined();
      expect(result.data.location).toBeDefined();
      expect(result.data.experienceYears).toBeDefined();
    });

    it('should validate and correct AI-extracted data', async () => {
      const jobContent = `
        Junior Web Developer
        Small Agency
        Entry level position, no experience required
        HTML, CSS, JavaScript basics needed
      `;

      // Mock AI returning inconsistent data
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Junior Web Developer',
        company: 'Small Agency',
        experienceYears: 10, // Inconsistent with "entry level"
        skills: ['HTML', 'CSS', 'JavaScript'],
        requirements: ['No experience required']
      });

      const result = await jobExtractor.analyzeJobContentWithAI(jobContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Junior Web Developer');
      
      // Should correct inconsistent experience years for entry level
      expect(result.data.experienceYears).toBeLessThan(10);
    });

    it('should handle AI responses with invalid data types', async () => {
      const jobContent = 'Software Engineer at Tech Company';

      // Mock AI returning invalid data types
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Software Engineer',
        company: 'Tech Company',
        skills: 'JavaScript, React, Node.js', // Should be array
        experienceYears: '5 years', // Should be number
        requirements: 'Bachelor degree and 5 years experience' // Should be array
      });

      const result = await jobExtractor.analyzeJobContentWithAI(jobContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Software Engineer');
      
      // Should convert to correct data types
      expect(Array.isArray(result.data.skills)).toBe(true);
      expect(typeof result.data.experienceYears).toBe('number');
      expect(Array.isArray(result.data.requirements)).toBe(true);
    });
  });

  describe('Rule-Based Extraction Accuracy', () => {
    it('should accurately extract skills from various formats', async () => {
      const skillsTestContent = `
        Full Stack Developer Position
        
        Technical Skills Required:
        • Frontend: React.js, Vue.js, Angular, HTML5, CSS3, SASS
        • Backend: Node.js, Express.js, Python, Django, Flask
        • Databases: MongoDB, PostgreSQL, MySQL, Redis
        • Cloud: AWS (EC2, S3, RDS), Docker, Kubernetes
        • Tools: Git, Jenkins, JIRA, Slack
        
        Programming Languages: JavaScript (ES6+), TypeScript, Python, Java
        Frameworks & Libraries: React, Redux, Material-UI, Bootstrap
        
        Must have experience with: REST APIs, GraphQL, microservices
      `;

      // Force rule-based extraction by making AI fail
      geminiService.extractJobDetails.mockRejectedValue(new Error('AI unavailable'));

      const result = await jobExtractor.analyzeJobContentWithAI(skillsTestContent);

      expect(result.success).toBe(true);
      expect(result.method).toBe('manual');
      
      const skills = result.data.skills;
      expect(skills).toContain('react');
      expect(skills).toContain('vue');
      expect(skills).toContain('node.js');
      expect(skills).toContain('python');
      expect(skills).toContain('mongodb');
      expect(skills).toContain('aws');
      expect(skills).toContain('docker');
      expect(skills).toContain('git');
    });

    it('should extract experience requirements from different phrasings', async () => {
      const experienceTestCases = [
        {
          content: 'Minimum 5 years of software development experience',
          expected: 5
        },
        {
          content: 'At least 3 years working with React',
          expected: 3
        },
        {
          content: '7+ years in full-stack development',
          expected: 7
        },
        {
          content: '2-4 years of relevant experience preferred',
          expected: 2
        },
        {
          content: 'Senior level position requiring extensive experience',
          expected: 5
        },
        {
          content: 'Entry-level opportunity, fresh graduates welcome',
          expected: 1
        }
      ];

      for (const testCase of experienceTestCases) {
        geminiService.extractJobDetails.mockRejectedValue(new Error('AI unavailable'));
        
        const result = await jobExtractor.analyzeJobContentWithAI(testCase.content);
        
        expect(result.success).toBe(true);
        expect(result.data.experienceYears).toBe(testCase.expected);
      }
    });

    it('should extract salary information from various formats', async () => {
      const salaryTestCases = [
        {
          content: 'Salary: $80,000 - $100,000 per year',
          expectedMin: 80000,
          expectedMax: 100000
        },
        {
          content: 'Compensation range: $120k to $150k annually',
          expectedMin: 120000,
          expectedMax: 150000
        },
        {
          content: 'We offer competitive salary of $95,000',
          expectedSalary: 95000
        }
      ];

      for (const testCase of salaryTestCases) {
        geminiService.extractJobDetails.mockRejectedValue(new Error('AI unavailable'));
        
        const result = await jobExtractor.analyzeJobContentWithAI(testCase.content);
        
        expect(result.success).toBe(true);
        
        if (testCase.expectedMin && testCase.expectedMax) {
          expect(result.data.salary.min).toBe(testCase.expectedMin);
          expect(result.data.salary.max).toBe(testCase.expectedMax);
        }
      }
    });

    it('should identify work type from job descriptions', async () => {
      const workTypeTestCases = [
        {
          content: 'This is a fully remote position with flexible hours',
          expected: 'remote'
        },
        {
          content: 'Hybrid work model - 3 days in office, 2 days remote',
          expected: 'hybrid'
        },
        {
          content: 'On-site position at our downtown headquarters',
          expected: 'onsite'
        },
        {
          content: 'Office-based role with occasional travel',
          expected: 'onsite'
        }
      ];

      for (const testCase of workTypeTestCases) {
        geminiService.extractJobDetails.mockRejectedValue(new Error('AI unavailable'));
        
        const result = await jobExtractor.analyzeJobContentWithAI(testCase.content);
        
        expect(result.success).toBe(true);
        expect(result.data.workType).toBe(testCase.expected);
      }
    });
  });

  describe('AI Response Quality Assessment', () => {
    it('should assess confidence based on AI response completeness', async () => {
      const completeJobContent = `
        Senior Backend Engineer
        TechCorp Inc.
        San Francisco, CA
        
        5+ years experience required
        Skills: Java, Spring Boot, PostgreSQL, AWS
        Salary: $130k - $160k
        Full-time position with benefits
      `;

      // Mock complete AI response
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Senior Backend Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        experienceYears: 5,
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
        salary: { min: 130000, max: 160000, currency: 'USD', period: 'yearly' },
        employmentType: 'full-time'
      });

      const result = await jobExtractor.analyzeJobContentWithAI(completeJobContent);

      expect(result.success).toBe(true);
      expect(result.confidence).toBe(0.9); // High confidence for complete data
    });

    it('should handle AI responses with confidence scoring', async () => {
      const ambiguousJobContent = `
        Looking for someone to help with our website.
        Some coding experience preferred.
        Contact us for details.
      `;

      // Mock AI response with low confidence indicators
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Web Developer', // AI's best guess
        company: 'Unknown Company',
        skills: ['HTML', 'CSS'], // Basic assumption
        confidence: 0.3 // AI indicates low confidence
      });

      const result = await jobExtractor.analyzeJobContentWithAI(ambiguousJobContent);

      expect(result.success).toBe(true);
      expect(result.confidence).toBeLessThan(0.7); // Should reflect uncertainty
    });
  });
});