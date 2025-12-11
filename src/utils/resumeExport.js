/**
 * Resume Export Utilities
 * Export resume to HTML, PDF, DOCX, plain text
 */

// Dynamic import for jsPDF (only load when needed)
let jsPDF = null;
const loadJsPDF = async () => {
  if (!jsPDF) {
    try {
      const jsPDFModule = await import('jspdf');
      jsPDF = jsPDFModule.default;
    } catch (error) {
      console.error('Failed to load jsPDF:', error);
      throw new Error('PDF export is not available. Please install jspdf: npm install jspdf');
    }
  }
  return jsPDF;
};

/**
 * Export to clean HTML
 */
export function exportToHTML(resumeData, template = 'modern') {
  if (!resumeData) {
    return '<html><body><p>No resume data available</p></body></html>';
  }
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${resumeData.personalInfo?.fullName || 'Resume'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #0F172A;
      background: #FFFFFF;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .resume-header {
      border-bottom: 2px solid #0046FF;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .resume-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #0046FF;
      margin-bottom: 10px;
    }
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 14px;
      color: #64748B;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #0046FF;
      margin-bottom: 15px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 5px;
    }
    .experience-item, .education-item {
      margin-bottom: 20px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .item-title {
      font-weight: 600;
      font-size: 16px;
    }
    .item-company {
      color: #64748B;
      font-size: 14px;
    }
    .item-date {
      color: #64748B;
      font-size: 14px;
    }
    ul {
      margin-left: 20px;
      margin-top: 10px;
    }
    li {
      margin-bottom: 5px;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-tag {
      background: #E6EDFF;
      color: #0046FF;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 14px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${generateResumeHTML(resumeData)}
</body>
</html>
  `;
  return html;
}

/**
 * Export to plain text
 */
export function exportToText(resumeData) {
  if (!resumeData) {
    return 'No resume data available';
  }
  
  let text = '';

  // Header
  if (resumeData.personalInfo?.fullName) {
    text += `${resumeData.personalInfo.fullName}\n`;
    text += '='.repeat(resumeData.personalInfo.fullName.length) + '\n\n';
  }

  // Contact Info
  if (resumeData.personalInfo) {
    const contact = [];
    if (resumeData.personalInfo.email) contact.push(resumeData.personalInfo.email);
    if (resumeData.personalInfo.phone) contact.push(resumeData.personalInfo.phone);
    if (resumeData.personalInfo.location) contact.push(resumeData.personalInfo.location);
    if (contact.length > 0) {
      text += contact.join(' | ') + '\n\n';
    }
  }

  // Summary
  if (resumeData.professionalSummary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += '-'.repeat(20) + '\n';
    text += resumeData.professionalSummary + '\n\n';
  }

  // Experience
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    text += 'WORK EXPERIENCE\n';
    text += '-'.repeat(20) + '\n';
    resumeData.workExperience.forEach(exp => {
      text += `${exp.title} | ${exp.company}\n`;
      if (exp.dateRange) text += `${exp.dateRange}\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += '\n';
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    text += 'EDUCATION\n';
    text += '-'.repeat(20) + '\n';
    resumeData.education.forEach(edu => {
      text += `${edu.degree} | ${edu.institution}\n`;
      if (edu.year) text += `${edu.year}\n`;
      text += '\n';
    });
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    text += 'SKILLS\n';
    text += '-'.repeat(20) + '\n';
    text += resumeData.skills.join(', ') + '\n\n';
  }

  return text;
}

/**
 * Generate HTML from resume data
 */
function generateResumeHTML(resumeData) {
  let html = '';

  // Header
  html += '<div class="resume-header">';
  if (resumeData.personalInfo?.fullName) {
    html += `<h1>${escapeHtml(resumeData.personalInfo.fullName)}</h1>`;
  }
  if (resumeData.personalInfo) {
    const contact = [];
    if (resumeData.personalInfo.email) contact.push(escapeHtml(resumeData.personalInfo.email));
    if (resumeData.personalInfo.phone) contact.push(escapeHtml(resumeData.personalInfo.phone));
    if (resumeData.personalInfo.location) contact.push(escapeHtml(resumeData.personalInfo.location));
    if (contact.length > 0) {
      html += `<div class="contact-info">${contact.join(' | ')}</div>`;
    }
  }
  html += '</div>';

  // Summary
  if (resumeData.professionalSummary) {
    html += '<div class="section">';
    html += '<div class="section-title">Professional Summary</div>';
    html += `<p>${escapeHtml(resumeData.professionalSummary)}</p>`;
    html += '</div>';
  }

  // Experience
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Work Experience</div>';
    resumeData.workExperience.forEach(exp => {
      html += '<div class="experience-item">';
      html += '<div class="item-header">';
      html += `<div><span class="item-title">${escapeHtml(exp.title || '')}</span>`;
      if (exp.company) html += ` <span class="item-company">at ${escapeHtml(exp.company)}</span>`;
      html += '</div>';
      if (exp.dateRange) html += `<span class="item-date">${escapeHtml(exp.dateRange)}</span>`;
      html += '</div>';
      if (exp.description) {
        html += `<p>${escapeHtml(exp.description)}</p>`;
      }
      html += '</div>';
    });
    html += '</div>';
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Education</div>';
    resumeData.education.forEach(edu => {
      html += '<div class="education-item">';
      html += '<div class="item-header">';
      html += `<div><span class="item-title">${escapeHtml(edu.degree || '')}</span>`;
      if (edu.institution) html += ` <span class="item-company">from ${escapeHtml(edu.institution)}</span>`;
      html += '</div>';
      if (edu.year) html += `<span class="item-date">${escapeHtml(edu.year)}</span>`;
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Skills</div>';
    html += '<div class="skills-list">';
    resumeData.skills.forEach(skill => {
      html += `<span class="skill-tag">${escapeHtml(skill)}</span>`;
    });
    html += '</div>';
    html += '</div>';
  }

  return html;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Download file
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export to PDF using jsPDF
 */
export async function exportToPDF(resumeData, template = 'professional') {
  try {
    const PDF = await loadJsPDF();
    const pdf = new PDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;
    const lineHeight = 7;
    const sectionSpacing = 10;

    // Helper function to add text with word wrap
    const addText = (text, fontSize = 11, isBold = false, color = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setTextColor(color[0], color[1], color[2]);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const maxWidth = pageWidth - (margin * 2);
      const lines = pdf.splitTextToSize(text || '', maxWidth);
      
      if (yPos + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      lines.forEach(line => {
        pdf.text(line, margin, yPos);
        yPos += lineHeight;
      });
    };

    // Header
    if (resumeData.personalInfo?.fullName) {
      addText(resumeData.personalInfo.fullName, 20, true, [0, 70, 255]);
      yPos += 5;
    }

    // Contact Info
    if (resumeData.personalInfo) {
      const contact = [];
      if (resumeData.personalInfo.email) contact.push(resumeData.personalInfo.email);
      if (resumeData.personalInfo.phone) contact.push(resumeData.personalInfo.phone);
      if (resumeData.personalInfo.location) contact.push(resumeData.personalInfo.location);
      if (contact.length > 0) {
        addText(contact.join(' | '), 10, false, [100, 100, 100]);
        yPos += sectionSpacing;
      }
    }

    // Professional Summary
    if (resumeData.professionalSummary) {
      addText('PROFESSIONAL SUMMARY', 14, true, [0, 70, 255]);
      yPos += 3;
      addText(resumeData.professionalSummary, 11, false);
      yPos += sectionSpacing;
    }

    // Work Experience
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      addText('WORK EXPERIENCE', 14, true, [0, 70, 255]);
      yPos += 3;
      resumeData.workExperience.forEach(exp => {
        const title = `${exp.title || ''}${exp.company ? ` at ${exp.company}` : ''}`;
        addText(title, 12, true);
        if (exp.dateRange) {
          addText(exp.dateRange, 10, false, [100, 100, 100]);
        }
        if (exp.description) {
          addText(exp.description, 11, false);
        }
        yPos += 5;
      });
      yPos += sectionSpacing;
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      addText('EDUCATION', 14, true, [0, 70, 255]);
      yPos += 3;
      resumeData.education.forEach(edu => {
        const degree = `${edu.degree || ''}${edu.institution ? ` from ${edu.institution}` : ''}`;
        addText(degree, 12, true);
        if (edu.year) {
          addText(edu.year, 10, false, [100, 100, 100]);
        }
        yPos += 5;
      });
      yPos += sectionSpacing;
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      addText('SKILLS', 14, true, [0, 70, 255]);
      yPos += 3;
      addText(resumeData.skills.join(', '), 11, false);
    }

    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}

/**
 * Download PDF
 */
export async function downloadPDF(resumeData, filename = 'resume.pdf') {
  try {
    if (!resumeData) {
      throw new Error('Resume data is required');
    }
    
    const pdfBlob = await exportToPDF(resumeData);
    if (!pdfBlob) {
      throw new Error('Failed to generate PDF');
    }
    
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF download error:', error);
    throw error;
  }
}

export default {
  exportToHTML,
  exportToText,
  exportToPDF,
  downloadPDF,
  downloadFile,
};

