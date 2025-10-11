/**
 * Breadcrumb Component
 * Provides navigation breadcrumbs for complex user flows
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define route mappings for breadcrumb labels
  const routeLabels = {
    '/': 'Home',
    '/ats-checker': 'ATS Checker',
    '/job-analysis': 'Job Analysis',
    '/templates': 'Templates',
    '/career': 'Career Path',
    '/interview-prep': 'Interview Prep',
    '/analytics': 'Analytics',
    '/api-key': 'API Configuration',
    '/resume': 'Resume Upload',
    '/job-description': 'Job Description',
    '/report': 'Analysis Report'
  };

  // Generate breadcrumbs from current path or use custom ones
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ path: '/', label: 'Home' }];

    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ path: currentPath, label });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or if only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-3"
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li key={breadcrumb.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-white/40 mx-2" />
                )}
                
                {isLast ? (
                  <span className="text-white font-medium flex items-center">
                    {isFirst && <Home className="w-4 h-4 mr-1" />}
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                    className="text-white/70 hover:text-white hover:bg-white/10 p-1 h-auto font-normal flex items-center"
                  >
                    {isFirst && <Home className="w-4 h-4 mr-1" />}
                    {breadcrumb.label}
                  </Button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </motion.nav>
  );
};

export default Breadcrumb;