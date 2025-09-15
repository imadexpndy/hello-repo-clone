import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quote {
  id: string;
  spectacle_title: string;
  session_date: string;
  total_price: number;
  status: string;
  quote_pdf_url: string | null;
  quote_generated_at: string | null;
  created_at: string;
}

export default function MyQuotes() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      console.log('Fetching quotes for user:', profile?.id);
      
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
          status,
          quote_pdf_url,
          quote_generated_at,
          created_at,
          total_amount,
          sessions!inner (
            session_date,
            spectacles!inner (
              title,
              price
            )
          )
        `)
        .eq('user_id', profile.id)
        .not('quote_pdf_url', 'is', null)
        .order('created_at', { ascending: false });

      console.log('Quotes query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const transformedQuotes: Quote[] = (data || []).map((booking: any) => ({
        id: booking.id,
        spectacle_title: booking.sessions?.spectacles?.title || 'Unknown',
        session_date: booking.sessions?.session_date || '',
        total_price: booking.total_amount || booking.sessions?.spectacles?.price || 15.00,
        status: booking.status || 'pending',
        quote_pdf_url: booking.quote_pdf_url || null,
        quote_generated_at: booking.quote_generated_at || null,
        created_at: booking.created_at
      }));

      setQuotes(transformedQuotes);
      console.log('Transformed quotes:', transformedQuotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Erreur",
        description: `Impossible de charger vos devis: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (quote: Quote) => {
    if (!quote.quote_pdf_url) return;

    try {
      const response = await fetch(quote.quote_pdf_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `devis-${quote.spectacle_title.replace(/\s+/g, '-')}-${quote.id.slice(-8)}.pdf`;
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      confirmed: { label: 'Confirmé', className: 'bg-green-50 text-green-700 border-green-200' },
      cancelled: { label: 'Annulé', className: 'bg-red-50 text-red-700 border-red-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout title="Mes Devis" subtitle="Téléchargez vos devis PDF">
        <div className="text-center py-8">Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mes Devis" subtitle="Téléchargez vos devis PDF">
      <div className="space-y-6">
        {quotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">Aucun devis trouvé</p>
              <Button onClick={() => window.location.href = '/teacher/spectacles'}>
                Réserver un spectacle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Vos Devis PDF</CardTitle>
              <CardDescription>
                {quotes.length} devis disponible{quotes.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Spectacle</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Généré le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">
                        {quote.spectacle_title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(quote.session_date).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {quote.total_price}€
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(quote.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {quote.quote_generated_at 
                          ? new Date(quote.quote_generated_at).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadPDF(quote)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger
                          </Button>
                          {quote.quote_pdf_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(quote.quote_pdf_url!, '_blank')}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                          )}
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
    </DashboardLayout>
  );
}
