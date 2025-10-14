/**
 * Gemini Test Page
 * A dedicated page for testing Gemini AI integration
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Brain, Zap, TestTube } from 'lucide-react';
import GeminiStatus from '../components/GeminiStatus';
import { useNavigate } from 'react-router-dom';

const GeminiTestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Gemini AI Integration</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Test and monitor the Google Gemini AI integration for Resume Fit Codenex. 
            This page shows the current status and allows you to run integration tests.
          </p>
        </div>

        {/* API Key Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Gemini API Key
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                  AIzaSyBWH2FNzI1b-d35GD8Wz-tfLphVVIrG2u8
                </div>
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Configured
                </Badge>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Model Configuration
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  <div>Model: Gemini 1.5 Flash</div>
                  <div>Temperature: 0.7</div>
                  <div>Max Tokens: 8192</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gemini Status Component */}
        <div className="mb-6">
          <GeminiStatus />
        </div>

        {/* Features Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-green-500" />
              Integrated Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Resume Analysis</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• ATS compatibility scoring</li>
                  <li>• Skills gap analysis</li>
                  <li>• Experience matching</li>
                  <li>• Improvement recommendations</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Job Processing</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Job description extraction</li>
                  <li>• Requirements parsing</li>
                  <li>• Skills identification</li>
                  <li>• Company information</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Career Guidance</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Career path recommendations</li>
                  <li>• Skills development plans</li>
                  <li>• Learning resource suggestions</li>
                  <li>• Timeline estimates</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Interview Prep</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Custom interview questions</li>
                  <li>• Behavioral scenarios</li>
                  <li>• Technical assessments</li>
                  <li>• Answer evaluation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
          <Button onClick={() => navigate('/ats-checker')}>
            Try ATS Checker
          </Button>
          <Button onClick={() => navigate('/templates')} variant="outline">
            View Templates
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by Google Gemini AI • Resume Fit Codenex v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiTestPage;