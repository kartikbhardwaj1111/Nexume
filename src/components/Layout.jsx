/**
 * Layout Component
 * Main layout wrapper with navigation and breadcrumbs
 */

import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] aspect-square rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-[120px] pointer-events-none" />

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