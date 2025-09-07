import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Settings, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  
  const notifications = [
    {
      id: 1,
      title: 'Confirmation de réservation',
      message: 'Votre réservation pour "Le Petit Prince" le 15 Mars 2024 à 14h00 est confirmée.',
      type: 'success',
      date: '2024-03-14T10:30:00',
      read: false,
      category: 'reservation'
    },
    {
      id: 2,
      title: 'Nouveau devis disponible',
      message: 'Le devis DEV-2024-003 pour "Charlotte" est maintenant disponible dans votre espace.',
      type: 'info',
      date: '2024-03-13T15:45:00',
      read: false,
      category: 'quote'
    },
    {
      id: 3,
      title: 'Rappel de paiement',
      message: 'La facture FAC-2024-002 arrive à échéance dans 7 jours.',
      type: 'warning',
      date: '2024-03-12T09:15:00',
      read: true,
      category: 'payment'
    },
    {
      id: 4,
      title: 'Nouvelle offre spéciale',
      message: 'Profitez de 15% de réduction sur toutes les réservations de groupe pour le mois d\'avril.',
      type: 'promotion',
      date: '2024-03-10T16:20:00',
      read: true,
      category: 'offer'
    },
    {
      id: 5,
      title: 'Mise à jour du programme',
      message: 'Le spectacle "Tara sur la Lune" a été reprogrammé au 25 Mars 2024.',
      type: 'info',
      date: '2024-03-08T11:00:00',
      read: false,
      category: 'program'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'promotion': return '🎁';
      default: return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Restez informé de toutes les actualités</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Non lues</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lues</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toutes
        </Button>
        <Button 
          variant={filter === 'unread' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Non lues ({unreadCount})
        </Button>
        <Button 
          variant={filter === 'reservation' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('reservation')}
        >
          Réservations
        </Button>
        <Button 
          variant={filter === 'payment' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('payment')}
        >
          Paiements
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm">
          <Check className="h-4 w-4 mr-2" />
          Tout marquer comme lu
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer les lues
        </Button>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les notifications</CardTitle>
          <CardDescription>Gérez vos notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications
              .filter(notification => {
                if (filter === 'all') return true;
                if (filter === 'unread') return !notification.read;
                return notification.category === filter;
              })
              .map((notification) => (
              <div 
                key={notification.id} 
                className={`border rounded-lg p-4 transition-colors ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                      <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">{formatDate(notification.date)}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!notification.read && (
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
