/**
 * Navigation Component
 * Main navigation for the Career Acceleration Platform
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { 
  Home, 
  FileText, 
  Briefcase, 
  BarChart3, 
  Users, 
  Target,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navigationItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      description: 'Welcome page'
    },
    {
      path: '/ats-checker',
      label: 'ATS Checker',
      icon: FileText,
      description: 'Analyze your resume'
    },
    {
      path: '/job-analysis',
      label: 'Job Analysis',
      icon: Briefcase,
      description: 'Analyze job postings'
    },
    {
      path: '/templates',
      label: 'Templates',
      icon: BarChart3,
      description: 'Resume templates'
    },
    {
      path: '/interview-prep',
      label: 'Interview Prep',
      icon: Users,
      description: 'Practice interviews'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('/')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-foreground tracking-tight">NEXUME</span>
                <Badge className="text-[10px] font-bold bg-primary/10 hover:bg-primary/15 text-primary border border-primary/25 shadow-none px-2 py-0.5">AI</Badge>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                        ${active 
                          ? 'bg-secondary text-secondary-foreground shadow-none border border-border/80' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-1 bg-primary/10 text-primary">
                          {item.badge}
                        </Badge>
                      )}
                      
                      {active && (
                        <motion.div
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary"
                          layoutId="activeTab"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground hover:bg-secondary"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 border-t border-border"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full justify-start flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold
                        ${active 
                          ? 'bg-secondary text-foreground border border-border' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-auto bg-primary/10 text-primary">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                    
                    {item.description && (
                      <p className="text-xs text-muted-foreground ml-7 mt-1">
                        {item.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;