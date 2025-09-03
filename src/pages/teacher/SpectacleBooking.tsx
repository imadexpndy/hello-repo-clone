import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Users, MapPin, Euro, FileText, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Spectacle {
  id: string;
  title: string;
  description: string;
  short_description: string;
  age_range: string;
  duration: number;
  language: string;
  main_image_url: string;
  price_school: number;
  status: string;
  sessions: SpectacleSession[];
}

interface SpectacleSession {
  id: string;
  date: string;
  time: string;
  venue: string;
  available_spots: number;
  max_capacity: number;
}

interface BookingForm {
  spectacle_id: string;
  session_id: string;
  student_count: number;
  teacher_count: number;
  grade_level: string;
  special_requirements: string;
  contact_phone: string;
  school_address: string;
}

export default function SpectacleBooking() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [selectedSpectacle, setSelectedSpectacle] = useState<Spectacle | null>(null);
  const [selectedSession, setSelectedSession] = useState<SpectacleSession | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');

  const [bookingForm, setBookingForm] = useState<BookingForm>({
    spectacle_id: '',
    session_id: '',
    student_count: 1,
    teacher_count: 1,
    grade_level: '',
    special_requirements: '',
    contact_phone: '',
    school_address: ''
  });

  useEffect(() => {
    fetchSpectacles();
  }, []);

  const fetchSpectacles = async () => {
    try {
      const { data, error } = await supabase
        .from('spectacles')
        .select(`
          id,
          title,
          description,
          short_description,
          age_range,
          duration,
          language,
          main_image_url,
          price_school,
          status,
          spectacle_sessions (
            id,
            date,
            time,
            venue,
            available_spots,
            max_capacity
          )
        `)
        .eq('status', 'active')
        .order('title');

      if (error) throw error;

      const transformedSpectacles: Spectacle[] = (data || []).map(spectacle => ({
        ...spectacle,
        sessions: spectacle.spectacle_sessions || []
      }));

      setSpectacles(transformedSpectacles);
    } catch (error) {
      console.error('Error fetching spectacles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les spectacles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedSpectacle || !selectedSession || !profile) return;

    setSubmitting(true);
    try {
      const totalPrice = calculateTotalPrice();
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: profile.user_id,
          spectacle_id: selectedSpectacle.id,
          session_id: selectedSession.id,
          student_count: bookingForm.student_count,
          teacher_count: bookingForm.teacher_count,
          grade_level: bookingForm.grade_level,
          special_requirements: bookingForm.special_requirements,
          contact_phone: bookingForm.contact_phone,
          school_address: bookingForm.school_address,
          total_price: totalPrice,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Generate PDF quote
      await generatePDFQuote(data.id);

      toast({
        title: "Réservation créée",
        description: "Votre demande de réservation a été envoyée. Un devis PDF vous sera envoyé par email.",
      });

      setShowBookingDialog(false);
      resetBookingForm();
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generatePDFQuote = async (bookingId: string) => {
    try {
      // Call edge function to generate PDF
      const { data, error } = await supabase.functions.invoke('generate-quote-pdf', {
        body: { bookingId }
      });

      if (error) throw error;
      
      console.log('PDF quote generated:', data);
    } catch (error) {
      console.error('Error generating PDF quote:', error);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedSpectacle) return 0;
    const studentPrice = selectedSpectacle.price_school * bookingForm.student_count;
    const teacherPrice = selectedSpectacle.price_school * bookingForm.teacher_count * 0.5; // 50% discount for teachers
    return Math.round((studentPrice + teacherPrice) * 100) / 100;
  };

  const resetBookingForm = () => {
    setBookingForm({
      spectacle_id: '',
      session_id: '',
      student_count: 1,
      teacher_count: 1,
      grade_level: '',
      special_requirements: '',
      contact_phone: '',
      school_address: ''
    });
    setSelectedSpectacle(null);
    setSelectedSession(null);
  };

  const openBookingDialog = (spectacle: Spectacle, session: SpectacleSession) => {
    setSelectedSpectacle(spectacle);
    setSelectedSession(session);
    setBookingForm(prev => ({
      ...prev,
      spectacle_id: spectacle.id,
      session_id: session.id
    }));
    setShowBookingDialog(true);
  };

  const filteredSpectacles = spectacles.filter(spectacle => {
    const matchesSearch = spectacle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spectacle.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = ageFilter === 'all' || spectacle.age_range?.includes(ageFilter);
    return matchesSearch && matchesAge;
  });

  if (loading) {
    return (
      <DashboardLayout title="Réserver un Spectacle" subtitle="Choisissez un spectacle pour votre classe">
        <div className="text-center py-8">Chargement des spectacles...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Réserver un Spectacle" subtitle="Choisissez un spectacle pour votre classe">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Rechercher</Label>
                <Input
                  id="search"
                  placeholder="Titre ou description du spectacle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="age-filter">Tranche d'âge</Label>
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les âges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les âges</SelectItem>
                    <SelectItem value="3-6">3-6 ans</SelectItem>
                    <SelectItem value="6-9">6-9 ans</SelectItem>
                    <SelectItem value="9-12">9-12 ans</SelectItem>
                    <SelectItem value="12+">12+ ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spectacles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpectacles.map((spectacle) => (
            <Card key={spectacle.id} className="overflow-hidden">
              {spectacle.main_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={spectacle.main_image_url}
                    alt={spectacle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{spectacle.title}</CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {spectacle.price_school}€/élève
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {spectacle.short_description || spectacle.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  {spectacle.age_range && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Âge: {spectacle.age_range}</span>
                    </div>
                  )}
                  {spectacle.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Durée: {spectacle.duration} min</span>
                    </div>
                  )}
                  {spectacle.language && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>Langue: {spectacle.language}</span>
                    </div>
                  )}
                </div>

                {/* Available Sessions */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Séances disponibles:</Label>
                  {spectacle.sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune séance programmée</p>
                  ) : (
                    <div className="space-y-2">
                      {spectacle.sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(session.date).toLocaleDateString('fr-FR')}
                              <Clock className="h-3 w-3 ml-2" />
                              {session.time}
                            </div>
                            {session.venue && (
                              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {session.venue}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => openBookingDialog(spectacle, session)}
                            disabled={session.available_spots <= 0}
                          >
                            {session.available_spots <= 0 ? 'Complet' : 'Réserver'}
                          </Button>
                        </div>
                      ))}
                      {spectacle.sessions.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{spectacle.sessions.length - 3} autres séances
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpectacles.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-muted-foreground">Aucun spectacle trouvé avec ces critères</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Réserver: {selectedSpectacle?.title}</DialogTitle>
            <DialogDescription>
              Séance du {selectedSession && new Date(selectedSession.date).toLocaleDateString('fr-FR')} à {selectedSession?.time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Student Count */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_count">Nombre d'élèves *</Label>
                <Input
                  id="student_count"
                  type="number"
                  min="1"
                  max="100"
                  value={bookingForm.student_count}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, student_count: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <Label htmlFor="teacher_count">Nombre d'accompagnateurs</Label>
                <Input
                  id="teacher_count"
                  type="number"
                  min="1"
                  max="10"
                  value={bookingForm.teacher_count}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, teacher_count: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <Label htmlFor="grade_level">Niveau de classe *</Label>
              <Select value={bookingForm.grade_level} onValueChange={(value) => setBookingForm(prev => ({ ...prev, grade_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maternelle">Maternelle</SelectItem>
                  <SelectItem value="cp">CP</SelectItem>
                  <SelectItem value="ce1">CE1</SelectItem>
                  <SelectItem value="ce2">CE2</SelectItem>
                  <SelectItem value="cm1">CM1</SelectItem>
                  <SelectItem value="cm2">CM2</SelectItem>
                  <SelectItem value="college">Collège</SelectItem>
                  <SelectItem value="lycee">Lycée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_phone">Téléphone de contact *</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={bookingForm.contact_phone}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="+212 6 12 34 56 78"
                />
              </div>
              <div>
                <Label htmlFor="school_address">Adresse de l'école *</Label>
                <Input
                  id="school_address"
                  value={bookingForm.school_address}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, school_address: e.target.value }))}
                  placeholder="Adresse complète"
                />
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <Label htmlFor="special_requirements">Besoins spéciaux ou commentaires</Label>
              <Textarea
                id="special_requirements"
                value={bookingForm.special_requirements}
                onChange={(e) => setBookingForm(prev => ({ ...prev, special_requirements: e.target.value }))}
                placeholder="Accessibilité, allergies, demandes particulières..."
                rows={3}
              />
            </div>

            {/* Price Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{bookingForm.student_count} élèves × {selectedSpectacle?.price_school}€</span>
                    <span>{(selectedSpectacle?.price_school || 0) * bookingForm.student_count}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{bookingForm.teacher_count} accompagnateurs × {((selectedSpectacle?.price_school || 0) * 0.5)}€</span>
                    <span>{((selectedSpectacle?.price_school || 0) * 0.5) * bookingForm.teacher_count}€</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{calculateTotalPrice()}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleBookingSubmit} 
              disabled={submitting || !bookingForm.grade_level || !bookingForm.contact_phone || !bookingForm.school_address}
            >
              {submitting ? 'Création...' : 'Créer la Réservation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
