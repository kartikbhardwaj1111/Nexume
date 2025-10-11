import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Key,
  Zap,
  Target,
  Download,
  RefreshCw,
  Home,
  ExternalLink
} from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import ATSScoreDisplay from '@/components/ATSScoreDisplay';
import ReportPreview from '@/components/ReportPreview';
import Layout from '@/components/Layout';
import { extractTextFromFile } from '@/lib/fileParser';
import { generateATSScore } from '@/lib/analyzeResume';
import { aiServiceManager } from '@/services/ai/AIServiceManager';
import { downloadReport, downloadPDFReport } from '@/lib/reportGenerator';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { jobMatchingService } from '@/services/JobMatchingService';

export default function ATSChecker() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [matchingJobs, setMatchingJobs] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const steps = [
    { id: 'resume', title: 'Resume Upload', icon: FileText, description: 'Upload your resume' },
    { id: 'job', title: 'Job Description', icon: Briefcase, description: 'Add target job' },
    { id: 'results', title: 'ATS Analysis', icon: BarChart3, description: 'View your score' }
  ];

  useEffect(() => {
    setProgress((currentStep / (steps.length - 1)) * 100);
  }, [currentStep]);

  const handleFileUpload = async (file) => {
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please upload your resume and add a job description before analyzing');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setCurrentStep(2);

    try {
      // Use the new AI Service Manager (no API key required)
      const scoreData = await generateATSScore(resumeText, jobDescription);
      
      // Get service status for display
      const status = aiServiceManager.getCurrentService();
      setServiceStatus(status);
      
      // Always set the score data
      setAtsScore(scoreData);
      
      // Clear any previous errors since we got a result
      setError('');
    } catch (err) {
      console.error('Analysis error:', err);
      
      // Provide user-friendly error message
      const userFriendlyMessage = err.message.includes('network') || err.message.includes('fetch')
        ? 'Network error. Please check your connection and try again'
        : 'Analysis completed using offline methods. Results may be less detailed than AI-powered analysis.';
      
      // Don't set this as an error since we still get results
      if (!err.message.includes('network')) {
        setError('');
      } else {
        setError(userFriendlyMessage);
      }
      
      // Get service status
      const status = aiServiceManager.getCurrentService();
      setServiceStatus(status);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canProceed = (step) => {
    switch (step) {
      case 0: return true;
      case 1: return resumeText.trim() !== '';
      case 2: return resumeText.trim() !== '' && jobDescription.trim() !== '';
      default: return false;
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${currentStep >= index 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground/30 text-muted-foreground'
                }
              `}
              whileHover={{ scale: 1.1 }}
              onClick={() => canProceed(index) && setCurrentStep(index)}
              style={{ cursor: canProceed(index) ? 'pointer' : 'default' }}
            >
              <step.icon className="w-5 h-5" />
            </motion.div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-muted-foreground/20 relative overflow-hidden">
                  <motion.div
                    className="h-full bg-primary absolute left-0 top-0"
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep > index ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
        <p className="text-muted-foreground">{steps[currentStep].description}</p>
      </div>
      
      <div className="mt-4">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );

  return (
    <Layout customBreadcrumbs={[
      { path: '/', label: 'Home' },
      { path: '/ats-checker', label: 'ATS Checker' }
    ]}>
      <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
              <Home className="w-4 h-4" />
            </motion.div>
            Home
          </Button>
        </motion.div>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
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
            🎯 ATS Resume Checker
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Get your resume ATS-ready in minutes. Powered by Google Gemini AI for accurate analysis and optimization recommendations.
          </motion.p>
          
          <motion.div
            className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Zap className="w-4 h-4" />
            <span>Enhanced with Gemini AI Technology</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-lg overflow-hidden">
            <CardContent className="p-8">
              <StepIndicator />

              <AnimatePresence mode="wait">
                {/* Step 0: Resume Upload */}
                {currentStep === 0 && (
                  <motion.div
                    key="resume"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FileText className="w-10 h-10 text-blue-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">Upload Your Resume</h3>
                      <p className="text-muted-foreground">Upload your resume file or paste the text directly</p>
                    </div>

                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                        <TabsTrigger value="paste">Paste Text</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="upload" className="space-y-4">
                        <FileUpload
                          onFileUpload={handleFileUpload}
                          accept=".pdf,.docx,.txt"
                          label="Upload Resume File"
                          description="Drag and drop your resume file here, or click to browse"
                          error={error}
                        />
                      </TabsContent>
                      
                      <TabsContent value="paste" className="space-y-4">
                        <Textarea
                          placeholder="Paste your resume text here..."
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          className="min-h-[300px] resize-none"
                        />
                      </TabsContent>
                    </Tabs>

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
                  </motion.div>
                )}

                {/* Step 1: Job Description */}
                {currentStep === 1 && (
                  <motion.div
                    key="job"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Briefcase className="w-10 h-10 text-purple-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">Add Job Description</h3>
                      <p className="text-muted-foreground">Paste the job description you're targeting</p>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="jobDescription" className="text-base font-medium">
                        Target Job Description
                      </Label>
                      <Textarea
                        id="jobDescription"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[300px] resize-none"
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
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze Resume
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Results */}
                {currentStep === 2 && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {isAnalyzing ? (
                      <div className="text-center py-12">
                        <motion.div
                          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <h3 className="text-xl font-semibold mb-2">🤖 Analyzing Your Resume</h3>
                        <p className="text-muted-foreground">Our AI is comparing your resume against the job requirements...</p>
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
                    ) : atsScore ? (
                      <div className="space-y-6">
                        {/* Service Status Indicator */}
                        {serviceStatus && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                serviceStatus.primary === 'available' ? 'bg-green-500' :
                                serviceStatus.primary === 'rate-limited' ? 'bg-yellow-500' :
                                'bg-orange-500'
                              }`} />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  Analysis Method: {atsScore.serviceName || 'AI Service Manager'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {serviceStatus.primary === 'available' ? 
                                    'AI-powered analysis completed' :
                                    serviceStatus.primary === 'rate-limited' ?
                                    'Using fallback analysis due to rate limits' :
                                    'Using rule-based analysis - AI services temporarily unavailable'
                                  }
                                </div>
                              </div>
                              <Badge variant={serviceStatus.primary === 'available' ? 'default' : 'secondary'}>
                                Confidence: {Math.round((atsScore.confidence || 0.5) * 100)}%
                              </Badge>
                            </div>
                          </motion.div>
                        )}

                        <ATSScoreDisplay scoreData={atsScore} />
                        
                        <ReportPreview scoreData={atsScore} />
                        
                        <div className="space-y-4">
                          {/* Download Options */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800"
                          >
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Download className="w-5 h-5 text-blue-600" />
                              Download Your Improvement Guide
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Get a comprehensive report with step-by-step instructions to boost your ATS score
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button 
                                onClick={() => {
                                  try {
                                    downloadReport(atsScore, resumeText, jobDescription, 'ats-improvement-guide');
                                    setError('');
                                    setSuccess('✅ Report downloaded successfully! Check your downloads folder.');
                                    setTimeout(() => setSuccess(''), 5000);
                                  } catch (err) {
                                    setError('Failed to download report. Please try again.');
                                    setSuccess('');
                                  }
                                }}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-1"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Markdown Report
                              </Button>
                              
                              <Button 
                                onClick={() => {
                                  try {
                                    downloadPDFReport(atsScore, resumeText, jobDescription, 'ats-improvement-guide');
                                    setError('');
                                    setSuccess('✅ PDF report opened in new window! Use Ctrl+P to save as PDF.');
                                    setTimeout(() => setSuccess(''), 5000);
                                  } catch (err) {
                                    setError('Failed to generate PDF. Please try again.');
                                    setSuccess('');
                                  }
                                }}
                                variant="outline"
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 flex-1"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Print/Save as PDF
                              </Button>
                            </div>
                            
                            <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">📋 Your Report Includes:</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
                                <div>• Detailed score breakdown</div>
                                <div>• Priority action plan</div>
                                <div>• Specific improvement tips</div>
                                <div>• ATS optimization checklist</div>
                                <div>• Keyword recommendations</div>
                                <div>• Score improvement roadmap</div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Job Matching Section */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"
                          >
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              🎯 Find Matching Jobs
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Get job suggestions based on your resume skills and experience
                            </p>
                            
                            <Button 
                              onClick={async () => {
                                setLoadingJobs(true);
                                try {
                                  const skills = atsScore.pillars.core_skills.matched || [];
                                  const jobs = await jobMatchingService.findJobsForResume(skills);
                                  setMatchingJobs(jobs);
                                } catch (error) {
                                  console.error('Job matching failed:', error);
                                  setError('Failed to find matching jobs. Please try again.');
                                } finally {
                                  setLoadingJobs(false);
                                }
                              }}
                              disabled={loadingJobs}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                              {loadingJobs ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Finding Jobs...
                                </>
                              ) : (
                                <>
                                  <Target className="w-4 h-4 mr-2" />
                                  Find Jobs for My Skills
                                </>
                              )}
                            </Button>
                            
                            {matchingJobs && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 space-y-3"
                              >
                                <div className="text-sm font-medium text-green-700 dark:text-green-300">
                                  Found {matchingJobs.length} matching opportunities:
                                </div>
                                {matchingJobs.slice(0, 5).map((job, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-900 dark:text-white">{job.title}</h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                          <span>📍 {job.location}</span>
                                          <span>💰 {job.salary}</span>
                                          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                            {job.match}% match
                                          </span>
                                        </div>
                                      </div>
                                      <a 
                                        href={job.url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                      >
                                        Apply →
                                      </a>
                                    </div>
                                  </motion.div>
                                ))}
                                
                                {matchingJobs.length > 5 && (
                                  <div className="text-center">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        // Show all jobs in a modal or expand the list
                                        console.log('Show all jobs:', matchingJobs);
                                      }}
                                    >
                                      View All {matchingJobs.length} Jobs
                                    </Button>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </motion.div>

                          {/* Action Buttons */}
                          <div className="flex justify-center gap-4">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setCurrentStep(0);
                                setAtsScore(null);
                                setResumeText('');
                                setJobDescription('');
                                setServiceStatus(null);
                                setMatchingJobs(null);
                              }}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Analyze Another Resume
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button 
                          onClick={() => setCurrentStep(0)}
                          variant="outline"
                        >
                          Start Over
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {error && currentStep !== 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
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
                  className="mt-4"
                >
                  <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </Layout>
  );
}