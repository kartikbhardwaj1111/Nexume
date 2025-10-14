class JobMatchingService {
  constructor() {
    // Removed external API dependencies - using only internal job sources
    this.jobCache = new Map();
    this.userPreferences = new Map();
    this.matchingAlgorithms = this.initializeMatchingAlgorithms();
    this.directJobSources = this.initializeDirectJobSources();
    
    // Adzuna API configuration
    this.adzunaConfig = {
      appId: '3e45a65c',
      appKey: '8326f58c2a55c2fb00d251d12d4a6574'
    };
  }

  /**
   * Initialize advanced matching algorithms
   */
  initializeMatchingAlgorithms() {
    return {
      skillBased: this.calculateSkillBasedMatch.bind(this),
      experienceBased: this.calculateExperienceMatch.bind(this),
      locationBased: this.calculateLocationMatch.bind(this),
      salaryBased: this.calculateSalaryMatch.bind(this),
      cultureBased: this.calculateCultureMatch.bind(this)
    };
  }

  /**
   * Initialize direct job sources (no external APIs)
   */
  initializeDirectJobSources() {
    return {
      companyCareerPages: this.getCompanyCareerPages(),
      jobBoards: this.getAlternativeJobBoards(),
      networkingPlatforms: this.getNetworkingPlatforms(),
      freelancePlatforms: this.getFreelancePlatforms()
    };
  }

  /**
   * Enhanced job matching with multiple criteria - FULLY SELF-CONTAINED
   */
  async findJobsForResume(resumeData, preferences = {}) {
    const {
      skills = [],
      experience = 0,
      location = preferences.location || resumeData.location || 'India',
      salaryRange = null,
      jobType = 'full-time',
      remote = false,
      industry = null
    } = resumeData;

    // Force India location if not specified
    const targetLocation = location.toLowerCase().includes('india') ? 'India' : location;

    console.log('🎯 Finding jobs for resume with skills:', skills);
    console.log('📊 Resume data:', { skills, experience, location, industry });

    try {
      // Ensure skills is an array
      const skillsArray = Array.isArray(skills) ? skills : [];
      
      // For India location, use ONLY India-specific jobs
      let allJobs = [];
      if (targetLocation === 'India' || targetLocation.toLowerCase().includes('india')) {
        // Get comprehensive India jobs based on resume analysis
        allJobs = this.getEnhancedIndiaJobs(skillsArray, experience, industry, preferences);
        
        // Add skill-specific India jobs
        const skillBasedIndiaJobs = this.getSkillBasedIndiaJobs(skillsArray, experience);
        allJobs = [...allJobs, ...skillBasedIndiaJobs];
        
        // Add experience-level India jobs
        const experienceIndiaJobs = this.getExperienceLevelIndiaJobs(experience, skillsArray);
        allJobs = [...allJobs, ...experienceIndiaJobs];
        
        // Optionally add Adzuna India jobs
        try {
          const adzunaJobs = await this.searchAdzuna(skillsArray, 'India');
          allJobs = [...allJobs, ...adzunaJobs];
        } catch (error) {
          console.warn('Adzuna API unavailable, using internal jobs only');
        }
      } else {
        // Use other job sources for non-India locations
        const jobSources = [
          this.searchCuratedJobs(skillsArray, industry, { ...preferences, location: targetLocation }),
          this.getSkillBasedJobs(skillsArray, { ...preferences, location: targetLocation }),
          this.getIndustryJobs(industry, { ...preferences, location: targetLocation }),
          this.getExperienceLevelJobs(experience, { ...preferences, location: targetLocation })
        ];
        allJobs = jobSources.flat();
        
        // Add Adzuna jobs for non-India locations
        try {
          const adzunaJobs = await this.searchAdzuna(skillsArray, targetLocation);
          allJobs = [...allJobs, ...adzunaJobs];
        } catch (error) {
          console.warn('Adzuna API unavailable, using internal jobs only');
        }
      }
      
      console.log('📋 Total jobs found:', allJobs.length);

      // Remove duplicates
      const uniqueJobs = this.removeDuplicateJobs(allJobs);
      console.log('🔄 Unique jobs after deduplication:', uniqueJobs.length);

      // Apply advanced matching and ranking
      const rankedJobs = this.rankJobsByMatch(uniqueJobs, resumeData, preferences);
      console.log('📈 Jobs after ranking:', rankedJobs.length);

      // Apply filters
      const filteredJobs = this.applyJobFilters(rankedJobs, preferences);
      console.log('🎛️ Jobs after filtering:', filteredJobs.length);

      // For India, ensure we only return India jobs
      let finalJobs = filteredJobs;
      if (targetLocation === 'India' || targetLocation.toLowerCase().includes('india')) {
        finalJobs = filteredJobs.filter(job => 
          job.country === 'India' || 
          job.location.toLowerCase().includes('india') ||
          job.source === 'India-Specific' ||
          job.source === 'Enhanced-India'
        );
        
        // If no India jobs, get emergency India fallback
        if (finalJobs.length === 0) {
          finalJobs = this.getEmergencyIndiaJobs(skills);
        }
      } else {
        finalJobs = filteredJobs.length > 0 ? filteredJobs : this.getEmergencyFallbackJobs(skills);
      }
      
      console.log('✅ Final job recommendations:', finalJobs.length);
      return finalJobs.slice(0, 15); // Return top 15 matches
    } catch (error) {
      console.error('❌ Job matching failed:', error);
      return this.getEmergencyFallbackJobs(skills);
    }
  }

  /**
   * Rank jobs by comprehensive matching score
   */
  rankJobsByMatch(jobs, resumeData, preferences) {
    return jobs.map(job => {
      const matchScores = {};
      let totalWeight = 0;

      // Calculate individual match scores
      for (const [algorithm, weight] of Object.entries(this.getMatchingWeights(preferences))) {
        if (this.matchingAlgorithms[algorithm]) {
          matchScores[algorithm] = this.matchingAlgorithms[algorithm](job, resumeData, preferences);
          totalWeight += weight;
        }
      }

      // Calculate weighted overall match score
      const overallMatch = Object.entries(matchScores).reduce((total, [algorithm, score]) => {
        const weight = this.getMatchingWeights(preferences)[algorithm] || 0;
        return total + (score * weight);
      }, 0) / totalWeight;

      return {
        ...job,
        matchScore: Math.round(overallMatch),
        matchBreakdown: matchScores,
        recommendationReason: this.generateRecommendationReason(matchScores, job)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Get matching algorithm weights based on user preferences
   */
  getMatchingWeights(preferences) {
    const defaultWeights = {
      skillBased: 0.4,
      experienceBased: 0.25,
      locationBased: 0.15,
      salaryBased: 0.1,
      cultureBased: 0.1
    };

    // Adjust weights based on preferences
    if (preferences.prioritizeSkills) {
      defaultWeights.skillBased = 0.5;
      defaultWeights.experienceBased = 0.2;
    }

    if (preferences.prioritizeLocation) {
      defaultWeights.locationBased = 0.3;
      defaultWeights.skillBased = 0.3;
    }

    if (preferences.prioritizeSalary) {
      defaultWeights.salaryBased = 0.25;
      defaultWeights.skillBased = 0.35;
    }

    return defaultWeights;
  }

  /**
   * Calculate skill-based match score
   */
  calculateSkillBasedMatch(job, resumeData, preferences) {
    const resumeSkills = resumeData.skills || [];
    const jobSkills = this.extractJobSkills(job.description || '');
    
    if (jobSkills.length === 0) return 50; // Default score if no skills found

    const matchedSkills = resumeSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );

    const skillMatch = (matchedSkills.length / jobSkills.length) * 100;
    
    // Bonus for exact matches
    const exactMatches = resumeSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
    );
    
    const exactMatchBonus = (exactMatches.length / jobSkills.length) * 20;
    
    return Math.min(100, skillMatch + exactMatchBonus);
  }

  /**
   * Calculate experience-based match score
   */
  calculateExperienceMatch(job, resumeData, preferences) {
    const candidateExperience = resumeData.experience || 0;
    const requiredExperience = this.extractRequiredExperience(job.description || '');
    
    if (requiredExperience === 0) return 75; // Default if no experience requirement

    if (candidateExperience >= requiredExperience) {
      // Perfect match or overqualified
      const overqualificationPenalty = Math.max(0, (candidateExperience - requiredExperience - 2) * 5);
      return Math.max(70, 100 - overqualificationPenalty);
    } else {
      // Underqualified
      const experienceRatio = candidateExperience / requiredExperience;
      return Math.max(20, experienceRatio * 80);
    }
  }

  /**
   * Calculate location-based match score
   */
  calculateLocationMatch(job, resumeData, preferences) {
    const preferredLocation = resumeData.location || preferences.location || '';
    const jobLocation = job.location || '';
    
    // Remote work preference
    if (preferences.remote && (job.remote || job.workType === 'remote')) {
      return 100;
    }

    // Exact location match
    if (preferredLocation && jobLocation.toLowerCase().includes(preferredLocation.toLowerCase())) {
      return 95;
    }

    // Same state/region match
    const preferredState = this.extractState(preferredLocation);
    const jobState = this.extractState(jobLocation);
    
    if (preferredState && jobState && preferredState === jobState) {
      return 80;
    }

    // Default score for location mismatch
    return 40;
  }

  /**
   * Calculate salary-based match score
   */
  calculateSalaryMatch(job, resumeData, preferences) {
    const preferredSalary = preferences.salaryRange || resumeData.salaryExpectation;
    const jobSalary = this.extractSalaryRange(job.salary || job.description || '');
    
    if (!preferredSalary || !jobSalary) return 70; // Default if no salary info

    const preferredMin = preferredSalary.min || 0;
    const preferredMax = preferredSalary.max || Infinity;
    const jobMin = jobSalary.min || 0;
    const jobMax = jobSalary.max || Infinity;

    // Check if ranges overlap
    if (jobMax >= preferredMin && jobMin <= preferredMax) {
      // Calculate overlap percentage
      const overlapMin = Math.max(jobMin, preferredMin);
      const overlapMax = Math.min(jobMax, preferredMax);
      const overlapSize = overlapMax - overlapMin;
      const preferredRange = preferredMax - preferredMin;
      
      if (preferredRange > 0) {
        return Math.min(100, (overlapSize / preferredRange) * 100);
      }
      return 90;
    }

    // No overlap - calculate distance penalty
    const distance = Math.min(
      Math.abs(jobMax - preferredMin),
      Math.abs(preferredMax - jobMin)
    );
    
    const penalty = Math.min(50, distance / 1000); // $1k distance = 1 point penalty
    return Math.max(20, 70 - penalty);
  }

  /**
   * Calculate culture-based match score
   */
  calculateCultureMatch(job, resumeData, preferences) {
    // Simple culture matching based on company size, industry, etc.
    let score = 70; // Base score

    // Company size preference
    if (preferences.companySize) {
      const jobCompanySize = this.estimateCompanySize(job.company || '');
      if (jobCompanySize === preferences.companySize) {
        score += 15;
      }
    }

    // Industry preference
    if (preferences.industry) {
      const jobIndustry = this.detectJobIndustry(job.description || '');
      if (jobIndustry === preferences.industry) {
        score += 15;
      }
    }

    return Math.min(100, score);
  }

  /**
   * Apply additional filters to job results
   */
  applyJobFilters(jobs, preferences) {
    return jobs.filter(job => {
      // Job type filter
      if (preferences.jobType && job.jobType && job.jobType !== preferences.jobType) {
        return false;
      }

      // Remote work filter
      if (preferences.remoteOnly && !job.remote && job.workType !== 'remote') {
        return false;
      }

      // Minimum match score filter
      if (preferences.minMatchScore && job.matchScore < preferences.minMatchScore) {
        return false;
      }

      return true;
    });
  }

  /**
   * Search curated job database with enhanced matching
   */
  searchCuratedJobs(skills, industry, preferences) {
    console.log('🔍 Searching curated jobs for skills:', skills, 'industry:', industry);
    
    const curatedJobs = this.getCuratedJobDatabase();
    
    const matchedJobs = curatedJobs.filter(job => {
      // Always include some jobs for better user experience
      let includeJob = false;
      
      // Industry match (high priority)
      if (industry && job.industry === industry) {
        includeJob = true;
      }
      
      // Skill match (high priority)
      if (skills.length > 0) {
        const skillMatch = skills.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        if (skillMatch) includeJob = true;
      }
      
      // Include some general tech jobs if no specific matches
      if (!includeJob && job.skills.some(skill => 
        ['javascript', 'python', 'react', 'node', 'java', 'sql'].includes(skill.toLowerCase())
      )) {
        includeJob = true;
      }
      
      return includeJob;
    }).map(job => ({
      ...job,
      source: 'Curated',
      matchReason: this.getJobMatchReason(job, skills, industry)
    }));

    console.log('✅ Curated jobs matched:', matchedJobs.length);
    return matchedJobs;
  }

  /**
   * Get skill-based job recommendations
   */
  getSkillBasedJobs(skills, preferences) {
    const skillsArray = Array.isArray(skills) ? skills : [];
    console.log('🎯 Getting skill-based jobs for:', skillsArray);
    
    const skillJobMap = {
      javascript: ['Frontend Developer', 'Full Stack Developer', 'Web Developer'],
      react: ['React Developer', 'Frontend Engineer', 'UI Developer'],
      python: ['Python Developer', 'Backend Engineer', 'Data Scientist'],
      java: ['Java Developer', 'Software Engineer', 'Backend Developer'],
      node: ['Node.js Developer', 'Backend Engineer', 'API Developer'],
      sql: ['Database Developer', 'Data Analyst', 'Backend Engineer'],
      aws: ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect'],
      docker: ['DevOps Engineer', 'Platform Engineer', 'Site Reliability Engineer'],
      kubernetes: ['DevOps Engineer', 'Platform Engineer', 'Cloud Engineer'],
      'machine learning': ['ML Engineer', 'Data Scientist', 'AI Engineer'],
      tensorflow: ['ML Engineer', 'AI Developer', 'Data Scientist'],
      figma: ['UX Designer', 'Product Designer', 'UI/UX Designer'],
      'product management': ['Product Manager', 'Product Owner', 'Strategy Manager']
    };

    const jobRecommendations = [];
    const isIndiaLocation = preferences.location && preferences.location.toLowerCase().includes('india');
    
    skillsArray.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const relevantTitles = skillJobMap[skillLower] || [];
      
      relevantTitles.forEach(title => {
        jobRecommendations.push({
          title: title,
          company: isIndiaLocation ? this.getRandomIndianCompany() : this.getRandomCompany(),
          location: isIndiaLocation ? this.getRandomIndianCity() : 'Remote Available',
          salary: isIndiaLocation ? this.getIndianSalary(skill) : this.getSkillBasedSalary(skill),
          url: this.getJobSearchUrl(title),
          skills: [skill, ...this.getRelatedSkills(skill)],
          remote: true,
          jobType: 'full-time',
          industry: this.getSkillIndustry(skill),
          source: 'Skill-Based',
          matchReason: `Strong match for ${skill} skills`,
          country: isIndiaLocation ? 'India' : 'Global'
        });
      });
    });

    console.log('✅ Skill-based jobs generated:', jobRecommendations.length);
    return jobRecommendations.slice(0, 8);
  }

  /**
   * Get industry-specific job recommendations
   */
  getIndustryJobs(industry, preferences) {
    if (!industry) return [];
    
    console.log('🏢 Getting industry jobs for:', industry);
    
    const industryJobs = {
      technology: [
        { title: 'Software Engineer', skills: ['programming', 'algorithms', 'system design'] },
        { title: 'Product Manager', skills: ['product strategy', 'analytics', 'user research'] },
        { title: 'DevOps Engineer', skills: ['cloud', 'automation', 'monitoring'] },
        { title: 'Data Engineer', skills: ['data pipelines', 'sql', 'python'] }
      ],
      healthcare: [
        { title: 'Health Data Analyst', skills: ['healthcare analytics', 'sql', 'statistics'] },
        { title: 'Clinical Research Coordinator', skills: ['clinical trials', 'research', 'compliance'] },
        { title: 'Healthcare IT Specialist', skills: ['healthcare systems', 'ehr', 'hipaa'] }
      ],
      finance: [
        { title: 'Financial Analyst', skills: ['financial modeling', 'excel', 'analytics'] },
        { title: 'Risk Analyst', skills: ['risk management', 'statistics', 'modeling'] },
        { title: 'Fintech Developer', skills: ['financial systems', 'security', 'apis'] }
      ]
    };

    const jobs = industryJobs[industry] || [];
    
    return jobs.map(job => ({
      ...job,
      company: this.getRandomCompany(),
      location: 'Multiple Locations',
      salary: this.getIndustrySalary(industry),
      url: this.getJobSearchUrl(job.title),
      remote: true,
      jobType: 'full-time',
      industry: industry,
      source: 'Industry-Based',
      matchReason: `Perfect fit for ${industry} industry`
    }));
  }

  /**
   * Get experience-level appropriate jobs
   */
  getExperienceLevelJobs(experience, preferences) {
    console.log('📈 Getting experience-level jobs for:', experience, 'years');
    
    let levelJobs = [];
    
    if (experience <= 2) {
      // Entry level jobs
      levelJobs = [
        { title: 'Junior Developer', level: 'entry', salary: '$60k - $80k' },
        { title: 'Associate Software Engineer', level: 'entry', salary: '$65k - $85k' },
        { title: 'Graduate Trainee', level: 'entry', salary: '$55k - $75k' }
      ];
    } else if (experience <= 5) {
      // Mid level jobs
      levelJobs = [
        { title: 'Software Engineer', level: 'mid', salary: '$80k - $120k' },
        { title: 'Product Analyst', level: 'mid', salary: '$75k - $110k' },
        { title: 'Technical Consultant', level: 'mid', salary: '$85k - $125k' }
      ];
    } else {
      // Senior level jobs
      levelJobs = [
        { title: 'Senior Software Engineer', level: 'senior', salary: '$120k - $180k' },
        { title: 'Technical Lead', level: 'senior', salary: '$130k - $190k' },
        { title: 'Engineering Manager', level: 'senior', salary: '$140k - $200k' }
      ];
    }

    return levelJobs.map(job => ({
      ...job,
      company: this.getRandomCompany(),
      location: 'Remote Available',
      url: this.getJobSearchUrl(job.title),
      skills: this.getLevelAppropriateSkills(job.level),
      remote: true,
      jobType: 'full-time',
      industry: 'technology',
      source: 'Experience-Based',
      matchReason: `Appropriate for ${experience} years experience`
    }));
  }

  /**
   * Emergency India-specific fallback jobs
   */
  getEmergencyIndiaJobs(skills) {
    const skillsArray = Array.isArray(skills) ? skills : [];
    console.log('🚨 Using emergency India fallback jobs');
    
    return [
      {
        title: 'Software Developer',
        company: 'Indian IT Companies',
        location: 'Bangalore, India',
        salary: '₹5-10 LPA',
        url: 'https://www.naukri.com/software-developer-jobs',
        skills: skillsArray.length > 0 ? skillsArray : ['programming'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        source: 'India Emergency',
        matchReason: 'General technology role in India',
        match: 75,
        country: 'India'
      },
      {
        title: 'Full Stack Developer',
        company: 'Indian Startups',
        location: 'Hyderabad, India',
        salary: '₹6-12 LPA',
        url: 'https://www.naukri.com/full-stack-developer-jobs',
        skills: skillsArray.length > 0 ? skillsArray : ['web development'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        source: 'India Emergency',
        matchReason: 'Versatile development role in India',
        match: 70,
        country: 'India'
      },
      {
        title: 'Technical Specialist',
        company: 'Indian MNCs',
        location: 'Pune, India',
        salary: '₹4-8 LPA',
        url: 'https://www.naukri.com/technical-specialist-jobs',
        skills: skillsArray.length > 0 ? skillsArray : ['technical skills'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        source: 'India Emergency',
        matchReason: 'Technical expertise in India',
        match: 65,
        country: 'India'
      }
    ];
  }

  /**
   * Emergency fallback jobs when all else fails
   */
  getEmergencyFallbackJobs(skills) {
    const skillsArray = Array.isArray(skills) ? skills : [];
    console.log('🚨 Using emergency fallback jobs');
    
    return [
      {
        title: 'Software Developer',
        company: 'Growing Tech Companies',
        location: 'Remote Worldwide',
        salary: '$70k - $130k',
        url: 'https://stackoverflow.com/jobs?q=software%20developer',
        skills: skillsArray.length > 0 ? skillsArray : ['programming'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        source: 'Emergency Fallback',
        matchReason: 'General technology role',
        match: 75
      },
      {
        title: 'Full Stack Developer',
        company: 'Innovative Startups',
        location: 'Remote Available',
        salary: '$80k - $140k',
        url: 'https://wellfound.com/jobs?query=full%20stack%20developer',
        skills: skillsArray.length > 0 ? skillsArray : ['web development'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        source: 'Emergency Fallback',
        matchReason: 'Versatile development role',
        match: 70
      },
      {
        title: 'Technical Specialist',
        company: 'Various Industries',
        location: 'Multiple Locations',
        salary: '$65k - $120k',
        url: 'https://www.dice.com/jobs?q=technical%20specialist',
        skills: skillsArray.length > 0 ? skillsArray : ['technical skills'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        source: 'Emergency Fallback',
        matchReason: 'Technical expertise focused',
        match: 65
      }
    ];
  }

  /**
   * Get enhanced curated job database with real, accessible URLs
   */
  getCuratedJobDatabase() {
    return [
      {
        title: 'Senior Full Stack Developer',
        company: 'Shopify',
        location: 'San Francisco, CA (Remote Available)',
        remote: true,
        salary: { min: 120000, max: 160000, currency: 'USD' },
        description: 'We are looking for a Senior Full Stack Developer with expertise in React, Node.js, and cloud technologies. You will lead development of scalable web applications and mentor junior developers.',
        requirements: ['5+ years experience', 'React', 'Node.js', 'AWS', 'TypeScript'],
        benefits: ['Health insurance', 'Stock options', 'Remote work', 'Professional development'],
        jobType: 'full-time',
        industry: 'technology',
        companySize: 'medium',
        url: 'https://www.shopify.com/careers/search?keywords=senior%20full%20stack%20developer',
        skills: ['react', 'node.js', 'typescript', 'aws', 'javascript']
      },
      {
        title: 'Data Scientist',
        company: 'Netflix',
        location: 'New York, NY (Remote Options)',
        remote: true,
        salary: { min: 100000, max: 140000, currency: 'USD' },
        description: 'Join our data science team to build machine learning models and derive insights from large datasets. Experience with Python, SQL, and ML frameworks required.',
        requirements: ['3+ years experience', 'Python', 'SQL', 'Machine Learning', 'Statistics'],
        benefits: ['Health insurance', '401k', 'Flexible hours', 'Learning budget'],
        jobType: 'full-time',
        industry: 'technology',
        companySize: 'large',
        url: 'https://jobs.netflix.com/search?q=data%20scientist',
        skills: ['python', 'sql', 'machine learning', 'tensorflow', 'pandas']
      },
      {
        title: 'Product Manager',
        company: 'Stripe',
        location: 'Austin, TX (Remote Available)',
        remote: true,
        salary: { min: 110000, max: 150000, currency: 'USD' },
        description: 'Lead product strategy and roadmap for our SaaS platform. Work closely with engineering and design teams to deliver exceptional user experiences.',
        requirements: ['4+ years PM experience', 'Agile', 'User research', 'Analytics', 'Communication'],
        benefits: ['Equity', 'Health insurance', 'Remote work', 'Unlimited PTO'],
        jobType: 'full-time',
        industry: 'technology',
        companySize: 'startup',
        url: 'https://stripe.com/jobs/search?q=product%20manager',
        skills: ['product management', 'agile', 'analytics', 'user research']
      },
      {
        title: 'DevOps Engineer',
        company: 'GitHub',
        location: 'Seattle, WA (Remote Worldwide)',
        remote: true,
        salary: { min: 105000, max: 145000, currency: 'USD' },
        description: 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability. Experience with AWS, Docker, and Kubernetes required.',
        requirements: ['3+ years DevOps experience', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        benefits: ['Stock options', 'Health insurance', 'Remote work', 'Conference budget'],
        jobType: 'full-time',
        industry: 'technology',
        companySize: 'medium',
        url: 'https://github.com/about/careers?query=devops%20engineer',
        skills: ['aws', 'docker', 'kubernetes', 'jenkins', 'terraform']
      },
      {
        title: 'UX Designer',
        company: 'Adobe',
        location: 'Los Angeles, CA (Remote Options)',
        remote: true,
        salary: { min: 85000, max: 115000, currency: 'USD' },
        description: 'Create intuitive user experiences for web and mobile applications. Collaborate with product and engineering teams to bring designs to life.',
        requirements: ['3+ years UX experience', 'Figma', 'User research', 'Prototyping', 'Design systems'],
        benefits: ['Health insurance', 'Creative freedom', 'Design tools budget', 'Flexible hours'],
        jobType: 'full-time',
        industry: 'design',
        companySize: 'small',
        url: 'https://adobe.wd5.myworkdayjobs.com/external_experienced?q=UX%20Designer',
        skills: ['figma', 'sketch', 'user research', 'prototyping', 'design systems']
      },
      {
        title: 'Frontend Developer',
        company: 'Microsoft',
        location: 'Redmond, WA (Remote Available)',
        remote: true,
        salary: { min: 95000, max: 135000, currency: 'USD' },
        description: 'Build modern web applications using React, TypeScript, and Azure cloud services. Work on products used by millions of users worldwide.',
        requirements: ['3+ years frontend experience', 'React', 'TypeScript', 'CSS', 'Azure'],
        benefits: ['Health insurance', 'Stock purchase plan', 'Remote work', 'Learning resources'],
        jobType: 'full-time',
        industry: 'technology',
        companySize: 'large',
        url: 'https://careers.microsoft.com/professionals/us/en/search-results?keywords=frontend%20developer',
        skills: ['react', 'typescript', 'javascript', 'css', 'azure']
      },
      {
        title: 'Backend Engineer',
        company: 'Spotify',
        location: 'New York, NY (Hybrid)',
        remote: false,
        salary: { min: 110000, max: 150000, currency: 'USD' },
        description: 'Develop scalable backend services for music streaming platform. Work with microservices, APIs, and distributed systems.',
        requirements: ['4+ years backend experience', 'Java', 'Python', 'Kubernetes', 'Microservices'],
        benefits: ['Health insurance', 'Spotify Premium', 'Flexible hours', 'Music budget'],
        jobType: 'full-time',
        industry: 'technology',
        companySize: 'large',
        url: 'https://www.lifeatspotify.com/jobs?q=backend%20engineer',
        skills: ['java', 'python', 'kubernetes', 'microservices', 'sql']
      },
      {
        title: 'Mobile Developer',
        company: 'Uber',
        location: 'San Francisco, CA (Hybrid)',
        remote: false,
        salary: { min: 125000, max: 165000, currency: 'USD' },
        description: 'Build mobile applications for iOS and Android platforms. Work on ride-sharing and delivery features used by millions.',
        requirements: ['3+ years mobile experience', 'Swift', 'Kotlin', 'React Native', 'Mobile UI'],
        benefits: ['Health insurance', 'Uber credits', 'Stock options', 'Commuter benefits'],
        jobType: 'full-time',
        industry: 'technology',
        companySize: 'large',
        url: 'https://www.uber.com/careers/list/?query=mobile%20developer',
        skills: ['swift', 'kotlin', 'react native', 'ios', 'android']
      }
    ];
  }

  async searchAdzuna(skills, location) {
    // Ensure skills is an array
    const skillsArray = Array.isArray(skills) ? skills : [];
    if (skillsArray.length === 0) return [];
    
    const query = skillsArray.slice(0, 3).join(' ');
    
    // Use India API endpoint for Indian jobs
    const countryCode = location.toLowerCase().includes('india') ? 'in' : 'us';
    const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${this.adzunaConfig.appId}&app_key=${this.adzunaConfig.appKey}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&results_per_page=10`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      
      const data = await response.json();
      
      return data.results?.map(job => ({
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        url: job.redirect_url,
        salary: job.salary_min ? (countryCode === 'in' ? `₹${job.salary_min}+` : `$${job.salary_min}+`) : 'Competitive',
        match: this.calculateMatch(job.description, skillsArray),
        source: 'Adzuna',
        country: countryCode === 'in' ? 'India' : 'US'
      })) || [];
    } catch (error) {
      console.error('Adzuna API error:', error);
      return [];
    }
  }

  /**
   * Enhanced job recommendations with proper URLs and regional support
   */
  getFallbackJobs(skills) {
    // Create comprehensive job database with real, accessible URLs
    const jobDatabase = this.getComprehensiveJobDatabase();
    
    // Filter jobs based on skills
    const matchingJobs = [];
    
    skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const relevantJobs = jobDatabase.filter(job => 
        job.skills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skillLower) || 
          skillLower.includes(jobSkill.toLowerCase())
        )
      );
      
      matchingJobs.push(...relevantJobs);
    });

    // Remove duplicates and add fallback jobs if no matches
    const uniqueJobs = this.removeDuplicateJobs(matchingJobs);
    
    if (uniqueJobs.length === 0) {
      // Add general tech jobs as fallback
      return this.getGeneralTechJobs();
    }

    // Calculate match scores and sort
    return uniqueJobs.map(job => ({
      ...job,
      match: this.calculateSkillMatch(job.skills, skills),
      source: 'Curated'
    })).sort((a, b) => b.match - a.match).slice(0, 12);
  }

  /**
   * Comprehensive job database with real, accessible URLs
   */
  getComprehensiveJobDatabase() {
    return [
      // Frontend Development Jobs
      {
        title: 'Senior Frontend Developer',
        company: 'Microsoft',
        location: 'Redmond, WA (Remote Available)',
        salary: '$130k - $180k',
        url: 'https://careers.microsoft.com/professionals/us/en/search-results?keywords=frontend%20developer',
        skills: ['javascript', 'react', 'typescript', 'css', 'html'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Join Microsoft to build next-generation web applications using React and TypeScript.'
      },
      {
        title: 'React Developer',
        company: 'Meta (Facebook)',
        location: 'Menlo Park, CA (Remote Options)',
        salary: '$140k - $200k',
        url: 'https://www.metacareers.com/jobs/?q=react%20developer',
        skills: ['react', 'javascript', 'node.js', 'graphql'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build innovative social media features using React and modern web technologies.'
      },
      {
        title: 'Frontend Engineer',
        company: 'Google',
        location: 'Mountain View, CA (Hybrid)',
        salary: '$150k - $220k',
        url: 'https://careers.google.com/jobs/results/?q=frontend%20engineer',
        skills: ['javascript', 'typescript', 'angular', 'vue', 'css'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Create user interfaces for Google products used by billions of people.'
      },

      // Backend Development Jobs
      {
        title: 'Senior Backend Engineer',
        company: 'Amazon',
        location: 'Seattle, WA (Remote Friendly)',
        salary: '$140k - $190k',
        url: 'https://www.amazon.jobs/en/search?base_query=backend%20engineer',
        skills: ['python', 'java', 'aws', 'microservices', 'sql'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build scalable backend systems for Amazon\'s e-commerce platform.'
      },
      {
        title: 'Node.js Developer',
        company: 'Netflix',
        location: 'Los Gatos, CA (Remote Available)',
        salary: '$135k - $185k',
        url: 'https://jobs.netflix.com/search?q=node.js%20developer',
        skills: ['node.js', 'javascript', 'mongodb', 'express', 'aws'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Develop streaming infrastructure and content delivery systems.'
      },
      {
        title: 'Python Developer',
        company: 'Spotify',
        location: 'New York, NY (Remote Options)',
        salary: '$120k - $160k',
        url: 'https://www.lifeatspotify.com/jobs?q=python%20developer',
        skills: ['python', 'django', 'postgresql', 'redis', 'kubernetes'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build music recommendation algorithms and streaming services.'
      },

      // Full Stack Development Jobs
      {
        title: 'Full Stack Developer',
        company: 'Shopify',
        location: 'Ottawa, Canada (Remote Worldwide)',
        salary: '$110k - $150k',
        url: 'https://www.shopify.com/careers/search?keywords=full%20stack%20developer',
        skills: ['ruby', 'rails', 'react', 'javascript', 'postgresql'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build e-commerce solutions for millions of merchants worldwide.'
      },
      {
        title: 'Software Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA (Remote Available)',
        salary: '$145k - $195k',
        url: 'https://stripe.com/jobs/search?q=software%20engineer',
        skills: ['ruby', 'javascript', 'react', 'scala', 'go'],
        remote: true,
        jobType: 'full-time',
        industry: 'fintech',
        description: 'Develop payment processing systems and financial infrastructure.'
      },

      // Data Science Jobs
      {
        title: 'Data Scientist',
        company: 'Airbnb',
        location: 'San Francisco, CA (Remote Friendly)',
        salary: '$130k - $170k',
        url: 'https://careers.airbnb.com/positions/?search=data%20scientist',
        skills: ['python', 'sql', 'machine learning', 'tensorflow', 'pandas'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Analyze user behavior and optimize booking experiences.'
      },
      {
        title: 'Machine Learning Engineer',
        company: 'Uber',
        location: 'San Francisco, CA (Hybrid)',
        salary: '$140k - $180k',
        url: 'https://www.uber.com/careers/list/?query=machine%20learning%20engineer',
        skills: ['python', 'tensorflow', 'pytorch', 'kubernetes', 'spark'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build ML models for ride-sharing and delivery optimization.'
      },

      // DevOps Jobs
      {
        title: 'DevOps Engineer',
        company: 'GitHub',
        location: 'Remote Worldwide',
        salary: '$125k - $165k',
        url: 'https://github.com/about/careers?query=devops%20engineer',
        skills: ['kubernetes', 'docker', 'aws', 'terraform', 'jenkins'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Maintain and scale GitHub\'s development infrastructure.'
      },
      {
        title: 'Cloud Engineer',
        company: 'Atlassian',
        location: 'Austin, TX (Remote Available)',
        salary: '$115k - $155k',
        url: 'https://www.atlassian.com/company/careers/all-jobs?search=cloud%20engineer',
        skills: ['aws', 'azure', 'terraform', 'kubernetes', 'python'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build and maintain cloud infrastructure for developer tools.'
      },

      // Mobile Development Jobs
      {
        title: 'iOS Developer',
        company: 'Apple',
        location: 'Cupertino, CA',
        salary: '$140k - $190k',
        url: 'https://jobs.apple.com/en-us/search?search=ios%20developer',
        skills: ['swift', 'objective-c', 'ios', 'xcode'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Develop native iOS applications for Apple devices.'
      },
      {
        title: 'Android Developer',
        company: 'Google',
        location: 'Mountain View, CA (Hybrid)',
        salary: '$135k - $185k',
        url: 'https://careers.google.com/jobs/results/?q=android%20developer',
        skills: ['kotlin', 'java', 'android', 'firebase'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build Android applications and platform features.'
      },

      // Product Management Jobs
      {
        title: 'Product Manager',
        company: 'Slack',
        location: 'San Francisco, CA (Remote Available)',
        salary: '$140k - $180k',
        url: 'https://slack.com/careers#openings?search=product%20manager',
        skills: ['product management', 'analytics', 'agile', 'user research'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Drive product strategy for workplace communication tools.'
      },

      // Design Jobs
      {
        title: 'UX Designer',
        company: 'Adobe',
        location: 'San Jose, CA (Remote Options)',
        salary: '$100k - $140k',
        url: 'https://adobe.wd5.myworkdayjobs.com/external_experienced?q=UX%20Designer',
        skills: ['figma', 'sketch', 'user research', 'prototyping', 'design systems'],
        remote: true,
        jobType: 'full-time',
        industry: 'design',
        description: 'Design creative software used by millions of professionals.'
      },

      // Startup Jobs
      {
        title: 'Full Stack Engineer',
        company: 'Y Combinator Startups',
        location: 'Various Locations (Remote)',
        salary: '$90k - $140k + Equity',
        url: 'https://www.worklist.co/companies/y-combinator',
        skills: ['javascript', 'python', 'react', 'node.js', 'postgresql'],
        remote: true,
        jobType: 'full-time',
        industry: 'startup',
        description: 'Join early-stage startups building innovative products.'
      },

      // Remote-First Companies
      {
        title: 'Software Developer',
        company: 'GitLab',
        location: 'Remote Worldwide',
        salary: '$100k - $150k',
        url: 'https://about.gitlab.com/jobs/apply/?search=software%20developer',
        skills: ['ruby', 'go', 'vue.js', 'postgresql', 'kubernetes'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Build DevOps platform used by developers worldwide.'
      },
      {
        title: 'Frontend Developer',
        company: 'Buffer',
        location: 'Remote Worldwide',
        salary: '$85k - $125k',
        url: 'https://buffer.com/journey/jobs?search=frontend%20developer',
        skills: ['react', 'javascript', 'css', 'node.js'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        description: 'Develop social media management tools for businesses.'
      }
    ];
  }

  /**
   * General tech jobs for fallback when no specific matches
   */
  getGeneralTechJobs() {
    return [
      {
        title: 'Software Engineer',
        company: 'Various Tech Companies',
        location: 'Multiple Locations (Remote Available)',
        salary: '$80k - $150k',
        url: 'https://stackoverflow.com/jobs?q=software%20engineer',
        skills: ['programming', 'software development'],
        remote: true,
        match: 70,
        source: 'General'
      },
      {
        title: 'Web Developer',
        company: 'Digital Agencies',
        location: 'Nationwide (Remote Options)',
        salary: '$60k - $120k',
        url: 'https://www.dice.com/jobs?q=web%20developer',
        skills: ['html', 'css', 'javascript'],
        remote: true,
        match: 65,
        source: 'General'
      },
      {
        title: 'Data Analyst',
        company: 'Various Industries',
        location: 'Multiple Cities (Remote Available)',
        salary: '$55k - $100k',
        url: 'https://www.glassdoor.com/Job/data-analyst-jobs-SRCH_KO0,12.htm',
        skills: ['sql', 'excel', 'analytics'],
        remote: true,
        match: 60,
        source: 'General'
      }
    ];
  }

  /**
   * Remove duplicate jobs based on title and company
   */
  removeDuplicateJobs(jobs) {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Calculate skill match percentage
   */
  calculateSkillMatch(jobSkills, resumeSkills) {
    if (!jobSkills || !resumeSkills || jobSkills.length === 0) return 50;
    
    const matches = jobSkills.filter(jobSkill =>
      resumeSkills.some(resumeSkill =>
        jobSkill.toLowerCase().includes(resumeSkill.toLowerCase()) ||
        resumeSkill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    
    return Math.round((matches.length / jobSkills.length) * 100);
  }

  calculateMatch(jobDescription, skills) {
    const desc = jobDescription.toLowerCase();
    const matches = skills.filter(skill => desc.includes(skill.toLowerCase()));
    return Math.round((matches.length / skills.length) * 100);
  }

  /**
   * Helper methods for enhanced matching
   */
  extractJobSkills(jobDescription) {
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'express',
      'django', 'flask', 'spring', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'agile', 'scrum',
      'html', 'css', 'typescript', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'machine learning', 'data science', 'analytics', 'tableau', 'powerbi', 'excel'
    ];

    const description = jobDescription.toLowerCase();
    return commonSkills.filter(skill => description.includes(skill));
  }

  extractRequiredExperience(jobDescription) {
    const expPatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /minimum\s*(?:of\s*)?(\d+)\s*years?/i,
      /at\s*least\s*(\d+)\s*years?/i
    ];

    for (const pattern of expPatterns) {
      const match = jobDescription.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }

    // Default based on job level
    const desc = jobDescription.toLowerCase();
    if (desc.includes('senior') || desc.includes('lead')) return 5;
    if (desc.includes('mid') || desc.includes('intermediate')) return 3;
    if (desc.includes('junior') || desc.includes('entry')) return 1;

    return 2; // Default
  }

  extractState(location) {
    if (!location) return null;
    
    const statePatterns = [
      /,\s*([A-Z]{2})\s*$/,  // ", CA"
      /,\s*([A-Za-z\s]+)\s*$/ // ", California"
    ];

    for (const pattern of statePatterns) {
      const match = location.match(pattern);
      if (match && match[1]) {
        return match[1].trim().toUpperCase();
      }
    }

    return null;
  }

  extractSalaryRange(text) {
    const salaryPatterns = [
      /\$(\d{2,3}),?(\d{3})\s*-\s*\$(\d{2,3}),?(\d{3})/,
      /\$(\d{2,3})k?\s*-\s*\$(\d{2,3})k?/i,
      /salary[:\s]+\$?([0-9,]+)/i
    ];

    for (const pattern of salaryPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1] && match[3]) {
          return {
            min: parseInt(match[1] + match[2]),
            max: parseInt(match[3] + match[4]),
            currency: 'USD'
          };
        }
      }
    }

    return null;
  }

  estimateCompanySize(companyName) {
    // Simple heuristic based on company name
    const name = companyName.toLowerCase();
    
    if (name.includes('inc') || name.includes('corp') || name.includes('ltd')) {
      return 'large';
    }
    if (name.includes('studio') || name.includes('lab') || name.includes('startup')) {
      return 'small';
    }
    
    return 'medium'; // Default
  }

  detectJobIndustry(jobDescription) {
    const desc = jobDescription.toLowerCase();
    
    const industryKeywords = {
      technology: ['software', 'developer', 'engineer', 'tech', 'programming'],
      healthcare: ['medical', 'healthcare', 'clinical', 'patient'],
      finance: ['financial', 'banking', 'investment', 'finance'],
      marketing: ['marketing', 'advertising', 'brand', 'campaign'],
      education: ['education', 'teaching', 'academic', 'university']
    };

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        return industry;
      }
    }

    return 'general';
  }

  generateRecommendationReason(matchScores, job) {
    const reasons = [];
    
    if (matchScores.skillBased >= 80) {
      reasons.push('Strong skills match');
    }
    if (matchScores.experienceBased >= 80) {
      reasons.push('Experience level fits well');
    }
    if (matchScores.locationBased >= 90) {
      reasons.push('Perfect location match');
    }
    if (matchScores.salaryBased >= 80) {
      reasons.push('Salary aligns with expectations');
    }

    if (reasons.length === 0) {
      reasons.push('Good overall fit');
    }

    return reasons.join(', ');
  }

  /**
   * Helper methods for enhanced job matching
   */
  getJobMatchReason(job, skills, industry) {
    const reasons = [];
    
    if (industry && job.industry === industry) {
      reasons.push(`${industry} industry match`);
    }
    
    const skillMatches = skills.filter(skill => 
      job.skills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    if (skillMatches.length > 0) {
      reasons.push(`${skillMatches.length} skill matches`);
    }
    
    if (job.remote) {
      reasons.push('remote available');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'good general fit';
  }

  getRandomCompany() {
    const companies = [
      'TechCorp Solutions', 'InnovateLabs', 'Digital Dynamics', 'CloudFirst Technologies',
      'DataDriven Inc', 'NextGen Systems', 'SmartTech Solutions', 'FutureBuild Co',
      'AgileWorks', 'CodeCraft Studios', 'DevOps Masters', 'ScaleUp Technologies'
    ];
    return companies[Math.floor(Math.random() * companies.length)];
  }

  getRandomIndianCompany() {
    const indianCompanies = [
      'TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra',
      'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'Ola', 'BYJU\'S',
      'Freshworks', 'Zoho', 'InMobi', 'Razorpay', 'PhonePe'
    ];
    return indianCompanies[Math.floor(Math.random() * indianCompanies.length)];
  }

  getRandomIndianCity() {
    const indianCities = [
      'Bangalore, India', 'Hyderabad, India', 'Pune, India', 'Chennai, India',
      'Mumbai, India', 'Delhi, India', 'Gurgaon, India', 'Noida, India',
      'Kolkata, India', 'Ahmedabad, India', 'Kochi, India', 'Indore, India'
    ];
    return indianCities[Math.floor(Math.random() * indianCities.length)];
  }

  getIndianSalary(skill) {
    const salaryMap = {
      javascript: '₹4-8 LPA',
      react: '₹5-10 LPA',
      python: '₹6-12 LPA',
      java: '₹5-11 LPA',
      aws: '₹8-15 LPA',
      'machine learning': '₹10-18 LPA',
      kubernetes: '₹9-16 LPA',
      'product management': '₹12-25 LPA'
    };
    return salaryMap[skill.toLowerCase()] || '₹4-10 LPA';
  }

  getSkillBasedSalary(skill) {
    const salaryMap = {
      javascript: '$70k - $130k',
      react: '$75k - $140k',
      python: '$80k - $150k',
      java: '$85k - $155k',
      aws: '$90k - $160k',
      'machine learning': '$100k - $180k',
      kubernetes: '$95k - $165k',
      'product management': '$110k - $170k'
    };
    return salaryMap[skill.toLowerCase()] || '$70k - $120k';
  }

  getIndustrySalary(industry) {
    const salaryMap = {
      technology: '$80k - $150k',
      healthcare: '$65k - $120k',
      finance: '$75k - $140k',
      education: '$50k - $90k',
      consulting: '$70k - $130k'
    };
    return salaryMap[industry] || '$65k - $115k';
  }

  getJobSearchUrl(title) {
    const encodedTitle = encodeURIComponent(title);
    return `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}`;
  }

  getRelatedSkills(skill) {
    const relatedSkillsMap = {
      javascript: ['html', 'css', 'typescript'],
      react: ['javascript', 'jsx', 'redux'],
      python: ['django', 'flask', 'pandas'],
      java: ['spring', 'hibernate', 'maven'],
      aws: ['cloud', 'ec2', 's3'],
      docker: ['kubernetes', 'containerization'],
      sql: ['database', 'postgresql', 'mysql']
    };
    return relatedSkillsMap[skill.toLowerCase()] || [];
  }

  getSkillIndustry(skill) {
    const industryMap = {
      javascript: 'technology',
      react: 'technology',
      python: 'technology',
      java: 'technology',
      'machine learning': 'technology',
      'product management': 'technology',
      figma: 'design',
      sql: 'technology'
    };
    return industryMap[skill.toLowerCase()] || 'technology';
  }

  getLevelAppropriateSkills(level) {
    const skillsByLevel = {
      entry: ['programming basics', 'version control', 'debugging'],
      mid: ['system design', 'architecture', 'team collaboration'],
      senior: ['technical leadership', 'mentoring', 'strategic planning']
    };
    return skillsByLevel[level] || ['technical skills'];
  }

  /**
   * Get company career pages for direct applications
   */
  getCompanyCareerPages() {
    return {
      'Google': 'https://careers.google.com/jobs/results/',
      'Microsoft': 'https://careers.microsoft.com/professionals/us/en/',
      'Amazon': 'https://www.amazon.jobs/en/search',
      'Apple': 'https://jobs.apple.com/en-us/search',
      'Meta': 'https://www.metacareers.com/jobs/',
      'Netflix': 'https://jobs.netflix.com/search',
      'Spotify': 'https://www.lifeatspotify.com/jobs',
      'Uber': 'https://www.uber.com/careers/list/',
      'Airbnb': 'https://careers.airbnb.com/positions/',
      'Stripe': 'https://stripe.com/jobs/search',
      'Shopify': 'https://www.shopify.com/careers/search',
      'GitHub': 'https://github.com/about/careers',
      'Adobe': 'https://adobe.wd5.myworkdayjobs.com/external_experienced',
      'Salesforce': 'https://salesforce.wd1.myworkdayjobs.com/External_Career_Site',
      'Tesla': 'https://www.tesla.com/careers/search/',
      'SpaceX': 'https://www.spacex.com/careers/',
      'Nvidia': 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
      'Intel': 'https://jobs.intel.com/page/show/search-results',
      'IBM': 'https://www.ibm.com/careers/search',
      'Oracle': 'https://www.oracle.com/corporate/careers/'
    };
  }

  /**
   * Get alternative job boards without regional restrictions
   */
  getAlternativeJobBoards() {
    return {
      'Stack Overflow Jobs': 'https://stackoverflow.com/jobs',
      'AngelList': 'https://wellfound.com/jobs',
      'Dice': 'https://www.dice.com/jobs',
      'Remote.co': 'https://remote.co/remote-jobs/',
      'We Work Remotely': 'https://weworkremotely.com/',
      'FlexJobs': 'https://www.flexjobs.com/',
      'Upwork': 'https://www.upwork.com/nx/search/jobs/',
      'Freelancer': 'https://www.freelancer.com/jobs/',
      'Toptal': 'https://www.toptal.com/developers',
      'Hired': 'https://hired.com/',
      'Vettery': 'https://vettery.com/',
      'CyberSeek': 'https://www.cyberseek.org/heatmap.html'
    };
  }

  /**
   * Get networking platforms for job discovery
   */
  getNetworkingPlatforms() {
    return {
      'LinkedIn': 'https://www.linkedin.com/jobs/',
      'GitHub Jobs': 'https://github.com/jobs',
      'Hacker News Jobs': 'https://news.ycombinator.com/jobs',
      'Reddit Jobs': 'https://www.reddit.com/r/forhire/',
      'Discord Communities': 'Various tech Discord servers',
      'Slack Communities': 'Tech industry Slack workspaces',
      'Meetup Groups': 'https://www.meetup.com/',
      'Tech Conferences': 'Industry conference job boards',
      'Alumni Networks': 'University and bootcamp networks',
      'Professional Associations': 'Industry-specific organizations'
    };
  }

  /**
   * Get freelance platforms for contract work
   */
  getFreelancePlatforms() {
    return {
      'Upwork': 'https://www.upwork.com/',
      'Freelancer': 'https://www.freelancer.com/',
      'Fiverr': 'https://www.fiverr.com/',
      'Toptal': 'https://www.toptal.com/',
      'Guru': 'https://www.guru.com/',
      '99designs': 'https://99designs.com/',
      'PeoplePerHour': 'https://www.peopleperhour.com/',
      'Contra': 'https://contra.com/',
      'Gun.io': 'https://gun.io/',
      'Codementor': 'https://www.codementor.io/'
    };
  }

  /**
   * Generate direct application URLs for jobs
   */
  generateDirectApplicationUrl(jobTitle, company) {
    const careerPages = this.getCompanyCareerPages();
    const baseUrl = careerPages[company];
    
    if (baseUrl) {
      const searchQuery = encodeURIComponent(jobTitle);
      return `${baseUrl}?q=${searchQuery}`;
    }
    
    // Fallback to LinkedIn job search
    const linkedinQuery = encodeURIComponent(`${jobTitle} ${company}`);
    return `https://www.linkedin.com/jobs/search/?keywords=${linkedinQuery}`;
  }

  /**
   * Get enhanced India-specific job recommendations based on deep resume analysis
   */
  getEnhancedIndiaJobs(skills, experience, industry, preferences) {
    const skillsArray = Array.isArray(skills) ? skills : [];
    console.log('🇮🇳 Getting enhanced India jobs for skills:', skillsArray, 'experience:', experience);
    
    // Comprehensive India job database with better matching
    const indiaJobDatabase = [
      // IT Services Companies
      {
        title: 'Software Engineer',
        company: 'Tata Consultancy Services (TCS)',
        location: 'Bangalore, India',
        salary: this.getExperienceBasedSalary(experience, 'software engineer'),
        url: 'https://www.tcs.com/careers',
        skills: ['java', 'python', 'javascript', 'spring boot', 'microservices'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        source: 'Enhanced-India',
        matchReason: 'Top Indian IT company with global projects',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Work on enterprise applications and digital transformation projects for global clients.'
      },
      {
        title: 'Full Stack Developer',
        company: 'Infosys',
        location: 'Hyderabad, India',
        salary: this.getExperienceBasedSalary(experience, 'full stack developer'),
        url: 'https://www.infosys.com/careers/',
        skills: ['react', 'node.js', 'mongodb', 'express', 'typescript'],
        remote: true,
        jobType: 'full-time',
        industry: 'technology',
        source: 'Enhanced-India',
        matchReason: 'Leading Indian tech company with modern stack',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Build scalable web applications using modern JavaScript frameworks.'
      },
      {
        title: 'Data Scientist',
        company: 'Wipro',
        location: 'Pune, India',
        salary: this.getExperienceBasedSalary(experience, 'data scientist'),
        url: 'https://careers.wipro.com/',
        skills: ['python', 'machine learning', 'sql', 'tensorflow', 'pandas'],
        remote: false,
        jobType: 'full-time',
        industry: 'technology',
        source: 'Enhanced-India',
        matchReason: 'Major Indian IT services with AI/ML focus',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Develop ML models and analytics solutions for enterprise clients.'
      },
      
      // Indian Startups & Unicorns
      {
        title: 'Product Manager',
        company: 'Flipkart',
        location: 'Bangalore, India',
        salary: this.getExperienceBasedSalary(experience, 'product manager'),
        url: 'https://www.flipkartcareers.com/',
        skills: ['product management', 'analytics', 'user research', 'agile', 'sql'],
        remote: false,
        jobType: 'full-time',
        industry: 'e-commerce',
        source: 'Enhanced-India',
        matchReason: 'Leading Indian e-commerce with product innovation',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Drive product strategy for India\'s largest e-commerce platform.'
      },
      {
        title: 'Backend Engineer',
        company: 'Zomato',
        location: 'Gurgaon, India',
        salary: this.getExperienceBasedSalary(experience, 'backend engineer'),
        url: 'https://www.zomato.com/careers',
        skills: ['node.js', 'python', 'aws', 'mongodb', 'redis'],
        remote: true,
        jobType: 'full-time',
        industry: 'food-tech',
        source: 'Enhanced-India',
        matchReason: 'Popular Indian food delivery with high-scale systems',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Build scalable backend systems for millions of food orders.'
      },
      {
        title: 'Frontend Developer',
        company: 'Paytm',
        location: 'Noida, India',
        salary: this.getExperienceBasedSalary(experience, 'frontend developer'),
        url: 'https://jobs.paytm.com/',
        skills: ['react', 'javascript', 'css', 'redux', 'webpack'],
        remote: false,
        jobType: 'full-time',
        industry: 'fintech',
        source: 'Enhanced-India',
        matchReason: 'Leading Indian fintech with modern UI/UX',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Create intuitive financial interfaces for millions of users.'
      },
      {
        title: 'DevOps Engineer',
        company: 'Ola',
        location: 'Bangalore, India',
        salary: this.getExperienceBasedSalary(experience, 'devops engineer'),
        url: 'https://www.olacabs.com/careers/',
        skills: ['aws', 'kubernetes', 'docker', 'jenkins', 'terraform'],
        remote: true,
        jobType: 'full-time',
        industry: 'mobility',
        source: 'Enhanced-India',
        matchReason: 'Major Indian ride-sharing with cloud-native architecture',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Manage cloud infrastructure for ride-sharing platform.'
      },
      {
        title: 'Mobile Developer',
        company: 'BYJU\'S',
        location: 'Bangalore, India',
        salary: this.getExperienceBasedSalary(experience, 'mobile developer'),
        url: 'https://byjus.com/careers/',
        skills: ['react native', 'android', 'ios', 'flutter', 'firebase'],
        remote: false,
        jobType: 'full-time',
        industry: 'edtech',
        source: 'Enhanced-India',
        matchReason: 'Leading Indian edtech with innovative mobile apps',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Build educational mobile apps used by millions of students.'
      },
      {
        title: 'Data Engineer',
        company: 'Swiggy',
        location: 'Bangalore, India',
        salary: this.getExperienceBasedSalary(experience, 'data engineer'),
        url: 'https://careers.swiggy.com/',
        skills: ['python', 'spark', 'kafka', 'sql', 'airflow'],
        remote: true,
        jobType: 'full-time',
        industry: 'food-tech',
        source: 'Enhanced-India',
        matchReason: 'Top Indian food delivery with big data challenges',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Build data pipelines for food delivery optimization.'
      },
      
      // Emerging Indian Companies
      {
        title: 'Software Developer',
        company: 'Razorpay',
        location: 'Bangalore, India',
        salary: this.getExperienceBasedSalary(experience, 'software developer'),
        url: 'https://razorpay.com/jobs/',
        skills: ['java', 'python', 'mysql', 'redis', 'aws'],
        remote: true,
        jobType: 'full-time',
        industry: 'fintech',
        source: 'Enhanced-India',
        matchReason: 'Fast-growing Indian payment gateway',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Develop payment processing systems for Indian businesses.'
      },
      {
        title: 'Frontend Engineer',
        company: 'PhonePe',
        location: 'Bangalore, India',
        salary: this.getExperienceBasedSalary(experience, 'frontend engineer'),
        url: 'https://www.phonepe.com/careers/',
        skills: ['react', 'javascript', 'typescript', 'redux', 'css'],
        remote: false,
        jobType: 'full-time',
        industry: 'fintech',
        source: 'Enhanced-India',
        matchReason: 'Leading Indian digital payments platform',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Build user interfaces for digital payment solutions.'
      },
      {
        title: 'Cloud Engineer',
        company: 'Freshworks',
        location: 'Chennai, India',
        salary: this.getExperienceBasedSalary(experience, 'cloud engineer'),
        url: 'https://www.freshworks.com/company/careers/',
        skills: ['aws', 'azure', 'kubernetes', 'terraform', 'python'],
        remote: true,
        jobType: 'full-time',
        industry: 'saas',
        source: 'Enhanced-India',
        matchReason: 'Global SaaS company from India',
        country: 'India',
        experienceLevel: this.getJobExperienceLevel(experience),
        description: 'Manage cloud infrastructure for SaaS products.'
      }
    ];

    // Advanced filtering based on skills, experience, and industry
    const matchedJobs = indiaJobDatabase.filter(job => {
      let matchScore = 0;
      
      // Skills matching (primary filter)
      if (skillsArray.length > 0) {
        const skillMatches = skillsArray.filter(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        matchScore += (skillMatches.length / skillsArray.length) * 60;
      } else {
        matchScore += 30; // Default score if no skills provided
      }
      
      // Experience matching
      const expMatch = this.calculateExperienceMatch(job, { experience }, preferences);
      matchScore += (expMatch / 100) * 25;
      
      // Industry matching
      if (industry && job.industry === industry) {
        matchScore += 15;
      }
      
      // Include jobs with match score > 40
      return matchScore > 40;
    });

    console.log('✅ Enhanced India jobs matched:', matchedJobs.length);
    
    // Add match scores and ensure India markers
    const enhancedJobs = matchedJobs.map(job => ({
      ...job,
      country: 'India',
      source: 'Enhanced-India',
      matchScore: this.calculateDetailedMatch(job, skillsArray, experience, industry)
    }));
    
    return enhancedJobs;
  }
  
  /**
   * Get skill-based India jobs with better targeting
   */
  getSkillBasedIndiaJobs(skills, experience) {
    const skillsArray = Array.isArray(skills) ? skills : [];
    if (skillsArray.length === 0) return [];
    
    console.log('🎯 Getting skill-based India jobs for:', skillsArray);
    
    const skillJobMapping = {
      javascript: [
        { title: 'JavaScript Developer', company: 'Indian Tech Startups', skills: ['javascript', 'es6', 'dom'] },
        { title: 'Frontend Developer', company: 'Indian E-commerce', skills: ['javascript', 'html', 'css'] }
      ],
      react: [
        { title: 'React Developer', company: 'Indian SaaS Companies', skills: ['react', 'jsx', 'redux'] },
        { title: 'Frontend Engineer', company: 'Indian Fintech', skills: ['react', 'typescript', 'hooks'] }
      ],
      python: [
        { title: 'Python Developer', company: 'Indian AI Companies', skills: ['python', 'django', 'flask'] },
        { title: 'Backend Engineer', company: 'Indian Data Companies', skills: ['python', 'fastapi', 'sqlalchemy'] }
      ],
      java: [
        { title: 'Java Developer', company: 'Indian Enterprise', skills: ['java', 'spring', 'hibernate'] },
        { title: 'Backend Developer', company: 'Indian Banking Tech', skills: ['java', 'microservices', 'kafka'] }
      ],
      'node.js': [
        { title: 'Node.js Developer', company: 'Indian Startups', skills: ['node.js', 'express', 'mongodb'] },
        { title: 'Backend Engineer', company: 'Indian Food Tech', skills: ['node.js', 'typescript', 'redis'] }
      ],
      aws: [
        { title: 'Cloud Engineer', company: 'Indian Cloud Services', skills: ['aws', 'ec2', 's3'] },
        { title: 'DevOps Engineer', company: 'Indian Tech Companies', skills: ['aws', 'lambda', 'cloudformation'] }
      ],
      'machine learning': [
        { title: 'ML Engineer', company: 'Indian AI Startups', skills: ['machine learning', 'python', 'tensorflow'] },
        { title: 'Data Scientist', company: 'Indian Analytics', skills: ['machine learning', 'pandas', 'scikit-learn'] }
      ]
    };
    
    const skillBasedJobs = [];
    
    skillsArray.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const jobTemplates = skillJobMapping[skillLower] || [];
      
      jobTemplates.forEach(template => {
        skillBasedJobs.push({
          ...template,
          location: this.getRandomIndianCity(),
          salary: this.getExperienceBasedSalary(experience, template.title),
          url: `https://www.naukri.com/${template.title.toLowerCase().replace(/\s+/g, '-')}-jobs`,
          remote: Math.random() > 0.5,
          jobType: 'full-time',
          industry: 'technology',
          source: 'Skill-Based-India',
          matchReason: `Perfect match for ${skill} expertise`,
          country: 'India',
          experienceLevel: this.getJobExperienceLevel(experience),
          description: `Utilize your ${skill} skills in a growing Indian tech environment.`
        });
      });
    });
    
    console.log('✅ Skill-based India jobs generated:', skillBasedJobs.length);
    return skillBasedJobs.slice(0, 6);
  }
  
  /**
   * Get experience-level appropriate India jobs
   */
  getExperienceLevelIndiaJobs(experience, skills) {
    const skillsArray = Array.isArray(skills) ? skills : [];
    console.log('📈 Getting experience-level India jobs for:', experience, 'years');
    
    let levelJobs = [];
    
    if (experience <= 2) {
      // Entry level India jobs
      levelJobs = [
        {
          title: 'Junior Software Developer',
          company: 'Indian IT Services',
          level: 'entry',
          skills: skillsArray.length > 0 ? skillsArray.slice(0, 3) : ['programming', 'problem solving'],
          description: 'Start your career with comprehensive training and mentorship.'
        },
        {
          title: 'Associate Software Engineer',
          company: 'Indian Product Companies',
          level: 'entry',
          skills: skillsArray.length > 0 ? skillsArray.slice(0, 3) : ['coding', 'debugging'],
          description: 'Join a fast-growing product company and learn cutting-edge technologies.'
        },
        {
          title: 'Graduate Trainee - Technology',
          company: 'Indian MNCs',
          level: 'entry',
          skills: skillsArray.length > 0 ? skillsArray.slice(0, 2) : ['basic programming'],
          description: 'Comprehensive training program for fresh graduates.'
        }
      ];
    } else if (experience <= 5) {
      // Mid level India jobs
      levelJobs = [
        {
          title: 'Software Engineer',
          company: 'Indian Tech Companies',
          level: 'mid',
          skills: skillsArray.length > 0 ? skillsArray : ['full stack development'],
          description: 'Work on challenging projects with modern technology stack.'
        },
        {
          title: 'Senior Developer',
          company: 'Indian Startups',
          level: 'mid',
          skills: skillsArray.length > 0 ? skillsArray : ['system design', 'architecture'],
          description: 'Lead development initiatives in a fast-paced startup environment.'
        },
        {
          title: 'Technical Consultant',
          company: 'Indian Consulting',
          level: 'mid',
          skills: skillsArray.length > 0 ? skillsArray : ['client interaction', 'technical solutions'],
          description: 'Provide technical expertise to enterprise clients.'
        }
      ];
    } else {
      // Senior level India jobs
      levelJobs = [
        {
          title: 'Senior Software Engineer',
          company: 'Indian Unicorns',
          level: 'senior',
          skills: skillsArray.length > 0 ? skillsArray : ['technical leadership'],
          description: 'Lead technical initiatives and mentor junior developers.'
        },
        {
          title: 'Technical Lead',
          company: 'Indian Product Companies',
          level: 'senior',
          skills: skillsArray.length > 0 ? skillsArray : ['team leadership', 'architecture'],
          description: 'Drive technical strategy and lead development teams.'
        },
        {
          title: 'Engineering Manager',
          company: 'Indian Tech Giants',
          level: 'senior',
          skills: skillsArray.length > 0 ? skillsArray : ['people management', 'strategy'],
          description: 'Manage engineering teams and drive product development.'
        }
      ];
    }

    const experienceJobs = levelJobs.map(job => ({
      ...job,
      location: this.getRandomIndianCity(),
      salary: this.getExperienceBasedSalary(experience, job.title),
      url: `https://www.naukri.com/${job.title.toLowerCase().replace(/\s+/g, '-')}-jobs`,
      remote: experience > 2, // Senior roles more likely to be remote
      jobType: 'full-time',
      industry: 'technology',
      source: 'Experience-Based-India',
      matchReason: `Perfect for ${experience} years experience`,
      country: 'India',
      experienceLevel: this.getJobExperienceLevel(experience)
    }));

    console.log('✅ Experience-based India jobs generated:', experienceJobs.length);
    return experienceJobs;
  }
  
  /**
   * Helper methods for enhanced India job matching
   */
  getExperienceBasedSalary(experience, jobTitle) {
    const baseSalaries = {
      'software engineer': { base: 4, multiplier: 1.5 },
      'full stack developer': { base: 5, multiplier: 1.8 },
      'data scientist': { base: 6, multiplier: 2.2 },
      'product manager': { base: 8, multiplier: 2.5 },
      'devops engineer': { base: 6, multiplier: 2.0 },
      'frontend developer': { base: 4, multiplier: 1.6 },
      'backend engineer': { base: 5, multiplier: 1.9 },
      'mobile developer': { base: 4, multiplier: 1.7 },
      'cloud engineer': { base: 6, multiplier: 2.1 },
      'data engineer': { base: 6, multiplier: 2.0 }
    };
    
    const titleLower = jobTitle.toLowerCase();
    const salaryInfo = baseSalaries[titleLower] || { base: 4, multiplier: 1.5 };
    
    const minSalary = Math.max(salaryInfo.base, salaryInfo.base + (experience * salaryInfo.multiplier));
    const maxSalary = minSalary + 4 + (experience * 0.5);
    
    return `₹${Math.round(minSalary)}-${Math.round(maxSalary)} LPA`;
  }
  
  getJobExperienceLevel(experience) {
    if (experience <= 2) return 'entry';
    if (experience <= 5) return 'mid';
    return 'senior';
  }
  
  calculateDetailedMatch(job, skills, experience, industry) {
    let score = 0;
    
    // Skills match (50% weight)
    if (skills.length > 0) {
      const skillMatches = skills.filter(skill => 
        job.skills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );
      score += (skillMatches.length / skills.length) * 50;
    } else {
      score += 25;
    }
    
    // Experience match (30% weight)
    const expMatch = this.calculateExperienceMatch(job, { experience }, {});
    score += (expMatch / 100) * 30;
    
    // Industry match (20% weight)
    if (industry && job.industry === industry) {
      score += 20;
    } else {
      score += 10; // Partial score for tech industry
    }
    
    return Math.round(Math.min(100, score));
  }
  
  /**
   * Get India-specific job recommendations (legacy method for compatibility)
   */
  getIndiaSpecificJobs(skills, industry, preferences) {
    // Use the enhanced method for better results
    return this.getEnhancedIndiaJobs(skills, 2, industry, preferences);
  }

  /**
   * Get comprehensive job application guidance
   */
  getJobApplicationGuidance(job) {
    return {
      directApplication: {
        url: this.generateDirectApplicationUrl(job.title, job.company),
        tips: [
          'Visit the company career page directly',
          'Look for "Apply Now" or "Submit Application" buttons',
          'Create an account on their career portal if required',
          'Upload your resume and cover letter',
          'Follow up after 1-2 weeks if no response'
        ]
      },
      networking: {
        platforms: ['LinkedIn', 'GitHub', 'Twitter', 'Industry Slack/Discord'],
        tips: [
          'Connect with current employees at the company',
          'Engage with company content on social media',
          'Attend virtual company events or webinars',
          'Ask for informational interviews',
          'Request referrals from your network'
        ]
      },
      alternative: {
        jobBoards: Object.keys(this.getAlternativeJobBoards()),
        tips: [
          'Set up job alerts on multiple platforms',
          'Apply to similar roles at different companies',
          'Consider contract-to-hire opportunities',
          'Look for remote positions to expand options',
          'Check company websites weekly for new postings'
        ]
      }
    };
  }
}

export const jobMatchingService = new JobMatchingService();