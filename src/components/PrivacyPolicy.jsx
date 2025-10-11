/**
 * Privacy Policy Component
 * Comprehensive privacy policy and data protection information
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Shield, Lock, Eye, Download, Trash2, Clock, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "January 2024";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle>Privacy Policy</CardTitle>
          </div>
          <CardDescription>
            Last updated: {lastUpdated} | Effective Date: {lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Lock className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Local Storage</div>
                <div className="text-sm text-green-600">Data stays on your device</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">No Tracking</div>
                <div className="text-sm text-blue-600">No third-party trackers</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Globe className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-800">GDPR Compliant</div>
                <div className="text-sm text-purple-600">Full data rights</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1. Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium flex items-center gap-2">
                Resume Data
                <Badge variant="secondary">Essential</Badge>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Resume content, work experience, education, and skills you provide for analysis and optimization.
                This data is processed locally and encrypted in your browser's storage.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium flex items-center gap-2">
                Job Information
                <Badge variant="secondary">Essential</Badge>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Job descriptions and requirements you provide via URL or manual input for tailored analysis.
                Used to provide personalized recommendations.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium flex items-center gap-2">
                Usage Analytics
                <Badge variant="outline">Optional</Badge>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Anonymous usage patterns, feature interactions, and performance metrics.
                Only collected with your explicit consent to improve the platform.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium flex items-center gap-2">
                Preferences
                <Badge variant="outline">Optional</Badge>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Your customization preferences, career goals, and personalization settings.
                Used to provide a tailored user experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Core Functionality</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Resume analysis and ATS scoring</li>
                <li>• Job matching and recommendations</li>
                <li>• Template generation and customization</li>
                <li>• Career progression tracking</li>
                <li>• Interview preparation tools</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Platform Improvement</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Performance optimization</li>
                <li>• Feature usage analytics</li>
                <li>• Error detection and fixing</li>
                <li>• User experience enhancement</li>
                <li>• Security monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Data Storage and Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Local-First Architecture</h4>
              <p className="text-sm text-blue-700">
                All your personal data is stored locally in your browser using encrypted storage.
                We do not maintain servers that store your personal information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium mb-2">Encryption</h5>
                <p className="text-sm text-gray-600">
                  AES-256-GCM encryption for all sensitive data with browser-generated keys.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium mb-2">Access Control</h5>
                <p className="text-sm text-gray-600">
                  Only you have access to your data through your browser session.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium mb-2">Data Retention</h5>
                <p className="text-sm text-gray-600">
                  Data is retained until you delete it or clear your browser storage.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium mb-2">Automatic Cleanup</h5>
                <p className="text-sm text-gray-600">
                  Expired temporary data is automatically removed based on your preferences.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Your Rights (GDPR)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Right to Access</h4>
              </div>
              <p className="text-sm text-gray-600">
                Export all your data in a structured, machine-readable format at any time.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <h4 className="font-medium">Right to Erasure</h4>
              </div>
              <p className="text-sm text-gray-600">
                Delete all your personal data permanently with a single click.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Right to Rectification</h4>
              </div>
              <p className="text-sm text-gray-600">
                Modify or correct your personal information at any time through the interface.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Right to Portability</h4>
              </div>
              <p className="text-sm text-gray-600">
                Transfer your data to other services using our export functionality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">AI Services (Optional)</h4>
              <p className="text-sm text-gray-600 mb-2">
                When available, we may use external AI services for enhanced resume analysis:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• HuggingFace API - For natural language processing</li>
                <li>• OpenAI API - For advanced content analysis</li>
                <li>• Data is sent only for processing and not stored by these services</li>
                <li>• Fallback to local processing when services are unavailable</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Job Site Integration</h4>
              <p className="text-sm text-gray-600 mb-2">
                For job URL analysis, we may fetch publicly available job postings:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• LinkedIn, Indeed, Glassdoor, and other job sites</li>
                <li>• Only public job posting data is accessed</li>
                <li>• No personal accounts or private data is accessed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Cookies and Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">No Third-Party Tracking</h4>
            <p className="text-sm text-green-700">
              We do not use third-party cookies, analytics services, or tracking pixels.
              All data processing happens locally in your browser.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Essential Browser Storage</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Local Storage - For your encrypted data and preferences</li>
              <li>• Session Storage - For temporary data during your session</li>
              <li>• IndexedDB - For large files and templates (if needed)</li>
              <li>• Service Worker Cache - For offline functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg text-center">
              <div className="font-medium text-blue-600">Essential Data</div>
              <div className="text-sm text-gray-600 mt-1">Until you delete it</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <div className="font-medium text-green-600">Analytics Data</div>
              <div className="text-sm text-gray-600 mt-1">30 days maximum</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <div className="font-medium text-purple-600">Temporary Data</div>
              <div className="text-sm text-gray-600 mt-1">7 days maximum</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            You can configure automatic data cleanup in your privacy settings.
            All data is automatically removed when you clear your browser storage.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Privacy Questions or Concerns</h4>
            <p className="text-sm text-gray-600 mb-2">
              If you have any questions about this privacy policy or your data rights:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use the privacy settings in the application</li>
              <li>• Export your data using the built-in tools</li>
              <li>• Delete your data through the privacy controls</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Policy Updates</h4>
            <p className="text-sm text-gray-600">
              We may update this privacy policy to reflect changes in our practices or legal requirements.
              Updates will be clearly indicated with a new "Last Updated" date.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;