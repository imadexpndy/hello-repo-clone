// Test script to check devis PDF generation
import { generateDevisPDF } from './src/utils/devisGenerator.js';

const testDevisData = {
  // Client info
  schoolName: "École Test",
  contactName: "Jean Dupont",
  contactEmail: "jean.dupont@test.fr",
  contactPhone: "+212 123 456 789",
  schoolAddress: "123 Rue Test, Casablanca",
  
  // Spectacle info
  spectacleName: "Le Petit Prince",
  spectacleDate: "2025-10-15",
  spectacleTime: "14:30",
  venue: "Théâtre Bahnini",
  venueAddress: "Rabat, Maroc",
  
  // Participants
  studentsCount: 25,
  teachersCount: 2,
  accompagnateurCount: 3,
  
  // Pricing
  pricePerStudent: 100,
  pricePerTeacher: 0,
  pricePerAccompagnateur: 100,
  totalAmount: 2800,
  
  // Booking info
  bookingId: "test-booking-123",
  devisNumber: "DEV-TEST123",
  dateGenerated: new Date().toLocaleDateString('fr-FR')
};

try {
  console.log('Testing devis PDF generation...');
  console.log('Test data:', testDevisData);
  
  const pdfBytes = generateDevisPDF(testDevisData);
  console.log('PDF generated successfully!');
  console.log('PDF size:', pdfBytes.length, 'bytes');
  
  // Try to create a blob and URL
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  console.log('Blob created successfully, size:', blob.size);
  
} catch (error) {
  console.error('Error generating PDF:', error);
  console.error('Error stack:', error.stack);
}
