/**
 * Template Preview Component
 * Shows a full preview of a resume template with live data population
 */

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Eye, 
  Download, 
  Palette, 
  Settings, 
  Maximize2, 
  Minimize2,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { templateEngine } from '../services/templates/index.js';
import TemplateCustomizer from './TemplateCustomizer';
import TemplateExportDialog from './TemplateExportDialog';

const TemplatePreview = ({ 
  template, 
  isOpen, 
  onClose, 
  onSelect, 
  userProfile = null,
  userData = null 
}) => {
  const [previewData, setPreviewData] = useState(null);
  const [customizedTemplate, setCustomizedTemplate] = useState(template);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const previewRef = useRef(null);

  // Generate preview data when template or userData changes
  useEffect(() => {
    if (template && isOpen) {
      generatePreview();
    }
  }, [template, userData, isOpen]);

  const generatePreview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use provided userData or generate sample data
      const dataToUse = userData || getSampleUserData(template.category);
      
      // Generate preview using template engine
      const preview = templateEngine.generatePreview(customizedTemplate, dataToUse);
      setPreviewData(preview);
    } catch (err) {
      console.error('Failed to generate preview:', err);
      setError('Failed to generate template preview');
    } finally {
      setLoading(false);
    }
  };

  // Get sample user data based on template category
  const getSampleUserData = (category) => {
    const baseData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        location: 'New York, NY',
        linkedIn: 'linkedin.com/in/johndoe',
        portfolio: 'johndoe.dev'
      },
      resume: {
        summary: 'Experienced professional with a proven track record of success in delivering high-quality results and driving organizational growth.',
        experience: [
          {
            position: 'Senior Developer',
            company: 'Tech Company Inc.',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2023-12-31'),
            current: false,
            description: 'Led development of web applications and mentored junior developers.',
            achievements: [
              'Improved application performance by 40%',
              'Mentored 5 junior developers',
              'Led migration to microservices architecture'
            ]
          },
          {
            position: 'Software Developer',
            company: 'StartupXYZ',
            startDate: new Date('2018-06-01'),
            endDate: new Date('2019-12-31'),
            current: false,
            description: 'Developed full-stack web applications using modern technologies.',
            achievements: [
              'Built 3 major product features',
              'Reduced bug reports by 60%'
            ]
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of Technology',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-05-01'),
            gpa: '3.8',
            honors: ['Magna Cum Laude', 'Dean\'s List']
          }
        ],
        skills: [
          { name: 'JavaScript', category: 'Programming Languages' },
          { name: 'Python', category: 'Programming Languages' },
          { name: 'React', category: 'Frameworks' },
          { name: 'Node.js', category: 'Backend' },
          { name: 'AWS', category: 'Cloud Platforms' },
          { name: 'Docker', category: 'DevOps' }
        ],
        certifications: [
          {
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            issueDate: new Date('2022-03-15'),
            expiryDate: new Date('2025-03-15')
          }
        ]
      }
    };

    // Customize based on category
    switch (category) {
      case 'finance':
        baseData.personalInfo.firstName = 'Sarah';
        baseData.personalInfo.lastName = 'Johnson';
        baseData.resume.experience[0] = {
          position: 'Senior Financial Analyst',
          company: 'Global Finance Corp',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          current: false,
          description: 'Analyzed financial data and provided strategic recommendations.',
          achievements: [
            'Increased portfolio returns by 15%',
            'Managed $50M in assets',
            'Streamlined reporting processes'
          ]
        };
        baseData.resume.skills = [
          { name: 'Financial Modeling', category: 'Core Skills' },
          { name: 'Excel', category: 'Software' },
          { name: 'Bloomberg Terminal', category: 'Software' },
          { name: 'Risk Analysis', category: 'Core Skills' }
        ];
        break;

      case 'healthcare':
        baseData.personalInfo.firstName = 'Dr. Emily';
        baseData.personalInfo.lastName = 'Chen';
        baseData.resume.experience[0] = {
          position: 'Registered Nurse',
          company: 'City General Hospital',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          current: false,
          description: 'Provided patient care in intensive care unit.',
          achievements: [
            'Maintained 98% patient satisfaction score',
            'Led quality improvement initiatives',
            'Mentored new nursing staff'
          ]
        };
        baseData.resume.skills = [
          { name: 'Patient Care', category: 'Clinical Skills' },
          { name: 'Emergency Response', category: 'Clinical Skills' },
          { name: 'Electronic Health Records', category: 'Technology' },
          { name: 'Team Leadership', category: 'Soft Skills' }
        ];
        break;

      case 'marketing':
        baseData.personalInfo.firstName = 'Alex';
        baseData.personalInfo.lastName = 'Rodriguez';
        baseData.resume.experience[0] = {
          position: 'Digital Marketing Manager',
          company: 'Creative Agency Ltd',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          current: false,
          description: 'Managed digital marketing campaigns and brand strategy.',
          achievements: [
            'Increased brand awareness by 200%',
            'Generated $2M in revenue',
            'Managed team of 8 marketers'
          ]
        };
        baseData.resume.skills = [
          { name: 'Google Analytics', category: 'Analytics' },
          { name: 'Social Media Marketing', category: 'Marketing' },
          { name: 'Content Strategy', category: 'Marketing' },
          { name: 'Adobe Creative Suite', category: 'Design Tools' }
        ];
        break;

      case 'education':
        baseData.personalInfo.firstName = 'Michael';
        baseData.personalInfo.lastName = 'Thompson';
        baseData.resume.experience[0] = {
          position: 'High School Mathematics Teacher',
          company: 'Lincoln High School',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          current: false,
          description: 'Taught advanced mathematics and mentored students.',
          achievements: [
            'Improved student test scores by 25%',
            'Developed innovative curriculum',
            'Coached math competition team'
          ]
        };
        baseData.resume.skills = [
          { name: 'Curriculum Development', category: 'Teaching' },
          { name: 'Classroom Management', category: 'Teaching' },
          { name: 'Educational Technology', category: 'Technology' },
          { name: 'Student Assessment', category: 'Teaching' }
        ];
        break;
    }

    return baseData;
  };

  // Handle template customization
  const handleCustomization = (customizations) => {
    try {
      const customized = templateEngine.customizeTemplate(template.id, customizations);
      setCustomizedTemplate(customized);
      
      // Regenerate preview with customized template
      setTimeout(generatePreview, 100);
    } catch (err) {
      console.error('Failed to customize template:', err);
      setError('Failed to apply customizations');
    }
  };

  // Handle template selection
  const handleSelect = () => {
    if (onSelect) {
      onSelect(customizedTemplate);
    }
  };

  // Get ATS score color and status
  const getAtsScoreInfo = (score) => {
    if (score >= 90) return { color: 'text-green-600 bg-green-100', status: 'Excellent', icon: CheckCircle };
    if (score >= 80) return { color: 'text-blue-600 bg-blue-100', status: 'Good', icon: CheckCircle };
    if (score >= 70) return { color: 'text-yellow-600 bg-yellow-100', status: 'Fair', icon: AlertCircle };
    return { color: 'text-red-600 bg-red-100', status: 'Poor', icon: AlertCircle };
  };

  const atsInfo = getAtsScoreInfo(customizedTemplate.atsScore);
  const AtsIcon = atsInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full h-full' : 'max-w-6xl max-h-[90vh]'} overflow-hidden`}>
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">{customizedTemplate.name}</DialogTitle>
            <p className="text-sm text-gray-600 mt-1">{customizedTemplate.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${atsInfo.color} text-xs font-medium`}>
              <AtsIcon className="w-3 h-3 mr-1" />
              {customizedTemplate.atsScore}% ATS - {atsInfo.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 mt-4">
            <div className="h-full border rounded-lg overflow-hidden bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating preview...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-red-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>{error}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={generatePreview}>
                      Retry
                    </Button>
                  </div>
                </div>
              ) : previewData ? (
                <div className="h-full overflow-auto p-4">
                  <div 
                    ref={previewRef}
                    className="bg-white shadow-lg mx-auto"
                    style={{ 
                      width: '8.5in', 
                      minHeight: '11in',
                      transform: isFullscreen ? 'scale(1)' : 'scale(0.8)',
                      transformOrigin: 'top center'
                    }}
                    dangerouslySetInnerHTML={{ __html: previewData.html }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">No preview available</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="customize" className="flex-1 mt-4">
            <TemplateCustomizer
              template={customizedTemplate}
              onCustomize={handleCustomization}
              onPreviewUpdate={generatePreview}
            />
          </TabsContent>

          <TabsContent value="details" className="flex-1 mt-4 overflow-auto">
            <div className="space-y-6">
              {/* Template Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="text-sm text-gray-900 capitalize">{customizedTemplate.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Style</label>
                      <p className="text-sm text-gray-900 capitalize">{customizedTemplate.style}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">ATS Score</label>
                      <p className="text-sm text-gray-900">{customizedTemplate.atsScore}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Downloads</label>
                      <p className="text-sm text-gray-900">{customizedTemplate.metadata?.downloads || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              {customizedTemplate.metadata?.features && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {customizedTemplate.metadata.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Sections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customizedTemplate.sections?.map((section, index) => (
                      <div key={section.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{section.name}</span>
                        <div className="flex items-center gap-2">
                          {section.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                          <span className="text-xs text-gray-500">Order: {section.order}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4" />
            <span>Rating: {Math.floor(customizedTemplate.atsScore / 20)}/5</span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowExportDialog(true)}
              disabled={!previewData?.html}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleSelect}>
              Use This Template
            </Button>
          </div>
        </DialogFooter>

        {/* Export Dialog */}
        <TemplateExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          template={customizedTemplate}
          templateHtml={previewData?.html}
          userData={userData || getSampleUserData(customizedTemplate.category)}
          onExportComplete={(result) => {
            console.log('Export completed:', result);
            setShowExportDialog(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;