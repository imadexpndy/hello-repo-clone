import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const quotes = [
    {
      id: 'DEV-2024-001',
      title: 'Le Petit Prince - École Primaire Al Massira',
      date: '2024-03-15',
      amount: '2,500 MAD',
      status: 'En attente',
      spectacle: 'Le Petit Prince',
      students: 120,
      performances: 2
    },
    {
      id: 'DEV-2024-002',
      title: 'Charlotte - Association Enfance Heureuse',
      date: '2024-03-10',
      amount: '1,800 MAD',
      status: 'Approuvé',
      spectacle: 'Charlotte',
      students: 80,
      performances: 1
    },
    {
      id: 'DEV-2024-003',
      title: 'Tara sur la Lune - École Internationale',
      date: '2024-03-08',
      amount: '3,200 MAD',
      status: 'Expiré',
      spectacle: 'Tara sur la Lune',
      students: 150,
      performances: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'Expiré': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generatePDF = async (quote: any) => {
    const pdf = new jsPDF();
    
    // Add EDJS logo
    const logoUrl = 'https://edjs.art/assets/img/edjs%20logo%20black@4x.png';
    
    try {
      // Create a temporary image element to load the logo
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = logoUrl;
      });
      
      // Convert image to canvas to get base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL('image/png');
      
      // Add logo to PDF
      pdf.addImage(logoBase64, 'PNG', 20, 20, 50, 25);
      
      // Add company info
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text("L'École des jeunes spectateurs", 80, 30);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Association culturelle - Maroc', 80, 38);
      
      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DEVIS', 20, 70);
      
      // Add quote details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Référence: ${quote.id}`, 20, 90);
      pdf.text(`Date: ${quote.date}`, 20, 105);
      pdf.text(`Spectacle: ${quote.spectacle}`, 20, 120);
      pdf.text(`Nombre d'élèves: ${quote.students}`, 20, 135);
      pdf.text(`Nombre de représentations: ${quote.performances}`, 20, 150);
      
      // Add pricing section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DÉTAIL DU DEVIS', 20, 180);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Spectacle "${quote.spectacle}"`, 20, 200);
      pdf.text(`${quote.students} élèves x ${quote.performances} représentation(s)`, 20, 215);
      
      // Add total
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`TOTAL: ${quote.amount}`, 20, 240);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Ce devis est valable 30 jours à compter de la date d\'émission.', 20, 270);
      pdf.text('Pour toute question, contactez-nous à inscription@edjs.ma', 20, 280);
      
      // Save the PDF
      pdf.save(`devis-${quote.id}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback PDF without logo
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DEVIS', 20, 30);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Référence: ${quote.id}`, 20, 50);
      pdf.text(`Spectacle: ${quote.spectacle}`, 20, 65);
      pdf.text(`Total: ${quote.amount}`, 20, 80);
      pdf.save(`devis-${quote.id}.pdf`);
    }
  };

  const viewQuote = (quote: any) => {
    // Create a modal or new page to view quote details
    alert(`Visualisation du devis ${quote.id}\n\nSpectacle: ${quote.spectacle}\nÉlèves: ${quote.students}\nMontant: ${quote.amount}`);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Devis</h1>
        <p className="text-gray-600">Gérez vos demandes de devis et estimations</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un devis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau devis
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total devis</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expirés</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des devis</CardTitle>
          <CardDescription>Consultez et gérez vos devis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{quote.title}</h3>
                      <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Référence:</span> {quote.id}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {quote.date}
                      </div>
                      <div>
                        <span className="font-medium">Élèves:</span> {quote.students}
                      </div>
                      <div>
                        <span className="font-medium">Représentations:</span> {quote.performances}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{quote.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => viewQuote(quote)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generatePDF(quote)}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
