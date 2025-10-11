import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/FileUpload';
import { ArrowRight, ArrowLeft, FileText } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StepWizard, resumeAnalysisSteps } from '@/components/StepWizard';
import { extractTextFromFile } from '@/lib/fileParser';

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
      setResumeInput(text);
      updateWordCount(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    if (!resumeInput.trim()) {
      setError('Please upload a resume or enter resume text');
      return;
    }
    
    setResumeText(resumeInput.trim());
    navigate('/job-description');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
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
        <StepWizard currentStep={2} steps={resumeAnalysisSteps} />
        
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
            📄 Upload Your Resume
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Upload your resume file or paste the text directly. Our AI will analyze every detail to maximize your ATS compatibility.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-0 shadow-xl bg-card/80 backdrop-blur-sm">
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
                      className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            onClick={() => navigate('/api-key')}
            className="group hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!resumeInput.trim()}
            className="group hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-primary-glow"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}