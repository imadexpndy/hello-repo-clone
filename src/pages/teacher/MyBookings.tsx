import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Users, MapPin, FileText, Download, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  spectacle_title: string;
  session_date: string;
  session_time: string;
  venue: string;
  student_count: number;
  teacher_count: number;
  grade_level: string;
  total_price: number;
  status: string;
  quote_pdf_url: string | null;
  quote_generated_at: string | null;
  created_at: string;
  special_requirements: string;
  contact_phone: string;
  school_address: string;
}

export default function MyBookings() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings for user:', profile?.id);
      
      if (!profile?.id) {
        console.error('No profile ID available');
        toast({
          title: "Erreur",
          description: "Profil utilisateur non disponible",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          students_count,
          teachers_count,
          grade_level,
          total_amount,
          status,
          created_at,
          special_requirements,
          contact_phone,
          school_address,
          session_id,
          sessions!inner (
            session_date,
            session_time,
            venue,
            spectacles!inner (
              title
            )
          )
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      console.log('Bookings query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const transformedBookings: Booking[] = (data || []).map((booking: any) => ({
        id: booking.id,
        spectacle_title: booking.sessions?.spectacles?.title || 'Unknown',
        session_date: booking.sessions?.session_date || '',
        session_time: booking.sessions?.session_time || '',
        venue: booking.sessions?.venue || '',
        student_count: booking.students_count || 0,
        teacher_count: booking.teachers_count || 0,
        grade_level: booking.grade_level || '',
        total_price: booking.total_amount || 0,
        status: booking.status || 'pending',
        quote_pdf_url: null,
        quote_generated_at: null,
        created_at: booking.created_at,
        special_requirements: booking.special_requirements || null,
        contact_phone: booking.contact_phone || null,
        school_address: booking.school_address || null
      }));

      setBookings(transformedBookings);
      console.log('Transformed bookings:', transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Erreur",
        description: `Impossible de charger vos réservations: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'outline' as const, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      confirmed: { label: 'Confirmé', variant: 'outline' as const, className: 'bg-green-50 text-green-700 border-green-200' },
      cancelled: { label: 'Annulé', variant: 'outline' as const, className: 'bg-red-50 text-red-700 border-red-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const downloadPDF = async (booking: Booking) => {
    if (!booking.quote_pdf_url) {
      toast({
        title: "Erreur",
        description: "Le devis PDF n'est pas encore disponible",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(booking.quote_pdf_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `devis-${booking.spectacle_title.replace(/\s+/g, '-')}-${booking.id.slice(-8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Téléchargement réussi",
        description: "Le devis PDF a été téléchargé",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le devis PDF",
        variant: "destructive",
      });
    }
  };

  const regeneratePDF = async (bookingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-quote-pdf', {
        body: { bookingId }
      });

      if (error) throw error;

      toast({
        title: "Devis régénéré",
        description: "Un nouveau devis PDF a été généré et envoyé par email",
      });

      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error regenerating PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de régénérer le devis PDF",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Mes Réservations" subtitle="Gérez vos réservations de spectacles">
        <div className="text-center py-8">Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mes Réservations" subtitle="Gérez vos réservations de spectacles">
      <div className="space-y-6">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">Aucune réservation trouvée</p>
              <Button onClick={() => window.location.href = '/teacher/spectacles'}>
                Réserver un spectacle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Vos Réservations</CardTitle>
              <CardDescription>
                {bookings.length} réservation{bookings.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Spectacle</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Devis</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.spectacle_title}</div>
                          <div className="text-sm text-muted-foreground">
                            Niveau: {booking.grade_level.toUpperCase()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.session_date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {booking.session_time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {booking.student_count} élèves
                          </div>
                          <div className="text-muted-foreground">
                            +{booking.teacher_count} accomp.
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {booking.total_price}€
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell>
                        {booking.quote_pdf_url ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadPDF(booking)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => regeneratePDF(booking.id)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Générer
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Réservation</DialogTitle>
            <DialogDescription>
              Réservation #{selectedBooking?.id.slice(-8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              {/* Spectacle Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Spectacle</h4>
                  <p className="text-sm">{selectedBooking.spectacle_title}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Statut</h4>
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>

              {/* Session Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Date & Heure</h4>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(selectedBooking.session_date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3" />
                    {selectedBooking.session_time}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Lieu</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3" />
                    {selectedBooking.venue || 'À définir'}
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Élèves</h4>
                  <p className="text-sm">{selectedBooking.student_count}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Accompagnateurs</h4>
                  <p className="text-sm">{selectedBooking.teacher_count}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Niveau</h4>
                  <p className="text-sm">{selectedBooking.grade_level.toUpperCase()}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Téléphone</h4>
                  <p className="text-sm">{selectedBooking.contact_phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Adresse École</h4>
                  <p className="text-sm">{selectedBooking.school_address}</p>
                </div>
              </div>

              {/* Special Requirements */}
              {selectedBooking.special_requirements && (
                <div>
                  <h4 className="font-semibold mb-2">Besoins Spéciaux</h4>
                  <p className="text-sm bg-muted p-3 rounded">
                    {selectedBooking.special_requirements}
                  </p>
                </div>
              )}

              {/* Price */}
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-semibold mb-2">Prix Total</h4>
                <p className="text-2xl font-bold text-primary">
                  {selectedBooking.total_price}€
                </p>
              </div>

              {/* PDF Actions */}
              <div className="flex gap-2">
                {selectedBooking.quote_pdf_url ? (
                  <Button onClick={() => downloadPDF(selectedBooking)}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le Devis PDF
                  </Button>
                ) : (
                  <Button onClick={() => regeneratePDF(selectedBooking.id)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Générer le Devis PDF
                  </Button>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
