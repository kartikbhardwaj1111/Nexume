// Test utility for ATS scoring system
export const sampleResume = `John Doe
Software Engineer

EXPERIENCE:
• 5+ years developing web applications using React, Node.js, and Python
• Led team of 3 developers on e-commerce platform
• Implemented CI/CD pipelines using Docker and AWS
• Built RESTful APIs serving 10k+ daily users

SKILLS:
• Frontend: React, JavaScript, TypeScript, HTML, CSS
• Backend: Node.js, Python, Express.js
• Database: PostgreSQL, MongoDB
• Cloud: AWS, Docker, Kubernetes
• Tools: Git, Jenkins, Jira

EDUCATION:
• Bachelor of Science in Computer Science
• University of Technology, 2018`;

export const sampleJobDescription = `Senior Software Engineer

We are looking for a Senior Software Engineer with 3+ years of experience.

REQUIREMENTS:
• 3+ years of experience in web development
• Proficiency in React, Node.js, and JavaScript
• Experience with cloud platforms (AWS preferred)
• Knowledge of databases (PostgreSQL, MongoDB)
• Bachelor's degree in Computer Science or related field

NICE TO HAVE:
• Docker and Kubernetes experience
• Team leadership experience
• CI/CD pipeline knowledge`;

// Additional test resumes for uniqueness testing
export const testResumes = [
  {
    name: "Senior Developer",
    content: `John Smith
Senior Software Engineer

EXPERIENCE:
• 8+ years developing enterprise web applications using React, Node.js, and Python
• Led team of 5 developers on microservices architecture
• Implemented CI/CD pipelines using Docker, Kubernetes, and AWS
• Built scalable APIs serving 100k+ daily users

SKILLS:
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Vue.js
• Backend: Node.js, Python, Java, Express.js, Django
• Database: PostgreSQL, MongoDB, Redis
• Cloud: AWS, Docker, Kubernetes, Jenkins
• Tools: Git, Jira, Confluence

EDUCATION:
• Master of Science in Computer Science
• Stanford University, 2015`
  },
  {
    name: "Junior Developer", 
    content: `Sarah Johnson
Junior Web Developer

EXPERIENCE:
• 1 year developing web applications with HTML, CSS, JavaScript
• Worked on small team projects using React
• Basic experience with Git version control

SKILLS:
• HTML, CSS, JavaScript
• React (learning)
• Git basics
• Responsive design

EDUCATION:
• Bachelor of Arts in Computer Science
• Local University, 2023`
  },
  {
    name: "Data Scientist",
    content: `Dr. Michael Chen
Senior Data Scientist

EXPERIENCE:
• 6+ years in machine learning and data analysis
• PhD in Statistics with focus on predictive modeling
• Published 15+ research papers in ML conferences
• Led data science team at Fortune 500 company

SKILLS:
• Python, R, SQL, Scala
• TensorFlow, PyTorch, Scikit-learn
• AWS, GCP, Azure
• Tableau, Power BI
• Statistical modeling, Deep learning

EDUCATION:
• PhD in Statistics, MIT, 2018
• MS in Mathematics, UC Berkeley, 2014`
  }
];

export const testATSScoring = async (apiKey) => {
  try {
    const { generateATSScore } = await import('./analyzeResume.js');
    
    console.log('Testing ATS Scoring System for Uniqueness...');
    
    const results = [];
    
    for (let i = 0; i < testResumes.length; i++) {
      const resume = testResumes[i];
      console.log(`\nTesting ${resume.name}...`);
      console.log('Resume length:', resume.content.length);
      
      const startTime = Date.now();
      const result = await generateATSScore(resume.content, sampleJobDescription, apiKey);
      const endTime = Date.now();
      
      console.log(`${resume.name} Score:`, result.overall_score);
      console.log('Processing time:', endTime - startTime, 'ms');
      
      results.push({
        name: resume.name,
        score: result.overall_score,
        confidence: result.confidence,
        processingTime: endTime - startTime
      });
      
      // Wait a bit between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n=== UNIQUENESS TEST RESULTS ===');
    results.forEach(result => {
      console.log(`${result.name}: ${result.score}/100 (${Math.round(result.confidence * 100)}% confidence)`);
    });
    
    // Check if all scores are different
    const scores = results.map(r => r.score);
    const uniqueScores = [...new Set(scores)];
    
    if (uniqueScores.length === scores.length) {
      console.log('✅ SUCCESS: All resumes received unique scores!');
    } else {
      console.log('❌ WARNING: Some resumes received identical scores');
      console.log('Scores:', scores);
    }
    
    return results;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};