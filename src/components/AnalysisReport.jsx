import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, TrendingUp, Award, Target, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function AnalysisReport({ content, isLoading, onStartOver }) {
  const [typedContent, setTypedContent] = useState('');
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (content && !isLoading) {
      // Simulate typing effect
      let index = 0;
      const timer = setInterval(() => {
        if (index < content.length) {
          setTypedContent(content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setShowCharts(true);
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [content, isLoading]);

  const downloadReport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis-report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extractScore = (content) => {
    // Try multiple patterns to extract the score
    const patterns = [
      /OVERALL SCORE:\s*(\d+)\/100/i,
      /\*\*OVERALL SCORE:\s*(\d+)\/100\*\*/i,
      /Score:\s*(\d+)\/100/i,
      /Total Score:\s*(\d+)\/100/i,
      /Final Score:\s*(\d+)\/100/i,
      /(\d+)\/100/g // Last resort - find any X/100 pattern
    ];
    
    let score = 0;
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        score = parseInt(match[1]);
        break;
      }
    }
    
    // If no score found, calculate from detailed scores
    if (score === 0) {
      const detailedScores = extractDetailedScores(content);
      score = detailedScores.reduce((total, item) => total + item.value, 0);
      console.log('Calculated score from detailed breakdown:', score, detailedScores);
    } else {
      console.log('Extracted score directly:', score);
    }
    
    // Debug: Log content snippet for troubleshooting
    if (content) {
      const firstLines = content.split('\n').slice(0, 10).join('\n');
      console.log('Content preview for score extraction:', firstLines);
    }
    
    // Ensure score is within valid range
    score = Math.max(0, Math.min(100, score));
    
    let level = 'Low';
    let color = 'destructive';
    if (score >= 75) {
      level = 'High';
      color = 'success';
    } else if (score >= 50) {
      level = 'Medium';
      color = 'warning';
    }
    
    return { score, level, color };
  };

  const extractDetailedScores = (content) => {
    // Try multiple patterns for each score category
    const patterns = {
      coreSkills: [
        /\*\*Core Skills Alignment:\*\*\s*(\d+)\/40/i,
        /Core Skills Alignment:\s*(\d+)\/40/i,
        /Core Skills:\s*(\d+)\/40/i,
        /Skills Alignment:\s*(\d+)\/40/i
      ],
      experience: [
        /\*\*Relevant Experience Match:\*\*\s*(\d+)\/30/i,
        /Relevant Experience Match:\s*(\d+)\/30/i,
        /Experience Match:\s*(\d+)\/30/i,
        /Experience:\s*(\d+)\/30/i
      ],
      tools: [
        /\*\*Tools & Methodologies:\*\*\s*(\d+)\/20/i,
        /Tools & Methodologies:\s*(\d+)\/20/i,
        /Tools:\s*(\d+)\/20/i,
        /Methodologies:\s*(\d+)\/20/i
      ],
      education: [
        /\*\*Education & Credentials:\*\*\s*(\d+)\/10/i,
        /Education & Credentials:\s*(\d+)\/10/i,
        /Education:\s*(\d+)\/10/i,
        /Credentials:\s*(\d+)\/10/i
      ]
    };

    const extractValue = (patternArray) => {
      for (const pattern of patternArray) {
        const match = content.match(pattern);
        if (match) {
          return parseInt(match[1]);
        }
      }
      return 0;
    };

    return [
      { name: 'Core Skills', value: extractValue(patterns.coreSkills), max: 40, color: '#8884d8' },
      { name: 'Experience', value: extractValue(patterns.experience), max: 30, color: '#82ca9d' },
      { name: 'Tools', value: extractValue(patterns.tools), max: 20, color: '#ffc658' },
      { name: 'Education', value: extractValue(patterns.education), max: 10, color: '#ff7300' }
    ];
  };

  const { score, level, color } = extractScore(content || '');
  const detailedScores = extractDetailedScores(content || '');
  
  // Ensure we have valid data for charts
  const validScore = isNaN(score) ? 0 : score;
  const validDetailedScores = detailedScores.every(item => !isNaN(item.value)) ? detailedScores : [
    { name: 'Core Skills', value: 0, max: 40, color: '#8884d8' },
    { name: 'Experience', value: 0, max: 30, color: '#82ca9d' },
    { name: 'Tools', value: 0, max: 20, color: '#ffc658' },
    { name: 'Education', value: 0, max: 10, color: '#ff7300' }
  ];
  
  const pieData = [
    { name: 'Achieved', value: validScore, color: '#10b981' },
    { name: 'Remaining', value: Math.max(0, 100 - validScore), color: '#e5e7eb' }
  ];

  const LoadingSkeleton = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center space-x-3 text-primary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="h-6 w-6" />
        </motion.div>
        <span className="text-xl font-semibold">
          Analyzing your résumé with AI...
        </span>
      </div>
      
      {/* Animated loading bars */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div 
            key={i} 
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div 
              className="h-4 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg overflow-hidden"
              style={{ width: `${Math.random() * 40 + 40}%` }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-glow animate-shimmer"
                style={{
                  backgroundSize: '200% 100%',
                  backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                }}
              />
            </motion.div>
            <motion.div 
              className="h-3 bg-muted/60 rounded animate-pulse"
              style={{ width: `${Math.random() * 30 + 30}%` }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Score Overview Card */}
      <AnimatePresence>
        {!isLoading && content && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-primary-glow/5 to-accent/20 backdrop-blur-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-gradient-x" />
              
              <CardHeader className="pb-8 relative z-10">
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardTitle className="text-2xl font-bold flex items-center gap-4">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Award className="text-success-foreground text-lg" />
                      </motion.div>
                      Analysis Complete
                    </CardTitle>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      variant="outline"
                      className={`
                        px-4 py-2 text-lg font-bold border-2 shadow-lg
                        ${color === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400' : ''}
                        ${color === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400' : ''}
                        ${color === 'destructive' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400' : ''}
                      `}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {validScore}/100 • {level} Match
                      </motion.span>
                    </Badge>
                  </motion.div>
                </div>

                {/* Score Visualization */}
                <AnimatePresence>
                  {showCharts && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
                    >
                      {/* Pie Chart */}
                      <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Bar Chart */}
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={validDetailedScores}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-lg overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[700px] w-full">
              <div className="p-8">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <motion.div 
                    className="prose prose-sm max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <motion.h1 
                            className="text-3xl font-bold text-foreground mb-6 pb-3 border-b border-border"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            {children}
                          </motion.h1>
                        ),
                        h2: ({ children }) => (
                          <motion.h2 
                            className="text-2xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <TrendingUp className="w-5 h-5 text-primary" />
                            {children}
                          </motion.h2>
                        ),
                        h3: ({ children }) => (
                          <motion.h3 
                            className="text-xl font-medium text-foreground mt-8 mb-3 flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Target className="w-4 h-4 text-accent" />
                            {children}
                          </motion.h3>
                        ),
                        p: ({ children }) => (
                          <motion.p 
                            className="text-foreground mb-4 leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            {children}
                          </motion.p>
                        ),
                        ul: ({ children }) => (
                          <motion.ul 
                            className="list-disc list-inside space-y-2 mb-6 text-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            {children}
                          </motion.ul>
                        ),
                        ol: ({ children }) => (
                          <motion.ol 
                            className="list-decimal list-inside space-y-2 mb-6 text-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            {children}
                          </motion.ol>
                        ),
                        li: ({ children }) => (
                          <motion.li 
                            className="ml-2 hover:text-primary transition-colors duration-200"
                            whileHover={{ x: 5 }}
                          >
                            {children}
                          </motion.li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-primary bg-primary/10 px-1 py-0.5 rounded">
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono border">
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <motion.blockquote 
                            className="border-l-4 border-primary pl-6 italic text-muted-foreground bg-primary/5 py-4 rounded-r-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            {children}
                          </motion.blockquote>
                        )
                      }}
                    >
                      {typedContent}
                    </ReactMarkdown>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <AnimatePresence>
        {!isLoading && content && (
          <motion.div 
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={downloadReport}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-2xl hover:shadow-primary/25 transform transition-all duration-300 px-10"
              >
                <Download className="h-5 w-5 mr-3" />
                Download Report
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={onStartOver}
                className="hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 transition-all duration-300 px-10 border-2 hover:border-primary/50"
              >
                <RefreshCw className="h-5 w-5 mr-3" />
                Start Over
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}