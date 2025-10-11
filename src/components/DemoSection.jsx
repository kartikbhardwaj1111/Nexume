import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Target,
  Award,
  Zap
} from 'lucide-react';

export default function DemoSection({ onGetStarted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Upload Resume",
      description: "Drag & drop your resume file",
      progress: 25,
      icon: "📄",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Add Job Description", 
      description: "Paste the target job posting",
      progress: 50,
      icon: "🎯",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "AI Analysis",
      description: "Advanced matching algorithm runs",
      progress: 75,
      icon: "🤖",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Get Results",
      description: "Detailed ATS score with insights",
      progress: 100,
      icon: "✨",
      color: "from-orange-500 to-red-500"
    }
  ];

  const sampleResults = {
    overall_score: 87,
    confidence: 0.92,
    pillars: {
      core_skills: { score: 35, matched: ["React", "JavaScript", "Node.js", "Python"] },
      relevant_experience: { score: 26, candidate_years: 5, jd_years: 3 },
      tools_methodologies: { score: 18, matched: ["Git", "Docker", "AWS"] },
      education_credentials: { score: 8, degree: "Bachelor's in Computer Science" }
    },
    recommendations: [
      "Add TypeScript to your skills section",
      "Include more specific project metrics",
      "Highlight leadership experience"
    ]
  };

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            See It In Action
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Watch how our ATS checker transforms your resume analysis in real-time
          </p>
          
          {/* Demo Controls */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              onClick={startDemo}
              disabled={isPlaying}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Play className="w-4 h-4 mr-2" />
              {isPlaying ? 'Playing...' : 'Start Demo'}
            </Button>
            <Button
              onClick={resetDemo}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Demo Process */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                    className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center"
                  >
                    🚀
                  </motion.div>
                  Analysis Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`
                      flex items-center gap-4 p-4 rounded-lg transition-all duration-500
                      ${currentStep >= index 
                        ? 'bg-white/10 border border-white/20' 
                        : 'bg-white/5 border border-white/10'
                      }
                    `}
                    animate={{
                      scale: currentStep === index ? 1.02 : 1,
                      opacity: currentStep >= index ? 1 : 0.6
                    }}
                  >
                    <motion.div
                      className={`
                        w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} 
                        flex items-center justify-center text-white font-bold text-lg
                      `}
                      animate={{
                        scale: currentStep === index ? [1, 1.1, 1] : 1,
                        rotate: currentStep === index ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ duration: 0.5, repeat: currentStep === index ? Infinity : 0 }}
                    >
                      {step.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{step.title}</h4>
                      <p className="text-blue-100 text-sm">{step.description}</p>
                      
                      <div className="mt-2">
                        <Progress 
                          value={currentStep > index ? 100 : currentStep === index ? step.progress : 0} 
                          className="h-2"
                        />
                      </div>
                    </div>
                    
                    {currentStep > index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400"
                      >
                        <CheckCircle className="w-6 h-6" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sample Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      scale: currentStep === demoSteps.length - 1 ? [1, 1.2, 1] : 1,
                      rotate: currentStep === demoSteps.length - 1 ? [0, 360] : 0
                    }}
                    transition={{ duration: 1, repeat: currentStep === demoSteps.length - 1 ? Infinity : 0 }}
                    className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                  >
                    📊
                  </motion.div>
                  Sample Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {currentStep >= demoSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="space-y-6"
                    >
                      {/* Overall Score */}
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                          <span className="text-2xl font-bold text-white">
                            {sampleResults.overall_score}
                          </span>
                        </motion.div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Excellent Match • {Math.round(sampleResults.confidence * 100)}% Confidence
                        </Badge>
                      </div>

                      {/* Pillar Breakdown */}
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Score Breakdown
                        </h4>
                        
                        {[
                          { name: 'Core Skills', score: sampleResults.pillars.core_skills.score, max: 40, color: 'blue' },
                          { name: 'Experience', score: sampleResults.pillars.relevant_experience.score, max: 30, color: 'green' },
                          { name: 'Tools', score: sampleResults.pillars.tools_methodologies.score, max: 20, color: 'purple' },
                          { name: 'Education', score: sampleResults.pillars.education_credentials.score, max: 10, color: 'orange' }
                        ].map((pillar, index) => (
                          <motion.div
                            key={pillar.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center justify-between"
                          >
                            <span className="text-blue-100 text-sm">{pillar.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-${pillar.color}-500`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(pillar.score / pillar.max) * 100}%` }}
                                  transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                                />
                              </div>
                              <span className="text-white text-sm font-medium w-8">
                                {pillar.score}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Recommendations Preview */}
                      <div className="space-y-3">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Key Recommendations
                        </h4>
                        {sampleResults.recommendations.slice(0, 2).map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="flex items-start gap-2 text-sm text-blue-100 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20"
                          >
                            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            {rec}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {currentStep < demoSteps.length - 1 && (
                  <div className="text-center py-12 text-blue-200">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Results will appear here...
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 px-12 py-6 text-xl"
            >
              <Award className="w-6 h-6 mr-3" />
              Try It Yourself - Free
              <motion.div
                className="ml-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </Button>
          </motion.div>
          
          <p className="text-sm text-blue-200 mt-4">
            No registration required • Get results in 30 seconds
          </p>
        </motion.div>
      </div>
    </div>
  );
}