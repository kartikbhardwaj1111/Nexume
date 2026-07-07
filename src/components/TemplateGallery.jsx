/**
 * Template Gallery Component
 * Displays available resume templates with filtering and search
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Filter, Star, Download, Eye, Palette } from 'lucide-react';
import { templateEngine } from '../services/templates/index.js';
import TemplatePreview from './TemplatePreview';

const ScaledThumbnail = ({ template }) => {
  const containerRef = React.useRef(null);
  const [scale, setScale] = React.useState(0.28); // Default safe scale

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const updateScale = () => {
      const width = containerRef.current.offsetWidth;
      if (width) {
        setScale(width / 800);
      }
    };

    updateScale();
    
    // Set up ResizeObserver for responsive resizing
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="aspect-[8.5/11] bg-white border border-border shadow-sm rounded-lg mb-4 overflow-hidden relative w-full"
    >
      <iframe 
        srcDoc={templateEngine.generatePreview(template).html}
        className="absolute top-0 left-0 border-none origin-top-left pointer-events-none bg-white w-[800px] h-[1035px]"
        style={{ 
          transform: `scale(${scale})`
        }}
        title={template.name}
        scrolling="no"
      />
    </div>
  );
};

const TemplateGallery = ({ onTemplateSelect, selectedTemplateId, userProfile = null }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [sortBy, setSortBy] = useState('atsScore');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const allTemplates = templateEngine.getTemplates();
        setTemplates(allTemplates);
        setFilteredTemplates(allTemplates);
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Filter and search templates
  useEffect(() => {
    let filtered = [...templates];

    // Apply search filter
    if (searchQuery) {
      filtered = templateEngine.searchTemplates(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Apply style filter
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(template => template.style === selectedStyle);
    }

    // Sort templates
    filtered = templateEngine.sortTemplates(filtered, sortBy);

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, selectedCategory, selectedStyle, sortBy]);

  // Get unique categories and styles for filters
  const categories = useMemo(() => {
    const cats = [...new Set(templates.map(t => t.category))];
    return cats.map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: templates.filter(t => t.category === cat).length
    }));
  }, [templates]);

  const styles = useMemo(() => {
    const styls = [...new Set(templates.map(t => t.style))];
    return styls.map(style => ({
      value: style,
      label: style.charAt(0).toUpperCase() + style.slice(1),
      count: templates.filter(t => t.style === style).length
    }));
  }, [templates]);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  // Handle template preview
  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
  };

  // Get ATS score color
  const getAtsScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-500/20';
    if (score >= 80) return 'text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/20';
    if (score >= 70) return 'text-yellow-600 bg-yellow-500/10 dark:text-yellow-400 dark:bg-yellow-500/20';
    return 'text-red-600 bg-red-500/10 dark:text-red-400 dark:bg-red-500/20';
  };

  // Render template card
  const renderTemplateCard = (template) => (
    <Card 
      key={template.id} 
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md border border-border shadow-sm bg-card hover:border-primary/30 ${
        selectedTemplateId === template.id ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={() => handlePreviewTemplate(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground">{template.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{template.description}</p>
          </div>
          <Badge className={`${getAtsScoreColor(template.atsScore)} text-[10px] font-bold px-2 py-0.5 whitespace-nowrap`}>
            {template.atsScore}% ATS
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Template Preview Thumbnail */}
        <ScaledThumbnail template={template} />

        {/* Template Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {template.category}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0">
              {template.style}
            </Badge>
          </div>

          {/* Features */}
          {template.metadata?.features && (
            <div className="text-[11px] text-muted-foreground">
              <div className="font-semibold text-foreground mb-1 text-xs">Features:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {template.metadata.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="truncate">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Usage Stats */}
          <div className="flex justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2.5">
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {template.metadata?.downloads || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {Math.floor((template.metadata?.downloads || 0) * 5)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {Math.floor(template.atsScore / 20)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <Button
              size="sm"
              className="w-full font-semibold bg-primary hover:bg-primary/95 text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleTemplateSelect(template);
              }}
            >
              Select Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resume Templates</h2>
          <p className="text-gray-600">Choose from {templates.length} ATS-optimized templates</p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {styles.map(style => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label} ({style.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atsScore">ATS Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="downloads">Popular</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>

      {/* Templates Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {filteredTemplates.map(template => renderTemplateCard(template))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStyle('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            handleTemplateSelect(previewTemplate);
            setPreviewTemplate(null);
          }}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default TemplateGallery;