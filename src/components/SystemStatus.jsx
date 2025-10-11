/**
 * System Status Component
 * Real-time system health monitoring and status indicators
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Wifi, 
  WifiOff, 
  Database, 
  Cpu, 
  HardDrive,
  RefreshCw,
  Activity,
  Clock,
  Shield
} from 'lucide-react';
import errorHandler from '../services/error/ErrorHandler';

const SystemStatus = ({ compact = false, showDetails = false }) => {
  const [systemHealth, setSystemHealth] = useState({
    overall: 'good',
    services: {},
    performance: {},
    storage: {},
    network: {},
    lastUpdated: null,
  });
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [errorStats, setErrorStats] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Monitor network status
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

  // Monitor error statistics
  useEffect(() => {
    const updateErrorStats = () => {
      setErrorStats(errorHandler.getErrorStats());
    };

    updateErrorStats();
    const interval = setInterval(updateErrorStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Check system health
  const checkSystemHealth = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      const health = {
        overall: 'good',
        services: {},
        performance: {},
        storage: {},
        network: {},
        lastUpdated: new Date().toISOString(),
      };

      // Check AI services
      health.services.aiService = await checkAIServiceHealth();
      
      // Check storage
      health.storage = await checkStorageHealth();
      
      // Check performance
      health.performance = await checkPerformanceHealth();
      
      // Check network
      health.network = await checkNetworkHealth();
      
      // Determine overall health
      health.overall = determineOverallHealth(health);
      
      setSystemHealth(health);
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'system',
        context: 'health_check',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial health check
  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkSystemHealth]);

  // Check AI service health
  const checkAIServiceHealth = async () => {
    try {
      // Check if AI services are responsive
      const startTime = performance.now();
      
      // Simulate a lightweight AI service check
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const responseTime = performance.now() - startTime;
      
      return {
        status: responseTime < 1000 ? 'healthy' : 'slow',
        responseTime,
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        lastCheck: new Date().toISOString(),
      };
    }
  };

  // Check storage health
  const checkStorageHealth = async () => {
    try {
      const storage = {
        localStorage: { available: true, usage: 0, quota: 0 },
        sessionStorage: { available: true, usage: 0, quota: 0 },
        indexedDB: { available: true },
      };

      // Check localStorage
      try {
        const testKey = 'health_check_test';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        
        // Estimate usage (rough calculation)
        let localStorageSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            localStorageSize += localStorage[key].length + key.length;
          }
        }
        
        storage.localStorage.usage = localStorageSize;
        storage.localStorage.quota = 5 * 1024 * 1024; // Assume 5MB quota
      } catch (error) {
        storage.localStorage.available = false;
        storage.localStorage.error = error.message;
      }

      // Check sessionStorage
      try {
        const testKey = 'health_check_test';
        sessionStorage.setItem(testKey, 'test');
        sessionStorage.removeItem(testKey);
        
        let sessionStorageSize = 0;
        for (let key in sessionStorage) {
          if (sessionStorage.hasOwnProperty(key)) {
            sessionStorageSize += sessionStorage[key].length + key.length;
          }
        }
        
        storage.sessionStorage.usage = sessionStorageSize;
        storage.sessionStorage.quota = 5 * 1024 * 1024; // Assume 5MB quota
      } catch (error) {
        storage.sessionStorage.available = false;
        storage.sessionStorage.error = error.message;
      }

      // Check IndexedDB
      try {
        if (!window.indexedDB) {
          storage.indexedDB.available = false;
        }
      } catch (error) {
        storage.indexedDB.available = false;
        storage.indexedDB.error = error.message;
      }

      return storage;
    } catch (error) {
      return { error: error.message };
    }
  };

  // Check performance health
  const checkPerformanceHealth = async () => {
    try {
      const performance = {
        memory: {},
        timing: {},
        fps: 0,
      };

      // Memory information (if available)
      if (window.performance && window.performance.memory) {
        performance.memory = {
          used: window.performance.memory.usedJSHeapSize,
          total: window.performance.memory.totalJSHeapSize,
          limit: window.performance.memory.jsHeapSizeLimit,
        };
      }

      // Navigation timing
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        performance.timing = {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstPaint: timing.responseStart - timing.navigationStart,
        };
      }

      // Estimate FPS (simplified)
      let frameCount = 0;
      const startTime = performance.now();
      
      const countFrames = () => {
        frameCount++;
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(countFrames);
        } else {
          performance.fps = frameCount;
        }
      };
      
      requestAnimationFrame(countFrames);

      return performance;
    } catch (error) {
      return { error: error.message };
    }
  };

  // Check network health
  const checkNetworkHealth = async () => {
    try {
      const network = {
        online: navigator.onLine,
        connection: {},
        latency: 0,
      };

      // Network connection info (if available)
      if (navigator.connection) {
        network.connection = {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData,
        };
      }

      // Measure latency with a simple request
      if (navigator.onLine) {
        const startTime = performance.now();
        try {
          await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
          network.latency = performance.now() - startTime;
        } catch (error) {
          network.latency = -1; // Failed to measure
        }
      }

      return network;
    } catch (error) {
      return { error: error.message };
    }
  };

  // Determine overall system health
  const determineOverallHealth = (health) => {
    const issues = [];

    // Check services
    if (health.services.aiService?.status === 'error') {
      issues.push('AI service error');
    } else if (health.services.aiService?.status === 'slow') {
      issues.push('AI service slow');
    }

    // Check storage
    if (!health.storage.localStorage?.available) {
      issues.push('localStorage unavailable');
    }
    if (!health.storage.sessionStorage?.available) {
      issues.push('sessionStorage unavailable');
    }

    // Check network
    if (!health.network.online) {
      issues.push('Network offline');
    } else if (health.network.latency > 2000) {
      issues.push('High network latency');
    }

    // Check error rate
    if (errorStats.recentCount > 10) {
      issues.push('High error rate');
    }

    // Determine status
    if (issues.length === 0) {
      return 'good';
    } else if (issues.length <= 2) {
      return 'warning';
    } else {
      return 'error';
    }
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'good':
      case 'healthy':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
      case 'warning':
      case 'slow':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertCircle };
      case 'error':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: XCircle };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: AlertCircle };
    }
  };

  const overallStatus = getStatusDisplay(systemHealth.overall);
  const OverallIcon = overallStatus.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-full ${overallStatus.bg}`}>
          <OverallIcon className={`h-4 w-4 ${overallStatus.color}`} />
        </div>
        <div className="flex items-center gap-1">
          {!isOnline && <WifiOff className="h-4 w-4 text-red-500" />}
          {errorStats.recentCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {errorStats.recentCount} errors
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${overallStatus.bg}`}>
              <OverallIcon className={`h-5 w-5 ${overallStatus.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription>
                Overall health: <span className={overallStatus.color}>
                  {systemHealth.overall}
                </span>
                {systemHealth.lastUpdated && (
                  <span className="ml-2 text-xs">
                    Updated {new Date(systemHealth.lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSystemHealth}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="font-medium">Network</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
            {systemHealth.network.latency > 0 && (
              <span className="text-sm text-gray-600">
                {Math.round(systemHealth.network.latency)}ms
              </span>
            )}
          </div>
        </div>

        {/* Storage Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Storage</span>
          </div>
          
          {systemHealth.storage.localStorage && (
            <div className="ml-6 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Local Storage</span>
                <Badge variant={systemHealth.storage.localStorage.available ? 'default' : 'destructive'}>
                  {systemHealth.storage.localStorage.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              {systemHealth.storage.localStorage.available && systemHealth.storage.localStorage.quota > 0 && (
                <Progress 
                  value={(systemHealth.storage.localStorage.usage / systemHealth.storage.localStorage.quota) * 100}
                  className="h-2"
                />
              )}
            </div>
          )}
        </div>

        {/* Error Statistics */}
        {errorStats.total > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Error Statistics</span>
            </div>
            <div className="ml-6 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Recent (1h)</div>
                <div className="font-medium">{errorStats.recentCount || 0}</div>
              </div>
              <div>
                <div className="text-gray-600">Daily</div>
                <div className="font-medium">{errorStats.dailyCount || 0}</div>
              </div>
              <div>
                <div className="text-gray-600">Total</div>
                <div className="font-medium">{errorStats.total || 0}</div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {showDetails && systemHealth.performance.memory && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Performance</span>
            </div>
            <div className="ml-6 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Memory Usage</span>
                <span>
                  {Math.round(systemHealth.performance.memory.used / 1024 / 1024)}MB / 
                  {Math.round(systemHealth.performance.memory.limit / 1024 / 1024)}MB
                </span>
              </div>
              <Progress 
                value={(systemHealth.performance.memory.used / systemHealth.performance.memory.limit) * 100}
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Services Status */}
        {showDetails && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              <span className="font-medium">Services</span>
            </div>
            <div className="ml-6 space-y-1">
              {Object.entries(systemHealth.services).map(([service, status]) => {
                const serviceStatus = getStatusDisplay(status.status);
                const ServiceIcon = serviceStatus.icon;
                
                return (
                  <div key={service} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <ServiceIcon className={`h-3 w-3 ${serviceStatus.color}`} />
                      <span className="capitalize">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <Badge variant="outline" className={serviceStatus.color}>
                      {status.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatus;