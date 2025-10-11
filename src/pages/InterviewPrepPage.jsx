/**
 * Interview Preparation Dashboard
 * Comprehensive interview preparation with company-specific preparation,
 * practice session history, and interview tips library
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import MockInterview from '../components/MockInterview';
import InterviewFeedback from '../components/InterviewFeedback';
import {
    Play,
    Target,
    BookOpen,
    TrendingUp,
    Clock,
    Award,
    Users,
    Building,
    Lightbulb,
    BarChart3,
    Search,
    Filter,
    Calendar,
    CheckCircle,
    Star
} from 'lucide-react';
import { toast } from 'sonner';

// Import interview services
import {
    questionManager,
    sessionManager,
    interviewEvaluator
} from '../services/interview/index.js';

const InterviewPrepPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentInterview, setCurrentInterview] = useState(null);
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
    const [searchQuery, setSearchQuery] = useState('');
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);

    // Load data on component mount
    useEffect(() => {
        loadInterviewHistory();
        loadPracticeQuestions();
    }, []);

    const loadInterviewHistory = () => {
        const history = sessionManager.getSessionHistory({ status: 'completed' });
        setInterviewHistory(history);
    };

    const loadPracticeQuestions = () => {
        const questions = questionManager.getQuestions({
            limit: 20,
            shuffle: true
        });
        setPracticeQuestions(questions);
    };

    // Start new interview
    const startInterview = (config = {}) => {
        const interviewConfig = {
            role: selectedRole || 'general',
            company: selectedCompany || null,
            difficulty: [selectedDifficulty],
            duration: config.duration || 30,
            allowSkip: true,
            recordAudio: false,
            ...config
        };

        const session = sessionManager.createSession(interviewConfig);
        sessionManager.startSession(session.id);
        setCurrentInterview(session);
        setActiveTab('interview');

        toast.success('Interview started! Good luck!');
    };

    // Handle interview completion
    const handleInterviewComplete = async (completedSession) => {
        try {
            // Evaluate the session
            const evaluation = await interviewEvaluator.evaluateSession(completedSession);
            setCurrentEvaluation(evaluation);
            setCurrentInterview(null);
            setActiveTab('feedback');

            // Reload history
            loadInterviewHistory();

            toast.success('Interview completed! View your feedback.');
        } catch (error) {
            console.error('Error evaluating interview:', error);
            toast.error('Error processing interview results.');
        }
    };

    // Get company-specific preparation
    const getCompanyPrep = (company) => {
        return questionManager.getQuestionsByCompany(company, { limit: 10 });
    };

    // Get role-specific questions
    const getRoleQuestions = (role) => {
        return questionManager.getQuestionsByRole(role, { limit: 15 });
    };

    // Calculate statistics
    const getStatistics = () => {
        const completedSessions = interviewHistory.length;
        const averageScore = completedSessions > 0
            ? Math.round(interviewHistory.reduce((sum, session) => sum + (session.overallScore || 0), 0) / completedSessions)
            : 0;

        const recentSessions = interviewHistory.slice(-5);
        const improvement = recentSessions.length > 1
            ? recentSessions[recentSessions.length - 1].overallScore - recentSessions[0].overallScore
            : 0;

        return {
            completedSessions,
            averageScore,
            improvement,
            totalQuestions: interviewHistory.reduce((sum, session) => sum + (session.answeredQuestions || 0), 0)
        };
    };

    const stats = getStatistics();

    // Popular companies for quick selection
    const popularCompanies = [
        'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Netflix', 'Tesla', 'Uber'
    ];

    // Popular roles
    const popularRoles = [
        'frontend-developer', 'backend-developer', 'fullstack-developer',
        'data-scientist', 'devops-engineer', 'product-manager'
    ];

    // Interview tips by category
    const interviewTips = {
        preparation: [
            'Research the company thoroughly - mission, values, recent news',
            'Review the job description and match your experience to requirements',
            'Prepare specific examples using the STAR method',
            'Practice common questions out loud',
            'Prepare thoughtful questions to ask the interviewer'
        ],
        technical: [
            'Explain your thought process step by step',
            'Start with a simple solution, then optimize',
            'Consider edge cases and error handling',
            'Ask clarifying questions before coding',
            'Test your solution with examples'
        ],
        behavioral: [
            'Use the STAR method: Situation, Task, Action, Result',
            'Choose examples that highlight relevant skills',
            'Be specific about your role and contributions',
            'Focus on what you learned and how you grew',
            'Practice your stories beforehand'
        ],
        communication: [
            'Maintain eye contact and good posture',
            'Speak clearly and at an appropriate pace',
            'Listen actively to the full question',
            'Ask for clarification if needed',
            'Show enthusiasm and genuine interest'
        ]
    };

    if (currentInterview) {
        return (
            <Layout customBreadcrumbs={[
                { path: '/', label: 'Home' },
                { path: '/interview-prep', label: 'Interview Prep' },
                { path: '/interview-prep', label: 'Mock Interview' }
            ]}>
                <div className="bg-gradient-to-br from-black via-gray-900 to-green-900/20">
                <div className="container mx-auto px-4 py-8">
                    <MockInterview
                        questions={currentInterview.questions}
                        config={currentInterview.config}
                        onComplete={handleInterviewComplete}
                        onQuestionComplete={(response, index) => {
                            console.log('Question completed:', index, response);
                        }}
                        onSessionUpdate={(sessionData) => {
                            console.log('Session updated:', sessionData);
                        }}
                    />
                </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout customBreadcrumbs={[
            { path: '/', label: 'Home' },
            { path: '/interview-prep', label: 'Interview Prep' }
        ]}>
            <div className="bg-gradient-to-br from-black via-gray-900 to-green-900/20">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Interview Preparation</h1>
                    <p className="text-gray-600">
                        Practice interviews, get feedback, and improve your skills with our comprehensive preparation platform.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="practice">Practice</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="tips">Tips & Guides</TabsTrigger>
                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.completedSessions}</div>
                                    <div className="text-sm text-gray-600">Interviews Completed</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.averageScore}%</div>
                                    <div className="text-sm text-gray-600">Average Score</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                                    </div>
                                    <div className="text-sm text-gray-600">Recent Improvement</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                                    <div className="text-sm text-gray-600">Questions Answered</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Start Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Play className="h-5 w-5" />
                                    Quick Start Interview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Role</label>
                                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {popularRoles.map(role => (
                                                    <SelectItem key={role} value={role}>
                                                        {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {popularCompanies.map(company => (
                                                    <SelectItem key={company} value={company.toLowerCase()}>
                                                        {company}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button onClick={() => startInterview({ duration: 15 })} className="flex-1">
                                        <Play className="h-4 w-4 mr-2" />
                                        Quick Practice (15 min)
                                    </Button>
                                    <Button onClick={() => startInterview({ duration: 30 })} variant="outline" className="flex-1">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Standard Interview (30 min)
                                    </Button>
                                    <Button onClick={() => startInterview({ duration: 60 })} variant="outline" className="flex-1">
                                        <Target className="h-4 w-4 mr-2" />
                                        Full Interview (60 min)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {interviewHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {interviewHistory.slice(0, 5).map((session, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium">
                                                        {session.config?.role?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'General'} Interview
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(session.metadata.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="mb-1">
                                                        {session.overallScore || 0}% Score
                                                    </Badge>
                                                    <div className="text-xs text-gray-600">
                                                        {session.metadata.answeredQuestions || 0} questions
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No interview history yet. Start your first practice session!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Practice Tab */}
                    <TabsContent value="practice" className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Company-Specific Prep */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Company-Specific Preparation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        {popularCompanies.map(company => (
                                            <Button
                                                key={company}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCompany(company.toLowerCase());
                                                    startInterview({ company: company.toLowerCase(), duration: 30 });
                                                }}
                                            >
                                                {company}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Role-Specific Practice */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Role-Specific Practice
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {popularRoles.map(role => (
                                            <Button
                                                key={role}
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    setSelectedRole(role);
                                                    startInterview({ role, duration: 30 });
                                                }}
                                            >
                                                {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Practice Questions Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Practice Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {practiceQuestions.slice(0, 5).map((question, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline">{question.type}</Badge>
                                                <Badge variant="outline">{question.difficulty}</Badge>
                                                {question.category && (
                                                    <Badge variant="outline">{question.category}</Badge>
                                                )}
                                            </div>
                                            <p className="font-medium mb-2">{question.question}</p>
                                            {question.evaluationCriteria && (
                                                <div className="text-sm text-gray-600">
                                                    <strong>Consider:</strong> {question.evaluationCriteria.slice(0, 2).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Interview History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {interviewHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        {interviewHistory.map((session, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {session.config?.role?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'General'} Interview
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(session.metadata.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge variant="outline" className="text-lg">
                                                            {session.overallScore || 0}%
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Questions:</span> {session.metadata.answeredQuestions || 0}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Duration:</span> {Math.round((session.metadata.sessionDuration || 0) / 60)}m
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Company:</span> {session.config?.company || 'General'}
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-3"
                                                    onClick={() => {
                                                        // Load evaluation for this session
                                                        setCurrentEvaluation(session.evaluation);
                                                        setActiveTab('feedback');
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No interview history available.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tips & Guides Tab */}
                    <TabsContent value="tips" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {Object.entries(interviewTips).map(([category, tips]) => (
                                <Card key={category}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 capitalize">
                                            <Lightbulb className="h-5 w-5" />
                                            {category.replace(/([A-Z])/g, ' $1')} Tips
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {tips.map((tip, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Best Practices */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Interview Best Practices
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-3">Before the Interview</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Get a good night's sleep</li>
                                            <li>• Test your technology setup</li>
                                            <li>• Prepare your workspace</li>
                                            <li>• Review your resume and examples</li>
                                            <li>• Research the interviewer if possible</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3">During the Interview</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Arrive 5-10 minutes early</li>
                                            <li>• Make a strong first impression</li>
                                            <li>• Listen carefully to questions</li>
                                            <li>• Take notes if appropriate</li>
                                            <li>• Ask thoughtful questions</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Feedback Tab */}
                    <TabsContent value="feedback">
                        {currentEvaluation ? (
                            <InterviewFeedback
                                evaluation={currentEvaluation}
                                onRetakeInterview={() => {
                                    setCurrentEvaluation(null);
                                    setActiveTab('practice');
                                }}
                                onViewHistory={() => setActiveTab('history')}
                            />
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Complete an interview to see your feedback and analysis.</p>
                                    <Button
                                        onClick={() => setActiveTab('practice')}
                                        className="mt-4"
                                    >
                                        Start Practice Interview
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
            </div>
        </Layout>
    );
};

export default InterviewPrepPage;