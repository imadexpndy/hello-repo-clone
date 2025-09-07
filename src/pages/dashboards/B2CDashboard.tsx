import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Theater, ShoppingCart, Ticket, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function B2CDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout 
      title="Mon espace personnel"
      subtitle={`Bienvenue, ${profile?.full_name || profile?.first_name || 'Utilisateur'}`}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mes réservations</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prochaines séances</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Card */}
      <Card className="mb-8 border-primary/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <Theater className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">Découvrir nos spectacles</h3>
          <p className="text-muted-foreground mb-6">
            Explorez notre programmation et réservez vos places
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => navigate('/spectacles')}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Voir les spectacles
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Mes prochaines réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Le Petit Prince</p>
                  <p className="text-sm text-gray-600">15 Mars 2024 - 14h00</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmé</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Charlotte</p>
                  <p className="text-sm text-gray-600">22 Mars 2024 - 10h30</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">En attente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Confirmation de réservation</p>
                <p className="text-xs text-gray-600 mt-1">Votre réservation pour "Le Petit Prince" est confirmée</p>
                <p className="text-xs text-gray-500 mt-2">Il y a 2 heures</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Rappel de séance</p>
                <p className="text-xs text-gray-600 mt-1">N'oubliez pas votre séance de demain à 14h</p>
                <p className="text-xs text-gray-500 mt-2">Hier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}