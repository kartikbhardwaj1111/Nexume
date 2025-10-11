/**
 * Cross-Feature Navigation Component
 * Shows connections and suggested next steps between features
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  FileText, 
  Target, 
  Users, 
  BarChart3, 
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';

const CrossFeatureNavigation = ({ currentFeature, userProgress = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define feature connections and suggested flows
  const featureConnections = {
    'ats-checker': {
      title: 'Resume Analysis Complete',
      suggestions: [
        {
          feature: 'job-analysis',
          title: 'Analyze Target Jobs',
          description: 'Find jobs that match your optimized resume',
          icon: Briefcase,
          priority: 'high',
          condition: () => userProgress.resume?.lastScore > 70
        },
        {
          feature: 'career',
          title: 'Plan Career Growth',
          description: 'Identify skills to develop for advancement',
          icon: Target,
          priority: 'medium',
          condition: () => true
        },
        {
          feature: 'templates',
          title: 'Professional Templates',
          description: 'Create a polished version with our templates',
          icon: BarChart3,
          priority: 'low',
          condition: () => !userProgress.templates?.templatesUsed
        }
      ]
    },
    'job-analysis': {
      title: 'Job Analysis Complete',
      suggestions: [
        {
          feature: 'interview-prep',
          title: 'Prepare for Interviews',
          description: 'Practice with company-specific questions',
          icon: Users,
          priority: 'high',
          condition: () => true
        },
        {
          feature: 'career',
          title: 'Skill Development',
          description: 'Learn skills required for this role',
          icon: Target,
          priority: 'medium',
          condition: () => true
        },
        {
          feature: 'ats-checker',
          title: 'Optimize Resume',
          description: 'Tailor your resume for this specific job',
          icon: FileText,
          priority: 'medium',
          condition: () => userProgress.resume?.lastScore < 80
        }
      ]
    },
    'career': {
      title: 'Career Path Mapped',
      suggestions: [
        {
          feature: 'interview-prep',
          title: 'Interview Practice',
          description: 'Practice questions for your target role',
          icon: Users,
          priority: 'high',
          condition: () => userProgress.interview?.sessionsCompleted < 3
        },
        {
          feature: 'job-analysis',
          title: 'Find Target Jobs',
          description: 'Search for roles matching your career goals',
          icon: Briefcase,
          priority: 'medium',
          condition: () => true
        },
        {
          feature: 'ats-checker',
          title: 'Update Resume',
          description: 'Reflect new skills in your resume',
          icon: FileText,
          priority: 'low',
          condition: () => true
        }
      ]
    },
    'interview-prep': {
      title: 'Interview Skills Developing',
      suggestions: [
        {
          feature: 'job-analysis',
          title: 'Find More Opportunities',
          description: 'Apply your interview skills to more jobs',
          icon: Briefcase,
          priority: 'high',
          condition: () => userProgress.interview?.averageScore > 70
        },
        {
          feature: 'career',
          title: 'Long-term Planning',
          description: 'Plan your next career moves',
          icon: Target,
          priority: 'medium',
          condition: () => true
        },
        {
          feature: 'ats-checker',
          title: 'Resume Refinement',
          description: 'Update resume based on interview insights',
          icon: FileText,
          priority: 'low',
          condition: () => true
        }
      ]
    },
    'templates': {
      title: 'Professional Resume Created',
      suggestions: [
        {
          feature: 'ats-checker',
          title: 'Test ATS Compatibility',
          description: 'Ensure your new resume passes ATS systems',
          icon: FileText,
          priority: 'high',
          condition: () => true
        },
        {
          feature: 'job-analysis',
          title: 'Apply to Jobs',
          description: 'Use your polished resume to apply for positions',
          icon: Briefcase,
          priority: 'medium',
          condition: () => true
        },
        {
          feature: 'interview-prep',
          title: 'Prepare for Interviews',
          description: 'Get ready for the interviews your resume will generate',
          icon: Users,
          priority: 'medium',
          condition: () => true
        }
      ]
    }
  };

  const currentConnections = featureConnections[currentFeature];
  
  if (!currentConnections) {
    return null;
  }

  // Filter suggestions based on conditions
  const availableSuggestions = currentConnections.suggestions.filter(
    suggestion => suggestion.condition()
  );

  if (availableSuggestions.length === 0) {
    return null;
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFeaturePath = (feature) => {
    const paths = {
      'ats-checker': '/ats-checker',
      'job-analysis': '/job-analysis',
      'career': '/career',
      'interview-prep': '/interview-prep',
      'templates': '/templates'
    };
    return paths[feature] || '/';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold">{currentConnections.title}</h3>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Great progress! Here are your recommended next steps to accelerate your career:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              
              return (
                <motion.div
                  key={suggestion.feature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-muted/50 hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${suggestion.priority === 'high' ? 'bg-red-100 text-red-600' : 
                            suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-blue-100 text-blue-600'}
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                        >
                          {suggestion.priority} priority
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {suggestion.title}
                      </h4>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {suggestion.description}
                      </p>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(getFeaturePath(suggestion.feature))}
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 pt-4 border-t border-muted/20">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>Career Progress</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
                  <span>Recommended</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CrossFeatureNavigation;