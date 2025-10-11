/**
 * Generates comprehensive ATS improvement reports
 */

export function generateATSReport(scoreData, resumeText, jobDescription, jobData = null) {
  const { overall_score, confidence, pillars, recommendations, jobSpecific } = scoreData;
  
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getScoreLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', emoji: '🎉', color: 'green' };
    if (score >= 70) return { level: 'Good', emoji: '👍', color: 'blue' };
    if (score >= 60) return { level: 'Fair', emoji: '⚡', color: 'yellow' };
    return { level: 'Needs Improvement', emoji: '🔧', color: 'red' };
  };

  const scoreLevel = getScoreLevel(overall_score);

  const report = `
# 📊 ATS Resume Analysis Report
**Generated on:** ${reportDate}  
**Overall ATS Score:** ${overall_score}/100 ${scoreLevel.emoji}  
**Analysis Confidence:** ${Math.round(confidence * 100)}%  
**Status:** ${scoreLevel.level}

---

## 🎯 Executive Summary

Your resume scored **${overall_score} out of 100** on our ATS compatibility analysis. This ${scoreLevel.level.toLowerCase()} score means your resume ${getScoreSummary(overall_score)}.

${getScoreAdvice(overall_score)}

${jobSpecific ? generateJobSpecificSummary(jobSpecific, overall_score) : ''}

---

## 📈 Detailed Score Breakdown

### 🔧 Core Skills Alignment (${pillars.core_skills.score}/40 points)
**Performance:** ${getPerformanceLevel(pillars.core_skills.score, 40)}

${pillars.core_skills.matched.length > 0 ? `
**✅ Skills Found in Your Resume:**
${pillars.core_skills.matched.map(skill => `• ${typeof skill === 'string' ? skill : skill.skill || skill}`).join('\n')}
` : '**❌ No matching skills detected in your resume.**'}

**💡 How to Improve:**
${getSkillsImprovementTips(pillars.core_skills, jobDescription)}

---

### 💼 Relevant Experience (${pillars.relevant_experience.score}/30 points)
**Performance:** ${getPerformanceLevel(pillars.relevant_experience.score, 30)}

**Your Experience:** ${pillars.relevant_experience.candidate_years} years  
**Required Experience:** ${pillars.relevant_experience.jd_years} years  
**Match Status:** ${pillars.relevant_experience.candidate_years >= pillars.relevant_experience.jd_years ? '✅ Meets Requirements' : '⚠️ Below Requirements'}

${pillars.relevant_experience.evidence.length > 0 ? `
**📋 Experience Evidence Found:**
${pillars.relevant_experience.evidence.map(evidence => `• ${evidence}`).join('\n')}
` : ''}

**💡 How to Improve:**
${getExperienceImprovementTips(pillars.relevant_experience)}

---

### 🛠️ Tools & Methodologies (${pillars.tools_methodologies.score}/20 points)
**Performance:** ${getPerformanceLevel(pillars.tools_methodologies.score, 20)}

${pillars.tools_methodologies.matched.length > 0 ? `
**✅ Tools/Technologies Found:**
${pillars.tools_methodologies.matched.map(tool => `• ${tool}`).join('\n')}
` : '**❌ No matching tools/technologies detected.**'}

**💡 How to Improve:**
${getToolsImprovementTips(pillars.tools_methodologies, jobDescription)}

---

### 🎓 Education & Credentials (${pillars.education_credentials.score}/10 points)
**Performance:** ${getPerformanceLevel(pillars.education_credentials.score, 10)}

**Education Found:** ${pillars.education_credentials.degree}  
${pillars.education_credentials.notes ? `**Notes:** ${pillars.education_credentials.notes}` : ''}

**💡 How to Improve:**
${getEducationImprovementTips(pillars.education_credentials)}

---

${jobSpecific ? generateJobSpecificAnalysis(jobSpecific) : ''}

## 🚀 Priority Action Plan

### 🔥 High Impact Changes (Do These First!)
${getHighImpactRecommendations(pillars, overall_score)}

### 📈 Medium Impact Improvements
${getMediumImpactRecommendations(pillars)}

### ✨ Polish & Optimization
${getPolishRecommendations(pillars)}

---

## 📝 Specific Recommendations

${recommendations.map((rec, index) => `${index + 1}. **${rec}**`).join('\n')}

---

## 🎯 ATS Optimization Checklist

### ✅ Content Optimization
- [ ] Include all required skills from job description
- [ ] Add specific years of experience
- [ ] Use industry-standard job titles
- [ ] Include relevant certifications
- [ ] Add quantifiable achievements (numbers, percentages, metrics)

### ✅ Formatting for ATS
- [ ] Use standard section headers (Experience, Skills, Education)
- [ ] Avoid images, graphics, or complex formatting
- [ ] Use standard fonts (Arial, Calibri, Times New Roman)
- [ ] Save as .docx or .pdf format
- [ ] Use bullet points for easy scanning

### ✅ Keyword Optimization
- [ ] Mirror job description language
- [ ] Include both acronyms and full terms (e.g., "AI" and "Artificial Intelligence")
- [ ] Use action verbs (managed, developed, implemented)
- [ ] Include industry-specific terminology

---

## 📊 Score Improvement Potential

**Current Score:** ${overall_score}/100  
**Potential Score:** ${Math.min(95, overall_score + calculateImprovementPotential(pillars))}/100  
**Improvement Opportunity:** +${calculateImprovementPotential(pillars)} points

${getImprovementRoadmap(pillars)}

---

## 🔍 Next Steps

1. **Immediate Actions (This Week):**
   ${getImmediateActions(pillars).map(action => `   • ${action}`).join('\n')}

2. **Short-term Goals (Next 2 Weeks):**
   ${getShortTermGoals(pillars).map(goal => `   • ${goal}`).join('\n')}

3. **Long-term Strategy (Next Month):**
   ${getLongTermStrategy(pillars).map(strategy => `   • ${strategy}`).join('\n')}

---

## 💡 Pro Tips for ATS Success

• **Tailor for Each Job:** Customize your resume for each application
• **Use Job Description Keywords:** Mirror the language used in the posting
• **Quantify Everything:** Include numbers, percentages, and metrics
• **Keep It Simple:** Avoid fancy formatting that ATS can't read
• **Test Different Versions:** Try variations and track which perform better

---

**📞 Need Help?** Contact our support team for personalized resume optimization assistance.

**🔄 Retest Your Resume:** After making improvements, run another analysis to track your progress.

---
*Report generated by Resume Fit CodeNex - AI-Powered ATS Analysis*
`;

  return report;
}

