import jsPDF from 'jspdf';

export interface TicketData {
  spectacleName: string;
  spectacleDate: string;
  spectacleTime: string;
  venue: string;
  venueAddress: string;
  holderName: string;
  holderEmail: string;
  holderPhone: string;
  numberOfParticipants?: number;
  numberOfChildren?: number;
  numberOfAccompanying?: number;
  organizationName?: string;
  organizationType?: string;
  reservationId: string;
  ticketPrice: number;
  paymentMethod: string;
  qrCode?: string;
}

export const generateTicketPDF = (ticketData: TicketData): Uint8Array => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text('BILLET SPECTACLE EDJS', 105, 20, { align: 'center' });
  
  // Spectacle info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(ticketData.spectacleName, 105, 35, { align: 'center' });
  
  // Date and time
  doc.setFontSize(12);
  doc.text(`Date: ${ticketData.spectacleDate}`, 20, 50);
  doc.text(`Heure: ${ticketData.spectacleTime}`, 20, 60);
  
  // Venue
  doc.text(`Lieu: ${ticketData.venue}`, 20, 70);
  doc.text(`Adresse: ${ticketData.venueAddress}`, 20, 80);
  
  // Separator line
  doc.setLineWidth(0.5);
  doc.line(20, 90, 190, 90);
  
  // Holder information
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('INFORMATIONS DU TITULAIRE', 20, 105);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Nom: ${ticketData.holderName}`, 20, 120);
  doc.text(`Email: ${ticketData.holderEmail}`, 20, 130);
  doc.text(`Téléphone: ${ticketData.holderPhone}`, 20, 140);
  
  if (ticketData.organizationName) {
    doc.text(`Organisation: ${ticketData.organizationName}`, 20, 150);
    doc.text(`Type: ${ticketData.organizationType || ''}`, 20, 160);
  }
  
  // Participants info
  let yPos = ticketData.organizationName ? 175 : 155;
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('PARTICIPANTS', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  if (ticketData.numberOfChildren && ticketData.numberOfAccompanying) {
    doc.text(`Nombre d'enfants: ${ticketData.numberOfChildren}`, 20, yPos);
    doc.text(`Nombre d'accompagnateurs: ${ticketData.numberOfAccompanying}`, 20, yPos + 10);
    yPos += 25;
  } else if (ticketData.numberOfParticipants) {
    doc.text(`Nombre de participants: ${ticketData.numberOfParticipants}`, 20, yPos);
    yPos += 15;
  }
  
  // Payment info
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('INFORMATIONS DE PAIEMENT', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Prix total: ${ticketData.ticketPrice} DH`, 20, yPos);
  doc.text(`Méthode de paiement: ${ticketData.paymentMethod}`, 20, yPos + 10);
  doc.text(`ID Réservation: ${ticketData.reservationId}`, 20, yPos + 20);
  
  // Footer
  yPos += 40;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('Ce billet est votre preuve de réservation. Veuillez le présenter à l\'entrée.', 105, yPos, { align: 'center' });
  doc.text('EDJS - École de Jeunes Spectacles', 105, yPos + 10, { align: 'center' });
  doc.text('www.edjs.ma | contact@edjs.ma', 105, yPos + 20, { align: 'center' });
  
  // Add border
  doc.setLineWidth(1);
  doc.rect(15, 15, 180, yPos + 15);
  
  return doc.output('arraybuffer') as Uint8Array;
};

export const generateBulkTicketsPDF = (ticketData: TicketData): Uint8Array => {
  const doc = new jsPDF();
  
  // For bulk tickets (schools with 100+ students), create a summary document
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text('RÉSERVATION GROUPE - EDJS', 105, 20, { align: 'center' });
  
  // Spectacle info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(ticketData.spectacleName, 105, 35, { align: 'center' });
  
  // Date and time
  doc.setFontSize(12);
  doc.text(`Date: ${ticketData.spectacleDate}`, 20, 50);
  doc.text(`Heure: ${ticketData.spectacleTime}`, 20, 60);
  doc.text(`Lieu: ${ticketData.venue}`, 20, 70);
  doc.text(`Adresse: ${ticketData.venueAddress}`, 20, 80);
  
  // Separator
  doc.setLineWidth(0.5);
  doc.line(20, 90, 190, 90);
  
  // Organization info
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('INFORMATIONS DE L\'ÉTABLISSEMENT', 20, 105);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Établissement: ${ticketData.organizationName}`, 20, 120);
  doc.text(`Contact: ${ticketData.holderName}`, 20, 130);
  doc.text(`Email: ${ticketData.holderEmail}`, 20, 140);
  doc.text(`Téléphone: ${ticketData.holderPhone}`, 20, 150);
  
  // Group details
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('DÉTAILS DU GROUPE', 20, 170);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Nombre d'enfants: ${ticketData.numberOfChildren}`, 20, 185);
  doc.text(`Nombre d'accompagnateurs: ${ticketData.numberOfAccompanying}`, 20, 195);
  doc.text(`Total participants: ${(ticketData.numberOfChildren || 0) + (ticketData.numberOfAccompanying || 0)}`, 20, 205);
  
  // Payment info
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text('INFORMATIONS DE PAIEMENT', 20, 225);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Prix total: ${ticketData.ticketPrice} DH`, 20, 240);
  doc.text(`Méthode de paiement: ${ticketData.paymentMethod}`, 20, 250);
  doc.text(`ID Réservation: ${ticketData.reservationId}`, 20, 260);
  
  // Instructions for bulk groups
  doc.setFontSize(11);
  doc.setTextColor(255, 0, 0);
  doc.text('IMPORTANT - RÉSERVATION GROUPE:', 20, 280);
  doc.setTextColor(0, 0, 0);
  doc.text('• Ce document sert de confirmation pour l\'ensemble du groupe', 20, 290);
  doc.text('• Aucun billet individuel n\'est nécessaire pour les participants', 20, 300);
  doc.text('• Présentez ce document à l\'entrée avec une liste des participants', 20, 310);
  doc.text('• Les accompagnateurs doivent présenter une pièce d\'identité', 20, 320);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('EDJS - École de Jeunes Spectacles', 105, 340, { align: 'center' });
  doc.text('www.edjs.ma | contact@edjs.ma', 105, 350, { align: 'center' });
  
  return doc.output('arraybuffer') as Uint8Array;
};
