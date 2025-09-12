import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin, Building2, User, UserCheck } from 'lucide-react';
import { getUserTypeSessions } from '@/data/sessions';
import { supabase } from '@/integrations/supabase/client';
import { sendConfirmationEmail, checkEmailExists, ReservationEmailData } from '@/services/emailService';

const ReservationFlow = () => {
  const { spectacleId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(2);
  const [userType, setUserType] = useState<string>('');
  const [isGuest, setIsGuest] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionCapacity, setSessionCapacity] = useState<{available: number, total: number} | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organizationName: '',
    organizationType: '',
    participantCount: 1,
    childrenCount: 0,
    accompaniersCount: 0,
    ticketCount: 0,
    specialRequests: ''
  });

  const spectacleData = {
    'le-petit-prince': { title: 'Le Petit Prince', description: 'Une aventure poétique à travers les étoiles' },
    'tara-sur-la-lune': { title: 'Tara sur la Lune', description: 'Une aventure spatiale extraordinaire' },
    'estevanico': { title: 'Estevanico', description: 'Une découverte historique passionnante' },
    'charlotte': { title: 'Charlotte', description: 'Une histoire d\'amitié touchante' },
    'alice-chez-les-merveilles': { title: 'Alice chez les Merveilles', description: 'Un voyage fantastique au pays des merveilles' }
  };

  const spectacle = spectacleData[spectacleId as keyof typeof spectacleData];

  useEffect(() => {
    if (!spectacle) {
      navigate('/spectacles');
      return;
    }

    // Check if a specific session was selected from spectacle page
    const sessionParam = searchParams.get('session');
    const userTypeParam = searchParams.get('userType');
    
    if (sessionParam && !selectedSession) {
      setSelectedSession(sessionParam);
      setStep(3); // Skip session selection, go directly to form
      console.log('Pre-selected session from URL:', sessionParam);
    }

    // Handle user type from URL parameter or session storage for non-logged users
    if (!user && userTypeParam && !userType) {
      setUserType(userTypeParam);
      setStep(2); // Show session selection for non-logged users
    }

    // Pre-populate form data for logged-in users and skip organization type selection
    if (user && !userType) {
      setFormData(prev => ({
        ...prev,
        firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || '',
        lastName: user.user_metadata?.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        organizationName: user.user_metadata?.organization || '',
        organizationType: user.user_metadata?.role || ''
      }));
      
      // Use URL parameter user type if provided, otherwise auto-detect from profile
      let mappedUserType = '';
      if (userTypeParam) {
        mappedUserType = userTypeParam;
      } else {
        const role = user.user_metadata?.role;
        if (role) {
          // Map user roles to reservation types
          switch (role) {
            case 'private_school':
            case 'private_school_teacher':
              mappedUserType = 'scolaire-privee';
              break;
            case 'public_school':
            case 'public_school_teacher':
              mappedUserType = 'scolaire-publique';
              break;
            case 'association':
            case 'association_member':
              mappedUserType = 'association';
              break;
            case 'b2c':
            case 'b2c_user':
            case 'individual':
              mappedUserType = 'particulier';
              break;
            default:
              mappedUserType = role;
          }
        }
      }
      
      console.log('Setting userType:', mappedUserType);
      setUserType(mappedUserType);
      
      // If no specific session was selected, show session selection
      if (!sessionParam) {
        setStep(2);
      }
    }
  }, [user, spectacle, navigate, searchParams, selectedSession, userType]);

  const checkSessionCapacity = async (sessionId: string) => {
    try {
      // Get session info and count confirmed bookings
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('total_capacity, b2c_capacity')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;
      
      // Skip bookings check for now to avoid TypeScript issues
      const bookingsData: any[] = [];
      
      if (sessionData) {
        const isProfessional = ['scolaire-privee', 'scolaire-publique', 'association'].includes(userType);
        
        // Calculate current bookings
        let bookedProfessional = 0;
        let bookedParticulier = 0;
        
        (bookingsData || []).forEach((booking: any) => {
          if (['private_school', 'public_school', 'association', 'partner'].includes(booking.booking_type)) {
            bookedProfessional += booking.number_of_tickets || 0;
          } else {
            bookedParticulier += booking.number_of_tickets || 0;
          }
        });
        
        // Set capacity limits based on city (we'll use total_capacity as professional capacity)
        const professionalCapacity = sessionData.total_capacity;
        const particulierCapacity = sessionData.b2c_capacity;
        
        const available = isProfessional 
          ? Math.max(0, professionalCapacity - bookedProfessional)
          : Math.max(0, particulierCapacity - bookedParticulier);
        const total = isProfessional ? professionalCapacity : particulierCapacity;
          
        setSessionCapacity({ available, total });
      }
    } catch (error) {
      console.error('Error checking session capacity:', error);
      setSessionCapacity(null);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    // Validate against capacity limits without showing exact numbers
    if (sessionCapacity && (field === 'childrenCount' || field === 'accompaniersCount' || field === 'ticketCount')) {
      const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
      
      if (field === 'ticketCount') {
        // For particuliers - limit to available capacity or 10, whichever is lower
        const maxAllowed = Math.min(10, sessionCapacity.available);
        if (numValue > maxAllowed) {
          toast({
            title: 'Limite atteinte',
            description: `Vous ne pouvez réserver que ${maxAllowed} billets maximum pour cette séance.`,
            variant: 'destructive'
          });
          return;
        }
      } else if (field === 'childrenCount' || field === 'accompaniersCount') {
        // For professionals - check total participants + accompaniers
        const currentChildren = field === 'childrenCount' ? numValue : (formData.childrenCount || 0);
        const currentAccompaniers = field === 'accompaniersCount' ? numValue : (formData.accompaniersCount || 0);
        const totalParticipants = currentChildren + currentAccompaniers;
        
        if (totalParticipants > sessionCapacity.available) {
          toast({
            title: 'Capacité insuffisante',
            description: 'Le nombre total de participants dépasse la capacité disponible pour cette séance.',
            variant: 'destructive'
          });
          return;
        }
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Check for duplicate email if user is not logged in
      if (!user && formData.email) {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          toast({
            title: "Email déjà utilisé",
            description: "Cet email est déjà enregistré. Veuillez vous connecter ou utiliser un autre email.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      // Get session details for email
      const sessions = getAvailableSessions();
      const session = sessions.find(s => s.id === selectedSession);
      
      if (!session) {
        throw new Error('Session non trouvée');
      }

      // Generate reservation ID
      const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Calculate total amount and ticket count
      const isProfessional = ['scolaire-privee', 'scolaire-publique', 'association'].includes(userType);
      const ticketCount = isProfessional 
        ? (formData.childrenCount || 0) + (formData.accompaniersCount || 0)
        : (formData.ticketCount || 0);
      const totalAmount = isProfessional 
        ? ticketCount * (userType === 'scolaire-privee' ? 100 : 80)
        : ticketCount * 80;

      // Prepare email data
      const emailData: ReservationEmailData = {
        userEmail: user?.email || formData.email,
        userName: user?.user_metadata?.full_name || `${formData.firstName} ${formData.lastName}`,
        spectacleName: spectacle.title,
        sessionDate: session.date,
        sessionTime: session.time,
        location: session.location,
        ticketCount,
        totalAmount,
        reservationId
      };

      // Send confirmation emails
      const emailSent = await sendConfirmationEmail(emailData);
      
      if (!emailSent) {
        console.warn('Email confirmation failed, but continuing with reservation');
      }

      toast({
        title: "Réservation confirmée",
        description: `Votre réservation a été confirmée. ${emailSent ? 'Un email de confirmation vous a été envoyé.' : ''}`,
      });
      
      navigate('/spectacles');
    } catch (error) {
      console.error('Reservation error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre réservation.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSessions = () => {
    if (!spectacleId) return [];
    
    // Check URL parameter first, then user profile
    const userTypeParam = searchParams.get('userType');
    const professionalTypeParam = searchParams.get('professionalType');
    let userTypeForSessions = '';
    
    // Priority: URL parameter > user profile > guest default
    if (userTypeParam) {
      userTypeForSessions = userTypeParam;
    } else if (professionalTypeParam) {
      userTypeForSessions = professionalTypeParam;
    } else if (user && userType) {
      userTypeForSessions = userType;
    } else if (isGuest) {
      userTypeForSessions = 'particulier'; // Default for guests
    }
    
    // Map professional types to correct session filtering
    if (userTypeForSessions === 'professional') {
      if (professionalTypeParam) {
        userTypeForSessions = professionalTypeParam;
      } else {
        // Try to get from user metadata
        const role = user?.user_metadata?.role;
        if (role === 'private_school' || role === 'private_school_teacher') {
          userTypeForSessions = 'scolaire-privee';
        } else if (role === 'public_school' || role === 'public_school_teacher') {
          userTypeForSessions = 'scolaire-publique';
        } else if (role === 'association' || role === 'association_member') {
          userTypeForSessions = 'association';
        }
      }
    }
    
    // Get user's city from profile - ensure we always pass a city for filtering
    const userCity = user?.user_metadata?.city || user?.user_metadata?.location || 'rabat'; // Default to rabat if no city
    
    const sessions = getUserTypeSessions(spectacleId, userTypeForSessions, userCity);
    console.log('Debug - Available sessions:', {
      spectacleId,
      userTypeForSessions,
      userTypeParam,
      professionalTypeParam,
      userType,
      userCity,
      sessionsCount: sessions.length,
      sessions: sessions.map(s => ({ id: s.id, audienceType: s.audienceType, date: s.date, location: s.location }))
    });
    
    return sessions;
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
              {[2, 3, 4].map((stepNum) => (
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


            {/* Step 2: Session Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Choisissez votre séance</h3>
                  <p className="text-muted-foreground">Sessions disponibles pour votre profil</p>
                </div>
                
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {getAvailableSessions().length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucune session disponible pour ce spectacle.</p>
                      <p className="text-sm text-muted-foreground mt-2">Veuillez contacter l'administration pour plus d'informations.</p>
                    </div>
                  ) : (
                    getAvailableSessions().map((session) => (
                    <div
                      key={session.id}
                      onClick={() => {
                        setSelectedSession(session.id);
                        checkSessionCapacity(session.id);
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedSession === session.id
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{new Date(session.date).toLocaleDateString('fr-FR')}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {session.time}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            {session.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => navigate(-1)}
                    variant="outline"
                    size="xl"
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={() => {
                      if (selectedSession && !sessionCapacity) {
                        checkSessionCapacity(selectedSession);
                      }
                      setStep(3);
                    }}
                    disabled={!selectedSession}
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {user ? 'Informations complémentaires' : 'Vos informations'}
                  </h3>
                  <p className="text-muted-foreground">
                    {user ? 'Complétez les informations pour votre réservation' : 'Complétez les informations pour votre réservation'}
                  </p>
                </div>

                {/* Selected Session Display */}
                {selectedSession && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">Séance sélectionnée</span>
                    </div>
                    <div className="text-sm">
                      {(() => {
                        const sessions = getAvailableSessions();
                        const session = sessions.find(s => s.id === selectedSession);
                        if (session) {
                          return (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{new Date(session.date).toLocaleDateString('fr-FR')}</div>
                                <div className="text-muted-foreground flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {session.time}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-primary font-medium">
                                  <MapPin className="h-4 w-4 inline mr-1" />
                                  {session.location}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return <p>Session: {selectedSession}</p>;
                      })()}
                    </div>
                  </div>
                )}

                
                <div className="grid gap-4">
                  {!user && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                      placeholder="+212 6 XX XX XX XX"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {(userType === 'scolaire-privee' || userType === 'scolaire-publique' || userType === 'association') ? (
                      // Professional users - show children and accompaniers fields
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="childrenCount">Nombre d'enfants</Label>
                          <Input
                            id="childrenCount"
                            type="number"
                            min="1"
                            max={sessionCapacity ? Math.min(500, sessionCapacity.available) : 500}
                            value={formData.childrenCount || ''}
                            onChange={(e) => handleInputChange('childrenCount', parseInt(e.target.value) || 0)}
                            className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                            placeholder="Nombre d'enfants participants"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accompaniersCount">Nombre d'accompagnateurs</Label>
                          <Input
                            id="accompaniersCount"
                            type="number"
                            min="0"
                            max={Math.ceil((formData.childrenCount || 0) / 30) * 3}
                            value={formData.accompaniersCount || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              const maxAllowed = Math.ceil((formData.childrenCount || 0) / 30) * 3;
                              if (value <= maxAllowed) {
                                handleInputChange('accompaniersCount', value);
                              }
                            }}
                            className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                            placeholder="Nombre d'accompagnateurs adultes"
                          />
                          <p className="text-sm text-muted-foreground italic">
                            Maximum autorisé: {Math.ceil((formData.childrenCount || 0) / 30) * 3} accompagnateurs 
                            (3 par groupe de 30 enfants)
                          </p>
                        </div>
                      </>
                    ) : (
                      // Individual users (particulier) - show only ticket count
                      <div className="space-y-2">
                        <Label htmlFor="ticketCount">Nombre de billets</Label>
                        <Input
                          id="ticketCount"
                          type="number"
                          min="1"
                          max={sessionCapacity ? Math.min(10, sessionCapacity.available) : 10}
                          value={formData.ticketCount || ''}
                          onChange={(e) => handleInputChange('ticketCount', parseInt(e.target.value) || 0)}
                          className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                          placeholder="Nombre de billets souhaités"
                        />
                        <p className="text-sm text-muted-foreground italic">
                          Maximum {sessionCapacity ? Math.min(10, sessionCapacity.available) : 10} billets pour cette séance
                        </p>
                      </div>
                    )}
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
                    onClick={() => {
                      // Final validation before proceeding
                      const isProfessional = ['scolaire-privee', 'scolaire-publique', 'association'].includes(userType);
                      const totalRequested = isProfessional 
                        ? (formData.childrenCount || 0) + (formData.accompaniersCount || 0)
                        : (formData.ticketCount || 0);
                      
                      if (totalRequested === 0) {
                        toast({
                          title: 'Informations manquantes',
                          description: 'Veuillez indiquer le nombre de participants.',
                          variant: 'destructive'
                        });
                        return;
                      }
                      
                      if (sessionCapacity && totalRequested > sessionCapacity.available) {
                        toast({
                          title: 'Capacité insuffisante',
                          description: 'Le nombre de participants dépasse la capacité disponible.',
                          variant: 'destructive'
                        });
                        return;
                      }
                      
                      setStep(4);
                    }}
                    variant="glow"
                    size="xl"
                    className="flex-1"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Paiement</h3>
                  <p className="text-muted-foreground">Choisissez votre mode de paiement</p>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mb-6">
                  <h4 className="font-semibold mb-4 text-primary">Récapitulatif de votre réservation</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spectacle:</span>
                      <span className="font-medium">{spectacle.title}</span>
                    </div>
                    {(userType === 'scolaire-privee' || userType === 'scolaire-publique' || userType === 'association') ? (
                      // Professional users - show children and accompaniers breakdown
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Enfants:</span>
                          <span className="font-medium">{formData.childrenCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accompagnateurs:</span>
                          <span className="font-medium">{formData.accompaniersCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total participants:</span>
                          <span className="font-medium">{(formData.childrenCount || 0) + (formData.accompaniersCount || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prix unitaire:</span>
                          <span className="font-medium">{userType === 'scolaire-privee' ? '100' : '80'} MAD</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span className="text-primary">{((formData.childrenCount || 0) + (formData.accompaniersCount || 0)) * (userType === 'scolaire-privee' ? 100 : 80)} MAD</span>
                        </div>
                      </>
                    ) : (
                      // Individual users - show ticket count and total
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nombre de billets:</span>
                          <span className="font-medium">{formData.ticketCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prix unitaire:</span>
                          <span className="font-medium">80 MAD</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span className="text-primary">{(formData.ticketCount || 0) * 80} MAD</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={() => setStep(3)}
                    variant="outline"
                    size="xl"
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={() => {
                      // Save reservation data and redirect to payment method selection
                      const reservationData = {
                        ...formData,
                        spectacle: spectacle.title,
                        spectacleId,
                        userType,
                        selectedSession,
                        totalAmount: (userType === 'scolaire-privee' || userType === 'scolaire-publique' || userType === 'association') 
                          ? ((formData.childrenCount || 0) + (formData.accompaniersCount || 0)) * (userType === 'scolaire-privee' ? 100 : 80)
                          : (formData.ticketCount || 0) * 80
                      };
                      sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
                      navigate('/payment-method-selection');
                    }}
                    variant="glow"
                    size="xl"
                    className="flex-1"
                  >
                    Confirmer la réservation
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

export default ReservationFlow;
