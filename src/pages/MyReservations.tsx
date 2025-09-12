import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentStatusButton } from '@/components/PaymentStatusButton';

interface Reservation {
  id: string;
  spectacleTitle: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'confirmed';
  userRole: string;
  paymentDeadline?: string;
  totalAmount: number;
  bookingDate: string;
}

const MyReservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) {
        console.log('No user found in MyReservations');
        return;
      }
      
      setLoading(true);
      
      try {
        // Import supabase client
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Fetch user's bookings from database with session details
        console.log('=== MyReservations Database Query ===');
        console.log('User ID:', user.id);
        console.log('User email:', user.email);
        
        let { data: bookings, error } = await supabase
          .from('bookings')
          .select(`
            id,
            user_id,
            booking_type,
            number_of_tickets,
            status,
            payment_status,
            total_amount,
            created_at,
            payment_reference,
            sessions (
              id,
              session_date,
              session_time,
              venue,
              city,
              spectacles (
                title
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        console.log('Database bookings query result:', { data: bookings, error });

        if (error) {
          console.error('Error fetching database reservations:', error);
          setReservations([]);
          return;
        }

        // Transform database data to component format
        const transformedReservations: Reservation[] = (bookings || []).map(booking => ({
          id: booking.id,
          spectacleTitle: booking.sessions?.spectacles?.title || 'Spectacle',
          date: booking.sessions?.session_date || '',
          time: booking.sessions?.session_time || '',
          location: `${booking.sessions?.city || ''} - ${booking.sessions?.venue || ''}`.trim().replace(/^- /, ''),
          participants: booking.number_of_tickets || 0,
          status: booking.status as 'confirmed' | 'pending' | 'cancelled',
          paymentStatus: booking.payment_status as 'paid' | 'pending' | 'confirmed',
          totalAmount: booking.total_amount || 0,
          bookingDate: booking.created_at || '',
          userRole: booking.booking_type || 'particulier'
        }));

        console.log('Final transformed reservations from database:', transformedReservations);
        setReservations(transformedReservations);
      } catch (error) {
        console.error('Error in fetchReservations:', error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800">En vérification</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <DashboardLayout title="Mes Réservations" subtitle="Accès requis">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour voir vos réservations.</p>
            <Button onClick={() => navigate('/auth')}>Se connecter</Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mes Réservations" subtitle="Gérez vos réservations de spectacles">

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de vos réservations...</p>
          </div>
        ) : reservations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucune réservation</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore effectué de réservation.
              </p>
              <Button onClick={() => navigate('/spectacles')}>
                Découvrir nos spectacles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="backdrop-blur-xl bg-primary/8 border-primary/30 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-primary">
                        {reservation.spectacleTitle}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Réservation #{reservation.id} • Réservé le {new Date(reservation.bookingDate).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(reservation.status)}
                      {getPaymentStatusBadge(reservation.paymentStatus)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground mb-3">Détails du spectacle</h4>
                      
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-3 text-primary" />
                        <span>{new Date(reservation.date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-3 text-primary" />
                        <span>{reservation.time}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-3 text-primary" />
                        <span>{reservation.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-3 text-primary" />
                        <span>{reservation.participants} participant{reservation.participants > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Payment & Actions */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground mb-3">Paiement & Actions</h4>
                      
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Montant total:</span>
                          <span className="font-semibold text-lg">{reservation.totalAmount} MAD</span>
                        </div>
                        {reservation.paymentDeadline && reservation.paymentStatus === 'pending' && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Délai de paiement:</span>
                            <span className="text-sm font-medium text-orange-600">
                              {new Date(reservation.paymentDeadline).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Statut:</span>
                          {getPaymentStatusBadge(reservation.paymentStatus)}
                        </div>
                      </div>

                      {/* Payment Status Button for Bank Transfer */}
                      <PaymentStatusButton 
                        bookingId={reservation.id}
                        currentStatus={reservation.paymentStatus}
                        userRole={reservation.userRole}
                        onStatusUpdate={(newStatus) => {
                          setReservations(prev => prev.map(res => 
                            res.id === reservation.id 
                              ? { ...res, paymentStatus: newStatus as any }
                              : res
                          ));
                        }}
                      />

                      <div className="flex gap-2">
                        {reservation.status === 'confirmed' && (
                          <Button variant="outline" size="sm" className="flex-1">
                            Télécharger le billet
                          </Button>
                        )}
                        {reservation.status !== 'cancelled' && reservation.paymentStatus !== 'confirmed' && (
                          <Button variant="destructive" size="sm">
                            Annuler
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      {/* Quick Actions */}
      <div className="mt-8 text-center">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Besoin d'aide ?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="sm">
                Contacter le support
              </Button>
              <Button variant="outline" size="sm">
                FAQ
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/spectacles')}>
                Réserver un autre spectacle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyReservations;
