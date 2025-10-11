/**
 * Finance Category Templates
 * ATS-optimized resume templates for finance professionals
 */

export const financeTemplates = {
  modern: {
    name: 'Finance Modern',
    description: 'Professional modern design for financial analysts and consultants',
    atsScore: 90,
    features: ['Professional appearance', 'Quantitative focus', 'Achievement emphasis'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Professional Summary', required: false, order: 2 },
      { id: 'experience', name: 'Professional Experience', required: true, order: 3 },
      { id: 'skills', name: 'Core Competencies', required: true, order: 4 },
      { id: 'education', name: 'Education', required: true, order: 5 },
      { id: 'certifications', name: 'Certifications & Licenses', required: false, order: 6 },
      { id: 'achievements', name: 'Key Achievements', required: false, order: 7 }
    ],
    styling: {
      colors: {
        primary: '#1e3a8a',
        secondary: '#1e40af',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#f1f5f9'
      },
      fonts: {
        heading: 'Arial',
        body: 'Arial',
        size: {
          name: '20px',
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
    name: 'Finance Classic',
    description: 'Traditional executive format for senior finance professionals',
    atsScore: 95,
    features: ['Executive appearance', 'Conservative design', 'Maximum ATS compatibility'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Executive Summary', required: false, order: 2 },
      { id: 'experience', name: 'Professional Experience', required: true, order: 3 },
      { id: 'education', name: 'Education', required: true, order: 4 },
      { id: 'skills', name: 'Core Competencies', required: true, order: 5 },
      { id: 'certifications', name: 'Professional Certifications', required: false, order: 6 }
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
    name: 'Finance Minimal',
    description: 'Clean, data-focused design for quantitative analysts',
    atsScore: 87,
    features: ['Data-driven layout', 'Clean presentation', 'Metrics focus'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'experience', name: 'Experience', required: true, order: 2 },
      { id: 'skills', name: 'Technical Skills', required: true, order: 3 },
      { id: 'education', name: 'Education', required: true, order: 4 },
      { id: 'certifications', name: 'Certifications', required: false, order: 5 }
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
          name: '22px',
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
    name: 'Finance Creative',
    description: 'Modern design for fintech and investment banking professionals',
    atsScore: 83,
    features: ['Modern appeal', 'Professional creativity', 'Industry-appropriate'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Profile', required: false, order: 2 },
      { id: 'experience', name: 'Career Highlights', required: true, order: 3 },
      { id: 'skills', name: 'Expertise', required: true, order: 4 },
      { id: 'education', name: 'Academic Background', required: true, order: 5 },
      { id: 'certifications', name: 'Professional Credentials', required: false, order: 6 }
    ],
    styling: {
      colors: {
        primary: '#059669',
        secondary: '#047857',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#f0fdf4'
      },
      fonts: {
        heading: 'Georgia',
        body: 'Arial',
        size: {
          name: '20px',
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
  }
};

export default financeTemplates;