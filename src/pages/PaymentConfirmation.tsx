import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail } from 'lucide-react';

export default function PaymentConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if payment was actually sent
    const paymentSent = sessionStorage.getItem('paymentSent');
    if (!paymentSent) {
      navigate('/spectacles');
    }
  }, [navigate]);

  const handleBackToSpectacles = () => {
    // Clear payment data
    sessionStorage.removeItem('paymentSent');
    sessionStorage.removeItem('reservationPaymentData');
    sessionStorage.removeItem('guestReservationData');
    navigate('/spectacles');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/8 via-primary/4 to-primary/12 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-green-800">
            Paiement confirmé
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Votre paiement par virement bancaire a été enregistré avec succès.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800">En attente d'approbation</span>
            </div>
            <p className="text-sm text-yellow-700">
              Votre réservation est en cours de traitement. Un administrateur va vérifier votre paiement.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">Notification par email</span>
            </div>
            <p className="text-sm text-blue-700">
              Vous recevrez un email de confirmation une fois votre paiement approuvé par l'administration.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleBackToSpectacles}
              className="w-full"
              size="lg"
            >
              Retour aux spectacles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
