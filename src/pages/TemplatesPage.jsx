/**
 * Templates Page
 * Main page for browsing and selecting resume templates
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  FileText, 
  Star, 
  TrendingUp, 
  Award, 
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import TemplateGallery from '../components/TemplateGallery';
import { templateDataManager } from '../services/templates/index.js';

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Load analytics and user profile on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get template analytics
        const analyticsData = templateDataManager.getTemplateAnalytics();
        setAnalytics(analyticsData);

        // Get user profile from localStorage or context
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        setUserProfile(profile);

        // Get template recommendations if user profile exists
        if (profile.industry || profile.experienceLevel) {
          const recs = templateDataManager.getTemplateRecommendations(profile, 3);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Failed to load template data:', error);
      }
    };

    loadData();
  }, []);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    
    // Store selected template in localStorage
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    
    // Update usage statistics
    templateDataManager.updateTemplateUsage(template.id, 'use');
    
    // Navigate to resume builder or next step
    navigate('/resume', { state: { template } });
  };

  // Render analytics overview
  const renderAnalyticsOverview = () => {
    if (!analytics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalTemplates}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg ATS Score</p>
                <p className="text-2xl font-bold text-green-600">{analytics.overview.averageAtsScore}%</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.overview.totalDownloads.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.overview.totalCategories}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render recommendations section
  const renderRecommendations = () => {
    if (!recommendations.length) return null;

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Recommended for You
          </CardTitle>
          <p className="text-sm text-gray-600">
            Based on your profile and preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(({ template, score, reasons }) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <Badge className="text-xs bg-yellow-100 text-yellow-800">
                      {Math.round(score)}% match
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="space-y-1 mb-3">
                    {reasons.slice(0, 2).map((reason, index) => (
                      <p key={index} className="text-xs text-green-600 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {reason}
                      </p>
                    ))}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Use Template
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render popular templates
  const renderPopularTemplates = () => {
    if (!analytics?.topTemplates?.mostDownloaded) return null;

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Most Popular Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topTemplates.mostDownloaded.slice(0, 5).map((template, index) => (
              <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-600 capitalize">{template.category} • {template.style}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-green-100 text-green-800">
                    {template.atsScore}% ATS
                  </Badge>
                  <span className="text-xs text-gray-500">{template.usage?.downloads || 0} downloads</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout customBreadcrumbs={[
      { path: '/', label: 'Home' },
      { path: '/templates', label: 'Templates' }
    ]}>
      <div className="bg-gradient-to-br from-black via-gray-900 to-indigo-900/20">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our collection of ATS-optimized resume templates designed by professionals. 
            Get hired faster with templates that pass automated screening systems.
          </p>
        </div>

        {/* Analytics Overview */}
        {renderAnalyticsOverview()}

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <TemplateGallery
              onTemplateSelect={handleTemplateSelect}
              selectedTemplateId={selectedTemplate?.id}
              userProfile={userProfile}
            />
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            {renderRecommendations()}
            
            {!recommendations.length && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-600 mb-4">
                  Complete your profile to get personalized template recommendations
                </p>
                <Button onClick={() => navigate('/profile')}>
                  Complete Profile
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            {renderPopularTemplates()}
            
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/templates')}
              >
                View All Templates
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-gray-600 mb-6">
            Select a template above or start with our AI-powered resume builder
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/resume')}>
              Start Building
            </Button>
            <Button variant="outline" onClick={() => navigate('/ats-checker')}>
              Check Existing Resume
            </Button>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default TemplatesPage;