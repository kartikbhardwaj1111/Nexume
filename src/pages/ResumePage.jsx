import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/FileUpload';
import { ArrowRight, ArrowLeft, FileText, AlertCircle, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { StepWizard, resumeAnalysisSteps } from '@/components/StepWizard';
import { extractTextFromFile } from '@/lib/fileParser';
import { validateResumeText } from '@/utils/validation';
import { aiServiceManager } from '@/services/ai/AIServiceManager';

export default function ResumePage() {
  const { state, setResumeText } = useAppContext();
  const [resumeInput, setResumeInput] = useState(state.resumeText);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const navigate = useNavigate();

  const updateWordCount = (text) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError('');
    
    try {
      const text = await extractTextFromFile(file);
      const validation = validateResumeText(text);
      if (!validation.isValid) {
        setError(validation.error);
        setResumeInput('');
        updateWordCount('');
        return;
      }
      setResumeInput(text);
      updateWordCount(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!resumeInput.trim()) {
      setError('Please upload a resume or enter resume text');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const validation = await aiServiceManager.validateResume(resumeInput);
      if (!validation.isValid) {
        setError(validation.error);
        setIsUploading(false);
        return;
      }
      
      setResumeText(resumeInput.trim());
      navigate('/job-description');
    } catch (err) {
      setError(err.message || 'An error occurred during resume validation.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">
        <StepWizard currentStep={2} steps={resumeAnalysisSteps} />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
            <button onClick={() => setError('')} className="hover:opacity-80 transition-opacity">
              <X className="w-4 h-4 mt-0.5" />
            </button>
          </motion.div>
        )}
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-foreground"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            Upload Your Resume
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-base max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Upload your resume file or paste the text directly. Our AI will analyze every detail to maximize your ATS compatibility.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <FileUpload
            onFileUpload={handleFileUpload}
            loading={isUploading}
            accept=".pdf,.docx,.txt"
            label="Upload Resume File"
            description="Drag and drop your resume file here, or click to browse"
            error={error}
          />

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full border border-border shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Or Paste Resume Text
                  </div>
                  {wordCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-muted-foreground bg-primary/10 px-3 py-1 rounded-full"
                    >
                      {wordCount} words
                    </motion.div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your resume text here...\n\nExample:\nJohn Doe\nSoftware Engineer\n\nExperience:\n• 5+ years developing web applications\n• Proficient in React, Node.js, Python\n• Led team of 3 developers..."
                  value={resumeInput}
                  onChange={(e) => {
                    setResumeInput(e.target.value);
                    updateWordCount(e.target.value);
                  }}
                  className="min-h-[400px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                />
                
                {resumeInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-4 text-sm text-muted-foreground"
                  >
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      Resume detected
                    </div>
                    <div>Ready for analysis</div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex justify-between mt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            onClick={() => navigate('/api-key')}
            className="group font-semibold border-border hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!resumeInput.trim()}
            className="group font-semibold bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg shadow-sm"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}