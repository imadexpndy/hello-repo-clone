import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, User, UserPlus, LogIn, Star, Shield, Clock, Gift } from 'lucide-react';
import { getUserTypeSessions } from '@/data/sessions';

interface GuestReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  spectacleId: string;
  spectacleName: string;
  userType?: string;
}

export default function GuestReservationModal({ 
  isOpen, 
  onClose, 
  spectacleId, 
  spectacleName,
  userType 
}: GuestReservationModalProps) {
  const [step, setStep] = useState<'options' | 'guest-form'>('options');
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    email: '',
    participants: 1,
    numberOfTickets: 1,
    organizationType: 'individual',
    organizationName: '',
    numberOfChildren: 0,
    numberOfAccompanists: 0,
    notes: '',
    selectedSession: ''
  });
  const [availableSessions, setAvailableSessions] = useState<any[]>([]);

  if (!isOpen) return null;

  // Check if guest reservation should be available based on user type
  const isParticulier = userType === 'particulier' || !userType;
  const isProfessional = userType === 'professional';

  const handleLogin = () => {
    window.location.href = `/auth?return_url=${encodeURIComponent(`/reservation/${spectacleId}`)}`;
  };

  const handleSignup = () => {
    window.location.href = `/auth?mode=signup&return_url=${encodeURIComponent(`/reservation/${spectacleId}`)}`;
  };

  const handleGuestReservation = () => {
    // Load available sessions for particulier users
    const sessions = getUserTypeSessions(spectacleId, 'particulier', undefined);
    setAvailableSessions(sessions);
    setStep('guest-form');
  };

  const handleSubmitGuestReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to payment for guest particulier reservations
    const reservationData = {
      spectacleId,
      spectacleName,
      type: 'guest_particulier',
      ...guestForm,
      createdAt: new Date().toISOString()
    };

    // Store reservation data in sessionStorage for payment page
    sessionStorage.setItem('guestReservationData', JSON.stringify(reservationData));
    
    // Redirect to payment page
    window.location.href = `/payment?type=guest&spectacle=${spectacleId}&participants=${guestForm.participants}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Réserver - {spectacleName}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {step === 'options' && (
          <div className="p-6 space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Comment souhaitez-vous réserver ?</h3>
              <p className="text-gray-600">Choisissez l'option qui vous convient le mieux</p>
            </div>

            <div className={`grid ${isParticulier ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              {/* Login Option */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleLogin}>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="bg-blue-100 p-3 rounded-full mx-auto w-fit">
                      <LogIn className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Se connecter</h4>
                      <p className="text-gray-600 text-sm">J'ai déjà un compte</p>
                    </div>
                    <Button 
                      onClick={handleLogin}
                      className="w-full"
                    >
                      Se connecter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Reservation Option - Only for Particuliers */}
              {isParticulier && (
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGuestReservation}>
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="bg-green-100 p-3 rounded-full mx-auto w-fit">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Réserver en tant qu'invité</h4>
                        <p className="text-gray-600 text-sm">Particulier uniquement - Paiement par carte</p>
                      </div>
                      <Button variant="outline" className="w-full">Continuer</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Create Account Option */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleSignup}>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="bg-purple-100 p-3 rounded-full mx-auto w-fit">
                      <UserPlus className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Créer un compte</h4>
                      <p className="text-gray-600 text-sm">Profitez de tous les avantages</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const returnUrl = encodeURIComponent(window.location.href);
                        window.location.href = `/auth?mode=register&return_url=${returnUrl}`;
                      }}
                    >
                      S'inscrire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Benefits of Creating Account */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Star className="h-5 w-5 mr-2" />
                  Pourquoi créer un compte ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Gestion simplifiée</p>
                      <p className="text-gray-600">Suivez toutes vos réservations en un seul endroit</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Réservation express</p>
                      <p className="text-gray-600">Informations pré-remplies pour gagner du temps</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Gift className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Offres exclusives</p>
                      <p className="text-gray-600">Accès prioritaire aux nouveaux spectacles</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Historique complet</p>
                      <p className="text-gray-600">Retrouvez facilement vos anciennes réservations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'guest-form' && (
          <form onSubmit={handleSubmitGuestReservation} className="p-6 space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Réservation invité</h3>
              <p className="text-gray-600">Remplissez vos informations pour finaliser la réservation</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom complet *</label>
                <Input
                  required
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({...guestForm, name: e.target.value})}
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone *</label>
                <Input
                  required
                  type="tel"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})}
                  placeholder="+212 6 XX XX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                required
                type="email"
                value={guestForm.email}
                onChange={(e) => setGuestForm({...guestForm, email: e.target.value})}
                placeholder="votre@email.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de réservation</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value="individual"
                  disabled
                >
                  <option value="individual">Particulier</option>
                </select>
              </div>
              <div>
                <Label htmlFor="numberOfTickets">Number of tickets *</Label>
                <Input
                  id="numberOfTickets"
                  required
                  type="number"
                  min="1"
                  max="10"
                  value={guestForm.numberOfTickets}
                  onChange={(e) => setGuestForm({...guestForm, numberOfTickets: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>


            {/* Session Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Séance souhaitée *</label>
              <select
                required
                className="w-full p-2 border rounded-md"
                value={guestForm.selectedSession}
                onChange={(e) => setGuestForm({...guestForm, selectedSession: e.target.value})}
              >
                <option value="">Choisir une séance</option>
                {availableSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.date} à {session.time} - {session.venue} ({session.city})
                  </option>
                ))}
              </select>
              {availableSessions.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">Aucune séance disponible pour les particuliers</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes ou demandes spéciales</label>
              <Textarea
                rows={3}
                value={guestForm.notes}
                onChange={(e) => setGuestForm({...guestForm, notes: e.target.value})}
                placeholder="Informations supplémentaires, besoins spéciaux, etc."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('options')}
                className="flex-1"
              >
                Retour
              </Button>
              <Button type="submit" className="flex-1">
                Procéder au paiement
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              En soumettant cette demande, vous acceptez que nous vous contactions pour confirmer votre réservation.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
