import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Target,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { EnhancedAnalysisFlow } from '@/components/EnhancedAnalysisFlow';
import { InteractiveScoreChart } from '@/components/InteractiveScoreChart';
import { EnhancedJobRecommendations } from '@/components/EnhancedJobRecommendations';
import { JobSearchGuide } from '@/components/JobSearchGuide';
import { JobMatchingDebugger } from '@/components/JobMatchingDebugger';
import { JobApplicationHub } from '@/components/JobApplicationHub';
import { extractTextFromFile } from '@/lib/fileParser';
import { generateATSScore } from '@/lib/analyzeResume';
import { enhancedAnalysisEngine } from '@/services/ai/EnhancedAnalysisEngine';
import { jobMatchingService } from '@/services/JobMatchingService';

export function OptimizedATSChecker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [matchingJobs, setMatchingJobs] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [analysisType, setAnalysisType] = useState('standard'); // 'standard' or 'comprehensive'

  const steps = useMemo(() => [
    { 
      id: 'resume', 
      title: 'Resume Upload', 
      icon: FileText, 
      description: 'Upload your resume',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'job', 
      title: 'Job Description', 
      icon: Briefcase, 
      description: 'Add target job',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'results', 
      title: 'ATS Analysis', 
      icon: BarChart3, 
      description: 'View your score',
      color: 'from-green-500 to-emerald-500'
    }
  ], []);

  // Memoized validation functions
  const canProceed = useCallback((step) => {
    switch (step) {
      case 0: return true;
      case 1: return resumeText.trim() !== '';
      case 2: return resumeText.trim() !== '' && jobDescription.trim() !== '';
      default: return false;
    }
  }, [resumeText, jobDescription]);

  // Optimized file upload handler
  const handleFileUpload = useCallback(async (file) => {
    try {
      setError('');
      const text = await extractTextFromFile(file);
      setResumeText(text);
      
      // Auto-advance to next step
      if (text.trim()) {
        setTimeout(() => setCurrentStep(1), 500);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Enhanced analysis handler with progress tracking
  const handleAnalyze = useCallback(async () => {
    if (!resumeText || !jobDescription) {
      setError('Please upload your resume and add a job description before analyzing');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setSuccess('');
    setCurrentStep(2);
    setAnalysisProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      let scoreData;
      
      if (analysisType === 'comprehensive') {
        // Use enhanced analysis engine
        scoreData = await enhancedAnalysisEngine.analyzeResumeComprehensive(
          resumeText, 
          jobDescription,
          {
            includeIndustryAnalysis: true,
            includeSkillGapAnalysis: true,
            includeATSOptimization: true,
            includeCareerProgression: true
          }
        );
      } else {
        // Use standard analysis
        scoreData = await generateATSScore(resumeText, jobDescription);
      }

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Small delay for better UX
      setTimeout(() => {
        setAtsScore(scoreData);
        setError('');
        setSuccess('✅ Analysis completed successfully!');
      }, 500);

    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again or use standard analysis mode.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeText, jobDescription, analysisType]);

  // Enhanced job matching with detailed logging
  const handleFindJobs = useCallback(async () => {
    if (!atsScore) return;

    setLoadingJobs(true);
    setError('');
    
    try {
      console.log('🎯 Starting job matching process...');
      console.log('📊 ATS Score Data:', atsScore);
      
      const resumeData = {
        skills: atsScore.pillars?.core_skills?.matched || [],
        experience: atsScore.pillars?.relevant_experience?.candidate_years || 0,
        location: 'India',
        industry: 'technology' // Could be detected from job description
      };

      console.log('📋 Resume Data for Job Matching:', resumeData);

      const preferences = {
        location: 'India',
        prioritizeLocation: true,
        prioritizeSkills: true,
        minMatchScore: 50 // Lower threshold for more results
      };

      console.log('⚙️ Job Matching Preferences:', preferences);

      const jobs = await jobMatchingService.findJobsForResume(resumeData, preferences);
      
      console.log('✅ Job Matching Complete!');
      console.log('📈 Total Jobs Found:', jobs.length);
      console.log('🎯 Job Sources:', [...new Set(jobs.map(job => job.source))]);
      
      if (jobs.length === 0) {
        console.warn('⚠️ No jobs found, this should not happen with the new system');
        setError('No jobs found. This is unusual - please try refreshing or contact support.');
      } else {
        setMatchingJobs(jobs);
        setSuccess(`✅ Found ${jobs.length} personalized job recommendations!`);
      }
    } catch (error) {
      console.error('❌ Job matching failed:', error);
      setError(`Job matching failed: ${error.message}. Please try again.`);
    } finally {
      setLoadingJobs(false);
    }
  }, [atsScore]);

  // Auto-clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header with Analysis Type Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm font-semibold text-blue-100">AI-Powered Analysis</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            ATS Resume Checker
          </h1>
          
          <p className="text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            Get instant ATS compatibility scores, detailed analysis, and personalized job recommendations powered by advanced AI
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>98% ATS Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Job Matching</span>
            </div>
          </div>
        </div>
        
        {/* Analysis Type Toggle */}
        <motion.div 
          className="flex justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant={analysisType === 'standard' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setAnalysisType('standard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              analysisType === 'standard' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl' 
                : 'border-white/30 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/50'
            }`}
          >
            <Zap className="w-5 h-5" />
            Standard Analysis
          </Button>
          <Button
            variant={analysisType === 'comprehensive' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setAnalysisType('comprehensive')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              analysisType === 'comprehensive' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl' 
                : 'border-white/30 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Comprehensive Analysis
          </Button>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <CardContent className="p-8">
            {/* Step Navigation */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isComplete = index < currentStep;
                const canAccess = canProceed(index);

                return (
                  <motion.div
                    key={step.id}
                    className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.button
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isActive 
                          ? `bg-gradient-to-r ${step.color} text-white border-transparent shadow-lg` 
                          : isComplete
                          ? 'bg-green-500 text-white border-green-500'
                          : canAccess
                          ? 'border-primary/30 text-primary hover:border-primary/50'
                          : 'border-muted-foreground/20 text-muted-foreground'
                        }
                      `}
                      whileHover={canAccess ? { scale: 1.05 } : {}}
                      whileTap={canAccess ? { scale: 0.95 } : {}}
                      onClick={() => canAccess && setCurrentStep(index)}
                      disabled={!canAccess}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </motion.button>
                    
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-4">
                        <div className="h-0.5 bg-muted-foreground/20 relative overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-primary-glow absolute left-0 top-0"
                            initial={{ width: '0%' }}
                            animate={{ width: currentStep > index ? '100%' : '0%' }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground">{steps[currentStep].description}</p>
            </div>

            {/* Progress Bar */}
            <Progress 
              value={(currentStep / (steps.length - 1)) * 100} 
              className="h-2 mb-6" 
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="resume-upload"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Upload Your Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUpload
                  onFileUpload={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                  label="Upload Resume File"
                  description="Drag and drop your resume file here, or click to browse"
                  error={error}
                />

                {resumeText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resume loaded ({resumeText.split(' ').length} words)
                  </motion.div>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    disabled={!resumeText.trim()}
                    className="px-8"
                  >
                    Continue →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="job-description"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">Add Job Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <label className="text-base font-medium">
                    Target Job Description
                  </label>
                  <textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full min-h-[300px] p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {jobDescription && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Job description loaded ({jobDescription.split(' ').length} words)
                  </motion.div>
                )}

                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                  >
                    ← Back
                  </Button>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim()}
                    className="px-8 bg-gradient-to-r from-primary to-primary-glow"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8"
          >
            {/* Analysis Flow */}
            <EnhancedAnalysisFlow
              isAnalyzing={isAnalyzing}
              progress={analysisProgress}
              currentStep={Math.floor(analysisProgress / 25)}
              analysisData={atsScore}
              onComplete={() => {}}
            />

            {/* Results Display */}
            {atsScore && !isAnalyzing && (
              <>
                {/* Interactive Score Chart */}
                <InteractiveScoreChart 
                  scoreData={atsScore}
                  className="mb-8"
                />

                {/* Enhanced Analysis Results */}
                {analysisType === 'comprehensive' && atsScore.enhancedAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          Comprehensive Analysis Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Industry Analysis */}
                        {atsScore.enhancedAnalysis.industryAnalysis && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                            <h4 className="font-semibold mb-2">Industry Fit Analysis</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Industry</p>
                                <p className="font-medium capitalize">
                                  {atsScore.enhancedAnalysis.industryAnalysis.industry}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Fit Score</p>
                                <Badge variant="outline" className="font-bold">
                                  {atsScore.enhancedAnalysis.industryAnalysis.fitScore}/100
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Skill Gap Analysis */}
                        {atsScore.enhancedAnalysis.skillGapAnalysis && (
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                            <h4 className="font-semibold mb-2">Skill Gap Analysis</h4>
                            <div className="space-y-2">
                              {atsScore.enhancedAnalysis.skillGapAnalysis.skillGaps.critical.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-red-600">Critical Skills Missing:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {atsScore.enhancedAnalysis.skillGapAnalysis.skillGaps.critical.slice(0, 5).map((skill, i) => (
                                      <Badge key={i} variant="destructive" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Job Application Hub - NO REGIONAL RESTRICTIONS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-green-500" />
                        Job Application Hub
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <JobApplicationHub
                        resumeSkills={atsScore?.pillars?.core_skills?.matched || []}
                        userProfile={{
                          skills: atsScore?.pillars?.core_skills?.matched || [],
                          experience: atsScore?.pillars?.relevant_experience?.candidate_years || 0
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Job Search Guide */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <JobSearchGuide
                    skills={atsScore?.pillars?.core_skills?.matched || []}
                    location="India"
                  />
                </motion.div>

                {/* Job Matching Debugger (Development Tool) */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <JobMatchingDebugger
                      resumeSkills={atsScore?.pillars?.core_skills?.matched || []}
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}