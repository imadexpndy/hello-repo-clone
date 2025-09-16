import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SESSIONS, getUserTypeSessions } from '@/data/sessions';

interface SpectacleSession {
  id: string;
  date: string;
  time: string;
  location: 'Rabat' | 'Casablanca';
  targetAudience: 'Écoles privées' | 'Écoles publiques' | 'Associations' | 'Grand public';
  availableSpots: number;
  maxCapacity: number;
  ageRange: string;
  duration: string;
  price: {
    professional: number;
    individual: number;
  };
}

interface ReservationData {
  spectacle: string;
  selectedSession: SpectacleSession | null;
  profileType: 'PRO' | 'Particulier' | '';
  fullName: string;
  email: string;
  phone: string;
  professionalEmail: string;
  establishmentName: string;
  numberOfChildren: number;
  classLevel: string;
  numberOfAccompanists: number;
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
      id: 'lpp-rab-1',
      date: '2025-10-15',
      time: '10:00',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 150,
      maxCapacity: 200,
      ageRange: '7-12 ans',
      duration: '50 min',
      price: { professional: 80, individual: 120 }
    },
    {
      id: 'lpp-cas-1',
      date: '2025-10-20',
      time: '16:00',
      location: 'Casablanca',
      targetAudience: 'Grand public',
      availableSpots: 80,
      maxCapacity: 150,
      ageRange: '7+ ans',
      duration: '50 min',
      price: { professional: 100, individual: 150 }
    }
  ],
  'tara-sur-la-lune': [
    {
      id: 'tsl-rab-1',
      date: '2025-11-05',
      time: '09:30',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 140,
      maxCapacity: 180,
      ageRange: '5-10 ans',
      duration: '45 min',
      price: { professional: 75, individual: 110 }
    }
  ],
  'estevanico': [
    {
      id: 'est-rab-1',
      date: '2025-12-01',
      time: '10:00',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 130,
      maxCapacity: 170,
      ageRange: '8-14 ans',
      duration: '60 min',
      price: { professional: 90, individual: 130 }
    }
  ],
  'charlotte': [
    {
      id: 'cha-rab-1',
      date: '2025-11-20',
      time: '10:30',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 120,
      maxCapacity: 160,
      ageRange: '6-11 ans',
      duration: '45 min',
      price: { professional: 80, individual: 115 }
    }
  ],
  'alice-chez-les-merveilles': [
    {
      id: 'acm-rab-1',
      date: '2025-12-10',
      time: '10:00',
      location: 'Rabat',
      targetAudience: 'Écoles privées',
      availableSpots: 140,
      maxCapacity: 180,
      ageRange: '5-12 ans',
      duration: '50 min',
      price: { professional: 85, individual: 125 }
    }
  ]
};

