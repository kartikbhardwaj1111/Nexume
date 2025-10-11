/**
 * Privacy Consent Component
 * GDPR-compliant consent management interface
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Shield, Download, Trash2, Settings, Info } from 'lucide-react';
import PrivacyManager from '../services/security/PrivacyManager';

const PrivacyConsent = ({ onConsentChange, showSettings = false }) => {
  const [privacyManager] = useState(() => new PrivacyManager());
  const [consentStatus, setConsentStatus] = useState(null);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
    personalization: false,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    initializePrivacy();
  }, []);

  const initializePrivacy = async () => {
    try {
      await privacyManager.initialize();
      const status = await privacyManager.getConsentStatus();
      const prefs = await privacyManager.getPrivacyPreferences();
      
      setConsentStatus(status);
      setPreferences({
        analytics: status.categories?.analytics || false,
        marketing: status.categories?.marketing || false,
        personalization: status.categories?.personalization || false,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize privacy settings:', error);
      setLoading(false);
    }
  };

  const handleConsentSubmit = async () => {
    try {
      setLoading(true);
      
      const success = await privacyManager.recordConsent(preferences);
      
      if (success) {
        const updatedStatus = await privacyManager.getConsentStatus();
        setConsentStatus(updatedStatus);
        
        if (onConsentChange) {
          onConsentChange(updatedStatus);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to record consent:', error);
      setLoading(false);
    }
  };

  const handlePreferenceChange = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleUpdatePreferences = async () => {
    try {
      setLoading(true);
      
      const success = await privacyManager.updateConsentPreferences(preferences);
      
      if (success) {
        const updatedStatus = await privacyManager.getConsentStatus();
        setConsentStatus(updatedStatus);
        
        if (onConsentChange) {
          onConsentChange(updatedStatus);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      
      const exportData = await privacyManager.exportUserData();
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-fit-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExporting(false);
    } catch (error) {
      console.error('Failed to export data:', error);
      setExporting(false);
    }
  };

  const handleDeleteAllData = async () => {
    if (!window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      
      const success = await privacyManager.deleteAllUserData();
      
      if (success) {
        // Reset state
        setConsentStatus({ hasConsent: false, consentDate: null, consentVersion: null, categories: {} });
        setPreferences({ analytics: false, marketing: false, personalization: false });
        
        if (onConsentChange) {
          onConsentChange({ hasConsent: false });
        }
        
        alert('All your data has been successfully deleted.');
      }
      
      setDeleting(false);
    } catch (error) {
      console.error('Failed to delete data:', error);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading privacy settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Initial consent screen
  if (!consentStatus?.hasConsent && !showSettings) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle>Privacy & Data Protection</CardTitle>
          </div>
          <CardDescription>
            We respect your privacy and are committed to protecting your personal data. 
            Please review and customize your privacy preferences below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Essential</Badge>
                <span className="font-medium">Required for core functionality</span>
              </div>
              <p className="text-sm text-gray-600">
                Basic data processing required for resume analysis, template generation, and core features.
                This cannot be disabled as it's necessary for the service to function.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="font-medium">Analytics & Performance</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us improve the platform by sharing anonymous usage data and performance metrics.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="personalization" className="font-medium">Personalization</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Enable personalized recommendations and customized user experience based on your usage patterns.
                  </p>
                </div>
                <Switch
                  id="personalization"
                  checked={preferences.personalization}
                  onCheckedChange={(checked) => handlePreferenceChange('personalization', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="marketing" className="font-medium">Marketing Communications</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive updates about new features, career tips, and platform improvements.
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          {showDetails && (
            <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-2">
              <h4 className="font-medium">Data Processing Information:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• All data is stored locally in your browser with encryption</li>
                <li>• No personal data is sent to external servers without your consent</li>
                <li>• You can export or delete your data at any time</li>
                <li>• We comply with GDPR and other privacy regulations</li>
                <li>• Data retention periods vary by category (7-90 days)</li>
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleConsentSubmit} disabled={loading} className="flex-1">
              Accept & Continue
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Settings view
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <CardTitle>Privacy Settings</CardTitle>
          </div>
          {consentStatus?.hasConsent && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Consent Given
            </Badge>
          )}
        </div>
        <CardDescription>
          Manage your privacy preferences and data controls.
          {consentStatus?.consentDate && (
            <span className="block mt-1 text-xs">
              Last updated: {new Date(consentStatus.consentDate).toLocaleDateString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium">Data Processing Preferences</h4>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="analytics-settings" className="font-medium">Analytics & Performance</Label>
              <p className="text-sm text-gray-600 mt-1">
                Anonymous usage data to improve the platform.
              </p>
            </div>
            <Switch
              id="analytics-settings"
              checked={preferences.analytics}
              onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="personalization-settings" className="font-medium">Personalization</Label>
              <p className="text-sm text-gray-600 mt-1">
                Customized recommendations and user experience.
              </p>
            </div>
            <Switch
              id="personalization-settings"
              checked={preferences.personalization}
              onCheckedChange={(checked) => handlePreferenceChange('personalization', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="marketing-settings" className="font-medium">Marketing Communications</Label>
              <p className="text-sm text-gray-600 mt-1">
                Updates and feature announcements.
              </p>
            </div>
            <Switch
              id="marketing-settings"
              checked={preferences.marketing}
              onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Data Rights (GDPR)</h4>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={exporting}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export My Data'}
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDeleteAllData}
              disabled={deleting}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete All Data'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Export includes all your data in JSON format. Deletion permanently removes all stored information.
          </p>
        </div>

        {consentStatus?.hasConsent && (
          <>
            <Separator />
            <Button onClick={handleUpdatePreferences} disabled={loading} className="w-full">
              Update Preferences
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PrivacyConsent;