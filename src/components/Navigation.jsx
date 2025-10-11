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
  BookOpen,
  Target,
  Menu,
  X,
  Share2,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataSyncPanel from './DataSyncPanel';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSyncPanel, setShowSyncPanel] = useState(false);

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
      description: 'Career progression',
      badge: 'New'
    },
    {
      path: '/interview-prep',
      label: 'Interview Prep',
      icon: Users,
      description: 'Practice interviews',
      badge: 'New'
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Performance insights'
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
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nexume</span>
              <Badge variant="secondary" className="text-xs">Pro</Badge>
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
                        relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                        ${active 
                          ? 'bg-white/20 text-white shadow-lg' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSyncPanel(true)}
              className="text-white hover:bg-white/10 hidden md:flex"
            >
              <Cloud className="w-4 h-4 mr-2" />
              Sync
            </Button>
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
            <div className="px-2 pt-2 pb-3 space-y-1">
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
                        w-full justify-start flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium
                        ${active 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
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

      {/* Data Sync Panel */}
      <AnimatePresence>
        {showSyncPanel && (
          <DataSyncPanel onClose={() => setShowSyncPanel(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;