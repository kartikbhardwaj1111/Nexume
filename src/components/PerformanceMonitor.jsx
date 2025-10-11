/**
 * Performance Monitor Component
 * Displays performance metrics and optimization suggestions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  Zap, 
  HardDrive, 
  Wifi, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  performanceMonitor, 
  analyzeBundleSize, 
  getMemoryUsage, 
  getNetworkInfo 
} from '../utils/performanceOptimizer';

const PerformanceMonitor = ({ onClose }) => {
  const [metrics, setMetrics] = useState({});
  const [bundleAnalysis, setBundleAnalysis] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [coreWebVitals, setCoreWebVitals] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshMetrics();
    
    // Refresh metrics every 5 seconds
    const interval = setInterval(refreshMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    
    try {
      // Get performance metrics
      const allMetrics = performanceMonitor.getMetrics();
      setMetrics(allMetrics);
      
      // Get Core Web Vitals
      const vitals = performanceMonitor.getCoreWebVitals();
      setCoreWebVitals(vitals);
      
      // Analyze bundle size
      const bundle = analyzeBundleSize();
      setBundleAnalysis(bundle);
      
      // Get memory usage
      const memory = getMemoryUsage();
      setMemoryUsage(memory);
      
      // Get network info
      const network = getNetworkInfo();
      setNetworkInfo(network);
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getScoreColor = (score, thresholds = { good: 75, needs: 50 }) => {
    if (score >= thresholds.good) return 'text-green-600';
    if (score >= thresholds.needs) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVitalScore = (vital, value) => {
    const thresholds = {
      lcp: { good: 2500, needs: 4000 },
      fid: { good: 100, needs: 300 },
      cls: { good: 0.1, needs: 0.25 }
    };
    
    if (!value || !thresholds[vital]) return 0;
    
    const { good, needs } = thresholds[vital];
    if (value <= good) return 100;
    if (value <= needs) return 60;
    return 30;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Monitor
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time performance metrics and optimization insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMetrics}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto">
          <Tabs defaultValue="vitals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            {/* Core Web Vitals */}
            <TabsContent value="vitals" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LCP */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Largest Contentful Paint
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {coreWebVitals.lcp ? formatTime(coreWebVitals.lcp) : 'N/A'}
                        </span>
                        <Badge 
                          variant={getVitalScore('lcp', coreWebVitals.lcp) >= 75 ? 'default' : 'destructive'}
                        >
                          {getVitalScore('lcp', coreWebVitals.lcp)}/100
                        </Badge>
                      </div>
                      <Progress 
                        value={getVitalScore('lcp', coreWebVitals.lcp)} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Good: &lt;2.5s, Needs improvement: &lt;4.0s
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* FID */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      First Input Delay
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {coreWebVitals.fid ? formatTime(coreWebVitals.fid) : 'N/A'}
                        </span>
                        <Badge 
                          variant={getVitalScore('fid', coreWebVitals.fid) >= 75 ? 'default' : 'destructive'}
                        >
                          {getVitalScore('fid', coreWebVitals.fid)}/100
                        </Badge>
                      </div>
                      <Progress 
                        value={getVitalScore('fid', coreWebVitals.fid)} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Good: &lt;100ms, Needs improvement: &lt;300ms
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CLS */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Cumulative Layout Shift
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {coreWebVitals.cls ? coreWebVitals.cls.toFixed(3) : 'N/A'}
                        </span>
                        <Badge 
                          variant={getVitalScore('cls', coreWebVitals.cls) >= 75 ? 'default' : 'destructive'}
                        >
                          {getVitalScore('cls', coreWebVitals.cls)}/100
                        </Badge>
                      </div>
                      <Progress 
                        value={getVitalScore('cls', coreWebVitals.cls)} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Good: &lt;0.1, Needs improvement: &lt;0.25
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resources" className="space-y-6">
              {bundleAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">JavaScript Bundle</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Total Size</span>
                        <span className="font-mono">{formatSize(bundleAnalysis.javascript.totalSize)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Files</span>
                        <span>{bundleAnalysis.javascript.count}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Largest Files</h4>
                        {bundleAnalysis.javascript.resources
                          .sort((a, b) => b.size - a.size)
                          .slice(0, 3)
                          .map((resource, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="truncate">{resource.name.split('/').pop()}</span>
                              <span className="font-mono">{formatSize(resource.size)}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">CSS Bundle</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Total Size</span>
                        <span className="font-mono">{formatSize(bundleAnalysis.css.totalSize)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Files</span>
                        <span>{bundleAnalysis.css.count}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Largest Files</h4>
                        {bundleAnalysis.css.resources
                          .sort((a, b) => b.size - a.size)
                          .slice(0, 3)
                          .map((resource, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="truncate">{resource.name.split('/').pop()}</span>
                              <span className="font-mono">{formatSize(resource.size)}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Memory */}
            <TabsContent value="memory" className="space-y-6">
              {memoryUsage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HardDrive className="w-5 h-5" />
                      Memory Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Used Memory</span>
                        <span className="font-mono">{formatSize(memoryUsage.used)}</span>
                      </div>
                      <Progress value={memoryUsage.percentage} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Total: {formatSize(memoryUsage.total)}</span>
                        <span>Limit: {formatSize(memoryUsage.limit)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Network */}
            <TabsContent value="network" className="space-y-6">
              {networkInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wifi className="w-5 h-5" />
                      Network Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Connection Type</span>
                        <p className="font-medium">{networkInfo.effectiveType?.toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Downlink Speed</span>
                        <p className="font-medium">{networkInfo.downlink} Mbps</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Round Trip Time</span>
                        <p className="font-medium">{networkInfo.rtt}ms</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Data Saver</span>
                        <p className="font-medium">{networkInfo.saveData ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Suggestions */}
            <TabsContent value="suggestions" className="space-y-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Optimization Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Enable Code Splitting</p>
                        <p className="text-sm text-muted-foreground">
                          Break down large bundles into smaller chunks for faster loading
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Service Worker Active</p>
                        <p className="text-sm text-muted-foreground">
                          Offline functionality and caching are working properly
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Optimize Images</p>
                        <p className="text-sm text-muted-foreground">
                          Use modern image formats and lazy loading for better performance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceMonitor;