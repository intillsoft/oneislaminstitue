
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

class PDFExporter {
    async exportResume(resumeElement, data) {
        if (!resumeElement) {
            console.error("Resume element not found");
            return { success: false, error: "Element not found" };
        }

        try {
            // Method 1: High-quality HTML to PDF
            // We scale up for better quality
            const canvas = await html2canvas(resumeElement, {
                scale: 2, // 2 is usually good enough for print, 3 can be heavy
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: resumeElement.scrollWidth,
                windowHeight: resumeElement.scrollHeight
            });

            const imgData = canvas.toDataURL('image/png');

            // A4 or Letter? User asked for Letter mostly but PDF standard is usually A4.
            // 8.5in x 11in (US Letter)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'letter'
            });

            const imgWidth = 8.5;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');

            // Add metadata if possible
            if (data && data.personalInfo) {
                pdf.setProperties({
                    title: `${data.personalInfo.name} - Resume`,
                    author: data.personalInfo.name,
                    subject: 'Professional Resume',
                    creator: 'Workflow Resume Builder'
                });
            }

            // Generate filename
            const name = data?.personalInfo?.name || 'Resume';
            const filename = `${name.replace(/\s+/g, '_')}_Resume.pdf`;

            pdf.save(filename);

            return { success: true, filename };
        } catch (error) {
            console.error('PDF export failed:', error);
            return { success: false, error };
        }
    }
}

export const pdfExporter = new PDFExporter();
export default pdfExporter;
