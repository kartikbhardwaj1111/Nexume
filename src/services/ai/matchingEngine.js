import { geminiService } from './GeminiService.js';
import { validateResumeText } from '../../utils/validation.js';

/**
 * Computes the cosine similarity between two numerical vectors.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Splits resume text into semantic chunks (experience, projects, summary).
 */
export function chunkResume(text) {
  if (!text) return [];
  
  const chunks = [];
  const lines = text.split('\n');
  let currentChunk = [];
  let currentSection = 'General';
  
  // Section keywords to keep track of section context
  const sectionKeywords = {
    experience: /experience|employment|history|work|professional/i,
    skills: /skills|technologies|proficiencies|competencies/i,
    education: /education|academic|credentials/i,
    projects: /projects|academic projects/i
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line is a new section header
    let isHeader = false;
    for (const [section, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(trimmed) && trimmed.length < 30) {
        if (currentChunk.length > 0) {
          chunks.push({
            section: currentSection,
            text: currentChunk.join('\n')
          });
          currentChunk = [];
        }
        currentSection = section.toUpperCase();
        isHeader = true;
        break;
      }
    }

    if (isHeader) continue;

    // Accumulate lines or push if double spacing/bullet point
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // Individual bullet point can be a semantic chunk to track micro-evidence
      if (currentChunk.length > 0) {
        chunks.push({
          section: currentSection,
          text: currentChunk.join('\n')
        });
        currentChunk = [];
      }
      chunks.push({
        section: currentSection,
        text: trimmed
      });
    } else {
      currentChunk.push(trimmed);
      if (currentChunk.length >= 3) { // group lines for context
        chunks.push({
          section: currentSection,
          text: currentChunk.join('\n')
        });
        currentChunk = [];
      }
    }
  }

  // Push any remaining lines
  if (currentChunk.length > 0) {
    chunks.push({
      section: currentSection,
      text: currentChunk.join('\n')
    });
  }

  return chunks.filter(c => c.text.trim().length > 10);
}

/**
 * Calculates semantic alignment between two job titles using embeddings.
 */
export async function calculateRoleAlignment(titleA, titleB) {
  if (!titleA || !titleB) return 0.5;
  try {
    const vecA = await geminiService.embedText(titleA.trim());
    const vecB = await geminiService.embedText(titleB.trim());
    return cosineSimilarity(vecA, vecB);
  } catch (error) {
    console.warn('Role title embedding alignment failed, using basic heuristic:', error);
    const tA = titleA.toLowerCase();
    const tB = titleB.toLowerCase();
    if (tA === tB) return 1.0;
    if (tA.includes(tB) || tB.includes(tA)) return 0.85;
    return 0.5; // fallback neutral alignment
  }
}

/**
 * Parse candidate's experience years from resume
 */
function extractYearsOfExperience(text) {
  const clean = text.toLowerCase();
  const matches = [...clean.matchAll(/(\d+)\+?\s*(years?|yrs?)/g)];
  let maxYears = 0;
  for (const match of matches) {
    const val = parseInt(match[1]);
    if (val > maxYears && val < 50) {
      maxYears = val;
    }
  }
  return maxYears;
}

/**
 * Extract degree level from text
 */
function getDegreeLevel(text) {
  const clean = text.toLowerCase();
  if (clean.includes('phd') || clean.includes('doctorate')) return 4;
  if (clean.includes('master') || clean.includes('m.s.') || clean.includes('mba')) return 3;
  if (clean.includes('bachelor') || clean.includes('b.s.') || clean.includes('b.a.') || clean.includes('degree')) return 2;
  return 1; // High School / General
}

/**
 * Main Semantic Matching Engine
 */
