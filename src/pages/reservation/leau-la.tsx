import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin, Euro } from 'lucide-react';

const LeauLaReservation = () => {
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
      id: 'leau-1',
      date: '8 Novembre 2026',
      time: '15:00',
      venue: 'Théâtre Bahnini',
      city: 'Rabat',
      capacity: 200,
      price: 50,
      audienceType: 'tout-public'
    },
    {
      id: 'leau-6',
      date: '13 Novembre 2026',
      time: '09:30',
      venue: 'Complexe El Hassani',
      city: 'Casablanca',
      capacity: 150,
      price: 100,
      audienceType: 'scolaire-privee'
    },
    {
      id: 'leau-7',
      date: '13 Novembre 2026',
      time: '14:30',
      venue: 'Complexe El Hassani',
      city: 'Casablanca',
      capacity: 150,
      price: 100,
      audienceType: 'scolaire-privee'
    },
    {
      id: 'leau-11',
      date: '15 Novembre 2026',
      time: '15:00',
      venue: 'Complexe El Hassani',
      city: 'Casablanca',
      capacity: 200,
      price: 50,
      audienceType: 'tout-public'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Réservation confirmée",
        description: "Votre réservation pour L'Eau Là a été enregistrée avec succès.",
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
        description: "Une erreur est survenue lors de la réservation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedSession = sessions.find(s => s.id === formData.sessionId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-2">L'Eau Là</h1>
          <p className="text-teal-600">Réservation de spectacle</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sessions disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Calendar className="w-5 h-5" />
                Séances disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.sessionId === session.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                  onClick={() => setFormData({ ...formData, sessionId: session.id })}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">{session.date}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {session.city}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{session.venue}</div>
                      <div className="text-xs text-teal-600 mt-1 capitalize">{session.audienceType}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-teal-600 font-semibold">
                        <Euro className="w-4 h-4" />
                        {session.price} DH
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        {session.capacity} places
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Formulaire de réservation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-700">Informations de réservation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentCount">Nombre d'élèves</Label>
                    <Input
                      id="studentCount"
                      type="number"
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accompanistCount">Accompagnateurs</Label>
                    <Input
                      id="accompanistCount"
                      type="number"
                      value={formData.accompanistCount}
                      onChange={(e) => setFormData({ ...formData, accompanistCount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="schoolName">Nom de l'établissement</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactName">Nom du contact</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Téléphone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests">Demandes spéciales</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Besoins particuliers, allergies, etc."
                  />
                </div>

                {selectedSession && (
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h3 className="font-semibold text-teal-800 mb-2">Récapitulatif</h3>
                    <div className="text-sm text-teal-700">
                      <p><strong>Séance:</strong> {selectedSession.date} à {selectedSession.time}</p>
                      <p><strong>Lieu:</strong> {selectedSession.venue}, {selectedSession.city}</p>
                      <p><strong>Prix:</strong> {selectedSession.price} DH par personne</p>
                      {formData.studentCount && (
                        <p><strong>Total estimé:</strong> {parseInt(formData.studentCount) * selectedSession.price} DH</p>
                      )}
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={loading || !formData.sessionId}
                >
                  {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeauLaReservation;
