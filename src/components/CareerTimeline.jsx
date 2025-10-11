/**
 * CareerTimeline - Interactive career progression timeline with milestone markers
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar,
  Target,
  Trophy,
  BookOpen,
  TrendingUp,
  MapPin,
  ChevronRight,
  ChevronDown,
  Star,
  Award
} from 'lucide-react';

const TimelineItem = ({ 
  milestone, 
  isCompleted, 
  isCurrent, 
  isUpcoming, 
  onToggleExpand,
  isExpanded,
  onMilestoneClick 
}) => {
  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (isCurrent) return <Target className="w-6 h-6 text-blue-500" />;
    return <Circle className="w-6 h-6 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (isCompleted) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    if (isCurrent) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
  };

  return (
    <div className="relative">
      {/* Timeline connector */}
      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-300 dark:bg-gray-600" />
      
      <Card className={`ml-16 ${getStatusColor()} transition-all duration-200 hover:shadow-md`}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => onToggleExpand && onToggleExpand(milestone.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="absolute -left-10 bg-white dark:bg-gray-800 rounded-full p-1">
                {getStatusIcon()}
              </div>
              <div>
                <CardTitle className="text-lg">{milestone.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {milestone.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {milestone.estimatedWeeks && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{milestone.estimatedWeeks} weeks</span>
                </Badge>
              )}
              {onToggleExpand && (
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Progress */}
              {milestone.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
                </div>
              )}
              
              {/* Skills */}
              {milestone.skills && milestone.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Skills ({milestone.skills.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {milestone.skills.slice(0, 6).map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => onMilestoneClick && onMilestoneClick(milestone, 'skill', skill)}
                      >
                        {typeof skill === 'string' ? skill : skill.name}
                      </Badge>
                    ))}
                    {milestone.skills.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{milestone.skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Completion Criteria */}
              {milestone.completionCriteria && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>Completion Criteria</span>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {milestone.completionCriteria}
                  </p>
                </div>
              )}
              
              {/* Timeline */}
              {milestone.startDate && (
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {new Date(milestone.startDate).toLocaleDateString()}</span>
                  </div>
                  {milestone.endDate && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Target: {new Date(milestone.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2">
                {!isCompleted && (
                  <Button 
                    size="sm" 
                    onClick={() => onMilestoneClick && onMilestoneClick(milestone, 'start')}
                  >
                    {isCurrent ? 'Continue' : 'Start'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onMilestoneClick && onMilestoneClick(milestone, 'details')}
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

const CareerTimeline = ({ 
  milestones = [], 
  currentMilestone,
  completedMilestones = [],
  onMilestoneClick,
  showProgress = true,
  className = ""
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set([currentMilestone]));
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'current', 'upcoming'

  // Process milestones with status
  const processedMilestones = useMemo(() => {
    return milestones.map((milestone, index) => {
      const isCompleted = completedMilestones.includes(milestone.id);
      const isCurrent = milestone.id === currentMilestone;
      const isUpcoming = !isCompleted && !isCurrent;
      
      return {
        ...milestone,
        isCompleted,
        isCurrent,
        isUpcoming,
        index
      };
    });
  }, [milestones, currentMilestone, completedMilestones]);

  // Filter milestones based on selected filter
  const filteredMilestones = useMemo(() => {
    switch (filter) {
      case 'completed':
        return processedMilestones.filter(m => m.isCompleted);
      case 'current':
        return processedMilestones.filter(m => m.isCurrent);
      case 'upcoming':
        return processedMilestones.filter(m => m.isUpcoming);
      default:
        return processedMilestones;
    }
  }, [processedMilestones, filter]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (milestones.length === 0) return 0;
    const completedCount = completedMilestones.length;
    const currentProgress = processedMilestones.find(m => m.isCurrent)?.progress || 0;
    const totalProgress = completedCount + (currentProgress / 100);
    return Math.round((totalProgress / milestones.length) * 100);
  }, [milestones.length, completedMilestones.length, processedMilestones]);

  // Timeline statistics
  const timelineStats = useMemo(() => {
    const completed = processedMilestones.filter(m => m.isCompleted).length;
    const current = processedMilestones.filter(m => m.isCurrent).length;
    const upcoming = processedMilestones.filter(m => m.isUpcoming).length;
    
    const totalWeeks = processedMilestones.reduce((total, milestone) => 
      total + (milestone.estimatedWeeks || 0), 0
    );
    
    const completedWeeks = processedMilestones
      .filter(m => m.isCompleted)
      .reduce((total, milestone) => total + (milestone.estimatedWeeks || 0), 0);
    
    return {
      completed,
      current,
      upcoming,
      totalWeeks,
      completedWeeks,
      remainingWeeks: totalWeeks - completedWeeks
    };
  }, [processedMilestones]);

  const handleToggleExpand = (milestoneId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId);
    } else {
      newExpanded.add(milestoneId);
    }
    setExpandedItems(newExpanded);
  };

  const handleMilestoneClick = (milestone, action, data) => {
    if (onMilestoneClick) {
      onMilestoneClick(milestone, action, data);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Timeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{timelineStats.completed}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{timelineStats.current}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Circle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-2xl font-bold">{timelineStats.upcoming}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{timelineStats.remainingWeeks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weeks Left</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      {showProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Career Timeline Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{timelineStats.completed} milestones completed</span>
                <span>{timelineStats.completedWeeks} of {timelineStats.totalWeeks} weeks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Career Milestones</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({milestones.length})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed ({timelineStats.completed})
              </Button>
              <Button
                variant={filter === 'current' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('current')}
              >
                Current ({timelineStats.current})
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('upcoming')}
              >
                Upcoming ({timelineStats.upcoming})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline */}
          <div className="relative space-y-6">
            {filteredMilestones.length > 0 ? (
              filteredMilestones.map((milestone) => (
                <TimelineItem
                  key={milestone.id}
                  milestone={milestone}
                  isCompleted={milestone.isCompleted}
                  isCurrent={milestone.isCurrent}
                  isUpcoming={milestone.isUpcoming}
                  isExpanded={expandedItems.has(milestone.id)}
                  onToggleExpand={handleToggleExpand}
                  onMilestoneClick={handleMilestoneClick}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No milestones found for the selected filter</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => setExpandedItems(new Set(milestones.map(m => m.id)))}
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Expand All
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => setExpandedItems(new Set())}
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Collapse All
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => {
                const currentMilestoneObj = processedMilestones.find(m => m.isCurrent);
                if (currentMilestoneObj) {
                  handleMilestoneClick(currentMilestoneObj, 'focus');
                }
              }}
            >
              <Target className="w-4 h-4 mr-2" />
              Focus Current
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerTimeline;