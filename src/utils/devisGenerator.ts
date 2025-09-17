import { jsPDF } from 'jspdf';

// Test function to verify jsPDF is working
export const testPDFGeneration = (): Uint8Array => {
  try {
    console.log('Testing basic PDF generation...');
    const doc = new jsPDF();
    doc.text('Test PDF', 20, 20);
    const output = doc.output('arraybuffer') as Uint8Array;
    console.log('Basic PDF test successful, size:', output.byteLength);
    return output;
  } catch (error) {
    console.error('Basic PDF test failed:', error);
    throw error;
  }
};

export interface DevisData {
  // Client info
  schoolName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  schoolAddress?: string;
  
  // Spectacle info
  spectacleName: string;
  spectacleDate: string;
  spectacleTime: string;
  venue: string;
  venueAddress: string;
  
  // Participants
  studentsCount: number;
  teachersCount: number;
  accompagnateurCount: number;
  
  // Pricing
  pricePerStudent: number;
  pricePerTeacher: number;
  pricePerAccompagnateur: number;
  totalAmount: number;
  
  // Booking info
  bookingId: string;
  devisNumber: string;
  dateGenerated: string;
}

export const generateDevisPDF = (data: DevisData): Uint8Array => {
  try {
    console.log('=== Starting devis PDF generation ===');
    console.log('Input data:', JSON.stringify(data, null, 2));
    
    // Validate required data
    if (!data.schoolName || !data.contactName || !data.spectacleName) {
      throw new Error('Missing required devis data: schoolName, contactName, or spectacleName');
    }
    
    const doc = new jsPDF();
    console.log('jsPDF instance created successfully');
    
    // Set font with fallback
    try {
      doc.setFont('helvetica');
    } catch (fontError) {
      console.warn('Font loading failed, using default:', fontError);
    }

    // Modern clean header with white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F'); // White background
    
    // Add subtle decorative lines
    doc.setDrawColor(189, 207, 0);
    doc.setLineWidth(2);
    doc.line(15, 50, 195, 50); // Horizontal line
    
    // Company logo - try to add actual logo
    try {
      const logoPath = '/src/assets/edjs logo black@4x.png';
      const logoSize = 35;
      const logoX = 15;
      const logoY = 20;
      
      // Add the logo image
      doc.addImage(logoPath, 'PNG', logoX, logoY, logoSize, logoSize);
      
    } catch (logoError) {
      console.warn('Logo loading failed, using fallback:', logoError);
      
      // Fallback: Create a stylized logo with circles and text
      const logoSize = 40;
      const logoX = 15;
      const logoY = 25;
      
      // Main circle with border
      doc.setDrawColor(34, 197, 94); // Brand green
      doc.setFillColor(255, 255, 255); // White fill
      doc.setLineWidth(2);
      doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 'FD');
      
      // EDJS text inside circle
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94);
      doc.text('EDJS', logoX + logoSize/2, logoY + logoSize/2 + 2, { align: 'center' });
    }
    
    // DEVIS title - clean and modern (centered)
    doc.setFontSize(28);
    doc.setTextColor(45, 55, 72); // Dark gray
    doc.text('DEVIS', 105, 30, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // Medium gray
    doc.text('L\'ÉCOLE DU JEUNE SPECTATEUR', 105, 40, { align: 'center' });
    
    // Devis info in clean modern layout (top right)
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('DEVIS N°', 150, 65);
    doc.setFontSize(14);
    doc.setTextColor(45, 55, 72);
    doc.text(data.devisNumber, 150, 75);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('DATE D\'ÉMISSION', 150, 85);
    doc.setFontSize(12);
    doc.setTextColor(45, 55, 72);
    doc.text(data.dateGenerated, 150, 95);
  
    // Modern client info section - clean layout
    let yPos = 110;
    
    // Client info header
    doc.setFontSize(12);
    doc.setTextColor(45, 55, 72);
    doc.text('FACTURÉ À:', 15, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(45, 55, 72);
    doc.text(data.schoolName, 15, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(data.contactName, 15, yPos);
    
    yPos += 6;
    doc.text(data.contactEmail, 15, yPos);
    
    yPos += 6;
    doc.text(data.contactPhone, 15, yPos);
    
    if (data.schoolAddress) {
      yPos += 6;
      doc.text(data.schoolAddress, 15, yPos);
    }
    
    // Spectacle information - clean modern layout
    yPos = 110;
    
    // Spectacle info header (right side)
    doc.setFontSize(12);
    doc.setTextColor(45, 55, 72);
    doc.text('DÉTAILS DU SPECTACLE:', 110, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(45, 55, 72);
    doc.text(data.spectacleName, 110, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${data.spectacleDate} à ${data.spectacleTime}`, 110, yPos);
    
    yPos += 6;
    doc.text(data.venue, 110, yPos);
    
    yPos += 6;
    doc.text(data.venueAddress, 110, yPos);
  
    // Modern clean table design (inspired by the templates)
    yPos = 190;
    
    // Table header - clean and minimal
    doc.setFillColor(248, 250, 252);
    doc.rect(15, yPos, 180, 12, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('DESCRIPTION', 20, yPos + 8);
    doc.text('PRIX', 120, yPos + 8);
    doc.text('QTÉ', 145, yPos + 8);
    doc.text('TOTAL', 170, yPos + 8);
    
    yPos += 12;
    let totalCalculated = 0;
    
    // Clean table rows - minimal design
    if (data.studentsCount > 0) {
      const studentTotal = data.studentsCount * data.pricePerStudent;
      totalCalculated += studentTotal;
      
      doc.setFontSize(11);
      doc.setTextColor(45, 55, 72);
      doc.text('Élèves', 20, yPos + 8);
      doc.text(`${data.pricePerStudent} DH`, 120, yPos + 8);
      doc.text(data.studentsCount.toString(), 145, yPos + 8);
      doc.text(`${studentTotal} DH`, 170, yPos + 8);
      yPos += 15;
    }
    
    if (data.teachersCount > 0) {
      const teacherTotal = data.teachersCount * data.pricePerTeacher;
      totalCalculated += teacherTotal;
      
      doc.setFontSize(11);
      doc.setTextColor(45, 55, 72);
      doc.text('Enseignants', 20, yPos + 8);
      doc.text(`${data.pricePerTeacher} DH`, 120, yPos + 8);
      doc.text(data.teachersCount.toString(), 145, yPos + 8);
      doc.text(`${teacherTotal} DH`, 170, yPos + 8);
      yPos += 15;
    }
    
    if (data.accompagnateurCount > 0) {
      const accompagnateurTotal = data.accompagnateurCount * data.pricePerAccompagnateur;
      totalCalculated += accompagnateurTotal;
      
      doc.setFontSize(11);
      doc.setTextColor(45, 55, 72);
      doc.text('Accompagnateurs', 20, yPos + 8);
      doc.text(`${data.pricePerAccompagnateur} DH`, 120, yPos + 8);
      doc.text(data.accompagnateurCount.toString(), 145, yPos + 8);
      doc.text(`${accompagnateurTotal} DH`, 170, yPos + 8);
      yPos += 15;
    }
    
    // Modern total section - clean and prominent
    yPos += 20;
    
    // Subtle separator line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(15, yPos - 10, 195, yPos - 10);
    
    // Total amount - large and clean
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text('TOTAL', 140, yPos);
    
    doc.setFontSize(24);
    doc.setTextColor(189, 207, 0); // Brand green
    doc.text(`${data.totalAmount} DH`, 195, yPos + 5, { align: 'right' });
  
    // Modern terms section - clean and minimal
    yPos += 40;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('CONDITIONS ET MODALITÉS', 15, yPos);
    
    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('• Ce devis est valable 30 jours à compter de la date d\'émission', 15, yPos);
    doc.text('• Le paiement peut être effectué par virement bancaire, chèque ou espèces', 15, yPos + 6);
    doc.text('• La réservation sera confirmée après réception du paiement', 15, yPos + 12);
    doc.text('• Annulation possible jusqu\'à 48h avant la représentation', 15, yPos + 18);
    
    // Contact section - clean footer
    yPos += 35;
    doc.setFontSize(10);
    doc.setTextColor(45, 55, 72);
    doc.text('CONTACT', 15, yPos);
    
    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Email: contact@edjs.art', 15, yPos);
    doc.text('Téléphone: +212 XXX XXX XXX', 15, yPos + 6);
    doc.text('Site web: www.edjs.art', 15, yPos + 12);
    
    // Add decorative bottom elements
    doc.setFillColor(189, 207, 0);
    doc.circle(25, 280, 6, 'F');
    doc.setFillColor(168, 184, 0);
    doc.circle(185, 280, 4, 'F');
    
    // Booking ID at bottom
    yPos += 20;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`ID Réservation: ${data.bookingId}`, 105, yPos, { align: 'center' });
    
    console.log('PDF content generated, creating output...');
    const output = doc.output('arraybuffer') as Uint8Array;
    console.log('PDF generated successfully, size:', output.byteLength);
    return output;
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
