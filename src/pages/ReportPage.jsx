import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnalysisReport } from '@/components/AnalysisReport';
import { useAppContext } from '@/context/AppContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StepWizard, resumeAnalysisSteps } from '@/components/StepWizard';
import { analyzeResumeWithGemini, generateATSScore } from '@/lib/analyzeResume';
import ATSScoreDisplay from '@/components/ATSScoreDisplay';

export default function ReportPage() {
  const { state, setAnalysisReport, resetState } = useAppContext();
  const location = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [isGeneratingScore, setIsGeneratingScore] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if this is a job-specific analysis from JobAnalysisPage
  const jobSpecificData = location.state;
  const isJobSpecific = jobSpecificData?.analysisType === 'job-tailored';

  useEffect(() => {
    // Handle job-specific analysis from JobAnalysisPage
    if (isJobSpecific && jobSpecificData?.analysisResult) {
      setAtsScore(jobSpecificData.analysisResult);
      setAnalysisReport('Job-specific analysis completed');
      return;
    }

    // Handle regular analysis flow
    if (!state.apiKey || !state.resumeText || !state.jobDescription) {
      navigate('/api-key');
      return;
    }

    if (!state.analysisReport && !isAnalyzing) {
      performAnalysis();
    }
  }, [state, navigate, isAnalyzing, isJobSpecific, jobSpecificData]);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    setError('');

    try {
      // Generate ATS score first (faster)
      setIsGeneratingScore(true);
      const scoreData = await generateATSScore(
        state.resumeText,
        state.jobDescription,
        state.apiKey
      );
      setAtsScore(scoreData);
      setIsGeneratingScore(false);
      
      // Then generate detailed report (optional - can be skipped for faster results)
      const report = await analyzeResumeWithGemini(
        state.resumeText,
        state.jobDescription,
        state.apiKey
      );
      setAnalysisReport(report);
    } catch (err) {
      setError(err.message);
      setIsGeneratingScore(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    resetState();
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-destructive/5 p-4 flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-3xl">⚠️</span>
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 text-destructive">Analysis Failed</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => navigate('/api-key')}
            className="text-primary hover:underline font-medium"
          >
            Start Over
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 0, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 18,
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
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <StepWizard currentStep={4} steps={resumeAnalysisSteps} />
        
        {/* Enhanced Header */}
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
            📈 Resume Analysis Results
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isAnalyzing ? "Our AI is analyzing your resume against the job requirements..." : "Here's your comprehensive resume analysis with actionable insights."}
          </motion.p>
        </motion.div>

        {/* ATS Score Display */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {atsScore ? (
            <ATSScoreDisplay scoreData={atsScore} />
          ) : (
            <div className="text-center py-12">
              <motion.div
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.h3
                className="text-xl font-semibold mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🤖 Generating ATS Score
              </motion.h3>
              <p className="text-muted-foreground">
                {isGeneratingScore ? "Calculating compatibility score..." : "Analyzing resume compatibility and generating insights..."}
              </p>
              <motion.div
                className="mt-4 flex justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
        
        {/* Detailed Analysis Report - Only show if we have content */}
        {(state.analysisReport || isAnalyzing) && (
          <AnalysisReport
            content={state.analysisReport}
            isLoading={isAnalyzing && !atsScore} // Only show loading if we don't have ATS score yet
            onStartOver={handleStartOver}
          />
        )}

        {/* Action Buttons - Show when ATS score is ready */}
        {atsScore && !isAnalyzing && (
          <motion.div 
            className="flex gap-6 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleStartOver}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-2xl hover:shadow-primary/25 transform transition-all duration-300 px-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-3"
                >
                  🔄
                </motion.div>
                Analyze Another Resume
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}