/**
 * Marketing Category Templates
 * ATS-optimized resume templates for marketing professionals
 */

export const marketingTemplates = {
  modern: {
    name: 'Marketing Modern',
    description: 'Dynamic design for digital marketers and brand managers',
    atsScore: 89,
    features: ['Creative appeal', 'Campaign focus', 'Results-driven layout'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Brand Summary', required: false, order: 2 },
      { id: 'experience', name: 'Marketing Experience', required: true, order: 3 },
      { id: 'skills', name: 'Marketing Skills', required: true, order: 4 },
      { id: 'campaigns', name: 'Key Campaigns', required: false, order: 5 },
      { id: 'education', name: 'Education', required: true, order: 6 },
      { id: 'certifications', name: 'Marketing Certifications', required: false, order: 7 }
    ],
    styling: {
      colors: {
        primary: '#7c3aed',
        secondary: '#6d28d9',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#f5f3ff'
      },
      fonts: {
        heading: 'Arial',
        body: 'Arial',
        size: {
          name: '22px',
          heading: '14px',
          body: '11px',
          small: '10px'
        }
      },
      layout: 'single-column',
      spacing: {
        margin: '0.75in',
        sectionGap: '16px',
        itemGap: '10px'
      }
    }
  },

  classic: {
    name: 'Marketing Classic',
    description: 'Professional format for senior marketing executives',
    atsScore: 92,
    features: ['Executive presence', 'Strategic focus', 'Professional credibility'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Executive Summary', required: false, order: 2 },
      { id: 'experience', name: 'Professional Experience', required: true, order: 3 },
      { id: 'achievements', name: 'Key Achievements', required: false, order: 4 },
      { id: 'skills', name: 'Core Competencies', required: true, order: 5 },
      { id: 'education', name: 'Education', required: true, order: 6 }
    ],
    styling: {
      colors: {
        primary: '#1f2937',
        secondary: '#374151',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#f9fafb'
      },
      fonts: {
        heading: 'Times New Roman',
        body: 'Times New Roman',
        size: {
          name: '18px',
          heading: '14px',
          body: '11px',
          small: '10px'
        }
      },
      layout: 'single-column',
      spacing: {
        margin: '1in',
        sectionGap: '18px',
        itemGap: '12px'
      }
    }
  },

  minimal: {
    name: 'Marketing Minimal',
    description: 'Clean, metrics-focused design for performance marketers',
    atsScore: 86,
    features: ['Metrics emphasis', 'Clean design', 'Performance focus'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'experience', name: 'Experience', required: true, order: 2 },
      { id: 'skills', name: 'Marketing Tools', required: true, order: 3 },
      { id: 'achievements', name: 'Key Results', required: false, order: 4 },
      { id: 'education', name: 'Education', required: true, order: 5 },
      { id: 'certifications', name: 'Certifications', required: false, order: 6 }
    ],
    styling: {
      colors: {
        primary: '#000000',
        secondary: '#4b5563',
        text: '#374151',
        background: '#ffffff',
        accent: '#f3f4f6'
      },
      fonts: {
        heading: 'Helvetica',
        body: 'Helvetica',
        size: {
          name: '24px',
          heading: '13px',
          body: '11px',
          small: '10px'
        }
      },
      layout: 'single-column',
      spacing: {
        margin: '0.75in',
        sectionGap: '20px',
        itemGap: '8px'
      }
    }
  },

  creative: {
    name: 'Marketing Creative',
    description: 'Bold, creative design for creative directors and brand strategists',
    atsScore: 82,
    features: ['Creative showcase', 'Brand personality', 'Visual impact'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Creative Vision', required: false, order: 2 },
      { id: 'experience', name: 'Creative Experience', required: true, order: 3 },
      { id: 'portfolio', name: 'Portfolio Highlights', required: false, order: 4 },
      { id: 'skills', name: 'Creative Skills', required: true, order: 5 },
      { id: 'education', name: 'Education', required: true, order: 6 }
    ],
    styling: {
      colors: {
        primary: '#f59e0b',
        secondary: '#d97706',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#fffbeb'
      },
      fonts: {
        heading: 'Georgia',
        body: 'Arial',
        size: {
          name: '22px',
          heading: '14px',
          body: '11px',
          small: '10px'
        }
      },
      layout: 'two-column',
      spacing: {
        margin: '0.75in',
        sectionGap: '16px',
        itemGap: '10px'
      }
    }
  }
};

export default marketingTemplates;