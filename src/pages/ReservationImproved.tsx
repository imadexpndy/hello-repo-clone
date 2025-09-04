import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SpectacleSession {
  id: string;
  date: string;
  time: string;
  location: 'Rabat' | 'Casablanca';
  targetAudience: string;
  availableSpots: number;
  maxCapacity: number;
  price: { professional: number; individual: number };
}

interface ReservationData {
  spectacle: string;
  selectedSession: SpectacleSession | null;
  profileType: 'PRO' | 'Particulier' | '';
  fullName: string;
  email: string;
  phone: string;
  establishmentName: string;
  numberOfChildren: number;
  numberOfTickets: number;
}

const spectacleNames: { [key: string]: string } = {
  'le-petit-prince': 'Le Petit Prince',
  'tara-sur-la-lune': 'Tara sur la Lune',
  'estevanico': 'Estevanico',
  'charlotte': 'Charlotte',
  'alice-chez-les-merveilles': 'Alice Chez Les Merveilles'
};

const spectacleSessions: { [key: string]: SpectacleSession[] } = {
  'le-petit-prince': [
    {
      id: 'lpp-1',
      date: '2025-10-15',
      time: '10:00',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 150,
      maxCapacity: 200,
      price: { professional: 80, individual: 120 }
    },
    {
      id: 'lpp-2',
      date: '2025-10-20',
      time: '16:00',
      location: 'Casablanca',
      targetAudience: 'Grand public',
      availableSpots: 80,
      maxCapacity: 150,
      price: { professional: 100, individual: 150 }
    }
  ],
  'tara-sur-la-lune': [
    {
      id: 'tsl-1',
      date: '2025-11-05',
      time: '09:30',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 140,
      maxCapacity: 180,
      price: { professional: 75, individual: 110 }
    }
  ],
  'estevanico': [
    {
      id: 'est-1',
      date: '2025-12-01',
      time: '10:00',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 130,
      maxCapacity: 170,
      price: { professional: 90, individual: 130 }
    }
  ],
  'charlotte': [
    {
      id: 'cha-1',
      date: '2025-11-20',
      time: '10:30',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 120,
      maxCapacity: 160,
      price: { professional: 80, individual: 115 }
    }
  ],
  'alice-chez-les-merveilles': [
    {
      id: 'acm-1',
      date: '2025-12-10',
      time: '10:00',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 140,
      maxCapacity: 180,
      price: { professional: 85, individual: 125 }
    }
  ]
};

