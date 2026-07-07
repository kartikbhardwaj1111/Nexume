/**
 * Groq AI Service
 * Standard service class to call Groq API using native fetch
 */

export class GroqService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.model = 'llama-3.3-70b-versatile'; // Llama 3.3 70B is highly accurate and fast
    this.endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  }

  /**
   * Checks whether the Groq API service is configured and available.
   */
  async isAvailable() {
    return typeof this.apiKey === 'string' && this.apiKey.trim().startsWith('gsk_');
  }

  /**
   * Sends a general completion prompt to Groq.
   */
  async analyzeContent(prompt) {
    if (!this.apiKey) {
      throw new Error('Groq API Key is not set.');
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a high-fidelity ATS recruiter assistant. You must analyze the text and output a strictly formatted JSON response.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (status ${response.status}): ${errorText}`);
      }

      const result = await response.json();
      return result.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq service error:', error);
      throw error;
    }
  }

  /**
   * Validate if text is a resume using LLM reasoning.
   */
  async validateResumeText(resumeText) {
    const prompt = `Determine whether the following document content is an actual candidate's professional resume or CV.
Return ONLY a valid JSON object matching this schema:
{
  "isResume": boolean,
  "confidence": number,
  "documentType": string,
  "reason": string
}

Here are the guidelines:
- If it is a cover letter, job description, source code file, configuration file, or random text, set isResume to false.
- Be thorough. A resume must contain details about a specific candidate (name, contact, education, skills, or experience).

DOCUMENT CONTENT:
${resumeText.substring(0, 5000)}`;

    try {
      const content = await this.analyzeContent(prompt);
      return JSON.parse(content);
    } catch (error) {
      console.error('Groq AI resume validation failed:', error);
      throw error;
    }
  }

  /**
   * Build resume analysis prompt
   */
  buildResumeAnalysisPrompt(resumeText, jobDescription) {
    return `
You are an expert ATS (Applicant Tracking System) analyzer and career consultant. Analyze the following resume against the job description and provide a detailed ATS compatibility score.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription || "Not provided (General Resume Audit). Perform a general resume formatting, readability, and content structure audit. Identify potential issues (such as missing standard sections, lack of action verbs or quantifiable impact, poor structure, or formatting problems) and compare the candidate's core skills and experience against general industry-standard resume expectations rather than a specific job description."}

Please analyze and provide a JSON response with the following structure:
{
  "overall_score": <number between 0-100>,
  "confidence": <number between 0-1>,
  "pillars": {
    "core_skills": {
      "score": <number between 0-40>,
      "matched": [<array of matched skills>],
      "required_count": <number of required skills>
    },
    "relevant_experience": {
      "score": <number between 0-30>,
      "candidate_years": <number>,
      "jd_years": <number>,
      "evidence": [<array of experience evidence>]
    },
    "tools_methodologies": {
      "score": <number between 0-20>,
      "matched": [<array of matched tools/methodologies>]
    },
    "education_credentials": {
      "score": <number between 0-10>,
      "degree": "<degree level>",
      "notes": "<education notes>"
    }
  },
  "recommendations": [<array of specific improvement recommendations>],
  "errors": [<array of any errors or issues found>]
}

Focus on:
1. Keyword matching between resume and job description
2. ATS-friendly formatting
3. Relevant experience alignment
4. Skills gap analysis
5. Education requirements match
6. Industry-specific terminology usage

Provide actionable recommendations for improving ATS compatibility.
`;
  }

  async analyzeResume(resumeText, jobDescription) {
    try {
      const prompt = this.buildResumeAnalysisPrompt(resumeText, jobDescription);
      const content = await this.analyzeContent(prompt);
      return this.parseResumeAnalysisResponse(content);
    } catch (error) {
      console.error('Groq resume analysis failed:', error);
      throw error;
    }
  }

  async analyzeResumeWithContext(resumeText, jobDescription, contextPrompt, jobData) {
    try {
      const prompt = `
You are an expert ATS analyzer. Analyze this resume against the job description with special context: ${contextPrompt}.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

JSON SCHEMA:
{
  "overall_score": <number between 0-100>,
  "confidence": <number between 0-1>,
  "pillars": {
    "core_skills": {
      "score": <number between 0-40>,
      "matched": [<array of matched skills>],
      "required_count": <number of required skills>
    },
    "relevant_experience": {
      "score": <number between 0-30>,
      "candidate_years": <number>,
      "jd_years": <number>,
      "evidence": [<array of experience evidence>]
    },
    "tools_methodologies": {
      "score": <number between 0-20>,
      "matched": [<array of matched tools/methodologies>]
    },
    "education_credentials": {
      "score": <number between 0-10>,
      "degree": "<degree level>",
      "notes": "<education notes>"
    }
  },
  "recommendations": [<array of specific improvement recommendations>],
  "errors": [<array of any errors or issues found>]
}
`;
      const content = await this.analyzeContent(prompt);
      return this.parseResumeAnalysisResponse(content);
    } catch (error) {
      console.error('Groq contextual analysis failed:', error);
      throw error;
    }
  }

  parseResumeAnalysisResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        overall_score: Math.max(0, Math.min(100, parsed.overall_score || 0)),
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.8)),
        pillars: {
          core_skills: {
            score: Math.max(0, Math.min(40, parsed.pillars?.core_skills?.score || 0)),
            matched: Array.isArray(parsed.pillars?.core_skills?.matched) 
              ? parsed.pillars.core_skills.matched 
              : [],
            required_count: parsed.pillars?.core_skills?.required_count || 0
          },
          relevant_experience: {
            score: Math.max(0, Math.min(30, parsed.pillars?.relevant_experience?.score || 0)),
            candidate_years: parsed.pillars?.relevant_experience?.candidate_years || 0,
            jd_years: parsed.pillars?.relevant_experience?.jd_years || 0,
            evidence: Array.isArray(parsed.pillars?.relevant_experience?.evidence)
              ? parsed.pillars.relevant_experience.evidence
              : []
          },
          tools_methodologies: {
            score: Math.max(0, Math.min(20, parsed.pillars?.tools_methodologies?.score || 0)),
            matched: Array.isArray(parsed.pillars?.tools_methodologies?.matched)
              ? parsed.pillars.tools_methodologies.matched
              : []
          },
          education_credentials: {
            score: Math.max(0, Math.min(10, parsed.pillars?.education_credentials?.score || 0)),
            degree: parsed.pillars?.education_credentials?.degree || 'Not specified',
            notes: parsed.pillars?.education_credentials?.notes || ''
          }
        },
        recommendations: Array.isArray(parsed.recommendations) 
          ? parsed.recommendations.slice(0, 10) 
          : [],
        errors: Array.isArray(parsed.errors) ? parsed.errors : []
      };
    } catch (error) {
      console.error('Failed to parse Groq response:', error);
      throw new Error('Failed to parse AI response');
    }
  }
}

export const groqService = new GroqService();
export default groqService;
