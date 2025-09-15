import jsPDF from 'jspdf';

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

export const generateDevisPDF = (devisData: DevisData): Uint8Array => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // EDJS Header with logo placeholder
  doc.setFontSize(18);
  doc.setTextColor(41, 128, 185);
  doc.text('EDJS - École de Jeunes Spectacles', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('www.edjs.ma | contact@edjs.ma | +212 XXX XXX XXX', 20, 35);
  doc.text('Adresse: [Adresse EDJS]', 20, 42);
  
  // Devis title
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text('DEVIS', 105, 60, { align: 'center' });
  
  // Devis number and date
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`N° Devis: ${devisData.devisNumber}`, 140, 75);
  doc.text(`Date: ${devisData.dateGenerated}`, 140, 85);
  
  // Client information
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('INFORMATIONS CLIENT', 20, 100);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`École: ${devisData.schoolName}`, 20, 115);
  doc.text(`Contact: ${devisData.contactName}`, 20, 125);
  doc.text(`Email: ${devisData.contactEmail}`, 20, 135);
  doc.text(`Téléphone: ${devisData.contactPhone}`, 20, 145);
  if (devisData.schoolAddress) {
    doc.text(`Adresse: ${devisData.schoolAddress}`, 20, 155);
  }
  
  // Spectacle information
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('DÉTAILS DU SPECTACLE', 20, 175);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Spectacle: ${devisData.spectacleName}`, 20, 190);
  doc.text(`Date: ${devisData.spectacleDate}`, 20, 200);
  doc.text(`Heure: ${devisData.spectacleTime}`, 20, 210);
  doc.text(`Lieu: ${devisData.venue}`, 20, 220);
  doc.text(`Adresse: ${devisData.venueAddress}`, 20, 230);
  
  // Pricing table
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('DÉTAIL DES TARIFS', 20, 250);
  
  // Table headers
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Désignation', 25, 265);
  doc.text('Quantité', 90, 265);
  doc.text('Prix unitaire', 125, 265);
  doc.text('Total', 165, 265);
  
  // Table line
  doc.setLineWidth(0.5);
  doc.line(20, 270, 190, 270);
  
  let yPos = 280;
  let totalCalculated = 0;
  
  // Students line
  if (devisData.studentsCount > 0) {
    const studentTotal = devisData.studentsCount * devisData.pricePerStudent;
    totalCalculated += studentTotal;
    doc.text('Élèves', 25, yPos);
    doc.text(devisData.studentsCount.toString(), 95, yPos);
    doc.text(`${devisData.pricePerStudent} DH`, 130, yPos);
    doc.text(`${studentTotal} DH`, 165, yPos);
    yPos += 10;
  }
  
  // Teachers line
  if (devisData.teachersCount > 0) {
    const teacherTotal = devisData.teachersCount * devisData.pricePerTeacher;
    totalCalculated += teacherTotal;
    doc.text('Enseignants', 25, yPos);
    doc.text(devisData.teachersCount.toString(), 95, yPos);
    doc.text(`${devisData.pricePerTeacher} DH`, 130, yPos);
    doc.text(`${teacherTotal} DH`, 165, yPos);
    yPos += 10;
  }
  
  // Accompagnateurs line
  if (devisData.accompagnateurCount > 0) {
    const accompagnateurTotal = devisData.accompagnateurCount * devisData.pricePerAccompagnateur;
    totalCalculated += accompagnateurTotal;
    doc.text('Accompagnateurs', 25, yPos);
    doc.text(devisData.accompagnateurCount.toString(), 95, yPos);
    doc.text(`${devisData.pricePerAccompagnateur} DH`, 130, yPos);
    doc.text(`${accompagnateurTotal} DH`, 165, yPos);
    yPos += 10;
  }
  
  // Total line
  doc.setLineWidth(0.5);
  doc.line(120, yPos + 5, 190, yPos + 5);
  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('TOTAL:', 130, yPos);
  doc.text(`${devisData.totalAmount} DH`, 165, yPos);
  
  // Terms and conditions
  yPos += 25;
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('CONDITIONS ET MODALITÉS', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('• Ce devis est valable 30 jours à compter de la date d\'émission', 20, yPos);
  doc.text('• Le paiement peut être effectué par virement bancaire, chèque ou espèces', 20, yPos + 10);
  doc.text('• La réservation sera confirmée après réception du paiement', 20, yPos + 20);
  doc.text('• Annulation possible jusqu\'à 48h avant la représentation', 20, yPos + 30);
  doc.text('• Les accompagnateurs sont inclus dans le tarif', 20, yPos + 40);
  
  // Contact info for payment
  yPos += 60;
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('POUR FINALISER VOTRE RÉSERVATION', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Contactez-nous via WhatsApp pour coordonner le paiement:', 20, yPos);
  doc.text('WhatsApp: +212 XXX XXX XXX', 20, yPos + 10);
  doc.text('Email: reservations@edjs.ma', 20, yPos + 20);
  
  // Footer
  yPos += 40;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text('EDJS - École de Jeunes Spectacles - Devis généré automatiquement', 105, yPos, { align: 'center' });
  doc.text(`ID Réservation: ${devisData.bookingId}`, 105, yPos + 10, { align: 'center' });
  
  // Add border
  doc.setLineWidth(1);
  doc.rect(15, 15, 180, yPos - 5);
  
  return doc.output('arraybuffer') as Uint8Array;
};
