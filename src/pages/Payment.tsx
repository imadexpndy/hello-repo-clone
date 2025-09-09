import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Lock, CheckCircle, Building2 } from 'lucide-react';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const type = searchParams.get('type');
  const spectacle = searchParams.get('spectacle');
  const participants = searchParams.get('participants');
  
  const [reservationData, setReservationData] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Load reservation data from sessionStorage
    const dataKey = type === 'guest' ? 'guestReservationData' : 'reservationPaymentData';
    const storedData = sessionStorage.getItem(dataKey);
    
    if (storedData) {
      setReservationData(JSON.parse(storedData));
    } else {
      // Redirect back if no data found
      navigate('/spectacles');
    }
  }, [type, navigate]);

  const calculatePrice = () => {
    // Check if user is from private school
    const isPrivateSchool = reservationData?.userType === 'scolaire-privee' || 
                           reservationData?.organizationType === 'private_school' ||
                           reservationData?.organizationType === 'private_school_teacher';
    
    const basePrice = isPrivateSchool ? 100 : 80; // 100 DHS TTC for private schools, 80 for others
    
    // Calculate total participants from children + accompaniers
    const childrenCount = parseInt(reservationData?.childrenCount || '0');
    const accompaniersCount = parseInt(reservationData?.accompaniersCount || '0');
    const totalParticipants = childrenCount + accompaniersCount;
    
    return basePrice * Math.max(totalParticipants, 1); // Ensure at least 1 participant
  };

  const isPrivateSchoolUser = () => {
    return reservationData?.userType === 'scolaire-privee' || 
           reservationData?.organizationType === 'private_school' ||
           reservationData?.organizationType === 'private_school_teacher';
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      handleInputChange('expiryDate', formatted);
    }
  };

  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardName } = paymentForm;
    return cardNumber.replace(/\s/g, '').length === 16 &&
           expiryDate.length === 5 &&
           cvv.length === 3 &&
           cardName.trim().length > 0;
  };

  const processPayment = async () => {
    if (!validateForm()) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Store payment confirmation
      const paymentConfirmation = {
        ...reservationData,
        paymentDetails: {
          amount: calculatePrice(),
          currency: 'MAD',
          paymentMethod: 'card',
          transactionId: 'TXN_' + Date.now(),
          paidAt: new Date().toISOString()
        }
      };
      
      sessionStorage.setItem('paymentConfirmation', JSON.stringify(paymentConfirmation));
      
      setPaymentComplete(true);
      
      // Clear reservation data
      if (type === 'guest') {
        sessionStorage.removeItem('guestReservationData');
      } else {
        sessionStorage.removeItem('reservationPaymentData');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!reservationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Chargement des données de réservation...</p>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Paiement réussi !
                </h2>
                <p className="text-gray-600 mb-6">
                  Votre réservation a été confirmée et payée avec succès.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                  <h4 className="font-semibold mb-2">Détails de la réservation :</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Spectacle :</strong> {reservationData.spectacleName}</div>
                    <div><strong>Participants :</strong> {participants}</div>
                    <div><strong>Montant payé :</strong> {calculatePrice()} MAD</div>
                    <div><strong>Contact :</strong> {reservationData.name || reservationData.fullName}</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                  <h5 className="font-semibold text-blue-800 mb-2">Prochaines étapes :</h5>
                  <ul className="text-blue-700 text-sm space-y-1 text-left">
                    <li>• Vous recevrez un email de confirmation sous peu</li>
                    <li>• Vos billets électroniques seront envoyés par email</li>
                    <li>• Conservez votre confirmation de paiement</li>
                    <li>• Contactez-nous si vous avez des questions</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate('/spectacles')}
                    variant="outline"
                    className="flex-1"
                  >
                    Retour aux spectacles
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Récapitulatif de commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{reservationData.spectacleName}</h4>
                  <p className="text-gray-600">
                    {type === 'guest' ? 'Réservation invité' : 'Réservation particulier'}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nombre de participants :</span>
                    <span>{participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix unitaire :</span>
                    <span>{isPrivateSchoolUser() ? '100' : '80'} MAD {isPrivateSchoolUser() ? 'TTC' : ''}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total :</span>
                    <span>{calculatePrice()} MAD</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Informations de contact :</h5>
                  <div className="text-sm space-y-1">
                    <div><strong>Nom :</strong> {reservationData.name || reservationData.fullName}</div>
                    <div><strong>Email :</strong> {reservationData.email}</div>
                    <div><strong>Téléphone :</strong> {reservationData.phone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Paiement sécurisé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bank Transfer Info for Private Schools */}
                {isPrivateSchoolUser() && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                    <h5 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Informations de virement bancaire - Écoles Privées
                    </h5>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div><strong>RIB :</strong> 190780212110543439000859</div>
                      <div><strong>Banque :</strong> Banque Populaire</div>
                      <div><strong>Bénéficiaire :</strong> LIMA PRODUCTION</div>
                      <div><strong>Montant :</strong> {calculatePrice()} DHS TTC</div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-100 rounded text-xs text-blue-800">
                      <strong>Note :</strong> Veuillez effectuer le virement bancaire avec ces informations. 
                      Vous pouvez également procéder au paiement par carte ci-dessous.
                    </div>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Lock className="h-4 w-4 mr-2" />
                  Vos informations sont protégées par cryptage SSL
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Numéro de carte *
                  </label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date d'expiration *
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/AA"
                      value={paymentForm.expiryDate}
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CVV *
                    </label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={paymentForm.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          handleInputChange('cvv', value);
                        }
                      }}
                      maxLength={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom sur la carte *
                  </label>
                  <Input
                    type="text"
                    placeholder="Nom complet"
                    value={paymentForm.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={processPayment}
                    disabled={isProcessing || !validateForm()}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Traitement en cours...
                      </>
                    ) : (
                      `Payer ${calculatePrice()} MAD`
                    )}
                  </Button>
                  
                  {isPrivateSchoolUser() && (
                    <Button
                      onClick={() => {
                        // Mark payment as sent and redirect to confirmation
                        sessionStorage.setItem('paymentSent', 'true');
                        navigate('/payment-confirmation');
                      }}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Paiement envoyé (Virement bancaire)
                    </Button>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center">
                  En cliquant sur "Payer", vous acceptez nos conditions générales de vente
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
