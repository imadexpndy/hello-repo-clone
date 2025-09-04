import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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
  location: 'Rabat' | 'Casablanca' | '';
  publicType: 'Écoles privées' | 'Écoles publiques' | 'Associations' | '';
  
  // Common fields
  fullName: string;
  email: string;
  phone: string;
  professionalEmail: string;
  
  // Professional fields
  establishmentName: string;
  numberOfChildren: number;
  classLevel: string;
  numberOfAccompanists: number;
  
  // Individual fields
  numberOfTickets: number;
}

const spectacleNames: { [key: string]: string } = {
  'le-petit-prince': 'Le Petit Prince',
  'tara-sur-la-lune': 'Tara sur la Lune',
  'estevanico': 'Estevanico',
  'charlotte': 'Charlotte',
  'alice-chez-les-merveilles': 'Alice Chez Les Merveilles'
};

export default function ReservationSimple() {
  const { spectacleId } = useParams<{ spectacleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({
    spectacle: spectacleId || '',
    selectedSession: null,
    profileType: '',
    location: '',
    publicType: '',
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
  }, [user, navigate]);

  const handleInputChange = (field: keyof ReservationData, value: any) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(reservationData.profileType && reservationData.location && 
                 (reservationData.profileType === 'Particulier' || reservationData.publicType));
      case 2:
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
      // Prepare email data
      const emailData = {
        to: 'inscription@edjs.ma',
        subject: 'Nouvelle réservation - ' + (spectacleNames[reservationData.spectacle] || reservationData.spectacle),
        spectacle: spectacleNames[reservationData.spectacle] || reservationData.spectacle,
        ...reservationData,
        timestamp: new Date().toISOString(),
        userEmail: user?.email
      };

      // Send email (this would need to be implemented with your backend)
      console.log('Sending reservation data:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentStep(4);
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
            {[1, 2, 3, 4].map((step) => (
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

          {/* Step 1: Profile Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Réservation du spectacle</h2>
                <h3 className="text-xl text-green-600 mb-6">
                  {spectacleNames[reservationData.spectacle] || reservationData.spectacle}
                </h3>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Choisissez votre profil :
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleInputChange('profileType', 'PRO')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      reservationData.profileType === 'PRO' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="font-semibold">Professionnel (PRO)</div>
                    <div className="text-sm text-gray-600">Écoles, associations</div>
                  </button>
                  <button
                    onClick={() => handleInputChange('profileType', 'Particulier')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      reservationData.profileType === 'Particulier' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="font-semibold">Particulier</div>
                    <div className="text-sm text-gray-600">Réservation individuelle</div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Lieu du spectacle :
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleInputChange('location', 'Rabat')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      reservationData.location === 'Rabat' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    Rabat
                  </button>
                  <button
                    onClick={() => handleInputChange('location', 'Casablanca')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      reservationData.location === 'Casablanca' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    Casablanca
                  </button>
                </div>
              </div>

              {reservationData.profileType === 'PRO' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Public concerné :
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Écoles privées', 'Écoles publiques', 'Associations'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('publicType', type as any)}
                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                          reservationData.publicType === type 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Form */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Formulaire d'inscription
              </h2>
              
              {reservationData.profileType === 'PRO' ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-green-600 mb-4">
                    Pour écoles et associations
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={reservationData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={reservationData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={reservationData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'établissement *
                      </label>
                      <input
                        type="text"
                        value={reservationData.establishmentName}
                        onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      value={reservationData.professionalEmail}
                      onChange={(e) => handleInputChange('professionalEmail', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre d'enfants *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={reservationData.numberOfChildren || ''}
                        onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau des classes *
                      </label>
                      <input
                        type="text"
                        value={reservationData.classLevel}
                        onChange={(e) => handleInputChange('classLevel', e.target.value)}
                        placeholder="Ex: CP, CE1, CE2..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d'accompagnateurs
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={reservationData.numberOfAccompanists || ''}
                      onChange={(e) => handleInputChange('numberOfAccompanists', parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-sm text-amber-600 mt-2">
                      ⚠️ Maximum : 4 accompagnateurs par groupe de 30 enfants
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-green-600 mb-4">
                    Pour particuliers
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={reservationData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={reservationData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={reservationData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email professionnel *
                      </label>
                      <input
                        type="email"
                        value={reservationData.professionalEmail}
                        onChange={(e) => handleInputChange('professionalEmail', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de tickets souhaités *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={reservationData.numberOfTickets || ''}
                      onChange={(e) => handleInputChange('numberOfTickets', parseInt(e.target.value) || 1)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Paiement & Confirmation
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Récapitulatif de votre réservation
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div><strong>Spectacle :</strong> {spectacleNames[reservationData.spectacle] || reservationData.spectacle}</div>
                  <div><strong>Profil :</strong> {reservationData.profileType}</div>
                  <div><strong>Lieu :</strong> {reservationData.location}</div>
                  {reservationData.profileType === 'PRO' && (
                    <>
                      <div><strong>Public :</strong> {reservationData.publicType}</div>
                      <div><strong>Établissement :</strong> {reservationData.establishmentName}</div>
                      <div><strong>Nombre d'enfants :</strong> {reservationData.numberOfChildren}</div>
                      <div><strong>Niveau :</strong> {reservationData.classLevel}</div>
                    </>
                  )}
                  {reservationData.profileType === 'Particulier' && (
                    <div><strong>Nombre de tickets :</strong> {reservationData.numberOfTickets}</div>
                  )}
                  <div><strong>Contact :</strong> {reservationData.fullName} - {reservationData.email}</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-amber-800 text-sm">
                  📧 <strong>Information importante :</strong> Toutes les informations seront automatiquement envoyées à inscription@edjs.ma
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h5 className="text-green-800 font-semibold mb-2">
                  ✅ Après validation
                </h5>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Réception d'un email de confirmation</li>
                  <li>• Contact dans les plus brefs délais pour finaliser</li>
                  <li>• Réception des billets par email</li>
                  <li>• Option de téléchargement via QR Code sur le site EDJS</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="text-6xl text-green-500 mb-4">
                ✅
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Réservation envoyée avec succès !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre demande de réservation a été transmise à notre équipe. Vous recevrez un email de confirmation sous peu.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Prochaines étapes :</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Vérifiez votre boîte email (y compris les spams)</li>
                  <li>• Notre équipe vous contactera dans les plus brefs délais</li>
                  <li>• Vous recevrez vos billets par email après confirmation</li>
                  <li>• Possibilité de télécharger vos billets via QR Code sur edjs.art</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/spectacles')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                ← Retour aux spectacles
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
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
                {currentStep < 3 ? (
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
