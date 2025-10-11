import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import JobUrlInput from '../components/JobUrlInput';
import JobPreview from '../components/JobPreview';
import { 
  Briefcase,
  FileText,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/Layout';

const JobAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState('input'); // input, preview, analysis
  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Check if we have resume data from previous steps
  const resumeData = location.state?.resumeData;

  useEffect(() => {
    // If no resume data, redirect to resume upload
    if (!resumeData && currentStep === 'analysis') {
      toast.error('Please upload your resume first');
      navigate('/resume');
    }
  }, [resumeData, currentStep, navigate]);

  const handleJobExtracted = (extractedJobData) => {
    setJobData(extractedJobData);
    setCurrentStep('preview');
    setError(null);
    
    toast.success('Job details extracted successfully!');
  };

  const handleJobConfirmed = async (confirmedJobData) => {
    if (!resumeData) {
      toast.error('Resume data is required for analysis');
      navigate('/resume', { 
        state: { 
          returnTo: '/job-analysis',
          jobData: confirmedJobData 
        }
      });
      return;
    }

    setIsLoading(true);
    setCurrentStep('analysis');
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Perform job-tailored resume analysis
      const { analyzeResume } = await import('../lib/analyzeResume.js');
      
      const analysisResult = await analyzeResume(
        resumeData.content,
        confirmedJobData.data.description,
        {
          jobTitle: confirmedJobData.data.title,
          company: confirmedJobData.data.company,
          requiredSkills: confirmedJobData.data.skills,
          requirements: confirmedJobData.data.requirements,
          experienceYears: confirmedJobData.data.experienceYears
        }
      );

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Navigate to results with both job and analysis data
      setTimeout(() => {
        navigate('/report', {
          state: {
            analysisResult,
            jobData: confirmedJobData.data,
            resumeData,
            analysisType: 'job-tailored',
            jobSpecificAnalysis: true
          }
        });
      }, 1000);

    } catch (error) {
      console.error('Job analysis failed:', error);
      setError('Failed to analyze resume against job requirements. Please try again.');
      setIsLoading(false);
      setCurrentStep('preview');
      toast.error('Analysis failed. Please try again.');
    }
  };

  const handleJobEdit = (jobDataToEdit) => {
    setCurrentStep('input');
    // Could pre-populate the form with existing data
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleStartOver = () => {
    setCurrentStep('input');
    setJobData(null);
    setError(null);
    setAnalysisProgress(0);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'input', label: 'Job Input', icon: Briefcase },
      { id: 'preview', label: 'Preview', icon: FileText },
      { id: 'analysis', label: 'Analysis', icon: BarChart3 }
    ];

    return (
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center space-x-2">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${isActive ? 'border-blue-500 bg-blue-500 text-white' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                    'border-gray-300 bg-white text-gray-400'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-blue-600' : 
                  isCompleted ? 'text-green-600' : 
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderInputStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Job-Tailored Resume Analysis</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized recommendations by analyzing your resume against a specific job posting. 
          Enter a job URL or paste the job description to get started.
        </p>
      </div>

      <JobUrlInput
        onJobExtracted={handleJobExtracted}
        onError={handleError}
        isLoading={isLoading}
      />

      {error && (
        <Alert className="border-red-500">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!resumeData && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>No resume detected. You'll need to upload your resume for job-tailored analysis.</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/resume')}
              >
                Upload Resume First
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Review Job Details</h1>
        <p className="text-muted-foreground">
          Please review the extracted job information before proceeding with the analysis
        </p>
      </div>

      <JobPreview
        jobData={jobData}
        onConfirm={handleJobConfirmed}
        onEdit={handleJobEdit}
        isLoading={isLoading}
      />

      <div className="flex justify-center">
        <Button variant="outline" onClick={handleStartOver}>
          Start Over
        </Button>
      </div>
    </div>
  );

  const renderAnalysisStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-500" />
          Analyzing Your Resume
        </h1>
        <p className="text-muted-foreground">
          Comparing your resume against the job requirements...
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Analysis in Progress</CardTitle>
          <CardDescription className="text-center">
            This may take a few moments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={analysisProgress} className="w-full" />
          <div className="text-center text-sm text-muted-foreground">
            {analysisProgress < 30 && "Extracting job requirements..."}
            {analysisProgress >= 30 && analysisProgress < 60 && "Analyzing your skills..."}
            {analysisProgress >= 60 && analysisProgress < 90 && "Generating recommendations..."}
            {analysisProgress >= 90 && "Finalizing analysis..."}
          </div>
        </CardContent>
      </Card>

      {jobData && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-sm">Analyzing Against</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{jobData.data.title}</p>
              <p className="text-sm text-muted-foreground">{jobData.data.company}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{jobData.data.experienceYears} years exp.</Badge>
                <Badge variant="outline">{jobData.data.skills?.length || 0} skills</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Layout customBreadcrumbs={[
      { path: '/', label: 'Home' },
      { path: '/job-analysis', label: 'Job Analysis' }
    ]}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {renderStepIndicator()}
          
          <div className="max-w-4xl mx-auto">
            {currentStep === 'input' && renderInputStep()}
            {currentStep === 'preview' && renderPreviewStep()}
            {currentStep === 'analysis' && renderAnalysisStep()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobAnalysisPage;