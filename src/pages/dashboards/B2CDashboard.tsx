import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Theater, ShoppingCart, Ticket, User, Calendar } from 'lucide-react';
import { QuickRoleSwitch } from '@/components/QuickRoleSwitch';
import { UserDropdown } from '@/components/UserDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function B2CDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Simple Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <img src="/assets/img/logo.svg" alt="EDJS" className="h-8 w-auto" />
            <p className="text-muted-foreground">
              Bonjour {profile?.full_name || profile?.first_name || 'Visiteur'} !
            </p>
          </div>
          <UserDropdown />
        </div>

        {/* Main Action - Big and Prominent */}
        <Card className="mb-8 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-8 text-center">
            <Theater className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Réserver des places</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos spectacles pour enfants et réservez vos places
            </p>
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/spectacles')}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Voir les spectacles
            </Button>
          </CardContent>
        </Card>

        {/* Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Ticket className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Mes billets</CardTitle>
              <CardDescription>Voir mes réservations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/my-reservations')}>Mes réservations</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Programme</CardTitle>
              <CardDescription>Dates et horaires</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Voir le calendrier</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Mon profil</CardTitle>
              <CardDescription>Mes informations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => navigate('/profile')}>Modifier</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}