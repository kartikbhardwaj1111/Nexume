import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Shield, 
  Target, 
  BarChart3, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Award
} from 'lucide-react';

export default function ProfessionalFeatures({ onGetStarted }) {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Analysis",
      description: "Get your ATS score in under 30 seconds with our optimized AI engine",
      color: "from-yellow-500 to-orange-500",
      stats: "< 30s",
      benefit: "Save hours of manual checking"
    },
    {
      icon: Shield,
      title: "100% Privacy Guaranteed",
      description: "Your resume data never leaves your device. Complete privacy protection",
      color: "from-green-500 to-emerald-500",
      stats: "0% Data Stored",
      benefit: "Complete confidentiality"
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Advanced AI matches your skills against job requirements with 95% accuracy",
      color: "from-blue-500 to-cyan-500",
      stats: "95% Accuracy",
      benefit: "Higher interview rates"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Get comprehensive breakdowns of skills, experience, and improvement areas",
      color: "from-purple-500 to-pink-500",
      stats: "4-Pillar System",
      benefit: "Actionable insights"
    }
  ];

  const benefits = [
    { icon: CheckCircle, text: "Instant ATS compatibility score" },
    { icon: FileText, text: "Detailed skill gap analysis" },
    { icon: Target, text: "Job-specific optimization tips" },
    { icon: Award, text: "Professional formatting suggestions" },
    { icon: Users, text: "Recruiter-approved recommendations" },
    { icon: Clock, text: "Real-time progress tracking" }
  ];

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              Professional ATS Analysis
            </Badge>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Why Choose Our ATS Checker?
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who've transformed their job search with our AI-powered resume optimization platform
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-500 overflow-hidden relative">
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
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

                <CardContent className="p-6 relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-4 shadow-2xl`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8" />
                  </motion.div>

                  {/* Stats Badge */}
                  <Badge variant="outline" className="mb-3 text-xs bg-white/10 border-white/20 text-white">
                    {feature.stats}
                  </Badge>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-blue-100 text-sm leading-relaxed mb-3">
                    {feature.description}
                  </p>

                  <div className="text-xs text-cyan-300 font-medium bg-cyan-500/10 px-2 py-1 rounded-full inline-block">
                    ✨ {feature.benefit}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="border border-white/20 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            
            <CardContent className="p-8 relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Everything You Need to Land Your Dream Job
                </h3>
                <p className="text-blue-100">
                  Comprehensive resume analysis with actionable insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <benefit.icon className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white text-sm">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onGetStarted}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 px-8 py-4 text-lg"
                  >
                    Start Free Analysis
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </motion.div>
                
                <p className="text-xs text-blue-200 mt-3">
                  No signup required • Results in 30 seconds • 100% Free
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}