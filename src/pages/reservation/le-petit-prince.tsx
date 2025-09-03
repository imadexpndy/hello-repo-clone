import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin, Euro } from 'lucide-react';

const LePetitPrinceReservation = () => {
  const [formData, setFormData] = useState({
    sessionId: '',
    studentCount: '',
    accompanistCount: '',
    schoolName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sessions = [
    {
      id: 'lpp-oct-15',
      date: '15 Octobre 2025',
      time: '10:00',
      venue: 'Théâtre Mohammed V',
      city: 'Rabat',
      capacity: 200,
      price: 50
    },
    {
      id: 'lpp-oct-22',
      date: '22 Octobre 2025', 
      time: '14:30',
      venue: 'Théâtre National',
      city: 'Casablanca',
      capacity: 300,
      price: 50
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call for reservation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Demande de réservation envoyée",
        description: "Nous vous enverrons un devis détaillé par email sous 24h.",
      });

      // Reset form
      setFormData({
        sessionId: '',
        studentCount: '',
        accompanistCount: '',
        schoolName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: ''
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedSession = sessions.find(s => s.id === formData.sessionId);
  const totalStudents = parseInt(formData.studentCount) || 0;
  const totalAccompanists = parseInt(formData.accompanistCount) || 0;
  const totalSeats = totalStudents + totalAccompanists;
  const totalPrice = selectedSession ? totalSeats * selectedSession.price : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4 font-heading">
            Réservation - Le Petit Prince
          </h1>
          <p className="text-muted-foreground text-lg">
            Réservez votre spectacle pour une expérience inoubliable
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spectacle Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/assets/img/affiche LPP VF .jpeg" 
                    alt="Le Petit Prince"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-center">Le Petit Prince</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>50 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>À partir de 7 ans</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="h-4 w-4 text-primary" />
                  <span>50 MAD par personne</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Une adaptation poétique et philosophique du chef-d'œuvre de Saint-Exupéry, 
                  explorant les thèmes de l'amitié, de l'amour et de la sagesse.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reservation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de Réservation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Session Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="session">Choisir une séance *</Label>
                    <Select value={formData.sessionId} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, sessionId: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une séance" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {session.date} à {session.time}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {session.venue}, {session.city}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Participant Counts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="students">Nombre d'élèves *</Label>
                      <Input
                        id="students"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.studentCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, studentCount: e.target.value }))}
                        placeholder="Ex: 25"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accompanists">Accompagnateurs</Label>
                      <Input
                        id="accompanists"
                        type="number"
                        min="0"
                        max="20"
                        value={formData.accompanistCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, accompanistCount: e.target.value }))}
                        placeholder="Ex: 3"
                      />
                    </div>
                  </div>

                  {/* School Information */}
                  <div className="space-y-2">
                    <Label htmlFor="school">Nom de l'établissement *</Label>
                    <Input
                      id="school"
                      value={formData.schoolName}
                      onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                      placeholder="Ex: École Primaire Al Massira"
                      required
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Nom du contact *</Label>
                      <Input
                        id="contact-name"
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="Ex: Mme Fatima Alami"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Téléphone *</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="Ex: +212 6 12 34 56 78"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="Ex: contact@ecole.ma"
                      required
                    />
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="requests">Demandes spéciales</Label>
                    <Textarea
                      id="requests"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Accessibilité, besoins particuliers, questions..."
                      rows={3}
                    />
                  </div>

                  {/* Summary */}
                  {selectedSession && totalSeats > 0 && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-3">Récapitulatif</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Séance:</span>
                            <span>{selectedSession.date} à {selectedSession.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lieu:</span>
                            <span>{selectedSession.venue}, {selectedSession.city}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Élèves:</span>
                            <span>{totalStudents}</span>
                          </div>
                          {totalAccompanists > 0 && (
                            <div className="flex justify-between">
                              <span>Accompagnateurs:</span>
                              <span>{totalAccompanists}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total places:</span>
                            <span>{totalSeats}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold text-primary">
                            <span>Prix total:</span>
                            <span>{totalPrice.toFixed(2)} MAD HT</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading || !formData.sessionId || !formData.studentCount}
                  >
                    {loading ? 'Envoi en cours...' : 'Demander un devis'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LePetitPrinceReservation;
