import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Brain, 
  Target, 
  Sparkles, 
  CheckCircle, 
  TrendingUp,
  Zap,
  Award
} from 'lucide-react';

export function EnhancedAnalysisFlow({ 
  isAnalyzing, 
  progress, 
  currentStep, 
  analysisData,
  onComplete 
}) {
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [scoreAnimation, setScoreAnimation] = useState(0);

  const analysisSteps = [
    {
      id: 'parsing',
      title: 'Parsing Resume',
      description: 'Extracting text and structure',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      duration: 2000
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Analyzing with Gemini AI',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      duration: 3000
    },
    {
      id: 'scoring',
      title: 'ATS Scoring',
      description: 'Calculating compatibility score',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      duration: 2500
    },
    {
      id: 'recommendations',
      title: 'Generating Insights',
      description: 'Creating improvement suggestions',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      duration: 2000
    }
  ];

  useEffect(() => {
    if (isAnalyzing) {
      setAnimationPhase('analyzing');
    } else if (analysisData) {
      setAnimationPhase('complete');
      // Animate score counting
      const targetScore = analysisData.overall_score || 0;
      let current = 0;
      const increment = targetScore / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setScoreAnimation(targetScore);
          clearInterval(timer);
        } else {
          setScoreAnimation(Math.floor(current));
        }
      }, 30);
    }
  }, [isAnalyzing, analysisData]);

  const getScoreColor = (score) => {
    if (score >= 85) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {animationPhase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            {/* Animated Analysis Steps */}
            <div className="space-y-8">
              {analysisSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isComplete = index < currentStep;
                const StepIcon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ 
                      opacity: isActive || isComplete ? 1 : 0.3,
                      x: 0,
                      scale: isActive ? 1.05 : 1
                    }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center justify-center space-x-4"
                  >
                    <motion.div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        bg-gradient-to-r ${step.color} text-white shadow-lg
                        ${isActive ? 'ring-4 ring-white/30' : ''}
                      `}
                      animate={isActive ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <StepIcon className="w-8 h-8" />
                      )}
                    </motion.div>

                    <div className="text-left">
                      <motion.h3 
                        className="text-lg font-semibold text-foreground"
                        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      >
                        {step.title}
                      </motion.h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-4"
                      >
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 max-w-md mx-auto"
            >
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% Complete
              </p>
            </motion.div>
          </motion.div>
        )}

        {animationPhase === 'complete' && analysisData && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {/* Score Reveal Animation */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/10 overflow-hidden">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className={`
                    w-32 h-32 mx-auto rounded-full flex items-center justify-center
                    bg-gradient-to-r ${getScoreColor(scoreAnimation)} text-white shadow-2xl
                    relative overflow-hidden
                  `}>
                    {/* Animated Ring */}
                    <motion.div
                      className="absolute inset-0 border-4 border-white/30 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <div className="text-center z-10">
                      <motion.div
                        className="text-3xl font-bold"
                        key={scoreAnimation}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {scoreAnimation}
                      </motion.div>
                      <div className="text-sm opacity-90">/ 100</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
                  <Badge 
                    variant="outline" 
                    className={`
                      px-4 py-2 text-lg font-semibold border-2
                      bg-gradient-to-r ${getScoreColor(scoreAnimation)} text-white border-transparent
                    `}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    {getScoreLabel(scoreAnimation)} Match
                  </Badge>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                >
                  {[
                    { 
                      label: 'Skills Match', 
                      value: `${analysisData.pillars?.core_skills?.score || 0}/40`,
                      icon: Target 
                    },
                    { 
                      label: 'Experience', 
                      value: `${analysisData.pillars?.relevant_experience?.score || 0}/30`,
                      icon: TrendingUp 
                    },
                    { 
                      label: 'Tools', 
                      value: `${analysisData.pillars?.tools_methodologies?.score || 0}/20`,
                      icon: Zap 
                    },
                    { 
                      label: 'Education', 
                      value: `${analysisData.pillars?.education_credentials?.score || 0}/10`,
                      icon: Award 
                    }
                  ].map((stat, index) => {
                    const StatIcon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg"
                      >
                        <StatIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-medium">{stat.label}</div>
                        <div className="text-lg font-bold text-primary">{stat.value}</div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}