export async function matchResumeAndJob(resumeText, jobDescription, jobData = null) {
  // Pre-validate document
  const validation = validateResumeText(resumeText);
  if (!validation.isValid) {
    return {
      success: false,
      overall_score: 0,
      confidence: 1.0,
      error: validation.error,
      pillars: {
        core_skills: { score: 0, matched: [], required_count: 0 },
        relevant_experience: { score: 0, candidate_years: 0, jd_years: 0, evidence: [] },
        tools_methodologies: { score: 0, matched: [] },
        education_credentials: { score: 0, degree: 'Not specified', notes: '' }
      },
      recommendations: [validation.error],
      errors: [validation.error]
    };
  }

  try {
    const resumeChunks = chunkResume(resumeText);
    const cleanJD = jobDescription.toLowerCase();
    const cleanResume = resumeText.toLowerCase();

    // Standard list of required skills from JD or default list
    const jdKeywords = jobData?.requiredSkills || ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'git'];
    const skillsList = jdKeywords.filter(skill => cleanJD.includes(skill.toLowerCase()));
    if (skillsList.length === 0) {
      skillsList.push('experience', 'projects', 'communication');
    }

    // Embeddings generation for semantic matching
    const chunkTexts = resumeChunks.map(c => c.text);
    let matchedSkills = [];
    let jobMatchScore = 7; // Neutral fallback

    try {
      if (chunkTexts.length > 0) {
        const chunkEmbeddings = await geminiService.embedBatch(chunkTexts);
        const skillEmbeddings = await geminiService.embedBatch(skillsList);

        for (let i = 0; i < skillsList.length; i++) {
          const skill = skillsList[i];
          const skillVector = skillEmbeddings[i];
          let maxSim = 0;
          
          for (let j = 0; j < chunkEmbeddings.length; j++) {
            const sim = cosineSimilarity(skillVector, chunkEmbeddings[j]);
            if (sim > maxSim) maxSim = sim;
          }
          if (maxSim >= 0.70) {
            matchedSkills.push(skill);
          }
        }

        // Semantic Role Match
        if (jobData?.jobTitle) {
          const experienceChunkText = resumeChunks
            .filter(c => c.section === 'EXPERIENCE')
            .map(c => c.text)
            .join(' ');
          const roleAlignment = await calculateRoleAlignment(jobData.jobTitle, experienceChunkText || resumeText.substring(0, 500));
          jobMatchScore = Math.min(10, Math.round(roleAlignment * 10));
        }
      }
    } catch (embError) {
      console.warn('Embedding evaluation failed, falling back to heuristics:', embError);
      // Fallback heuristics
      matchedSkills = skillsList.filter(s => cleanResume.includes(s.toLowerCase()));
      jobMatchScore = jobData?.jobTitle && cleanResume.includes(jobData.jobTitle.toLowerCase()) ? 9 : 6;
    }

    // 10-CATEGORY SCORING rubric
    // 1. Contact Info (max 5)
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
    const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
    const hasLinkedIn = /linkedin\.com/i.test(resumeText);
    let contactScore = 0;
    if (hasEmail) contactScore += 1.5;
    if (hasPhone) contactScore += 1.5;
    if (hasLinkedIn || /github\.com/i.test(resumeText)) contactScore += 2;

    // 2. Professional Summary (max 5)
    let summaryScore = 0;
    if (/objective|summary|profile|about\s+me/i.test(resumeText)) {
      summaryScore = 5;
    } else if (cleanResume.length > 800) {
      summaryScore = 3; // assumed summary in header block
    }

    // 3. Skills (max 20)
    const skillRatio = skillsList.length > 0 ? (matchedSkills.length / skillsList.length) : 0.5;
    const skillsScore = Math.min(20, Math.round(skillRatio * 20));

    // 4. Experience (max 20)
    const candidateYears = extractYearsOfExperience(resumeText);
    const requiredYears = jobData?.experienceYears ? parseInt(jobData.experienceYears) : 3;
    const yearsRatio = requiredYears > 0 ? (candidateYears / requiredYears) : 1;
    const experienceScore = Math.min(20, Math.round(yearsRatio * 20));

    // 5. Education (max 10)
    const candidateDegree = getDegreeLevel(resumeText);
    const requiredDegree = jobData?.educationLevel ? getDegreeLevel(jobData.educationLevel) : 2;
    let educationScore = 10;
    if (candidateDegree < requiredDegree) {
      educationScore = Math.max(2, 10 - (requiredDegree - candidateDegree) * 3);
    }

    // 6. Projects (max 10)
    let projectsScore = 0;
    if (/projects|portfolio/i.test(resumeText)) {
      projectsScore += 5;
      if ((cleanResume.match(/project|build|develop/gi) || []).length > 3) {
        projectsScore += 5;
      }
    }

    // 7. Certifications (max 5)
    let certsScore = 0;
    if (/certif|license|certified|pmp|csm|aws|scrum/i.test(resumeText)) {
      certsScore = 5;
    }

    // 8. Keywords (max 10)
    const typicalKeywords = ['agile', 'scrum', 'devops', 'ci/cd', 'testing', 'api', 'cloud', 'architecture', 'git', 'database'];
    let kwCount = 0;
    typicalKeywords.forEach(kw => {
      if (cleanResume.includes(kw)) kwCount++;
    });
    const keywordsScore = Math.min(10, Math.round((kwCount / typicalKeywords.length) * 10));

    // 9. Job Match (max 10)
    const finalJobMatchScore = jobMatchScore;

    // 10. Formatting Quality (max 5)
    let formattingScore = 0;
    if (/[•\-\*]/.test(resumeText)) formattingScore += 3;
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount >= 300 && wordCount <= 1200) formattingScore += 2;

    const overallScore = Math.min(100, Math.max(10, 
      contactScore + summaryScore + skillsScore + experienceScore + educationScore + 
      projectsScore + certsScore + keywordsScore + finalJobMatchScore + formattingScore
    ));

    // Recommendations Generation
    const recommendations = [];
    if (skillsList.length > matchedSkills.length) {
      const missing = skillsList.filter(s => !matchedSkills.includes(s));
      recommendations.push(`Include contextual keywords showcasing experience with: ${missing.slice(0, 3).join(', ')}`);
    }
    if (candidateYears < requiredYears) {
      recommendations.push(`Highlight related freelance, internships, or projects to bridge the experience gap (has ${candidateYears} years, JD requires ${requiredYears}+).`);
    }
    if (candidateDegree < requiredDegree) {
      recommendations.push(`Highlight certification programs or bootcamps to offset the degree gap.`);
    }
    if (formattingScore < 5) {
      recommendations.push('Improve document structure: use standardized bullet points (e.g. •) and aim for an optimal length of 400-800 words.');
    }
    if (certsScore === 0) {
      recommendations.push('List any industry certifications or online credentials relevant to the role to stand out.');
    }

    // Pillars compatibility map for legacy UI references
    const pillars = {
      core_skills: {
        score: skillsScore,
        matched: matchedSkills,
        required_count: skillsList.length
      },
      relevant_experience: {
        score: experienceScore,
        candidate_years: candidateYears,
        jd_years: requiredYears,
        evidence: resumeChunks.slice(0, 2).map(c => c.text)
      },
      tools_methodologies: {
        score: keywordsScore + certsScore,
        matched: matchedSkills.filter(s => typicalKeywords.includes(s))
      },
      education_credentials: {
        score: educationScore,
        degree: candidateDegree === 4 ? 'PhD' : candidateDegree === 3 ? "Master's" : candidateDegree === 2 ? "Bachelor's" : "High School/Diploma",
        notes: candidateDegree >= requiredDegree ? 'Meets or exceeds requirement' : 'Below required level'
      }
    };

    const categories = {
      contact_info: { score: Math.round(contactScore), max: 5, description: 'Candidate email, phone number, and links.' },
      professional_summary: { score: summaryScore, max: 5, description: 'Summary/profile introduction section.' },
      skills: { score: skillsScore, max: 20, description: 'Core technical and domain-specific skills.' },
      experience: { score: experienceScore, max: 20, description: 'Total professional experience and titles.' },
      education: { score: educationScore, max: 10, description: 'Academic degrees and credentials matching.' },
      projects: { score: projectsScore, max: 10, description: 'Hands-on projects and portfolio relevance.' },
      certifications: { score: certsScore, max: 5, description: 'Professional certifications.' },
      keywords: { score: keywordsScore, max: 10, description: 'Density of industry-specific terms.' },
      job_match: { score: finalJobMatchScore, max: 10, description: 'Role semantic alignment and match.' },
      formatting: { score: formattingScore, max: 5, description: 'Structure, layout, and keyword distribution.' }
    };

    return {
      success: true,
      overall_score: Math.round(overallScore),
      confidence: 0.95,
      pillars,
      categories,
      recommendations,
      errors: []
    };
  } catch (error) {
    console.error('Semantic matching engine failed:', error);
    throw error;
  }
}