export default function ReservationImproved() {
  const { spectacleId } = useParams<{ spectacleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSessions, setAvailableSessions] = useState<SpectacleSession[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [reservationData, setReservationData] = useState<ReservationData>({
    spectacle: spectacleId || '',
    selectedSession: null,
    profileType: '',
    fullName: '',
    email: user?.email || '',
    phone: '',
    establishmentName: '',
    numberOfChildren: 1,
    numberOfTickets: 1
  });

  useEffect(() => {
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.href);
      navigate(`/auth?return_url=${returnUrl}`);
      return;
    }

    if (spectacleId && spectacleSessions[spectacleId]) {
      setAvailableSessions(spectacleSessions[spectacleId]);
    } else {
      navigate('/spectacles');
    }
  }, [user, navigate, spectacleId]);

  const handleInputChange = (field: keyof ReservationData, value: any) => {
    setReservationData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1 && !reservationData.selectedSession) {
      newErrors.session = 'Veuillez sélectionner une session';
    }
    
    if (step === 2 && !reservationData.profileType) {
      newErrors.profileType = 'Veuillez choisir votre profil';
    }
    
    if (step === 3) {
      if (!reservationData.fullName.trim()) newErrors.fullName = 'Nom requis';
      if (!reservationData.email.trim()) newErrors.email = 'Email requis';
      if (!reservationData.phone.trim()) newErrors.phone = 'Téléphone requis';
      
      if (reservationData.profileType === 'PRO') {
        if (!reservationData.establishmentName.trim()) newErrors.establishmentName = 'Établissement requis';
        if (reservationData.numberOfChildren <= 0) newErrors.numberOfChildren = 'Nombre d\'enfants requis';
      } else {
        if (reservationData.numberOfTickets <= 0) newErrors.numberOfTickets = 'Nombre de tickets requis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const calculateTotal = () => {
    if (!reservationData.selectedSession) return 0;
    const price = reservationData.profileType === 'PRO' 
      ? reservationData.selectedSession.price.professional
      : reservationData.selectedSession.price.individual;
    const quantity = reservationData.profileType === 'PRO'
      ? reservationData.numberOfChildren
      : reservationData.numberOfTickets;
    return price * quantity;
  };

  const submitReservation = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const emailData = {
        to: 'inscription@edjs.ma',
        subject: `Nouvelle réservation - ${spectacleNames[reservationData.spectacle]}`,
        spectacle: spectacleNames[reservationData.spectacle],
        session: reservationData.selectedSession,
        profile: reservationData.profileType,
        contact: {
          fullName: reservationData.fullName,
          email: reservationData.email,
          phone: reservationData.phone
        },
        details: reservationData.profileType === 'PRO' ? {
          establishmentName: reservationData.establishmentName,
          numberOfChildren: reservationData.numberOfChildren
        } : {
          numberOfTickets: reservationData.numberOfTickets
        },
        total: calculateTotal(),
        timestamp: new Date().toISOString()
      };

      console.log('Sending reservation:', emailData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(4);
    } catch (error) {
      setErrors({ submit: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Réservation de spectacle</h1>
              <h2 className="text-xl opacity-90">
                {spectacleNames[reservationData.spectacle] || reservationData.spectacle}
              </h2>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-center space-x-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Session Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">Choisissez votre session</h3>
                
                {errors.session && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.session}
                  </div>
                )}

                <div className="space-y-4">
                  {availableSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleInputChange('selectedSession', session)}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        reservationData.selectedSession?.id === session.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg mb-2">
                            {new Date(session.date).toLocaleDateString('fr-FR')} à {session.time}
                          </div>
                          <div className="text-gray-600 mb-2">📍 {session.location}</div>
                          <div className="text-gray-600">👥 {session.targetAudience}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {session.price.professional} DH (PRO)
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {session.price.individual} DH (Particulier)
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            {session.availableSpots}/{session.maxCapacity} places
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Profile Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">Choisissez votre profil</h3>
                
                {errors.profileType && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.profileType}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => handleInputChange('profileType', 'PRO')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      reservationData.profileType === 'PRO' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">🏫</div>
                      <div className="font-semibold text-lg mb-2">Professionnel (PRO)</div>
                      <div className="text-2xl font-bold text-green-600">
                        {reservationData.selectedSession?.price.professional} DH
                      </div>
                      <div className="text-sm text-gray-600">par enfant</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleInputChange('profileType', 'Particulier')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      reservationData.profileType === 'Particulier' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                      <div className="font-semibold text-lg mb-2">Particulier</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {reservationData.selectedSession?.price.individual} DH
                      </div>
                      <div className="text-sm text-gray-600">par ticket</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Form */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">Vos informations</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="font-semibold">
                    {spectacleNames[reservationData.spectacle]} - {reservationData.profileType}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(reservationData.selectedSession?.date || '').toLocaleDateString('fr-FR')} à {reservationData.selectedSession?.time}
                  </div>
                  <div className="text-lg font-bold text-green-600 mt-2">
                    Total: {calculateTotal()} DH
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      value={reservationData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full p-3 border rounded-lg ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Votre nom complet"
                    />
                    {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={reservationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={reservationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="+212 6 XX XX XX XX"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                {reservationData.profileType === 'PRO' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement *</label>
                      <input
                        type="text"
                        value={reservationData.establishmentName}
                        onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                        className={`w-full p-3 border rounded-lg ${errors.establishmentName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nom de votre école/association"
                      />
                      {errors.establishmentName && <p className="text-red-600 text-sm mt-1">{errors.establishmentName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'enfants *</label>
                      <input
                        type="number"
                        min="1"
                        value={reservationData.numberOfChildren}
                        onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
                        className={`w-full p-3 border rounded-lg ${errors.numberOfChildren ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.numberOfChildren && <p className="text-red-600 text-sm mt-1">{errors.numberOfChildren}</p>}
                    </div>
                  </>
                )}

                {reservationData.profileType === 'Particulier' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de tickets *</label>
                    <input
                      type="number"
                      min="1"
                      value={reservationData.numberOfTickets}
                      onChange={(e) => handleInputChange('numberOfTickets', parseInt(e.target.value) || 0)}
                      className={`w-full p-3 border rounded-lg ${errors.numberOfTickets ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.numberOfTickets && <p className="text-red-600 text-sm mt-1">{errors.numberOfTickets}</p>}
                  </div>
                )}

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600">Réservation confirmée!</h3>
                <p className="text-gray-600">
                  Votre demande de réservation a été envoyée à inscription@edjs.ma
                </p>
                <p className="text-gray-600">
                  Vous recevrez une confirmation par email sous peu.
                </p>
                <button
                  onClick={() => navigate('/spectacles')}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Retour aux spectacles
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg ${
                    currentStep === 1 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  Précédent
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={submitReservation}
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg ${
                      isSubmitting 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Confirmer la réservation'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
