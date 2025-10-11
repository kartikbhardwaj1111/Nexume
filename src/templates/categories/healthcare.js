/**
 * Healthcare Category Templates
 * ATS-optimized resume templates for healthcare professionals
 */

export const healthcareTemplates = {
  modern: {
    name: 'Healthcare Modern',
    description: 'Professional design for nurses, physicians, and healthcare administrators',
    atsScore: 91,
    features: ['Medical professional focus', 'Certification emphasis', 'Clean layout'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Professional Summary', required: false, order: 2 },
      { id: 'licenses', name: 'Licenses & Certifications', required: false, order: 3 },
      { id: 'experience', name: 'Clinical Experience', required: true, order: 4 },
      { id: 'education', name: 'Education', required: true, order: 5 },
      { id: 'skills', name: 'Clinical Skills', required: true, order: 6 },
      { id: 'certifications', name: 'Additional Certifications', required: false, order: 7 }
    ],
    styling: {
      colors: {
        primary: '#dc2626',
        secondary: '#b91c1c',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#fef2f2'
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
    name: 'Healthcare Classic',
    description: 'Traditional medical format for senior healthcare professionals',
    atsScore: 94,
    features: ['Medical tradition', 'Professional credibility', 'ATS optimized'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Professional Summary', required: false, order: 2 },
      { id: 'education', name: 'Medical Education', required: true, order: 3 },
      { id: 'licenses', name: 'Medical Licenses', required: false, order: 4 },
      { id: 'experience', name: 'Professional Experience', required: true, order: 5 },
      { id: 'skills', name: 'Clinical Competencies', required: true, order: 6 },
      { id: 'certifications', name: 'Board Certifications', required: false, order: 7 }
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
    name: 'Healthcare Minimal',
    description: 'Clean, focused design for healthcare specialists',
    atsScore: 88,
    features: ['Specialty focus', 'Clean presentation', 'Credential emphasis'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'licenses', name: 'Licenses', required: false, order: 2 },
      { id: 'experience', name: 'Experience', required: true, order: 3 },
      { id: 'education', name: 'Education', required: true, order: 4 },
      { id: 'skills', name: 'Specializations', required: true, order: 5 },
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
    name: 'Healthcare Creative',
    description: 'Modern design for healthcare innovation and administration',
    atsScore: 85,
    features: ['Innovation focus', 'Modern healthcare', 'Administrative appeal'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Professional Profile', required: false, order: 2 },
      { id: 'experience', name: 'Healthcare Experience', required: true, order: 3 },
      { id: 'skills', name: 'Core Competencies', required: true, order: 4 },
      { id: 'education', name: 'Academic Background', required: true, order: 5 },
      { id: 'certifications', name: 'Professional Credentials', required: false, order: 6 }
    ],
    styling: {
      colors: {
        primary: '#0891b2',
        secondary: '#0e7490',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#f0f9ff'
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

export default healthcareTemplates;