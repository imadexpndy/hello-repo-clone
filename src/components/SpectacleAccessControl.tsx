import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle, XCircle, Mail } from 'lucide-react';

interface SpectacleAccessControlProps {
  children: React.ReactNode;
}

interface SchoolInfo {
  id: string;
  name: string;
  type: 'public_school' | 'private_school';
}

export const SpectacleAccessControl: React.FC<SpectacleAccessControlProps> = ({ children }) => {
  const { profile, user } = useAuth();
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            organizations (
              name,
              type
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Set up real-time subscription for profile updates
    const subscription = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log('Profile updated:', payload);
          // Refetch user profile when verification status changes
          fetchUserProfile();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Allow access for non-teacher roles (B2C, associations, partners, admins)
  if (!profile?.role?.includes('teacher')) {
    return <>{children}</>;
  }

  // Allow immediate access for private school teachers - no approval needed
  if (profile?.role === 'teacher_private') {
    return <>{children}</>;
  }

  // For public school teachers, check verification status
  if (profile?.role === 'teacher_public') {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p>Vérification du statut...</p>
          </div>
        </div>
      );
    }

    // Check if user is verified
    if (profile.is_verified && profile.verification_status === 'approved') {
      return <>{children}</>;
    }

    // Show appropriate message based on verification status
    const getStatusMessage = () => {
      switch (profile.verification_status) {
        case 'pending':
          return {
            icon: <Clock className="h-5 w-5 text-yellow-600" />,
            title: "Demande en cours d'examen",
            description: "Votre demande d'inscription est en cours d'examen par notre équipe. Vous recevrez une notification par email une fois votre compte approuvé.",
            variant: "default" as const,
            badge: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>
          };
        case 'under_review':
          return {
            icon: <Clock className="h-5 w-5 text-blue-600" />,
            title: "Examen en cours",
            description: "Notre équipe examine actuellement votre demande d'inscription. Ce processus peut prendre 1-2 jours ouvrables.",
            variant: "default" as const,
            badge: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours d'examen</Badge>
          };
        case 'rejected':
          return {
            icon: <XCircle className="h-5 w-5 text-red-600" />,
            title: "Demande rejetée",
            description: "Votre demande d'inscription n'a pas pu être approuvée. Veuillez contacter notre support pour plus d'informations.",
            variant: "destructive" as const,
            badge: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejetée</Badge>
          };
        default:
          return {
            icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
            title: "Vérification requise",
            description: "Votre compte nécessite une vérification avant d'accéder aux spectacles. Veuillez compléter votre profil.",
            variant: "default" as const,
            badge: <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Non vérifié</Badge>
          };
      }
    };

    const statusMessage = getStatusMessage();

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {statusMessage.icon}
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              {statusMessage.title}
              {statusMessage.badge}
            </CardTitle>
            <CardDescription className="text-base">
              {statusMessage.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schoolInfo && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>École:</strong> {schoolInfo.name} (École Publique)
                  <br />
                  Les écoles publiques nécessitent une approbation administrative avant d'accéder aux spectacles.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Que faire en attendant ?
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Vérifiez votre email régulièrement pour les notifications</li>
                <li>• Assurez-vous que vos informations de profil sont complètes</li>
                <li>• Contactez notre support si vous avez des questions</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/profile'}
              >
                Voir mon profil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback for other cases
  return <>{children}</>;
};
