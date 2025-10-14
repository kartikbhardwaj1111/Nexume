import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Globe, 
  Users, 
  Building, 
  MapPin, 
  ExternalLink, 
  Star, 
  TrendingUp,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Target,
  Briefcase,
  Network,
  BookOpen
} from 'lucide-react';

export function JobSearchGuide({ skills = [], location = '', className = '' }) {
  const [activeStrategy, setActiveStrategy] = useState('direct');

  const jobBoards = [
    {
      name: 'LinkedIn Jobs',
      url: 'https://www.linkedin.com/jobs/',
      description: 'Professional network with extensive job listings',
      pros: ['Large network', 'Company insights', 'Direct recruiter contact'],
      searchTip: 'Use advanced filters and set up job alerts',
      icon: Users,
      category: 'professional'
    },
    {
      name: 'Indeed',
      url: 'https://www.indeed.com/',
      description: 'One of the largest job search engines',
      pros: ['Huge database', 'Salary insights', 'Company reviews'],
      searchTip: 'Upload resume for better matching',
      icon: Search,
      category: 'general'
    },
    {
      name: 'Glassdoor',
      url: 'https://www.glassdoor.com/Job/index.htm',
      description: 'Jobs with company reviews and salary data',
      pros: ['Salary transparency', 'Company culture insights', 'Interview tips'],
      searchTip: 'Research companies before applying',
      icon: Building,
      category: 'research'
    },
    {
      name: 'Stack Overflow Jobs',
      url: 'https://stackoverflow.com/jobs',
      description: 'Tech-focused job board for developers',
      pros: ['Developer-focused', 'Technical assessments', 'Remote-friendly'],
      searchTip: 'Showcase your coding skills and contributions',
      icon: Target,
      category: 'tech'
    },
    {
      name: 'AngelList (Wellfound)',
      url: 'https://wellfound.com/jobs',
      description: 'Startup jobs and equity opportunities',
      pros: ['Startup culture', 'Equity compensation', 'Direct founder contact'],
      searchTip: 'Highlight adaptability and growth mindset',
      icon: TrendingUp,
      category: 'startup'
    },
    {
      name: 'Remote.co',
      url: 'https://remote.co/remote-jobs/',
      description: 'Curated remote job opportunities',
      pros: ['100% remote', 'Global opportunities', 'Flexible work'],
      searchTip: 'Emphasize remote work experience and communication skills',
      icon: Globe,
      category: 'remote'
    },
    {
      name: 'Dice',
      url: 'https://www.dice.com/',
      description: 'Technology and IT job marketplace',
      pros: ['Tech specialization', 'Contract opportunities', 'Skill-based matching'],
      searchTip: 'Keep technical skills updated and detailed',
      icon: Briefcase,
      category: 'tech'
    },
    {
      name: 'FlexJobs',
      url: 'https://www.flexjobs.com/',
      description: 'Flexible and remote job opportunities',
      pros: ['Vetted opportunities', 'Flexible schedules', 'Work-life balance'],
      searchTip: 'Highlight time management and self-motivation skills',
      icon: MapPin,
      category: 'flexible'
    }
  ];

  const companyPages = [
    {
      name: 'Google Careers',
      url: 'https://careers.google.com/',
      description: 'Direct access to Google job opportunities',
      tips: ['Prepare for technical interviews', 'Showcase problem-solving skills']
    },
    {
      name: 'Microsoft Careers',
      url: 'https://careers.microsoft.com/',
      description: 'Microsoft job openings and internships',
      tips: ['Highlight collaboration skills', 'Show passion for technology']
    },
    {
      name: 'Amazon Jobs',
      url: 'https://www.amazon.jobs/',
      description: 'Amazon career opportunities worldwide',
      tips: ['Understand leadership principles', 'Prepare for behavioral interviews']
    },
    {
      name: 'Apple Jobs',
      url: 'https://jobs.apple.com/',
      description: 'Apple career opportunities and culture',
      tips: ['Show attention to detail', 'Demonstrate innovation mindset']
    },
    {
      name: 'Meta Careers',
      url: 'https://www.metacareers.com/',
      description: 'Facebook/Meta job opportunities',
      tips: ['Emphasize impact and scale', 'Show social impact awareness']
    },
    {
      name: 'Netflix Jobs',
      url: 'https://jobs.netflix.com/',
      description: 'Netflix career opportunities',
      tips: ['Demonstrate high performance', 'Show cultural fit']
    }
  ];

  const searchStrategies = [
    {
      id: 'direct',
      title: 'Direct Company Applications',
      description: 'Apply directly through company career pages',
      steps: [
        'Research target companies in your industry',
        'Visit their careers page regularly',
        'Set up job alerts on company websites',
        'Follow companies on LinkedIn for updates',
        'Network with current employees'
      ],
      pros: ['Higher response rates', 'Direct contact with hiring teams', 'Better company insights'],
      icon: Building
    },
    {
      id: 'networking',
      title: 'Professional Networking',
      description: 'Leverage your professional network for opportunities',
      steps: [
        'Update your LinkedIn profile completely',
        'Connect with industry professionals',
        'Join relevant professional groups',
        'Attend virtual networking events',
        'Reach out to alumni networks'
      ],
      pros: ['Hidden job market access', 'Personal recommendations', 'Industry insights'],
      icon: Network
    },
    {
      id: 'recruiters',
      title: 'Recruiter Partnerships',
      description: 'Work with recruiters and staffing agencies',
      steps: [
        'Research reputable recruiting firms',
        'Submit your resume to relevant recruiters',
        'Build relationships with multiple recruiters',
        'Be responsive and professional',
        'Provide clear job preferences'
      ],
      pros: ['Market expertise', 'Multiple opportunities', 'Negotiation support'],
      icon: Users
    },
    {
      id: 'skills',
      title: 'Skill-Based Platforms',
      description: 'Showcase skills on specialized platforms',
      steps: [
        'Create profiles on GitHub, Behance, or Dribbble',
        'Contribute to open source projects',
        'Build a portfolio website',
        'Participate in coding challenges',
        'Share knowledge through blogs or tutorials'
      ],
      pros: ['Skill demonstration', 'Passive recruitment', 'Industry recognition'],
      icon: Star
    }
  ];

  const generateSearchUrl = (platform, skills, location) => {
    const skillsQuery = skills.slice(0, 3).join(' ');
    const locationQuery = location || 'remote';
    
    const searchUrls = {
      'LinkedIn Jobs': `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skillsQuery)}&location=${encodeURIComponent(locationQuery)}`,
      'Indeed': `https://www.indeed.com/jobs?q=${encodeURIComponent(skillsQuery)}&l=${encodeURIComponent(locationQuery)}`,
      'Glassdoor': `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(skillsQuery)}&locT=&locId=`,
      'Stack Overflow Jobs': `https://stackoverflow.com/jobs?q=${encodeURIComponent(skillsQuery)}`,
      'AngelList (Wellfound)': `https://wellfound.com/jobs?query=${encodeURIComponent(skillsQuery)}`,
      'Remote.co': `https://remote.co/remote-jobs/search/?search_keywords=${encodeURIComponent(skillsQuery)}`,
      'Dice': `https://www.dice.com/jobs?q=${encodeURIComponent(skillsQuery)}&location=${encodeURIComponent(locationQuery)}`,
      'FlexJobs': `https://www.flexjobs.com/search?search=${encodeURIComponent(skillsQuery)}`
    };
    
    return searchUrls[platform.name] || platform.url;
  };

  const JobBoardCard = ({ board, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <board.icon className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{board.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {board.category}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {board.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="text-xs font-medium text-green-600">Advantages:</div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {board.pros.map((pro, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <strong>💡 Tip:</strong> {board.searchTip}
              </div>
              
              <Button
                size="sm"
                onClick={() => window.open(generateSearchUrl(board, skills, location), '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StrategyCard = ({ strategy, isActive, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          isActive ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
        }`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
            }`}>
              <strategy.icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{strategy.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {strategy.description}
              </p>
              
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h4 className="text-sm font-medium mb-2">Action Steps:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1">
                      {strategy.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {strategy.pros.map((pro, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
            
            <ArrowRight className={`w-5 h-5 transition-transform ${
              isActive ? 'rotate-90' : ''
            }`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Complete Job Search Guide
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Pro Tip:</strong> Use multiple job search strategies simultaneously for the best results. 
            The hidden job market (networking) accounts for up to 80% of job opportunities.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="boards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="boards">Job Boards</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="companies">Company Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="boards" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Top Job Search Platforms</h3>
              <p className="text-muted-foreground">
                Curated list of the best job boards for your skills: {skills.slice(0, 3).join(', ')}
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {jobBoards.map((board, index) => (
                <JobBoardCard key={board.name} board={board} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Job Search Strategies</h3>
              <p className="text-muted-foreground">
                Click on each strategy to see detailed action steps
              </p>
            </div>
            
            <div className="space-y-4">
              {searchStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  isActive={activeStrategy === strategy.id}
                  onClick={() => setActiveStrategy(
                    activeStrategy === strategy.id ? null : strategy.id
                  )}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Top Company Career Pages</h3>
              <p className="text-muted-foreground">
                Apply directly to leading tech companies
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {companyPages.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{company.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {company.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Application Tips:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {company.tips.map((tip, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => window.open(company.url, '_blank')}
                        className="w-full"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Career Page
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Action Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Next Steps
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h5 className="text-sm font-medium">This Week:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Update LinkedIn profile with latest skills</li>
                <li>• Apply to 5-10 relevant positions</li>
                <li>• Set up job alerts on 3 platforms</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium">This Month:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Network with 10 industry professionals</li>
                <li>• Follow up on applications</li>
                <li>• Prepare for interviews</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}