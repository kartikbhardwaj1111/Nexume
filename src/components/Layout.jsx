/**
 * Layout Component
 * Main layout wrapper with navigation and breadcrumbs
 */

import React from 'react';
import Navigation from './Navigation';
import Breadcrumb from './Breadcrumb';

const Layout = ({ children, showBreadcrumbs = true, customBreadcrumbs = null }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      {showBreadcrumbs && <Breadcrumb customBreadcrumbs={customBreadcrumbs} />}
      <main className="relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;