function getScoreSummary(score) {
  if (score >= 80) return "has excellent ATS compatibility and should pass most automated screening systems";
  if (score >= 70) return "has good ATS compatibility with room for strategic improvements";
  if (score >= 60) return "has fair ATS compatibility but needs targeted improvements to maximize success";
  return "needs significant improvements to pass ATS screening effectively";
}

function getScoreAdvice(score) {
  if (score >= 80) return "🎉 **Congratulations!** Your resume is well-optimized for ATS systems. Focus on fine-tuning and tailoring for specific roles.";
  if (score >= 70) return "👍 **Good foundation!** Your resume has solid ATS compatibility. A few strategic improvements will significantly boost your success rate.";
  if (score >= 60) return "⚡ **Improvement needed!** Your resume has potential but requires focused optimization to compete effectively.";
  return "🔧 **Action required!** Your resume needs substantial improvements to pass ATS screening. Follow our recommendations for best results.";
}

// Job-specific helper functions
function generateJobSpecificSummary(jobSpecific, overallScore) {
  if (!jobSpecific) return '';
  
  return `
## 🎯 Job-Specific Analysis: ${jobSpecific.targetRole} at ${jobSpecific.targetCompany}

**Skills Match:** ${jobSpecific.skillsMatch.matched}/${jobSpecific.skillsMatch.required} required skills (${jobSpecific.skillsMatch.matchPercentage}%)  
**Experience Match:** ${jobSpecific.experienceMatch.candidate} years (${jobSpecific.experienceMatch.required} required) ${jobSpecific.experienceMatch.meetsRequirement ? '✅' : '⚠️'}  
**Requirements Match:** ${jobSpecific.requirementsMatch?.matched || 0}/${jobSpecific.requirementsMatch?.total || 0} key requirements (${jobSpecific.requirementsMatch?.matchPercentage || 0}%)

${getJobMatchAdvice(jobSpecific)}
`;
}

