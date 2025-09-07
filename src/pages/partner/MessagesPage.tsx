import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Search, Plus, Reply, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({ subject: '', message: '' });
  
  const messages = [
    {
      id: 1,
      subject: 'Confirmation de réservation - Le Petit Prince',
      sender: 'Équipe EDJS',
      date: '2024-03-15T14:30:00',
      preview: 'Votre réservation pour "Le Petit Prince" le 20 Mars 2024 est confirmée...',
      content: 'Bonjour,\n\nNous avons le plaisir de vous confirmer votre réservation pour le spectacle "Le Petit Prince" prévu le 20 Mars 2024 à 14h00.\n\nDétails de la réservation:\n- Spectacle: Le Petit Prince\n- Date: 20 Mars 2024\n- Heure: 14h00\n- Nombre d\'élèves: 120\n- Lieu: Théâtre EDJS, Casablanca\n\nMerci de votre confiance.\n\nCordialement,\nL\'équipe EDJS',
      read: false,
      type: 'confirmation'
    },
    {
      id: 2,
      subject: 'Nouveau devis disponible',
      sender: 'Service Commercial',
      date: '2024-03-14T11:20:00',
      preview: 'Le devis DEV-2024-003 pour votre demande est maintenant disponible...',
      content: 'Bonjour,\n\nVotre devis DEV-2024-003 pour le spectacle "Charlotte" est maintenant disponible dans votre espace partenaire.\n\nVous pouvez le consulter et le télécharger dans la section "Devis".\n\nN\'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nService Commercial EDJS',
      read: true,
      type: 'commercial'
    },
    {
      id: 3,
      subject: 'Rappel: Facture à régler',
      sender: 'Service Comptabilité',
      date: '2024-03-12T09:15:00',
      preview: 'La facture FAC-2024-002 arrive à échéance dans 7 jours...',
      content: 'Bonjour,\n\nNous vous rappelons que la facture FAC-2024-002 d\'un montant de 1,800 MAD arrive à échéance le 19 Mars 2024.\n\nMerci de procéder au règlement dans les délais.\n\nCordialement,\nService Comptabilité',
      read: true,
      type: 'billing'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'confirmation': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'billing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communiquez avec l'équipe EDJS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Boîte de réception
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouveau
                </Button>
              </div>
              <CardDescription>
                {unreadCount} message{unreadCount !== 1 ? 's' : ''} non lu{unreadCount !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-primary text-white'
                        : !message.read
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-medium text-sm truncate ${
                        selectedMessage?.id === message.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {message.subject}
                      </h4>
                      {!message.read && selectedMessage?.id !== message.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0"></div>
                      )}
                    </div>
                    <p className={`text-xs mb-1 ${
                      selectedMessage?.id === message.id ? 'text-white/80' : 'text-gray-600'
                    }`}>
                      {message.sender}
                    </p>
                    <p className={`text-xs truncate ${
                      selectedMessage?.id === message.id ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.preview}
                    </p>
                    <p className={`text-xs mt-1 ${
                      selectedMessage?.id === message.id ? 'text-white/60' : 'text-gray-400'
                    }`}>
                      {formatDate(message.date)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-gray-600">De: {selectedMessage.sender}</p>
                      <Badge className={getTypeColor(selectedMessage.type)}>
                        {selectedMessage.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(selectedMessage.date)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-1" />
                      Répondre
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4 mr-1" />
                      Archiver
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {selectedMessage.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sélectionnez un message
                </h3>
                <p className="text-gray-600">
                  Choisissez un message dans la liste pour le lire
                </p>
              </CardContent>
            </Card>
          )}

          {/* New Message Form */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Nouveau message</CardTitle>
              <CardDescription>Contactez l'équipe EDJS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sujet</label>
                <Input
                  placeholder="Objet de votre message"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Tapez votre message ici..."
                  rows={4}
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
                />
              </div>
              
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
