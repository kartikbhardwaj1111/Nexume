/**
 * CareerRoadmap - Interactive career progression visualization using React Flow
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  Circle, 
  Star,
  TrendingUp,
  BookOpen,
  Award
} from 'lucide-react';

// Custom node components
const CareerLevelNode = ({ data }) => {
  const { level, title, skills, salary, isCompleted, isCurrent, isTarget, progress } = data;
  
  const getNodeStyle = () => {
    if (isCompleted) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    if (isCurrent) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    if (isTarget) return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
    return 'border-gray-300 bg-white dark:bg-gray-800';
  };

  const getIcon = () => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isCurrent) return <Target className="w-5 h-5 text-blue-500" />;
    if (isTarget) return <Star className="w-5 h-5 text-purple-500" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  return (
    <Card className={`w-64 ${getNodeStyle()} transition-all duration-200 hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {getIcon()}
          <Badge variant={isCompleted ? 'default' : 'secondary'}>
            {level}
          </Badge>
        </div>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Skills: {skills.slice(0, 3).join(', ')}
            {skills.length > 3 && ` +${skills.length - 3} more`}
          </div>
          {salary && (
            <div className="text-xs font-medium text-green-600 dark:text-green-400">
              ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}
            </div>
          )}
          {progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SkillNode = ({ data }) => {
  const { skill, proficiency, isRequired, isMissing, estimatedHours } = data;
  
  const getNodeStyle = () => {
    if (isMissing) return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    if (isRequired) return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
    return 'border-green-500 bg-green-50 dark:bg-green-900/20';
  };

  const getProficiencyColor = (level) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`w-48 ${getNodeStyle()} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium truncate">{skill}</h4>
            <Badge variant="outline" className="text-xs">
              {isMissing ? 'Missing' : isRequired ? 'Improve' : 'Strong'}
            </Badge>
          </div>
          {!isMissing && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Level:</span>
              <div className={`text-xs font-medium ${getProficiencyColor(proficiency)}`}>
                {proficiency}/5
              </div>
            </div>
          )}
          {estimatedHours && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{estimatedHours}h to learn</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MilestoneNode = ({ data }) => {
  const { title, description, isCompleted, estimatedWeeks, skills } = data;
  
  return (
    <Card className={`w-56 ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <Trophy className="w-4 h-4 text-green-500" />
            ) : (
              <Award className="w-4 h-4 text-blue-500" />
            )}
            <h4 className="text-sm font-medium">{title}</h4>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{estimatedWeeks} weeks</span>
            <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
              {skills.length} skills
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Node types
const nodeTypes = {
  careerLevel: CareerLevelNode,
  skill: SkillNode,
  milestone: MilestoneNode,
};

const CareerRoadmap = ({ 
  careerPath, 
  currentLevel, 
  targetLevel, 
  skillsGapAnalysis, 
  milestones,
  onNodeClick,
  className = ""
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedView, setSelectedView] = useState('career'); // 'career', 'skills', 'milestones'

  // Generate nodes and edges based on selected view
  const generateCareerNodes = useCallback(() => {
    if (!careerPath) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];
    let yPosition = 0;

    Object.entries(careerPath.levels).forEach(([level, data], index) => {
      const isCompleted = index < Object.keys(careerPath.levels).indexOf(currentLevel);
      const isCurrent = level === currentLevel;
      const isTarget = level === targetLevel;
      
      nodes.push({
        id: `career-${level}`,
        type: 'careerLevel',
        position: { x: 300, y: yPosition },
        data: {
          level: level.charAt(0).toUpperCase() + level.slice(1),
          title: data.title,
          skills: data.skills,
          salary: data.salaryRange ? { 
            min: data.salaryRange[0], 
            max: data.salaryRange[1] 
          } : null,
          isCompleted,
          isCurrent,
          isTarget,
          progress: isCompleted ? 100 : (isCurrent ? 50 : 0)
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      // Add edge to next level
      if (index < Object.keys(careerPath.levels).length - 1) {
        const nextLevel = Object.keys(careerPath.levels)[index + 1];
        edges.push({
          id: `career-edge-${level}-${nextLevel}`,
          source: `career-${level}`,
          target: `career-${nextLevel}`,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            strokeWidth: 2,
            stroke: isCompleted ? '#10b981' : '#6b7280',
          },
        });
      }

      yPosition += 200;
    });

    return { nodes, edges };
  }, [careerPath, currentLevel, targetLevel]);

  const generateSkillsNodes = useCallback(() => {
    if (!skillsGapAnalysis) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];
    let xPosition = 0;
    let yPosition = 0;

    // Add current skills
    skillsGapAnalysis.strengthSkills?.forEach((skill, index) => {
      nodes.push({
        id: `skill-strength-${index}`,
        type: 'skill',
        position: { x: xPosition, y: yPosition },
        data: {
          skill: skill.name,
          proficiency: skill.proficiency,
          isRequired: false,
          isMissing: false,
        },
      });
      
      xPosition += 200;
      if ((index + 1) % 3 === 0) {
        xPosition = 0;
        yPosition += 120;
      }
    });

    // Add skills to improve
    yPosition += 150;
    xPosition = 0;
    skillsGapAnalysis.skillsToImprove?.forEach((skill, index) => {
      nodes.push({
        id: `skill-improve-${index}`,
        type: 'skill',
        position: { x: xPosition, y: yPosition },
        data: {
          skill: skill.name,
          proficiency: skill.proficiency,
          isRequired: true,
          isMissing: false,
          estimatedHours: skill.estimatedLearningTime,
        },
      });
      
      xPosition += 200;
      if ((index + 1) % 3 === 0) {
        xPosition = 0;
        yPosition += 120;
      }
    });

    // Add missing skills
    yPosition += 150;
    xPosition = 0;
    skillsGapAnalysis.missingSkills?.forEach((skill, index) => {
      nodes.push({
        id: `skill-missing-${index}`,
        type: 'skill',
        position: { x: xPosition, y: yPosition },
        data: {
          skill: skill.name,
          proficiency: 0,
          isRequired: false,
          isMissing: true,
          estimatedHours: skill.estimatedLearningTime,
        },
      });
      
      xPosition += 200;
      if ((index + 1) % 3 === 0) {
        xPosition = 0;
        yPosition += 120;
      }
    });

    return { nodes, edges };
  }, [skillsGapAnalysis]);

  const generateMilestonesNodes = useCallback(() => {
    if (!milestones) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];
    let yPosition = 0;

    milestones.forEach((milestone, index) => {
      nodes.push({
        id: `milestone-${milestone.id}`,
        type: 'milestone',
        position: { x: 300, y: yPosition },
        data: {
          title: milestone.title,
          description: milestone.description,
          isCompleted: milestone.isCompleted || false,
          estimatedWeeks: milestone.estimatedWeeks,
          skills: milestone.skills || [],
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      // Add edge to next milestone
      if (index < milestones.length - 1) {
        edges.push({
          id: `milestone-edge-${milestone.id}-${milestones[index + 1].id}`,
          source: `milestone-${milestone.id}`,
          target: `milestone-${milestones[index + 1].id}`,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            strokeWidth: 2,
            stroke: milestone.isCompleted ? '#10b981' : '#6b7280',
          },
        });
      }

      yPosition += 180;
    });

    return { nodes, edges };
  }, [milestones]);

  // Update nodes and edges when view changes
  useEffect(() => {
    let nodeData;
    
    switch (selectedView) {
      case 'career':
        nodeData = generateCareerNodes();
        break;
      case 'skills':
        nodeData = generateSkillsNodes();
        break;
      case 'milestones':
        nodeData = generateMilestonesNodes();
        break;
      default:
        nodeData = { nodes: [], edges: [] };
    }
    
    setNodes(nodeData.nodes);
    setEdges(nodeData.edges);
  }, [selectedView, generateCareerNodes, generateSkillsNodes, generateMilestonesNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event, node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  return (
    <div className={`w-full h-full ${className}`}>
      {/* View Controls */}
      <div className="flex items-center space-x-2 mb-4 p-4 bg-white dark:bg-gray-800 border-b">
        <Button
          variant={selectedView === 'career' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('career')}
          className="flex items-center space-x-1"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Career Path</span>
        </Button>
        <Button
          variant={selectedView === 'skills' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('skills')}
          className="flex items-center space-x-1"
        >
          <BookOpen className="w-4 h-4" />
          <span>Skills Gap</span>
        </Button>
        <Button
          variant={selectedView === 'milestones' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('milestones')}
          className="flex items-center space-x-1"
        >
          <Award className="w-4 h-4" />
          <span>Milestones</span>
        </Button>
      </div>

      {/* React Flow */}
      <div className="flex-1 h-96">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.type === 'careerLevel') return '#3b82f6';
              if (n.type === 'skill') return '#10b981';
              if (n.type === 'milestone') return '#8b5cf6';
              return '#6b7280';
            }}
            nodeColor={(n) => {
              if (n.data?.isCompleted) return '#10b981';
              if (n.data?.isCurrent) return '#3b82f6';
              if (n.data?.isTarget) return '#8b5cf6';
              return '#6b7280';
            }}
            nodeBorderRadius={2}
          />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t">
        <div className="flex flex-wrap items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-purple-500" />
            <span>Target</span>
          </div>
          <div className="flex items-center space-x-1">
            <Circle className="w-4 h-4 text-gray-400" />
            <span>Future</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;