function generateJobSpecificAnalysis(jobSpecific) {
  if (!jobSpecific) return '';
  
  return `
## 🎯 Job-Specific Compatibility Analysis

### 🔧 Skills Alignment for ${jobSpecific.targetRole}
**Match Rate:** ${jobSpecific.skillsMatch.matchPercentage}% (${jobSpecific.skillsMatch.matched}/${jobSpecific.skillsMatch.required} skills)

${jobSpecific.skillsMatch.matchedSkills.length > 0 ? `
**✅ Skills You Have:**
${jobSpecific.skillsMatch.matchedSkills.map(skill => `• ${skill}`).join('\n')}
` : ''}

${jobSpecific.skillsMatch.missingSkills.length > 0 ? `
**❌ Missing Required Skills:**
${jobSpecific.skillsMatch.missingSkills.slice(0, 5).map(skill => `• ${skill}`).join('\n')}
${jobSpecific.skillsMatch.missingSkills.length > 5 ? `• ... and ${jobSpecific.skillsMatch.missingSkills.length - 5} more` : ''}
` : ''}

### 💼 Experience Match for ${jobSpecific.targetCompany}
**Your Experience:** ${jobSpecific.experienceMatch.candidate} years  
**Required:** ${jobSpecific.experienceMatch.required} years  
**Status:** ${jobSpecific.experienceMatch.meetsRequirement ? '✅ Meets requirement' : `⚠️ ${jobSpecific.experienceMatch.gap} year gap`}

${jobSpecific.requirementsMatch ? `
### 📋 Job Requirements Analysis
**Match Rate:** ${jobSpecific.requirementsMatch.matchPercentage}% (${jobSpecific.requirementsMatch.matched}/${jobSpecific.requirementsMatch.total} requirements)

${jobSpecific.requirementsMatch.matchedRequirements.length > 0 ? `
**✅ Requirements You Meet:**
${jobSpecific.requirementsMatch.matchedRequirements.slice(0, 3).map(req => `• ${req}`).join('\n')}
` : ''}

${jobSpecific.requirementsMatch.missingRequirements.length > 0 ? `
**❌ Requirements to Address:**
${jobSpecific.requirementsMatch.missingRequirements.slice(0, 3).map(req => `• ${req}`).join('\n')}
` : ''}
` : ''}

### 🎯 Job-Specific Recommendations
${getJobSpecificRecommendations(jobSpecific)}

---
`;
}

function getJobMatchAdvice(jobSpecific) {
  const skillsMatch = jobSpecific.skillsMatch.matchPercentage;
  const experienceMatch = jobSpecific.experienceMatch.meetsRequirement;
  const requirementsMatch = jobSpecific.requirementsMatch?.matchPercentage || 0;
  
  if (skillsMatch >= 80 && experienceMatch && requirementsMatch >= 70) {
    return "🎉 **Excellent match!** Your profile aligns very well with this specific role.";
  } else if (skillsMatch >= 60 && (experienceMatch || requirementsMatch >= 50)) {
    return "👍 **Good match!** You meet most requirements with some areas for improvement.";
  } else if (skillsMatch >= 40 || requirementsMatch >= 40) {
    return "⚡ **Moderate match.** Focus on addressing key gaps to improve your candidacy.";
  } else {
    return "🔧 **Significant gaps detected.** Consider targeting roles that better match your current profile or invest in skill development.";
  }
}

function getJobSpecificRecommendations(jobSpecific) {
  const recommendations = [];
  
  // Skills recommendations
  if (jobSpecific.skillsMatch.missingSkills.length > 0) {
    const topSkills = jobSpecific.skillsMatch.missingSkills.slice(0, 3);
    recommendations.push(`**Priority Skills to Add:** ${topSkills.join(', ')}`);
  }
  
  // Experience recommendations
  if (!jobSpecific.experienceMatch.meetsRequirement) {
    if (jobSpecific.experienceMatch.gap <= 2) {
      recommendations.push(`**Experience Gap:** Highlight ${jobSpecific.experienceMatch.gap} additional years through projects, internships, or relevant coursework`);
    } else {
      recommendations.push(`**Experience Strategy:** Consider similar roles with lower experience requirements or emphasize transferable skills`);
    }
  }
  
  // Requirements recommendations
  if (jobSpecific.requirementsMatch && jobSpecific.requirementsMatch.matchPercentage < 60) {
    const topMissing = jobSpecific.requirementsMatch.missingRequirements.slice(0, 2);
    recommendations.push(`**Key Requirements to Address:** ${topMissing.join('; ')}`);
  }
  
  // Company-specific recommendation
  recommendations.push(`**Company Alignment:** Research ${jobSpecific.targetCompany}'s values and recent projects to tailor your resume summary`);
  
  return recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n');
}

