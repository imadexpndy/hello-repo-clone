import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, Clock, Star, Timer, MapPin, ArrowLeft } from 'lucide-react';
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

export default function SpectacleCatalog() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpectacle, setSelectedSpectacle] = useState<Spectacle | null>(null);

  useEffect(() => {
    fetchSpectacles();
  }, []);

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
      toast({
        title: "Erreur",
        description: "Impossible de charger les spectacles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (spectacle: Spectacle) => {
    toast({
      title: "Réservation",
      description: `Pour réserver "${spectacle.title}", veuillez nous contacter directement.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">Chargement des spectacles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">🎭 Nos Spectacles</h1>
            <p className="text-muted-foreground">
              Découvrez notre collection de spectacles pour enfants
            </p>
          </div>
        </div>

        {/* Spectacles Grid */}
        {spectacles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Star className="mx-auto h-16 w-16 mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Aucun spectacle disponible</h3>
              <p className="text-muted-foreground">
                Revenez bientôt pour découvrir nos nouveaux spectacles !
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spectacles.map((spectacle) => (
              <Card key={spectacle.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  {spectacle.poster_url ? (
                    <img 
                      src={spectacle.poster_url} 
                      alt={spectacle.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Star className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-primary border-primary/20 shadow-sm">
                      {spectacle.price}€
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-3">{spectacle.title}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {spectacle.age_range_min}-{spectacle.age_range_max} ans
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-4 w-4" />
                      {spectacle.duration_minutes} min
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {spectacle.description}
                  </p>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1" onClick={() => setSelectedSpectacle(spectacle)}>
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedSpectacle?.title}</DialogTitle>
                          <DialogDescription className="text-base">
                            Spectacle pour enfants de {selectedSpectacle?.age_range_min} à {selectedSpectacle?.age_range_max} ans
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedSpectacle && (
                          <div className="space-y-6">
                            {selectedSpectacle.poster_url && (
                              <img 
                                src={selectedSpectacle.poster_url} 
                                alt={selectedSpectacle.title}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <span>Âge: {selectedSpectacle.age_range_min}-{selectedSpectacle.age_range_max} ans</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Timer className="h-5 w-5 text-primary" />
                                <span>Durée: {selectedSpectacle.duration_minutes} minutes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-primary" />
                                <span>Prix: {selectedSpectacle.price}€</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-muted-foreground leading-relaxed">
                                {selectedSpectacle.description}
                              </p>
                            </div>
                            
                            <Button 
                              className="w-full" 
                              size="lg"
                              onClick={() => handleBooking(selectedSpectacle)}
                            >
                              Réserver ce spectacle
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="flex-1" 
                      onClick={() => handleBooking(spectacle)}
                    >
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Besoin d'aide pour réserver ?</h3>
            <p className="text-muted-foreground mb-4">
              Contactez-nous directement pour finaliser votre réservation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Nous contacter
              </Button>
              <Button variant="outline">
                📞 Téléphone
              </Button>
              <Button variant="outline">
                ✉️ Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
