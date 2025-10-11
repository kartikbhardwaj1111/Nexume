/**
 * Template Customizer Component
 * Allows users to customize template colors, fonts, layout, and sections
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Palette, 
  Type, 
  Layout, 
  List, 
  RotateCcw, 
  Eye,
  ChevronUp,
  ChevronDown,
  GripVertical
} from 'lucide-react';

const TemplateCustomizer = ({ template, onCustomize, onPreviewUpdate }) => {
  const [customizations, setCustomizations] = useState({
    colorScheme: 'blue',
    fontFamily: 'Arial',
    layoutDensity: 'normal',
    sectionOrder: [],
    sectionVisibility: {},
    customColors: {
      primary: '',
      secondary: '',
      text: '',
      background: '',
      accent: ''
    },
    fontSize: {
      name: 20,
      heading: 14,
      body: 11,
      small: 10
    },
    spacing: {
      margin: 0.75,
      sectionGap: 16,
      itemGap: 10
    }
  });

  const [activeTab, setActiveTab] = useState('colors');

  // Initialize customizations from template
  useEffect(() => {
    if (template) {
      const sections = template.sections || [];
      const sectionOrder = sections.sort((a, b) => a.order - b.order).map(s => s.id);
      const sectionVisibility = sections.reduce((acc, section) => {
        acc[section.id] = !section.required || true; // Show all sections by default
        return acc;
      }, {});

      setCustomizations(prev => ({
        ...prev,
        sectionOrder,
        sectionVisibility,
        customColors: {
          primary: template.styling?.colors?.primary || '#3498db',
          secondary: template.styling?.colors?.secondary || '#2980b9',
          text: template.styling?.colors?.text || '#2c3e50',
          background: template.styling?.colors?.background || '#ffffff',
          accent: template.styling?.colors?.accent || '#ecf0f1'
        },
        fontSize: {
          name: parseInt(template.styling?.fonts?.size?.name) || 20,
          heading: parseInt(template.styling?.fonts?.size?.heading) || 14,
          body: parseInt(template.styling?.fonts?.size?.body) || 11,
          small: parseInt(template.styling?.fonts?.size?.small) || 10
        }
      }));
    }
  }, [template]);

  // Apply customizations
  const applyCustomizations = () => {
    if (onCustomize) {
      onCustomize(customizations);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setCustomizations({
      colorScheme: 'blue',
      fontFamily: 'Arial',
      layoutDensity: 'normal',
      sectionOrder: template.sections?.sort((a, b) => a.order - b.order).map(s => s.id) || [],
      sectionVisibility: template.sections?.reduce((acc, section) => {
        acc[section.id] = true;
        return acc;
      }, {}) || {},
      customColors: {
        primary: template.styling?.colors?.primary || '#3498db',
        secondary: template.styling?.colors?.secondary || '#2980b9',
        text: template.styling?.colors?.text || '#2c3e50',
        background: template.styling?.colors?.background || '#ffffff',
        accent: template.styling?.colors?.accent || '#ecf0f1'
      },
      fontSize: {
        name: parseInt(template.styling?.fonts?.size?.name) || 20,
        heading: parseInt(template.styling?.fonts?.size?.heading) || 14,
        body: parseInt(template.styling?.fonts?.size?.body) || 11,
        small: parseInt(template.styling?.fonts?.size?.small) || 10
      },
      spacing: {
        margin: 0.75,
        sectionGap: 16,
        itemGap: 10
      }
    });
  };

  // Color scheme presets
  const colorSchemes = {
    blue: { primary: '#3498db', secondary: '#2980b9', accent: '#ecf0f1' },
    green: { primary: '#27ae60', secondary: '#229954', accent: '#e8f5e8' },
    purple: { primary: '#8e44ad', secondary: '#7d3c98', accent: '#f4ecf7' },
    red: { primary: '#e74c3c', secondary: '#c0392b', accent: '#fdf2f2' },
    dark: { primary: '#2c3e50', secondary: '#34495e', accent: '#f8f9fa' },
    orange: { primary: '#f39c12', secondary: '#e67e22', accent: '#fef9e7' }
  };

  // Font options
  const fontOptions = [
    { value: 'Arial', label: 'Arial (Sans-serif)' },
    { value: 'Helvetica', label: 'Helvetica (Sans-serif)' },
    { value: 'Times New Roman', label: 'Times New Roman (Serif)' },
    { value: 'Georgia', label: 'Georgia (Serif)' },
    { value: 'Calibri', label: 'Calibri (Sans-serif)' },
    { value: 'Verdana', label: 'Verdana (Sans-serif)' }
  ];

  // Layout density options
  const densityOptions = [
    { value: 'compact', label: 'Compact', description: 'More content, less spacing' },
    { value: 'normal', label: 'Normal', description: 'Balanced spacing' },
    { value: 'spacious', label: 'Spacious', description: 'More spacing, easier to read' }
  ];

  // Handle color scheme change
  const handleColorSchemeChange = (scheme) => {
    const colors = colorSchemes[scheme];
    setCustomizations(prev => ({
      ...prev,
      colorScheme: scheme,
      customColors: {
        ...prev.customColors,
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent
      }
    }));
  };

  // Handle section reordering
  const moveSectionUp = (sectionId) => {
    const currentIndex = customizations.sectionOrder.indexOf(sectionId);
    if (currentIndex > 0) {
      const newOrder = [...customizations.sectionOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      setCustomizations(prev => ({ ...prev, sectionOrder: newOrder }));
    }
  };

  const moveSectionDown = (sectionId) => {
    const currentIndex = customizations.sectionOrder.indexOf(sectionId);
    if (currentIndex < customizations.sectionOrder.length - 1) {
      const newOrder = [...customizations.sectionOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setCustomizations(prev => ({ ...prev, sectionOrder: newOrder }));
    }
  };

  // Handle section visibility toggle
  const toggleSectionVisibility = (sectionId) => {
    setCustomizations(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionId]: !prev.sectionVisibility[sectionId]
      }
    }));
  };

  // Get section by ID
  const getSectionById = (sectionId) => {
    return template.sections?.find(s => s.id === sectionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customize Template</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button size="sm" onClick={applyCustomizations}>
            <Eye className="w-4 h-4 mr-1" />
            Apply Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors" className="flex items-center gap-1">
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="fonts" className="flex items-center gap-1">
            <Type className="w-4 h-4" />
            Fonts
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-1">
            <Layout className="w-4 h-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-1">
            <List className="w-4 h-4" />
            Sections
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Color Schemes */}
              <div>
                <Label className="text-sm font-medium">Preset Schemes</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {Object.entries(colorSchemes).map(([key, colors]) => (
                    <button
                      key={key}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customizations.colorScheme === key 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleColorSchemeChange(key)}
                    >
                      <div className="flex gap-1 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: colors.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: colors.accent }}
                        />
                      </div>
                      <div className="text-xs font-medium capitalize">{key}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Custom Colors</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(customizations.customColors).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs capitalize">{key}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) => setCustomizations(prev => ({
                            ...prev,
                            customColors: { ...prev.customColors, [key]: e.target.value }
                          }))}
                          className="w-12 h-8 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) => setCustomizations(prev => ({
                            ...prev,
                            customColors: { ...prev.customColors, [key]: e.target.value }
                          }))}
                          className="flex-1 text-xs"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fonts Tab */}
        <TabsContent value="fonts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Font Family */}
              <div>
                <Label className="text-sm font-medium">Font Family</Label>
                <Select 
                  value={customizations.fontFamily} 
                  onValueChange={(value) => setCustomizations(prev => ({ ...prev, fontFamily: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Sizes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Font Sizes</Label>
                {Object.entries(customizations.fontSize).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-xs capitalize">{key}</Label>
                      <span className="text-xs text-gray-500">{value}px</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => setCustomizations(prev => ({
                        ...prev,
                        fontSize: { ...prev.fontSize, [key]: newValue }
                      }))}
                      min={key === 'name' ? 16 : key === 'heading' ? 12 : 8}
                      max={key === 'name' ? 32 : key === 'heading' ? 20 : 16}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Layout Density */}
              <div>
                <Label className="text-sm font-medium">Layout Density</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {densityOptions.map(option => (
                    <button
                      key={option.value}
                      className={`p-3 text-left rounded-lg border-2 transition-all ${
                        customizations.layoutDensity === option.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setCustomizations(prev => ({ ...prev, layoutDensity: option.value }))}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing Controls */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Spacing</Label>
                {Object.entries(customizations.spacing).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      <span className="text-xs text-gray-500">
                        {key === 'margin' ? `${value}in` : `${value}px`}
                      </span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => setCustomizations(prev => ({
                        ...prev,
                        spacing: { ...prev.spacing, [key]: newValue }
                      }))}
                      min={key === 'margin' ? 0.25 : 4}
                      max={key === 'margin' ? 1.5 : 40}
                      step={key === 'margin' ? 0.25 : 2}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {customizations.sectionOrder.map((sectionId, index) => {
                  const section = getSectionById(sectionId);
                  if (!section) return null;

                  return (
                    <div
                      key={sectionId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm">{section.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {section.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                            <span className="text-xs text-gray-500">Order: {index + 1}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Visibility Toggle */}
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Visible</Label>
                          <Switch
                            checked={customizations.sectionVisibility[sectionId]}
                            onCheckedChange={() => toggleSectionVisibility(sectionId)}
                            disabled={section.required}
                          />
                        </div>

                        {/* Move Buttons */}
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveSectionUp(sectionId)}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveSectionDown(sectionId)}
                            disabled={index === customizations.sectionOrder.length - 1}
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateCustomizer;