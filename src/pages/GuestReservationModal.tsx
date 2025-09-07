import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, User, UserPlus, LogIn, Star, Shield, Clock, Gift } from 'lucide-react';

interface GuestReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  spectacleId: string;
  spectacleName: string;
}

export default function GuestReservationModal({ 
  isOpen, 
  onClose, 
  spectacleId, 
  spectacleName 
}: GuestReservationModalProps) {
  const [step, setStep] = useState<'options' | 'guest-form'>('options');
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    email: '',
    participants: 1,
    organizationType: 'individual',
    organizationName: '',
    numberOfChildren: 0,
    numberOfAccompanists: 0,
    notes: ''
  });

  if (!isOpen) return null;

  const handleLogin = () => {
    window.location.href = `/auth?return_url=${encodeURIComponent(`/reservation/${spectacleId}`)}`;
  };

  const handleSignup = () => {
    window.location.href = `/auth?mode=signup&return_url=${encodeURIComponent(`/reservation/${spectacleId}`)}`;
  };

  const handleGuestReservation = () => {
    setStep('guest-form');
  };

  const handleSubmitGuestReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    const reservationData = {
      spectacleId,
      spectacleName,
      type: 'guest',
      ...guestForm,
      createdAt: new Date().toISOString()
    };

    console.log('Guest reservation submitted:', reservationData);
    
    // For now, just show success and close
    alert('Votre demande de réservation a été envoyée avec succès ! Nous vous contacterons bientôt.');
    onClose();
    setStep('options');
    setGuestForm({
      name: '',
      phone: '',
      email: '',
      participants: 1,
      organizationType: 'individual',
      organizationName: '',
      numberOfChildren: 0,
      numberOfAccompanists: 0,
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

            <div className="grid gap-4">
              {/* Login Option */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleLogin}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <LogIn className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">Se connecter</h4>
                      <p className="text-gray-600">J'ai déjà un compte</p>
                    </div>
                    <Button>Connexion</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Reservation Option */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGuestReservation}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">Réserver en tant qu'invité</h4>
                      <p className="text-gray-600">Réservation rapide sans compte</p>
                    </div>
                    <Button variant="outline">Continuer</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Create Account Option */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleSignup}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <UserPlus className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">Créer un compte</h4>
                      <p className="text-gray-600">Profitez de tous les avantages</p>
                    </div>
                    <Button variant="outline">S'inscrire</Button>
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
                  value={guestForm.organizationType}
                  onChange={(e) => setGuestForm({...guestForm, organizationType: e.target.value})}
                >
                  <option value="individual">Particulier</option>
                  <option value="school">École</option>
                  <option value="association">Association</option>
                  <option value="company">Entreprise</option>
                </select>
              </div>
              {guestForm.organizationType === 'individual' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de participants *</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={guestForm.participants}
                    onChange={(e) => setGuestForm({...guestForm, participants: parseInt(e.target.value)})}
                  />
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* Professional reservation fields */}
            {guestForm.organizationType !== 'individual' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800">Réservation professionnelle</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre d'enfants *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      value={guestForm.numberOfChildren}
                      onChange={(e) => setGuestForm({...guestForm, numberOfChildren: parseInt(e.target.value)})}
                      placeholder="Nombre d'enfants"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre d'accompagnateurs *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      value={guestForm.numberOfAccompanists}
                      onChange={(e) => setGuestForm({...guestForm, numberOfAccompanists: parseInt(e.target.value)})}
                      placeholder="Nombre d'accompagnateurs"
                    />
                  </div>
                </div>
                <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-md">
                  <strong>Note importante :</strong> Merci de ne pas dépasser 3 accompagnateurs par groupe de 30 enfants.
                </div>
              </div>
            )}

            {guestForm.organizationType !== 'individual' && (
              <div>
                <label className="block text-sm font-medium mb-2">Nom de l'organisation</label>
                <Input
                  value={guestForm.organizationName}
                  onChange={(e) => setGuestForm({...guestForm, organizationName: e.target.value})}
                  placeholder="Nom de votre école/association/entreprise"
                />
              </div>
            )}

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
                Envoyer la demande
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
