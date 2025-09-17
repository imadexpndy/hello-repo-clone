import React from 'react';
import { Button } from '@/components/ui/button';
import { generateDevisPDF } from '@/utils/devisGenerator';
import { toast } from 'sonner';

export const DevisTestButton: React.FC = () => {
  const testDevisGeneration = async () => {
    try {
      console.log('Testing devis generation...');
      
      const testData = {
        schoolName: "École Test",
        contactName: "Jean Dupont", 
        contactEmail: "jean.dupont@test.fr",
        contactPhone: "+212 123 456 789",
        schoolAddress: "123 Rue Test, Casablanca",
        spectacleName: "Le Petit Prince",
        spectacleDate: "2025-10-15",
        spectacleTime: "14:30",
        venue: "Théâtre Bahnini",
        venueAddress: "Rabat, Maroc",
        studentsCount: 25,
        teachersCount: 2,
        accompagnateurCount: 3,
        pricePerStudent: 100,
        pricePerTeacher: 0,
        pricePerAccompagnateur: 100,
        totalAmount: 2800,
        bookingId: "test-booking-123",
        devisNumber: "DEV-TEST123",
        dateGenerated: new Date().toLocaleDateString('fr-FR')
      };

      console.log('Test data:', testData);
      
      const pdfBytes = generateDevisPDF(testData);
      console.log('PDF generated successfully, size:', pdfBytes.length);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'test-devis.pdf';
      link.click();
      
      toast.success('Test devis generated successfully!');
      
    } catch (error) {
      console.error('Test failed:', error);
      toast.error(`Test failed: ${error.message}`);
    }
  };

  return (
    <Button 
      onClick={testDevisGeneration}
      variant="outline"
      className="mb-4"
    >
      Test Devis Generation
    </Button>
  );
};
