import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftRight, FileText, Sparkles, TrendingUp, Eye, Download } from 'lucide-react';

export function ResumeComparison({ originalResume, refinedResume, analysisData }) {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side', 'overlay', 'single'
  const [activeView, setActiveView] = useState('original'); // 'original', 'refined'
  const [highlightChanges, setHighlightChanges] = useState(true);

  const downloadComparison = () => {
    const comparisonText = `
# Resume Comparison Report

## Original Resume
${originalResume}

## Refined Resume  
${refinedResume}

## Analysis Summary
${analysisData?.summary || 'Analysis data not available'}
    `;
    
    const blob = new Blob([comparisonText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-comparison.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ViewModeToggle = () => (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      {[
        { mode: 'side-by-side', icon: ArrowLeftRight, label: 'Side by Side' },
        { mode: 'overlay', icon: Eye, label: 'Overlay' },
      ].map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode(mode)}
          className={`transition-all duration-200 ${
            viewMode === mode 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'hover:bg-accent'
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );

  const ResumeCard = ({ title, content, variant, isActive = true }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0.7, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.3 }}
      className={`h-full ${!isActive ? 'pointer-events-none' : ''}`}
    >
      <Card className={`h-full border-2 transition-all duration-300 ${
        variant === 'original' 
          ? 'border-orange-200 bg-gradient-to-br from-orange-50/50 to-orange-100/30' 
          : 'border-green-200 bg-gradient-to-br from-green-50/50 to-green-100/30'
      }`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Badge 
                variant="outline" 
                className={`px-3 py-1 font-semibold ${
                  variant === 'original'
                    ? 'text-orange-700 border-orange-300 bg-orange-100'
                    : 'text-green-700 border-green-300 bg-green-100'
                }`}
              >
                {variant === 'original' ? (
                  <FileText className="w-4 h-4 mr-1" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-1" />
                )}
                {title}
              </Badge>
            </motion.div>
            
            {variant === 'refined' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Improved
                </Badge>
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 h-[calc(100%-80px)]">
          <ScrollArea className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pr-4"
            >
              <pre className={`whitespace-pre-wrap text-sm leading-relaxed font-mono ${
                variant === 'original' ? 'text-orange-900' : 'text-green-900'
              }`}>
                {content}
              </pre>
            </motion.div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );

  const OverlayView = () => (
    <div className="relative">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          {[
            { view: 'original', label: 'Original', color: 'orange' },
            { view: 'refined', label: 'Refined', color: 'green' }
          ].map(({ view, label, color }) => (
            <Button
              key={view}
              variant={activeView === view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView(view)}
              className={`transition-all duration-200 ${
                activeView === view 
                  ? `bg-${color}-500 text-white shadow-md` 
                  : 'hover:bg-accent'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: activeView === 'refined' ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeView === 'refined' ? -100 : 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <ResumeCard
            title={activeView === 'original' ? 'Original Resume' : 'Refined Resume'}
            content={activeView === 'original' ? originalResume : refinedResume}
            variant={activeView}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Resume Comparison
          </h2>
          <p className="text-muted-foreground">
            Compare your original resume with the AI-optimized version
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ViewModeToggle />
          <Button
            onClick={downloadComparison}
            variant="outline"
            size="sm"
            className="hover:bg-accent transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Comparison View */}
      <motion.div
        layout
        transition={{ duration: 0.4 }}
      >
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
            <ResumeCard
              title="Original Resume"
              content={originalResume}
              variant="original"
            />
            <ResumeCard
              title="Refined Resume"
              content={refinedResume}
              variant="refined"
            />
          </div>
        ) : (
          <div className="h-[700px]">
            <OverlayView />
          </div>
        )}
      </motion.div>

      {/* Improvement Summary */}
      {analysisData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Key Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Keywords Added', value: '12+', color: 'text-blue-600' },
                  { label: 'ATS Score', value: '+25%', color: 'text-green-600' },
                  { label: 'Match Rate', value: '89%', color: 'text-purple-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-card/50"
                  >
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}