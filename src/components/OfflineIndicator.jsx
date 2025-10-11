/**
 * Offline Indicator Component
 * Shows network status and offline functionality
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  X, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useOffline, useNetworkStatus, useOfflineQueue } from '../hooks/useOffline';
import { toast } from 'sonner';

const OfflineIndicator = () => {
  const {
    isOnline,
    isServiceWorkerReady,
    updateAvailable,
    offlineMessage,
    updateApp,
    dismissUpdate,
    dismissOfflineMessage
  } = useOffline();

  const { networkInfo, connectionSpeed, isSlowConnection } = useNetworkStatus();
  const { queueLength, processQueue, clearQueue, isProcessing } = useOfflineQueue();

  const handleUpdateApp = () => {
    toast.success('Updating app...');
    updateApp();
  };

  const handleProcessQueue = async () => {
    await processQueue();
    if (queueLength === 0) {
      toast.success('All offline actions processed!');
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      {/* Update Available Notification */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <Download className="h-4 w-4 text-blue-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-200">
                  New version available!
                </span>
                <div className="flex gap-2 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUpdateApp}
                    className="h-6 px-2 text-xs"
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={dismissUpdate}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Status */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Alert className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <div className="text-orange-800 dark:text-orange-200 font-medium">
                    You're offline
                  </div>
                  {offlineMessage && (
                    <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                      {offlineMessage}
                    </div>
                  )}
                </div>
                {offlineMessage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={dismissOfflineMessage}
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Queue Status */}
      <AnimatePresence>
        {queueLength > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <div className="text-yellow-800 dark:text-yellow-200 font-medium">
                    {queueLength} pending action{queueLength > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                    Will sync when online
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  {isOnline && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleProcessQueue}
                      disabled={isProcessing}
                      className="h-6 px-2 text-xs"
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        'Sync'
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearQueue}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slow Connection Warning */}
      <AnimatePresence>
        {isOnline && isSlowConnection && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                Slow connection detected. Some features may load slowly.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Status Badge (always visible in bottom right) */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
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
              {networkInfo && (
                <span className="ml-1 opacity-75">
                  ({networkInfo.effectiveType})
                </span>
              )}
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline
            </>
          )}
          
          {isServiceWorkerReady && (
            <motion.div
              className="w-1.5 h-1.5 bg-current rounded-full ml-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Badge>
      </motion.div>
    </div>
  );
};

export default OfflineIndicator;