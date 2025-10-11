import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShinyText from './ShinyText';

const FeatureGrid = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const canvasRef = useRef(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered ATS Analysis",
      description: "Our advanced algorithms scan your resume like real ATS systems, identifying exactly what recruiters see and miss.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Target,
      title: "4-Pillar Scoring System", 
      description: "Get precise scores for Skills (40pts), Experience (30pts), Tools (20pts), and Education (10pts) with mathematical accuracy.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: TrendingUp,
      title: "Instant Resume Refinement",
      description: "Watch your resume transform in real-time with AI-powered suggestions that boost your ATS compatibility score.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Zap,
      title: "Side-by-Side Comparison",
      description: "See exactly what changed with animated highlights showing improvements in keywords, formatting, and content.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10"
    }
  ];

  // Simple fluid animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create flowing gradient effect
      const gradient = ctx.createRadialGradient(
        canvas.width/2 + Math.sin(time) * 100,
        canvas.height/2 + Math.cos(time * 0.7) * 50,
        0,
        canvas.width/2,
        canvas.height/2,
        Math.max(canvas.width, canvas.height)
      );
      
      gradient.addColorStop(0, `rgba(${120 + Math.sin(time) * 50}, ${80 + Math.cos(time * 1.2) * 40}, ${200 + Math.sin(time * 0.8) * 30}, 0.1)`);
      gradient.addColorStop(0.5, `rgba(${60 + Math.cos(time * 0.9) * 30}, ${120 + Math.sin(time * 1.1) * 40}, ${180 + Math.cos(time) * 50}, 0.05)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <ShinyText 
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          speed={2.5}
          shimmerWidth={80}
        >
          Why ResumeFit Beats The Competition
        </ShinyText>
        <motion.p 
          className="text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Proven features that get your resume past ATS filters and into human hands
        </motion.p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`relative p-6 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 ${
              activeFeature === index ? 'scale-105 shadow-2xl' : 'hover:scale-102'
            }`}
            style={{
              background: activeFeature === index 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)'
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setActiveFeature(index)}
            whileHover={{ y: -5 }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 ${feature.bgColor} opacity-50`} />
            
            {/* Content */}
            <div className="relative z-10">
              <motion.div
                className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-bold text-white mb-3"
                animate={{ 
                  scale: activeFeature === index ? 1.05 : 1,
                  color: activeFeature === index ? '#ffffff' : '#e5e7eb'
                }}
                transition={{ duration: 0.3 }}
              >
                {feature.title}
              </motion.h3>
              
              <motion.p 
                className="text-gray-300 text-sm leading-relaxed"
                animate={{ 
                  opacity: activeFeature === index ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
              >
                {feature.description}
              </motion.p>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5
              }}
            />
            
            <motion.div
              className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.3
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div 
        className="text-center mt-12 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-100 hover:to-white px-8 py-3 text-lg font-semibold shadow-xl"
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
      </motion.div>
    </div>
  );
};

export default FeatureGrid;