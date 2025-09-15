import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        name: profile.name || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const oldData = { ...profile };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          name: formData.name,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Profile update logged automatically by Supabase

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const getUserTypeDisplayName = () => {
    // Use user_type as primary source, fallback to admin_role
    if (profile?.user_type) {
      const userTypeNames = {
        particulier: 'Client Particulier',
        teacher_private: 'École Privée',
        teacher_public: 'École Publique',
        association: 'Association'
      };
      return userTypeNames[profile.user_type as keyof typeof userTypeNames] || profile.user_type;
    }
    
    // Fallback to admin_role for backward compatibility
    const roleNames = {
      admin: 'Administrateur',
      teacher_private: 'Enseignant École Privée',
      teacher_public: 'Enseignant École Publique', 
      association: 'Association',
      partner: 'Partenaire',
      b2c_user: 'Client Particulier'
    };
    return roleNames[profile?.role as keyof typeof roleNames] || profile?.role || 'Non défini';
  };

  if (!profile) {
    return (
      <DashboardLayout title="Mon Profil" subtitle="Chargement...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mon Profil" subtitle="Gérez vos informations personnelles">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informations du compte</CardTitle>
                  <Badge variant={profile.is_verified ? "default" : "secondary"}>
                    {profile.is_verified ? 'Vérifié' : 'Non vérifié'}
                  </Badge>
                </div>
                <CardDescription>
                  Vos informations de base et rôle dans la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type d'utilisateur</Label>
                    <p className="text-sm">{getUserTypeDisplayName()}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID Utilisateur</Label>
                  <p className="text-xs font-mono text-muted-foreground">{profile.user_id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Editable Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Modifiez vos informations de contact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange('first_name')}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange('last_name')}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      placeholder="Nom complet affiché"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      placeholder="+212 6XX XX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleInputChange('whatsapp')}
                      placeholder="+212 6XX XX XX XX"
                    />
                    <p className="text-xs text-muted-foreground">
                      Utilisé pour les notifications WhatsApp
                    </p>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                  </Button>
                </form>
              </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}