/**
 * Education Category Templates
 * ATS-optimized resume templates for education professionals
 */

export const educationTemplates = {
  modern: {
    name: 'Education Modern',
    description: 'Contemporary design for teachers and educational administrators',
    atsScore: 90,
    features: ['Educational focus', 'Achievement emphasis', 'Professional appearance'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Teaching Philosophy', required: false, order: 2 },
      { id: 'experience', name: 'Teaching Experience', required: true, order: 3 },
      { id: 'education', name: 'Education & Credentials', required: true, order: 4 },
      { id: 'skills', name: 'Teaching Skills', required: true, order: 5 },
      { id: 'certifications', name: 'Certifications & Licenses', required: false, order: 6 },
      { id: 'achievements', name: 'Educational Achievements', required: false, order: 7 }
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
    name: 'Education Classic',
    description: 'Traditional academic format for professors and administrators',
    atsScore: 93,
    features: ['Academic tradition', 'Scholarly appearance', 'Credential emphasis'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Academic Summary', required: false, order: 2 },
      { id: 'education', name: 'Academic Credentials', required: true, order: 3 },
      { id: 'experience', name: 'Academic Experience', required: true, order: 4 },
      { id: 'research', name: 'Research & Publications', required: false, order: 5 },
      { id: 'skills', name: 'Academic Competencies', required: true, order: 6 },
      { id: 'certifications', name: 'Professional Development', required: false, order: 7 }
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
    name: 'Education Minimal',
    description: 'Clean, focused design for curriculum specialists',
    atsScore: 87,
    features: ['Curriculum focus', 'Clean presentation', 'Skills emphasis'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'experience', name: 'Experience', required: true, order: 2 },
      { id: 'education', name: 'Credentials', required: true, order: 3 },
      { id: 'skills', name: 'Specializations', required: true, order: 4 },
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
    name: 'Education Creative',
    description: 'Engaging design for innovative educators and trainers',
    atsScore: 84,
    features: ['Innovation focus', 'Engaging design', 'Modern education'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Educational Vision', required: false, order: 2 },
      { id: 'experience', name: 'Teaching Journey', required: true, order: 3 },
      { id: 'skills', name: 'Teaching Expertise', required: true, order: 4 },
      { id: 'education', name: 'Academic Background', required: true, order: 5 },
      { id: 'innovations', name: 'Educational Innovations', required: false, order: 6 }
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

export default educationTemplates;