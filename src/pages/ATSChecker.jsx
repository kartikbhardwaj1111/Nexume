import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Layout from '@/components/Layout';
import { OptimizedATSChecker } from '@/components/OptimizedATSChecker';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ATSChecker() {
  const navigate = useNavigate();

  return (
    <Layout customBreadcrumbs={[
      { path: '/', label: 'Home' },
      { path: '/ats-checker', label: 'ATS Checker' }
    ]}>
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
                <Home className="w-4 h-4" />
              </motion.div>
              Home
            </Button>
          </motion.div>
          <ThemeToggle />
        </div>

        {/* Use the OptimizedATSChecker component */}
        <div className="relative z-10">
          <OptimizedATSChecker />
        </div>
      </div>
    </Layout>
  );
}