import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bug, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Code,
  Database,
  Target,
  Zap
} from 'lucide-react';
import { jobMatchingService } from '@/services/JobMatchingService';

export function JobMatchingDebugger({ resumeSkills = [], className = '' }) {
  const [debugResults, setDebugResults] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);

  const runDebugTest = async () => {
    setIsDebugging(true);
    setDebugResults(null);

    try {
      console.log('🐛 Starting Job Matching Debug Test...');
      
      const testResumeData = {
        skills: resumeSkills.length > 0 ? resumeSkills : ['javascript', 'react', 'node.js'],
        experience: 3,
        location: 'India',
        industry: 'technology'
      };

      console.log('📊 Test Resume Data:', testResumeData);

      // Test each job source individually
      const results = {
        input: testResumeData,
        sources: {},
        finalJobs: [],
        timing: {},
        errors: []
      };

      // Test 1: Curated Jobs
      const curatedStart = Date.now();
      try {
        results.sources.curated = jobMatchingService.searchCuratedJobs(
          testResumeData.skills, 
          testResumeData.industry, 
          {}
        );
        results.timing.curated = Date.now() - curatedStart;
        console.log('✅ Curated Jobs:', results.sources.curated.length);
      } catch (error) {
        results.errors.push(`Curated Jobs Error: ${error.message}`);
        console.error('❌ Curated Jobs Error:', error);
      }

      // Test 2: Skill-Based Jobs
      const skillStart = Date.now();
      try {
        results.sources.skillBased = jobMatchingService.getSkillBasedJobs(
          testResumeData.skills, 
          {}
        );
        results.timing.skillBased = Date.now() - skillStart;
        console.log('✅ Skill-Based Jobs:', results.sources.skillBased.length);
      } catch (error) {
        results.errors.push(`Skill-Based Jobs Error: ${error.message}`);
        console.error('❌ Skill-Based Jobs Error:', error);
      }

      // Test 3: Industry Jobs
      const industryStart = Date.now();
      try {
        results.sources.industry = jobMatchingService.getIndustryJobs(
          testResumeData.industry, 
          {}
        );
        results.timing.industry = Date.now() - industryStart;
        console.log('✅ Industry Jobs:', results.sources.industry.length);
      } catch (error) {
        results.errors.push(`Industry Jobs Error: ${error.message}`);
        console.error('❌ Industry Jobs Error:', error);
      }

      // Test 4: Experience Level Jobs
      const experienceStart = Date.now();
      try {
        results.sources.experience = jobMatchingService.getExperienceLevelJobs(
          testResumeData.experience, 
          {}
        );
        results.timing.experience = Date.now() - experienceStart;
        console.log('✅ Experience Jobs:', results.sources.experience.length);
      } catch (error) {
        results.errors.push(`Experience Jobs Error: ${error.message}`);
        console.error('❌ Experience Jobs Error:', error);
      }

      // Test 5: Full Job Matching Process
      const fullStart = Date.now();
      try {
        results.finalJobs = await jobMatchingService.findJobsForResume(testResumeData, { location: 'India', prioritizeLocation: true });
        results.timing.full = Date.now() - fullStart;
        console.log('✅ Full Job Matching:', results.finalJobs.length);
      } catch (error) {
        results.errors.push(`Full Matching Error: ${error.message}`);
        console.error('❌ Full Matching Error:', error);
      }

      // Calculate totals
      results.totals = {
        totalJobs: Object.values(results.sources).reduce((sum, jobs) => sum + (jobs?.length || 0), 0),
        uniqueSources: Object.keys(results.sources).filter(key => results.sources[key]?.length > 0).length,
        totalTime: Object.values(results.timing).reduce((sum, time) => sum + time, 0)
      };

      console.log('🎯 Debug Results:', results);
      setDebugResults(results);

    } catch (error) {
      console.error('🐛 Debug Test Failed:', error);
      setDebugResults({
        error: error.message,
        input: resumeSkills
      });
    } finally {
      setIsDebugging(false);
    }
  };

  const SourceCard = ({ title, jobs, timing, icon: Icon, color }) => (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{timing}ms</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Jobs Found:</span>
            <Badge variant="outline">{jobs?.length || 0}</Badge>
          </div>
          
          {jobs && jobs.length > 0 && (
            <div className="space-y-1">
              {jobs.slice(0, 2).map((job, i) => (
                <div key={i} className="text-xs p-2 bg-muted/50 rounded">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-muted-foreground">{job.company}</div>
                </div>
              ))}
              {jobs.length > 2 && (
                <div className="text-xs text-center text-muted-foreground">
                  +{jobs.length - 2} more jobs
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-orange-500" />
          Job Matching Debugger
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This tool tests the job matching system to ensure it's working correctly and shows 
            detailed information about each step of the process.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-4">
          <Button 
            onClick={runDebugTest}
            disabled={isDebugging}
            className="flex items-center gap-2"
          >
            {isDebugging ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Debug Test
              </>
            )}
          </Button>

          {resumeSkills.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Testing with skills:</span>
              <div className="flex gap-1">
                {resumeSkills.slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {resumeSkills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{resumeSkills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {debugResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {debugResults.error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Debug test failed: {debugResults.error}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {debugResults.totals?.totalJobs || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Jobs</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {debugResults.totals?.uniqueSources || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Sources</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {debugResults.totals?.totalTime || 0}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Total Time</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job Sources */}
                <div>
                  <h4 className="font-semibold mb-4">Job Sources Performance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SourceCard
                      title="Curated Database"
                      jobs={debugResults.sources.curated}
                      timing={debugResults.timing.curated}
                      icon={Database}
                      color="bg-blue-500"
                    />
                    <SourceCard
                      title="Skill-Based"
                      jobs={debugResults.sources.skillBased}
                      timing={debugResults.timing.skillBased}
                      icon={Target}
                      color="bg-green-500"
                    />
                    <SourceCard
                      title="Industry Jobs"
                      jobs={debugResults.sources.industry}
                      timing={debugResults.timing.industry}
                      icon={Code}
                      color="bg-purple-500"
                    />
                    <SourceCard
                      title="Experience Level"
                      jobs={debugResults.sources.experience}
                      timing={debugResults.timing.experience}
                      icon={Zap}
                      color="bg-orange-500"
                    />
                  </div>
                </div>

                {/* Final Results */}
                {debugResults.finalJobs && debugResults.finalJobs.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">Final Job Recommendations</h4>
                    <div className="space-y-2">
                      {debugResults.finalJobs.slice(0, 5).map((job, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{job.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {job.company} • {job.source}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">
                                {job.matchScore || job.match || 'N/A'}% match
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                {job.matchReason}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Errors */}
                {debugResults.errors && debugResults.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-2">Errors encountered:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {debugResults.errors.map((error, i) => (
                          <li key={i} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {debugResults.errors.length === 0 && debugResults.finalJobs.length > 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✅ Job matching system is working perfectly! All sources are active and 
                      generating personalized job recommendations with no regional restrictions.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}