// Local storage utilities for resume analytics
const STORAGE_KEYS = {
  APPLICATIONS: 'resume_applications',
  ANALYTICS: 'resume_analytics',
  RESUME_VERSIONS: 'resume_versions'
};

export const analyticsStorage = {
  // Application tracking
  saveApplication(application) {
    const applications = this.getApplications();
    const newApp = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...application
    };
    applications.push(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return newApp;
  },

  getApplications() {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  updateApplicationStatus(id, status, notes = '') {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index].status = status;
      applications[index].statusUpdated = new Date().toISOString();
      if (notes) applications[index].notes = notes;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    }
  },

  // Resume version tracking
  saveResumeVersion(version) {
    const versions = this.getResumeVersions();
    const newVersion = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...version
    };
    versions.push(newVersion);
    localStorage.setItem(STORAGE_KEYS.RESUME_VERSIONS, JSON.stringify(versions));
    return newVersion;
  },

  getResumeVersions() {
    const stored = localStorage.getItem(STORAGE_KEYS.RESUME_VERSIONS);
    return stored ? JSON.parse(stored) : [];
  },

  // Analytics calculations
  calculateAnalytics() {
    const applications = this.getApplications();
    const versions = this.getResumeVersions();
    
    const totalApplications = applications.length;
    const responses = applications.filter(app => 
      ['interview', 'offer', 'rejected'].includes(app.status)
    ).length;
    const interviews = applications.filter(app => 
      ['interview', 'offer'].includes(app.status)
    ).length;
    const offers = applications.filter(app => app.status === 'offer').length;

    const responseRate = totalApplications > 0 ? (responses / totalApplications) * 100 : 0;
    const interviewRate = totalApplications > 0 ? (interviews / totalApplications) * 100 : 0;
    const offerRate = totalApplications > 0 ? (offers / totalApplications) * 100 : 0;

    // Performance by resume version
    const versionPerformance = versions.map(version => {
      const versionApps = applications.filter(app => app.resumeVersionId === version.id);
      const versionResponses = versionApps.filter(app => 
        ['interview', 'offer', 'rejected'].includes(app.status)
      ).length;
      
      return {
        ...version,
        applications: versionApps.length,
        responseRate: versionApps.length > 0 ? (versionResponses / versionApps.length) * 100 : 0
      };
    });

    return {
      totalApplications,
      responses,
      interviews,
      offers,
      responseRate,
      interviewRate,
      offerRate,
      versionPerformance,
      recentApplications: applications.slice(-10).reverse()
    };
  }
};