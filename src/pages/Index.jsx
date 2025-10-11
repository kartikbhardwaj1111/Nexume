import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, FileText, Users, Sparkles, BarChart3, Target, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import SplashCursor from '@/components/SplashCursor';
import FeatureGrid from '@/components/FeatureGrid';
import ProfessionalFeatures from '@/components/ProfessionalFeatures';
import DemoSection from '@/components/DemoSection';
import UnifiedDashboard from '@/components/UnifiedDashboard';
import { useAppContext } from '@/context/AppContext';
import LocalStorageManager from '@/services/storage/LocalStorageManager';

import ShinyText from '@/components/ShinyText';

export default function Index() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  // Check if user has any data to show dashboard
  const hasUserData = () => {
    const resumeData = LocalStorageManager.getResumeData();
    const lastAnalysis = LocalStorageManager.getLastAnalysis();
    const careerProgress = LocalStorageManager.getCareerProgress();
    return !!(resumeData || lastAnalysis || careerProgress);
  };

  const stats = [
    { number: 95, label: "ATS Pass Rate", suffix: "%" },
    { number: 3.2, label: "More Interview Calls", suffix: "x" },
    { number: 50000, label: "Resumes Optimized", suffix: "+" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <SplashCursor />
      {/* Enhanced Dense Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-600/40 to-purple-600/30" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/40 via-purple-400/30 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/40 via-teal-400/30 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40" />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Conditional Content - Dashboard or Landing */}
        {hasUserData() ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Tabs defaultValue="dashboard" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="landing" className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Explore</span>
                  </TabsTrigger>
                </TabsList>
                <div className="text-right">
                  <p className="text-sm text-blue-200">Welcome back!</p>
                  <p className="text-xs text-blue-300">Continue your career journey</p>
                </div>
              </div>
              
              <TabsContent value="dashboard" className="space-y-6">
                <UnifiedDashboard />
              </TabsContent>
              
              <TabsContent value="landing" className="space-y-6">
                <LandingContent 
                  navigate={navigate}
                  statsRef={statsRef}
                  statsInView={statsInView}
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                  stats={stats}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <LandingContent 
            navigate={navigate}
            statsRef={statsRef}
            statsInView={statsInView}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            stats={stats}
          />
        )}
      </div>
    </div>
  );
}

// Extracted Landing Content Component
function LandingContent({ navigate, statsRef, statsInView, containerVariants, itemVariants, stats }) {
  return (
    <>
      {/* Hero Section */}
      <motion.div
        className="text-center mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
          <motion.div className="mb-8" variants={itemVariants}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Resume Analysis
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-8 relative"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent animate-gradient-x">
                Transform Your Resume Into Interview Gold
              </span>
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              AI-powered ATS analysis that gets you noticed by recruiters. Stop wondering if your resume will pass ATS filters - get instant refinements that land interviews.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/ats-checker')}
                className="group px-10 py-6 text-lg bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300"
              >
                Analyze My Resume Now
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/career')}
                className="px-10 py-6 text-lg border-2 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 transition-all duration-300"
              >
                <Target className="w-5 h-5 mr-2" />
                Career Path
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div 
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  {statsInView && (
                    <CountUp
                      end={stat.number}
                      duration={2}
                      delay={index * 0.2}
                      decimals={stat.number % 1 !== 0 ? 1 : 0}
                    />
                  )}
                  {stat.suffix}
                </motion.div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      {/* Professional Features Section */}
      <ProfessionalFeatures onGetStarted={() => navigate('/ats-checker')} />
      
      {/* Demo Section */}
      <DemoSection onGetStarted={() => navigate('/ats-checker')} />
      

      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">

        {/* How It Works - Enhanced Animated */}
        <motion.div 
          className="text-center mb-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            ))}
          </div>

          <ShinyText 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent relative z-10"
            speed={3}
            shimmerWidth={100}
          >
            From Upload to Interview in 4 Simple Steps
          </ShinyText>
          
          <motion.p
            className="text-gray-300 mb-12 max-w-2xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Watch your resume transform with our proven 4-step process that gets results
          </motion.p>

          {/* Animated Progress Line */}
          <div className="relative mb-16">
            <motion.div 
              className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 transform -translate-y-1/2 hidden md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
              style={{ originX: 0 }}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { 
                  step: "1", 
                  title: "Upload Your Resume", 
                  desc: "Drag & drop PDF, DOCX, or paste text. Our parser extracts every detail with precision.", 
                  color: "from-blue-500 to-cyan-500",
                  icon: "📄",
                  delay: 0.6,
                  duration: "30 seconds"
                },
                { 
                  step: "2", 
                  title: "Add Job Description", 
                  desc: "Paste the target job posting. Our AI identifies required skills and keywords instantly.", 
                  color: "from-purple-500 to-pink-500",
                  icon: "🎯",
                  delay: 0.9,
                  duration: "1 minute"
                },
                { 
                  step: "3", 
                  title: "Get AI Analysis", 
                  desc: "Watch real-time analysis with animated scoring and improvement recommendations.", 
                  color: "from-green-500 to-emerald-500",
                  icon: "🤖",
                  delay: 1.2,
                  duration: "2 minutes"
                },
                { 
                  step: "4", 
                  title: "Download Optimized Resume", 
                  desc: "Get your refined resume with side-by-side comparison showing score improvements.", 
                  color: "from-orange-500 to-red-500",
                  icon: "✨",
                  delay: 1.5,
                  duration: "Instant"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: item.delay, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    rotateX: 5,
                    y: -10
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="group"
                >
                  <Card className="text-center border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm overflow-hidden relative h-full">
                    {/* Animated Background Gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    
                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white/30 rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${20 + i * 20}%`,
                          }}
                          animate={{
                            y: [0, -15, 0],
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            delay: index * 0.2 + i * 0.3
                          }}
                        />
                      ))}
                    </div>

                    <CardContent className="pt-8 pb-8 relative z-10">
                      {/* Step Number with Icon */}
                      <motion.div 
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white flex flex-col items-center justify-center mx-auto mb-6 shadow-2xl relative overflow-hidden`}
                        whileHover={{ rotate: 360, scale: 1.15 }}
                        transition={{ duration: 0.8, type: "spring" }}
                      >
                        {/* Animated Ring */}
                        <motion.div
                          className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        
                        <motion.div 
                          className="text-2xl mb-1"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          {item.icon}
                        </motion.div>
                        <div className="text-sm font-bold">{item.step}</div>
                      </motion.div>
                      
                      {/* Title with Typing Effect */}
                      <motion.h3 
                        className="font-bold text-xl mb-4 text-white"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: item.delay + 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {item.title}
                      </motion.h3>
                      
                      {/* Description with Stagger */}
                      <motion.p 
                        className="text-sm text-blue-100 leading-relaxed mb-2"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: item.delay + 0.5, duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {item.desc}
                      </motion.p>
                      
                      <motion.div
                        className="text-xs text-cyan-300 font-medium bg-cyan-500/10 px-2 py-1 rounded-full inline-block"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: item.delay + 0.7, duration: 0.4 }}
                        viewport={{ once: true }}
                      >
                        ⏱️ {item.duration}
                      </motion.div>

                      {/* Step Connection Arrow */}
                      {index < 3 && (
                        <motion.div
                          className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: item.delay + 0.8, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-white/50 text-2xl"
                          >
                            →
                          </motion.div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action with Pulse Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.7)",
                  "0 0 0 20px rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block rounded-full"
            >
              <Button
                onClick={() => navigate('/ats-checker')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
              >
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Start Your Journey
                </motion.span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="border border-white/30 shadow-2xl bg-gradient-to-r from-white/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-gradient-x" />
            
            <CardContent className="text-center py-16 relative z-10">
              <ShinyText 
                className="text-3xl md:text-4xl font-bold mb-6 text-white"
                speed={2.8}
                shimmerWidth={90}
              >
                Ready to Land Your Dream Job?
              </ShinyText>
              
              <motion.p 
                className="text-blue-100 mb-10 text-lg max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Stop letting ATS systems filter out your potential. Join 50,000+ professionals who've transformed their careers with ResumeFit.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/ats-checker')}
                  className="group px-12 py-6 text-lg bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Analyze My Resume Free
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      


      {/* Professional Features Section */}
      <ProfessionalFeatures onGetStarted={() => navigate('/ats-checker')} />
      
      {/* Demo Section */}
      <DemoSection onGetStarted={() => navigate('/ats-checker')} />
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* How It Works - Enhanced Animated */}
        <motion.div 
          className="text-center mb-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            ))}
          </div>

          <ShinyText 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent relative z-10"
            speed={3}
            shimmerWidth={100}
          >
            From Upload to Interview in 4 Simple Steps
          </ShinyText>
          
          <motion.p
            className="text-gray-300 mb-12 max-w-2xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Watch your resume transform with our proven 4-step process that gets results
          </motion.p>

          {/* Animated Progress Line */}
          <div className="relative mb-16">
            <motion.div 
              className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 transform -translate-y-1/2 hidden md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
              style={{ originX: 0 }}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { 
                  step: "1", 
                  title: "Upload Your Resume", 
                  desc: "Drag & drop PDF, DOCX, or paste text. Our parser extracts every detail with precision.", 
                  color: "from-blue-500 to-cyan-500",
                  icon: "📄",
                  delay: 0.6,
                  duration: "30 seconds"
                },
                { 
                  step: "2", 
                  title: "Add Job Description", 
                  desc: "Paste the target job posting. Our AI identifies required skills and keywords instantly.", 
                  color: "from-purple-500 to-pink-500",
                  icon: "🎯",
                  delay: 0.9,
                  duration: "1 minute"
                },
                { 
                  step: "3", 
                  title: "Get AI Analysis", 
                  desc: "Watch real-time analysis with animated scoring and improvement recommendations.", 
                  color: "from-green-500 to-emerald-500",
                  icon: "🤖",
                  delay: 1.2,
                  duration: "2 minutes"
                },
                { 
                  step: "4", 
                  title: "Download Optimized Resume", 
                  desc: "Get your refined resume with side-by-side comparison showing score improvements.", 
                  color: "from-orange-500 to-red-500",
                  icon: "✨",
                  delay: 1.5,
                  duration: "Instant"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: item.delay, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    rotateX: 5,
                    y: -10
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="group"
                >
                  <Card className="text-center border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm overflow-hidden relative h-full">
                    {/* Animated Background Gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    
                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white/30 rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${20 + i * 20}%`,
                          }}
                          animate={{
                            y: [0, -15, 0],
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            delay: index * 0.2 + i * 0.3
                          }}
                        />
                      ))}
                    </div>

                    <CardContent className="pt-8 pb-8 relative z-10">
                      {/* Step Number with Icon */}
                      <motion.div 
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white flex flex-col items-center justify-center mx-auto mb-6 shadow-2xl relative overflow-hidden`}
                        whileHover={{ rotate: 360, scale: 1.15 }}
                        transition={{ duration: 0.8, type: "spring" }}
                      >
                        {/* Animated Ring */}
                        <motion.div
                          className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        
                        <motion.div 
                          className="text-2xl mb-1"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          {item.icon}
                        </motion.div>
                        <div className="text-sm font-bold">{item.step}</div>
                      </motion.div>
                      
                      {/* Title with Typing Effect */}
                      <motion.h3 
                        className="font-bold text-xl mb-4 text-white"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: item.delay + 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {item.title}
                      </motion.h3>
                      
                      {/* Description with Stagger */}
                      <motion.p 
                        className="text-sm text-blue-100 leading-relaxed mb-2"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: item.delay + 0.5, duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {item.desc}
                      </motion.p>
                      
                      <motion.div
                        className="text-xs text-cyan-300 font-medium bg-cyan-500/10 px-2 py-1 rounded-full inline-block"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: item.delay + 0.7, duration: 0.4 }}
                        viewport={{ once: true }}
                      >
                        ⏱️ {item.duration}
                      </motion.div>

                      {/* Step Connection Arrow */}
                      {index < 3 && (
                        <motion.div
                          className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: item.delay + 0.8, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-white/50 text-2xl"
                          >
                            →
                          </motion.div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action with Pulse Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.7)",
                  "0 0 0 20px rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block rounded-full"
            >
              <Button
                onClick={() => navigate('/ats-checker')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
              >
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Start Your Journey
                </motion.span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="border border-white/30 shadow-2xl bg-gradient-to-r from-white/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-gradient-x" />
            
            <CardContent className="text-center py-16 relative z-10">
              <ShinyText 
                className="text-3xl md:text-4xl font-bold mb-6 text-white"
                speed={2.8}
                shimmerWidth={90}
              >
                Ready to Land Your Dream Job?
              </ShinyText>
              
              <motion.p 
                className="text-blue-100 mb-10 text-lg max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Stop letting ATS systems filter out your potential. Join 50,000+ professionals who've transformed their careers with ResumeFit.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/ats-checker')}
                  className="group px-12 py-6 text-lg bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Analyze My Resume Free
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </>
  );
}