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
      path: '/career',
      label: 'Career Path',
      icon: Target,
      description: 'Career progression'
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
    <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
                <img 
                  src="/favicon.png" 
                  alt="NEXUME Logo" 
                  className="w-10 h-10 object-contain filter brightness-110 contrast-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl items-center justify-center hidden">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">NEXUME</span>
                <Badge variant="secondary" className="text-xs font-bold bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 text-blue-100 shadow-lg">AI</Badge>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${active 
                          ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-1">
                          {item.badge}
                        </Badge>
                      )}
                      
                      {active && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
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
                className="text-white hover:bg-white/10"
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
            className="md:hidden bg-black/50 backdrop-blur-md border-t border-white/20"
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
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full justify-start flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium
                        ${active 
                          ? 'bg-white/15 text-white backdrop-blur-sm border border-white/20' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                    
                    {item.description && (
                      <p className="text-xs text-white/60 ml-7 mt-1">
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