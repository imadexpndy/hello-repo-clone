import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { HeadphonesIcon, MessageSquare, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SupportPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Notre équipe vous répondra dans les plus brefs délais.",
    });
    setFormData({ subject: '', message: '', priority: 'normal' });
  };

  const faqItems = [
    {
      question: "Comment modifier ma réservation ?",
      answer: "Vous pouvez modifier votre réservation depuis la page 'Mes Réservations' en cliquant sur le bouton 'Modifier'."
    },
    {
      question: "Puis-je annuler ma réservation ?",
      answer: "Oui, vous pouvez annuler votre réservation jusqu'à 48h avant la représentation."
    },
    {
      question: "Comment recevoir mon billet ?",
      answer: "Votre billet électronique sera envoyé par email après confirmation du paiement."
    },
    {
      question: "Que faire en cas de retard ?",
      answer: "Contactez-nous immédiatement. L'accès peut être refusé après le début du spectacle."
    }
  ];

  return (
    <DashboardLayout title="Support & Aide" subtitle="Nous sommes là pour vous aider">
      <div className="space-y-6">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Téléphone</h3>
              <p className="text-sm text-gray-600 mb-3">Lun-Ven 9h-18h</p>
              <p className="font-medium">+212 5XX XX XX XX</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-gray-600 mb-3">Réponse sous 24h</p>
              <p className="font-medium">support@edjs.art</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Chat en direct</h3>
              <p className="text-sm text-gray-600 mb-3">Lun-Ven 9h-17h</p>
              <Button size="sm">Démarrer le chat</Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeadphonesIcon className="h-5 w-5 mr-2" />
              Contactez-nous
            </CardTitle>
            <CardDescription>
              Décrivez votre problème et nous vous répondrons rapidement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Résumé de votre demande"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Faible</option>
                    <option value="normal">Normale</option>
                    <option value="high">Élevée</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Décrivez votre problème en détail..."
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Fréquentes</CardTitle>
            <CardDescription>
              Trouvez rapidement des réponses aux questions les plus courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    {item.question}
                  </h4>
                  <p className="text-gray-600 ml-6">{item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Heures d'ouverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>10h00 - 16h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statut du service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Réservations en ligne</span>
                  <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Support téléphonique</span>
                  <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chat en direct</span>
                  <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportPage;
