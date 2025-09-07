import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HeadphonesIcon, Phone, Mail, MessageCircle, Clock, CheckCircle } from 'lucide-react';

export default function SupportPage() {
  const navigate = useNavigate();
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'normal',
    message: ''
  });

  const handleChatClick = () => {
    console.log('Chat button clicked');
    navigate('/messages');
  };

  const tickets = [
    {
      id: 'SUP-2024-001',
      subject: 'Problème de réservation',
      status: 'Ouvert',
      priority: 'Haute',
      date: '2024-03-15',
      lastUpdate: '2024-03-16'
    },
    {
      id: 'SUP-2024-002',
      subject: 'Question sur les tarifs',
      status: 'Résolu',
      priority: 'Normale',
      date: '2024-03-10',
      lastUpdate: '2024-03-12'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ouvert': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Résolu': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Normale': return 'bg-blue-100 text-blue-800';
      case 'Basse': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Client</h1>
        <p className="text-gray-600">Contactez notre équipe pour toute assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Contact Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeadphonesIcon className="h-5 w-5 mr-2" />
              Nous contacter
            </CardTitle>
            <CardDescription>Plusieurs moyens de nous joindre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <Phone className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="font-semibold">Téléphone</p>
                <p className="text-sm text-gray-600">+212 5 22 XX XX XX</p>
                <p className="text-xs text-gray-500">Lun-Ven: 9h-18h</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <Mail className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-gray-600">support@edjs.ma</p>
                <p className="text-xs text-gray-500">Réponse sous 24h</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <MessageCircle className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <p className="font-semibold">Chat en direct</p>
                <p className="text-sm text-gray-600">Assistance immédiate</p>
                <Button size="sm" className="mt-2" onClick={handleChatClick}>Démarrer le chat</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle>Créer un ticket</CardTitle>
            <CardDescription>Décrivez votre problème ou question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sujet</label>
              <Input
                placeholder="Décrivez brièvement votre problème"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Priorité</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
              >
                <option value="basse">Basse</option>
                <option value="normal">Normale</option>
                <option value="haute">Haute</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Décrivez votre problème en détail..."
                rows={4}
                value={ticketForm.message}
                onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
              />
            </div>
            
            <Button className="w-full">Envoyer le ticket</Button>
          </CardContent>
        </Card>
      </div>

      {/* My Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Mes tickets de support</CardTitle>
          <CardDescription>Suivez l'état de vos demandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Référence:</span> {ticket.id}
                      </div>
                      <div>
                        <span className="font-medium">Créé le:</span> {ticket.date}
                      </div>
                      <div>
                        <span className="font-medium">Dernière MAJ:</span> {ticket.lastUpdate}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
          <CardDescription>Trouvez rapidement des réponses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-2">Comment modifier une réservation ?</h4>
              <p className="text-sm text-gray-600">Vous pouvez modifier votre réservation jusqu'à 48h avant la représentation via votre espace partenaire.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-2">Quels sont les tarifs pour les groupes scolaires ?</h4>
              <p className="text-sm text-gray-600">Nous proposons des tarifs préférentiels pour les groupes de plus de 50 élèves. Contactez-nous pour un devis personnalisé.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold mb-2">Comment obtenir une facture ?</h4>
              <p className="text-sm text-gray-600">Les factures sont disponibles dans votre espace partenaire, section "Factures". Vous pouvez les télécharger en PDF.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
