import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Award, 
  Eye, 
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

export function InteractiveScoreChart({ scoreData, className = '' }) {
  const [viewMode, setViewMode] = useState('overview');
  const [animatedScores, setAnimatedScores] = useState({});
  const [hoveredSection, setHoveredSection] = useState(null);

  const pillars = scoreData?.pillars || {};
  
  const pillarData = [
    {
      id: 'core_skills',
      name: 'Skills Match',
      score: pillars.core_skills?.score || 0,
      maxScore: 40,
      color: '#3B82F6',
      icon: Target,
      description: 'How well your skills align with job requirements',
      details: pillars.core_skills?.matched || []
    },
    {
      id: 'relevant_experience',
      name: 'Experience',
      score: pillars.relevant_experience?.score || 0,
      maxScore: 30,
      color: '#10B981',
      icon: TrendingUp,
      description: 'Relevance and depth of your work experience',
      details: pillars.relevant_experience?.evidence || []
    },
    {
      id: 'tools_methodologies',
      name: 'Tools & Methods',
      score: pillars.tools_methodologies?.score || 0,
      maxScore: 20,
      color: '#F59E0B',
      icon: Zap,
      description: 'Technical tools and methodologies expertise',
      details: pillars.tools_methodologies?.matched || []
    },
    {
      id: 'education_credentials',
      name: 'Education',
      score: pillars.education_credentials?.score || 0,
      maxScore: 10,
      color: '#8B5CF6',
      icon: Award,
      description: 'Educational background and certifications',
      details: [pillars.education_credentials?.degree || 'Not specified']
    }
  ];

  // Animate scores on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      pillarData.forEach((pillar, index) => {
        setTimeout(() => {
          setAnimatedScores(prev => ({
            ...prev,
            [pillar.id]: pillar.score
          }));
        }, index * 200);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Prepare chart data
  const pieData = pillarData.map(pillar => ({
    name: pillar.name,
    value: animatedScores[pillar.id] || 0,
    maxValue: pillar.maxScore,
    color: pillar.color,
    percentage: Math.round(((animatedScores[pillar.id] || 0) / pillar.maxScore) * 100)
  }));

  const barData = pillarData.map(pillar => ({
    name: pillar.name.split(' ')[0], // Shortened name for bar chart
    score: animatedScores[pillar.id] || 0,
    maxScore: pillar.maxScore,
    fill: pillar.color
  }));

  const radialData = pillarData.map(pillar => ({
    name: pillar.name,
    value: animatedScores[pillar.id] || 0,
    maxValue: pillar.maxScore,
    fill: pillar.color
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Score: <span className="font-bold" style={{ color: data.color }}>
              {data.value}/{data.payload.maxScore}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {Math.round((data.value / data.payload.maxScore) * 100)}% of maximum
          </p>
        </div>
      );
    }
    return null;
  };

  const ViewModeButton = ({ mode, icon: Icon, label, isActive }) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={() => setViewMode(mode)}
      className={`flex items-center gap-2 ${isActive ? 'bg-primary' : ''}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Score Breakdown
          </CardTitle>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <ViewModeButton 
              mode="overview" 
              icon={Eye} 
              label="Overview" 
              isActive={viewMode === 'overview'} 
            />
            <ViewModeButton 
              mode="detailed" 
              icon={BarChart3} 
              label="Detailed" 
              isActive={viewMode === 'detailed'} 
            />
            <ViewModeButton 
              mode="radial" 
              icon={PieChartIcon} 
              label="Radial" 
              isActive={viewMode === 'radial'} 
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Overall Score Circle */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative w-32 h-32 mx-auto mb-4"
                >
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted-foreground/20"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: (scoreData?.overall_score || 0) / 100 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      style={{
                        strokeDasharray: "351.86",
                        strokeDashoffset: 0
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className="text-2xl font-bold text-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        {scoreData?.overall_score || 0}
                      </motion.div>
                      <div className="text-xs text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </motion.div>
                
                <Badge variant="outline" className="text-sm">
                  Overall ATS Score
                </Badge>
              </div>

              {/* Pillar Cards */}
              <div className="grid grid-cols-2 gap-4">
                {pillarData.map((pillar, index) => {
                  const Icon = pillar.icon;
                  const percentage = Math.round((pillar.score / pillar.maxScore) * 100);
                  
                  return (
                    <motion.div
                      key={pillar.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-br from-background to-muted/50 rounded-lg border cursor-pointer"
                      onMouseEnter={() => setHoveredSection(pillar.id)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                        <Badge variant="secondary" className="text-xs">
                          {animatedScores[pillar.id] || 0}/{pillar.maxScore}
                        </Badge>
                      </div>
                      
                      <h4 className="font-medium text-sm mb-1">{pillar.name}</h4>
                      
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: pillar.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {percentage}% match
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {viewMode === 'detailed' && (
            <motion.div
              key="detailed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Bar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                {pillarData.map((pillar, index) => {
                  const Icon = pillar.icon;
                  const isHovered = hoveredSection === pillar.id;
                  
                  return (
                    <motion.div
                      key={pillar.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isHovered ? 'bg-muted/50 border-primary/50' : 'bg-background'
                      }`}
                      onMouseEnter={() => setHoveredSection(pillar.id)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${pillar.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{pillar.name}</h4>
                            <Badge style={{ backgroundColor: pillar.color, color: 'white' }}>
                              {animatedScores[pillar.id] || 0}/{pillar.maxScore}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {pillar.description}
                          </p>
                          
                          {pillar.details.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">
                                Details:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {pillar.details.slice(0, 5).map((detail, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {detail}
                                  </Badge>
                                ))}
                                {pillar.details.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{pillar.details.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {viewMode === 'radial' && (
            <motion.div
              key="radial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  data={radialData}
                >
                  <RadialBar 
                    dataKey="value" 
                    cornerRadius={10} 
                    fill="#8884d8" 
                  />
                  <Legend 
                    iconSize={10} 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}