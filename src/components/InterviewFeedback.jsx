/**
 * Interview Feedback Component
 * Displays detailed feedback and scoring from interview evaluation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  BarChart3,
  Lightbulb,
  Star,
  Award,
  BookOpen
} from 'lucide-react';

const InterviewFeedback = ({ evaluation, onRetakeInterview, onViewHistory }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!evaluation) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No evaluation data available.</p>
        </CardContent>
      </Card>
    );
  }

  const { overallScore, feedback, performanceTracking, metadata } = evaluation;

  // Score color based on performance
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 80) return 'bg-blue-50 border-blue-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Overall Score Header */}
      <Card className={`${getScoreBgColor(overallScore)} border-2`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Interview Evaluation</h2>
              <p className="text-gray-600">{feedback.overall.message}</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
              <Badge variant="outline" className="mt-2">
                {feedback.overall.level}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metadata.answeredQuestions}</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round(metadata.sessionDuration / 60)}m
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round((metadata.answeredQuestions / metadata.totalQuestions) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            {performanceTracking.trends?.direction === 'improving' ? (
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            ) : performanceTracking.trends?.direction === 'declining' ? (
              <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            ) : (
              <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            )}
            <div className="text-2xl font-bold">
              {performanceTracking.trends?.direction || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Trend</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feedback Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.strengths.slice(0, 3).map((strength, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{strength.skill}</span>
                      <Badge variant="outline" className="text-green-600">
                        {Math.round(strength.score)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.weaknesses.slice(0, 3).map((weakness, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{weakness.skill}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          weakness.priority === 'high' ? 'text-red-600' :
                          weakness.priority === 'medium' ? 'text-orange-600' :
                          'text-yellow-600'
                        }
                      >
                        {weakness.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Quick Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.recommendations.slice(0, 4).map((rec, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">{rec.area}</h4>
                    <p className="text-sm text-gray-600">{rec.actions[0]}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {rec.timeline}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strengths Tab */}
        <TabsContent value="strengths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.strengths.map((strength, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{strength.skill}</h3>
                      <div className="flex items-center gap-2">
                        <Progress value={strength.score} className="w-20" />
                        <span className="text-sm font-medium">{Math.round(strength.score)}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{strength.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Improvement Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feedback.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{rec.area}</h3>
                      <Badge 
                        variant="outline"
                        className={
                          rec.priority === 'high' ? 'text-red-600' :
                          rec.priority === 'medium' ? 'text-orange-600' :
                          'text-yellow-600'
                        }
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Action Steps:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Resources:</h4>
                        <div className="flex flex-wrap gap-2">
                          {rec.resources.map((resource, resourceIndex) => (
                            <Badge key={resourceIndex} variant="outline" className="text-xs">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        Timeline: {rec.timeline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Skill Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.skillBreakdown && (
                <div className="space-y-4">
                  {Object.entries(feedback.skillBreakdown).map(([skill, data]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill}</span>
                        <span className="text-sm text-gray-600">{Math.round(data.average)}%</span>
                      </div>
                      <Progress value={data.average} className="h-2" />
                      <div className="text-xs text-gray-500">
                        Range: {Math.round(data.min)}% - {Math.round(data.max)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Performance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performanceTracking.trends && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {performanceTracking.trends.recentAverage}
                      </div>
                      <div className="text-sm text-gray-600">Recent Average</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">
                        {performanceTracking.trends.previousAverage}
                      </div>
                      <div className="text-sm text-gray-600">Previous Average</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${
                        performanceTracking.improvement?.direction === 'improved' ? 'text-green-600' :
                        performanceTracking.improvement?.direction === 'declined' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {performanceTracking.improvement?.points > 0 ? '+' : ''}
                        {performanceTracking.improvement?.points || 0}
                      </div>
                      <div className="text-sm text-gray-600">Overall Change</div>
                    </div>
                  </div>

                  {performanceTracking.history.length > 1 && (
                    <div>
                      <h4 className="font-medium mb-3">Recent Sessions</h4>
                      <div className="space-y-2">
                        {performanceTracking.history.slice(-5).map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                            <Badge variant="outline">{session.score}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onRetakeInterview} className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Practice Again
        </Button>
        
        {onViewHistory && (
          <Button onClick={onViewHistory} variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View History
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewFeedback;