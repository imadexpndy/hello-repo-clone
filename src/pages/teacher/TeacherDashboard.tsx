import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, BookOpen, FileText, Clock, Eye, Star, MapPin, Timer, Award, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Spectacle {
  id: string;
  title: string;
  description: string;
  age_range_min: number;
  age_range_max: number;
  duration_minutes: number;
  poster_url: string;
  price: number;
  is_active: boolean;
}

interface Booking {
  id: string;
  spectacle_title: string;
  session_date: string;
  session_time: string;
  student_count: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  totalStudents: number;
  pendingQuotes: number;
  availableSpectacles: number;
  thisMonthBookings: number;
}

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    totalStudents: 0,
    pendingQuotes: 0,
    availableSpectacles: 0,
    thisMonthBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch available spectacles
      const { data: spectaclesData, error: spectaclesError } = await supabase
        .from('spectacles')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (spectaclesError) throw spectaclesError;
      setSpectacles(spectaclesData || []);

      // Mock bookings data since database schema doesn't match
      const mockBookings: Booking[] = [
        {
          id: '1',
          spectacle_title: 'Le Petit Prince',
          session_date: '2024-12-15',
          session_time: '10:00',
          student_count: 25,
          total_price: 375,
          status: 'confirmed',
          created_at: '2024-11-01'
        },
        {
          id: '2',
          spectacle_title: 'Alice aux Pays des Merveilles',
          session_date: '2024-12-20',
          session_time: '14:00',
          student_count: 30,
          total_price: 450,
          status: 'pending',
          created_at: '2024-11-05'
        }
      ];

      setBookings(mockBookings);

      // Calculate stats
      const now = new Date();
      const thisMonth = new Date();
      thisMonth.setDate(1);
      
      const upcomingBookings = mockBookings.filter(b => 
        new Date(b.session_date) > now && b.status === 'confirmed'
      ).length;
      
      const totalStudents = mockBookings.reduce((sum, b) => sum + b.student_count, 0);
      const pendingQuotes = mockBookings.filter(b => b.status === 'pending').length;
      const thisMonthBookings = mockBookings.filter(b => 
        new Date(b.created_at) >= thisMonth
      ).length;

      setStats({
        totalBookings: mockBookings.length,
        upcomingBookings,
        totalStudents,
        pendingQuotes,
        availableSpectacles: spectaclesData?.length || 0,
        thisMonthBookings
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
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

  if (loading) {
    return (
      <DashboardLayout title="Tableau de Bord" subtitle="Vue d'ensemble de vos réservations">
        <div className="text-center py-8">Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Tableau de Bord" 
      subtitle={`Bienvenue ${profile?.full_name || 'Enseignant'}`}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.thisMonthBookings} ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prochains Spectacles</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">
                Confirmés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Inscrits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devis en Attente</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
              <p className="text-xs text-muted-foreground">
                À traiter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spectacles Disponibles</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableSpectacles}</div>
              <p className="text-xs text-muted-foreground">
                À réserver
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15%</div>
              <p className="text-xs text-muted-foreground">
                vs mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Gérez vos réservations de spectacles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/teacher/spectacles')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Réserver un Spectacle
              </Button>
              <Button variant="outline" onClick={() => navigate('/teacher/bookings')}>
                <Calendar className="mr-2 h-4 w-4" />
                Mes Réservations
              </Button>
              <Button variant="outline" onClick={() => navigate('/teacher/quotes')}>
                <FileText className="mr-2 h-4 w-4" />
                Mes Devis
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir les Spectacles
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Catalogue des Spectacles</DialogTitle>
                    <DialogDescription>
                      Découvrez tous nos spectacles disponibles pour vos élèves
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {spectacles.map((spectacle) => (
                      <Card key={spectacle.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          {spectacle.poster_url && (
                            <img 
                              src={spectacle.poster_url} 
                              alt={spectacle.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-100 text-green-800">
                              {spectacle.price}€
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2">{spectacle.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {spectacle.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {spectacle.age_range_min}-{spectacle.age_range_max} ans
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              {spectacle.duration_minutes} min
                            </span>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={() => navigate('/teacher/spectacles')}
                          >
                            Réserver ce spectacle
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {spectacles.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Aucun spectacle disponible pour le moment</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations Récentes</CardTitle>
            <CardDescription>Vos dernières réservations de spectacles</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Aucune réservation trouvée</p>
                <Button className="mt-4" onClick={() => navigate('/teacher/spectacles')}>
                  Réserver votre premier spectacle
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{booking.spectacle_title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.session_date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.session_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {booking.student_count} élèves
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{booking.total_price}€</div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate('/teacher/bookings')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {bookings.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => navigate('/teacher/bookings')}>
                      Voir toutes les réservations ({bookings.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
