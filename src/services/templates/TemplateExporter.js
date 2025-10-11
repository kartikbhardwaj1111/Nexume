/**
 * Template Exporter Service
 * Handles PDF generation, DOCX export, and template sharing functionality
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class TemplateExporter {
  constructor() {
    this.exportHistory = new Map();
  }

  /**
   * Export template as PDF
   */
  async exportToPDF(templateHtml, userData, options = {}) {
    try {
      const {
        filename = 'resume.pdf',
        format = 'a4',
        orientation = 'portrait',
        quality = 1.0,
        margin = 10
      } = options;

      // Create a temporary container for the HTML
      const container = this.createTempContainer(templateHtml);
      document.body.appendChild(container);

      // Wait for fonts and styles to load
      await this.waitForFontsAndStyles(container);

      // Generate canvas from HTML
      const canvas = await html2canvas(container, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: container.scrollWidth,
        height: container.scrollHeight
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);

      // Save PDF
      pdf.save(filename);

      // Track export
      this.trackExport('pdf', userData, filename);

      return {
        success: true,
        filename,
        size: pdf.output('blob').size
      };
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error(`PDF export failed: ${error.message}`);
    }
  }

  /**
   * Export template as DOCX (simplified HTML to DOCX conversion)
   */
  async exportToDOCX(templateHtml, userData, options = {}) {
    try {
      const {
        filename = 'resume.docx'
      } = options;

      // Convert HTML to Word-compatible format
      const wordContent = this.convertHtmlToWordFormat(templateHtml);
      
      // Create DOCX blob
      const blob = new Blob([wordContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      // Download file
      this.downloadBlob(blob, filename);

      // Track export
      this.trackExport('docx', userData, filename);

      return {
        success: true,
        filename,
        size: blob.size
      };
    } catch (error) {
      console.error('DOCX export failed:', error);
      throw new Error(`DOCX export failed: ${error.message}`);
    }
  }

  /**
   * Export template as HTML
   */
  async exportToHTML(templateHtml, userData, options = {}) {
    try {
      const {
        filename = 'resume.html',
        includeStyles = true
      } = options;

      let htmlContent = templateHtml;

      if (includeStyles) {
        // Add responsive styles for better viewing
        htmlContent = this.addResponsiveStyles(htmlContent);
      }

      const blob = new Blob([htmlContent], { type: 'text/html' });
      this.downloadBlob(blob, filename);

      // Track export
      this.trackExport('html', userData, filename);

      return {
        success: true,
        filename,
        size: blob.size
      };
    } catch (error) {
      console.error('HTML export failed:', error);
      throw new Error(`HTML export failed: ${error.message}`);
    }
  }

  /**
   * Generate shareable link for template
   */
  async generateShareableLink(template, userData, options = {}) {
    try {
      const {
        expiresIn = 7 * 24 * 60 * 60 * 1000, // 7 days
        password = null,
        allowDownload = true
      } = options;

      // Generate unique share ID
      const shareId = this.generateShareId();
      const expiryDate = new Date(Date.now() + expiresIn);

      // Create share data
      const shareData = {
        id: shareId,
        template,
        userData,
        createdAt: new Date(),
        expiresAt: expiryDate,
        password,
        allowDownload,
        viewCount: 0,
        downloadCount: 0
      };

      // Store share data (in real app, this would be stored on server)
      localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));

      const shareUrl = `${window.location.origin}/share/${shareId}`;

      // Track sharing
      this.trackExport('share', userData, shareUrl);

      return {
        success: true,
        shareId,
        shareUrl,
        expiresAt: expiryDate
      };
    } catch (error) {
      console.error('Share link generation failed:', error);
      throw new Error(`Share link generation failed: ${error.message}`);
    }
  }

  /**
   * Save template to user's collection
   */
  async saveTemplate(template, userData, customizations = {}) {
    try {
      const savedTemplate = {
        id: `saved_${Date.now()}`,
        originalId: template.id,
        name: template.name,
        customizations,
        userData,
        savedAt: new Date(),
        lastModified: new Date()
      };

      // Get existing saved templates
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      savedTemplates.push(savedTemplate);

      // Store updated list
      localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));

      return {
        success: true,
        savedTemplate
      };
    } catch (error) {
      console.error('Template save failed:', error);
      throw new Error(`Template save failed: ${error.message}`);
    }
  }

  /**
   * Get user's saved templates
   */
  getSavedTemplates() {
    try {
      return JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    } catch (error) {
      console.error('Failed to load saved templates:', error);
      return [];
    }
  }

  /**
   * Delete saved template
   */
  deleteSavedTemplate(templateId) {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      const filtered = savedTemplates.filter(t => t.id !== templateId);
      localStorage.setItem('savedTemplates', JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete saved template:', error);
      throw new Error(`Failed to delete saved template: ${error.message}`);
    }
  }

  /**
   * Get export history
   */
  getExportHistory() {
    return Array.from(this.exportHistory.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Helper Methods
   */

  createTempContainer(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '8.5in';
    container.style.minHeight = '11in';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '11px';
    container.style.lineHeight = '1.4';
    return container;
  }

  async waitForFontsAndStyles(container) {
    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Wait for images to load
    const images = container.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    await Promise.all(imagePromises);

    // Small delay to ensure all styles are applied
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  convertHtmlToWordFormat(html) {
    // Simplified HTML to Word conversion
    // In a real implementation, you'd use a library like docx or mammoth.js
    
    const wordHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Resume</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowRevisions/>
            <w:DoNotPrintRevisions/>
            <w:DoNotShowMarkup/>
            <w:DoNotShowComments/>
            <w:DoNotShowInsertionsAndDeletions/>
            <w:DoNotShowPropertyChanges/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page { margin: 1in; }
          body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; }
          h1, h2, h3 { color: #2c3e50; }
          .section-title { font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; }
        </style>
      </head>
      <body>
    `;

    const wordFooter = '</body></html>';

    // Clean up HTML for Word compatibility
    let cleanHtml = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
      .replace(/class="[^"]*"/gi, '') // Remove class attributes
      .replace(/style="[^"]*"/gi, '') // Remove inline styles
      .replace(/<div/gi, '<p') // Convert divs to paragraphs
      .replace(/<\/div>/gi, '</p>');

    return wordHeader + cleanHtml + wordFooter;
  }

  addResponsiveStyles(html) {
    const responsiveStyles = `
      <style>
        @media screen and (max-width: 768px) {
          .resume-container { padding: 10px !important; }
          .header { padding: 15px !important; }
          .section { margin-bottom: 15px !important; }
          .item-header { flex-direction: column !important; align-items: flex-start !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
        }
        @media print {
          body { margin: 0; }
          .resume-container { box-shadow: none; }
        }
      </style>
    `;

    return html.replace('</head>', responsiveStyles + '</head>');
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateShareId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  trackExport(type, userData, filename) {
    const exportRecord = {
      id: Date.now(),
      type,
      filename,
      timestamp: new Date(),
      userInfo: {
        name: userData?.personalInfo?.firstName + ' ' + userData?.personalInfo?.lastName,
        email: userData?.personalInfo?.email
      }
    };

    this.exportHistory.set(exportRecord.id, exportRecord);

    // Also store in localStorage for persistence
    const history = JSON.parse(localStorage.getItem('exportHistory') || '[]');
    history.push(exportRecord);
    localStorage.setItem('exportHistory', JSON.stringify(history.slice(-50))); // Keep last 50 exports
  }

  /**
   * Batch export multiple formats
   */
  async batchExport(templateHtml, userData, formats = ['pdf', 'html'], options = {}) {
    const results = [];
    
    for (const format of formats) {
      try {
        let result;
        switch (format) {
          case 'pdf':
            result = await this.exportToPDF(templateHtml, userData, options.pdf);
            break;
          case 'docx':
            result = await this.exportToDOCX(templateHtml, userData, options.docx);
            break;
          case 'html':
            result = await this.exportToHTML(templateHtml, userData, options.html);
            break;
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
        results.push({ format, ...result });
      } catch (error) {
        results.push({ format, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get export statistics
   */
  getExportStats() {
    const history = this.getExportHistory();
    const stats = {
      totalExports: history.length,
      byFormat: {},
      byDate: {},
      recentExports: history.slice(0, 10)
    };

    history.forEach(record => {
      // Count by format
      stats.byFormat[record.type] = (stats.byFormat[record.type] || 0) + 1;

      // Count by date
      const date = record.timestamp.toDateString();
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    });

    return stats;
  }
}

// Export singleton instance
export const templateExporter = new TemplateExporter();
export default TemplateExporter;