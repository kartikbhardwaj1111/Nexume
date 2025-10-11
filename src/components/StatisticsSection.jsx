import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Zap } from 'lucide-react';
import ShinyText from './ShinyText';

export default function StatisticsSection() {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const metrics = [
    {
      icon: TrendingUp,
      label: "ATS Pass Rate",
      value: 95,
      suffix: "%",
      description: "Resumes optimized with ResumeFit pass ATS screening",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      label: "More Interview Calls",
      value: 3.2,
      suffix: "x",
      description: "Average increase in interview invitations",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Award,
      label: "Resumes Optimized",
      value: 50000,
      suffix: "+",
      description: "Successfully processed and optimized",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Zap,
      label: "Average Score Boost",
      value: 34,
      suffix: " pts",
      description: "Improvement in ATS compatibility score",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ShinyText 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            speed={3}
            shimmerWidth={100}
          >
            Proven Results That Speak Volumes
          </ShinyText>
          
          <motion.p
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands of professionals who've transformed their careers with data-driven resume optimization
          </motion.p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
              }}
              className="group"
            >
              <Card className="bg-gradient-to-br from-background/80 to-secondary/10 backdrop-blur-sm border border-primary/20 shadow-xl overflow-hidden relative h-full">
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
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

                <CardContent className="p-8 text-center relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-2xl`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <metric.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    className={`text-5xl font-bold mb-2 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    {inView && (
                      <CountUp
                        end={metric.value}
                        duration={2}
                        delay={0.5 + index * 0.1}
                        decimals={metric.value % 1 !== 0 ? 1 : 0}
                      />
                    )}
                    <span className="text-2xl">{metric.suffix}</span>
                  </motion.div>

                  {/* Label */}
                  <motion.h3
                    className="text-xl font-semibold text-white mb-3"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {metric.label}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-sm text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    {metric.description}
                  </motion.p>

                  {/* Success Badge */}
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                  >
                    <Badge 
                      variant="outline" 
                      className={`bg-gradient-to-r ${metric.color} text-white border-none`}
                    >
                      ✓ Verified
                    </Badge>
                  </motion.div>
                </CardContent>

                {/* Hover Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-lg`}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          viewport={{ once: true }}
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
            <Badge 
              variant="secondary" 
              className="px-6 py-2 text-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300"
            >
              🚀 Join the success stories above
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}