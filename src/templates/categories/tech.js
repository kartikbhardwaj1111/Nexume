/**
 * Technology Category Templates
 * ATS-optimized resume templates for tech professionals
 */

export const techTemplates = {
  modern: {
    name: 'Tech Modern',
    description: 'Clean, modern design perfect for software engineers and developers',
    atsScore: 88,
    features: ['ATS-friendly formatting', 'Skills section emphasis', 'Project showcase'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Professional Summary', required: false, order: 2 },
      { id: 'skills', name: 'Technical Skills', required: true, order: 3 },
      { id: 'experience', name: 'Work Experience', required: true, order: 4 },
      { id: 'projects', name: 'Projects', required: false, order: 5 },
      { id: 'education', name: 'Education', required: true, order: 6 },
      { id: 'certifications', name: 'Certifications', required: false, order: 7 }
    ],
    styling: {
      colors: {
        primary: '#3498db',
        secondary: '#2980b9',
        text: '#2c3e50',
        background: '#ffffff',
        accent: '#ecf0f1'
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
    name: 'Tech Classic',
    description: 'Traditional, professional layout ideal for senior developers and architects',
    atsScore: 93,
    features: ['Maximum ATS compatibility', 'Traditional formatting', 'Experience-focused'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'Professional Summary', required: false, order: 2 },
      { id: 'experience', name: 'Work Experience', required: true, order: 3 },
      { id: 'skills', name: 'Technical Skills', required: true, order: 4 },
      { id: 'education', name: 'Education', required: true, order: 5 },
      { id: 'certifications', name: 'Certifications', required: false, order: 6 },
      { id: 'projects', name: 'Key Projects', required: false, order: 7 }
    ],
    styling: {
      colors: {
        primary: '#2c3e50',
        secondary: '#34495e',
        text: '#2c3e50',
        background: '#ffffff',
        accent: '#f8f9fa'
      },
      fonts: {
        heading: 'Times New Roman',
        body: 'Times New Roman',
        size: {
          name: '20px',
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
    name: 'Tech Minimal',
    description: 'Clean, minimalist design for modern tech professionals',
    atsScore: 85,
    features: ['Minimalist design', 'White space optimization', 'Skills emphasis'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'skills', name: 'Core Skills', required: true, order: 2 },
      { id: 'experience', name: 'Experience', required: true, order: 3 },
      { id: 'projects', name: 'Notable Projects', required: false, order: 4 },
      { id: 'education', name: 'Education', required: true, order: 5 },
      { id: 'certifications', name: 'Certifications', required: false, order: 6 }
    ],
    styling: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        text: '#333333',
        background: '#ffffff',
        accent: '#f5f5f5'
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
    name: 'Tech Creative',
    description: 'Modern creative design for UI/UX designers and frontend developers',
    atsScore: 81,
    features: ['Creative layout', 'Visual appeal', 'Portfolio integration'],
    sections: [
      { id: 'header', name: 'Header', required: true, order: 1 },
      { id: 'summary', name: 'About', required: false, order: 2 },
      { id: 'skills', name: 'Expertise', required: true, order: 3 },
      { id: 'experience', name: 'Experience', required: true, order: 4 },
      { id: 'projects', name: 'Portfolio', required: false, order: 5 },
      { id: 'education', name: 'Education', required: true, order: 6 }
    ],
    styling: {
      colors: {
        primary: '#e74c3c',
        secondary: '#c0392b',
        text: '#2c3e50',
        background: '#ffffff',
        accent: '#fdf2f2'
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

export default techTemplates;