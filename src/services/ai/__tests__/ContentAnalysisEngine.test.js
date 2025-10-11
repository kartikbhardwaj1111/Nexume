/**
 * Unit tests for Content Analysis Engine
 * Tests the rule-based scoring system accuracy and analysis capabilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContentAnalysisEngine, contentAnalysisEngine } from '../ContentAnalysisEngine.js'

// Mock the ATSFormatDetector
vi.mock('../ATSFormatDetector.js', () => ({
  atsFormatDetector: {
    analyzeATSCompatibility: vi.fn(() => ({
      overallScore: 75,
      recommendations: ['Use standard fonts', 'Add clear section headers']
    }))
  }
}))

describe('ContentAnalysisEngine', () => {
  let engine

  beforeEach(() => {
    engine = new ContentAnalysisEngine()
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with skills database', () => {
      expect(engine.skillsDatabase).toBeDefined()
      expect(engine.skillsDatabase.programming).toBeDefined()
      expect(engine.skillsDatabase.business).toBeDefined()
      expect(engine.skillsDatabase.healthcare).toBeDefined()
      expect(engine.skillsDatabase.education).toBeDefined()
    })

    it('should initialize with industry keywords', () => {
      expect(engine.industryKeywords).toBeDefined()
      expect(engine.industryKeywords.technology).toBeDefined()
      expect(engine.industryKeywords.finance).toBeDefined()
      expect(engine.industryKeywords.healthcare).toBeDefined()
    })

    it('should initialize with ATS keywords', () => {
      expect(engine.atsKeywords).toBeDefined()
      expect(engine.atsKeywords.actionVerbs).toBeDefined()
      expect(engine.atsKeywords.quantifiers).toBeDefined()
      expect(engine.atsKeywords.certifications).toBeDefined()
    })
  })

  describe('Skills Analysis', () => {
    it('should correctly identify skills in resume and job description', () => {
      const resumeText = 'I have experience with JavaScript, React, and Python programming'
      const jobDescription = 'Looking for JavaScript developer with React experience'
      
      const result = engine.analyzeSkills(resumeText, jobDescription)
      
      expect(result.resumeSkills).toContain('javascript')
      expect(result.resumeSkills).toContain('react')
      expect(result.resumeSkills).toContain('python')
      expect(result.requiredSkills).toContain('javascript')
      expect(result.requiredSkills).toContain('react')
      expect(result.matchedSkills).toContain('javascript')
      expect(result.matchedSkills).toContain('react')
    })

    it('should calculate skill relevance correctly', () => {
      const resumeText = 'JavaScript React Node.js'
      const jobDescription = 'JavaScript React Python'
      
      const result = engine.analyzeSkills(resumeText, jobDescription)
      
      expect(result.skillRelevance).toBeCloseTo(0.67, 1) // 2 out of 3 required skills
    })

    it('should identify tools and methodologies', () => {
      const resumeText = 'Experience with Agile development, Docker, and CI/CD'
      const jobDescription = 'Agile team using Docker'
      
      const result = engine.analyzeSkills(resumeText, jobDescription)
      
      expect(result.resumeTools).toContain('agile')
      expect(result.resumeTools).toContain('docker')
      expect(result.matchedTools).toContain('agile')
      expect(result.matchedTools).toContain('docker')
    })
  })

  describe('Experience Analysis', () => {
    it('should extract years of experience correctly', () => {
      const resumeText = 'I have 5 years of experience in software development'
      const jobDescription = 'Minimum 3 years experience required'
      
      const result = engine.analyzeExperience(resumeText, jobDescription)
      
      expect(result.candidateYears).toBe(5)
      expect(result.requiredYears).toBe(3)
    })

    it('should detect action verbs and quantifiers', () => {
      const resumeText = 'Managed a team of 10 developers, increased productivity by 25%'
      const jobDescription = 'Management experience preferred'
      
      const result = engine.analyzeExperience(resumeText, jobDescription)
      
      expect(result.actionVerbCount).toBeGreaterThan(0)
      expect(result.quantifierCount).toBeGreaterThan(0)
      expect(result.evidence.length).toBeGreaterThan(0)
      // Check if leadership is indicated (may vary based on implementation)
      const hasLeadershipEvidence = result.evidence.some(e => e.includes('Leadership') || e.includes('action verbs') || e.includes('quantifiable'))
      expect(hasLeadershipEvidence).toBe(true)
    })

    it('should estimate experience when not explicitly stated', () => {
      const resumeText = 'Software Engineer position at Company A, Developer role at Company B'
      const jobDescription = 'Entry level position'
      
      const result = engine.analyzeExperience(resumeText, jobDescription)
      
      expect(result.candidateYears).toBeGreaterThan(0)
      expect(result.requiredYears).toBe(1) // Entry level
    })
  })

  describe('Education Analysis', () => {
    it('should detect bachelor degree correctly', () => {
      const resumeText = 'Bachelor of Science in Computer Science'
      const jobDescription = 'Degree preferred'
      
      const result = engine.analyzeEducation(resumeText, jobDescription)
      
      expect(result.educationLevel).toBe('bachelors')
      expect(result.degree).toBe('Bachelor\'s degree')
    })

    it('should detect master degree correctly', () => {
      const resumeText = 'Master of Business Administration (MBA)'
      const jobDescription = 'Advanced degree preferred'
      
      const result = engine.analyzeEducation(resumeText, jobDescription)
      
      expect(result.educationLevel).toBe('masters')
      expect(result.degree).toBe('Master\'s degree')
    })

    it('should detect certifications', () => {
      const resumeText = 'AWS Certified Solutions Architect, PMP Certified'
      const jobDescription = 'Certifications a plus'
      
      const result = engine.analyzeEducation(resumeText, jobDescription)
      
      expect(result.certifications).toContain('aws')
      expect(result.certifications).toContain('pmp')
      expect(result.certificationCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Formatting Analysis', () => {
    it('should detect proper resume sections', () => {
      const resumeText = `
        EXPERIENCE
        Software Engineer at Company
        
        EDUCATION
        Bachelor's Degree
        
        SKILLS
        JavaScript, React
      `
      
      const result = engine.analyzeFormatting(resumeText)
      
      expect(result.foundSections).toContain('experience')
      expect(result.foundSections).toContain('education')
      expect(result.foundSections).toContain('skills')
      expect(result.sectionCount).toBe(3)
    })

    it('should detect bullet points and headers', () => {
      const resumeText = `
        EXPERIENCE
        • Software Engineer
        • Developed applications
      `
      
      const result = engine.analyzeFormatting(resumeText)
      
      expect(result.hasBulletPoints).toBe(true)
      expect(result.hasHeaders).toBe(true)
    })

    it('should detect contact information', () => {
      const resumeText = 'John Doe\njohn.doe@email.com\n(555) 123-4567'
      
      const result = engine.analyzeFormatting(resumeText)
      
      expect(result.hasEmail).toBe(true)
      expect(result.hasPhone).toBe(true)
    })
  })

  describe('Keyword Analysis', () => {
    it('should match keywords between resume and job description', () => {
      const resumeText = 'Software engineer with leadership experience'
      const jobDescription = 'Looking for software engineer with leadership skills'
      
      const result = engine.analyzeKeywords(resumeText, jobDescription)
      
      expect(result.matchedKeywords).toContain('software')
      expect(result.matchedKeywords).toContain('engineer')
      expect(result.matchedKeywords).toContain('leadership')
      expect(result.keywordDensity).toBeGreaterThan(0)
    })

    it('should identify action verbs and soft skills', () => {
      const resumeText = 'Managed team, achieved goals, demonstrated leadership'
      const jobDescription = 'Management role'
      
      const result = engine.analyzeKeywords(resumeText, jobDescription)
      
      expect(result.actionVerbs).toContain('managed')
      expect(result.actionVerbs).toContain('achieved')
      expect(result.softSkills).toContain('leadership')
    })
  })

  describe('Industry Analysis', () => {
    it('should detect technology industry correctly', () => {
      const resumeText = 'Software developer with programming experience'
      const jobDescription = 'Software development role requiring programming skills'
      
      const result = engine.analyzeIndustryFit(resumeText, jobDescription)
      
      expect(result.detectedIndustry).toBe('technology')
      expect(result.industryAlignment).toBeGreaterThan(0)
    })

    it('should detect finance industry correctly', () => {
      const resumeText = 'Financial analyst with investment experience'
      const jobDescription = 'Financial analysis role in investment banking'
      
      const result = engine.analyzeIndustryFit(resumeText, jobDescription)
      
      expect(result.detectedIndustry).toBe('finance')
      expect(result.resumeIndustryMatches).toContain('financial')
      expect(result.resumeIndustryMatches).toContain('investment')
    })
  })

  describe('Comprehensive Analysis', () => {
    it('should provide complete analysis with all components', () => {
      const resumeText = `
        John Doe
        john.doe@email.com
        (555) 123-4567
        
        EXPERIENCE
        • Software Engineer at Tech Company (3 years)
        • Developed web applications using JavaScript and React
        • Managed team of 5 developers
        • Increased productivity by 25%
        
        EDUCATION
        • Bachelor of Science in Computer Science
        
        SKILLS
        • JavaScript, React, Node.js
        • Agile development
      `
      
      const jobDescription = `
        Software Engineer Position
        We are looking for a JavaScript developer with React experience.
        Minimum 2 years experience required.
        Bachelor's degree preferred.
      `
      
      const result = engine.analyzeContent(resumeText, jobDescription)
      
      expect(result.overall_score).toBeGreaterThan(50)
      expect(result.confidence).toBeGreaterThan(0.6)
      expect(result.pillars.core_skills.score).toBeGreaterThan(0)
      expect(result.pillars.relevant_experience.score).toBeGreaterThan(0)
      expect(result.pillars.tools_methodologies.score).toBeGreaterThan(0)
      expect(result.pillars.education_credentials.score).toBeGreaterThan(0)
      expect(result.recommendations).toBeDefined()
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    it('should generate appropriate recommendations', () => {
      const resumeText = 'Basic resume with minimal information'
      const jobDescription = 'Complex job requiring many skills and experience'
      
      const result = engine.analyzeContent(resumeText, jobDescription)
      
      expect(result.recommendations).toBeDefined()
      expect(result.recommendations.length).toBeGreaterThan(0)
      expect(result.recommendations.length).toBeLessThanOrEqual(8)
    })
  })

  describe('Singleton Instance', () => {
    it('should export a singleton instance', () => {
      expect(contentAnalysisEngine).toBeInstanceOf(ContentAnalysisEngine)
    })

    it('should maintain consistent analysis results', () => {
      const resumeText = 'Test resume'
      const jobDescription = 'Test job'
      
      const result1 = contentAnalysisEngine.analyzeContent(resumeText, jobDescription)
      const result2 = contentAnalysisEngine.analyzeContent(resumeText, jobDescription)
      
      expect(result1.overall_score).toBe(result2.overall_score)
      expect(result1.confidence).toBe(result2.confidence)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty resume text', () => {
      const result = engine.analyzeContent('', 'Job description')
      
      expect(result.overall_score).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.pillars).toBeDefined()
    })

    it('should handle empty job description', () => {
      const result = engine.analyzeContent('Resume text', '')
      
      expect(result.overall_score).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.pillars).toBeDefined()
    })

    it('should handle very long text', () => {
      const longText = 'A'.repeat(10000)
      const result = engine.analyzeContent(longText, 'Job description')
      
      expect(result.overall_score).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
    })
  })
})