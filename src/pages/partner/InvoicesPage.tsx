import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Eye, Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const invoices = [
    {
      id: 'FAC-2024-001',
      title: 'Le Petit Prince - École Primaire Al Massira',
      date: '2024-03-20',
      dueDate: '2024-04-20',
      amount: '2,500 MAD',
      status: 'Payée',
      paymentDate: '2024-03-18'
    },
    {
      id: 'FAC-2024-002',
      title: 'Charlotte - Association Enfance Heureuse',
      date: '2024-03-15',
      dueDate: '2024-04-15',
      amount: '1,800 MAD',
      status: 'En attente',
      paymentDate: null
    },
    {
      id: 'FAC-2024-003',
      title: 'Tara sur la Lune - École Internationale',
      date: '2024-02-28',
      dueDate: '2024-03-30',
      amount: '3,200 MAD',
      status: 'En retard',
      paymentDate: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateInvoicePDF = async (invoice: any) => {
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
      pdf.text('FACTURE', 20, 70);
      
      // Add invoice details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Référence: ${invoice.id}`, 20, 90);
      pdf.text(`Date d'émission: ${invoice.date}`, 20, 105);
      pdf.text(`Date d'échéance: ${invoice.dueDate}`, 20, 120);
      pdf.text(`Statut: ${invoice.status}`, 20, 135);
      if (invoice.paymentDate) {
        pdf.text(`Date de paiement: ${invoice.paymentDate}`, 20, 150);
      }
      
      // Add service details
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DÉTAIL DE LA FACTURE', 20, 180);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Service: ${invoice.title}`, 20, 200);
      
      // Add total
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`MONTANT TOTAL: ${invoice.amount}`, 20, 230);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Merci de votre confiance.', 20, 260);
      pdf.text('Pour toute question, contactez-nous à inscription@edjs.ma', 20, 270);
      
      // Save the PDF
      pdf.save(`facture-${invoice.id}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback PDF without logo
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FACTURE', 20, 30);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Référence: ${invoice.id}`, 20, 50);
      pdf.text(`Service: ${invoice.title}`, 20, 65);
      pdf.text(`Total: ${invoice.amount}`, 20, 80);
      pdf.save(`facture-${invoice.id}.pdf`);
    }
  };

  const viewInvoice = (invoice: any) => {
    // Create a modal or new page to view invoice details
    alert(`Visualisation de la facture ${invoice.id}\n\nService: ${invoice.title}\nMontant: ${invoice.amount}\nStatut: ${invoice.status}\nÉchéance: ${invoice.dueDate}`);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Factures</h1>
        <p className="text-gray-600">Suivez vos paiements et factures</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total factures</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
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
                <p className="text-sm font-medium text-gray-600">Payées</p>
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
                <p className="text-2xl font-bold text-gray-900">2</p>
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
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des factures</CardTitle>
          <CardDescription>Consultez et téléchargez vos factures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{invoice.title}</h3>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Référence:</span> {invoice.id}
                      </div>
                      <div>
                        <span className="font-medium">Date émission:</span> {invoice.date}
                      </div>
                      <div>
                        <span className="font-medium">Échéance:</span> {invoice.dueDate}
                      </div>
                      <div>
                        <span className="font-medium">Paiement:</span> {invoice.paymentDate || 'En attente'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{invoice.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => viewInvoice(invoice)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generateInvoicePDF(invoice)}>
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
