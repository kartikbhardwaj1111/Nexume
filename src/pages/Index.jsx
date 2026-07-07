import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

import Layout from '@/components/Layout';
import UnifiedDashboard from '@/components/UnifiedDashboard';
import { useAppContext } from '@/context/AppContext';
import LocalStorageManager from '../services/storage/LocalStorageManager.js';
import SplitText from '@/components/animations/SplitText';
import BlurText from '@/components/animations/BlurText';
import DecryptedText from '@/components/animations/DecryptedText';

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
      stats: "ATS-Friendly Layouts"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* Conditional Content - Dashboard or Landing */}
          {hasUserData() ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Tabs defaultValue="dashboard" className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/60 p-1 border border-border">
                    <TabsTrigger value="dashboard" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger value="landing" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground">
                      <Sparkles className="w-4 h-4" />
                      <span>Explore</span>
                    </TabsTrigger>
                  </TabsList>
                  <motion.div 
                    className="text-right hidden sm:block"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm font-semibold text-foreground">Welcome back!</p>
                    <p className="text-xs text-muted-foreground">Continue your career journey</p>
                  </motion.div>
                </div>
                
                <TabsContent value="dashboard" className="space-y-6 pt-2">
                  <UnifiedDashboard />
                </TabsContent>
                
                <TabsContent value="landing" className="space-y-6 pt-2">
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
    </Layout>
  );
}

