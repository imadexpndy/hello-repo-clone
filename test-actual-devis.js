// Test the actual devis generator function
import { jsPDF } from 'jspdf';
import fs from 'fs';

// Copy the actual generateDevisPDF function to test it
const generateDevisPDF = (data) => {
  try {
    console.log('=== Starting devis PDF generation ===');
    console.log('Input data:', JSON.stringify(data, null, 2));
    
    const doc = new jsPDF();
    
    // Header section
    console.log('Adding header...');
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVIS', 105, 30, { align: 'center' });
    
    // Company info
    console.log('Adding company info...');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("L'École du Jeune Spectateur", 20, 50);
    doc.text('Rabat, Maroc', 20, 60);
    doc.text('Tél: +212 537 70 10 83', 20, 70);
    
    // Devis info
    console.log('Adding devis info...');
    doc.text(`Devis N°: ${data.devisNumber}`, 140, 50);
    doc.text(`Date: ${data.dateGenerated}`, 140, 60);
    
    // Client info
    console.log('Adding client info...');
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CLIENT', 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`École: ${data.schoolName}`, 20, 105);
    doc.text(`Contact: ${data.contactName}`, 20, 115);
    doc.text(`Email: ${data.contactEmail}`, 20, 125);
    doc.text(`Téléphone: ${data.contactPhone}`, 20, 135);
    
    if (data.schoolAddress) {
      doc.text(`Adresse: ${data.schoolAddress}`, 20, 145);
    }
    
    // Spectacle info
    console.log('Adding spectacle info...');
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DU SPECTACLE', 20, 165);
    doc.setFont('helvetica', 'normal');
    doc.text(`Spectacle: ${data.spectacleName}`, 20, 180);
    doc.text(`Date: ${data.spectacleDate}`, 20, 190);
    doc.text(`Heure: ${data.spectacleTime}`, 20, 200);
    doc.text(`Lieu: ${data.venue}`, 20, 210);
    
    if (data.venueAddress) {
      doc.text(`Adresse: ${data.venueAddress}`, 20, 220);
    }
    
    // Pricing table
    console.log('Adding pricing table...');
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAIL DES TARIFS', 20, 240);
    
    let yPos = 255;
    doc.setFont('helvetica', 'normal');
    
    // Students
    if (data.studentsCount > 0) {
      doc.text(`Élèves (${data.studentsCount})`, 20, yPos);
      doc.text(`${data.pricePerStudent} DH`, 100, yPos);
      doc.text(`${data.studentsCount * data.pricePerStudent} DH`, 150, yPos);
      yPos += 10;
    }
    
    // Teachers
    if (data.teachersCount > 0) {
      doc.text(`Enseignants (${data.teachersCount})`, 20, yPos);
      doc.text(`${data.pricePerTeacher} DH`, 100, yPos);
      doc.text(`${data.teachersCount * data.pricePerTeacher} DH`, 150, yPos);
      yPos += 10;
    }
    
    // Accompagnateurs
    if (data.accompagnateurCount > 0) {
      doc.text(`Accompagnateurs (${data.accompagnateurCount})`, 20, yPos);
      doc.text(`${data.pricePerAccompagnateur} DH`, 100, yPos);
      doc.text(`${data.accompagnateurCount * data.pricePerAccompagnateur} DH`, 150, yPos);
      yPos += 10;
    }
    
    // Total
    console.log('Adding total...');
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 100, yPos);
    doc.text(`${data.totalAmount} DH`, 150, yPos);
    
    // Footer
    console.log('Adding footer...');
    yPos += 30;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Ce devis est valable 30 jours à compter de sa date d\'émission.', 20, yPos);
    doc.text('Merci de votre confiance.', 20, yPos + 10);
    
    console.log('Generating PDF output...');
    const output = doc.output('arraybuffer');
    console.log('PDF generated successfully, size:', output.byteLength);
    
    return new Uint8Array(output);
    
  } catch (error) {
    console.error('Error in generateDevisPDF:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

// Test with comprehensive data
try {
  console.log('Testing actual devis generation...');
  
  const testData = {
    schoolName: "École Primaire Test",
    contactName: "Marie Dupont",
    contactEmail: "marie.dupont@ecole-test.ma",
    contactPhone: "+212 537 123 456",
    schoolAddress: "123 Avenue Mohammed V, Rabat",
    spectacleName: "Le Petit Prince",
    spectacleDate: "2025-01-15",
    spectacleTime: "14:30",
    venue: "Théâtre Bahnini",
    venueAddress: "Avenue Allal Ben Abdellah, Rabat",
    studentsCount: 25,
    teachersCount: 2,
    accompagnateurCount: 1,
    pricePerStudent: 100,
    pricePerTeacher: 0,
    pricePerAccompagnateur: 100,
    totalAmount: 2600,
    bookingId: "booking-test-123",
    devisNumber: "DEV-2025-001",
    dateGenerated: new Date().toLocaleDateString('fr-FR')
  };

  const devisPdf = generateDevisPDF(testData);
  fs.writeFileSync('test-actual-devis.pdf', devisPdf);
  console.log('✅ Actual devis generation successful');
  
} catch (error) {
  console.error('❌ Actual devis generation failed:', error.message);
  console.error('Full error:', error);
}

console.log('Test completed.');
