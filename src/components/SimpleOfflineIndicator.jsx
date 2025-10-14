/**
 * Simple Offline Indicator Component
 * Shows basic network status without complex hooks
 */

import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

const SimpleOfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge
        variant={isOnline ? "default" : "destructive"}
        className={`
          flex items-center gap-1 px-2 py-1 text-xs
          ${isOnline 
            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800' 
            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800'
          }
        `}
      >
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );
};

export default SimpleOfflineIndicator;