// New Landing Content Component
function LandingContent({ navigate, heroRef, heroInView, statsRef, statsInView, featuresRef, featuresInView, containerVariants, itemVariants, stats, features }) {
  return (
    <div className="space-y-32">
      {/* Hero Section - Professional Two-Column Layout */}
      <motion.section
        ref={heroRef}
        className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div variants={itemVariants}>
              <Badge className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all shadow-none rounded-full">
                <Zap className="w-3.5 h-3.5 mr-2 text-primary" />
                Next-Generation Career Intelligence
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] text-left flex flex-col items-start">
              <span>Accelerate Your Career</span>
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mt-2 font-black">
                Powered by Advanced AI
              </span>
            </h1>
            
            <div className="text-lg text-muted-foreground max-w-xl leading-relaxed text-left">
              <BlurText text="An all-in-one professional career acceleration platform. Clean resume analyzer, matching job lists, mock interactive interviews, and progression tracks." stagger={0.012} delay={200} />
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-2 justify-start items-stretch sm:items-center"
              variants={itemVariants}
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/ats-checker')}
                className="px-8 py-6 text-base font-bold bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/templates')}
                className="px-8 py-6 text-base font-semibold border-border hover:bg-secondary rounded-xl hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2 text-muted-foreground" />
                Explore Templates
              </Button>
            </motion.div>
          </div>

          {/* Right Column: High-fidelity CSS Mockup */}
          <div className="lg:col-span-5 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-blue-500/10 rounded-3xl blur-3xl opacity-50" />
            <Card className="relative border border-border shadow-2xl rounded-2xl bg-card/65 backdrop-blur-md overflow-hidden transition-all duration-300">
              <CardHeader className="border-b border-border pb-3 bg-muted/20 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold bg-background text-muted-foreground border-border px-2 py-0.5">ats_checker_flow.js</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6 text-left">
                {/* Score Summary */}
                <div className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border border-border/50">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">ATS Score Match</p>
                    <h4 className="text-2xl font-extrabold text-foreground mt-0.5">87% <span className="text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-500/15 px-2 py-0.5 rounded ml-2">Strong Match</span></h4>
                  </div>
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-border" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-primary" strokeDasharray="87, 100" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span className="text-xs font-bold text-foreground">87%</span>
                  </div>
                </div>

                {/* Keyword Match list */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Skills Analysis</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 bg-background p-2 rounded-lg border border-border text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-foreground font-medium">React / Next.js</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-background p-2 rounded-lg border border-border text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-foreground font-medium">Tailwind CSS</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-background p-2 rounded-lg border border-border text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-foreground font-medium">TypeScript</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-background p-2 rounded-lg border border-border text-xs opacity-75">
                      <div className="w-3.5 h-3.5 rounded-full border border-yellow-500/60 flex items-center justify-center text-[10px] text-yellow-600 dark:text-yellow-400 font-bold">!</div>
                      <span className="text-foreground font-medium">Docker / CI-CD</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2.5">
                  <p className="text-xs text-muted-foreground font-semibold">Top Recommendations</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 bg-primary/5 rounded border border-primary/20 text-muted-foreground">
                      📈 Add quantitative metrics in experience bullets (+12 points)
                    </div>
                    <div className="p-2 bg-secondary/50 rounded border border-border text-muted-foreground">
                      🛠️ Include cloud certifications or DevOps skills (+8 points)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Stats Section - Clean & Elegant */}
      <motion.section 
        ref={statsRef}
        className="py-6"
        initial={{ opacity: 0, y: 30 }}
        animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.1 }}
          >
            Trusted by Professionals Worldwide
          </motion.h2>
          <motion.p 
            className="text-base text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.2 }}
          >
            Join thousands who've accelerated their careers with our AI-powered platform
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/45 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 text-primary rounded-xl flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="text-4xl font-black text-foreground mb-2">
                    {statsInView && (
                      <CountUp
                        end={stat.number}
                        duration={2.0}
                        delay={index * 0.1}
                        decimals={stat.number % 1 !== 0 ? 1 : 0}
                      />
                    )}
                    {stat.suffix}
                  </div>
                  <div className="text-muted-foreground text-sm font-semibold">{stat.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Features Section - Clean modern SaaS cards */}
      <motion.section 
        ref={featuresRef}
        className="py-6"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.1 }}
          >
            Complete Career Platform
          </motion.h2>
          <motion.p 
            className="text-base text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.2 }}
          >
            Everything you need to accelerate your career - from resume optimization to interview success
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group cursor-pointer relative"
                onClick={feature.action}
              >
                {/* Glowing neon backdrop blur */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500`} />
                
                <Card className="p-6 h-full bg-card border border-border group-hover:border-foreground/20 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl relative overflow-hidden z-10">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                      <Badge className={`bg-gradient-to-r ${feature.color} text-white hover:${feature.color} text-[10px] font-bold shadow-none px-2.5 py-0.5 border-0`}>
                        {feature.stats}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm text-left">{feature.description}</p>
                  </div>
                  
                  <div className="pt-6">
                    <Button 
                      className={`w-full bg-secondary text-secondary-foreground group-hover:bg-gradient-to-r group-hover:${feature.color} group-hover:text-white font-semibold border border-border group-hover:border-0 shadow-none transition-all duration-300`}
                      onClick={(e) => {
                        e.stopPropagation();
                        feature.action();
                      }}
                    >
                      <span>{feature.actionText}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
        className="py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-foreground">
            How It Works
          </h2>
          <motion.p
            className="text-base text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Simple 3-step process to transform your career
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Core Features */}
          <div className="space-y-4">
            {[
              {
                icon: Brain,
                title: "AI Resume Analysis",
                desc: "Get instant ATS compatibility scores and optimization suggestions",
                action: () => navigate('/ats-checker'),
                color: "bg-primary/10 text-primary border-primary/20"
              },
              {
                icon: Target,
                title: "Job Matching Engine",
                desc: "Find perfect job matches based on your skills and experience",
                action: () => navigate('/job-analysis'),
                color: "bg-primary/10 text-primary border-primary/20"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 4 }}
                  className="group cursor-pointer"
                  onClick={item.action}
                >
                  <Card className="p-4 bg-card border border-border shadow-sm hover:border-primary/45 transition-all duration-300">
                    <div className="flex items-center space-x-4 text-left">
                      <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground mb-0.5">{item.title}</h3>
                        <p className="text-muted-foreground text-xs truncate">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column - Advanced Features */}
          <div className="space-y-4">
            {[
              {
                icon: Users,
                title: "Interview Practice",
                desc: "Mock interviews with AI feedback and company-specific prep",
                action: () => navigate('/interview-prep'),
                color: "bg-primary/10 text-primary border-primary/20"
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                desc: "Track your improvement with detailed performance metrics",
                action: () => navigate('/analytics'),
                color: "bg-primary/10 text-primary border-primary/20"
              },
              {
                icon: FileText,
                title: "Professional Templates",
                desc: "ATS-optimized resume templates designed by experts",
                action: () => navigate('/templates'),
                color: "bg-primary/10 text-primary border-primary/20"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ x: -4 }}
                  className="group cursor-pointer"
                  onClick={item.action}
                >
                  <Card className="p-4 bg-card border border-border shadow-sm hover:border-primary/45 transition-all duration-300">
                    <div className="flex items-center space-x-4 text-left">
                      <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground mb-0.5">{item.title}</h3>
                        <p className="text-muted-foreground text-xs truncate">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Center */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 bg-muted/40 border border-border/80 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-left">
            <div>
              <h3 className="text-lg font-bold text-foreground">Start Your Career Transformation</h3>
              <p className="text-sm text-muted-foreground">Select an option to immediately test the platform.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/ats-checker')}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg shadow-sm"
              >
                Analyze Resume
              </Button>
              <Button 
                variant="outline"
                className="border-border hover:bg-secondary text-foreground font-semibold px-5 py-2.5 rounded-lg"
                onClick={() => navigate('/job-analysis')}
              >
                Find Jobs
              </Button>
              <Button 
                variant="outline"
                className="border-border hover:bg-secondary text-foreground font-semibold px-5 py-2.5 rounded-lg"
                onClick={() => navigate('/interview-prep')}
              >
                Practice Interview
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="border border-border shadow-xl bg-gradient-to-tr from-primary/5 via-background to-primary/5 overflow-hidden relative rounded-2xl">
          <CardContent className="py-16 px-6 relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Ready to Transform Your Career?
            </h2>
            
            <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who have accelerated their careers and bypassed recruiters with AI-powered insights.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-6">
              <Button 
                size="lg" 
                onClick={() => navigate('/ats-checker')}
                className="px-10 py-6 text-base font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl hover:scale-[1.01] active:scale-100 transition-all flex items-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>No Sign-up Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}