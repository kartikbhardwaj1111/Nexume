/**
 * Test utility to verify job search functionality without regional restrictions
 */

import { jobMatchingService } from '../services/JobMatchingService.js';

export async function testJobSearch() {
  console.log('🧪 Testing job search functionality...');
  
  const testResumeData = {
    skills: ['javascript', 'react', 'node.js', 'python'],
    experience: 3,
    location: 'Remote',
    industry: 'technology'
  };

  try {
    // Test job matching service
    const jobs = await jobMatchingService.findJobsForResume(testResumeData);
    
    console.log('✅ Job search test results:');
    console.log(`📊 Found ${jobs.length} jobs`);
    console.log('🔗 Sample job URLs:');
    
    jobs.slice(0, 3).forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company}`);
      console.log(`   URL: ${job.url}`);
      console.log(`   Match: ${job.matchScore || job.match}%`);
      console.log(`   Source: ${job.source}`);
      console.log('');
    });

    // Verify no external API dependencies
    const hasExternalAPIs = jobs.some(job => 
      job.url && (
        job.url.includes('adzuna.com') ||
        job.url.includes('indeed.com/viewjob') ||
        job.url.includes('glassdoor.com/job')
      )
    );

    if (hasExternalAPIs) {
      console.warn('⚠️ Warning: Found jobs with external API dependencies');
    } else {
      console.log('✅ All jobs use direct company pages or safe job boards');
    }

    return {
      success: true,
      jobCount: jobs.length,
      hasExternalAPIs,
      sampleJobs: jobs.slice(0, 3)
    };

  } catch (error) {
    console.error('❌ Job search test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export function validateJobURL(url) {
  // List of safe job sources (no regional restrictions)
  const safeJobSources = [
    'careers.google.com',
    'careers.microsoft.com',
    'jobs.netflix.com',
    'stripe.com/jobs',
    'careers.airbnb.com',
    'github.com/about/careers',
    'linkedin.com/jobs',
    'stackoverflow.com/jobs',
    'wellfound.com',
    'remote.co',
    'weworkremotely.com',
    'dice.com',
    'flexjobs.com'
  ];

  return safeJobSources.some(source => url.includes(source));
}

export function generateAlternativeJobSearches(skills, location = 'Remote') {
  const searches = [];
  
  // LinkedIn searches
  skills.forEach(skill => {
    searches.push({
      platform: 'LinkedIn',
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skill)}&location=${encodeURIComponent(location)}`,
      description: `${skill} jobs on LinkedIn`
    });
  });

  // Stack Overflow searches
  const techSkills = skills.filter(skill => 
    ['javascript', 'python', 'java', 'react', 'node', 'sql'].some(tech => 
      skill.toLowerCase().includes(tech)
    )
  );
  
  techSkills.forEach(skill => {
    searches.push({
      platform: 'Stack Overflow Jobs',
      url: `https://stackoverflow.com/jobs?q=${encodeURIComponent(skill)}`,
      description: `${skill} developer jobs`
    });
  });

  // Remote job searches
  searches.push({
    platform: 'Remote.co',
    url: `https://remote.co/remote-jobs/search/?search_keywords=${encodeURIComponent(skills.join(' '))}`,
    description: 'Remote opportunities'
  });

  searches.push({
    platform: 'We Work Remotely',
    url: 'https://weworkremotely.com/',
    description: 'Global remote jobs'
  });

  return searches;
}