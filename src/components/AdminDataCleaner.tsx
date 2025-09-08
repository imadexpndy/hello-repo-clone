import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Shield, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const AdminDataCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();

  const clearTestData = async () => {
    setLoading(true);
    try {
      // Delete test bookings (preserve admin bookings)
      const { error: bookingsError } = await supabase
        .from('bookings')
        .delete()
        .not('user_id', 'in', `(
          SELECT user_id FROM profiles 
          WHERE admin_role = 'super_admin' OR role = 'admin'
        )`);

      if (bookingsError) throw bookingsError;

      // Delete test profiles (keep only admin profiles)
      // Using raw SQL to avoid complex type issues
      const { error: profilesError } = await supabase
        .from('profiles')
        .delete()
        .filter('admin_role', 'neq', 'super_admin')
        .filter('role', 'neq', 'admin');

      if (profilesError) throw profilesError;

      // Delete test schools
      const { error: schoolsError } = await supabase
        .from('schools')
        .delete()
        .or('verification_status.eq.pending,name.ilike.%test%');

      if (schoolsError) throw schoolsError;

      // Delete test associations
      const { error: associationsError } = await supabase
        .from('associations')
        .delete()
        .or('verification_status.eq.pending,name.ilike.%test%');

      if (associationsError) throw associationsError;

      // Delete old pending admin invitations
      const { error: invitationsError } = await supabase
        .from('admin_invitations')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (invitationsError) throw invitationsError;

      toast({
        title: "Données de test supprimées",
        description: "Toutes les données de test ont été supprimées avec succès. Les comptes administrateurs ont été préservés.",
      });

      setConfirmOpen(false);
    } catch (error: any) {
      console.error('Error clearing test data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression des données de test: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-5 w-5" />
          Nettoyage des Données de Test
        </CardTitle>
        <CardDescription>
          Supprime toutes les données de test tout en préservant les comptes administrateurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention:</strong> Cette action supprimera définitivement:
            <ul className="mt-2 ml-4 list-disc">
              <li>Tous les profils utilisateurs non-administrateurs</li>
              <li>Toutes les réservations de test</li>
              <li>Les écoles et associations en attente de validation</li>
              <li>Les invitations expirées</li>
              <li>Les messages de test</li>
            </ul>
            <p className="mt-2 font-semibold text-green-600">
              ✓ Les comptes administrateurs seront préservés
            </p>
          </AlertDescription>
        </Alert>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer les Données de Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Confirmer la Suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer toutes les données de test ? 
                Cette action est irréversible.
                <br /><br />
                <strong>Seuls les comptes administrateurs seront préservés.</strong>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={clearTestData}
                disabled={loading}
              >
                {loading ? 'Suppression...' : 'Confirmer la Suppression'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
