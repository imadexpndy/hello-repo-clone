import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, User, Reply } from 'lucide-react';

const MessagesPage = () => {
  const [messages] = useState([
    {
      id: 1,
      subject: 'Confirmation de réservation',
      content: 'Votre réservation pour "Le Petit Prince" le 4 octobre 2025 à 15h00 est confirmée.',
      sender: 'Équipe EDJS',
      date: '2025-01-20',
      read: true,
      type: 'confirmation'
    },
    {
      id: 2,
      subject: 'Rappel de séance',
      content: 'N\'oubliez pas votre séance de "Tara sur la Lune" demain à 15h00 au Complexe El Hassani.',
      sender: 'Équipe EDJS',
      date: '2025-01-21',
      read: false,
      type: 'reminder'
    },
    {
      id: 3,
      subject: 'Nouvelle programmation disponible',
      content: 'Découvrez notre nouvelle programmation de spectacles pour la saison 2025.',
      sender: 'Équipe EDJS',
      date: '2025-01-18',
      read: true,
      type: 'info'
    }
  ]);

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case 'confirmation':
        return <Badge className="bg-green-100 text-green-800">Confirmation</Badge>;
      case 'reminder':
        return <Badge className="bg-yellow-100 text-yellow-800">Rappel</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Information</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <DashboardLayout 
      title="Messages" 
      subtitle={`${messages.length} messages${unreadCount > 0 ? ` (${unreadCount} non lus)` : ''}`}
    >
      <div className="space-y-6">
        {/* Messages Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total messages</p>
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Non lus</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Équipe EDJS</p>
                  <p className="text-lg font-bold text-gray-900">En ligne</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Vos messages
            </CardTitle>
            <CardDescription>
              Communications de l'équipe EDJS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 rounded-lg border transition-colors ${
                    !message.read 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-semibold ${!message.read ? 'text-blue-900' : 'text-gray-900'}`}>
                          {message.subject}
                        </h3>
                        {getMessageTypeBadge(message.type)}
                        {!message.read && (
                          <Badge variant="destructive" className="text-xs">Nouveau</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-4">{message.sender}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(message.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {message.content}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-1" />
                      Répondre
                    </Button>
                    {!message.read && (
                      <Button variant="ghost" size="sm">
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-center">Besoin d'aide ?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="sm">
                Contacter le support
              </Button>
              <Button variant="outline" size="sm">
                FAQ
              </Button>
              <Button variant="outline" size="sm">
                Signaler un problème
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
