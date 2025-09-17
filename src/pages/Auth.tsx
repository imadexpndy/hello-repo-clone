import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RegistrationForm } from '@/components/RegistrationForm';
import { ConsentForm } from '@/components/ConsentForm';
import { LogIn, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cleanupAuthState } from '@/lib/authCleanup';
const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'consent' | 'reset-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [setupToken, setSetupToken] = useState('');
  const [adminFullName, setAdminFullName] = useState('Administrator');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Check URL parameters to set initial mode
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    const adminParam = urlParams.get('admin');
    const returnUrl = urlParams.get('return_url');
    
    // If user is already logged in and has return_url, redirect immediately
    if (user && returnUrl) {
      console.log('User already logged in with return_url, redirecting immediately');
      const decodedReturnUrl = decodeURIComponent(returnUrl);
      const separator = decodedReturnUrl.includes('?') ? '&' : '?';
      const redirectUrl = `${decodedReturnUrl}${separator}logged_in=true&user_email=${encodeURIComponent(user.email || '')}&user_name=${encodeURIComponent(user.user_metadata?.full_name || user.email || '')}`;
      
      toast({
        title: "Déjà connecté",
        description: "Redirection vers EDJS...",
      });
      
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 500);
      return;
    }
    
    if (modeParam === 'register') {
      setMode('register');
    } else if (modeParam === 'reset-password') {
      setMode('reset-password');
    } else if (modeParam === 'admin' || adminParam === 'true') {
      setMode('login');
      // Focus on admin login
      setEmail('admin@edjs.art');
      
      // Check if admin access is granted
      const adminAccess = sessionStorage.getItem('adminAccess');
      const adminTimestamp = sessionStorage.getItem('adminTimestamp');
      const currentTime = Date.now();
      
      // If admin access is valid (within 1 hour), redirect to admin
      if (adminAccess === 'true' && adminTimestamp && 
          (currentTime - parseInt(adminTimestamp)) < 3600000) {
        navigate('/admin');
      }
    }
  }, [navigate, user]);

  useEffect(() => {
    if (user) {
      // Check if we have a return_url - if so, skip profile checks and redirect back to EDJS
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('return_url');
      
      console.log('Auth useEffect - Current URL:', window.location.href);
      console.log('Auth useEffect - return_url parameter:', returnUrl);
      console.log('Auth useEffect - User:', user.email);
      
      if (returnUrl) {
        console.log('Auth useEffect - Redirecting back to EDJS');
        // User came from EDJS - redirect back immediately
        const decodedReturnUrl = decodeURIComponent(returnUrl);
        const separator = decodedReturnUrl.includes('?') ? '&' : '?';
        const redirectUrl = `${decodedReturnUrl}${separator}logged_in=true&user_email=${encodeURIComponent(user.email || '')}&user_name=${encodeURIComponent(user.user_metadata?.full_name || user.email || '')}`;
        
        console.log('Auth useEffect - Redirect URL:', redirectUrl);
        
        toast({
          title: "Connexion réussie",
          description: "Redirection vers EDJS...",
        });
        
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
        return;
      }
      
      console.log('Auth useEffect - No return_url, proceeding with normal flow');
      // Add a small delay to ensure auth state is fully loaded
      setTimeout(() => {
        checkUserConsent();
      }, 500);
    }
  }, [user]);

  const checkUserConsent = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('privacy_accepted, terms_accepted')
      .eq('user_id', user.id)
      .single();

    if (profile && (!profile.privacy_accepted || !profile.terms_accepted)) {
      setNeedsConsent(true);
      setMode('consent');
    } else {
      redirectUser();
    }
  };

  const redirectUser = async () => {
    // Check for return URL from EDJS website
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return_url');
    
    if (returnUrl) {
      // Get user profile to determine user type
      const { data: profile } = await supabase
        .from('profiles')
        .select('admin_role')
        .eq('user_id', user?.id)
        .single();
      
      // User came from EDJS website - redirect back with login confirmation
      const decodedReturnUrl = decodeURIComponent(returnUrl);
      const separator = decodedReturnUrl.includes('?') ? '&' : '?';
      
      // Determine user type and professional type for EDJS
      let userType = 'particulier';
      let professionalType = '';
      
      if (profile) {
        switch (profile.admin_role) {
          case 'scolaire-privee':
            userType = 'professional';
            professionalType = 'scolaire-privee';
            break;
          case 'scolaire-publique':
            userType = 'professional';
            professionalType = 'scolaire-publique';
            break;
          case 'association':
            userType = 'professional';
            professionalType = 'association';
            break;
          case 'b2c_user':
          default:
            userType = 'particulier';
            break;
        }
      }
      
      const redirectUrl = `${decodedReturnUrl}${separator}logged_in=true&user_email=${encodeURIComponent(user?.email || '')}&user_name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email || '')}&user_type=${encodeURIComponent(userType)}&professional_type=${encodeURIComponent(professionalType)}`;
      
      console.log('Redirecting back to EDJS with auth confirmation:', redirectUrl);
      console.log('User type:', userType, 'Professional type:', professionalType);
      
      toast({
        title: "Connexion réussie",
        description: "Redirection vers EDJS...",
      });
      
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('admin_role, verification_status')
      .eq('user_id', user!.id)
      .single();

    if (profile) {
      if (profile.verification_status === 'pending') {
        toast({
          title: "Compte en attente",
          description: "Votre compte est en cours de vérification",
        });
        return;
      }

      const role = profile.admin_role || 'b2c_user';
      console.log('Redirecting user with role:', role);
      
      switch (role) {
        case 'admin_full':
        case 'super_admin':
          navigate('/admin');
          break;
        case 'scolaire-privee':
        case 'scolaire-publique':
          navigate('/teacher');
          break;
        case 'association':
          navigate('/association');
          break;
        case 'partner':
          navigate('/partner');
          break;
        case 'b2c_user':
        default:
          navigate('/b2c');
          break;
      }
    } else {
      // If no profile found, default to b2c dashboard
      console.log('No profile found, redirecting to b2c dashboard');
      navigate('/b2c');
    }
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Clean up any stale auth state to avoid limbo
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' } as any);
    } catch {}

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive"
        });
      } else if (error.message.includes('Email not confirmed')) {
        toast({
          title: "Email non confirmé",
          description: "Veuillez vérifier votre email et cliquer sur le lien de confirmation",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
      }
    } else if (data?.user) {
      toast({ title: "Connexion réussie", description: "Bienvenue !" });
      // Check for return URL before redirecting
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('return_url');
      
      if (returnUrl) {
        // User came from EDJS - redirect back immediately
        const decodedReturnUrl = decodeURIComponent(returnUrl);
        const separator = decodedReturnUrl.includes('?') ? '&' : '?';
        const redirectUrl = `${decodedReturnUrl}${separator}logged_in=true&user_email=${encodeURIComponent(data.user.email || '')}&user_name=${encodeURIComponent(data.user.user_metadata?.full_name || data.user.email || '')}`;
        
        toast({
          title: "Connexion réussie",
          description: "Redirection vers EDJS...",
        });
        
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
        return;
      }
      
      // No return_url, proceed with normal user redirect
      checkUserConsent();
    }
  } catch (error: any) {
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};

  const createAdmin = async () => {
    if (!adminEmail || !adminPassword) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir l'email et le mot de passe pour l'administrateur.",
        variant: "destructive"
      });
      return;
    }
    
    // Enhanced super admin protection - multiple validation layers
    const expectedToken = "ce1418a6e0aa621aac24c26ae6e1bf717d729374aa06d74f4660a39f28ebcd22";
    const superAdminPassword = "EDJS_SUPER_ADMIN_2024_SECURE_ACCESS";
    
    if (setupToken !== expectedToken) {
      toast({
        title: "Token invalide",
        description: "Le token d'administration fourni n'est pas valide.",
        variant: "destructive"
      });
      return;
    }

    // Additional password check for super admin creation
    if (adminPassword !== superAdminPassword) {
      toast({
        title: "Mot de passe super admin incorrect",
        description: "Le mot de passe pour créer un super administrateur n'est pas correct.",
        variant: "destructive"
      });
      return;
    }

    // Check if super admin already exists
    const { data: existingSuperAdmin, error: checkSuperAdminError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('admin_role', 'super_admin')
      .limit(1);

    if (checkSuperAdminError) {
      console.error('Error checking existing super admin:', checkSuperAdminError);
    } else if (existingSuperAdmin && existingSuperAdmin.length > 0) {
      toast({
        title: "Super administrateur existant",
        description: "Un super administrateur existe déjà. Un seul super admin est autorisé.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Creating admin with:', { email: adminEmail, adminFullName });
    setLoading(true);
    try {
      // First, try to create the profile directly in the database
      // Generate a UUID for the admin user
      const adminUserId = crypto.randomUUID();
      
      // Create profile directly without auth user first
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: adminUserId,
          email: adminEmail,
          admin_role: 'super_admin',
          first_name: (adminFullName || 'Administrator').split(' ')[0],
          last_name: (adminFullName || 'Administrator').split(' ').slice(1).join(' ') || '',
          full_name: adminFullName || 'Administrator',
          is_verified: true,
          verification_status: 'approved',
          privacy_accepted: true,
          terms_accepted: true
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // If profile creation fails, continue with normal signup
      }

      // Check if email already exists first
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', adminEmail);

      if (checkError) {
        console.error('Error checking existing email:', checkError);
      } else if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà utilisé. Veuillez utiliser un autre email.",
          variant: "destructive"
        });
        return;
      }

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback${window.location.search}`,
          data: {
            full_name: adminFullName || 'Administrator',
            email_confirm: false // Try to bypass email confirmation
          }
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        
        // If user already exists, show duplicate email message
        if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          toast({
            title: "Email déjà utilisé",
            description: "Cet email est déjà utilisé. Veuillez utiliser un autre email.",
            variant: "destructive"
          });
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      console.log('User created successfully:', authData.user.id);

      // Update the profile with the real user ID
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: authData.user.id,
          email: adminEmail,
          admin_role: 'super_admin',
          first_name: (adminFullName || 'Administrator').split(' ')[0],
          last_name: (adminFullName || 'Administrator').split(' ').slice(1).join(' ') || '',
          full_name: adminFullName || 'Administrator',
          is_verified: true,
          verification_status: 'approved',
          privacy_accepted: true,
          terms_accepted: true
        }, { onConflict: 'user_id' });

      if (updateError) {
        console.error('Profile update error:', updateError);
      }

      // Check if we have a session (no email confirmation required)
      if (authData.session) {
        toast({
          title: "Admin créé et connecté",
          description: "Redirection vers le tableau de bord admin...",
        });
        // Force redirect to admin
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        toast({
          title: "Admin créé - Connexion manuelle",
          description: "Le compte admin a été créé. Connectez-vous maintenant avec vos identifiants (ignorez l'email de vérification).",
          variant: "default"
        });
        setShowAdminSetup(false);
        setEmail(adminEmail);
        setPassword(adminPassword);
      }
      
    } catch (err: any) {
      console.error('Full admin creation error:', err);
      
      let errorMessage = "Échec de la création";
      if (err.message) {
        errorMessage = err.message;
      }
      
      toast({ 
        title: "Erreur de création admin", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConsentComplete = () => {
    setNeedsConsent(false);
    redirectUser();
  };

  if (needsConsent && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <ConsentForm onConsentComplete={handleConsentComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/8 via-primary/4 to-primary/12 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-primary-glow/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      
      <div className={`w-full relative z-10 ${mode === 'register' ? 'max-w-none' : 'max-w-md'} ${mode === 'login' ? 'mt-16' : ''}`}>
        {mode === 'login' && (
          <Card className="backdrop-blur-xl bg-primary/8 border-primary/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/12 rounded-xl pointer-events-none" />
            
            <CardHeader className="text-center relative pb-8 pt-12">
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/b82bf764-c505-4dd6-960c-99a6acf57b3e.png" 
                  alt="L'École du Jeune Spectateur" 
                  className="h-16 w-auto mx-auto drop-shadow-lg"
                />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary-glow bg-clip-text text-transparent">
                Connexion
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-3">
                Connectez-vous à votre espace personnel
              </CardDescription>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-4" />
            </CardHeader>
            
            <CardContent className="relative px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">Mot de passe</Label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                      onClick={async () => {
                        if (!email) {
                          toast({
                            title: "Email requis",
                            description: "Veuillez entrer votre email d'abord",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        try {
                          const { error } = await supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: `${window.location.origin}/auth?mode=reset-password`,
                          });
                          
                          if (error) throw error;
                          
                          toast({
                            title: "Email envoyé",
                            description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
                          });
                        } catch (error: any) {
                          toast({
                            title: "Erreur",
                            description: error.message || "Impossible d'envoyer l'email de réinitialisation",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="glow"
                  size="xl"
                  className="w-full mt-8" 
                  disabled={loading}
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-primary/5 text-muted-foreground">Nouveau sur EDJS ?</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setMode('register')}
                  className="mt-6 w-full h-12 border-2 hover:border-primary/50 hover:bg-primary/5"
                >
                  <UserPlus className="mr-3 h-5 w-5" />
                  Créer un compte
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {mode === 'register' && (
          <RegistrationForm onBack={() => setMode('login')} />
        )}

        {mode === 'reset-password' && (
          <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
            <CardHeader className="text-center pb-4 bg-gradient-to-br from-primary/10 to-primary-glow/10">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Nouveau mot de passe
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Choisissez un nouveau mot de passe sécurisé
              </CardDescription>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-4" />
            </CardHeader>
            
            <CardContent className="relative px-8 pb-8">
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (newPassword !== confirmPassword) {
                  toast({
                    title: "Erreur",
                    description: "Les mots de passe ne correspondent pas",
                    variant: "destructive",
                  });
                  return;
                }
                
                if (newPassword.length < 6) {
                  toast({
                    title: "Erreur",
                    description: "Le mot de passe doit contenir au moins 6 caractères",
                    variant: "destructive",
                  });
                  return;
                }
                
                setLoading(true);
                try {
                  const { error } = await supabase.auth.updateUser({
                    password: newPassword
                  });
                  
                  if (error) throw error;
                  
                  toast({
                    title: "Mot de passe mis à jour",
                    description: "Votre mot de passe a été changé avec succès",
                  });
                  
                  setMode('login');
                  setNewPassword('');
                  setConfirmPassword('');
                } catch (error: any) {
                  toast({
                    title: "Erreur",
                    description: error.message || "Impossible de mettre à jour le mot de passe",
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium text-foreground">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 bg-primary/5 border-2 border-primary/20 focus:border-primary/50 focus:bg-primary/8 transition-all duration-300 rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="glow"
                  size="xl"
                  className="w-full mt-8" 
                  disabled={loading}
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setMode('login')}
                  className="w-full h-12 border-2 hover:border-primary/50 hover:bg-primary/5"
                >
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showAdminSetup} onOpenChange={setShowAdminSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer l'administrateur</DialogTitle>
            <DialogDescription>
              Utilisera l'email et le mot de passe saisis ci-dessus. Entrez le token de configuration pour valider.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="setup-token">Token de configuration</Label>
              <Input
                id="setup-token"
                type="password"
                value={setupToken}
                onChange={(e) => setSetupToken(e.target.value)}
                placeholder="Collez le token ADMIN_SETUP_TOKEN"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email administrateur</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Mot de passe administrateur</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Mot de passe sécurisé"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full-name">Nom complet (optionnel)</Label>
              <Input
                id="full-name"
                value={adminFullName}
                onChange={(e) => setAdminFullName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdminSetup(false)}>Annuler</Button>
            <Button variant="glow" onClick={createAdmin} disabled={loading || !setupToken || !adminEmail || !adminPassword}>
              {loading ? 'Création...' : "Créer l'admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Auth;