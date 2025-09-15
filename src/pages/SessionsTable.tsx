import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Clock, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Session {
  id: string;
  spectacle_id: string;
  session_date: string;
  session_time: string;
  venue: string;
  city: string;
  session_type: string;
  total_capacity: number;
  status: string;
  spectacles: {
    title: string;
  };
}

export default function SessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { profile } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, [profile]);

  const fetchSessions = async () => {
    try {
      console.log('Fetching sessions for user type:', profile?.user_type);
      
      let query = supabase
        .from('sessions')
        .select(`
          id,
          spectacle_id,
          session_date,
          session_time,
          venue,
          city,
          session_type,
          total_capacity,
          status,
          spectacles(title)
        `);

      // Filter sessions based on user type
      if (profile?.user_type === 'teacher_private') {
        query = query.eq('session_type', 'scolaire-privee');
      } else if (profile?.user_type === 'teacher_public') {
        query = query.eq('session_type', 'scolaire-publique');
      } else if (profile?.user_type === 'association') {
        query = query.eq('session_type', 'association');
      } else if (profile?.user_type === 'particulier') {
        query = query.eq('session_type', 'tout-public');
      }

      const { data, error } = await query.order('session_date', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Sessions data:', data);
      console.log('Sessions count:', data?.length || 0);
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.spectacles.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || session.city?.toLowerCase() === cityFilter;
    const matchesType = typeFilter === 'all' || session.session_type === typeFilter;
    
    return matchesSearch && matchesCity && matchesType;
  });

  const getSessionTypeBadge = (type: string) => {
    switch (type) {
      case 'scolaire-privee':
        return <Badge variant="default" className="bg-blue-500">Scolaire Privé</Badge>;
      case 'scolaire-publique':
        return <Badge variant="default" className="bg-green-500">Scolaire Public</Badge>;
      case 'tout-public':
        return <Badge variant="default" className="bg-purple-500">Tout Public</Badge>;
      case 'association':
        return <Badge variant="default" className="bg-orange-500">Association</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-600">Publié</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'closed':
        return <Badge variant="destructive">Fermé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sessions EDJS</h1>
          <p className="text-gray-600">Toutes les sessions de spectacles par type d'utilisateur et ville</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rechercher</label>
                <Input
                  placeholder="Spectacle ou lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ville</label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    <SelectItem value="casablanca">Casablanca</SelectItem>
                    <SelectItem value="rabat">Rabat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="scolaire-privee">Scolaire Privé</SelectItem>
                    <SelectItem value="scolaire-publique">Scolaire Public</SelectItem>
                    <SelectItem value="tout-public">Tout Public</SelectItem>
                    <SelectItem value="association">Association</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sessions ({filteredSessions.length})</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Triées par date
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-500">Chargement des sessions...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Spectacle</TableHead>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Aucune session trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="font-medium">{session.spectacles.title}</div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(session.session_date).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {session.session_time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{session.venue}</div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {session.city}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getSessionTypeBadge(session.session_type)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Users className="h-3 w-3 mr-1" />
                              {session.total_capacity}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(session.status)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
