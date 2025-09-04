import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin, Phone, Mail, User, Building2 } from 'lucide-react';

const spectacleData = {
  'le-petit-prince': {
    title: 'Le Petit Prince',
    duration: '50 minutes',
    actors: '3 acteurs',
    ageMin: '7 ans et +',
    image: '/lovable-uploads/b82bf764-c505-4dd6-960c-99a6acf57b3e.png',
    description: 'Une aventure poétique à travers les étoiles, où l\'innocence rencontre la sagesse dans un voyage extraordinaire qui touche le cœur de tous les âges.',
    sessions: [
      { date: '2024-03-15', time: '10:00', type: 'Écoles publiques' },
      { date: '2024-03-16', time: '14:30', type: 'Écoles privées' },
      { date: '2024-03-17', time: '16:00', type: 'Particuliers' }
    ]
  },
  'tara-sur-la-lune': {
    title: 'Tara sur la Lune',
    duration: '45 minutes',
    actors: '4 acteurs',
    ageMin: '5 ans et +',
    image: '/lovable-uploads/b82bf764-c505-4dd6-960c-99a6acf57b3e.png',
    description: 'Une aventure spatiale extraordinaire avec Tara qui découvre les merveilles de l\'espace.',
    sessions: [
      { date: '2024-03-20', time: '10:00', type: 'Écoles publiques' },
      { date: '2024-03-21', time: '14:30', type: 'Écoles privées' }
    ]
  }
};

const ReservationAuth = () => {
  const { spectacleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState('');
  const [profileType, setProfileType] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Contact info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Organization info (for PRO)
    organizationName: '',
    organizationType: '',
    address: '',
    city: '',
    postalCode: '',
    
    // Booking details
    participantCount: 1,
    specialRequests: ''
  });

  const spectacle = spectacleData[spectacleId as keyof typeof spectacleData];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!spectacle) {
      navigate('/spectacles');
      return;
    }
    
    // Pre-fill user data
    setFormData(prev => ({
      ...prev,
      firstName: user.user_metadata?.first_name || '',
      lastName: user.user_metadata?.last_name || '',
      email: user.email || ''
    }));
  }, [user, spectacle, navigate]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Réservation envoyée",
        description: "Votre demande de réservation a été envoyée avec succès. Vous recevrez une confirmation par email.",
      });
      
      navigate('/spectacles');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre réservation.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!spectacle) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/8 via-primary/4 to-primary/12 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-primary-glow/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="backdrop-blur-xl bg-primary/8 border-primary/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/12 rounded-xl pointer-events-none" />
          
          <CardHeader className="text-center relative pb-8 pt-12">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/b82bf764-c505-4dd6-960c-99a6acf57b3e.png" 
                alt="L'École du Jeune Spectateur" 
                className="h-16 w-auto mx-auto drop-shadow-lg"
              />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary-glow bg-clip-text text-transparent">
              Réservation - {spectacle.title}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-3">
              {spectacle.description}
            </CardDescription>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-4" />
            
            {/* Progress indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step >= stepNum ? 'bg-primary' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="relative px-8 pb-8">
            {/* Step 1: Session Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Choisissez votre séance</h3>
                  <p className="text-muted-foreground">Sélectionnez la date et l'heure qui vous conviennent</p>
                </div>
                
                <div className="grid gap-4">
                  {spectacle.sessions.map((session, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedSession(`${session.date}-${session.time}`)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedSession === `${session.date}-${session.time}`
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{session.date}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {session.time}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {session.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!selectedSession}
                  variant="glow"
                  size="xl"
                  className="w-full mt-8"
                >
                  Continuer
                </Button>
              </div>
            )}

            {/* Step 2: Profile Type */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Type de profil</h3>
                  <p className="text-muted-foreground">Êtes-vous un particulier ou un professionnel ?</p>
                </div>
                
                <div className="grid gap-4">
                  <div
                    onClick={() => setProfileType('particulier')}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      profileType === 'particulier'
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <User className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-semibold text-lg">Particulier</div>
                        <div className="text-sm text-muted-foreground">
                          Réservation individuelle ou familiale
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setProfileType('professionnel')}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      profileType === 'professionnel'
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Building2 className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-semibold text-lg">Professionnel</div>
                        <div className="text-sm text-muted-foreground">
                          École, association, centre culturel
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => setStep(1)}
                    variant="outline"
                    size="xl"
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    disabled={!profileType}
                    variant="glow"
                    size="xl"
                    className="flex-1"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Information Form */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Vos informations</h3>
                  <p className="text-muted-foreground">Complétez les informations nécessaires pour votre réservation</p>
                </div>
                
                <div className="grid gap-4">
                  {/* Contact Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-foreground">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                      placeholder="+212 6 XX XX XX XX"
                    />
                  </div>

                  {/* Professional Information */}
                  {profileType === 'professionnel' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="organizationName" className="text-sm font-medium text-foreground">Nom de l'organisation</Label>
                        <Input
                          id="organizationName"
                          value={formData.organizationName}
                          onChange={(e) => handleInputChange('organizationName', e.target.value)}
                          className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                          placeholder="École, association, centre..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="organizationType" className="text-sm font-medium text-foreground">Type d'organisation</Label>
                        <Input
                          id="organizationType"
                          value={formData.organizationType}
                          onChange={(e) => handleInputChange('organizationType', e.target.value)}
                          className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                          placeholder="École publique, privée, association..."
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="participantCount" className="text-sm font-medium text-foreground">Nombre de participants</Label>
                    <Input
                      id="participantCount"
                      type="number"
                      min="1"
                      value={formData.participantCount}
                      onChange={(e) => handleInputChange('participantCount', parseInt(e.target.value) || 1)}
                      className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => setStep(2)}
                    variant="outline"
                    size="xl"
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={() => setStep(4)}
                    variant="glow"
                    size="xl"
                    className="flex-1"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Confirmation</h3>
                  <p className="text-muted-foreground">Vérifiez vos informations avant d'envoyer votre demande</p>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-4 text-primary">Récapitulatif de votre réservation</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spectacle:</span>
                      <span className="font-medium">{spectacle.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Séance:</span>
                      <span className="font-medium">{selectedSession}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{profileType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="font-medium">{formData.participantCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => setStep(3)}
                    variant="outline"
                    size="xl"
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    variant="glow"
                    size="xl"
                    className="flex-1"
                  >
                    {loading ? 'Envoi en cours...' : 'Confirmer la réservation'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReservationAuth;
