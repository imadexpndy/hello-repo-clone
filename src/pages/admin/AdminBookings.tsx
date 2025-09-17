import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Download, Search, Users, Calendar, MapPin } from 'lucide-react';

interface Booking {
  id: string;
  booking_type: string;
  number_of_tickets: number;
  status: string;
  payment_status: string;
  payment_reference?: string;
  created_at: string;
  students_count?: number;
  accompanists_count?: number;
  participants_count?: number;
  accompaniers_count?: number;
  total_amount?: number;
  is_confirmed: boolean;
  confirmed_at?: string;
  confirmed_by?: string;
  profiles: {
    name?: string;
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
  organizations: {
    name: string;
    type: string;
  } | null;
  sessions: {
    id: string;
    session_date: string;
    session_time: string;
    venue: string;
    city: string;
    capacity_professional: number;
    capacity_particulier: number;
    booked_professional: number;
    booked_particulier: number;
    spectacles: {
      title: string;
    };
  } | null;
}

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');


  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, typeFilter, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          sessions!inner(
            id,
            session_date,
            session_time,
            venue,
            city,
            spectacles!inner(title)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Fetched bookings:', data);
      console.log('Total bookings found:', data?.length || 0);
      
      // Log booking types for debugging
      if (data && data.length > 0) {
        const bookingTypes = data.map(b => b.booking_type);
        console.log('Booking types found:', bookingTypes);
        const b2cBookings = data.filter(b => b.booking_type === 'b2c');
        console.log('B2C bookings:', b2cBookings.length);
      }
      
      setBookings((data || []) as any);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de charger les réservations: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.sessions?.spectacles?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.booking_type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const confirmBooking = async (booking: Booking) => {
    try {
      // Check capacity before confirming
      const isProfessional = ['private_school', 'public_school', 'association', 'partner'].includes(booking.booking_type);
      const attendeesCount = isProfessional 
        ? (booking.participants_count || 0) + (booking.accompaniers_count || 0)
        : booking.number_of_tickets;
      
      const session = booking.sessions;
      if (!session) {
        throw new Error('Session non trouvée');
      }

      const availableCapacity = isProfessional 
        ? session.capacity_professional - session.booked_professional
        : session.capacity_particulier - session.booked_particulier;

      if (availableCapacity < attendeesCount) {
        toast({
          title: 'Capacité insuffisante',
          description: `Seulement ${availableCapacity} places disponibles pour ce type de réservation`,
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          is_confirmed: true,
          confirmed_at: new Date().toISOString(),
          confirmed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: 'Réservation confirmée',
        description: 'La réservation a été confirmée et le stock mis à jour',
      });

      fetchBookings();
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de confirmer la réservation: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const rejectBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'rejected',
          is_confirmed: false
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Réservation rejetée',
        description: 'La réservation a été rejetée',
      });

      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de rejeter la réservation',
        variant: 'destructive',
      });
    }
  };

  const unconfirmBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'pending',
          is_confirmed: false,
          confirmed_at: null,
          confirmed_by: null
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Confirmation annulée',
        description: 'La confirmation a été annulée et le stock libéré',
      });

      fetchBookings();
    } catch (error) {
      console.error('Error unconfirming booking:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'annuler la confirmation',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Type',
      'Utilisateur',
      'Email',
      'Organisation',
      'Spectacle',
      'Session',
      'Lieu',
      'Billets',
      'Élèves',
      'Accompagnateurs',
      'Montant',
      'Statut',
      'Paiement',
      'Date création'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(booking => [
        booking.id,
        booking.booking_type,
        booking.profiles?.name || `${booking.profiles?.first_name || ''} ${booking.profiles?.last_name || ''}`.trim(),
        booking.profiles?.email || '',
        booking.organizations?.name || '',
        booking.sessions?.spectacles?.title || '',
        `${booking.sessions?.session_date || ''} ${booking.sessions?.session_time || ''}`,
        `${booking.sessions?.venue || ''}, ${booking.sessions?.city || ''}`,
        booking.number_of_tickets,
        booking.students_count || 0,
        booking.accompanists_count || 0,
        booking.total_amount || 0,
        booking.status,
        booking.payment_status,
        new Date(booking.created_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string, isConfirmed: boolean) => {
    if (isConfirmed) return 'bg-green-500';
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'awaiting_verification': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailableCapacity = (booking: Booking) => {
    if (!booking.sessions) return { available: 0, total: 0, type: '' };
    
    const isProfessional = ['private_school', 'public_school', 'association', 'partner'].includes(booking.booking_type);
    
    if (isProfessional) {
      return {
        available: booking.sessions.capacity_professional - booking.sessions.booked_professional,
        total: booking.sessions.capacity_professional,
        type: 'Professionnels'
      };
    } else {
      return {
        available: booking.sessions.capacity_particulier - booking.sessions.booked_particulier,
        total: booking.sessions.capacity_particulier,
        type: 'Particuliers'
      };
    }
  };

  const headerActions = (
    <Button onClick={exportToCSV} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Exporter CSV
    </Button>
  );

  return (
    <DashboardLayout 
      title="Gestion des réservations"
      subtitle="Gérer toutes les réservations de la plateforme"
      headerActions={headerActions}
    >
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Réservations ({filteredBookings.length})
            </CardTitle>
            
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="scolaire-privee">École privée</SelectItem>
                  <SelectItem value="scolaire-publique">École publique</SelectItem>
                  <SelectItem value="association">Association</SelectItem>
                  <SelectItem value="partner">Partenaire</SelectItem>
                  <SelectItem value="b2c">B2C</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="awaiting_verification">Attente vérification</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Spectacle</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.profiles?.name || `${booking.profiles?.first_name || ''} ${booking.profiles?.last_name || ''}`.trim() || 'N/A'}
                            </div>
                            <div className="text-sm text-muted-foreground">{booking.profiles?.email || 'N/A'}</div>
                            {booking.organizations && (
                              <div className="text-sm text-muted-foreground">{booking.organizations.name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.booking_type}</Badge>
                        </TableCell>
                        <TableCell>{booking.sessions?.spectacles?.title || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {booking.sessions?.session_date || 'N/A'} {booking.sessions?.session_time || ''}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {booking.sessions?.venue || 'N/A'}, {booking.sessions?.city || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {['private_school', 'public_school', 'association', 'partner'].includes(booking.booking_type) ? (
                              <div>
                                <div>{(booking.participants_count || 0) + (booking.accompaniers_count || 0)} total</div>
                                <div className="text-muted-foreground">
                                  {booking.participants_count || 0} participants, {booking.accompaniers_count || 0} accomp.
                                </div>
                              </div>
                            ) : (
                              <div>{booking.number_of_tickets} billets</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const capacity = getAvailableCapacity(booking);
                            return (
                              <div className="text-sm">
                                <div className={capacity.available < 10 ? 'text-red-600 font-medium' : 'text-green-600'}>
                                  {capacity.available}/{capacity.total}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {capacity.type}
                                </div>
                              </div>
                            );
                          })()} 
                        </TableCell>
                        <TableCell>
                          {booking.total_amount ? `${booking.total_amount} MAD` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(booking.status, booking.is_confirmed)} text-white`}
                            >
                              {booking.is_confirmed ? 'Confirmé' : booking.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {booking.payment_status}
                            </div>
                            {booking.is_confirmed && booking.confirmed_at && (
                              <div className="text-xs text-muted-foreground">
                                Confirmé le {new Date(booking.confirmed_at).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-x-2">
                            {!booking.is_confirmed && booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => confirmBooking(booking)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirmer
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => rejectBooking(booking.id)}
                                >
                                  Rejeter
                                </Button>
                              </>
                            )}
                            {booking.is_confirmed && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => unconfirmBooking(booking.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Annuler confirmation
                              </Button>
                            )}
                            {booking.status === 'awaiting_verification' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => confirmBooking(booking)}
                                >
                                  Approuver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => rejectBooking(booking.id)}
                                >
                                  Rejeter
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredBookings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune réservation trouvée
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
    </DashboardLayout>
  );
}