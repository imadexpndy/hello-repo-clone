import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const QuickRoleSwitch = () => {
  const { toast } = useToast();

  const switchToTeacher = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Aucun utilisateur connecté",
          variant: "destructive",
        });
        return;
      }

      // Update profile to scolaire-publique
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'scolaire-publique',
          organization_type: 'public_school',
          organization_name: 'École Publique Test',
          verification_status: 'approved'
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating role:', error);
        toast({
          title: "Erreur",
          description: "Impossible de changer le rôle",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Rôle changé vers enseignant public",
      });

      // Force page reload to update role
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error in switchToTeacher:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const switchToB2C = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Aucun utilisateur connecté",
          variant: "destructive",
        });
        return;
      }

      // Update profile to b2c_user
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'b2c_user',
          organization_type: null,
          organization_name: null,
          verification_status: null
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating role:', error);
        toast({
          title: "Erreur",
          description: "Impossible de changer le rôle",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Rôle changé vers utilisateur B2C",
      });

      // Force page reload to update role
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error in switchToB2C:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Changer de Rôle (Dev)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={switchToTeacher}
          className="w-full"
          variant="default"
        >
          Passer en Enseignant Public
        </Button>
        <Button 
          onClick={switchToB2C}
          className="w-full"
          variant="outline"
        >
          Passer en Utilisateur B2C
        </Button>
      </CardContent>
    </Card>
  );
};
