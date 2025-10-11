/**
 * Template Export Dialog Component
 * Provides options for exporting templates in different formats
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Download, 
  FileText, 
  Share2, 
  Save, 
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Eye,
  Calendar,
  Lock
} from 'lucide-react';
import { templateExporter } from '../services/templates/TemplateExporter.js';

const TemplateExportDialog = ({ 
  isOpen, 
  onClose, 
  template, 
  templateHtml, 
  userData,
  onExportComplete 
}) => {
  const [activeTab, setActiveTab] = useState('download');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    formats: ['pdf'],
    filename: 'resume',
    quality: 1.0,
    includeStyles: true,
    margin: 10
  });
  const [shareOptions, setShareOptions] = useState({
    expiresIn: 7,
    password: '',
    allowDownload: true
  });
  const [shareResult, setShareResult] = useState(null);

  // Handle single format export
  const handleSingleExport = async (format) => {
    try {
      setIsExporting(true);
      setExportStatus({ type: 'loading', message: `Exporting as ${format.toUpperCase()}...` });

      let result;
      const filename = `${exportOptions.filename}.${format}`;

      switch (format) {
        case 'pdf':
          result = await templateExporter.exportToPDF(templateHtml, userData, {
            filename,
            quality: exportOptions.quality,
            margin: exportOptions.margin
          });
          break;
        case 'docx':
          result = await templateExporter.exportToDOCX(templateHtml, userData, {
            filename
          });
          break;
        case 'html':
          result = await templateExporter.exportToHTML(templateHtml, userData, {
            filename,
            includeStyles: exportOptions.includeStyles
          });
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      setExportStatus({ 
        type: 'success', 
        message: `Successfully exported as ${format.toUpperCase()}`,
        result 
      });

      if (onExportComplete) {
        onExportComplete(result);
      }
    } catch (error) {
      setExportStatus({ 
        type: 'error', 
        message: `Export failed: ${error.message}` 
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle batch export
  const handleBatchExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus({ type: 'loading', message: 'Exporting multiple formats...' });

      const results = await templateExporter.batchExport(
        templateHtml, 
        userData, 
        exportOptions.formats,
        {
          pdf: { 
            filename: `${exportOptions.filename}.pdf`,
            quality: exportOptions.quality,
            margin: exportOptions.margin
          },
          docx: { filename: `${exportOptions.filename}.docx` },
          html: { 
            filename: `${exportOptions.filename}.html`,
            includeStyles: exportOptions.includeStyles
          }
        }
      );

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      setExportStatus({ 
        type: successful > 0 ? 'success' : 'error',
        message: `Exported ${successful} format(s) successfully${failed > 0 ? `, ${failed} failed` : ''}`,
        results 
      });

      if (onExportComplete) {
        onExportComplete(results);
      }
    } catch (error) {
      setExportStatus({ 
        type: 'error', 
        message: `Batch export failed: ${error.message}` 
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle share link generation
  const handleGenerateShareLink = async () => {
    try {
      setIsExporting(true);
      setExportStatus({ type: 'loading', message: 'Generating share link...' });

      const result = await templateExporter.generateShareableLink(
        template,
        userData,
        {
          expiresIn: shareOptions.expiresIn * 24 * 60 * 60 * 1000, // Convert days to ms
          password: shareOptions.password || null,
          allowDownload: shareOptions.allowDownload
        }
      );

      setShareResult(result);
      setExportStatus({ 
        type: 'success', 
        message: 'Share link generated successfully!' 
      });
    } catch (error) {
      setExportStatus({ 
        type: 'error', 
        message: `Share link generation failed: ${error.message}` 
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle save template
  const handleSaveTemplate = async () => {
    try {
      setIsExporting(true);
      setExportStatus({ type: 'loading', message: 'Saving template...' });

      const result = await templateExporter.saveTemplate(template, userData);
      
      setExportStatus({ 
        type: 'success', 
        message: 'Template saved to your collection!' 
      });
    } catch (error) {
      setExportStatus({ 
        type: 'error', 
        message: `Save failed: ${error.message}` 
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Copy share link to clipboard
  const copyShareLink = async () => {
    if (shareResult?.shareUrl) {
      try {
        await navigator.clipboard.writeText(shareResult.shareUrl);
        setExportStatus({ type: 'success', message: 'Share link copied to clipboard!' });
      } catch (error) {
        setExportStatus({ type: 'error', message: 'Failed to copy link' });
      }
    }
  };

  // Format options
  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Best for printing and sharing' },
    { value: 'docx', label: 'Word Document', icon: FileText, description: 'Editable document format' },
    { value: 'html', label: 'HTML', icon: FileText, description: 'Web-friendly format' }
  ];

  // Quality options
  const qualityOptions = [
    { value: 0.5, label: 'Low (Faster)' },
    { value: 1.0, label: 'Standard' },
    { value: 1.5, label: 'High (Slower)' },
    { value: 2.0, label: 'Ultra (Slowest)' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Resume
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </TabsTrigger>
            <TabsTrigger value="share" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </TabsTrigger>
            <TabsTrigger value="save" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </TabsTrigger>
          </TabsList>

          {/* Download Tab */}
          <TabsContent value="download" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filename */}
                <div>
                  <Label htmlFor="filename">Filename</Label>
                  <Input
                    id="filename"
                    value={exportOptions.filename}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, filename: e.target.value }))}
                    placeholder="resume"
                  />
                </div>

                {/* Format Selection */}
                <div>
                  <Label>Export Formats</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {formatOptions.map(format => {
                      const Icon = format.icon;
                      return (
                        <div key={format.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={format.value}
                            checked={exportOptions.formats.includes(format.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setExportOptions(prev => ({
                                  ...prev,
                                  formats: [...prev.formats, format.value]
                                }));
                              } else {
                                setExportOptions(prev => ({
                                  ...prev,
                                  formats: prev.formats.filter(f => f !== format.value)
                                }));
                              }
                            }}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <Icon className="w-4 h-4" />
                            <div>
                              <Label htmlFor={format.value} className="font-medium">
                                {format.label}
                              </Label>
                              <p className="text-xs text-gray-600">{format.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PDF Quality (only show if PDF is selected) */}
                {exportOptions.formats.includes('pdf') && (
                  <div>
                    <Label>PDF Quality</Label>
                    <Select 
                      value={exportOptions.quality.toString()} 
                      onValueChange={(value) => setExportOptions(prev => ({ ...prev, quality: parseFloat(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* HTML Options (only show if HTML is selected) */}
                {exportOptions.formats.includes('html') && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeStyles"
                      checked={exportOptions.includeStyles}
                      onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeStyles: checked }))}
                    />
                    <Label htmlFor="includeStyles">Include responsive styles</Label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Export Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map(format => {
                const Icon = format.icon;
                return (
                  <Button
                    key={format.value}
                    variant="outline"
                    onClick={() => handleSingleExport(format.value)}
                    disabled={isExporting}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{format.label}</span>
                  </Button>
                );
              })}
            </div>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Share Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Expiry */}
                <div>
                  <Label>Link expires in</Label>
                  <Select 
                    value={shareOptions.expiresIn.toString()} 
                    onValueChange={(value) => setShareOptions(prev => ({ ...prev, expiresIn: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="90">3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password Protection */}
                <div>
                  <Label htmlFor="password">Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={shareOptions.password}
                    onChange={(e) => setShareOptions(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Leave empty for no password"
                  />
                </div>

                {/* Allow Download */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowDownload"
                    checked={shareOptions.allowDownload}
                    onCheckedChange={(checked) => setShareOptions(prev => ({ ...prev, allowDownload: checked }))}
                  />
                  <Label htmlFor="allowDownload">Allow viewers to download</Label>
                </div>

                {/* Generate Share Link Button */}
                <Button 
                  onClick={handleGenerateShareLink} 
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  Generate Share Link
                </Button>

                {/* Share Result */}
                {shareResult && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Share link created!</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input 
                            value={shareResult.shareUrl} 
                            readOnly 
                            className="text-xs"
                          />
                          <Button size="sm" variant="outline" onClick={copyShareLink}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires: {shareResult.expiresAt?.toLocaleDateString()}
                          </span>
                          {shareOptions.password && (
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Password protected
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Save Tab */}
          <TabsContent value="save" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Save Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Save this customized template to your collection for future use.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Template Details</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Name:</strong> {template?.name}</p>
                    <p><strong>Category:</strong> {template?.category}</p>
                    <p><strong>Style:</strong> {template?.style}</p>
                    <p><strong>ATS Score:</strong> {template?.atsScore}%</p>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveTemplate} 
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save to Collection
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Messages */}
        {exportStatus && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            exportStatus.type === 'success' ? 'bg-green-50 text-green-800' :
            exportStatus.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {exportStatus.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
            {exportStatus.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {exportStatus.type === 'error' && <AlertCircle className="w-4 h-4" />}
            <span className="text-sm">{exportStatus.message}</span>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {exportOptions.formats.length > 1 && (
            <Button 
              onClick={handleBatchExport} 
              disabled={isExporting || exportOptions.formats.length === 0}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export All ({exportOptions.formats.length})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateExportDialog;