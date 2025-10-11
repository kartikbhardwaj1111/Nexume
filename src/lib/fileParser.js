import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker with CDN fallback
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function extractTextFromFile(file) {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await extractTextFromTxt(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPdf(file);
    } else if (fileName.endsWith('.docx') || fileType.includes('document')) {
      return await extractTextFromDocx(file);
    } else {
      throw new Error('Unsupported file type. Please use .txt, .pdf, or .docx files.');
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw error;
  }
}

async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    throw new Error('Failed to parse PDF file. Please ensure it\'s a valid PDF with text content.');
  }
}

async function extractTextFromDocx(file) {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX file. Please ensure it\'s a valid Word document.');
  }
}

async function extractTextFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function validateFile(file) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const allowedExtensions = ['.txt', '.pdf', '.docx'];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 2MB'
    };
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidType = allowedTypes.includes(file.type);

  if (!hasValidExtension && !hasValidType) {
    return {
      isValid: false,
      error: 'Please upload a .txt, .pdf, or .docx file'
    };
  }

  return { isValid: true };
}