/**
 * CareerPage - Comprehensive career progression dashboard
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import CareerRoadmap from '../components/CareerRoadmap';
import SkillsGapChart from '../components/SkillsGapChart';
import CareerTimeline from '../components/CareerTimeline';
import { CareerAnalyzer } from '../services/career/CareerAnalyzer';
import { SkillsGapAnalyzer } from '../services/career/SkillsGapAnalyzer';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Star,
  AlertCircle,
  RefreshCw,
  Download,
  Settings,
  ChevronRight,
  MapPin,
  Calendar,
  Trophy
} from 'lucide-react';

const CareerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [selectedTargetRole, setSelectedTargetRole] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Services
  const careerAnalyzer = useMemo(() => new CareerAnalyzer(), []);
  const skillsGapAnalyzer = useMemo(() => new SkillsGapAnalyzer(), []);

  // Load career data on component mount
  useEffect(() => {
    loadCareerData();
  }, []);

  const loadCareerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get resume data from localStorage or context
      const resumeData = localStorage.getItem('resumeText');
      if (!resumeData) {
        setError('No resume data found. Please upload your resume first.');
        return;
      }

      // Analyze current career level
      const assessment = await careerAnalyzer.assessCurrentLevel(resumeData);
      
      // Set default target role if not selected
      const targetRole = selectedTargetRole || assessment.currentRole;
      
      // Analyze skills gap
      const skillsGap = await skillsGapAnalyzer.analyzeSkillsGap(assessment, targetRole);
      
      setCareerData({
        assessment,
        skillsGap,
        targetRole
      });
    } catch (err) {
      console.error('Error loading career data:', err);
      setError('Failed to analyze career data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTargetRoleChange = async (newTargetRole) => {
    if (newTargetRole === selectedTargetRole) return;
    
    setSelectedTargetRole(newTargetRole);
    setLoading(true);
    
    try {
      const skillsGap = await skillsGapAnalyzer.analyzeSkillsGap(
        careerData.assessment, 
        newTargetRole
      );
      
      setCareerData(prev => ({
        ...prev,
        skillsGap,
        targetRole: newTargetRole
      }));
    } catch (err) {
      console.error('Error updating target role:', err);
      setError('Failed to update target role analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillClick = (skill) => {
    // Navigate to learning resources or skill details
    console.log('Skill clicked:', skill);
  };

  const handleMilestoneClick = (milestone, action, data) => {
    console.log('Milestone action:', { milestone, action, data });
    // Handle milestone interactions
  };

  const handleNodeClick = (node) => {
    console.log('Node clicked:', node);
    // Handle roadmap node interactions
  };

  // Calculate career insights
  const careerInsights = useMemo(() => {
    if (!careerData) return null;

    const { assessment, skillsGap } = careerData;
    
    const totalSkills = (skillsGap.strengthSkills?.length || 0) +
                       (skillsGap.skillsToImprove?.length || 0) +
                       (skillsGap.missingSkills?.length || 0);
    
    const skillsReadiness = totalSkills > 0 
      ? Math.round(((skillsGap.strengthSkills?.length || 0) / totalSkills) * 100)
      : 0;
    
    const estimatedTimeToTarget = skillsGap.timeline?.months || 0;
    
    const marketDemand = assessment.marketPosition?.demandLevel || 'medium';
    
    return {
      skillsReadiness,
      estimatedTimeToTarget,
      marketDemand,
      salaryRange: assessment.marketPosition?.salaryRange,
      competitiveness: Math.round((assessment.marketPosition?.competitiveness || 0) * 100),
      totalLearningHours: skillsGap.timeline?.totalHours || 0
    };
  }, [careerData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Analyzing your career progression...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex space-x-4">
            <Button onClick={loadCareerData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Analysis
            </Button>
            <Button variant="outline" onClick={() => navigate('/resume')}>
              Upload Resume
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout customBreadcrumbs={[
      { path: '/', label: 'Home' },
      { path: '/career', label: 'Career Path' }
    ]}>
      <div className="bg-gradient-to-br from-black via-gray-900 to-purple-900/20">
        {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Career Progression</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your career growth and plan your next steps
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Career Overview Cards */}
        {careerInsights && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Skills Readiness
                    </p>
                    <p className="text-2xl font-bold">{careerInsights.skillsReadiness}%</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <Progress value={careerInsights.skillsReadiness} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Time to Target
                    </p>
                    <p className="text-2xl font-bold">{careerInsights.estimatedTimeToTarget}mo</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {careerInsights.totalLearningHours}h total learning
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Market Demand
                    </p>
                    <Badge 
                      className={`mt-1 ${
                        careerInsights.marketDemand === 'high' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : careerInsights.marketDemand === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {careerInsights.marketDemand}
                    </Badge>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Salary Range
                    </p>
                    <p className="text-lg font-bold">
                      ${careerInsights.salaryRange?.min?.toLocaleString() || 'N/A'} - 
                      ${careerInsights.salaryRange?.max?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {careerInsights.competitiveness}% competitive
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Role & Target Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Career Path</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Current Role</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{careerData?.assessment?.currentRole}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {careerData?.assessment?.experienceLevel} level
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">
                      {Math.round((careerData?.assessment?.confidence || 0) * 100)}% confidence
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Target Role</h3>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{careerData?.targetRole}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {/* Open role selector */}}
                    >
                      Change
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Next career step
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="skills">Skills Gap</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Strengths & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Your Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerData?.assessment?.strengths?.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerData?.assessment?.marketPosition?.recommendations?.map((rec, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Badge className={`text-xs ${
                            rec.priority === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {rec.priority}
                          </Badge>
                          <p className="text-sm flex-1">{rec.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{careerData?.assessment?.skills?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Skills</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{careerData?.skillsGap?.milestones?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Milestones</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{careerData?.skillsGap?.timeline?.weeks || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weeks to Goal</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap">
            <CareerRoadmap
              careerPath={careerData?.careerPath}
              currentLevel={careerData?.assessment?.experienceLevel}
              targetLevel={careerData?.targetLevel}
              skillsGapAnalysis={careerData?.skillsGap}
              milestones={careerData?.skillsGap?.milestones}
              onNodeClick={handleNodeClick}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsGapChart
              skillsGapAnalysis={careerData?.skillsGap}
              onSkillClick={handleSkillClick}
              showProgress={true}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <CareerTimeline
              milestones={careerData?.skillsGap?.milestones || []}
              currentMilestone={1}
              completedMilestones={[]}
              onMilestoneClick={handleMilestoneClick}
              showProgress={true}
            />
          </TabsContent>
        </Tabs>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChevronRight className="w-5 h-5" />
              <span>Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button className="justify-start h-auto p-4" onClick={() => setActiveTab('skills')}>
                <div className="text-left">
                  <p className="font-medium">Analyze Skills Gap</p>
                  <p className="text-xs text-gray-500">Identify areas for improvement</p>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => setActiveTab('timeline')}>
                <div className="text-left">
                  <p className="font-medium">Plan Learning Path</p>
                  <p className="text-xs text-gray-500">Create your development timeline</p>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => navigate('/templates')}>
                <div className="text-left">
                  <p className="font-medium">Update Resume</p>
                  <p className="text-xs text-gray-500">Optimize for target role</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CareerPage;