function getPerformanceLevel(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "🟢 Excellent";
  if (percentage >= 70) return "🔵 Good";
  if (percentage >= 60) return "🟡 Fair";
  return "🔴 Needs Improvement";
}

function getSkillsImprovementTips(coreSkills, jobDescription) {
  const tips = [
    "• Add a dedicated 'Technical Skills' or 'Core Competencies' section",
    "• Include both hard and soft skills mentioned in the job description",
    "• Use exact terminology from the job posting",
    "• Group skills by category (Programming Languages, Frameworks, Tools, etc.)"
  ];
  
  if (coreSkills.matched.length === 0) {
    tips.unshift("• **CRITICAL:** Add skills section - none detected in current resume");
  }
  
  return tips.join('\n');
}

function getExperienceImprovementTips(experience) {
  const tips = [];
  
  if (experience.candidate_years < experience.jd_years) {
    tips.push("• **Highlight relevant experience:** Include internships, projects, and freelance work");
    tips.push("• **Emphasize transferable skills:** Show how other experience applies to this role");
  }
  
  tips.push(
    "• Use specific numbers and metrics (e.g., 'Managed team of 5', 'Increased efficiency by 30%')",
    "• Start bullet points with strong action verbs (Led, Developed, Implemented, Optimized)",
    "• Include relevant projects and achievements",
    "• Mention technologies and tools used in each role"
  );
  
  return tips.join('\n');
}

function getToolsImprovementTips(tools, jobDescription) {
  const tips = [
    "• Create a 'Technical Skills' section listing all relevant tools",
    "• Include version numbers where relevant (e.g., 'Python 3.9', 'React 18')",
    "• Mention tools in context within experience descriptions",
    "• Add both popular and niche tools mentioned in job description"
  ];
  
  if (tools.matched.length === 0) {
    tips.unshift("• **URGENT:** Add technical tools section - none found in resume");
  }
  
  return tips.join('\n');
}

function getEducationImprovementTips(education) {
  const tips = [];
  
  if (education.degree === "Not specified" || education.degree === "Not clearly specified") {
    tips.push("• **Add education section** with degree, institution, and graduation year");
  }
  
  tips.push(
    "• Include relevant coursework if recent graduate",
    "• Add certifications and professional development",
    "• Mention academic projects related to the job",
    "• Include GPA if 3.5 or higher and recent graduate"
  );
  
  return tips.join('\n');
}

function getHighImpactRecommendations(pillars, overallScore) {
  const recommendations = [];
  
  if (pillars.core_skills.score < 20) {
    recommendations.push("🎯 **Add Skills Section** - This is your biggest opportunity for improvement");
  }
  
  if (pillars.relevant_experience.candidate_years < pillars.relevant_experience.jd_years) {
    recommendations.push("💼 **Highlight All Relevant Experience** - Include projects, internships, freelance work");
  }
  
  if (pillars.tools_methodologies.matched.length === 0) {
    recommendations.push("🛠️ **Add Technical Tools Section** - List all relevant technologies");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("🔍 **Keyword Optimization** - Add more job-specific keywords throughout your resume");
  }
  
  return recommendations.join('\n');
}

function getMediumImpactRecommendations(pillars) {
  return [
    "📊 **Add Quantifiable Achievements** - Include numbers, percentages, and metrics",
    "🎯 **Optimize Job Titles** - Use industry-standard titles that match the job description",
    "📝 **Improve Action Verbs** - Start bullet points with strong, specific action words",
    "🔗 **Add Context** - Explain the impact and relevance of your experience"
  ].join('\n');
}