export default function ReservationWithSessions() {
  const { spectacleId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSessions, setAvailableSessions] = useState<SpectacleSession[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [reservationData, setReservationData] = useState<ReservationData>({
    spectacle: spectacleId || '',
    selectedSession: null,
    profileType: '',
    fullName: '',
    email: user?.email || '',
    phone: '',
    professionalEmail: '',
    establishmentName: '',
    numberOfChildren: 0,
    classLevel: '',
    numberOfAccompanists: 0,
    numberOfTickets: 1
  });

  useEffect(() => {
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.href);
      navigate('/auth?return_url=' + returnUrl);
    }

    if (spectacleId) {
      // Get sessions for particulier users (tout-public sessions)
      const userType = 'particulier';
      const sessions = getUserTypeSessions(spectacleId, userType, profile?.professional_type);
      
      // Convert sessions to SpectacleSession format
      const convertedSessions: SpectacleSession[] = sessions.map(session => ({
        id: session.id,
        date: session.date,
        time: session.time,
        location: session.location.includes('RABAT') ? 'Rabat' : 'Casablanca',
        targetAudience: 'Grand public',
        availableSpots: 100,
        maxCapacity: 150,
        ageRange: '5+ ans',
        duration: '50 min',
        price: { professional: 100, individual: 150 }
      }));
      
      setAvailableSessions(convertedSessions);
      
      // Extract unique cities
      const cities = [...new Set(convertedSessions.map(session => session.location))];
      setAvailableCities(cities);
    }
  }, [user, navigate, spectacleId]);

  const handleInputChange = (field: keyof ReservationData, value: any) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter sessions by selected city
  const getFilteredSessions = () => {
    if (!selectedCity) return availableSessions;
    return availableSessions.filter(session => session.location === selectedCity);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(selectedCity && reservationData.selectedSession);
      case 2:
        return !!(reservationData.profileType);
      case 3:
        if (reservationData.profileType === 'PRO') {
          return !!(reservationData.fullName && reservationData.email && reservationData.phone && 
                   reservationData.establishmentName && reservationData.professionalEmail && 
                   reservationData.numberOfChildren > 0 && reservationData.classLevel);
        } else {
          return !!(reservationData.fullName && reservationData.email && reservationData.phone && 
                   reservationData.professionalEmail && reservationData.numberOfTickets > 0);
        }
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const submitReservation = async () => {
    setIsSubmitting(true);
    
    try {
      const emailData = {
        to: 'inscription@edjs.ma',
        subject: 'Nouvelle réservation - ' + (spectacleNames[reservationData.spectacle] || reservationData.spectacle),
        spectacle: spectacleNames[reservationData.spectacle] || reservationData.spectacle,
        session: reservationData.selectedSession,
        ...reservationData,
        timestamp: new Date().toISOString(),
        userEmail: user?.email
      };

      console.log('Sending reservation data:', emailData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentStep(5);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Une erreur est survenue lors de l\'envoi de votre réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Redirection vers la connexion...</div>;
  }

  const getStepClass = (step: number) => {
    if (currentStep >= step) {
      return currentStep > step ? 'completed' : 'active';
    }
    return 'inactive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
          
          {/* Step Indicator */}
          <div className="flex justify-center mb-8 space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  getStepClass(step) === 'active' ? 'bg-green-500 text-white' :
                  getStepClass(step) === 'completed' ? 'bg-green-600 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Step 1: City and Session Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Choisir une ville et une session</h2>
                <h3 className="text-xl text-green-600 mb-6">
                  {spectacleNames[reservationData.spectacle] || reservationData.spectacle}
                </h3>
              </div>

              {/* City Selection */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">1. Sélectionnez votre ville</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        // Reset selected session when city changes
                        handleInputChange('selectedSession', null);
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedCity === city
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-300 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <i className="fas fa-map-marker-alt text-lg"></i>
                        <div>
                          <div className="font-semibold text-lg">{city}</div>
                          <div className="text-sm opacity-75">
                            {availableSessions.filter(s => s.location === city).length} session(s) disponible(s)
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Selection */}
              {selectedCity && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    2. Sélectionnez votre session à {selectedCity}
                  </h4>
                  <div className="space-y-4">
                    {getFilteredSessions().map((session) => (
                      <div
                        key={session.id}
                        onClick={() => handleInputChange('selectedSession', session)}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          reservationData.selectedSession?.id === session.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                {session.location}
                              </div>
                              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {session.targetAudience}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-gray-600">Date:</span>
                                <div>{new Date(session.date).toLocaleDateString('fr-FR')}</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-600">Heure:</span>
                                <div>{session.time}</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-600">Durée:</span>
                                <div>{session.duration}</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-600">Âge:</span>
                                <div>{session.ageRange}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {session.price.individual} DH
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {session.availableSpots}/{session.maxCapacity} places
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedCity && (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    <i className="fas fa-arrow-up text-2xl mb-2"></i>
                    <p>Veuillez d'abord sélectionner une ville pour voir les sessions disponibles</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Profile Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Choisir votre profil</h2>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Session sélectionnée:</strong> {new Date(reservationData.selectedSession?.date || '').toLocaleDateString('fr-FR')} à {reservationData.selectedSession?.time} 
                    - {reservationData.selectedSession?.location} ({reservationData.selectedSession?.targetAudience})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleInputChange('profileType', 'PRO')}
                  className={`p-6 border-2 rounded-lg text-left transition-colors ${
                    reservationData.profileType === 'PRO' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                >
                  <div className="font-semibold text-lg mb-2">Professionnel (PRO)</div>
                  <div className="text-sm text-gray-600 mb-3">Écoles, associations, groupes</div>
                  <div className="text-lg font-bold text-green-600">
                    {reservationData.selectedSession?.price.professional} DH
                  </div>
                </button>
                
                <button
                  onClick={() => handleInputChange('profileType', 'Particulier')}
                  className={`p-6 border-2 rounded-lg text-left transition-colors ${
                    reservationData.profileType === 'Particulier' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                >
                  <div className="font-semibold text-lg mb-2">Particulier</div>
                  <div className="text-sm text-gray-600 mb-3">Réservation individuelle</div>
                  <div className="text-lg font-bold text-green-600">
                    {reservationData.selectedSession?.price.individual} DH
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8">
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    ← Précédent
                  </button>
                )}
              </div>
              <div>
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      validateStep(currentStep)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Suivant →
                  </button>
                ) : (
                  <button
                    onClick={submitReservation}
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isSubmitting ? '📤 Envoi en cours...' : '📤 Envoyer la réservation'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
