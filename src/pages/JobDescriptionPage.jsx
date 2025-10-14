import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Briefcase } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StepWizard, resumeAnalysisSteps } from '@/components/StepWizard';

export default function JobDescriptionPage() {
  const { state, setJobDescription } = useAppContext();
  const [jobInput, setJobInput] = useState(state.jobDescription);
  const [wordCount, setWordCount] = useState(0);
  const [keywordCount, setKeywordCount] = useState(0);
  const navigate = useNavigate();

  const analyzeJobDescription = (text) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Count potential keywords (words longer than 3 characters)
    const keywords = words.filter(word => word.length > 3 && !/^(the|and|for|are|but|not|you|all|can|had|her|was|one|our|out|day|get|has|him|his|how|its|may|new|now|old|see|two|way|who|boy|did|man|men|put|say|she|too|use)$/i.test(word));
    setKeywordCount(keywords.length);
  };

  const handlePaste = (e) => {
    // Ensure paste event works properly
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    setJobInput(pastedText);
    analyzeJobDescription(pastedText);
  };

  const handleContinue = () => {
    if (!jobInput.trim()) {
      return;
    }
    
    setJobDescription(jobInput.trim());
    navigate('/report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -180, -360],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="group hover:scale-105 transition-all duration-200 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40"
          >
            <motion.div
              className="mr-2"
              whileHover={{ rotate: -10 }}
              transition={{ duration: 0.2 }}
            >
              🏠
            </motion.div>
            Home
          </Button>
        </motion.div>
        <ThemeToggle />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <StepWizard currentStep={3} steps={resumeAnalysisSteps} />
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🎯 Target Job Description
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Paste the job description you're targeting. Our AI will identify key requirements and match them against your resume.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center justify-between text-2xl">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Briefcase className="w-6 h-6 text-primary" />
                  </motion.div>
                  Job Requirements
                </div>
                {wordCount > 0 && (
                  <div className="flex gap-4 text-sm">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-muted-foreground bg-primary/10 px-3 py-1 rounded-full"
                    >
                      {wordCount} words
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-muted-foreground bg-green-500/10 px-3 py-1 rounded-full"
                    >
                      {keywordCount} keywords
                    </motion.div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Textarea
                  placeholder="Paste the job description here...\n\nExample:\nSoftware Engineer - Frontend\n\nWe are looking for a skilled Frontend Developer with 3+ years of experience in React, JavaScript, and modern web technologies.\n\nRequirements:\n• Bachelor's degree in Computer Science\n• 3+ years of React development\n• Experience with TypeScript, Node.js\n• Knowledge of Git, CI/CD pipelines\n• Strong problem-solving skills..."
                  value={jobInput}
                  onChange={(e) => {
                    setJobInput(e.target.value);
                    analyzeJobDescription(e.target.value);
                  }}
                  onPaste={handlePaste}
                  className="min-h-[500px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 text-base leading-relaxed border-primary/20"
                />
              </motion.div>
              
              {jobInput && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-500/10 p-3 rounded-lg">
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Job description loaded
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-500/10 p-3 rounded-lg">
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    Keywords identified
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-purple-500/10 p-3 rounded-lg">
                    <motion.div
                      className="w-2 h-2 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    Ready for analysis
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="flex justify-between mt-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            onClick={() => navigate('/resume')}
            className="group hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!jobInput.trim()}
            className="group hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-primary-glow px-8"
          >
            Analyze Resume
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}