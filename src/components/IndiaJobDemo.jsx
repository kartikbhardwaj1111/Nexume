import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, MapPin, DollarSign, Building, CheckCircle } from 'lucide-react';
import { jobMatchingService } from '../services/JobMatchingService';

export function IndiaJobDemo({ resumeSkills = ['javascript', 'react', 'python'] }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIndiaJobs = async () => {
    setLoading(true);
    try {
      const resumeData = {
        skills: resumeSkills,
        experience: 3,
        location: 'India',
        industry: 'technology'
      };

      const preferences = {
        location: 'India',
        prioritizeLocation: true
      };

      const indiaJobs = await jobMatchingService.findJobsForResume(resumeData, preferences);
      setJobs(indiaJobs);
    } catch (error) {
      console.error('Error fetching India jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndiaJobs();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🇮🇳 India Job Recommendations Demo
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>Fixed!</strong> Now showing ONLY India jobs - no US/international jobs.
            <br/>✅ Indian companies only ✅ Indian cities only ✅ Indian salaries (LPA)
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing jobs for skills: {resumeSkills.join(', ')}
            </p>
            <p className="text-xs text-muted-foreground">
              Location: India | {jobs.length} jobs found
            </p>
          </div>
          <Button onClick={fetchIndiaJobs} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Jobs'}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Finding India jobs...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.slice(0, 6).map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{job.company}</span>
                        {job.country === 'India' && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            🇮🇳 India
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>

                      {job.salary && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    {job.skills && (
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, i) => {
                          const isMatched = resumeSkills.some(resumeSkill => 
                            skill.toLowerCase().includes(resumeSkill.toLowerCase()) ||
                            resumeSkill.toLowerCase().includes(skill.toLowerCase())
                          );
                          
                          return (
                            <Badge 
                              key={i} 
                              variant={isMatched ? "default" : "outline"}
                              className={`text-xs ${isMatched ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}`}
                            >
                              {skill}
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    {job.matchReason && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        💡 {job.matchReason}
                      </div>
                    )}

                    <Button
                      size="sm"
                      onClick={() => window.open(job.url, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>
            ✅ <strong>ONLY Indian jobs</strong> - no US/international jobs shown<br/>
            ✅ Indian companies: TCS, Infosys, Flipkart, Paytm, Zomato, etc.<br/>
            ✅ Indian cities: Bangalore, Hyderabad, Pune, Chennai, Mumbai<br/>
            ✅ Indian salaries in LPA (Lakhs Per Annum): ₹4-25 LPA
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default IndiaJobDemo;