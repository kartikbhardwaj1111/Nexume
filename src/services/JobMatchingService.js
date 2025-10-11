class JobMatchingService {
  constructor() {
    this.adzunaConfig = {
      appId: import.meta.env.VITE_ADZUNA_APP_ID || 'demo',
      appKey: import.meta.env.VITE_ADZUNA_APP_KEY || 'demo'
    };
  }

  async findJobsForResume(resumeSkills, location = 'United States') {
    try {
      if (this.adzunaConfig.appId !== 'demo') {
        return await this.searchAdzuna(resumeSkills, location);
      }
      return this.getFallbackJobs(resumeSkills);
    } catch (error) {
      console.warn('Adzuna API failed, using fallback:', error);
      return this.getFallbackJobs(resumeSkills);
    }
  }

  async searchAdzuna(skills, location) {
    const query = skills.slice(0, 3).join(' ');
    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${this.adzunaConfig.appId}&app_key=${this.adzunaConfig.appKey}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&results_per_page=10`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    return data.results?.map(job => ({
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      url: job.redirect_url,
      salary: job.salary_min ? `$${job.salary_min}+` : 'Competitive',
      match: this.calculateMatch(job.description, skills),
      source: 'Adzuna'
    })) || [];
  }

  getFallbackJobs(skills) {
    const jobTemplates = {
      javascript: [
        { title: 'Frontend Developer', company: 'Tech Startups', url: 'https://indeed.com/jobs?q=frontend+developer', salary: '$70k+' },
        { title: 'Full Stack Developer', company: 'Various Companies', url: 'https://linkedin.com/jobs/search/?keywords=full%20stack', salary: '$80k+' }
      ],
      python: [
        { title: 'Python Developer', company: 'Tech Companies', url: 'https://indeed.com/jobs?q=python+developer', salary: '$75k+' },
        { title: 'Data Analyst', company: 'Various Industries', url: 'https://linkedin.com/jobs/search/?keywords=data%20analyst', salary: '$65k+' }
      ],
      react: [
        { title: 'React Developer', company: 'Startups', url: 'https://indeed.com/jobs?q=react+developer', salary: '$75k+' },
        { title: 'Frontend Engineer', company: 'Tech Companies', url: 'https://linkedin.com/jobs/search/?keywords=react%20frontend', salary: '$80k+' }
      ],
      node: [
        { title: 'Node.js Developer', company: 'Tech Companies', url: 'https://indeed.com/jobs?q=nodejs+developer', salary: '$80k+' },
        { title: 'Backend Developer', company: 'Various Companies', url: 'https://linkedin.com/jobs/search/?keywords=nodejs%20backend', salary: '$85k+' }
      ],
      java: [
        { title: 'Java Developer', company: 'Enterprise', url: 'https://indeed.com/jobs?q=java+developer', salary: '$85k+' },
        { title: 'Software Engineer', company: 'Large Corps', url: 'https://linkedin.com/jobs/search/?keywords=java%20software%20engineer', salary: '$90k+' }
      ]
    };

    const suggestions = [];
    skills.forEach(skill => {
      const skillKey = skill.toLowerCase();
      if (jobTemplates[skillKey]) {
        suggestions.push(...jobTemplates[skillKey].map(job => ({
          ...job,
          location: 'Remote/Hybrid',
          match: 85,
          source: 'Curated'
        })));
      }
    });

    return suggestions.slice(0, 8);
  }

  calculateMatch(jobDescription, skills) {
    const desc = jobDescription.toLowerCase();
    const matches = skills.filter(skill => desc.includes(skill.toLowerCase()));
    return Math.round((matches.length / skills.length) * 100);
  }
}

export const jobMatchingService = new JobMatchingService();