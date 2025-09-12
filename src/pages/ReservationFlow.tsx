import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin, Building2, User, UserCheck } from 'lucide-react';
import { getUserTypeSessions } from '@/data/sessions';
import { supabase } from '@/integrations/supabase/client';
import { sendConfirmationEmail, checkEmailExists, ReservationEmailData } from '@/services/emailService';
import { ReservationConfirmationDialog } from '@/components/ReservationConfirmationDialog';

const ReservationFlow = () => {
  const { spectacleId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<string>('');
  const [isGuest, setIsGuest] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionCapacity, setSessionCapacity] = useState<{available: number, total: number} | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketCount: 1,
    childrenCount: 0,
    accompaniersCount: 0,
    specialRequests: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    rib: '',
    whatsapp: ''
  });

  const spectacleData = {
    'le-petit-prince': { title: 'Le Petit Prince', description: 'Une aventure poétique à travers les étoiles' },
    'le-petit-prince-ar': { title: 'Le Petit Prince (Arabic)', description: 'مغامرة شاعرية عبر النجوم' },
    'tara-sur-la-lune': { title: 'Tara sur la Lune', description: 'Une aventure spatiale extraordinaire' },
    'estevanico': { title: 'Estevanico', description: 'Une découverte historique passionnante' },
    'charlotte': { title: 'Charlotte', description: 'Une histoire d\'amitié touchante' },
    'alice-chez-les-merveilles': { title: 'Alice chez les Merveilles', description: 'Un voyage fantastique au pays des merveilles' },
    'leau-la': { title: 'L\'Eau Là', description: 'Une aventure aquatique captivante' },
    'mirath-atfal': { title: 'Mirath Atfal', description: 'Un héritage culturel pour les enfants' },
    'simple-comme-bonjour': { title: 'Simple Comme Bonjour', description: 'Une comédie pleine de surprises' },
    'flash': { title: 'Flash', description: 'Une aventure électrisante' },
    'antigone': { title: 'Antigone', description: 'Un drame classique revisité' }
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
          if (role === 'private_school' || role === 'private_school_teacher') {
            mappedUserType = 'scolaire-privee';
          } else if (role === 'public_school' || role === 'public_school_teacher') {
            mappedUserType = 'scolaire-publique';
          } else if (role === 'association' || role === 'association_member') {
            mappedUserType = 'association';
          } else {
            mappedUserType = 'particulier';
          }
        } else {
          mappedUserType = 'particulier';
        }
      }
      
      setUserType(mappedUserType);
      console.log('Auto-detected user type for logged user:', mappedUserType);
      
      // If session is pre-selected, go to form, otherwise go to session selection
      if (sessionParam) {
        setStep(3);
      } else {
        setStep(2);
      }
    }

    // For guest users, set default user type to particulier
    if (!user && !userType && !userTypeParam) {
      setUserType('particulier');
      setIsGuest(true);
      console.log('Set default user type for guest: particulier');
    }
  }, [user, spectacle, navigate, searchParams, selectedSession, userType]);

  const checkSessionCapacity = async (sessionId: string) => {
    try {
      // Get session info from sessions.ts data
      const sessions = getAvailableSessions();
      const sessionInfo = sessions.find(s => s.id === sessionId);
      
      if (!sessionInfo) {
        console.error('Session not found:', sessionId);
        setSessionCapacity(null);
        return;
      }

      // Count confirmed and paid bookings from database
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('number_of_tickets, status')
        .eq('session_frontend_id', sessionId)
        .in('status', ['confirmed', 'awaiting_verification']);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        // Use session capacity without bookings data as fallback
        setSessionCapacity({ 
          available: sessionInfo.capacity, 
          total: sessionInfo.capacity 
        });
        return;
      }

      // Calculate total booked tickets
      const totalBooked = bookingsData?.reduce((sum, booking) => {
        return sum + (booking.number_of_tickets || 0);
      }, 0) || 0;

      // Calculate available capacity
      const available = Math.max(0, sessionInfo.capacity - totalBooked);
      
      console.log('Session capacity check:', {
        sessionId,
        totalCapacity: sessionInfo.capacity,
        totalBooked,
        available
      });
        
      setSessionCapacity({ 
        available, 
        total: sessionInfo.capacity 
      });
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
        // Use full available capacity (no artificial 10 ticket limit)
        if (numValue > sessionCapacity.available) {
          toast({
            title: 'Limite atteinte',
            description: `Vous ne pouvez réserver que ${sessionCapacity.available} tickets maximum pour cette séance.`,
            variant: 'destructive'
          });
          // Don't update the form data if limit exceeded
          return;
        }
        // Also prevent negative values
        if (numValue < 0) {
          return;
        }
      }
      
      // For professional users - validate children and accompaniers count
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
      
      // Prevent negative values for children and accompaniers
      if (numValue < 0) {
        return;
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

      // Save booking to database first
      let currentUserId = user?.id;
      
      // If user is not logged in, create a profile first
      if (!user && formData.email) {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: Math.random().toString(36).substring(2, 15), // Temporary password
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              organization: formData.firstName + ' ' + formData.lastName,
              role: userType
            }
          }
        });
        
        if (signUpError) {
          console.error('Error creating user:', signUpError);
          throw new Error('Erreur lors de la création du profil utilisateur');
        }
        
        currentUserId = newUser.user?.id;
      }

      if (!currentUserId) {
        throw new Error('Utilisateur non identifié');
      }

      // Use RPC to create booking and map frontend session ID to UUID
      const { data: booking, error: bookingError } = await supabase.rpc('create_booking_by_frontend_id' as any, {
        p_frontend_session_id: selectedSession,
        p_spectacle_id: spectacleId,
        p_booking_type: userType || 'particulier',
        p_number_of_tickets: ticketCount,
        p_first_name: formData.firstName || null,
        p_last_name: formData.lastName || null,
        p_email: formData.email || user?.email || null,
        p_phone: formData.phone || null,
        p_whatsapp: formData.whatsapp ? formData.phone : null,
        p_notes: `${formData.specialRequests || ''}\nActual Session: ${selectedSession} - ${session.date} ${session.time} - ${session.location}`.trim(),
        p_payment_method: selectedPaymentMethod,
        p_total_amount: totalAmount,
        p_payment_reference: reservationId
      });

      if (bookingError) {
        console.error('=== BOOKING ERROR DETAILS ===');
        console.error('Error code:', bookingError.code);
        console.error('Error message:', bookingError.message);
        console.error('Error details:', bookingError.details);
        console.error('Error hint:', bookingError.hint);
        console.error('Booking data attempted:', {
          session_frontend_id: selectedSession,
          spectacle_id: spectacleId,
          booking_type: userType || 'particulier',
          number_of_tickets: ticketCount,
          total_amount: totalAmount,
          payment_method: selectedPaymentMethod,
          payment_reference: reservationId
        });
        console.error('=== END ERROR DEBUG ===');
        
        if (bookingError.code === '23503') {
          throw new Error('Session non trouvée dans la base de données');
        } else if (bookingError.code === '23505') {
          throw new Error('Une réservation existe déjà pour cette session');
        } else {
          throw new Error(`Erreur lors de la création de la réservation: ${bookingError.message}`);
        }
      }

      console.log('=== BOOKING CREATION SUCCESS ===');
      console.log('Booking created successfully:', booking);
      console.log('Booking ID:', booking?.id);
      console.log('User ID used:', currentUserId);
      console.log('=== END BOOKING DEBUG ===');

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
        reservationId,
        paymentMethod: selectedPaymentMethod,
        userPhone: formData.phone
      };

      // Send confirmation emails
      const emailSent = await sendConfirmationEmail(emailData);
      
      if (!emailSent) {
        console.warn('Email confirmation failed, but continuing with reservation');
      }

      // Prepare confirmation dialog data
      const confirmationInfo = {
        reservationId,
        spectacleName: spectacle.title,
        sessionDate: session.date,
        sessionTime: session.time,
        location: session.location,
        ticketCount,
        totalAmount,
        paymentMethod: selectedPaymentMethod,
        userName: user?.user_metadata?.full_name || `${formData.firstName} ${formData.lastName}`,
        userEmail: user?.email || formData.email,
        userPhone: formData.phone
      };
      
      setConfirmationData(confirmationInfo);
      setShowConfirmationDialog(true);
      
      toast({
        title: "Réservation confirmée",
        description: `Votre réservation a été confirmée. ${emailSent ? 'Un email de confirmation vous a été envoyé.' : ''}`,
      });
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
    if (userTypeParam && userTypeParam !== 'null') {
      userTypeForSessions = userTypeParam;
    } else if (professionalTypeParam && professionalTypeParam !== 'null') {
      userTypeForSessions = professionalTypeParam;
    } else if (user && userType && userType !== 'null') {
      userTypeForSessions = userType;
    } else {
      // Default for guests and users without specific type
      userTypeForSessions = 'particulier';
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
        } else {
          userTypeForSessions = 'particulier'; // Default fallback
        }
      }
    }
    
    // For particulier users, show sessions from all cities (no city filtering)
    let sessions;
    if (userTypeForSessions === 'particulier') {
      sessions = getUserTypeSessions(spectacleId, userTypeForSessions);
    } else {
      // Get user's city from profile for professional users
      const userCity = user?.user_metadata?.city || user?.user_metadata?.location || 'rabat';
      sessions = getUserTypeSessions(spectacleId, userTypeForSessions, userCity);
    }
    
    console.log('Debug - Available sessions:', {
      spectacleId,
      userTypeForSessions,
      userTypeParam,
      professionalTypeParam,
      userType,
      isGuest,
      user: user ? 'logged' : 'guest',
      sessionsCount: sessions.length,
      sessions: sessions.map(s => ({ id: s.id, audienceType: s.audienceType, date: s.date, location: s.location }))
    });

    // Force console log for debugging
    if (sessions.length === 0) {
      console.error('❌ NO SESSIONS FOUND - Debug info:', {
        spectacleId,
        userTypeForSessions,
        allParams: { userTypeParam, professionalTypeParam, userType, isGuest }
      });
    } else {
      console.log('✅ Sessions found:', sessions.length);
    }
    
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
                      <div className="mt-4 text-xs text-gray-400">
                        Debug: spectacleId={spectacleId}, userType={userType}, user={user ? 'logged' : 'guest'}
                      </div>
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
                        <Label htmlFor="ticketCount">Nombre de tickets</Label>
                        <Input
                          id="ticketCount"
                          type="number"
                          min="1"
                          max={sessionCapacity?.available || 999}
                          value={formData.ticketCount || ''}
                          onChange={(e) => handleInputChange('ticketCount', parseInt(e.target.value) || 0)}
                          className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50"
                          placeholder="Nombre de tickets souhaités"
                        />
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

            {/* Step 1: Spectacle Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Sélectionnez votre spectacle</h3>
                  <p className="text-muted-foreground">Choisissez le spectacle que vous souhaitez réserver</p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Spectacle sélectionné</h3>
                  <p className="text-primary font-semibold">{spectacle?.title || 'Spectacle non trouvé'}</p>
                </div>
                
                <Button 
                  onClick={() => {
                    console.log('Moving to step 2 with spectacleId:', spectacleId);
                    setStep(2);
                  }} 
                  disabled={!spectacleId}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  Continuer
                </Button>
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
                          <span className="text-muted-foreground">Nombre de tickets:</span>
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

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Mode de paiement</h4>
                  <div className="grid gap-3">
                    <div className="border rounded-lg">
                      <label className="flex items-center space-x-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          className="w-4 h-4 text-primary"
                          checked={selectedPaymentMethod === 'card'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            💳
                          </div>
                          <div>
                            <div className="font-medium">Carte bancaire</div>
                            <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                          </div>
                        </div>
                      </label>
                      {selectedPaymentMethod === 'card' && (
                        <div className="px-4 pb-4 space-y-3 border-t bg-muted/20">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Numéro de carte</label>
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full p-2 border rounded"
                                value={formData.cardNumber}
                                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Nom sur la carte</label>
                              <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full p-2 border rounded"
                                value={formData.cardName}
                                onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Date d'expiration</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full p-2 border rounded"
                                value={formData.cardExpiry}
                                onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full p-2 border rounded"
                                value={formData.cardCvv}
                                onChange={(e) => setFormData({...formData, cardCvv: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="border rounded-lg">
                      <label className="flex items-center space-x-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          className="w-4 h-4 text-primary"
                          checked={selectedPaymentMethod === 'bank_transfer'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                            🏦
                          </div>
                          <div>
                            <div className="font-medium">Virement bancaire</div>
                            <div className="text-sm text-muted-foreground">Paiement par virement</div>
                          </div>
                        </div>
                      </label>
                      {selectedPaymentMethod === 'bank_transfer' && (
                        <div className="px-4 pb-4 border-t bg-muted/20">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Informations bancaires - EDJS</h4>
                            <div className="space-y-1 text-sm text-blue-700">
                              <p><strong>Bénéficiaire:</strong> École du Jeune Spectateur</p>
                              <p><strong>Banque:</strong> Attijariwafa Bank</p>
                              <p><strong>RIB:</strong> 007 780 0000271100000012 85</p>
                              <p><strong>IBAN:</strong> MA64 0077 8000 0027 1100 0000 1285</p>
                              <p><strong>SWIFT/BIC:</strong> BCMAMAMC</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Veuillez effectuer le virement avec ces informations et conserver votre reçu de virement.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border rounded-lg">
                      <label className="flex items-center space-x-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          className="w-4 h-4 text-primary"
                          checked={selectedPaymentMethod === 'cash'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                            💰
                          </div>
                          <div>
                            <div className="font-medium">Paiement en espèces</div>
                            <div className="text-sm text-muted-foreground">À régler sur place</div>
                          </div>
                        </div>
                      </label>
                      {selectedPaymentMethod === 'cash' && (
                        <div className="px-4 pb-4 border-t bg-muted/20">
                          <label className="block text-sm font-medium mb-1">WhatsApp pour confirmation</label>
                          <input
                            type="text"
                            placeholder="+212 6XX XXX XXX"
                            className="w-full p-2 border rounded mb-3"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const availableSessions = getAvailableSessions();
                              const selectedSessionData = availableSessions?.find(s => s.id === selectedSession);
                              const reservationDetails = `Bonjour EDJS,\n\nJe souhaite confirmer ma réservation:\n\n🎭 Spectacle: ${spectacle?.title || spectacleId}\n📅 Session: ${selectedSessionData?.date} à ${selectedSessionData?.time}\n📍 Lieu: ${selectedSessionData?.location}\n👥 Nombre de billets: ${formData.ticketCount}\n💰 Montant total: ${(formData.ticketCount || 0) * 80} DH\n\nNom: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\n\nMerci de confirmer ma réservation.`;
                              const whatsappUrl = `https://wa.me/212661234567?text=${encodeURIComponent(reservationDetails)}`;
                              window.open(whatsappUrl, '_blank');
                            }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                            disabled={!formData.whatsapp}
                          >
                            📱 Envoyer les détails via WhatsApp
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Cliquez pour envoyer automatiquement les détails de votre réservation via WhatsApp
                          </p>
                        </div>
                      )}
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
                    Retour
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="glow"
                    size="xl"
                    className="flex-1"
                  >
                    Confirmer le paiement
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Reservation Confirmation Dialog */}
      {showConfirmationDialog && confirmationData && (
        <ReservationConfirmationDialog
          isOpen={showConfirmationDialog}
          onClose={() => {
            setShowConfirmationDialog(false);
            navigate('/spectacles');
          }}
          reservationData={confirmationData}
        />
      )}
    </div>
  );
};

export default ReservationFlow;
