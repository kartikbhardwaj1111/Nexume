/**
 * Unified Dashboard Component
 * Central hub that integrates all platform features
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Target, 
  Users, 
  BarChart3, 
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  BookOpen,
  Zap
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CareerAnalyzer } from '../services/career/CareerAnalyzer';
import InterviewSessionManager from '../services/interview/InterviewSessionManager';
import LocalStorageManager from '../services/storage/LocalStorageManager';
import { SmartJobFinder } from './SmartJobFinder';

const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    resumeScore: null,
    careerProgress: null,
    interviewStats: null,
    recentActivity: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load resume analysis data
      const resumeData = LocalStorageManager.getResumeData();
      const lastAnalysis = LocalStorageManager.getLastAnalysis();
      
      // Load career progress
      const careerAnalyzer = new CareerAnalyzer();
      let careerProgress = null;
      if (resumeData) {
        careerProgress = await careerAnalyzer.assessCurrentLevel(resumeData.content || '');
      }
      
      // Extract skills from resume analysis if available
      let resumeSkills = [];
      if (lastAnalysis?.keywords) {
        resumeSkills = lastAnalysis.keywords;
      } else if (careerProgress?.skills) {
        resumeSkills = careerProgress.skills;
      } else if (resumeData?.content) {
        // Extract basic skills from resume content
        resumeSkills = extractSkillsFromText(resumeData.content);
      }
      
      // Load interview statistics
      const interviewManager = new InterviewSessionManager();
      const interviewStats = interviewManager.getSessionStats();
      
      // Load recent activity
      const recentActivity = LocalStorageManager.getRecentActivity() || [];
      
      // Generate recommendations
      const recommendations = generateRecommendations(lastAnalysis, careerProgress, interviewStats, resumeSkills);
      
      setDashboardData({
        resumeScore: lastAnalysis?.score || null,
        careerProgress: { ...careerProgress, skills: resumeSkills },
        interviewStats,
        recentActivity: recentActivity.slice(0, 5), // Show last 5 activities
        recommendations
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractSkillsFromText = (text) => {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 'SQL',
      'Git', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Angular', 'Vue.js',
      'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Microservices',
      'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Scrum'
    ];
    
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return foundSkills.slice(0, 10); // Return top 10 skills
  };

  const generateRecommendations = (resumeAnalysis, careerProgress, interviewStats, resumeSkills) => {
    const recommendations = [];
    
    // Resume-based recommendations
    if (!resumeAnalysis) {
      recommendations.push({
        type: 'resume',
        title: 'Analyze Your Resume',
        description: 'Get started by uploading your resume for ATS analysis',
        action: 'Upload Resume',
        path: '/ats-checker',
        priority: 'high',
        icon: FileText
      });
    } else if (resumeAnalysis.score < 70) {
      recommendations.push({
        type: 'resume',
        title: 'Improve Resume Score',
        description: `Your ATS score is ${resumeAnalysis.score}%. Let's optimize it for better results.`,
        action: 'Optimize Resume',
        path: '/ats-checker',
        priority: 'high',
        icon: TrendingUp
      });
    }
    
    // Career progression recommendations
    if (careerProgress && careerProgress.skillsGap?.length > 0) {
      recommendations.push({
        type: 'career',
        title: 'Develop Missing Skills',
        description: `${careerProgress.skillsGap.length} skills identified for your target role`,
        action: 'View Career Path',
        path: '/career',
        priority: 'medium',
        icon: Target
      });
    }
    
    // Interview preparation recommendations
    if (!interviewStats || interviewStats.totalSessions < 3) {
      recommendations.push({
        type: 'interview',
        title: 'Practice Mock Interviews',
        description: 'Build confidence with AI-powered interview practice',
        action: 'Start Practice',
        path: '/interview-prep',
        priority: 'medium',
        icon: Users
      });
    }
    
    // Job matching recommendations
    if (resumeAnalysis && resumeSkills?.length > 0) {
      recommendations.push({
        type: 'jobs',
        title: 'Find Matching Jobs',
        description: `Discover job opportunities matching your ${resumeSkills.length} identified skills`,
        action: 'Find Jobs',
        path: '/job-analysis',
        priority: 'medium',
        icon: Briefcase
      });
    }
    
    // Template recommendations
    if (!LocalStorageManager.getTemplateUsage()) {
      recommendations.push({
        type: 'template',
        title: 'Try Professional Templates',
        description: 'Create a polished resume with our ATS-optimized templates',
        action: 'Browse Templates',
        path: '/templates',
        priority: 'low',
        icon: BarChart3
      });
    }
    
    return recommendations.slice(0, 4); // Show top 4 recommendations
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome to Your Career Hub</h1>
                <p className="text-muted-foreground">
                  Track your progress, optimize your resume, and accelerate your career growth
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resume Score</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.resumeScore ? `${dashboardData.resumeScore}%` : 'N/A'}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
              {dashboardData.resumeScore && (
                <Progress value={dashboardData.resumeScore} className="mt-2" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Career Progress</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.careerProgress?.experienceLevel || 'Unknown'}
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interview Sessions</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.interviewStats?.totalSessions || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.interviewStats?.averageScore 
                      ? `${Math.round(dashboardData.interviewStats.averageScore)}%` 
                      : 'N/A'
                    }
                  </p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="recommendations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="jobs">Find Jobs</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.recommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center
                              ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : 
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                                'bg-blue-100 text-blue-600'}
                            `}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{rec.title}</h3>
                              <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                                {rec.priority} priority
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                        <Button 
                          onClick={() => navigate(rec.path)}
                          className="w-full group-hover:bg-primary/90"
                        >
                          {rec.action}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <SmartJobFinder 
              resumeSkills={dashboardData.careerProgress?.skills || []} 
              className="w-full"
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Career Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Career Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.careerProgress ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Level</p>
                        <p className="font-semibold capitalize">
                          {dashboardData.careerProgress.experienceLevel}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Skills Identified</p>
                        <p className="font-semibold">
                          {dashboardData.careerProgress.skills?.length || 0} skills
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/career')}
                        className="w-full"
                      >
                        View Career Path
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No career data available</p>
                      <Button onClick={() => navigate('/career')}>
                        Start Career Analysis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interview Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Interview Preparation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.interviewStats?.totalSessions > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Sessions Completed</p>
                        <p className="font-semibold">
                          {dashboardData.interviewStats.totalSessions}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="font-semibold">
                          {Math.round(dashboardData.interviewStats.averageScore)}%
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/interview-prep')}
                        className="w-full"
                      >
                        Continue Practice
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No interview sessions yet</p>
                      <Button onClick={() => navigate('/interview-prep')}>
                        Start Practice
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump to any feature to continue your career development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'ATS Check', path: '/ats-checker', icon: FileText, color: 'bg-blue-500' },
                { label: 'Job Analysis', path: '/job-analysis', icon: Briefcase, color: 'bg-green-500' },
                { label: 'Templates', path: '/templates', icon: BarChart3, color: 'bg-purple-500' },
                { label: 'Analytics', path: '/analytics', icon: TrendingUp, color: 'bg-orange-500' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => navigate(action.path)}
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-muted/50"
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UnifiedDashboard;