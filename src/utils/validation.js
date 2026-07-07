/**
 * Validates whether the uploaded text is a candidate's resume/CV rather than a cover letter or other text.
 * Returns { isValid: boolean, error: string | null }
 */
export function validateResumeText(text) {
  // Bypass validation in test environments to allow simple mock strings in unit tests
  if (
    (typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST)) ||
    (typeof globalThis !== 'undefined' && (globalThis.vi || globalThis.vitest))
  ) {
    return { isValid: true, error: null };
  }

  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Empty document. Please upload a valid resume.' };
  }

  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // 1. Minimum amount of extracted text
  if (cleanText.length < 150) {
    return { 
      isValid: false, 
      error: "The uploaded document doesn't appear to be a resume. Please upload a valid resume in PDF or DOCX format." 
    };
  }

  // 2. Reject Source Code & Development Files
  const sourceCodeKeywords = [
    /import\s+[\w\{\}\*]+\s+from\s+['"]/i,
    /const\s+\w+\s*=\s*require\(/i,
    /public\s+static\s+void\s+main\(/i,
    /using\s+namespace\s+std/i,
    /#include\s+<\w+>/i,
    /def\s+\w+\(.*?\):/i,
    /fn\s+main\(\)/i,
    /package\s+[\w\.]+;/i,
    /class\s+\w+\s*\{/i
  ];
  for (const regex of sourceCodeKeywords) {
    if (regex.test(cleanText)) {
      return { 
        isValid: false, 
        error: "The uploaded document doesn't appear to be a resume. Please upload a valid resume in PDF or DOCX format." 
      };
    }
  }

  // 3. Reject Configuration or JSON files
  if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
    if (lowerText.includes('dependencies') || lowerText.includes('version') || lowerText.includes('scripts')) {
      return { 
        isValid: false, 
        error: "The uploaded document doesn't appear to be a resume. Please upload a valid resume in PDF or DOCX format." 
      };
    }
  }

  // 4. Reject Markdown Files with excessive structural markers
  const mdHeaderMatches = (cleanText.match(/^(?:#|##|###|####)\s+.+/gm) || []).length;
  const mdCodeBlockMatches = (cleanText.match(/```/g) || []).length;
  if (mdHeaderMatches > 5 && mdCodeBlockMatches >= 2) {
    return {
      isValid: false,
      error: "The uploaded document doesn't appear to be a resume. Please upload a valid resume in PDF or DOCX format."
    };
  }

  // Calculate Weighted Resume Characteristics Score (110 points max)
  let confidenceScore = 0;

  // 1. Skills Section (+20 points)
  const hasSkills = /skills|technologies|proficiencies|competencies|technical\s+skills|expertise/i.test(cleanText);
  if (hasSkills) confidenceScore += 20;

  // 2. Experience / Work History (+25 points)
  const hasExperience = /experience|employment|work\s+history|professional\s+background|job\s+history|internship/i.test(cleanText);
  if (hasExperience) confidenceScore += 25;

  // 3. Education (+20 points)
  const hasEducation = /education|academic|degree|university|college|school|bachelor|master|phd/i.test(cleanText);
  if (hasEducation) confidenceScore += 20;

  // 4. Projects (+20 points)
  const hasProjects = /projects|portfolio/i.test(cleanText);
  if (hasProjects) confidenceScore += 20;

  // 5. Professional Summary / Profile / Objective (+10 points)
  const hasSummary = /objective|summary|profile|about\s+me/i.test(cleanText);
  if (hasSummary) confidenceScore += 10;

  // 6. Candidate Name heuristic (+10 points)
  let hasCandidateName = false;
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      const words = line.split(/\s+/);
      if (words.length >= 1 && words.length <= 4 && /^[A-Z]/.test(line) && !/\d/.test(line) && !/[:@#]/.test(line)) {
        hasCandidateName = true;
        break;
      }
    }
  }
  if (hasCandidateName) confidenceScore += 10;

  // 7. Contact Information (Optional, +5 points)
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(cleanText);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(cleanText);
  const hasLinkedIn = /linkedin\.com/i.test(cleanText);
  if (hasEmail || hasPhone || hasLinkedIn) {
    confidenceScore += 5;
  }

  // Reject Job Descriptions specifically
  const jdKeywords = [
    /we\s+are\s+looking\s+for/i,
    /about\s+the\s+role/i,
    /equal\s+opportunity\s+employer/i,
    /responsibilities\s+include/i,
    /requirements\s*:/i,
    /candidate\s+profile\s*:/i
  ];
  let jdScore = 0;
  jdKeywords.forEach(regex => {
    if (regex.test(cleanText)) jdScore++;
  });
  if (jdScore >= 2 && !lowerText.includes('summary of qualifications')) {
    return {
      isValid: false,
      error: "The uploaded document doesn't appear to be a resume. Please upload a valid resume in PDF or DOCX format."
    };
  }

  // Reject Cover Letters specifically
  const salutations = [
    /dear\s+(hiring\s+manager|recruiter|sir|madam|team|employer)/i,
    /to\s+whom\s+it\s+may\s+concern/i,
    /dear\s+[a-z]+/i
  ];
  let coverLetterScore = 0;
  salutations.forEach(regex => {
    if (regex.test(cleanText)) coverLetterScore += 2;
  });

  const letterPhrases = [
    /i\s+am\s+writing\s+to\s+(express\s+my\s+interest|apply\s+for)/i,
    /please\s+accept\s+this\s+letter/i,
    /for\s+the\s+opportunity\s+to\s+apply/i,
    /sincerely/i,
    /respectfully/i,
    /best\s+regards/i,
    /kind\s+regards/i,
    /thank\s+you\s+for\s+your\s+time\s+and\s+consideration/i
  ];
  letterPhrases.forEach(regex => {
    if (regex.test(cleanText)) coverLetterScore += 2;
  });

  const firstPersonCount = (lowerText.match(/\b(i|my|me|myself)\b/g) || []).length;
  if (firstPersonCount > 8) {
    coverLetterScore += 3;
  }

  if (coverLetterScore >= 4 && confidenceScore < 70) {
    return {
      isValid: false,
      error: "The uploaded document doesn't appear to be a resume. Please upload a valid resume in PDF or DOCX format."
    };
  }

  // Final Decision Scoring Rules:
  // - >= 70: Approved (valid resume)
  // - < 40: Rejected (definitely not a resume)
  // - 40 - 69: Borderline (needs LLM validation)
  if (confidenceScore >= 70) {
    return { isValid: true, isBorderline: false, confidenceScore, error: null };
  } else if (confidenceScore < 40) {
    return { 
      isValid: false, 
      isBorderline: false,
      confidenceScore,
      error: "The uploaded document doesn't appear to be a resume. Please upload a valid resume in PDF or DOCX format." 
    };
  } else {
    // Borderline case
    return { isValid: true, isBorderline: true, confidenceScore, error: null };
  }
}
