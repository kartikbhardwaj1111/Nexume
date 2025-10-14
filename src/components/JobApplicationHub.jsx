import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users, 
  Globe,
  Star,
  TrendingUp,
  Copy,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  FileText,
  Search,
  Target,
  Lightbulb
} from 'lucide-react';

export function JobApplicationHub({ 
  resumeSkills = [], 
  userProfile = {},
  className = '' 
}) {
  const [copiedText, setCopiedText] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  // Direct company opportunities with guaranteed accessible application methods
  const directOpportunities = [
    {
      id: 'google-swe',
      title: 'Software Engineer',
      company: 'Google',
      location: 'Multiple Locations + Remote Available',
      salary: '$130k - $200k',
      type: 'Full-time',
      skills: ['javascript', 'python', 'system design', 'algorithms'],
      description: 'Build next-generation technologies that change how billions of users connect, explore, and interact with information.',
      applicationMethods: {
        direct: 'https://careers.google.com/jobs/results/?q=software%20engineer',
        email: 'Apply through Google Careers portal - No regional restrictions',
        referral: 'Connect with Google employees on LinkedIn',
        tips: [
          'Prepare for coding interviews with LeetCode',
          'Study system design fundamentals',
          'Review Google\'s engineering principles',
          'Apply directly through careers.google.com'
        ]
      },
      requirements: ['3+ years experience', 'Strong coding skills', 'System design knowledge'],
      benefits: ['Competitive salary', 'Stock options', 'Health insurance', 'Learning budget'],
      remote: true,
      match: 92,
      accessibility: 'Globally accessible - No regional restrictions'
    },
    {
      id: 'microsoft-pm',
      title: 'Product Manager',
      company: 'Microsoft',
      location: 'Redmond, WA + Remote Available',
      salary: '$120k - $180k',
      type: 'Full-time',
      skills: ['product management', 'analytics', 'user research', 'strategy'],
      description: 'Drive product strategy and roadmap for Microsoft\'s cloud and productivity solutions.',
      applicationMethods: {
        direct: 'https://careers.microsoft.com/professionals/us/en/search-results?keywords=product%20manager',
        email: 'Submit application through Microsoft Careers - Worldwide applications accepted',
        referral: 'Network with Microsoft PMs on LinkedIn',
        tips: [
          'Understand Microsoft\'s product ecosystem',
          'Prepare case studies of product decisions',
          'Show data-driven thinking',
          'Apply directly through careers.microsoft.com'
        ]
      },
      requirements: ['4+ years PM experience', 'Technical background', 'Leadership skills'],
      benefits: ['Stock purchase plan', 'Flexible work', 'Professional development'],
      remote: true,
      match: 88,
      accessibility: 'Globally accessible - No regional restrictions'
    },
    {
      id: 'netflix-data',
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA + Remote Available',
      salary: '$140k - $220k',
      type: 'Full-time',
      skills: ['python', 'machine learning', 'sql', 'statistics', 'a/b testing'],
      description: 'Use data to improve Netflix\'s recommendation algorithms and content strategy.',
      applicationMethods: {
        direct: 'https://jobs.netflix.com/search?q=data%20scientist',
        email: 'Apply directly through Netflix Jobs portal - International applications welcome',
        referral: 'Connect with Netflix data scientists on LinkedIn',
        tips: [
          'Showcase ML projects and impact',
          'Understand Netflix\'s recommendation system',
          'Prepare for technical case studies',
          'Apply directly through jobs.netflix.com'
        ]
      },
      requirements: ['5+ years data science experience', 'ML expertise', 'Business acumen'],
      benefits: ['Unlimited PTO', 'Stock options', 'Top-tier compensation'],
      remote: true,
      match: 95,
      accessibility: 'Globally accessible - No regional restrictions'
    },
    {
      id: 'stripe-eng',
      title: 'Backend Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA + Remote Available',
      salary: '$150k - $250k',
      type: 'Full-time',
      skills: ['ruby', 'scala', 'distributed systems', 'apis', 'fintech'],
      description: 'Build the financial infrastructure that powers internet commerce.',
      applicationMethods: {
        direct: 'https://stripe.com/jobs/search?q=backend%20engineer',
        email: 'Apply through Stripe\'s careers page - Global applications accepted',
        referral: 'Network with Stripe engineers on LinkedIn',
        tips: [
          'Understand payment systems and fintech',
          'Show experience with distributed systems',
          'Demonstrate API design skills',
          'Apply directly through stripe.com/jobs'
        ]
      },
      requirements: ['3+ years backend experience', 'Distributed systems knowledge', 'API design'],
      benefits: ['Equity package', 'Learning stipend', 'Health benefits'],
      remote: true,
      match: 90,
      accessibility: 'Globally accessible - No regional restrictions'
    },
    {
      id: 'airbnb-design',
      title: 'Product Designer',
      company: 'Airbnb',
      location: 'San Francisco, CA + Remote Available',
      salary: '$110k - $170k',
      type: 'Full-time',
      skills: ['figma', 'user research', 'prototyping', 'design systems', 'ux'],
      description: 'Design experiences that help people belong anywhere in the world.',
      applicationMethods: {
        direct: 'https://careers.airbnb.com/positions/?search=product%20designer',
        email: 'Submit portfolio through Airbnb Careers - Worldwide applications welcome',
        referral: 'Connect with Airbnb designers on LinkedIn',
        tips: [
          'Create a strong design portfolio',
          'Show user research and testing experience',
          'Understand Airbnb\'s design principles',
          'Apply directly through careers.airbnb.com'
        ]
      },
      requirements: ['4+ years design experience', 'Strong portfolio', 'User research skills'],
      benefits: ['Travel credits', 'Flexible work', 'Design tools budget'],
      remote: true,
      match: 85,
      accessibility: 'Globally accessible - No regional restrictions'
    },
    // Additional globally accessible opportunities
    {
      id: 'shopify-dev',
      title: 'Full Stack Developer',
      company: 'Shopify',
      location: 'Ottawa, Canada + Remote Worldwide',
      salary: '$120k - $180k',
      type: 'Full-time',
      skills: ['react', 'ruby', 'graphql', 'typescript', 'e-commerce'],
      description: 'Build commerce solutions that power millions of businesses worldwide.',
      applicationMethods: {
        direct: 'https://www.shopify.com/careers/search?keywords=full%20stack%20developer',
        email: 'Apply through Shopify Careers - Remote-first company',
        referral: 'Connect with Shopify developers globally',
        tips: [
          'Understand e-commerce and merchant needs',
          'Show experience with React and Ruby',
          'Demonstrate GraphQL knowledge',
          'Shopify is remote-first and hires globally'
        ]
      },
      requirements: ['3+ years full stack experience', 'React/Ruby skills', 'E-commerce knowledge'],
      benefits: ['Remote work', 'Stock options', 'Learning budget', 'Health benefits'],
      remote: true,
      match: 88,
      accessibility: 'Globally accessible - Remote-first company'
    },
    {
      id: 'github-eng',
      title: 'Software Engineer',
      company: 'GitHub',
      location: 'Remote Worldwide',
      salary: '$130k - $190k',
      type: 'Full-time',
      skills: ['ruby', 'javascript', 'git', 'open source', 'collaboration'],
      description: 'Build the platform where millions of developers collaborate and build software.',
      applicationMethods: {
        direct: 'https://github.com/about/careers?query=software%20engineer',
        email: 'Apply through GitHub Careers - Fully remote positions available',
        referral: 'Connect with GitHub employees worldwide',
        tips: [
          'Contribute to open source projects',
          'Show experience with Git and collaboration tools',
          'Understand developer workflows',
          'GitHub hires globally for remote positions'
        ]
      },
      requirements: ['3+ years software development', 'Git expertise', 'Open source contributions'],
      benefits: ['Fully remote', 'Stock options', 'Professional development', 'Open source time'],
      remote: true,
      match: 90,
      accessibility: 'Globally accessible - Fully remote company'
    }
  ];

  // Alternative application strategies
  const applicationStrategies = [
    {
      id: 'direct-outreach',
      title: 'Direct Company Outreach',
      description: 'Contact companies directly through their career pages and hiring managers',
      icon: Building,
      color: 'bg-blue-500',
      steps: [
        'Research target companies and their hiring processes',
        'Find hiring managers on LinkedIn',
        'Send personalized messages highlighting your skills',
        'Follow up professionally after 1-2 weeks',
        'Apply through official company career pages'
      ],
      tools: [
        'LinkedIn Sales Navigator',
        'Company career pages',
        'Email templates',
        'CRM for tracking outreach'
      ],
      successRate: '25-40%',
      timeInvestment: '2-3 hours per company'
    },
    {
      id: 'networking',
      title: 'Professional Networking',
      description: 'Leverage your network and build new professional relationships',
      icon: Users,
      color: 'bg-green-500',
      steps: [
        'Update your LinkedIn profile completely',
        'Join industry-specific groups and communities',
        'Attend virtual networking events and webinars',
        'Reach out to alumni and former colleagues',
        'Offer value before asking for help'
      ],
      tools: [
        'LinkedIn Premium',
        'Industry Slack communities',
        'Virtual meetups and conferences',
        'Alumni networks'
      ],
      successRate: '40-60%',
      timeInvestment: '1-2 hours daily'
    },
    {
      id: 'skill-showcase',
      title: 'Skill Demonstration',
      description: 'Show your abilities through projects and contributions',
      icon: Star,
      color: 'bg-purple-500',
      steps: [
        'Create a portfolio website showcasing your work',
        'Contribute to open source projects',
        'Write technical blog posts or articles',
        'Participate in coding challenges and hackathons',
        'Share your knowledge through tutorials'
      ],
      tools: [
        'GitHub for code projects',
        'Personal website/portfolio',
        'Medium or Dev.to for writing',
        'CodePen for demos'
      ],
      successRate: '30-50%',
      timeInvestment: '5-10 hours per week'
    },
    {
      id: 'recruiter-partnership',
      title: 'Recruiter Partnerships',
      description: 'Work with specialized recruiters in your field',
      icon: TrendingUp,
      color: 'bg-orange-500',
      steps: [
        'Research reputable recruiting firms in your industry',
        'Submit your resume to multiple recruiters',
        'Build relationships with 3-5 key recruiters',
        'Be responsive and professional in all interactions',
        'Provide clear preferences and requirements'
      ],
      tools: [
        'Robert Half, Kforce, TEKsystems',
        'Specialized tech recruiters',
        'LinkedIn recruiter connections',
        'Industry-specific staffing firms'
      ],
      successRate: '35-55%',
      timeInvestment: '1-2 hours per week'
    }
  ];

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateApplicationEmail = (job) => {
    return `Subject: Application for ${job.title} Position

Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. 

Based on my background in ${resumeSkills.slice(0, 3).join(', ')}, I believe I would be a valuable addition to your team. My experience aligns well with your requirements, particularly in:

${job.requirements.slice(0, 3).map(req => `• ${req}`).join('\n')}

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and experience can contribute to ${job.company}'s continued success.

Thank you for your consideration. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Email]
[Your Phone]`;
  };

  const JobCard = ({ job, onSelect }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
        onClick={() => onSelect(job)}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-primary">{job.company}</span>
                <Badge variant="outline" className="text-xs">
                  {job.type}
                </Badge>
              </div>
            </div>
            
            <Badge 
              variant="outline" 
              className={`text-xs font-bold ${
                job.match >= 90 ? 'bg-green-100 text-green-700 border-green-300' :
                job.match >= 80 ? 'bg-blue-100 text-blue-700 border-blue-300' :
                'bg-yellow-100 text-yellow-700 border-yellow-300'
              }`}
            >
              <Star className="w-3 h-3 mr-1" />
              {job.match}% match
            </Badge>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
              {job.remote && (
                <Badge variant="secondary" className="text-xs">
                  Remote Available
                </Badge>
              )}
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                <Globe className="w-3 h-3 mr-1" />
                Global Access
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-1">
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
            </div>
          </div>

          <Button className="w-full" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Application Methods
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StrategyCard = ({ strategy }) => (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${strategy.color}`}>
            <strategy.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">{strategy.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {strategy.description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Success Rate:</span>
              <div className="text-green-600 font-semibold">{strategy.successRate}</div>
            </div>
            <div>
              <span className="font-medium">Time Investment:</span>
              <div className="text-blue-600 font-semibold">{strategy.timeInvestment}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Action Steps:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              {strategy.steps.slice(0, 3).map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommended Tools:</h4>
            <div className="flex flex-wrap gap-1">
              {strategy.tools.slice(0, 3).map((tool, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="opportunities">Direct Opportunities</TabsTrigger>
          <TabsTrigger value="strategies">Application Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <Lightbulb className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>✅ No Regional Restrictions!</strong> All opportunities below are globally accessible 
              through direct company career pages. No external job board limitations - apply from anywhere in the world!
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            {directOpportunities.map((job, index) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onSelect={setSelectedJob}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Proven Job Search Strategies</h3>
            <p className="text-muted-foreground">
              Multiple approaches to find and secure job opportunities without relying on job boards
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {applicationStrategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedJob(null)}
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
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-primary">{selectedJob.company}</span>
                      <Badge variant="outline">{selectedJob.type}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedJob(null)}>
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Job Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{selectedJob.salary}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Application Methods</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Direct Application
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {selectedJob.applicationMethods.email}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => window.open(selectedJob.applicationMethods.direct, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Template
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Copy this template and customize it for your application
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateApplicationEmail(selectedJob), 'email')}
                          >
                            {copiedText === 'email' ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Template
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Networking Approach
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {selectedJob.applicationMethods.referral}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://www.linkedin.com/search/results/people/?keywords=${selectedJob.company}%20${selectedJob.title}`, '_blank')}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Find Connections
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Application Tips</h3>
                    <ul className="space-y-2">
                      {selectedJob.applicationMethods.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Requirements</h3>
                      <ul className="space-y-1">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <Target className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Benefits</h3>
                      <ul className="space-y-1">
                        {selectedJob.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <Star className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}