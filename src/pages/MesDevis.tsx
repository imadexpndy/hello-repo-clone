import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, Eye, Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface Devis {
  id: string;
  devis_number: string;
  spectacle_name: string;
  spectacle_date: string;
  spectacle_time: string;
  venue: string;
  school_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  students_count: number;
  teachers_count: number;
  accompanists_count: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  generated_at: string;
  approved_at?: string;
  pdf_url?: string;
}

export default function MesDevis() {
  const { user } = useAuth();
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);

  useEffect(() => {
    if (user) {
      fetchDevis();
    }
  }, [user]);

  const fetchDevis = async () => {
    try {
      setLoading(true);
      
      // Get devis from localStorage (will be replaced with Supabase query)
      const storedDevis = localStorage.getItem('user_devis');
      let userDevis: Devis[] = [];
      
      if (storedDevis) {
        const allDevis = JSON.parse(storedDevis);
        // Filter devis for current user
        userDevis = allDevis.filter((devis: any) => devis.user_id === user?.id);
      }
      
      // Add some mock data if no devis exist
      if (userDevis.length === 0) {
        userDevis = [
          {
            id: 'mock-1',
            devis_number: 'DEV-SAMPLE01',
            spectacle_name: 'Le Petit Prince',
            spectacle_date: '2024-01-15',
            spectacle_time: '10:00',
            venue: 'Théâtre Mohammed V - Rabat',
            school_name: 'École Privée Al Manar',
            contact_name: 'Ahmed Benali',
            contact_email: 'ahmed@almanar.ma',
            contact_phone: '+212 6 12 34 56 78',
            students_count: 25,
            teachers_count: 2,
            accompanists_count: 3,
            total_amount: 2800,
            status: 'pending',
            generated_at: '2024-01-10T10:00:00Z'
          }
        ];
      }
      
      // Sort by generated_at descending
      userDevis.sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());
      
      setDevis(userDevis);
      
      // TODO: Replace with actual Supabase query when devis table is available:
      // const { data, error } = await supabase
      //   .from('devis')
      //   .select('*')
      //   .eq('user_id', user?.id)
      //   .order('generated_at', { ascending: false });
      
    } catch (error) {
      console.error('Error fetching devis:', error);
      toast.error('Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  };

  const downloadDevis = async (devisItem: Devis) => {
    try {
      if (devisItem.pdf_url) {
        // If PDF URL exists, download directly
        const link = document.createElement('a');
        link.href = devisItem.pdf_url;
        link.download = `devis-${devisItem.devis_number}.pdf`;
        link.click();
        toast.success('Téléchargement du devis en cours...');
      } else {
        // Generate PDF if not available
        toast.info('Génération du PDF en cours...');
        
        const devisData = {
          schoolName: devisItem.school_name,
          contactName: devisItem.contact_name,
          contactEmail: devisItem.contact_email,
          contactPhone: devisItem.contact_phone,
          schoolAddress: '',
          spectacleName: devisItem.spectacle_name,
          spectacleDate: devisItem.spectacle_date,
          spectacleTime: devisItem.spectacle_time,
          venue: devisItem.venue,
          venueAddress: '',
          studentsCount: devisItem.students_count,
          teachersCount: devisItem.teachers_count,
          accompagnateurCount: devisItem.accompanists_count,
          pricePerStudent: 100,
          pricePerTeacher: 0,
          pricePerAccompagnateur: 100,
          totalAmount: devisItem.total_amount,
          bookingId: devisItem.id,
          devisNumber: devisItem.devis_number,
          dateGenerated: new Date(devisItem.generated_at).toLocaleDateString('fr-FR')
        };

        const { generateDevisPDF } = await import('@/utils/devisGenerator');
        const pdfBytes = generateDevisPDF(devisData);
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `devis-${devisItem.devis_number}.pdf`;
        link.click();
        
        toast.success('Devis téléchargé avec succès!');
      }
    } catch (error) {
      console.error('Error downloading devis:', error);
      toast.error('Erreur lors du téléchargement du devis');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de vos devis...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Devis</h1>
        <p className="text-muted-foreground">
          Consultez et téléchargez tous vos devis de réservation
        </p>
      </div>

      {devis.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun devis trouvé</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous n'avez pas encore de devis. Effectuez une réservation pour générer votre premier devis.
            </p>
            <Button onClick={() => window.location.href = '/spectacles'}>
              Voir les spectacles
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {devis.map((devisItem) => (
            <Card key={devisItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{devisItem.spectacle_name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">
                      {devisItem.devis_number}
                    </p>
                  </div>
                  {getStatusBadge(devisItem.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(devisItem.spectacle_date).toLocaleDateString('fr-FR')} à {devisItem.spectacle_time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{devisItem.venue}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {devisItem.students_count} élèves, {devisItem.accompanists_count} accompagnateurs
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold text-primary">
                      {devisItem.total_amount} MAD
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadDevis(devisItem)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    
                    <Button
                      onClick={() => setSelectedDevis(devisItem)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Généré le {new Date(devisItem.generated_at).toLocaleDateString('fr-FR')}
                  {devisItem.approved_at && (
                    <span className="block">
                      Approuvé le {new Date(devisItem.approved_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Devis Details Modal */}
      {selectedDevis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedDevis.spectacle_name}</h2>
                  <p className="text-muted-foreground font-mono">{selectedDevis.devis_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedDevis.status)}
                  <Button
                    onClick={() => setSelectedDevis(null)}
                    variant="ghost"
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3">Informations du spectacle</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="ml-2">
                        {new Date(selectedDevis.spectacle_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Heure:</span>
                      <span className="ml-2">{selectedDevis.spectacle_time}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lieu:</span>
                      <span className="ml-2">{selectedDevis.venue}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">École:</span>
                      <span className="ml-2">{selectedDevis.school_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="ml-2">{selectedDevis.contact_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="ml-2">{selectedDevis.contact_email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Téléphone:</span>
                      <span className="ml-2">{selectedDevis.contact_phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Participants</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedDevis.students_count}</div>
                      <div className="text-muted-foreground">Élèves</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedDevis.accompanists_count}</div>
                      <div className="text-muted-foreground">Accompagnateurs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedDevis.teachers_count}</div>
                      <div className="text-muted-foreground">Enseignants</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Montant total:</span>
                  <span className="text-2xl font-bold text-primary">{selectedDevis.total_amount} MAD</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => downloadDevis(selectedDevis)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le devis
                </Button>
                <Button
                  onClick={() => setSelectedDevis(null)}
                  variant="outline"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
