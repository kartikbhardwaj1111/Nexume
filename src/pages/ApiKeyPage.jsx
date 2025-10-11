import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, ArrowRight, ExternalLink, Shield, Zap } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StepWizard, resumeAnalysisSteps } from '@/components/StepWizard';

export default function ApiKeyPage() {
  const { state, setApiKey } = useAppContext();
  const [inputKey, setInputKey] = useState(state.apiKey);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }

    if (!inputKey.startsWith('AIza')) {
      setError('Please enter a valid Gemini API key (starts with "AIza")');
      return;
    }

    setIsValidating(true);
    setError('');

    // Simulate API key validation
    await new Promise(resolve => setTimeout(resolve, 1500));

    setApiKey(inputKey.trim());
    navigate('/resume');
  };

  const features = [
    {
      icon: Shield,
      title: "100% Secure & Private",
      description: "Your data stays on your device. We never store or share your information."
    },
    {
      icon: Zap,
      title: "Lightning-Fast Analysis",
      description: "Get detailed ATS compatibility scores and improvements in under 30 seconds."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
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
        {/* Step Wizard */}
        <StepWizard currentStep={1} steps={resumeAnalysisSteps} />
        
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Main Form */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              
              <CardHeader className="text-center space-y-6 relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-full flex items-center justify-center mx-auto"
                >
                  <Key className="w-10 h-10 text-primary" />
                </motion.div>
                
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                      🚀 Power Up Your Resume
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-3 text-base">
                      Connect your AI engine to unlock professional resume insights that get you hired
                    </CardDescription>
                  </motion.div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Label htmlFor="apiKey" className="text-sm font-medium">
                      Gemini API Key
                    </Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="AIzaSy..."
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02] pr-12"
                        disabled={isValidating}
                      />
                      {inputKey && inputKey.startsWith('AIza') && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                            <motion.div
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              ✓
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full group bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl py-6 text-lg"
                      disabled={isValidating}
                    >
                      {isValidating ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Validating...
                        </motion.div>
                      ) : (
                        <>
                          Continue
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-glow transition-colors duration-200 inline-flex items-center gap-1 group"
                      whileHover={{ scale: 1.05 }}
                    >
                      Get your free Gemini API key
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </motion.a>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Sidebar */}
          <motion.div
            className="w-full max-w-md space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center lg:text-left">
              <motion.h3 
                className="text-2xl font-bold text-foreground mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                🎯 What You'll Get
              </motion.h3>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Transform your resume with AI-powered insights that recruiters love
              </motion.p>
            </div>

            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="border-0 shadow-lg bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}