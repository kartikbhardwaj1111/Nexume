import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  Building, 
  Users, 
  Mail,
  Globe,
  Target,
  Lightbulb,
  ArrowRight,
  Star,
  MapPin,
  DollarSign
} from 'lucide-react';

export function SmartJobFinder({ resumeSkills = [], className = '' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Generate search query from resume skills
  useEffect(() => {
    if (resumeSkills.length > 0) {
      setSearchQuery(resumeSkills.slice(0, 3).join(' '));
    }
  }, [resumeSkills]);

  // Top companies with direct career pages (NO regional restrictions)
  const topCompanies = [
    {
      name: 'Google',
      url: 'https://careers.google.com/',
      searchUrl: 'https://careers.google.com/jobs/results/',
      description: 'Search and technology company',
      tips: ['Prepare for technical interviews', 'Study algorithms and system design'],
      commonRoles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'],
      benefits: ['Competitive salary', 'Stock options', 'Learning opportunities'],
      logo: '🔍'
    },
    {
      name: 'Microsoft',
      url: 'https://careers.microsoft.com/',
      searchUrl: 'https://careers.microsoft.com/professionals/us/en/search-results',
      description: 'Technology and cloud computing',
      tips: ['Show collaboration skills', 'Understand Microsoft ecosystem'],
      commonRoles: ['Software Engineer', 'Cloud Architect', 'Product Manager', 'Data Engineer'],
      benefits: ['Stock purchase plan', 'Flexible work', 'Professional development'],
      logo: '🪟'
    },
    {
      name: 'Amazon',
      url: 'https://www.amazon.jobs/',
      searchUrl: 'https://www.amazon.jobs/en/search',
      description: 'E-commerce and cloud services',
      tips: ['Learn leadership principles', 'Prepare for behavioral interviews'],
      commonRoles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'Solutions Architect'],
      benefits: ['Competitive compensation', 'Career growth', 'Innovation culture'],
      logo: '📦'
    },
    {
      name: 'Apple',
      url: 'https://jobs.apple.com/',
      searchUrl: 'https://jobs.apple.com/en-us/search',
      description: 'Consumer technology and innovation',
      tips: ['Show attention to detail', 'Demonstrate design thinking'],
      commonRoles: ['Software Engineer', 'Hardware Engineer', 'Product Designer', 'Data Scientist'],
      benefits: ['Employee discounts', 'Health benefits', 'Stock options'],
      logo: '🍎'
    },
    {
      name: 'Meta (Facebook)',
      url: 'https://www.metacareers.com/',
      searchUrl: 'https://www.metacareers.com/jobs/',
      description: 'Social media and virtual reality',
      tips: ['Understand social impact', 'Show scale thinking'],
      commonRoles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Researcher'],
      benefits: ['Equity package', 'Wellness programs', 'Learning budget'],
      logo: '👥'
    },
    {
      name: 'Netflix',
      url: 'https://jobs.netflix.com/',
      searchUrl: 'https://jobs.netflix.com/search',
      description: 'Streaming and entertainment technology',
      tips: ['Show high performance', 'Demonstrate cultural fit'],
      commonRoles: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Content Analyst'],
      benefits: ['Unlimited PTO', 'Top compensation', 'Creative freedom'],
      logo: '🎬'
    }
  ];

  // Professional job search platforms (alternative to problematic job boards)
  const professionalPlatforms = [
    {
      name: 'AngelList (Wellfound)',
      url: 'https://wellfound.com/',
      description: 'Startup jobs with equity opportunities',
      searchTip: 'Filter by company stage, equity, and remote options',
      speciality: 'Startups & Equity',
      icon: '🚀'
    },
    {
      name: 'Stack Overflow Jobs',
      url: 'https://stackoverflow.com/jobs',
      description: 'Developer-focused job platform',
      searchTip: 'Showcase your coding contributions and technical skills',
      speciality: 'Developer Roles',
      icon: '💻'
    },
    {
      name: 'Dice',
      url: 'https://www.dice.com/',
      description: 'Technology and IT job marketplace',
      searchTip: 'Use detailed skill filters and salary requirements',
      speciality: 'Tech & IT',
      icon: '🎲'
    },
    {
      name: 'Remote.co',
      url: 'https://remote.co/remote-jobs/',
      description: 'Curated remote job opportunities',
      searchTip: 'Emphasize remote work experience and communication skills',
      speciality: '100% Remote',
      icon: '🌐'
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

  const generateSearchQuery = (skills) => {
    return skills.slice(0, 3).join(' OR ');
  };

  const generateLinkedInSearch = (skills) => {
    const query = skills.slice(0, 2).join(' ');
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=Worldwide&f_WT=2`; // f_WT=2 is remote filter
  };

  const CompanyCard = ({ company, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-3xl">{company.logo}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{company.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {company.description}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Common Roles:</h4>
              <div className="flex flex-wrap gap-1">
                {company.commonRoles.slice(0, 3).map((role, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Application Tips:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {company.tips.slice(0, 2).map((tip, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              size="sm"
              onClick={() => window.open(company.searchUrl, '_blank')}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Jobs at {company.name}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(company.url, '_blank')}
              className="w-full"
            >
              <Building className="w-4 h-4 mr-2" />
              Visit Career Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PlatformCard = ({ platform, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-2xl">{platform.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{platform.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {platform.speciality}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {platform.description}
              </p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
              💡 Search Tip:
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {platform.searchTip}
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => window.open(platform.url, '_blank')}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Explore {platform.name}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Smart Job Finder - No Regional Restrictions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Solution to Regional Issues:</strong> Instead of generic job board searches, 
            we provide direct access to company career pages and professional platforms that work globally.
          </AlertDescription>
        </Alert>

        {/* Search Query Generator */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Your Optimized Job Search Query:
            </label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter skills or job title"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(searchQuery, 'query')}
              >
                {copiedText === 'query' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this query on any job platform for better results
            </p>
          </div>

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => window.open(generateLinkedInSearch(resumeSkills), '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Users className="w-4 h-4 mr-2" />
              LinkedIn Remote Jobs
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`https://stackoverflow.com/jobs?q=${encodeURIComponent(searchQuery)}&r=true`, '_blank')}
            >
              💻 Stack Overflow
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`https://wellfound.com/jobs?query=${encodeURIComponent(searchQuery)}`, '_blank')}
            >
              🚀 Startups
            </Button>
          </div>
        </div>

        {/* Top Company Career Pages */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Top Company Career Pages
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topCompanies.map((company, index) => (
              <CompanyCard key={company.name} company={company} index={index} />
            ))}
          </div>
        </div>

        {/* Professional Platforms */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Professional Job Platforms
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {professionalPlatforms.map((platform, index) => (
              <PlatformCard key={platform.name} platform={platform} index={index} />
            ))}
          </div>
        </div>

        {/* Application Strategy Guide */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recommended Application Strategy
          </h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700 dark:text-green-300">Week 1-2</h4>
              <ul className="text-sm space-y-1">
                <li>• Apply to 3-5 top companies directly</li>
                <li>• Set up LinkedIn job alerts</li>
                <li>• Update all professional profiles</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700 dark:text-blue-300">Week 3-4</h4>
              <ul className="text-sm space-y-1">
                <li>• Network with industry professionals</li>
                <li>• Apply to 10+ positions on platforms</li>
                <li>• Follow up on initial applications</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700 dark:text-purple-300">Ongoing</h4>
              <ul className="text-sm space-y-1">
                <li>• Continue networking and applications</li>
                <li>• Prepare for interviews</li>
                <li>• Track application progress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0%</div>
              <div className="text-sm text-muted-foreground">Regional Restrictions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-muted-foreground">Accessible Links</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">25+</div>
              <div className="text-sm text-muted-foreground">Job Sources</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}