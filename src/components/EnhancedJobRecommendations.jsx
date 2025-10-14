import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users, 
  Briefcase,
  Search,
  Globe,
  Star,
  TrendingUp,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import LocationJobFilter from './LocationJobFilter';
import { jobMatchingService } from '../services/JobMatchingService';

export function EnhancedJobRecommendations({ 
  jobs = [], 
  isLoading = false, 
  onRefresh,
  resumeSkills = [],
  resumeData = {},
  className = '' 
}) {
  const [selectedTab, setSelectedTab] = useState('recommended');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [locationBasedJobs, setLocationBasedJobs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('India');
  const [loadingLocationJobs, setLoadingLocationJobs] = useState(false);
  const [filters, setFilters] = useState({
    remote: 'all', // 'all', 'remote', 'onsite'
    experience: 'all', // 'all', 'entry', 'mid', 'senior'
    salary: 'all' // 'all', 'under100k', '100k-150k', 'over150k'
  });

  useEffect(() => {
    setFilteredJobs(applyFilters(jobs, filters));
  }, [jobs, filters]);

  useEffect(() => {
    if (resumeSkills.length > 0) {
      fetchLocationBasedJobs();
    }
  }, [selectedLocation, resumeSkills]);

  const fetchLocationBasedJobs = async () => {
    setLoadingLocationJobs(true);
    try {
      const jobData = {
        skills: resumeSkills,
        experience: resumeData.experience || 2,
        location: selectedLocation,
        industry: resumeData.industry
      };
      
      const preferences = {
        location: selectedLocation,
        prioritizeLocation: true
      };
      
      const jobs = await jobMatchingService.findJobsForResume(jobData, preferences);
      setLocationBasedJobs(jobs);
    } catch (error) {
      console.error('Error fetching location-based jobs:', error);
    } finally {
      setLoadingLocationJobs(false);
    }
  };

  const handleLocationChange = (newLocation) => {
    setSelectedLocation(newLocation);
  };

  const applyFilters = (jobList, currentFilters) => {
    return jobList.filter(job => {
      // Remote filter
      if (currentFilters.remote === 'remote' && !job.remote) return false;
      if (currentFilters.remote === 'onsite' && job.remote) return false;

      // Experience filter (based on job title)
      if (currentFilters.experience !== 'all') {
        const title = job.title.toLowerCase();
        if (currentFilters.experience === 'entry' && (title.includes('senior') || title.includes('lead'))) return false;
        if (currentFilters.experience === 'senior' && (title.includes('junior') || title.includes('entry'))) return false;
      }

      // Salary filter
      if (currentFilters.salary !== 'all' && job.salary) {
        const salaryStr = job.salary.toString().toLowerCase();
        const salaryNum = extractSalaryNumber(salaryStr);
        
        if (currentFilters.salary === 'under100k' && salaryNum >= 100000) return false;
        if (currentFilters.salary === '100k-150k' && (salaryNum < 100000 || salaryNum > 150000)) return false;
        if (currentFilters.salary === 'over150k' && salaryNum <= 150000) return false;
      }

      return true;
    });
  };

  const extractSalaryNumber = (salaryStr) => {
    const match = salaryStr.match(/\$?(\d+)k?/);
    if (match) {
      const num = parseInt(match[1]);
      return salaryStr.includes('k') ? num * 1000 : num;
    }
    return 0;
  };

  const categorizeJobs = (jobList) => {
    const categories = {
      recommended: jobList.filter(job => job.matchScore >= 70 || job.match >= 70),
      remote: jobList.filter(job => job.remote),
      highSalary: jobList.filter(job => {
        const salaryNum = extractSalaryNumber(job.salary?.toString() || '');
        return salaryNum >= 120000;
      }),
      bigTech: jobList.filter(job => 
        ['google', 'microsoft', 'apple', 'amazon', 'meta', 'netflix', 'uber', 'airbnb', 'stripe', 'spotify'].some(company =>
          job.company.toLowerCase().includes(company)
        )
      )
    };
    return categories;
  };

  const jobCategories = categorizeJobs(filteredJobs);

  const getMatchColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getJobTypeIcon = (job) => {
    if (job.remote) return <Globe className="w-4 h-4 text-blue-500" />;
    return <Building className="w-4 h-4 text-gray-500" />;
  };

  const JobCard = ({ job, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group"
    >
      <Card className="h-full border hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground font-medium">{job.company}</span>
                {job.companySize && (
                  <Badge variant="outline" className="text-xs">
                    {job.companySize}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Match Score */}
            {(job.matchScore || job.match) && (
              <Badge 
                variant="outline" 
                className={`text-xs font-bold ${getMatchColor(job.matchScore || job.match)}`}
              >
                <Star className="w-3 h-3 mr-1" />
                {job.matchScore || job.match}% match
              </Badge>
            )}
          </div>

          {/* Job Details */}
          <div className="space-y-3 mb-4">
            {/* Location & Remote */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getJobTypeIcon(job)}
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
              {job.remote && (
                <Badge variant="secondary" className="text-xs">
                  Remote Available
                </Badge>
              )}
            </div>

            {/* Salary */}
            {job.salary && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
            )}

            {/* Skills Match */}
            {job.skills && (
              <div className="flex flex-wrap gap-1 mt-3">
                {job.skills.slice(0, 4).map((skill, i) => {
                  const isMatched = resumeSkills.some(resumeSkill => 
                    skill.toLowerCase().includes(resumeSkill.toLowerCase()) ||
                    resumeSkill.toLowerCase().includes(skill.toLowerCase())
                  );
                  
                  return (
                    <Badge 
                      key={i} 
                      variant={isMatched ? "default" : "outline"}
                      className={`text-xs ${isMatched ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
                    >
                      {skill}
                    </Badge>
                  );
                })}
                {job.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.skills.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {/* Recommendation Reason */}
            {job.recommendationReason && (
              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                💡 {job.recommendationReason}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              onClick={() => window.open(job.url, '_blank')}
              className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Job
            </Button>
            
            {job.source && (
              <Badge variant="outline" className="text-xs self-center">
                {job.source}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FilterSection = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      {/* Remote Filter */}
      <select
        value={filters.remote}
        onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.value }))}
        className="text-sm border rounded px-2 py-1"
      >
        <option value="all">All Locations</option>
        <option value="remote">Remote Only</option>
        <option value="onsite">On-site Only</option>
      </select>

      {/* Experience Filter */}
      <select
        value={filters.experience}
        onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
        className="text-sm border rounded px-2 py-1"
      >
        <option value="all">All Levels</option>
        <option value="entry">Entry Level</option>
        <option value="mid">Mid Level</option>
        <option value="senior">Senior Level</option>
      </select>

      {/* Salary Filter */}
      <select
        value={filters.salary}
        onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
        className="text-sm border rounded px-2 py-1"
      >
        <option value="all">All Salaries</option>
        <option value="under100k">Under $100k</option>
        <option value="100k-150k">$100k - $150k</option>
        <option value="over150k">Over $150k</option>
      </select>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setFilters({ remote: 'all', experience: 'all', salary: 'all' })}
      >
        Clear Filters
      </Button>
    </div>
  );

  const EmptyState = ({ category }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No {category} jobs found</h3>
      <p className="text-muted-foreground mb-6">
        Try adjusting your filters or check out other categories
      </p>
      <div className="space-y-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Jobs
        </Button>
      </div>
    </motion.div>
  );

  const JobSearchTips = () => (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Job Search Tips:</strong> If a job shows "not available in your region," try these alternatives:
        <ul className="mt-2 space-y-1 text-sm">
          <li>• Visit the company's careers page directly</li>
          <li>• Search for similar roles on multiple job boards</li>
          <li>• Set up job alerts for your preferred positions</li>
          <li>• Consider remote opportunities from global companies</li>
        </ul>
      </AlertDescription>
    </Alert>
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground">Finding the best job matches for you...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Job Recommendations
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <JobSearchTips />
        
        <LocationJobFilter 
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          className="mb-6"
        />
        
        <FilterSection />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} defaultValue="location">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="location" className="text-xs">
              {selectedLocation === 'India' ? '🇮🇳' : selectedLocation === 'Global Remote' ? '🌍' : '🇺🇸'} 
              {selectedLocation} ({locationBasedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="recommended" className="text-xs">
              Recommended ({jobCategories.recommended.length})
            </TabsTrigger>
            <TabsTrigger value="remote" className="text-xs">
              Remote ({jobCategories.remote.length})
            </TabsTrigger>
            <TabsTrigger value="highSalary" className="text-xs">
              High Salary ({jobCategories.highSalary.length})
            </TabsTrigger>
            <TabsTrigger value="bigTech" className="text-xs">
              Big Tech ({jobCategories.bigTech.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="space-y-4">
            {loadingLocationJobs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Finding {selectedLocation} jobs...</p>
              </div>
            ) : locationBasedJobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {locationBasedJobs.map((job, index) => (
                  <JobCard key={index} job={job} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState category={selectedLocation} />
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-4">
            {jobCategories.recommended.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {jobCategories.recommended.map((job, index) => (
                  <JobCard key={index} job={job} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState category="recommended" />
            )}
          </TabsContent>

          <TabsContent value="remote" className="space-y-4">
            {jobCategories.remote.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {jobCategories.remote.map((job, index) => (
                  <JobCard key={index} job={job} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState category="remote" />
            )}
          </TabsContent>

          <TabsContent value="highSalary" className="space-y-4">
            {jobCategories.highSalary.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {jobCategories.highSalary.map((job, index) => (
                  <JobCard key={index} job={job} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState category="high salary" />
            )}
          </TabsContent>

          <TabsContent value="bigTech" className="space-y-4">
            {jobCategories.bigTech.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {jobCategories.bigTech.map((job, index) => (
                  <JobCard key={index} job={job} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState category="big tech" />
            )}
          </TabsContent>
        </Tabs>

        {/* Alternative Job Search Resources */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Alternative Job Search Resources
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://stackoverflow.com/jobs', '_blank')}
              className="justify-start"
            >
              Stack Overflow Jobs
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.dice.com', '_blank')}
              className="justify-start"
            >
              Dice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://angel.co/jobs', '_blank')}
              className="justify-start"
            >
              AngelList
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://remote.co/remote-jobs/', '_blank')}
              className="justify-start"
            >
              Remote.co
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}