function getPolishRecommendations(pillars) {
  return [
    "✨ **Professional Summary** - Add a compelling 2-3 line summary at the top",
    "🎨 **Consistent Formatting** - Ensure uniform spacing, fonts, and bullet styles",
    "📱 **Contact Information** - Include LinkedIn profile and professional email",
    "🔍 **Proofread Thoroughly** - Check for typos, grammar, and formatting issues"
  ].join('\n');
}

function calculateImprovementPotential(pillars) {
  let potential = 0;
  
  // Skills improvement potential
  if (pillars.core_skills.score < 30) potential += 15;
  else if (pillars.core_skills.score < 35) potential += 8;
  
  // Experience improvement potential
  if (pillars.relevant_experience.score < 20) potential += 10;
  else if (pillars.relevant_experience.score < 25) potential += 5;
  
  // Tools improvement potential
  if (pillars.tools_methodologies.score < 15) potential += 8;
  else if (pillars.tools_methodologies.score < 18) potential += 4;
  
  // Education improvement potential
  if (pillars.education_credentials.score < 8) potential += 3;
  
  return Math.min(25, potential); // Cap at 25 points improvement
}

function getImprovementRoadmap(pillars) {
  const roadmap = [];
  
  if (pillars.core_skills.score < 25) {
    roadmap.push("🎯 **Phase 1:** Add comprehensive skills section (+10-15 points)");
  }
  
  if (pillars.tools_methodologies.score < 15) {
    roadmap.push("🛠️ **Phase 2:** Include technical tools and methodologies (+5-8 points)");
  }
  
  if (pillars.relevant_experience.score < 20) {
    roadmap.push("💼 **Phase 3:** Enhance experience descriptions with metrics (+5-10 points)");
  }
  
  roadmap.push("✨ **Phase 4:** Fine-tune keywords and formatting (+3-5 points)");
  
  return roadmap.join('\n');
}

function getImmediateActions(pillars) {
  const actions = [];
  
  if (pillars.core_skills.matched.length === 0) {
    actions.push("Create a 'Skills' section with relevant technical and soft skills");
  }
  
  if (pillars.tools_methodologies.matched.length === 0) {
    actions.push("Add a 'Technical Skills' section listing tools and technologies");
  }
  
  actions.push("Review job description and add 3-5 missing keywords to your resume");
  
  return actions;
}

function getShortTermGoals(pillars) {
  return [
    "Rewrite experience bullet points with quantifiable achievements",
    "Add 2-3 relevant projects or accomplishments",
    "Optimize resume formatting for ATS compatibility",
    "Create tailored versions for different job types"
  ];
}

function getLongTermStrategy(pillars) {
  return [
    "Build portfolio of work samples and case studies",
    "Obtain relevant certifications mentioned in target job descriptions",
    "Develop expertise in trending technologies in your field",
    "Build professional network and gather recommendations"
  ];
}

export function downloadReport(scoreData, resumeText, jobDescription, filename = 'ats-resume-analysis-report') {
  const report = generateATSReport(scoreData, resumeText, jobDescription);
  
  // Create blob and download
  const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  return true;
}

export function downloadPDFReport(scoreData, resumeText, jobDescription, filename = 'ats-resume-analysis-report') {
  // For PDF generation, we'll create an HTML version that can be printed to PDF
  const report = generateATSReport(scoreData, resumeText, jobDescription);
  
  // Convert markdown to HTML (basic conversion)
  const htmlReport = convertMarkdownToHTML(report);
  
  // Create a new window with the report
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ATS Resume Analysis Report</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; }
        h2 { color: #1e40af; margin-top: 30px; }
        h3 { color: #1e3a8a; }
        .score { font-size: 24px; font-weight: bold; color: #059669; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #e5e7eb; }
        .high-impact { background-color: #fef3c7; border-left-color: #f59e0b; }
        .checklist { background-color: #f0f9ff; border-left-color: #0ea5e9; }
        ul { padding-left: 20px; }
        li { margin: 5px 0; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      ${htmlReport}
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 1000);
        }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
  
  return true;
}

function convertMarkdownToHTML(markdown) {
  return markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n/g, '<br>')
    .replace(/---/g, '<hr>');
}


