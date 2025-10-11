/**
 * SkillsGapChart - Interactive skills gap visualization with progress tracking
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Radar as RadarIcon,
  Dot as ScatterIcon
} from 'lucide-react';

const SkillsGapChart = ({
  skillsGapAnalysis,
  onSkillClick,
  showProgress = true,
  className = ""
}) => {
  const [selectedView, setSelectedView] = useState('bar'); // 'bar', 'radar', 'scatter'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'technical', 'soft', 'domain'

  // Process data for different chart types
  const chartData = useMemo(() => {
    if (!skillsGapAnalysis) return { bar: [], radar: [], scatter: [] };

    const allSkills = [
      ...(skillsGapAnalysis.strengthSkills || []).map(skill => ({
        ...skill,
        type: 'strength',
        gap: 0,
        priority: 'low'
      })),
      ...(skillsGapAnalysis.skillsToImprove || []).map(skill => ({
        ...skill,
        type: 'improve',
        gap: skill.targetProficiency - skill.proficiency,
        priority: skill.improvementNeeded >= 2 ? 'high' : 'medium'
      })),
      ...(skillsGapAnalysis.missingSkills || []).map(skill => ({
        ...skill,
        type: 'missing',
        proficiency: 0,
        gap: 5,
        priority: skill.importance >= 7 ? 'high' : 'medium'
      }))
    ];

    // Filter by category if selected
    const filteredSkills = selectedCategory === 'all'
      ? allSkills
      : allSkills.filter(skill => skill.category === selectedCategory);

    // Bar chart data
    const barData = filteredSkills.map(skill => ({
      name: skill.name.length > 15 ? skill.name.substring(0, 15) + '...' : skill.name,
      fullName: skill.name,
      current: skill.proficiency || 0,
      target: skill.type === 'missing' ? 5 : (skill.targetProficiency || 5),
      gap: skill.gap,
      type: skill.type,
      priority: skill.priority,
      estimatedHours: skill.estimatedLearningTime || 0,
      category: skill.category
    }));

    // Radar chart data (top 8 skills for readability)
    const radarData = filteredSkills.slice(0, 8).map(skill => ({
      skill: skill.name.length > 12 ? skill.name.substring(0, 12) + '...' : skill.name,
      fullName: skill.name,
      current: skill.proficiency || 0,
      target: skill.type === 'missing' ? 5 : (skill.targetProficiency || 5),
      type: skill.type
    }));

    // Scatter chart data (importance vs proficiency)
    const scatterData = filteredSkills.map(skill => ({
      x: skill.proficiency || 0,
      y: skill.importance || 5,
      name: skill.name,
      type: skill.type,
      priority: skill.priority,
      estimatedHours: skill.estimatedLearningTime || 0,
      gap: skill.gap
    }));

    return { bar: barData, radar: radarData, scatter: scatterData };
  }, [skillsGapAnalysis, selectedCategory]);

  // Color schemes for different skill types
  const getSkillColor = (type, priority) => {
    switch (type) {
      case 'strength':
        return '#10b981'; // green
      case 'improve':
        return priority === 'high' ? '#f59e0b' : '#eab308'; // orange/yellow
      case 'missing':
        return priority === 'high' ? '#ef4444' : '#f97316'; // red/orange
      default:
        return '#6b7280'; // gray
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Custom tooltip components
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current: {data.current}/5
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Target: {data.target}/5
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gap: {data.gap} levels
          </p>
          {data.estimatedHours > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Est. Learning: {data.estimatedHours}h
            </p>
          )}
          <Badge className={`text-xs mt-1 ${getPriorityColor(data.priority)}`}>
            {data.priority} priority
          </Badge>
        </div>
      );
    }
    return null;
  };

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Proficiency: {data.x}/5
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Importance: {data.y}/10
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gap: {data.gap} levels
          </p>
          {data.estimatedHours > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Est. Learning: {data.estimatedHours}h
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Skills summary statistics
  const skillsSummary = useMemo(() => {
    if (!skillsGapAnalysis) return null;

    const totalSkills = (skillsGapAnalysis.strengthSkills?.length || 0) +
      (skillsGapAnalysis.skillsToImprove?.length || 0) +
      (skillsGapAnalysis.missingSkills?.length || 0);

    const strengthCount = skillsGapAnalysis.strengthSkills?.length || 0;
    const improveCount = skillsGapAnalysis.skillsToImprove?.length || 0;
    const missingCount = skillsGapAnalysis.missingSkills?.length || 0;

    const totalLearningHours = [
      ...(skillsGapAnalysis.skillsToImprove || []),
      ...(skillsGapAnalysis.missingSkills || [])
    ].reduce((total, skill) => total + (skill.estimatedLearningTime || 0), 0);

    const completionPercentage = totalSkills > 0 ? Math.round((strengthCount / totalSkills) * 100) : 0;

    return {
      totalSkills,
      strengthCount,
      improveCount,
      missingCount,
      totalLearningHours,
      completionPercentage
    };
  }, [skillsGapAnalysis]);

  if (!skillsGapAnalysis) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No skills gap analysis available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Skills Summary */}
      {skillsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{skillsSummary.strengthCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Strong Skills</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{skillsSummary.improveCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">To Improve</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{skillsSummary.missingCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Missing Skills</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{skillsSummary.totalLearningHours}h</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learning Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Overview */}
      {showProgress && skillsSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Skills Completion Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{skillsSummary.completionPercentage}%</span>
              </div>
              <Progress value={skillsSummary.completionPercentage} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {skillsSummary.strengthCount} of {skillsSummary.totalSkills} skills at target level
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle>Skills Gap Analysis</CardTitle>
            <div className="flex items-center space-x-2">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 text-sm border rounded-md bg-white dark:bg-gray-800"
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="soft">Soft Skills</option>
                <option value="domain">Domain</option>
                <option value="tools">Tools</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center space-x-1">
                <Button
                  variant={selectedView === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('bar')}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedView === 'radar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('radar')}
                >
                  <RadarIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedView === 'scatter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedView('scatter')}
                >
                  <ScatterIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {selectedView === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.bar} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="current"
                    name="Current Level"
                    fill="#3b82f6"
                    onClick={(data) => onSkillClick && onSkillClick(data)}
                    style={{ cursor: onSkillClick ? 'pointer' : 'default' }}
                  />
                  <Bar
                    dataKey="target"
                    name="Target Level"
                    fill="#10b981"
                    opacity={0.6}
                    onClick={(data) => onSkillClick && onSkillClick(data)}
                    style={{ cursor: onSkillClick ? 'pointer' : 'default' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            {selectedView === 'radar' && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData.radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" fontSize={12} />
                  <PolarRadiusAxis domain={[0, 5]} fontSize={10} />
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Target Level"
                    dataKey="target"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            )}

            {selectedView === 'scatter' && (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={chartData.scatter} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Proficiency"
                    domain={[0, 5]}
                    label={{ value: 'Current Proficiency', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Importance"
                    domain={[0, 10]}
                    label={{ value: 'Importance', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomScatterTooltip />} />
                  <Scatter name="Skills" data={chartData.scatter}>
                    {chartData.scatter.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getSkillColor(entry.type, entry.priority)}
                        onClick={() => onSkillClick && onSkillClick(entry)}
                        style={{ cursor: onSkillClick ? 'pointer' : 'default' }}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills Priority List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Learning Priority</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="high" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="high">High Priority</TabsTrigger>
              <TabsTrigger value="medium">Medium Priority</TabsTrigger>
              <TabsTrigger value="low">Low Priority</TabsTrigger>
            </TabsList>

            {['high', 'medium', 'low'].map(priority => (
              <TabsContent key={priority} value={priority} className="space-y-2">
                {skillsGapAnalysis.priority?.[priority]?.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => onSkillClick && onSkillClick(skill)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{skill.name}</h4>
                        <Badge className={getPriorityColor(priority)}>
                          {skill.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.type === 'missing'
                          ? 'Need to learn from scratch'
                          : `Improve from ${skill.proficiency}/5 to ${skill.targetProficiency || 5}/5`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{skill.estimatedLearningTime || 0}h</p>
                      <p className="text-xs text-gray-500">Est. time</p>
                    </div>
                  </div>
                ))}

                {(!skillsGapAnalysis.priority?.[priority] || skillsGapAnalysis.priority[priority].length === 0) && (
                  <p className="text-center text-gray-500 py-4">
                    No {priority} priority skills
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsGapChart;