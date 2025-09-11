import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DashboardCard } from '@/components/DashboardCard';
import { StatsCard } from '@/components/StatsCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Theater,
  Calendar,
  Users,
  ClipboardList,
  Building2,
  Mail,
  Shield,
  BarChart3,
  Settings,
  UserCheck,
  Ticket,
  TrendingUp,
  Eye,
  Key
} from 'lucide-react';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    spectacles: 0,
    sessions: 0,
    users: 0,
    bookings: 0,
    pendingRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch spectacles count
      const { count: spectaclesCount } = await supabase
        .from('spectacles')
        .select('*', { count: 'exact', head: true });

      // Fetch sessions count
      const { count: sessionsCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch bookings count
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Fetch pending registrations count
      const { count: pendingCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('verification_status', ['pending', 'under_review']);

      setStats({
        spectacles: spectaclesCount || 0,
        sessions: sessionsCount || 0,
        users: usersCount || 0,
        bookings: bookingsCount || 0,
        pendingRegistrations: pendingCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les statistiques',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => window.location.href = '/admin/spectacles'}>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau spectacle
      </Button>
      <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/sessions'}>
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle session
      </Button>
    </div>
  );

  return (
    <DashboardLayout 
      title="Tableau de bord administrateur"
      subtitle={`Bienvenue, ${profile?.full_name || profile?.first_name || 'Administrateur'}`}
      headerActions={headerActions}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Spectacles actifs"
          value={loading ? "..." : stats.spectacles.toString()}
          icon={Theater}
          description={stats.spectacles === 0 ? "Aucun spectacle actif" : `${stats.spectacles} spectacle${stats.spectacles > 1 ? 's' : ''} actif${stats.spectacles > 1 ? 's' : ''}`}
        />
        <StatsCard
          title="Sessions planifiées"
          value={loading ? "..." : stats.sessions.toString()}
          icon={Calendar}
          description={stats.sessions === 0 ? "Aucune session planifiée" : `${stats.sessions} session${stats.sessions > 1 ? 's' : ''} planifiée${stats.sessions > 1 ? 's' : ''}`}
        />
        <StatsCard
          title="Utilisateurs actifs"
          value={loading ? "..." : stats.users.toString()}
          icon={Users}
          description={stats.users === 0 ? "Aucun utilisateur enregistré" : `${stats.users} utilisateur${stats.users > 1 ? 's' : ''} enregistré${stats.users > 1 ? 's' : ''}`}
        />
        <StatsCard
          title="Réservations totales"
          value={loading ? "..." : stats.bookings.toString()}
          icon={Ticket}
          description={stats.bookings === 0 ? "Aucune réservation" : `${stats.bookings} réservation${stats.bookings > 1 ? 's' : ''}`}
        />
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Gestion des spectacles"
          description="Créer, modifier et gérer tous les spectacles de la programmation"
          icon={Theater}
          href="/admin/spectacles"
          buttonText="Gérer les spectacles"
          gradient={true}
          badge={loading ? "..." : `${stats.spectacles} actifs`}
        />

        <DashboardCard
          title="Sessions et horaires"
          description="Planifier les sessions, définir les horaires et gérer les capacités"
          icon={Calendar}
          href="/admin/sessions"
          buttonText="Gérer les sessions"
          badge={loading ? "..." : `${stats.sessions} sessions`}
        />

        <DashboardCard
          title="Réservations"
          description="Voir toutes les réservations, statuts de paiement et validation"
          icon={ClipboardList}
          href="/admin/bookings"
          buttonText="Voir les réservations"
          badge={loading ? "..." : `${stats.bookings} réservations`}
          badgeVariant="secondary"
        />
      </div>

      {/* Secondary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Organisations"
          description="Écoles et associations partenaires"
          icon={Building2}
          href="/admin/organizations"
          buttonText="Voir"
        />

        <DashboardCard
          title="Demandes d'inscription"
          description="Gérer les demandes d'inscription en attente"
          icon={UserCheck}
          href="/admin/registrations"
          buttonText="Gérer"
          badge={loading ? "..." : `${stats.pendingRegistrations} en attente`}
          badgeVariant={stats.pendingRegistrations > 0 ? "destructive" : "secondary"}
        />

        <DashboardCard
          title="Communications"
          description="Historique emails et WhatsApp"
          icon={Mail}
          href="/admin/communications"
          buttonText="Historique"
        />

        <DashboardCard
          title="Audit & Logs"
          description="Logs d'activité et sécurité"
          icon={Shield}
          href="/admin/audit"
          buttonText="Consulter"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Statistiques avancées"
          description="Tableaux de bord détaillés et métriques de performance"
          icon={BarChart3}
          href="/admin/analytics"
          buttonText="Voir les stats"
          gradient={true}
        >
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span>Aucune donnée disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-400" />
              <span>0 vues de spectacles</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Clés API"
          description="Générer et gérer les clés API pour l'accès mobile"
          icon={Key}
          href="/admin/api-keys"
          buttonText="Gérer les clés"
          gradient={true}
        >
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Accès complet aux données</p>
            <p>• Intégration mobile et externe</p>
            <p>• Gestion des permissions</p>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Paramètres système"
          description="Configuration générale, tarifs et paramètres avancés"
          icon={Settings}
          href="/admin/settings"
          buttonText="Configurer"
        >
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Gestion des rôles et permissions</p>
            <p>• Configuration des paiements</p>
            <p>• Paramètres de notification</p>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}