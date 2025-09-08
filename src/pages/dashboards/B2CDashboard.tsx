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
                <p className="text-2xl font-bold text-gray-900">0</p>
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
                <p className="text-2xl font-bold text-gray-900">0</p>
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
                <p className="text-2xl font-bold text-gray-900">0</p>
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
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune réservation pour le moment</p>
              <p className="text-sm">Découvrez nos spectacles pour commencer</p>
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
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun message pour le moment</p>
              <p className="text-sm">Les notifications apparaîtront ici</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}