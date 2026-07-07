/**
 * Layout Component
 * Main layout wrapper with navigation and breadcrumbs
 */

import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <Navigation />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <footer className="py-8 border-t border-border bg-card-secondary text-center text-sm text-muted-foreground relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Nexume - AI-Powered Career Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;