import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkSessionCapacity, reserveSeats } from '@/lib/capacity';
import { generateDevisPDF, DevisData } from '@/utils/devisGenerator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Calendar, MapPin, Users, AlertTriangle, Download, MessageCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface Spectacle {
  id: string;
  title: string;
  description: string | null;
  level_range: string | null;
  price: number;
}

interface Session {
  id: string;
  spectacle_id: string;
  session_date: string;
  session_time: string;
  venue: string;
  city: string | null;
  total_capacity: number;
  spectacles: {
    title: string;
    price: number;
  };
}

export default function PrivateSchoolBooking() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSpectacle, setSelectedSpectacle] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [teacherCount, setTeacherCount] = useState('1');
  const [accompanistCount, setAccompanistCount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [capacityWarning, setCapacityWarning] = useState<any>(null);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [devisUrl, setDevisUrl] = useState<string | null>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSpectacles();
  }, []);

  useEffect(() => {
    if (selectedSpectacle) {
      fetchSessions(selectedSpectacle);
    } else {
      setSessions([]);
      setSelectedSession('');
    }
  }, [selectedSpectacle]);

  useEffect(() => {
    checkCapacity();
  }, [selectedSession, studentCount, teacherCount, accompanistCount]);

  const fetchSpectacles = async () => {
    try {
      const { data, error } = await supabase
        .from('spectacles')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setSpectacles(data || []);
    } catch (error) {
      console.error('Error fetching spectacles:', error);
    }
  };

  const fetchSessions = async (spectacleId: string) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          spectacles (title, price)
        `)
        .eq('spectacle_id', spectacleId)
        .eq('session_type', 'private')
        .eq('status', 'published')
        .gte('session_date', new Date().toISOString().split('T')[0])
        .order('session_date');

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const checkCapacity = async () => {
    if (!selectedSession || !studentCount) {
      setCapacityWarning(null);
      return;
    }

    const totalSeats = parseInt(studentCount) + parseInt(teacherCount || '0') + parseInt(accompanistCount || '0');
    if (totalSeats <= 0) return;

    try {
      const capacityCheck = await checkSessionCapacity(selectedSession, totalSeats);
      
      if (!capacityCheck.canBook) {
        setCapacityWarning(capacityCheck);
      } else {
        setCapacityWarning(null);
      }
    } catch (error) {
      console.error('Error checking capacity:', error);
    }
  };

  const generateDevis = async (bookingId: string, sessionData: Session) => {
    const devisNumber = `DEV-${Date.now()}`;
    const dateGenerated = new Date().toLocaleDateString('fr-FR');
    
    const studentsNum = parseInt(studentCount);
    const teachersNum = parseInt(teacherCount || '0');
    const accompagnateursNum = parseInt(accompanistCount || '0');
    
    // Pricing logic - you can adjust these prices
    const pricePerStudent = sessionData.spectacles.price || 15;
    const pricePerTeacher = 0; // Teachers usually free
    const pricePerAccompagnateur = pricePerStudent; // Same as student price
    
    const totalAmount = (studentsNum * pricePerStudent) + 
                       (teachersNum * pricePerTeacher) + 
                       (accompagnateursNum * pricePerAccompagnateur);

    const devisData: DevisData = {
      schoolName: profile?.name || 'École Privée',
      contactName: profile?.full_name || user?.email || '',
      contactEmail: user?.email || '',
      contactPhone: profile?.phone || '',
      schoolAddress: profile?.address || '',
      
      spectacleName: sessionData.spectacles.title,
      spectacleDate: new Date(sessionData.session_date).toLocaleDateString('fr-FR'),
      spectacleTime: sessionData.session_time,
      venue: sessionData.venue,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedSession || !studentCount) return;

    const totalSeats = parseInt(studentCount) + parseInt(teacherCount || '0') + parseInt(accompanistCount || '0');
    
    setLoading(true);
    try {
      // Create booking with devis_generated status
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          session_id: selectedSession,
          booking_type: 'private_school',
          number_of_tickets: totalSeats,
          students_count: parseInt(studentCount),
          teachers_count: parseInt(teacherCount || '0'),
          accompagnateurs_count: parseInt(accompanistCount || '0'),
          total_amount: 0, // Will be updated after devis generation
          status: 'pending' as const,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Generate devis PDF
      const selectedSessionData = sessions.find(s => s.id === selectedSession);
      if (!selectedSessionData) throw new Error('Session data not found');

      const { url, devisData } = await generateDevis(booking.id, selectedSessionData);
      
      // Update booking with total amount
      await supabase
        .from('bookings')
        .update({ 
          total_amount: devisData.totalAmount,
          status: 'pending' as const
        })
        .eq('id', booking.id);

      setCurrentBookingId(booking.id);
      setDevisUrl(url);
      setBookingCreated(true);

      toast({
        title: "Devis généré",
        description: `Votre devis a été généré avec succès. Vous pouvez le télécharger et le consulter.`,
      });
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDevis = () => {
    if (devisUrl) {
      const link = document.createElement('a');
      link.href = devisUrl;
      link.download = `devis-${currentBookingId}.pdf`;
      link.click();
    }
  };

  const markAsPaid = async () => {
    if (!currentBookingId) return;
    
    try {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed' as const })
        .eq('id', currentBookingId);

      toast({
        title: "Paiement confirmé",
        description: "Votre paiement a été marqué comme envoyé. Nous vérifierons et confirmerons sous 24h.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startNewBooking = () => {
    setBookingCreated(false);
    setDevisUrl(null);
    setCurrentBookingId(null);
    setSelectedSpectacle('');
    setSelectedSession('');
    setStudentCount('');
    setTeacherCount('1');
    setAccompanistCount('0');
    setCapacityWarning(null);
  };

  if (profile?.user_type === "scolaire-privee") {
    return <div>Accès réservé aux enseignants d'écoles privées</div>;
  }

  const selectedSessionData = sessions.find(s => s.id === selectedSession);
  const totalRequestedSeats = parseInt(studentCount || '0') + parseInt(teacherCount || '0') + parseInt(accompanistCount || '0');

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      
      <main className="flex-1 p-6">
        <Breadcrumbs />
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Nouvelle Réservation</h1>
            <p className="text-muted-foreground">
              Réserver des places pour votre école privée
            </p>
          </div>

          {!bookingCreated && (
            <Card>
              <CardHeader>
                <CardTitle>Détails de la réservation</CardTitle>
                <CardDescription>
                  Sélectionnez un spectacle et une session pour votre école
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Spectacle Selection */}
                <div className="space-y-2">
                  <Label htmlFor="spectacle">Spectacle *</Label>
                  <Select value={selectedSpectacle} onValueChange={setSelectedSpectacle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un spectacle" />
                    </SelectTrigger>
                    <SelectContent>
                      {spectacles.map((spectacle) => (
                        <SelectItem key={spectacle.id} value={spectacle.id}>
                          <div>
                            <div className="font-medium">{spectacle.title}</div>
                            {spectacle.level_range && (
                              <div className="text-sm text-muted-foreground">
                                Niveaux: {spectacle.level_range}
                              </div>
                            )}
                            <div className="text-sm text-primary font-medium">
                              {spectacle.price} MAD HT par élève
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Session Selection */}
                {sessions.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="session">Session *</Label>
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une session" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(session.session_date).toLocaleDateString('fr-FR')} à {session.session_time}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {session.city && `${session.city}, `}{session.venue}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-4 w-4" />
                                  Capacité: {session.total_capacity}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Attendee Counts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="studentCount">Nombre d'élèves *</Label>
                      <Input
                        id="studentCount"
                        type="number"
                        min="1"
                        value={studentCount}
                        onChange={(e) => setStudentCount(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="teacherCount">Nombre d'enseignants</Label>
                      <Input
                        id="teacherCount"
                        type="number"
                        min="0"
                        value={teacherCount}
                        onChange={(e) => setTeacherCount(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="accompanistCount">Nombre d'accompagnateurs</Label>
                      <Input
                        id="accompanistCount"
                        type="number"
                        min="0"
                        value={accompanistCount}
                        onChange={(e) => setAccompanistCount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Capacity Warning */}
                {capacityWarning && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Capacité insuffisante</AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>
                          Vous demandez {totalRequestedSeats} places mais seulement {capacityWarning.availableSeats} sont disponibles.
                        </p>
                        {capacityWarning.alternativeSessions?.length > 0 && (
                          <div>
                            <p className="font-medium">Sessions alternatives disponibles:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {capacityWarning.alternativeSessions.map((alt: any) => (
                                <li key={alt.id}>
                                  {new Date(alt.date).toLocaleDateString('fr-FR')} à {alt.time} - 
                                  {alt.venue} ({alt.availableSeats} places disponibles)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Price Summary */}
                {selectedSessionData && studentCount && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Élèves ({studentCount})</span>
                          <span>{(parseInt(studentCount) * selectedSessionData.spectacles.price).toFixed(2)} MAD HT</span>
                        </div>
                        {parseInt(accompanistCount || '0') > 0 && (
                          <div className="flex justify-between">
                            <span>Accompagnateurs ({accompanistCount})</span>
                            <span>Gratuit</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>{(parseInt(studentCount) * selectedSessionData.spectacles.price).toFixed(2)} MAD HT</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Un devis détaillé vous sera envoyé par email après validation
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !!capacityWarning}
                >
                  {loading ? 'Création...' : 'Créer la demande de réservation'}
                </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Devis Generated Success Screen */}
          {bookingCreated && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">
                      Devis généré avec succès !
                    </h2>
                    <p className="text-gray-600">
                      Votre demande de réservation a été créée et un devis détaillé a été généré.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Prochaines étapes :</h3>
                    <ol className="text-left text-blue-700 space-y-1">
                      <li>1. Téléchargez et consultez votre devis</li>
                      <li>2. Contactez-nous via WhatsApp pour coordonner le paiement</li>
                      <li>3. Effectuez le paiement (virement, chèque ou espèces)</li>
                      <li>4. Votre réservation sera confirmée après réception du paiement</li>
                    </ol>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={downloadDevis}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le devis
                    </Button>
                    
                    <Button 
                      onClick={() => window.open('https://wa.me/212XXXXXXXXX?text=Bonjour, je souhaite coordonner le paiement pour ma réservation EDJS.', '_blank')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter via WhatsApp
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Modes de paiement acceptés :</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Virement bancaire</p>
                      <p>• Chèque à l'ordre d'EDJS</p>
                      <p>• Paiement en espèces (sur rendez-vous)</p>
                      <p className="text-red-600 font-medium">• Cartes bancaires non acceptées pour les écoles</p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline"
                      onClick={startNewBooking}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Nouvelle réservation
                    </Button>
                    
                    <Button 
                      onClick={markAsPaid}
                      variant="outline"
                      className="border-green-500 text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      J'ai effectué le paiement
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}