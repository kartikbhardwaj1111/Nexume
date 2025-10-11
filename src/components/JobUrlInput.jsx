import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Link,
  CheckCircle,
  AlertTriangle,
  Info,
  Clipboard,
  Sparkles
} from 'lucide-react';
import { jobExtractor } from '../services/job/JobExtractor.js';

const JobUrlInput = ({ onJobExtracted, onError, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [urlValidation, setUrlValidation] = useState(null);
  const [extractionCapabilities, setExtractionCapabilities] = useState(null);
  const [activeTab, setActiveTab] = useState('url');

  // Validate URL as user types
  useEffect(() => {
    if (url.trim()) {
      const isValid = jobExtractor.validateJobUrl(url);
      const capabilities = jobExtractor.getExtractionCapabilities(url);

      setUrlValidation({
        isValid,
        message: isValid
          ? `Valid job URL detected${capabilities.isKnown ? ` (${capabilities.siteName})` : ''}`
          : 'Please enter a valid job posting URL'
      });

      setExtractionCapabilities(capabilities);
    } else {
      setUrlValidation(null);
      setExtractionCapabilities(null);
    }
  }, [url]);

  const handleUrlExtraction = async () => {
    if (!url.trim()) {
      onError?.('Please enter a job URL');
      return;
    }

    try {
      const result = await jobExtractor.extractJobDetails(url);

      if (result.success) {
        onJobExtracted?.(result);
      } else {
        // If URL extraction fails, switch to manual input with guidance
        if (result.siteInstructions || result.guidance) {
          setActiveTab('manual');
          onError?.(result.error + ' Please use the manual input tab below.');
        } else {
          onError?.(result.error || 'Failed to extract job details from URL');
        }
      }
    } catch (error) {
      console.error('Job extraction error:', error);
      onError?.('An error occurred while extracting job details');
    }
  };

  const handleManualExtraction = async () => {
    if (!manualContent.trim()) {
      onError?.('Please paste the job description content');
      return;
    }

    try {
      let result;

      // Try AI-powered extraction first if available
      if (jobExtractor.analyzeJobContentWithAI) {
        result = await jobExtractor.analyzeJobContentWithAI(
          manualContent,
          url,
          { title: jobTitle, company: company }
        );
      } else {
        // Fall back to rule-based extraction
        result = jobExtractor.parseJobDescription(manualContent, url, jobTitle, company);
      }

      if (result.success) {
        onJobExtracted?.(result);
      } else {
        onError?.(result.error || 'Failed to analyze job content');
      }
    } catch (error) {
      console.error('Manual job analysis error:', error);
      onError?.('An error occurred while analyzing the job content');
    }
  };

  const getSupportedSites = () => {
    const sites = jobExtractor.getAllKnownSites();
    return sites;
  };

  const supportedSites = getSupportedSites();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Job Analysis Input
        </CardTitle>
        <CardDescription>
          Enter a job posting URL or paste the job description for tailored resume analysis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Job URL
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Clipboard className="h-4 w-4" />
              Manual Input
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-url">Job Posting URL</Label>
              <div className="flex gap-2">
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://linkedin.com/jobs/view/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={urlValidation?.isValid === false ? 'border-red-500' : ''}
                />
                <Button
                  onClick={handleUrlExtraction}
                  disabled={!url.trim() || isLoading || urlValidation?.isValid === false}
                  className="shrink-0"
                >
                  {isLoading ? 'Extracting...' : 'Extract'}
                </Button>
              </div>

              {urlValidation && (
                <Alert className={urlValidation.isValid ? 'border-green-500' : 'border-red-500'}>
                  <div className="flex items-center gap-2">
                    {urlValidation.isValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription>{urlValidation.message}</AlertDescription>
                  </div>
                </Alert>
              )}

              {extractionCapabilities && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={extractionCapabilities.isSupported ? 'default' : 'secondary'}>
                      {extractionCapabilities.isKnown ? extractionCapabilities.siteName : 'Unknown Site'}
                    </Badge>
                    {extractionCapabilities.category && (
                      <Badge variant="outline">{extractionCapabilities.category}</Badge>
                    )}
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{extractionCapabilities.recommendation}</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Supported Job Sites</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {supportedSites.supported.map((site) => (
                  <Badge key={site.name} variant="default" className="justify-center">
                    {site.displayName}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {supportedSites.additional.slice(0, 6).map((site) => (
                  <Badge key={site.name} variant="secondary" className="justify-center">
                    {site.displayName}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Green badges: Full support • Gray badges: Manual input required
              </p>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title (Optional)</Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input
                  id="company"
                  placeholder="e.g., Tech Corp Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-content" className="flex items-center gap-2">
                Job Description Content
                <Sparkles className="h-4 w-4 text-blue-500" title="AI-powered analysis" />
              </Label>
              <Textarea
                id="job-content"
                placeholder="Paste the complete job posting content here..."
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Include job title, requirements, responsibilities, and any other relevant details for best results
              </p>
            </div>

            <Button
              onClick={handleManualExtraction}
              disabled={!manualContent.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Job Content'}
            </Button>

            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                Our AI will automatically extract job requirements, skills, and other details from the content you provide.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JobUrlInput;