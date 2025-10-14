import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  Sparkles, 
  LayoutDashboard,
  Brain,
  Target,
  Award,
  Briefcase,
  FileText,
  BarChart3,
  Globe,
  Clock
} from 'lucide-react';

import SplashCursor from '@/components/SplashCursor';
import UnifiedDashboard from '@/components/UnifiedDashboard';
import { useAppContext } from '@/context/AppContext';
import LocalStorageManager from '../services/storage/LocalStorageManager.js';
import ShinyText from '@/components/ShinyText';

export default function Index() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true });
  
  // Check if user has any data to show dashboard
  const hasUserData = () => {
    const resumeData = LocalStorageManager.getResumeData();
    const lastAnalysis = LocalStorageManager.getLastAnalysis();
    const careerProgress = LocalStorageManager.getCareerProgress();
    return !!(resumeData || lastAnalysis || careerProgress);
  };

  const stats = [
    { number: 98, label: "ATS Success Rate", suffix: "%", icon: Shield },
    { number: 4.2, label: "More Interviews", suffix: "x", icon: TrendingUp },
    { number: 75000, label: "Careers Transformed", suffix: "+", icon: Users },
    { number: 24, label: "Average Time Saved", suffix: "h", icon: Clock }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered ATS Analysis",
      description: "Advanced machine learning algorithms analyze your resume against 1000+ job requirements with 98% ATS success rate",
      color: "from-blue-500 to-cyan-500",
      action: () => navigate('/ats-checker'),
      actionText: "Check Resume",
      stats: "98% Success Rate"
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "AI-powered job recommendations tailored to your skills, with special focus on India's growing tech market",
      color: "from-purple-500 to-pink-500",
      action: () => navigate('/job-analysis'),
      actionText: "Find Jobs",
      stats: "75K+ Jobs Matched"
    },
    {
      icon: TrendingUp,
      title: "Career Progression",
      description: "Track your career growth with personalized roadmaps, skills gap analysis, and milestone tracking",
      color: "from-green-500 to-emerald-500",
      action: () => navigate('/career'),
      actionText: "Plan Career",
      stats: "4.2x More Interviews"
    },
    {
      icon: Users,
      title: "Interview Preparation",
      description: "Practice with mock interviews, get AI feedback, and prepare for company-specific questions",
      color: "from-orange-500 to-red-500",
      action: () => navigate('/interview-prep'),
      actionText: "Start Practice",
      stats: "24h Time Saved"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your progress with detailed analytics, performance metrics, and improvement insights",
      color: "from-indigo-500 to-purple-500",
      action: () => navigate('/analytics'),
      actionText: "View Analytics",
      stats: "Real-time Insights"
    },
    {
      icon: FileText,
      title: "Professional Templates",
      description: "Choose from ATS-optimized resume templates designed by professionals for maximum impact",
      color: "from-pink-500 to-rose-500",
      action: () => navigate('/templates'),
      actionText: "Browse Templates",
      stats: "50+ Templates"
    }
  ];

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }), []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <SplashCursor />
      {/* Enhanced Dense Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-600/40 to-purple-600/30" />
        
        {/* Static gradient orbs for better performance */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/30 via-teal-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/20 via-pink-400/15 to-transparent rounded-full blur-3xl" />
        
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
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/10 backdrop-blur-sm border-white/20">
                  <TabsTrigger value="dashboard" className="flex items-center space-x-2 data-[state=active]:bg-white/20">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="landing" className="flex items-center space-x-2 data-[state=active]:bg-white/20">
                    <Sparkles className="w-4 h-4" />
                    <span>Explore</span>
                  </TabsTrigger>
                </TabsList>
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-lg font-semibold text-blue-100">Welcome back!</p>
                  <p className="text-sm text-blue-300">Continue your career journey</p>
                </motion.div>
              </div>
              
              <TabsContent value="dashboard" className="space-y-6">
                <UnifiedDashboard />
              </TabsContent>
              
              <TabsContent value="landing" className="space-y-6">
                <LandingContent 
                  navigate={navigate}
                  heroRef={heroRef}
                  heroInView={heroInView}
                  statsRef={statsRef}
                  statsInView={statsInView}
                  featuresRef={featuresRef}
                  featuresInView={featuresInView}
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                  stats={stats}
                  features={features}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <LandingContent 
            navigate={navigate}
            heroRef={heroRef}
            heroInView={heroInView}
            statsRef={statsRef}
            statsInView={statsInView}
            featuresRef={featuresRef}
            featuresInView={featuresInView}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            stats={stats}
            features={features}
          />
        )}
      </div>
    </div>
  );
}

// New Landing Content Component
function LandingContent({ navigate, heroRef, heroInView, statsRef, statsInView, featuresRef, featuresInView, containerVariants, itemVariants, stats, features }) {
  return (
    <>
      {/* Hero Section - Completely Redesigned */}
      <motion.section
        ref={heroRef}
        className="text-center mb-32 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 hover:scale-110 transition-all duration-300 backdrop-blur-sm">
              <Zap className="w-5 h-5 mr-3" />
              Next-Generation Career Intelligence
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-black mb-8 relative leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Career Success
            </span>
            <br />
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light mb-12"
            variants={itemVariants}
          >
            Complete career platform with AI-powered resume analysis, smart job matching, interview prep, and career progression tracking.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30" />
            <Button 
              size="lg" 
              onClick={() => navigate('/ats-checker')}
              className="relative px-12 py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-2xl border-0 rounded-2xl transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Your Transformation
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/templates')}
            className="px-12 py-8 text-xl font-semibold border-2 border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <FileText className="w-6 h-6 mr-3" />
            Explore Templates
          </Button>
        </motion.div>
      </motion.section>

      {/* Stats Section - Enhanced */}
      <motion.section 
        ref={statsRef}
        className="mb-32"
        initial={{ opacity: 0, y: 50 }}
        animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Trusted by Professionals Worldwide
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-200 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            Join thousands who've accelerated their careers with our AI-powered platform
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.8 }}
                transition={{ delay: index * 0.1 + 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="p-8 bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-300 group-hover:shadow-2xl">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3"
                    initial={{ scale: 0 }}
                    animate={statsInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: index * 0.2 + 0.8, duration: 0.6 }}
                  >
                    {statsInView && (
                      <CountUp
                        end={stat.number}
                        duration={2.5}
                        delay={index * 0.2}
                        decimals={stat.number % 1 !== 0 ? 1 : 0}
                      />
                    )}
                    {stat.suffix}
                  </motion.div>
                  <div className="text-white font-semibold text-lg">{stat.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Features Section - Completely New */}
      <motion.section 
        ref={featuresRef}
        className="mb-32"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Complete Career Platform
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4 }}
          >
            Everything you need to accelerate your career - from resume optimization to interview success
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={featuresInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -15 }}
                transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8
                }}
                className="group cursor-pointer"
                onClick={feature.action}
              >
                <Card className="p-8 h-full bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-300 relative overflow-hidden">
                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  {/* Simple Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <Badge className={`bg-gradient-to-r ${feature.color} text-white border-0 text-xs`}>
                        {feature.stats}
                      </Badge>
                    </div>
                    
                    <p className="text-blue-100 leading-relaxed mb-6 text-sm">{feature.description}</p>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 border-0 text-white font-semibold transition-opacity duration-200`}
                      onClick={(e) => {
                        e.stopPropagation();
                        feature.action();
                      }}
                    >
                      {feature.actionText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Interactive Platform Overview */}
      <motion.section 
        className="mb-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            How It Works
          </h2>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Simple 3-step process to transform your career
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Core Features */}
          <div className="space-y-6">
            {[
              {
                icon: Brain,
                title: "AI Resume Analysis",
                desc: "Get instant ATS compatibility scores and optimization suggestions",
                action: () => navigate('/ats-checker'),
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Target,
                title: "Job Matching Engine",
                desc: "Find perfect job matches based on your skills and experience",
                action: () => navigate('/job-analysis'),
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Career Roadmaps",
                desc: "Plan your career progression with personalized milestones",
                action: () => navigate('/career'),
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  className="group cursor-pointer"
                  onClick={item.action}
                >
                  <Card className="p-6 bg-gradient-to-r from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-blue-100 text-sm">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column - Advanced Features */}
          <div className="space-y-6">
            {[
              {
                icon: Users,
                title: "Interview Practice",
                desc: "Mock interviews with AI feedback and company-specific prep",
                action: () => navigate('/interview-prep'),
                color: "from-orange-500 to-red-500"
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                desc: "Track your improvement with detailed performance metrics",
                action: () => navigate('/analytics'),
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: FileText,
                title: "Professional Templates",
                desc: "ATS-optimized resume templates designed by experts",
                action: () => navigate('/templates'),
                color: "from-pink-500 to-rose-500"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ x: -5 }}
                  className="group cursor-pointer"
                  onClick={item.action}
                >
                  <Card className="p-6 bg-gradient-to-l from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-blue-100 text-sm">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Center */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-r from-white/10 via-blue-500/10 to-purple-500/10 border-white/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Start Your Career Transformation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3"
                onClick={() => navigate('/ats-checker')}
              >
                <Brain className="w-5 h-5 mr-2" />
                Analyze Resume
              </Button>
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold py-3"
                onClick={() => navigate('/job-analysis')}
              >
                <Target className="w-5 h-5 mr-2" />
                Find Jobs
              </Button>
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold py-3"
                onClick={() => navigate('/interview-prep')}
              >
                <Users className="w-5 h-5 mr-2" />
                Practice Interview
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.section>

      {/* Final CTA - Optimized */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="border border-white/30 shadow-2xl bg-gradient-to-br from-white/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          
          <CardContent className="py-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Ready to Transform Your Career?
            </h2>
            
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join 75,000+ professionals who've accelerated their careers with AI-powered insights
            </p>
            
            <div className="space-y-6">
              <Button 
                size="lg" 
                onClick={() => navigate('/ats-checker')}
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-2xl border-0 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Start Free Analysis
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No Sign-up Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </>
  );
}