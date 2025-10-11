/**
 * Error Handling Tests for JobExtractor Service
 * Focuses on edge cases, error scenarios, and resilience testing
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

describe('JobExtractor Error Handling Tests', () => {
  let jobExtractor;

  beforeEach(() => {
    jobExtractor = new JobExtractor();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Network and Connectivity Errors', () => {
    it('should handle DNS resolution failures', async () => {
      const invalidDomainUrl = 'https://non-existent-job-site-12345.com/job/123';
      
      global.fetch.mockRejectedValue(new Error('getaddrinfo ENOTFOUND'));

      const result = await jobExtractor.extractJobDetails(invalidDomainUrl);

      expect(result.success).toBe(false);
      expect(result.error).toContain('getaddrinfo ENOTFOUND');
      expect(result.method).toBe('failed');
      expect(result.confidence).toBe(0);
    });

    it('should handle connection timeouts', async () => {
      const timeoutUrl = 'https://slow-job-site.com/job/timeout';
      
      global.fetch.mockImplementation(() => 
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 50);
        })
      );

      const result = await jobExtractor.extractJobDetails(timeoutUrl);

      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');
      expect(result.extractionTime).toBeGreaterThan(0);
    });

    it('should handle HTTP error responses', async () => {
      const errorUrl = 'https://indeed.com/job/not-found';
      
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('<html><body>404 - Job not found</body></html>')
      });

      const result = await jobExtractor.extractJobDetails(errorUrl);

      expect(result.success).toBe(false);
      expect(result.requiresManualInput).toBe(true);
    });

    it('should handle rate limiting responses', async () => {
      const rateLimitedUrl = 'https://linkedin.com/jobs/view/123';
      
      global.fetch.mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Map([['Retry-After', '60']]),
        text: () => Promise.resolve('Rate limit exceeded')
      });

      const result = await jobExtractor.extractJobDetails(rateLimitedUrl);

      expect(result.success).toBe(false);
      expect(result.supportedSite).toBe(true);
      expect(result.extractionGuidance).toContain('LINKEDIN');
    });
  });

  describe('AI Service Failures', () => {
    it('should handle Gemini service unavailability', async () => {
      const testUrl = 'https://indeed.com/job/ai-failure-test';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body>Job content</body></html>')
      });

      geminiService.extractJobDetails.mockRejectedValue(new Error('AI service temporarily unavailable'));

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.method).toBe('ai-gemini');
      expect(result.error).toContain('AI service temporarily unavailable');
      expect(result.aiCapable).toBe(true);
    });

    it('should handle AI service quota exceeded', async () => {
      const testUrl = 'https://glassdoor.com/job/quota-test';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>Job posting content</html>')
      });

      geminiService.extractJobDetails.mockRejectedValue(new Error('Quota exceeded. Please try again later.'));

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Quota exceeded');
      expect(result.requiresManualInput).toBe(true);
    });

    it('should handle malformed AI responses', async () => {
      const testUrl = 'https://monster.com/job/malformed-response';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>Valid job content</html>')
      });

      // Mock AI service returning invalid data structure
      geminiService.extractJobDetails.mockResolvedValue(null);

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.method).toBe('ai-gemini');
    });

    it('should handle AI service returning incomplete data', async () => {
      const jobContent = 'Software Engineer position at Tech Company';
      
      // Mock AI returning minimal/incomplete data
      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Software Engineer'
        // Missing other required fields
      });

      const result = await jobExtractor.analyzeJobContentWithAI(jobContent);

      expect(result.success).toBe(true);
      expect(result.method).toBe('ai-gemini-manual');
      
      // Should fill in defaults for missing fields
      expect(result.data.company).toBeDefined();
      expect(result.data.skills).toBeDefined();
      expect(Array.isArray(result.data.skills)).toBe(true);
    });
  });

  describe('Input Validation Errors', () => {
    it('should handle null or undefined URLs', async () => {
      const nullResult = await jobExtractor.extractJobDetails(null);
      const undefinedResult = await jobExtractor.extractJobDetails(undefined);

      expect(nullResult.success).toBe(false);
      expect(undefinedResult.success).toBe(false);
      expect(nullResult.error).toContain('Invalid');
      expect(undefinedResult.error).toContain('Invalid');
    });

    it('should handle empty or whitespace URLs', async () => {
      const emptyResult = await jobExtractor.extractJobDetails('');
      const whitespaceResult = await jobExtractor.extractJobDetails('   ');

      expect(emptyResult.success).toBe(false);
      expect(whitespaceResult.success).toBe(false);
    });

    it('should handle malformed URLs', async () => {
      const malformedUrls = [
        'htp://invalid-protocol.com',
        'https:/missing-slash.com',
        'https://spaces in url.com/job',
        'javascript:alert("xss")'
      ];

      for (const url of malformedUrls) {
        const result = await jobExtractor.extractJobDetails(url);
        expect(result.success).toBe(false);
      }
    });

    it('should handle extremely long URLs', async () => {
      const longUrl = 'https://example.com/job/' + 'a'.repeat(2000);
      
      const result = await jobExtractor.extractJobDetails(longUrl);
      
      // Should either handle gracefully or reject appropriately
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Content Processing Errors', () => {
    it('should handle empty HTML responses', async () => {
      const testUrl = 'https://indeed.com/job/empty-content';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('')
      });

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.requiresManualInput).toBe(true);
    });

    it('should handle non-HTML content types', async () => {
      const testUrl = 'https://jobsite.com/job.pdf';
      
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/pdf']]),
        text: () => Promise.resolve('%PDF-1.4 binary content...')
      });

      geminiService.extractJobDetails.mockRejectedValue(new Error('Cannot process PDF content'));

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot process PDF');
    });

    it('should handle corrupted or binary content', async () => {
      const testUrl = 'https://jobsite.com/job/corrupted';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('\x00\x01\x02\x03binary data')
      });

      geminiService.extractJobDetails.mockRejectedValue(new Error('Invalid content encoding'));

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid content');
    });

    it('should handle extremely large HTML responses', async () => {
      const testUrl = 'https://jobsite.com/job/large-page';
      const largeHtml = '<html><body>' + 'x'.repeat(1000000) + '</body></html>';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(largeHtml)
      });

      geminiService.extractJobDetails.mockRejectedValue(new Error('Content too large to process'));

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(false);
      expect(result.error).toContain('too large');
    });
  });

  describe('Manual Content Analysis Errors', () => {
    it('should handle null or undefined job content', async () => {
      const nullResult = await jobExtractor.analyzeJobContentWithAI(null);
      const undefinedResult = await jobExtractor.analyzeJobContentWithAI(undefined);

      expect(nullResult.success).toBe(false);
      expect(undefinedResult.success).toBe(false);
    });

    it('should handle empty job content', async () => {
      const emptyResult = await jobExtractor.analyzeJobContentWithAI('');
      const whitespaceResult = await jobExtractor.analyzeJobContentWithAI('   \n\t   ');

      expect(emptyResult.success).toBe(false);
      expect(whitespaceResult.success).toBe(false);
    });

    it('should handle non-job related content', async () => {
      const nonJobContent = `
        This is a recipe for chocolate cake.
        Ingredients: flour, sugar, eggs, chocolate.
        Instructions: Mix ingredients and bake for 30 minutes.
      `;

      geminiService.extractJobDetails.mockRejectedValue(new Error('Content does not appear to be a job posting'));

      const result = await jobExtractor.analyzeJobContentWithAI(nonJobContent);

      expect(result.success).toBe(true); // Should fallback to rule-based
      expect(result.method).toBe('manual');
      
      // Rule-based extraction should still attempt to extract what it can
      expect(result.data.title).toBeDefined();
    });

    it('should handle content with special characters and encoding issues', async () => {
      const specialCharContent = `
        Développeur Senior - Société Française
        Salaire: 50.000€ - 70.000€
        Compétences: JavaScript, React, Node.js
        Expérience: 5+ années
      `;

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Développeur Senior',
        company: 'Société Française',
        skills: ['JavaScript', 'React', 'Node.js'],
        experienceYears: 5
      });

      const result = await jobExtractor.analyzeJobContentWithAI(specialCharContent);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Développeur Senior');
      expect(result.data.skills).toContain('JavaScript');
    });
  });

  describe('Cache and Memory Management Errors', () => {
    it('should handle cache corruption gracefully', async () => {
      const testUrl = 'https://test.com/job/cache-corruption';
      
      // Manually corrupt the cache
      const cacheKey = jobExtractor.getCacheKey(testUrl);
      jobExtractor.cache.set(cacheKey, {
        data: null, // Corrupted data
        timestamp: Date.now(),
        confidence: 0.9
      });

      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>Fresh content</html>')
      });

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Fresh Job',
        company: 'Fresh Company'
      });

      const result = await jobExtractor.extractJobDetails(testUrl);

      // Should handle corrupted cache and fetch fresh data
      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Fresh Job');
    });

    it('should handle memory pressure with large cache', async () => {
      // Fill cache with many entries
      for (let i = 0; i < 1000; i++) {
        const url = `https://test.com/job/${i}`;
        const cacheKey = jobExtractor.getCacheKey(url);
        jobExtractor.cache.set(cacheKey, {
          data: { title: `Job ${i}`, company: `Company ${i}` },
          timestamp: Date.now(),
          confidence: 0.8
        });
      }

      const testUrl = 'https://test.com/job/memory-test';
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>Memory test job</html>')
      });

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'Memory Test Job',
        company: 'Memory Test Company'
      });

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Memory Test Job');
    });
  });

  describe('Concurrent Access and Race Conditions', () => {
    it('should handle concurrent requests to the same URL', async () => {
      const testUrl = 'https://concurrent-test.com/job/123';
      let fetchCallCount = 0;

      global.fetch.mockImplementation(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(`<html>Content ${fetchCallCount}</html>`)
        });
      });

      geminiService.extractJobDetails.mockImplementation((content) => {
        const match = content.match(/Content (\d+)/);
        const id = match ? match[1] : '1';
        return Promise.resolve({
          title: `Job ${id}`,
          company: `Company ${id}`
        });
      });

      // Make multiple concurrent requests
      const promises = Array(5).fill().map(() => 
        jobExtractor.extractJobDetails(testUrl)
      );

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Should use cache for subsequent requests
      const cachedResults = results.filter(r => r.method === 'cached');
      expect(cachedResults.length).toBeGreaterThan(0);
    });

    it('should handle cache invalidation during concurrent access', async () => {
      const testUrl = 'https://cache-invalidation-test.com/job/123';
      
      // Set up initial cache entry that's about to expire
      const cacheKey = jobExtractor.getCacheKey(testUrl);
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      
      jobExtractor.cache.set(cacheKey, {
        data: { title: 'Old Job', company: 'Old Company' },
        timestamp: oldTimestamp,
        confidence: 0.8
      });

      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html>New job content</html>')
      });

      geminiService.extractJobDetails.mockResolvedValue({
        title: 'New Job',
        company: 'New Company'
      });

      const result = await jobExtractor.extractJobDetails(testUrl);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('New Job'); // Should get fresh data
      expect(result.method).toBe('ai-gemini'); // Should not use expired cache
    });
  });
});