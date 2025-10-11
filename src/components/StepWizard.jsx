import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

export function StepWizard({ currentStep, steps, className = "" }) {
  return (
    <div className={`w-full max-w-4xl mx-auto mb-8 ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-muted z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-glow"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <motion.div
              key={step.id}
              className="flex flex-col items-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Step Circle */}
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-500 shadow-lg
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-success to-emerald-500 text-white shadow-success/25' 
                    : isCurrent 
                      ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-primary/25 animate-pulse-glow' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                animate={isCurrent ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(99, 102, 241, 0.4)",
                    "0 0 0 10px rgba(99, 102, 241, 0)",
                    "0 0 0 0 rgba(99, 102, 241, 0)"
                  ]
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: isCurrent ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <AnimatePresence>
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stepNumber}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Step Label */}
              <motion.div
                className="mt-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <div className={`
                  text-sm font-medium transition-colors duration-300
                  ${isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}
                `}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1 max-w-20 leading-tight">
                  {step.description}
                </div>
              </motion.div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute top-6 -right-6 text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current Step Info */}
      <motion.div
        className="mt-8 text-center"
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {steps[currentStep - 1]?.title}
        </h2>
        <p className="text-muted-foreground">
          {steps[currentStep - 1]?.longDescription}
        </p>
      </motion.div>
    </div>
  );
}

// Usage example with step definitions
export const resumeAnalysisSteps = [
  {
    id: 'api-key',
    title: 'API Key',
    description: 'Setup',
    longDescription: 'Enter your Gemini API key to enable AI-powered analysis'
  },
  {
    id: 'resume',
    title: 'Resume',
    description: 'Upload',
    longDescription: 'Upload your resume or paste the text directly'
  },
  {
    id: 'job-description',
    title: 'Job Description',
    description: 'Target Role',
    longDescription: 'Provide the job description you want to match'
  },
  {
    id: 'analysis',
    title: 'Analysis',
    description: 'AI Review',
    longDescription: 'Get detailed AI-powered analysis and recommendations'
  }
];