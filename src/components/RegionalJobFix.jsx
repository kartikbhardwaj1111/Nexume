import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Globe, 
  Search, 
  Building,
  Users,
  Target,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

export function RegionalJobFix({ className = '' }) {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const solutions = [
    {
      id: 'direct-company',
      title: 'Direct Company Applications',
      description: 'Apply directly through company career pages - no regional restrictions',
      icon: Building,
      color: 'bg-blue-500',
      success: '95%',
      companies: [
        { name: 'Google', url: 'https://careers.google.com/jobs/results/' },
        { name: 'Microsoft', url: 'https://careers.microsoft.com/professionals/us/en/' },
        { name: 'Amazon', url: 'https://www.amazon.jobs/en/search' },
        { name: 'Apple', url: 'https://jobs.apple.com/en-us/search' },
        { name: 'Meta', url: 'https://www.metacareers.com/jobs/' },
        { name: 'Netflix', url: 'https://jobs.netflix.com/search' },
        { name: 'Spotify', url: 'https://www.lifeatspotify.com/jobs' },
        { name: 'Stripe', url: 'https://stripe.com/jobs/search' }
      ],
      steps: [
        'Visit company career page directly',
        'Search for relevant positions',
        'Create account on their portal',
        'Submit application with resume',
        'Follow up after 1-2 weeks'
      ]
    },
    {
      id: 'global-platforms',
      title: 'Global Job Platforms',
      description: 'Use job platforms that don\'t have regional restrictions',
      icon: Globe,
      color: 'bg-green-500',
      success: '85%',
      platforms: [
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
        { name: 'Stack Overflow Jobs', url: 'https://stackoverflow.com/jobs' },
        { name: 'AngelList', url: 'https://wellfound.com/jobs' },
        { name: 'Remote.co', url: 'https://remote.co/remote-jobs/' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com/' },
        { name: 'Dice', url: 'https://www.dice.com/jobs' },
        { name: 'FlexJobs', url: 'https://www.flexjobs.com/' },
        { name: 'Upwork', url: 'https://www.upwork.com/nx/search/jobs/' }
      ],
      steps: [
        'Create profiles on multiple platforms',
        'Set up job alerts for your skills',
        'Apply to remote-friendly positions',
        'Focus on global companies',
        'Network with international professionals'
      ]
    },
    {
      id: 'networking',
      title: 'Professional Networking',
      description: 'Leverage networking to bypass job board limitations',
      icon: Users,
      color: 'bg-purple-500',
      success: '75%',
      networks: [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
        { name: 'GitHub', url: 'https://github.com/' },
        { name: 'Twitter/X', url: 'https://twitter.com/' },
        { name: 'Discord Communities', url: '#' },
        { name: 'Slack Workspaces', url: '#' },
        { name: 'Reddit Communities', url: 'https://www.reddit.com/r/forhire/' },
        { name: 'Meetup Groups', url: 'https://www.meetup.com/' },
        { name: 'Industry Forums', url: '#' }
      ],
      steps: [
        'Connect with professionals in your field',
        'Join industry-specific communities',
        'Engage with company content',
        'Ask for informational interviews',
        'Request referrals from connections'
      ]
    },
    {
      id: 'remote-first',
      title: 'Remote-First Companies',
      description: 'Target companies that hire globally for remote positions',
      icon: Target,
      color: 'bg-orange-500',
      success: '90%',
      companies: [
        { name: 'GitLab', url: 'https://about.gitlab.com/jobs/' },
        { name: 'Buffer', url: 'https://buffer.com/journey' },
        { name: 'Zapier', url: 'https://zapier.com/jobs/' },
        { name: 'Automattic', url: 'https://automattic.com/work-with-us/' },
        { name: 'Basecamp', url: 'https://basecamp.com/about/jobs' },
        { name: 'InVision', url: 'https://www.invisionapp.com/company/careers' },
        { name: 'Toptal', url: 'https://www.toptal.com/careers' },
        { name: 'Hotjar', url: 'https://careers.hotjar.com/' }
      ],
      steps: [
        'Research remote-first companies',
        'Highlight remote work experience',
        'Show strong communication skills',
        'Demonstrate self-management abilities',
        'Apply for distributed team roles'
      ]
    }
  ];

  const commonIssues = [
    {
      problem: '"Sorry, this job is not available in your region"',
      solution: 'Use direct company career pages instead of job aggregators',
      action: 'Visit company websites directly'
    },
    {
      problem: 'Job board geo-blocking',
      solution: 'Switch to global platforms like LinkedIn, Stack Overflow',
      action: 'Create profiles on multiple platforms'
    },
    {
      problem: 'Limited local opportunities',
      solution: 'Focus on remote positions from global companies',
      action: 'Search for "remote" or "work from home" jobs'
    },
    {
      problem: 'API restrictions on job sites',
      solution: 'Use networking and direct outreach instead',
      action: 'Connect with hiring managers on LinkedIn'
    }
  ];

  const SolutionCard = ({ solution }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="h-full cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => setSelectedSolution(solution)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${solution.color}`}>
              <solution.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{solution.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {solution.description}
              </p>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                {solution.success} Success Rate
              </Badge>
            </div>
          </div>

          <Button className="w-full" size="sm">
            <ArrowRight className="w-4 h-4 mr-2" />
            View Solution Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Regional Job Restrictions Fix
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Problem Alert */}
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <strong>Experiencing "Job not available in your region" errors?</strong> 
              <br />Don't worry! Here are proven solutions to access job opportunities worldwide.
            </AlertDescription>
          </Alert>

          {/* Common Issues */}
          <div>
            <h3 className="font-semibold mb-4">Common Issues & Quick Fixes</h3>
            <div className="space-y-3">
              {commonIssues.map((issue, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{issue.problem}</p>
                      <p className="text-sm text-muted-foreground mb-2">{issue.solution}</p>
                      <Badge variant="outline" className="text-xs">
                        {issue.action}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold mb-4">Proven Solutions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {solutions.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} />
              ))}
            </div>
          </div>

          {/* Success Tips */}
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Combine multiple approaches for best results. 
              Use direct applications + networking + remote-first companies for maximum success.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSolution(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedSolution.color}`}>
                    <selectedSolution.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedSolution.title}</h2>
                    <p className="text-muted-foreground">{selectedSolution.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedSolution(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Action Steps */}
                <div>
                  <h3 className="font-semibold mb-3">Step-by-Step Guide</h3>
                  <ol className="space-y-2">
                    {selectedSolution.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {selectedSolution.companies ? 'Company Career Pages' : 
                     selectedSolution.platforms ? 'Job Platforms' : 
                     selectedSolution.networks ? 'Networking Platforms' : 'Resources'}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(selectedSolution.companies || selectedSolution.platforms || selectedSolution.networks || []).map((item, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.url, '_blank')}
                        className="justify-start"
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        {item.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Success Rate */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Success Rate: {selectedSolution.success}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This approach has helped thousands of job seekers bypass regional restrictions 
                    and find opportunities worldwide.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default RegionalJobFix;