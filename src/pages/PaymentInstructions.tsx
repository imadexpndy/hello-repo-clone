import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, FileText, CreditCard, MessageCircle, User, CheckCircle } from 'lucide-react';

export default function PaymentInstructions() {
  const navigate = useNavigate();
  const [reservationData, setReservationData] = useState<any>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('reservationData');
    if (storedData) {
      setReservationData(JSON.parse(storedData));
    } else {
      navigate('/spectacles');
    }
  }, [navigate]);

  const handlePaymentSent = () => {
    // Mark payment as sent and redirect to confirmation
    sessionStorage.setItem('paymentSent', 'true');
    navigate('/payment-confirmation');
  };

  const getInstructions = () => {
    if (!reservationData) return null;

    const method = reservationData.paymentMethod;
    const referenceNumber = `EDJS-${Date.now().toString().slice(-6)}`;

    switch (method) {
      case 'virement':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Instructions pour le virement bancaire</h3>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Bénéficiaire:</span>
                  <div className="text-blue-700">École du Jeune Spectateur</div>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Banque:</span>
                  <div className="text-blue-700">Attijariwafa Bank</div>
                </div>
                <div>
                  <span className="font-medium text-blue-800">IBAN:</span>
                  <div className="text-blue-700 font-mono">MA64 011 780 0000001234567890</div>
                </div>
                <div>
                  <span className="font-medium text-blue-800">RIB:</span>
                  <div className="text-blue-700 font-mono">011 780 0000001234567890 23</div>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-blue-800">Référence obligatoire:</span>
                  <div className="text-blue-700 font-mono text-lg">{referenceNumber}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> N'oubliez pas d'indiquer la référence <strong>{referenceNumber}</strong> 
                lors de votre virement pour faciliter l'identification de votre paiement.
              </p>
            </div>
          </div>
        );

      case 'cheque':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">Instructions pour le paiement par chèque</h3>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-800">Ordre du chèque:</span>
                  <div className="text-green-700">École du Jeune Spectateur</div>
                </div>
                <div>
                  <span className="font-medium text-green-800">Montant:</span>
                  <div className="text-green-700 text-lg font-bold">{reservationData.totalAmount} MAD</div>
                </div>
                <div>
                  <span className="font-medium text-green-800">Référence à noter au dos:</span>
                  <div className="text-green-700 font-mono">{referenceNumber}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Adresse d'envoi:</h4>
              <div className="text-sm text-blue-700">
                École du Jeune Spectateur<br/>
                123 Avenue Mohammed V<br/>
                10000 Rabat, Maroc
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Notez la référence <strong>{referenceNumber}</strong> au dos du chèque 
                et envoyez-le à l'adresse ci-dessus.
              </p>
            </div>
          </div>
        );

      case 'autre':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold">Autre mode de paiement</h3>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800 mb-3">
                Pour les autres modes de paiement, veuillez nous contacter directement.
              </p>
              <div className="text-sm text-purple-700">
                <div><strong>Référence de votre réservation:</strong> {referenceNumber}</div>
                <div><strong>Montant:</strong> {reservationData.totalAmount} MAD</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!reservationData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/8 via-primary/4 to-primary/12 p-4">
      <Card className="w-full max-w-3xl">
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
              <CardTitle className="text-xl">Instructions de paiement</CardTitle>
              <p className="text-muted-foreground mt-1">
                Suivez les instructions ci-dessous pour finaliser votre réservation
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Reservation Summary */}
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-3 text-primary">Récapitulatif de votre réservation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Spectacle:</span>
                <div className="font-medium">{reservationData.spectacle}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Participants:</span>
                <div className="font-medium">
                  {(reservationData.childrenCount || 0) + (reservationData.accompaniersCount || 0)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total:</span>
                <div className="font-bold text-primary text-lg">{reservationData.totalAmount} MAD</div>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          {getInstructions()}

          {/* WhatsApp Support */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium">Besoin d'aide ?</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Notre équipe est disponible pour vous accompagner dans votre réservation.
            </p>
            <Button
              onClick={() => window.open('https://wa.me/212600000000?text=Bonjour, j\'ai besoin d\'aide pour ma réservation', '_blank')}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contacter le support WhatsApp
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handlePaymentSent}
              className="flex-1"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Paiement envoyé
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <User className="h-5 w-5 mr-2" />
              Voir mes réservations
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Après confirmation de votre paiement, vous recevrez un email de confirmation de votre réservation.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
