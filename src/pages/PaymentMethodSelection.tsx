import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Building2, FileText, MessageCircle } from 'lucide-react';

export default function PaymentMethodSelection() {
  const navigate = useNavigate();
  const [reservationData, setReservationData] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem('reservationData');
    if (storedData) {
      setReservationData(JSON.parse(storedData));
    } else {
      navigate('/spectacles');
    }
  }, [navigate]);

  const paymentMethods = [
    {
      id: 'card',
      title: 'Carte bancaire',
      description: 'Paiement par carte bancaire',
      icon: CreditCard,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 'virement',
      title: 'Virement bancaire',
      description: 'Paiement par virement bancaire',
      icon: Building2,
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      id: 'autre',
      title: 'Autre',
      description: 'Autre mode de paiement (contactez-nous)',
      icon: FileText,
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  ];

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleWhatsAppContact = () => {
    if (!reservationData) return;
    
    const message = `Bonjour, je souhaite réserver le spectacle suivant et payer en espèces:

📋 *Détails de la réservation:*
• Spectacle: ${reservationData.spectacle}
• Date de séance: ${reservationData.sessionDate}
• Client: ${reservationData.customerName}
• Montant total: ${reservationData.totalAmount} MAD

💰 Je souhaite payer en espèces. Merci de me contacter pour finaliser ma réservation.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/212123456789?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleContinue = () => {
    if (selectedMethod === 'card') {
      // Validate card data
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName) {
        alert('Veuillez remplir tous les champs de la carte');
        return;
      }
    }
    
    if (selectedMethod) {
      const updatedData = {
        ...reservationData,
        paymentMethod: selectedMethod,
        ...(selectedMethod === 'card' && { cardData })
      };
      sessionStorage.setItem('reservationData', JSON.stringify(updatedData));
      
      if (selectedMethod === 'autre') {
        handleWhatsAppContact();
        return;
      }
      
      navigate('/payment-instructions');
    }
  };

  if (!reservationData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/8 via-primary/4 to-primary/12 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-xl">Mode de paiement</CardTitle>
              <p className="text-muted-foreground mt-1">
                Choisissez votre mode de paiement préféré
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Reservation Summary */}
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-3 text-primary">Récapitulatif</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Spectacle:</span>
                <div className="font-medium">{reservationData.spectacle}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total:</span>
                <div className="font-bold text-primary">{reservationData.totalAmount} MAD</div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="font-semibold">Sélectionnez un mode de paiement</h4>
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.id} className="space-y-3">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${method.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{method.title}</h5>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMethod === method.id
                          ? 'bg-primary border-primary'
                          : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {selectedMethod === method.id && (
                    <div className="ml-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {method.id === 'card' && (
                        <div className="space-y-4">
                          <h6 className="font-semibold text-sm">Informations de la carte</h6>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label htmlFor="cardholderName">Nom du titulaire</Label>
                              <Input
                                id="cardholderName"
                                value={cardData.cardholderName}
                                onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                                placeholder="Nom complet"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="cardNumber">Numéro de carte</Label>
                              <Input
                                id="cardNumber"
                                value={cardData.cardNumber}
                                onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                              />
                            </div>
                            <div>
                              <Label htmlFor="expiryDate">Date d'expiration</Label>
                              <Input
                                id="expiryDate"
                                value={cardData.expiryDate}
                                onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                                placeholder="MM/AA"
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                value={cardData.cvv}
                                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                                placeholder="123"
                                maxLength={3}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {method.id === 'virement' && (
                        <div className="space-y-3">
                          <h6 className="font-semibold text-sm">Informations bancaires</h6>
                          <div className="bg-white p-4 rounded border space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Bénéficiaire:</span>
                              <span>EDJS SARL</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Banque:</span>
                              <span>Banque Populaire</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">RIB:</span>
                              <span className="font-mono">1234 5678 9012 3456 78</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">SWIFT:</span>
                              <span className="font-mono">BCPOMAMC</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Veuillez inclure votre nom et le numéro de réservation dans la référence du virement.
                          </p>
                        </div>
                      )}

                      {method.id === 'autre' && (
                        <div className="space-y-3">
                          <h6 className="font-semibold text-sm">Contactez-nous sur WhatsApp</h6>
                          <p className="text-sm text-muted-foreground">
                            Cliquez sur "Continuer" pour nous contacter directement sur WhatsApp avec les détails de votre réservation.
                          </p>
                          <div className="flex items-center gap-2 text-green-600">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">WhatsApp: +212 123 456 789</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className="w-full"
              size="lg"
            >
              {selectedMethod === 'autre' ? 'Contacter sur WhatsApp' : 'Continuer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
