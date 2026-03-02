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

    // Detect if this is a Master Class certificate
    const isMasterClass = data.webinar_title?.toLowerCase().includes('master class') ||
        data.webinar_title?.toLowerCase().includes('masterclass') ||
        data.certificate_type === 'completion';

    if (isMasterClass) {
        // ========== MASTER CLASS CERTIFICATE (Professional Gold/Black Theme) ==========
        generateMasterClassCertificate(doc, width, height, data);
    } else {
        // ========== WEBINAR CERTIFICATE (Original Pink Theme) ==========
        generateWebinarCertificate(doc, width, height, data);
    }

    return doc.output('blob');
};

// Master Class Certificate (Professional Gold/Black - Exact Template Match)
function generateMasterClassCertificate(doc, width, height, data) {
    // Exact colors from template
    const deepBlack = [20, 20, 20];      // Very dark background
    const gold = [212, 175, 55];         // Rich gold #d4af37
    const lightGold = [255, 223, 128];   // Lighter gold for highlights
    const white = [255, 255, 255];
    const lightGray = [180, 180, 180];

    // Deep Black Background
    doc.setFillColor(...deepBlack);
    doc.rect(0, 0, width, height, 'F');

    // Main Gold Border (Outer - Thick)
    doc.setDrawColor(...gold);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, width - 20, height - 20, 'S');

    // Inner Gold Border (Thin)
    doc.setLineWidth(0.4);
    doc.rect(13, 13, width - 26, height - 26, 'S');

    // Decorative corner elements
    const cornerSize = 12;
    doc.setLineWidth(1);
    // Top-left corner
    doc.line(13, 13, 13 + cornerSize, 13);
    doc.line(13, 13, 13, 13 + cornerSize);
    // Top-right corner
    doc.line(width - 13, 13, width - 13 - cornerSize, 13);
    doc.line(width - 13, 13, width - 13, 13 + cornerSize);
    // Bottom-left corner
    doc.line(13, height - 13, 13 + cornerSize, height - 13);
    doc.line(13, height - 13, 13, height - 13 - cornerSize);
    // Bottom-right corner
    doc.line(width - 13, height - 13, width - 13 - cornerSize, height - 13);
    doc.line(width - 13, height - 13, width - 13, height - 13 - cornerSize);

    let yPos = 50;

    // Top decorative circle/badge (changed to KS)
    const badgeX = width / 2;
    const badgeY = 35;
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.circle(badgeX, badgeY, 6, 'S');
    doc.setFillColor(...gold);
    doc.circle(badgeX, badgeY, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...deepBlack);
    doc.text('KS', badgeX, badgeY + 1, { align: 'center' });

    yPos = 65;

    // "CERTIFICATE" - Large, elegant, white
    doc.setFont('times', 'bold');
    doc.setFontSize(52);
    doc.setTextColor(...white);
    doc.setCharSpace(8);
    doc.text('CERTIFICATE', width / 2, yPos, { align: 'center' });
    doc.setCharSpace(0);

    yPos += 12;

    // "OF COMPLETION" - Smaller, spaced
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...white);
    doc.setCharSpace(5);
    doc.text('OF COMPLETION', width / 2, yPos, { align: 'center' });
    doc.setCharSpace(0);

    yPos += 8;

    // Subtitle - Very small
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text('MASTER CLASS ACHIEVEMENT', width / 2, yPos, { align: 'center' });

    yPos += 20;

    // Small decorative line
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(width / 2 - 30, yPos, width / 2 + 30, yPos);

    yPos += 15;

    // "This certifies that" - Small gray text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    doc.text('This certifies that', width / 2, yPos, { align: 'center' });

    yPos += 20;

    // Recipient Name - Large, Elegant Script
    doc.setFont('times', 'italic');
    doc.setFontSize(56);
    doc.setTextColor(...white);
    const name = data.name || "Estelle Darcy";
    doc.text(name, width / 2, yPos, { align: 'center' });

    yPos += 6;

    // Elegant underline under name
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.4);
    const nameWidth = doc.getTextWidth(name);
    doc.line(width / 2 - nameWidth / 2 - 15, yPos, width / 2 + nameWidth / 2 + 15, yPos);

    yPos += 18;

    // Date - Prominent
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...white);
    const dateText = data.issued_date
        ? new Date(data.issued_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
        : '29 NOVEMBER, 2030';
    doc.text(dateText, width / 2, yPos, { align: 'center' });

    yPos += 15;

    // Description paragraph - Small, justified
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    const title = data.webinar_title || 'React Roadmap Master Class';
    const description = `Has successfully completed the ${title}. Demonstrating exceptional dedication, skill mastery, and professional excellence in the subject matter.`;

    // Split text into lines for better formatting
    const maxWidth = 160;
    const lines = doc.splitTextToSize(description, maxWidth);
    lines.forEach((line, index) => {
        doc.text(line, width / 2, yPos + (index * 5), { align: 'center' });
    });

    // Footer Section
    const footerY = height - 40;

    // Gold seal/badge in center (like template)
    const sealX = width / 2;
    const sealY = footerY - 18;

    // Outer gold circle
    doc.setFillColor(...gold);
    doc.circle(sealX, sealY, 10, 'F');

    // Inner lighter circle
    doc.setFillColor(...lightGold);
    doc.circle(sealX, sealY, 8, 'F');

    // Ribbon effect (simple triangles)
    doc.setFillColor(...gold);
    doc.triangle(sealX - 3, sealY + 8, sealX + 3, sealY + 8, sealX, sealY + 16, 'F');
    doc.triangle(sealX - 2, sealY + 8, sealX + 2, sealY + 8, sealX, sealY + 14, 'F');

    // Horizontal lines on either side of seal
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(30, sealY, sealX - 15, sealY);
    doc.line(sealX + 15, sealY, width - 30, sealY);

    // Author Information - Same as Webinar Certificate
    // Left - Author Details
    const leftX = 50;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(leftX - 20, footerY - 3, leftX + 20, footerY - 3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...white);
    doc.text('KARUPPASAMY M', leftX, footerY, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...lightGray);
    doc.text('Computer Engineering Student', leftX, footerY + 4, { align: 'center' });
    doc.text("Time's Tech Learning Platform", leftX, footerY + 8, { align: 'center' });
    doc.setFontSize(6);
    doc.text('(Student Learning Initiative)', leftX, footerY + 11, { align: 'center' });

    // Right - Date and ID
    const rightX = width - 50;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(rightX - 20, footerY - 3, rightX + 20, footerY - 3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...white);
    const issuedDate = data.issued_date
        ? new Date(data.issued_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '16 Feb 2026';
    doc.text(issuedDate, rightX, footerY, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...lightGray);
    doc.text('Date Issued', rightX, footerY + 4, { align: 'center' });
    doc.setFontSize(6);
    doc.text(`ID: ${data.certificate_id}`, rightX, footerY + 8, { align: 'center' });

    // Bottom section - Certificate ID and Duration
    const bottomY = height - 18;

    // Thin gold line above bottom section
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.2);
    doc.line(25, bottomY - 5, width - 25, bottomY - 5);

    // Certificate ID (Left)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...gold);
    doc.text('CERTIFICATE ID', 30, bottomY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...lightGray);
    doc.text(data.certificate_id || 'CERT-2024-001', 30, bottomY + 4);

    // Duration (Right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...gold);
    doc.text('DURATION', width - 30, bottomY, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...lightGray);
    const duration = data.duration || '2 Hours';
    doc.text(duration, width - 30, bottomY + 4, { align: 'right' });
}

// Webinar Certificate (Original Pink Theme)
function generateWebinarCertificate(doc, width, height, data) {
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
}
