import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import { generateDevisPDF } from '@/utils/devisGenerator';
import type { DevisData } from '@/utils/devisGenerator';
import { Calendar, Clock, Users, MapPin, Building2, User, UserCheck } from 'lucide-react';
import { getUserTypeSessions } from '@/data/sessions';
import { supabase } from '@/integrations/supabase/client';
import { sendConfirmationEmail, checkEmailExists, ReservationEmailData } from '@/services/emailService';
import { ReservationConfirmationDialog } from '@/components/ReservationConfirmationDialog';
import { UserTypeDiagnostic } from '@/components/UserTypeDiagnostic';

const ReservationFlow = () => {
  const { spectacleId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<string>('');
  const [isGuest, setIsGuest] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionCapacity, setSessionCapacity] = useState<{available: number, total: number} | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [devisGenerated, setDevisGenerated] = useState(false);
  const [devisUrl, setDevisUrl] = useState<string | null>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    specialRequests: '',
    ticketCount: 1,
    childrenCount: 0,
    accompaniersCount: 0,
    teachersCount: 0,
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  useEffect(() => {
    console.log('=== FORM PRE-POPULATION DEBUG ===');
    console.log('User:', user);
    console.log('Profile:', profile);
    console.log('Profile user_type:', profile?.user_type);
    console.log('Profile professional_type:', profile?.professional_type);
    console.log('Profile role:', profile?.role);
    
    if (user && profile) {
      console.log('Profile name:', profile.name);
      console.log('Profile phone:', profile.phone);
      console.log('User metadata:', user.user_metadata);
      
      // Split the name field into firstName and lastName
      const fullName = profile.name || user.user_metadata?.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const newFormData = {
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: profile.phone || user.user_metadata?.phone || ''
      };
      
      console.log('Full name from profile:', fullName);
      console.log('Split into firstName:', firstName, 'lastName:', lastName);
      console.log('New form data to set:', newFormData);
      
      setFormData(prev => ({
        ...prev,
        ...newFormData
      }));
    }
  }, [user, profile]);

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
      } else if (profile?.user_type === 'scolaire-privee') {
        // Direct override for scolaire-privee users
        mappedUserType = 'scolaire-privee';
        console.log('🎯 DIRECT OVERRIDE: scolaire-privee -> scolaire-privee');
      } else {
        // Use profile data for user type detection
        console.log('=== USER TYPE DETECTION DEBUG ===');
        console.log('Profile user_type:', profile?.user_type);
        console.log('Profile professional_type:', profile?.professional_type);
        console.log('Profile role:', profile?.role);
        console.log('Profile admin_role:', (profile as any)?.admin_role);
        console.log('Full profile object:', profile);
        
        if (profile?.user_type) {
          console.log('Using profile.user_type:', profile.user_type);
          // Use the user_type from profile directly
          if (profile.user_type === "scolaire-publique") {
            mappedUserType = 'scolaire-publique';
            console.log('✅ Mapped to scolaire-publique from user_type');
          } else if (profile.user_type === 'association') {
            mappedUserType = 'association';
            console.log('✅ Mapped to association from user_type');
          } else {
            mappedUserType = 'particulier';
            console.log('✅ Mapped to particulier from user_type (default)');
          }
        } else if (profile?.professional_type) {
          console.log('Using profile.professional_type:', profile.professional_type);
          // Fallback to professional_type
          mappedUserType = profile.professional_type;
          console.log('✅ Mapped to', mappedUserType, 'from professional_type');
        } else if (profile?.role) {
          console.log('Using profile.role:', profile.role);
          // Fallback to role-based detection
          if (profile.role === 'scolaire-privee') {
            mappedUserType = 'scolaire-privee';
            console.log('✅ Mapped to scolaire-privee from role');
          } else if (profile.role === 'scolaire-publique') {
            mappedUserType = 'scolaire-publique';
            console.log('✅ Mapped to scolaire-publique from role');
          } else if (profile.role === 'association') {
            mappedUserType = 'association';
            console.log('✅ Mapped to association from role');
          } else {
            mappedUserType = 'particulier';
            console.log('✅ Mapped to particulier from role (default)');
          }
        } else {
          mappedUserType = 'particulier';
          console.log('❌ No user type found, defaulting to particulier');
        }
        
        console.log('Final mappedUserType:', mappedUserType);
      }
      
      setUserType(mappedUserType);
      console.log('Auto-detected user type for logged user:', mappedUserType);
      console.log('🔧 Setting userType state to:', mappedUserType);
      
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
  }, [user, profile, spectacle, navigate, searchParams, selectedSession]);

  const checkSessionCapacity = async (sessionId: string) => {
    try {
      const sessions = getUserTypeSessions(spectacleId || '', userType || 'particulier', profile?.professional_type);
      const sessionInfo = sessions.find(s => s.id === sessionId);
      
      if (!sessionInfo) {
        console.error('Session not found:', sessionId);
        setSessionCapacity(null);
        return;
      }

      // Count confirmed and paid bookings from database
      let bookingsData: any[] | null = null;
      let bookingsError: any = null;
      
      try {
        // Simplified query to avoid TypeScript inference issues
        const { data, error } = await (supabase as any)
          .from('bookings')
          .select('number_of_tickets, status')
          .eq('session_frontend_id', sessionId)
          .in('status', ['confirmed', 'awaiting_verification']);
        
        bookingsData = data;
        bookingsError = error;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        bookingsError = error;
      }

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
        const maxTickets = 10;
        if (numValue > sessionCapacity.available) {
          toast.error(`Limite atteinte - Vous ne pouvez pas réserver plus de ${maxTickets} billets pour cette session.`);
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
        toast.error(`Capacité insuffisante - Il ne reste que ${sessionCapacity.available} places disponibles pour cette session.`);
        return;
      }
      
      // Prevent negative values for children and accompaniers
      if (numValue < 0) {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDevis = async (bookingId: string, sessionData: any) => {
    const devisNumber = `DEV-${Date.now()}`;
    const dateGenerated = new Date().toLocaleDateString('fr-FR');
    
    const studentsNum = formData.childrenCount || 0;
    const teachersNum = formData.teachersCount || 0;
    const accompagnateursNum = formData.accompaniersCount || 0;
    
    const pricePerStudent = 100; // Private school price
    const pricePerTeacher = 0; // Teachers usually free
    const pricePerAccompagnateur = pricePerStudent;
    
    const totalAmount = (studentsNum * pricePerStudent) + 
                       (teachersNum * pricePerTeacher) + 
                       (accompagnateursNum * pricePerAccompagnateur);

    const devisData: DevisData = {
      schoolName: profile?.name || 'École Privée',
      contactName: profile?.full_name || user?.email || formData.firstName + ' ' + formData.lastName,
      contactEmail: user?.email || formData.email,
      contactPhone: profile?.phone || formData.phone,
      schoolAddress: profile?.address || '',
      
      spectacleName: spectacle?.title || '',
      spectacleDate: sessionData.date,
      spectacleTime: sessionData.time,
      venue: sessionData.location,
      venueAddress: sessionData.city || '',
      
      studentsCount: studentsNum,
      teachersCount: teachersNum,
      accompagnateurCount: accompagnateursNum,
      
      pricePerStudent,
      pricePerTeacher,
      pricePerAccompagnateur,
      totalAmount,
      
      bookingId,
      devisNumber,
      dateGenerated
    };

    const pdfBytes = generateDevisPDF(devisData);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return { url, devisData };
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Check if this is a private school user - if so, generate devis instead
      const isPrivateSchool = profile?.user_type === 'scolaire-privee' || userType === 'scolaire-privee';
      
      // Check for duplicate email if user is not logged in
      if (!user && formData.email) {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          toast.error("Email déjà utilisé - Cet email est déjà enregistré. Veuillez vous connecter ou utiliser un autre email.");
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
      const bookingResult = await supabase.rpc('create_booking_by_frontend_id' as any, {
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

      const booking = bookingResult.data;
      const bookingError = bookingResult.error;

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

      // For private school users, generate devis and update booking status
      if (isPrivateSchool && booking?.id) {
        try {
          const { url: devisUrl, devisData } = await generateDevis(booking.id, session);
          
          // Update booking status to pending (will be updated to devis_generated later)
          await supabase
            .from('bookings')
            .update({ 
              status: 'pending',
              teachers_count: formData.teachersCount || 0,
              accompagnateurs_count: formData.accompaniersCount || 0
            })
            .eq('id', booking.id);

          // Show devis success screen instead of regular confirmation
          setConfirmationData({
            reservationId,
            spectacleName: spectacle.title,
            sessionDate: session.date,
            sessionTime: session.time,
            location: session.location,
            ticketCount,
            totalAmount,
            paymentMethod: 'devis',
            userEmail: user?.email || formData.email,
            userName: user?.user_metadata?.full_name || `${formData.firstName} ${formData.lastName}`,
            userPhone: formData.phone,
            devisUrl,
            devisData,
            bookingId: booking.id,
            isPrivateSchool: true
          });
          
          setShowConfirmationDialog(true);
          setLoading(false);
          return;
        } catch (devisError) {
          console.error('Error generating devis:', devisError);
          toast.error("Erreur lors de la génération du devis - La réservation a été créée mais le devis n'a pas pu être généré. Contactez-nous.");
        }
      }

      // Regular flow for non-private school users
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
      
      toast.success("Réservation confirmée - Votre réservation a été enregistrée avec succès!");
      
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error("Erreur - Une erreur s'est produite lors de l'envoi de votre réservation.");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSessions = () => {
    console.log('=== SESSION FILTERING DEBUG ===');
    console.log('spectacleId:', spectacleId);
    console.log('userType state:', userType);
    console.log('isGuest:', isGuest);
    console.log('user:', user ? 'logged' : 'guest');
    console.log('profile in getAvailableSessions:', profile);
    console.log('profile?.user_type:', profile?.user_type);
    console.log('profile?.professional_type:', profile?.professional_type);
    console.log('profile?.role:', profile?.role);
    
    if (!spectacleId) return [];
    
    // Check URL parameter first, then user profile
    const userTypeParam = searchParams.get('userType');
    const professionalTypeParam = searchParams.get('professionalType');
    let userTypeForSessions = '';
    
    console.log('URL params - userType:', userTypeParam, 'professionalType:', professionalTypeParam);
    
    // Priority: URL parameter > user profile > guest default
    if (userTypeParam && userTypeParam !== 'null') {
      userTypeForSessions = userTypeParam;
      console.log('🔗 Using userType from URL:', userTypeForSessions);
    } else if (professionalTypeParam && professionalTypeParam !== 'null') {
      userTypeForSessions = professionalTypeParam;
      console.log('🔗 Using professionalType from URL:', userTypeForSessions);
    } else if (user && profile && profile.user_type === "scolaire-privee") {
      // Direct override for scolaire-privee users
      userTypeForSessions = 'scolaire-privee';
      console.log('🎯 DIRECT OVERRIDE: scolaire-privee -> scolaire-privee');
    } else if (user && userType && userType !== 'null') {
      userTypeForSessions = userType;
      console.log('📝 Using userType state:', userTypeForSessions);
    } else {
      // Default for guests and users without specific type
      userTypeForSessions = 'particulier';
      console.log('🔄 Default fallback -> particulier');
    }
    
    // Map professional types to correct session filtering
    if (userTypeForSessions === 'professional') {
      if (professionalTypeParam) {
        userTypeForSessions = professionalTypeParam;
      } else {
        // Use profile data for user type detection
        if (profile?.user_type === 'scolaire-privee') {
          userTypeForSessions = 'scolaire-privee';
        } else if (profile?.user_type === 'scolaire-publique') {
          userTypeForSessions = 'scolaire-publique';
        } else if (profile?.user_type === 'association') {
          userTypeForSessions = 'association';
        } else if (profile?.professional_type) {
          userTypeForSessions = profile.professional_type;
        } else if (profile?.role === 'scolaire-privee') {
          userTypeForSessions = 'scolaire-privee';
        } else if (profile?.role === 'scolaire-publique') {
          userTypeForSessions = 'scolaire-publique';
        } else if (profile?.role === 'association') {
          userTypeForSessions = 'association';
        } else {
          userTypeForSessions = 'particulier'; // Default fallback
        }
      }
    }
    
    console.log('🎯 Final userTypeForSessions:', userTypeForSessions);
    
    const sessions = getUserTypeSessions(spectacleId, userTypeForSessions, profile?.professional_type);
    console.log('sessionsCount:', sessions.length);
    console.log('sessions found:', sessions);
    
    if (sessions.length === 0) {
      console.log('❌ No sessions found for userType:', userTypeForSessions);
    } else {
      console.log('✅ Sessions found:', sessions.length, 'for userType:', userTypeForSessions);
    }
    
    return sessions;
  };

  if (!spectacle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/8 via-primary/4 to-primary/12 p-4 relative overflow-hidden">
      {/* Step Indicator */}
      <div className="w-full max-w-4xl mx-auto mb-8 relative z-20">
        <div className="flex items-center justify-center space-x-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          {[
            { num: 1, label: 'Profil', active: step >= 1 },
            { num: 2, label: 'Séance', active: step >= 2 },
            { num: 3, label: 'Informations', active: step >= 3 },
            { num: 4, label: 'Confirmation', active: step >= 4 },
            ...(userType === 'scolaire-privee' ? [{ num: 5, label: 'Devis', active: step >= 5 }] : [])
          ].map((stepItem, index, array) => (
            <div key={stepItem.num} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                stepItem.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {stepItem.num}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                stepItem.active ? 'text-primary' : 'text-gray-500'
              }`}>
                {stepItem.label}
              </span>
              {index < array.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  step > stepItem.num ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-screen">
        <div className="w-full max-w-2xl mx-auto relative z-10">


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
                            <div className="font-medium">
                              {(() => {
                                const date = new Date(session.date);
                                const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                                const dayName = dayNames[date.getDay()];
                                const formattedDate = date.toLocaleDateString('fr-FR');
                                return `${dayName} ${formattedDate}`;
                              })()
                            }
                            </div>
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
                                <div className="font-medium">
                                  {(() => {
                                    const date = new Date(session.date);
                                    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                                    const dayName = dayNames[date.getDay()];
                                    const formattedDate = date.toLocaleDateString('fr-FR');
                                    return `${dayName} ${formattedDate}`;
                                  })()
                                }
                                </div>
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
                    {(userType === 'scolaire-privee' || userType === 'scolaire-publique' || userType === 'association' || profile?.user_type === 'scolaire-privee') ? (
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
                      console.log('=== CONTINUER BUTTON CLICKED ===');
                      console.log('Current step:', step);
                      console.log('User type:', userType);
                      console.log('Form data:', formData);
                      console.log('Selected session:', selectedSession);
                      
                      // Validation before proceeding to payment
                      const isProfessional = ['scolaire-privee', 'scolaire-publique', 'association'].includes(userType);
                      const totalRequested = isProfessional 
                        ? (formData.childrenCount || 0) + (formData.accompaniersCount || 0)
                        : (formData.ticketCount || 0);
                      
                      console.log('Is professional:', isProfessional);
                      console.log('Total requested:', totalRequested);
                      console.log('Session capacity:', sessionCapacity);
                      
                      // Check if user has filled required fields for this step
                      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                        console.log('Missing required fields');
                        toast.error('Informations manquantes - Veuillez remplir tous les champs obligatoires.');
                        return;
                      }
                      
                      // Check if user has selected tickets/participants
                      if (totalRequested === 0) {
                        console.log('No tickets/participants selected');
                        toast.error('Veuillez sélectionner au moins un ticket ou participant.');
                        return;
                      }
                        
                      // Check capacity with correct total for user type
                      if (sessionCapacity && totalRequested > sessionCapacity.available) {
                        console.log('Capacity exceeded');
                        toast.error(`Capacité insuffisante - Il ne reste que ${sessionCapacity.available} places disponibles.`);
                        return;
                      }
                      
                      // For private school users, go to devis step first
                      if (userType === 'scolaire-privee' || profile?.user_type === 'scolaire-privee') {
                        console.log('Private school user - proceeding to devis step (step 5)');
                        setStep(5);
                      } else {
                        console.log('Regular user - proceeding to payment step (step 4)');
                        setStep(4);
                      }
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

            {/* Step 5: Devis Generation (Private Schools Only) */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Génération du devis</h3>
                  <p className="text-muted-foreground">Votre devis personnalisé pour cette réservation</p>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-4 text-primary">Récapitulatif de votre réservation</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spectacle:</span>
                      <span className="font-medium">{spectacle.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">École:</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Téléphone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enfants:</span>
                      <span className="font-medium">{formData.childrenCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accompagnateurs:</span>
                      <span className="font-medium">{formData.accompaniersCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enseignants:</span>
                      <span className="font-medium">{formData.teachersCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total participants:</span>
                      <span className="font-medium">{(formData.childrenCount || 0) + (formData.accompaniersCount || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix unitaire:</span>
                      <span className="font-medium">100 MAD</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">{((formData.childrenCount || 0) + (formData.accompaniersCount || 0)) * 100} MAD</span>
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
                    onClick={async () => {
                      try {
                        console.log('Generating devis for private school...');
                        
                        // Create booking first
                        const availableSessions = getAvailableSessions();
                        const selectedSessionData = availableSessions?.find(s => s.id === selectedSession);
                        
                        if (!selectedSessionData) {
                          toast.error('Session non trouvée');
                          return;
                        }

                        // Get the mapped session UUID from the database
                        console.log('Looking up session mapping for:', selectedSession);
                        const { data: mappingResult, error: mappingError } = await supabase
                          .from('session_id_mapping' as any)
                          .select('database_uuid')
                          .eq('frontend_id', selectedSession)
                          .single();

                        if (mappingError || !mappingResult) {
                          console.error('Session mapping error:', mappingError);
                          toast.error('Session non trouvée dans la base de données');
                          return;
                        }

                        const sessionUUID = (mappingResult as any).database_uuid;
                        console.log('Found session UUID:', sessionUUID);

                        const bookingData = {
                          user_id: user.id,
                          session_id: sessionUUID,
                          spectacle_id: spectacleId,
                          booking_type: 'scolaire-privee',
                          status: 'pending' as const,
                          number_of_tickets: (formData.childrenCount || 0) + (formData.accompaniersCount || 0),
                          children_count: formData.childrenCount || 0,
                          accompanists_count: formData.accompaniersCount || 0,
                          teachers_count: formData.teachersCount || 0,
                          total_amount: ((formData.childrenCount || 0) + (formData.accompaniersCount || 0)) * 100,
                          contact_name: `${formData.firstName} ${formData.lastName}`,
                          contact_email: formData.email,
                          contact_phone: formData.phone,
                          notes: formData.specialRequests || null
                        };

                        console.log('Creating booking with data:', bookingData);

                        const { data: booking, error: bookingError } = await supabase
                          .from('bookings')
                          .insert([bookingData])
                          .select()
                          .single();

                        if (bookingError) {
                          console.error('Booking creation error:', bookingError);
                          toast.error('Erreur lors de la création de la réservation');
                          return;
                        }

                        console.log('Booking created successfully:', booking);
                        setCurrentBookingId(booking.id);

                        // Generate devis PDF
                        const devisData = {
                          // Client info
                          schoolName: `${formData.firstName} ${formData.lastName}`,
                          contactName: `${formData.firstName} ${formData.lastName}`,
                          contactEmail: formData.email,
                          contactPhone: formData.phone,
                          schoolAddress: '',
                          
                          // Spectacle info
                          spectacleName: spectacle.title,
                          spectacleDate: selectedSessionData.date,
                          spectacleTime: selectedSessionData.time,
                          venue: selectedSessionData.location || 'À définir',
                          venueAddress: '',
                          
                          // Participants
                          studentsCount: formData.childrenCount || 0,
                          teachersCount: formData.teachersCount || 0,
                          accompagnateurCount: formData.accompaniersCount || 0,
                          
                          // Pricing
                          pricePerStudent: 100,
                          pricePerTeacher: 0,
                          pricePerAccompagnateur: 100,
                          totalAmount: ((formData.childrenCount || 0) + (formData.accompaniersCount || 0)) * 100,
                          
                          // Booking info
                          bookingId: booking.id,
                          devisNumber: `DEV-${booking.id.slice(0, 8).toUpperCase()}`,
                          dateGenerated: new Date().toLocaleDateString('fr-FR')
                        };

                        console.log('Generating devis with data:', devisData);

                        // Generate PDF using the existing devis generation logic
                        const { generateDevisPDF } = await import('@/utils/devisGenerator');
                        const pdfBytes = generateDevisPDF(devisData);
                        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(pdfBlob);
                        
                        setDevisUrl(pdfUrl);
                        setDevisGenerated(true);
                        
                        toast.success('Devis généré avec succès!');
                        
                        // Go to devis review step instead of payment
                        setStep(6);
                        
                      } catch (error) {
                        console.error('Error generating devis:', error);
                        toast.error('Erreur lors de la génération du devis');
                      }
                    }}
                    variant="glow"
                    size="xl"
                    className="flex-1"
                  >
                    Générer le devis
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Paiement</h3>
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
                    {/* Hide credit card option for private school users */}
                    {!(profile?.user_type === 'scolaire-privee' || userType === 'scolaire-privee') && (
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
                                <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Numéro de carte</label>
                                <input
                                  id="cardNumber"
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  className="w-full p-2 border rounded"
                                  value={formData.cardNumber}
                                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                                />
                              </div>
                              <div>
                                <label htmlFor="cardName" className="block text-sm font-medium mb-1">Nom sur la carte</label>
                                <input
                                  id="cardName"
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
                                <label htmlFor="cardExpiry" className="block text-sm font-medium mb-1">Date d'expiration</label>
                                <input
                                  id="cardExpiry"
                                  type="text"
                                  placeholder="MM/YY"
                                  className="w-full p-2 border rounded"
                                  value={formData.cardExpiry}
                                  onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                                />
                              </div>
                              <div>
                                <label htmlFor="cardCvv" className="block text-sm font-medium mb-1">CVV</label>
                                <input
                                  id="cardCvv"
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
                    )}
                    
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
                          <label htmlFor="whatsappNumber" className="block text-sm font-medium mb-1">WhatsApp pour confirmation</label>
                          <input
                            id="whatsappNumber"
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

      {/* Step 6: Devis Review - Full Screen Layout */}
      {step === 6 && (
        <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto min-h-screen flex flex-col py-8">
            <div className="grid lg:grid-cols-2 gap-6 flex-1">
              {/* Left Column - PDF Preview */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                  <div className="bg-gradient-to-r from-[#BDCF00] to-[#A8B800] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src="/lovable-uploads/b82bf764-c505-4dd6-960c-99a6acf57b3e.png" 
                          alt="L'École du Jeune Spectateur" 
                          className="h-10 w-auto"
                        />
                        <h2 className="text-xl font-semibold text-white">Aperçu du devis</h2>
                      </div>
                      <Button
                        onClick={() => {
                          if (devisUrl) {
                            const link = document.createElement('a');
                            link.href = devisUrl;
                            link.download = `devis-${currentBookingId?.slice(0, 8)}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Télécharger PDF
                      </Button>
                    </div>
                  </div>
                  
                  {devisUrl && (
                    <div className="p-4 h-full">
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-full">
                        <iframe
                          src={devisUrl}
                          className="w-full h-full"
                          title="Aperçu du devis"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Summary & Actions */}
              <div className="space-y-6 flex flex-col">
                {/* Reservation Summary */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex-1">
                  <div className="bg-gradient-to-r from-[#BDCF00] to-[#A8B800] px-6 py-4">
                    <h3 className="text-xl font-semibold text-white">Résumé de la réservation</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Spectacle</p>
                        <p className="font-semibold text-gray-900 text-lg">{spectacle.title}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date & Heure</p>
                        <p className="font-semibold text-gray-900">{getAvailableSessions()?.find(s => s.id === selectedSession)?.date}</p>
                        <p className="text-sm text-gray-600">{getAvailableSessions()?.find(s => s.id === selectedSession)?.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Participants</p>
                        <p className="font-semibold text-gray-900">{formData.childrenCount || 0} élèves</p>
                        {(formData.accompaniersCount || 0) > 0 && (
                          <p className="text-sm text-gray-600">{formData.accompaniersCount} accompagnateurs</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-green-600">
                          {((formData.childrenCount || 0) + (formData.accompaniersCount || 0)) * 100} DH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                  <Button
                    onClick={() => setStep(4)}
                    variant="glow"
                    size="xl"
                    className="w-full bg-gradient-to-r from-[#BDCF00] to-[#A8B800] hover:from-[#A8B800] hover:to-[#9AA600] text-white font-semibold py-5 text-xl shadow-lg"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approuver et payer
                  </Button>
                  
                  <Button 
                    onClick={() => setStep(5)}
                    variant="outline"
                    size="xl"
                    className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 py-4 text-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Modifier la réservation
                  </Button>
                  
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 text-center">
                      En approuvant, vous acceptez nos conditions générales de vente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
      </div>
    </div>
  );
};

export default ReservationFlow;
