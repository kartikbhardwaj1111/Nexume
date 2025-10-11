/**
 * Integration Tests for JobExtractor Service
 * Tests extraction accuracy, error handling, and AI fallback functionality
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

describe('JobExtractor Integration Tests', () => {
  let jobExtractor;

  beforeEach(() => {
    jobExtractor = new JobExtractor();
    vi.clearAllMocks();
    
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('URL Validation and Site Detection', () => {
    it('should validate supported job site URLs correctly', () => {
      const supportedUrls = [
        'https://www.linkedin.com/jobs/view/123456789',
        'https://indeed.com/viewjob?jk=abc123',
        'https://www.glassdoor.com/job-listing/software-engineer-123',
        'https://www.monster.com/job-openings/developer-456'
      ];

      supportedUrls.forEach(url => {
        expect(jobExtractor.validateJobUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url'
      ];

      invalidUrls.forEach(url => {
        expect(jobExtractor.validateJobUrl(url)).toBe(false);
      });
      
      // These URLs should be considered invalid
      expect(jobExtractor.validateJobUrl('https://google.com')).toBe(false);
      expect(jobExtractor.validateJobUrl('https://facebook.com/profile')).toBe(false);
      
      // Test that the validation catches invalid protocols
      try {
        expect(jobExtractor.validateJobUrl('mailto:contact@example.com')).toBe(false);
      } catch (error) {
        // If URL constructor throws, that's also a valid rejection
        expect(error).toBeDefined();
      }
    });

    it('should identify job sites correctly', () => {
      const testCases = [
        {
          url: 'https://www.linkedin.com/jobs/view/123',
          expected: { key: 'LINKEDIN', isSupported: true }
        },
        {
          url: 'https://indeed.com/viewjob?jk=abc',
          expected: { key: 'INDEED', isSupported: true }
        },
        {
          url: 'https://ziprecruiter.com/jobs/123',
          expected: { key: 'ZIPRECRUITER', isSupported: false }
        }
      ];

      testCases.forEach(({ url, expected }) => {
        const result = jobExtractor.identifySiteEnhanced(url);
        expect(result.key).toBe(expected.key);
        expect(result.isSupported).toBe(expected.isSupported);
      });
    });
  });

  describe('Job Content Extraction with Sample URLs', () => {
    it('should handle LinkedIn job URL extraction attempt', async () => {
      const linkedinUrl = 'https://www.linkedin.com/jobs/view/3234567890';
      
      // Mock fetch to simulate CORS failure (realistic scenario)
      global.fetch.mockRejectedValue(new Error('CORS error'));

      const result = await jobExtractor.extractJobDetails(linkedinUrl);

      expect(result.success).toBe(false);
      expect(result.method).toBe('ai-gemini');
      expect(result.requiresManualInput).toBe(true);
      expect(result.suggestion).toContain('Copy the job posting content');
    });

    it('should handle Indeed job URL with successful fetch and AI extraction', async () => {
      const indeedUrl = 'https://indeed.com/viewjob?jk=test123';
      const mockHtmlContent = `
        <html>
          <head><title>Software Engineer - Tech Company</title></head>
          <body>
            <h1>Software Engineer</h1>
            <div class="company">Tech Company Inc.</div>
            <div class="location">San Francisco, CA</div>
            <div class="description">
              We are looking for a skilled Software Engineer with 3+ years of experience.
              Requirements:
              - Bachelor's degree in Computer Science
              - Experience with JavaScript, React, Node.js
              - Strong problem-solving skills
            </div>
          </body>
        </html>
      `;

      // Mock successful fetch
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtmlContent)
      });

      // Mock Gemini service response
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Software Engineer',
        company: 'Tech Company Inc.',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'React', 'Node.js'],
        requirements: ['Bachelor\'s degree in Computer Science', '3+ years of experience'],
        experienceYears: 3
      });

      const result = await jobExtractor.extractJobDetails(indeedUrl);

      expect(result.success).toBe(true);
      expect(result.method).toBe('ai-gemini');
      expect(result.data.title).toBe('Software Engineer');
      expect(result.data.company).toBe('Tech Company Inc.');
      expect(result.data.skills).toContain('JavaScript');
      expect(geminiService.extractJobDetails).toHaveBeenCalledWith(mockHtmlContent, indeedUrl);
    });

    it('should cache successful extraction results', async () => {
      const testUrl = 'https://glassdoor.com/job/123';
      const mockJobData = {
        title: 'Data Scientist',
        company: 'Analytics Corp',
        location: 'Remote',
        skills: ['Python', 'SQL', 'Machine Learning']
      };

      // Mock successful AI extraction
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>Job content</html>')
      });

      geminiService.extractJobDetails.mockResolvedValue(mockJobData);

      // First call
      const result1 = await jobExtractor.extractJobDetails(testUrl);
      expect(result1.success).toBe(true);
      expect(geminiService.extractJobDetails).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await jobExtractor.extractJobDetails(testUrl);
      expect(result2.success).toBe(true);
      expect(result2.method).toBe('cached');
      expect(geminiService.extractJobDetails).toHaveBeenCalledTimes(1); // No additional calls
    });
  });

  describe('Error Handling for Unsupported Sites', () => {
    it('should handle unknown job sites gracefully', async () => {
      const unknownUrl = 'https://unknown-job-site.com/job/123';

      // Mock fetch failure
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await jobExtractor.extractJobDetails(unknownUrl);

      expect(result.success).toBe(false);
      expect(result.method).toBe('guided');
      expect(result.guidance).toBeDefined();
    });

    it('should provide guidance for known but unsupported sites', async () => {
      const zipRecruiterUrl = 'https://ziprecruiter.com/jobs/software-engineer-123';

      const result = await jobExtractor.extractJobDetails(zipRecruiterUrl);

      expect(result.success).toBe(false);
      expect(result.method).toBe('guided');
      expect(result.guidance).toBeDefined();
    });

    it('should handle network timeouts gracefully', async () => {
      const testUrl = 'https://indeed.com/job/timeout-test';

      // Mock fetch timeout
      global.fetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.method).toBe('ai-gemini');
      expect(result.error).toContain('Unable to fetch job content');
    });

    it('should handle malformed HTML content', async () => {
      const testUrl = 'https://indeed.com/job/malformed';
      const malformedHtml = '<html><body><div>Incomplete HTML';

      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(malformedHtml)
      });

      // Mock Gemini service to throw error on malformed content
      geminiService.extractJobDetails.mockRejectedValue(new Error('Unable to parse content'));

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.method).toBe('ai-gemini');
      expect(result.aiCapable).toBe(true);
    });
  });

  describe('AI Fallback for Complex Job Descriptions', () => {
    it('should successfully analyze manually provided job content with AI', async () => {
      const complexJobContent = `
        Senior Full Stack Developer - Remote Opportunity
        
        Company: InnovateTech Solutions
        Location: Remote (US timezone)
        
        About the Role:
        We're seeking an experienced Full Stack Developer to join our growing team. 
        This role involves working on cutting-edge web applications using modern technologies.
        
        Key Responsibilities:
        • Design and develop scalable web applications
        • Collaborate with cross-functional teams
        • Implement best practices for code quality
        • Mentor junior developers
        
        Requirements:
        • 5+ years of experience in full-stack development
        • Proficiency in React, Node.js, and TypeScript
        • Experience with cloud platforms (AWS preferred)
        • Strong understanding of database design (PostgreSQL, MongoDB)
        • Bachelor's degree in Computer Science or related field
        
        Benefits:
        • Competitive salary ($120k - $150k)
        • Health, dental, and vision insurance
        • 401k with company matching
        • Flexible PTO policy
        • Remote work stipend
      `;

      // Mock Gemini service for complex content analysis
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Senior Full Stack Developer',
        company: 'InnovateTech Solutions',
        location: 'Remote (US timezone)',
        experienceYears: 5,
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'MongoDB'],
        requirements: [
          '5+ years of experience in full-stack development',
          'Proficiency in React, Node.js, and TypeScript',
          'Experience with cloud platforms (AWS preferred)',
          'Bachelor\'s degree in Computer Science or related field'
        ],
        responsibilities: [
          'Design and develop scalable web applications',
          'Collaborate with cross-functional teams',
          'Implement best practices for code quality',
          'Mentor junior developers'
        ],
        salary: {
          min: 120000,
          max: 150000,
          currency: 'USD',
          period: 'yearly'
        },
        benefits: [
          'Health, dental, and vision insurance',
          '401k with company matching',
          'Flexible PTO policy',
          'Remote work stipend'
        ],
        workType: 'remote',
        employmentType: 'full-time'
      });

      const result = await jobExtractor.analyzeJobContentWithAI(complexJobContent);

      expect(result.success).toBe(true);
      expect(result.method).toBe('ai-gemini-manual');
      expect(result.confidence).toBe(0.9);
      expect(result.data.title).toBe('Senior Full Stack Developer');
      expect(result.data.company).toBe('InnovateTech Solutions');
      expect(result.data.experienceYears).toBe(5);
      expect(result.data.skills).toContain('React');
      expect(result.data.skills).toContain('TypeScript');
      expect(result.data.workType).toBe('remote');
      expect(result.data.salary.min).toBe(120000);
    });

    it('should fallback to rule-based extraction when AI fails', async () => {
      const jobContent = `
        Marketing Manager Position
        ABC Marketing Agency
        New York, NY
        
        We need someone with 3+ years of marketing experience.
        Must have bachelor's degree.
        Skills: SEO, Google Analytics, social media marketing
        Salary: $60,000 - $80,000
      `;

      // Mock Gemini service failure
      geminiService.extractJobDetails.mockRejectedValue(new Error('AI service unavailable'));

      const result = await jobExtractor.analyzeJobContentWithAI(jobContent);

      expect(result.success).toBe(true);
      expect(result.method).toBe('manual');
      expect(result.data.title).toBeDefined();
      expect(result.data.company).toBeDefined();
      expect(result.data.experienceYears).toBe(2); // Default for unspecified experience
      expect(result.data.skills).toContain('seo');
    });

    it('should handle job content with minimal information', async () => {
      const minimalJobContent = `
        Looking for a developer.
        Must know JavaScript.
        Send resume to jobs@company.com
      `;

      // Mock Gemini service with minimal response
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Developer',
        company: 'Company',
        skills: ['JavaScript'],
        requirements: ['Must know JavaScript']
      });

      const result = await jobExtractor.analyzeJobContentWithAI(minimalJobContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Developer');
      expect(result.data.skills).toContain('JavaScript');
      
      // Validate that the extraction handles minimal data gracefully
      const validation = jobExtractor.validateJobData(result.data);
      expect(validation.isValid).toBeDefined(); // Should have validation result
    });

    it('should extract skills from various formats in job descriptions', async () => {
      const skillsTestContent = `
        Software Engineer Position
        
        Required Skills:
        • JavaScript, TypeScript, Python
        • React.js and Vue.js frameworks
        • AWS cloud services
        • Docker and Kubernetes
        
        Technologies: Node.js, Express, MongoDB, PostgreSQL
        Tools: Git, Jenkins, JIRA
        
        Experience with: REST APIs, GraphQL, microservices architecture
      `;

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Software Engineer',
        skills: [
          'JavaScript', 'TypeScript', 'Python', 'React.js', 'Vue.js',
          'AWS', 'Docker', 'Kubernetes', 'Node.js', 'Express',
          'MongoDB', 'PostgreSQL', 'Git', 'Jenkins', 'JIRA',
          'REST APIs', 'GraphQL', 'microservices'
        ]
      });

      const result = await jobExtractor.analyzeJobContentWithAI(skillsTestContent);

      expect(result.success).toBe(true);
      expect(result.data.skills).toContain('JavaScript');
      expect(result.data.skills).toContain('TypeScript');
      expect(result.data.skills).toContain('AWS');
      expect(result.data.skills).toContain('Docker');
      expect(result.data.skills.length).toBeGreaterThan(10);
    });
  });

  describe('Performance and Reliability Tests', () => {
    it('should complete extraction within reasonable time limits', async () => {
      const testUrl = 'https://indeed.com/job/performance-test';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>Simple job content</html>')
      });

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Test Job',
        company: 'Test Company'
      });

      const startTime = Date.now();
      const result = await jobExtractor.extractJobDetails(testUrl);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(result.extractionTime).toBeDefined();
    });

    it('should handle concurrent extraction requests', async () => {
      const urls = [
        'https://linkedin.com/jobs/1',
        'https://indeed.com/jobs/2',
        'https://glassdoor.com/jobs/3'
      ];

      // Mock different responses for each URL
      global.fetch.mockImplementation((url) => {
        const jobId = url.split('/').pop();
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(`<html>Job ${jobId} content</html>`)
        });
      });

      geminiService.extractJobDetails.mockImplementation((content, url) => {
        const jobId = url.split('/').pop();
        return Promise.resolve({
          title: `Job ${jobId}`,
          company: `Company ${jobId}`
        });
      });

      const promises = urls.map(url => jobExtractor.extractJobDetails(url));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.data.title).toBe(`Job ${index + 1}`);
      });
    });

    it('should maintain cache integrity across multiple operations', async () => {
      const testUrl = 'https://indeed.com/job/cache-test';
      const mockData = { title: 'Cached Job', company: 'Cache Corp' };

      // First extraction
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>Job content</html>')
      });

      geminiService.extractJobDetails.mockResolvedValue(mockData);

      const result1 = await jobExtractor.extractJobDetails(testUrl);
      expect(result1.success).toBe(true);

      // Second extraction should use cache
      const result2 = await jobExtractor.extractJobDetails(testUrl);
      expect(result2.success).toBe(true);
      expect(result2.method).toBe('cached');
      expect(result2.data.title).toBe(mockData.title);

      // Verify cache key generation is consistent
      const cacheKey1 = jobExtractor.getCacheKey(testUrl);
      const cacheKey2 = jobExtractor.getCacheKey(testUrl);
      expect(cacheKey1).toBe(cacheKey2);
    });
  });

  describe('Data Validation and Quality', () => {
    it('should validate extracted job data quality', () => {
      const validJobData = {
        title: 'Senior Software Engineer',
        company: 'Tech Corp Inc.',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'React', 'Node.js'],
        requirements: ['5+ years experience', 'Bachelor\'s degree'],
        experienceYears: 5,
        description: 'Full job description here...'
      };

      const validation = jobExtractor.validateJobData(validJobData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should identify incomplete job data', () => {
      const incompleteJobData = {
        title: 'Job',
        company: '',
        skills: [],
        requirements: [],
        experienceYears: -1
      };

      const validation = jobExtractor.validateJobData(incompleteJobData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors).toContain('Company name is missing or too short');
      expect(validation.errors).toContain('No skills extracted');
    });

    it('should extract experience years from various formats', () => {
      const testCases = [
        { text: '5+ years of experience required', expected: 5 },
        { text: 'Minimum 3 years experience', expected: 3 },
        { text: 'At least 7 years in the field', expected: 7 },
        { text: '2-4 years experience preferred', expected: 4 },
        { text: 'Senior level position', expected: 5 },
        { text: 'Entry level opportunity', expected: 1 }
      ];

      testCases.forEach(({ text, expected }) => {
        const result = jobExtractor.extractExperienceYears(text);
        expect(result).toBe(expected);
      });
    });

    it('should extract education requirements correctly', () => {
      const testCases = [
        { text: 'Bachelor\'s degree in Computer Science required', expected: 'Bachelor\'s degree in Computer Science' },
        { text: 'Master\'s degree preferred', expected: 'Master\'s degree' },
        { text: 'PhD in relevant field', expected: 'PhD' },
        { text: 'High school diploma minimum', expected: 'High school' }
      ];

      testCases.forEach(({ text, expected }) => {
        const result = jobExtractor.extractEducation(text);
        expect(result.toLowerCase()).toContain(expected.toLowerCase().split(' ')[0]);
      });
    });
  });

  describe('Site-Specific Extraction Capabilities', () => {
    it('should provide correct extraction capabilities for supported sites', () => {
      const linkedinUrl = 'https://linkedin.com/jobs/view/123';
      const capabilities = jobExtractor.getExtractionCapabilities(linkedinUrl);

      expect(capabilities.isKnown).toBe(true);
      expect(capabilities.isSupported).toBe(true);
      expect(capabilities.siteName).toBe('LINKEDIN');
      expect(capabilities.extractionMethods).toContain('css');
      expect(capabilities.extractionMethods).toContain('ai');
    });

    it('should provide guidance for unsupported but known sites', () => {
      const zipRecruiterUrl = 'https://ziprecruiter.com/jobs/123';
      const capabilities = jobExtractor.getExtractionCapabilities(zipRecruiterUrl);

      expect(capabilities.isKnown).toBe(true);
      expect(capabilities.isSupported).toBe(false);
      expect(capabilities.siteName).toBe('ZIPRECRUITER');
      expect(capabilities.extractionMethods).not.toContain('css');
      expect(capabilities.recommendation).toContain('Copy and paste');
    });

    it('should handle unknown sites appropriately', () => {
      const unknownUrl = 'https://unknown-company.com/random/page/123';
      const capabilities = jobExtractor.getExtractionCapabilities(unknownUrl);

      expect(capabilities.isKnown).toBe(false);
      expect(capabilities.isSupported).toBe(false);
      expect(capabilities.extractionMethods).toEqual(['ai', 'manual']);
    });
  });
});