import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Building2, FileText } from 'lucide-react';

export default function PaymentMethodSelection() {
  const navigate = useNavigate();
  const [reservationData, setReservationData] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

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
      id: 'virement',
      title: 'Virement bancaire',
      description: 'Paiement par virement bancaire',
      icon: Building2,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 'cheque',
      title: 'Chèque',
      description: 'Paiement par chèque bancaire',
      icon: FileText,
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      id: 'autre',
      title: 'Autre',
      description: 'Autre mode de paiement (contactez-nous)',
      icon: CreditCard,
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      const updatedData = {
        ...reservationData,
        paymentMethod: selectedMethod
      };
      sessionStorage.setItem('reservationData', JSON.stringify(updatedData));
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
                <div
                  key={method.id}
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
              Continuer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
