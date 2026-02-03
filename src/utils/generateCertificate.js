import jsPDF from 'jspdf';

export const generateCertificatePDF = async (data) => {
    const PDFDocument = jsPDF.jsPDF || jsPDF;

    const doc = new PDFDocument({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Colors
    const bgColors = [255, 255, 255];
    const deepNavy = [15, 23, 42];
    const slateGray = [71, 85, 105];
    const pinkAccent = [236, 72, 153];
    const borderOuter = [229, 231, 235];
    const borderInner = [241, 245, 249];

    // Background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, width, height, 'F');

    // Card Container with Double Border
    const margin = 10;
    doc.setFillColor(...bgColors);

    doc.setDrawColor(...borderOuter);
    doc.setLineWidth(1.5);
    doc.roundedRect(margin, margin, width - (margin * 2), height - (margin * 2), 4, 4, 'FD');

    doc.setDrawColor(...borderInner);
    doc.setLineWidth(1);
    doc.roundedRect(margin + 4, margin + 4, width - (margin * 2) - 8, height - (margin * 2) - 8, 3, 3, 'S');

    // Load and add React logo
    try {
        const logoImg = await loadImage('/react-logo.png');
        const logoSize = 20; // mm
        const logoX = width - 35;
        const logoY = 25;
        doc.addImage(logoImg, 'PNG', logoX, logoY, logoSize, logoSize);
    } catch (error) {
        console.error('Failed to load React logo:', error);
        // Continue without logo if it fails
    }

    // Header Section (Left Aligned)
    const leftAlignX = 35;
    let yPos = 40;

    // "CERTIFICATE"
    doc.setFont('times', 'bold');
    doc.setFontSize(42);
    doc.setTextColor(...deepNavy);
    doc.text('CERTIFICATE', leftAlignX, yPos);

    yPos += 10;
    // "OF PARTICIPATION"
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...pinkAccent);
    doc.setCharSpace(3);
    doc.text('OF PARTICIPATION', leftAlignX, yPos);
    doc.setCharSpace(0);

    yPos += 8;
    // Pink Line Separator
    doc.setDrawColor(...pinkAccent);
    doc.setLineWidth(0.5);
    doc.line(leftAlignX, yPos, width - 40, yPos);

    // Body Section (Centered)
    yPos += 35;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...slateGray);
    doc.setCharSpace(1);
    doc.text('PROUDLY PRESENTED TO', width / 2, yPos, { align: 'center' });
    doc.setCharSpace(0);

    yPos += 25;

    // Recipient Name
    doc.setFont('times', 'italic');
    doc.setFontSize(48);
    doc.setTextColor(...deepNavy);
    const name = data.name || "Your Name";
    doc.text(name, width / 2, yPos, { align: 'center' });

    yPos += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...slateGray);
    doc.text('For successfully participating in the webinar', width / 2, yPos, { align: 'center' });

    yPos += 12;

    // Webinar Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...pinkAccent);
    const title = data.webinar_title || 'React Roadmap to Students – Webinar';
    doc.text(title, width / 2, yPos, { align: 'center' });

    // Footer Section
    const footerY = height - 40;

    // Left Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...deepNavy);
    doc.text('KARUPPASAMY M', leftAlignX, footerY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...slateGray);
    doc.setCharSpace(0.5);
    doc.text('– COMPUTER ENGINEERING STUDENT', leftAlignX, footerY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setCharSpace(0);
    doc.text('Time\'s Tech Learning Platform', leftAlignX, footerY + 10);
    doc.setTextColor(150, 150, 150);
    doc.text('(Student Learning Initiative)', leftAlignX, footerY + 14);

    // Right Date
    const rightAlignX = width - 40;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...deepNavy);
    const dateText = data.issued_date
        ? new Date(data.issued_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '16 Feb 2026';
    doc.text(dateText, rightAlignX, footerY, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...slateGray);
    doc.setCharSpace(0.5);
    doc.text('DATE ISSUED', rightAlignX, footerY + 5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setCharSpace(0);
    doc.text(`ID: ${data.certificate_id}`, rightAlignX, footerY + 10, { align: 'right' });

    // Legal Disclaimer
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text(
        'This certificate recognizes participation in a peer-led educational webinar and does not represent professional or government accreditation.',
        width / 2,
        height - 15,
        { align: 'center' }
    );

    return doc.output('blob');
};

// Helper function to load image
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
