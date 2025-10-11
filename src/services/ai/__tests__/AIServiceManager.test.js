/**
 * Unit tests for AI Service Manager
 * Tests service failover mechanisms, rule-based scoring accuracy, and service health monitoring
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AIServiceManager, { aiServiceManager } from '../AIServiceManager.js'

// Mock the ContentAnalysisEngine
vi.mock('../ContentAnalysisEngine.js', () => ({
  contentAnalysisEngine: {
    analyzeContent: vi.fn(() => ({
      overall_score: 75,
      confidence: 0.8,
      pillars: {
        core_skills: { score: 30, matched: ['javascript', 'react'], required_count: 5 },
        relevant_experience: { score: 25, candidate_years: 3, jd_years: 2, evidence: ['3 years experience'] },
        tools_methodologies: { score: 15, matched: ['agile', 'git'] },
        education_credentials: { score: 8, degree: 'Bachelor\'s degree', notes: 'Computer Science' }
      },
      recommendations: ['Add more technical skills', 'Include quantifiable achievements'],
      errors: []
    }))
  }
}))

describe('AIServiceManager', () => {
  let serviceManager
  let mockAnalyzeContent

  beforeEach(async () => {
    // Create a fresh instance for each test
    serviceManager = new AIServiceManager()
    
    // Get the mock function
    const { contentAnalysisEngine } = await import('../ContentAnalysisEngine.js')
    mockAnalyzeContent = contentAnalysisEngine.analyzeContent
    
    // Reset all mocks
    vi.clearAllMocks()
    
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Service Initialization', () => {
    it('should initialize with correct default service status', () => {
      const status = serviceManager.getCurrentService()
      
      expect(status).toEqual({
        primary: 'unavailable',
        fallback: 'rule-based',
        confidence: 0.5
      })
    })

    it('should initialize services map with correct priorities', () => {
      expect(serviceManager.services.size).toBe(2)
      expect(serviceManager.services.has('huggingface')).toBe(true)
      expect(serviceManager.services.has('openai')).toBe(true)
      
      const hfService = serviceManager.services.get('huggingface')
      const openaiService = serviceManager.services.get('openai')
      
      expect(hfService.priority).toBe(1)
      expect(openaiService.priority).toBe(2)
    })

    it('should initialize fallback analyzer', () => {
      expect(serviceManager.fallbackAnalyzer).toBeDefined()
      expect(typeof serviceManager.fallbackAnalyzer.analyze).toBe('function')
    })
  })

  describe('Service Failover Mechanisms', () => {
    it('should use AI service when available', async () => {
      // Mock HuggingFace availability check to return true
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200
        })
        // Mock the actual analysis call
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve([{ generated_text: 'AI response' }])
        })

      const result = await serviceManager.analyzeResume('test resume', 'test job')
      
      expect(result.analysisMethod).toBe('ai')
      expect(result.serviceName).toBe('HuggingFace')
      expect(serviceManager.serviceStatus.primary).toBe('available')
      expect(serviceManager.serviceStatus.confidence).toBe(0.9)
    })

    it('should fallback to rule-based when AI services unavailable', async () => {
      // Mock HuggingFace as unavailable
      global.fetch.mockRejectedValue(new Error('Service unavailable'))

      const result = await serviceManager.analyzeResume('test resume', 'test job')
      
      expect(result.analysisMethod).toBe('rule-based')
      expect(result.serviceName).toBe('Rule-based Analyzer')
      expect(serviceManager.serviceStatus.primary).toBe('unavailable')
      expect(serviceManager.serviceStatus.fallback).toBe('rule-based')
      expect(serviceManager.serviceStatus.confidence).toBe(0.6)
    })

    it('should use content analysis as ultimate fallback', async () => {
      // Mock all services failing
      global.fetch.mockRejectedValue(new Error('Network error'))
      
      // Mock the fallback analyzer to throw an error to trigger ultimate fallback
      const originalAnalyze = serviceManager.fallbackAnalyzer.analyze
      serviceManager.fallbackAnalyzer.analyze = vi.fn(() => {
        throw new Error('Fallback analyzer failed')
      })

      const result = await serviceManager.analyzeResume('test resume', 'test job')
      
      expect(result.analysisMethod).toBe('content-analysis')
      expect(result.serviceName).toBe('Content Analyzer')
      expect(serviceManager.serviceStatus.primary).toBe('unavailable')
      expect(serviceManager.serviceStatus.fallback).toBe('content-analysis')
      expect(serviceManager.serviceStatus.confidence).toBe(0.4)
      
      // Restore original function
      serviceManager.fallbackAnalyzer.analyze = originalAnalyze
    })

    it('should try services in priority order', async () => {
      const checkAvailabilitySpy = vi.spyOn(serviceManager, 'checkHuggingFaceAvailability')
      const checkOpenAISpy = vi.spyOn(serviceManager, 'checkOpenAIAvailability')
      
      // Mock HuggingFace as unavailable, OpenAI as unavailable
      checkAvailabilitySpy.mockResolvedValue(false)
      checkOpenAISpy.mockResolvedValue(false)

      await serviceManager.getAvailableService()
      
      expect(checkAvailabilitySpy).toHaveBeenCalled()
      expect(checkOpenAISpy).toHaveBeenCalled()
    })
  })

  describe('Service Health Monitoring', () => {
    it('should check HuggingFace availability correctly', async () => {
      // Test successful availability check
      global.fetch.mockResolvedValueOnce({
        status: 200,
        ok: true
      })

      const isAvailable = await serviceManager.checkHuggingFaceAvailability()
      expect(isAvailable).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })

    it('should detect HuggingFace service unavailable', async () => {
      // Test service unavailable (503)
      global.fetch.mockResolvedValueOnce({
        status: 503,
        ok: false
      })

      const isAvailable = await serviceManager.checkHuggingFaceAvailability()
      expect(isAvailable).toBe(false)
    })

    it('should handle network errors in availability check', async () => {
      // Test network error
      global.fetch.mockRejectedValue(new Error('Network error'))

      const isAvailable = await serviceManager.checkHuggingFaceAvailability()
      expect(isAvailable).toBe(false)
    })

    it('should return false for OpenAI availability (not implemented)', async () => {
      const isAvailable = await serviceManager.checkOpenAIAvailability()
      expect(isAvailable).toBe(false)
    })

    it('should update service status correctly during analysis', async () => {
      // Mock HuggingFace availability check to return true
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200
        })
        // Mock the actual analysis call
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve([{ generated_text: 'AI response' }])
        })

      await serviceManager.analyzeResume('test resume', 'test job')
      
      const status = serviceManager.getCurrentService()
      expect(status.primary).toBe('available')
      expect(status.confidence).toBe(0.9)
    })
  })

  describe('Rule-based Scoring Accuracy', () => {
    it('should use enhanced content analysis engine for rule-based scoring', () => {
      const result = serviceManager.getRuleBasedScore('test resume', 'test job')
      
      expect(mockAnalyzeContent).toHaveBeenCalledWith('test resume', 'test job')
      expect(result.overall_score).toBe(75)
      expect(result.confidence).toBe(0.8)
    })

    it('should fallback to basic scoring when enhanced engine fails', () => {
      mockAnalyzeContent.mockImplementationOnce(() => {
        throw new Error('Enhanced engine failed')
      })

      const result = serviceManager.getRuleBasedScore('test resume with javascript react experience', 'job requiring javascript react')
      
      expect(result.overall_score).toBeGreaterThan(20)
      expect(result.overall_score).toBeLessThan(95)
      expect(result.pillars).toBeDefined()
      expect(result.recommendations).toBeDefined()
    })

    it('should calculate core skills score correctly', () => {
      const analysis = {
        resumeSkills: ['javascript', 'react', 'node'],
        requiredSkills: ['javascript', 'react', 'python'],
        matchedSkills: ['javascript', 'react']
      }

      const score = serviceManager.calculateCoreSkillsScore(analysis)
      
      expect(score.score).toBeGreaterThan(0)
      expect(score.score).toBeLessThanOrEqual(40)
      expect(score.matched).toEqual(['javascript', 'react'])
      expect(score.required_count).toBe(3)
    })

    it('should calculate experience score correctly', () => {
      const analysis = {
        candidateYears: 5,
        requiredYears: 3
      }

      const score = serviceManager.calculateExperienceScore(analysis)
      
      expect(score.score).toBe(30) // 10 base + 20 for meeting requirements
      expect(score.candidate_years).toBe(5)
      expect(score.jd_years).toBe(3)
    })

    it('should calculate tools score correctly', () => {
      const analysis = {
        matchedTools: ['agile', 'git', 'docker'],
        resumeTools: ['agile', 'git', 'docker', 'jenkins']
      }

      const score = serviceManager.calculateToolsScore(analysis)
      
      expect(score.score).toBeGreaterThan(0)
      expect(score.score).toBeLessThanOrEqual(20)
      expect(score.matched).toEqual(['agile', 'git', 'docker'])
    })

    it('should calculate education score correctly', () => {
      const analysisWithBachelor = {
        hasEducation: true,
        educationLevel: 'bachelor'
      }

      const score = serviceManager.calculateEducationScore(analysisWithBachelor)
      
      expect(score.score).toBe(8)
      expect(score.degree).toBe('Bachelor\'s degree')
    })

    it('should generate appropriate recommendations', () => {
      const analysis = {
        matchedSkills: ['javascript'],
        requiredSkills: ['javascript', 'react', 'node'],
        candidateYears: 1,
        requiredYears: 3,
        hasHeaders: false,
        hasBulletPoints: false,
        wordCount: 150,
        matchedTools: [],
        hasEducation: false
      }

      const recommendations = serviceManager.generateRecommendations(analysis)
      
      expect(recommendations).toContain('Add more technical skills that match the job requirements')
      expect(recommendations).toContain('Highlight relevant experience and transferable skills')
      expect(recommendations).toContain('Use clear section headers (Experience, Education, Skills)')
      expect(recommendations.length).toBeLessThanOrEqual(5)
    })
  })

  describe('HuggingFace Integration', () => {
    it('should make correct API call to HuggingFace', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ generated_text: 'AI analysis result' }])
      })

      await serviceManager.analyzeWithHuggingFace('test resume', 'test job')
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test resume')
        })
      )
    })

    it('should handle HuggingFace API errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(serviceManager.analyzeWithHuggingFace('test resume', 'test job'))
        .rejects.toThrow('HuggingFace API error: 500')
    })

    it('should convert HuggingFace response correctly', () => {
      const huggingFaceResult = [{ generated_text: 'AI response' }]
      const result = serviceManager.convertHuggingFaceResponse(huggingFaceResult, 'test resume', 'test job')
      
      expect(result.confidence).toBeGreaterThan(0.8) // Enhanced confidence
      expect(result.recommendations[0]).toBe('AI-enhanced analysis completed')
    })
  })

  describe('OpenAI Integration', () => {
    it('should throw error for unimplemented OpenAI service', async () => {
      await expect(serviceManager.analyzeWithOpenAI('test resume', 'test job'))
        .rejects.toThrow('OpenAI service not yet implemented')
    })
  })

  describe('Basic Content Analysis', () => {
    it('should provide basic scoring when all else fails', () => {
      const result = serviceManager.getBasicContentScore(
        'Software Engineer with experience in web development. Skilled in JavaScript and React.',
        'Looking for JavaScript developer'
      )
      
      expect(result.overall_score).toBeGreaterThan(30)
      expect(result.overall_score).toBeLessThanOrEqual(75)
      expect(result.confidence).toBe(0.4)
      expect(result.pillars).toBeDefined()
      expect(result.recommendations).toBeDefined()
    })

    it('should score based on content length and structure', () => {
      const longResume = 'A'.repeat(1000) + ' experience education skills'
      const result = serviceManager.getBasicContentScore(longResume, 'test job')
      
      expect(result.overall_score).toBeGreaterThan(50) // Should get points for length and structure
    })
  })

  describe('Content Analysis', () => {
    it('should extract skills correctly', () => {
      const resumeText = 'I have experience with JavaScript, React, and Node.js'
      const jobDescription = 'Looking for JavaScript and Python developer'
      
      const analysis = serviceManager.analyzeContent(resumeText, jobDescription)
      
      expect(analysis.resumeSkills).toContain('javascript')
      expect(analysis.resumeSkills).toContain('react')
      expect(analysis.resumeSkills).toContain('node')
      expect(analysis.requiredSkills).toContain('javascript')
      expect(analysis.requiredSkills).toContain('python')
      expect(analysis.matchedSkills).toContain('javascript')
    })

    it('should extract experience years correctly', () => {
      const resumeText = 'I have 5 years of experience in software development'
      const jobDescription = 'Minimum 3 years experience required'
      
      const analysis = serviceManager.analyzeContent(resumeText, jobDescription)
      
      expect(analysis.candidateYears).toBe(5)
      expect(analysis.requiredYears).toBe(3)
    })

    it('should detect education correctly', () => {
      const resumeText = 'Bachelor of Science in Computer Science from University'
      const jobDescription = 'Degree preferred'
      
      const analysis = serviceManager.analyzeContent(resumeText, jobDescription)
      
      expect(analysis.hasEducation).toBe(true)
      expect(analysis.educationLevel).toBe('bachelor')
    })

    it('should analyze formatting correctly', () => {
      const resumeText = `
        EXPERIENCE
        • Software Engineer at Company
        • Developed web applications
        
        EDUCATION
        • Bachelor's Degree
      `
      
      const analysis = serviceManager.analyzeContent(resumeText, 'test job')
      
      expect(analysis.hasHeaders).toBe(true)
      expect(analysis.hasBulletPoints).toBe(true)
    })
  })

  describe('Singleton Instance', () => {
    it('should export a singleton instance', () => {
      expect(aiServiceManager).toBeInstanceOf(AIServiceManager)
    })

    it('should maintain state across calls', async () => {
      // Mock HuggingFace availability check to return true
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200
        })
        // Mock the actual analysis call
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve([{ generated_text: 'AI response' }])
        })

      await aiServiceManager.analyzeResume('test resume', 'test job')
      
      const status = aiServiceManager.getCurrentService()
      expect(status.primary).toBe('available')
    })
  })

  describe('Error Handling', () => {
    it('should handle network timeouts gracefully', async () => {
      global.fetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )

      const result = await serviceManager.analyzeResume('test resume', 'test job')
      
      expect(result.analysisMethod).toBe('rule-based')
      expect(result.serviceName).toBe('Rule-based Analyzer')
    })

    it('should handle malformed API responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(null) // Malformed response
      })

      const result = await serviceManager.analyzeResume('test resume', 'test job')
      
      // Should still work with rule-based enhancement
      expect(result).toBeDefined()
      expect(result.overall_score).toBeGreaterThan(0)
    })
  })
})