/**
 * Data Sync Panel Component
 * UI for data export/import and cross-device synchronization
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Download, 
  Upload, 
  Smartphone, 
  Monitor, 
  Tablet,
  Share2,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Trash2,
  HardDrive,
  Clock,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncManager, useSessionManager } from '../hooks/useDataSync';
import { toast } from 'sonner';

const DataSyncPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('sync');
  const [importCode, setImportCode] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const {
    syncCode,
    generateSyncCode,
    importFromCode,
    exportData,
    importData,
    getStorageStats,
    clearSyncCode,
    isGenerating,
    isImporting,
    error
  } = useSyncManager();

  const { sessions, currentSession, deviceId } = useSessionManager();

  // Handle sync code generation
  const handleGenerateCode = async () => {
    const code = await generateSyncCode();
    if (code) {
      toast.success('Sync code generated successfully!');
    }
  };

  // Handle sync code import
  const handleImportCode = async () => {
    if (!importCode.trim()) {
      toast.error('Please enter a sync code');
      return;
    }

    const results = await importFromCode(importCode.trim().toUpperCase());
    if (results) {
      toast.success(`Imported ${results.imported} items successfully!`);
      setImportCode('');
    }
  };

  // Copy sync code to clipboard
  const handleCopyCode = async () => {
    if (syncCode) {
      try {
        await navigator.clipboard.writeText(syncCode);
        setCopied(true);
        toast.success('Sync code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy sync code');
      }
    }
  };

  // Handle file export
  const handleExportFile = () => {
    const data = exportData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resumefit-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    }
  };

  // Handle file import
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        const results = importData(importedData, { merge: true });
        if (results) {
          toast.success(`Imported ${results.imported} items from file!`);
        }
      } catch (err) {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  // Get device icon
  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return Monitor;
    if (userAgent.includes('Mobile')) return Smartphone;
    if (userAgent.includes('Tablet')) return Tablet;
    return Monitor;
  };

  // Format storage size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get storage stats
  const storageStats = getStorageStats();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Data Synchronization
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sync your data across devices or create backups
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sync">Quick Sync</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
            </TabsList>

            {/* Quick Sync Tab */}
            <TabsContent value="sync" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Generate Sync Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate a temporary code to sync data to another device
                    </p>
                    
                    <Button 
                      onClick={handleGenerateCode}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4 mr-2" />
                      )}
                      Generate Sync Code
                    </Button>

                    <AnimatePresence>
                      {syncCode && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <Input 
                              value={syncCode} 
                              readOnly 
                              className="font-mono text-center text-lg"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCopyCode}
                            >
                              {copied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          
                          <Alert>
                            <Clock className="w-4 h-4" />
                            <AlertDescription>
                              This code expires in 1 hour. Share it with your other device to sync data.
                            </AlertDescription>
                          </Alert>

                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={clearSyncCode}
                            className="w-full"
                          >
                            Clear Code
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Import from Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Receive Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter a sync code from another device to import data
                    </p>
                    
                    <div className="space-y-3">
                      <Label htmlFor="import-code">Sync Code</Label>
                      <Input
                        id="import-code"
                        placeholder="Enter 6-character code"
                        value={importCode}
                        onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="font-mono text-center text-lg"
                      />
                      
                      <Button 
                        onClick={handleImportCode}
                        disabled={isImporting || !importCode.trim()}
                        className="w-full"
                      >
                        {isImporting ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        Import Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Backup Tab */}
            <TabsContent value="backup" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Download all your data as a backup file
                    </p>
                    
                    <Button onClick={handleExportFile} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Backup
                    </Button>
                  </CardContent>
                </Card>

                {/* Import Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Restore data from a backup file
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions.map((session, index) => {
                      const DeviceIcon = getDeviceIcon(session.userAgent);
                      const isCurrentSession = session.tabId === currentSession?.tabId;
                      
                      return (
                        <div
                          key={session.tabId}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isCurrentSession ? 'bg-primary/10 border-primary' : 'bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <DeviceIcon className="w-5 h-5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {isCurrentSession ? 'Current Session' : `Session ${index + 1}`}
                                </span>
                                {isCurrentSession && (
                                  <Badge variant="secondary" className="text-xs">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Last active: {new Date(session.lastActivity).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-mono">{session.deviceId.slice(-8)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new URL(session.url).pathname}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {sessions.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No active sessions found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Storage Tab */}
            <TabsContent value="storage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Storage Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used Storage</span>
                      <span>{formatSize(storageStats.totalSize)}</span>
                    </div>
                    <Progress 
                      value={(storageStats.totalSize / storageStats.availableSpace) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{storageStats.totalItems} items</span>
                      <span>{formatSize(storageStats.availableSpace)} available</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Storage Breakdown</h4>
                    {Object.entries(storageStats.itemStats).map(([key, stats]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="truncate">{key}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {formatSize(stats.size)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataSyncPanel;