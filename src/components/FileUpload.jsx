import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FileUpload({
  onFileUpload,
  accept,
  label,
  description,
  loading,
  error
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file && isValidFile(file)) {
      setSelectedFile(file);
      await simulateUpload(file);
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      await simulateUpload(file);
    }
  };

  const simulateUpload = async (file) => {
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    await onFileUpload(file);
  };

  const isValidFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = accept.split(',').map(type => type.trim());
    
    if (file.size > maxSize) {
      return false;
    }

    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop();
    
    return allowedTypes.some(type => 
      type === fileType || type === fileExtension
    );
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          className={`
            relative overflow-hidden transition-all duration-500 cursor-pointer group
            border-2 border-dashed backdrop-blur-sm
            ${isDragOver 
              ? 'border-primary bg-gradient-to-br from-primary/20 to-primary-glow/10 shadow-2xl scale-[1.02] animate-pulse-glow' 
              : selectedFile 
                ? 'border-success bg-gradient-to-br from-success/20 to-success/10 shadow-xl' 
                : 'border-border/60 hover:border-primary/70 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/5 hover:shadow-lg'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && !loading && fileInputRef.current?.click()}
        >
          <CardContent className="p-8 relative">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
            />
            
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-br from-success/20 to-success/30 border border-success/30"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <FileText className="h-6 w-6 text-success" />
                    </motion.div>
                    <div>
                      <motion.p 
                        className="font-semibold text-foreground text-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {selectedFile.name}
                      </motion.p>
                      <motion.p 
                        className="text-muted-foreground flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        {uploadProgress === 100 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 text-success"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Ready
                          </motion.span>
                        )}
                      </motion.p>
                      
                      {/* Progress Bar */}
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="mt-2 h-2 bg-muted rounded-full overflow-hidden"
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-primary-glow"
                            initial={{ width: '0%' }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-muted-foreground hover:text-destructive rounded-xl h-10 w-10 transition-all duration-300 hover:bg-destructive/10 hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-6"
                >
                  <motion.div 
                    className={`
                      mx-auto w-20 h-20 rounded-2xl flex items-center justify-center
                      transition-all duration-500 group-hover:scale-110
                      ${isDragOver 
                        ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-2xl animate-bounce-in' 
                        : 'bg-gradient-to-br from-primary/10 to-primary-glow/10 text-primary group-hover:from-primary/20 group-hover:to-primary-glow/20'
                      }
                    `}
                    animate={isDragOver ? { 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Upload className={`transition-all duration-300 ${isDragOver ? 'h-8 w-8' : 'h-7 w-7'}`} />
                  </motion.div>
                  
                  <div>
                    <motion.h3 
                      className="font-bold text-xl text-foreground mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {label}
                    </motion.h3>
                    <motion.p 
                      className="text-muted-foreground mb-3 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {description}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-muted-foreground font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Parsing PDF...
                        </span>
                      ) : (
                        'Drag & drop or click to browse • Max 10MB'
                      )}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
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
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}