import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return_url');
        
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Erreur de vérification",
            description: "Une erreur est survenue lors de la vérification de votre email.",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        if (data.session?.user) {
          // User is now authenticated after email verification
          console.log('Email verified successfully, user authenticated');
          
          // Get user profile to determine user type
          const { data: profile } = await supabase
            .from('profiles')
            .select('admin_role')
            .eq('user_id', data.session.user.id)
            .single();

          // Determine user type and professional type
          let userType = 'particulier';
          let professionalType = '';
          
          if (profile) {
            switch (profile.admin_role) {
              case 'teacher_private':
                userType = 'professional';
                professionalType = 'scolaire-privee';
                break;
              case 'teacher_public':
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

          // Store user type in sessionStorage for the reservation system
          sessionStorage.setItem('userType', userType);
          if (professionalType) {
            sessionStorage.setItem('professionalType', professionalType);
          }

          toast({
            title: "Email vérifié avec succès",
            description: "Votre compte est maintenant activé. Redirection vers votre réservation...",
          });

          // Check if we have a return URL (from the original reservation attempt)
          if (returnUrl) {
            const decodedReturnUrl = decodeURIComponent(returnUrl);
            
            // If it's an EDJS return URL, redirect back to EDJS with auth parameters
            if (decodedReturnUrl.includes('edjs.art')) {
              const separator = decodedReturnUrl.includes('?') ? '&' : '?';
              const redirectUrl = `${decodedReturnUrl}${separator}logged_in=true&user_email=${encodeURIComponent(data.session.user.email || '')}&user_name=${encodeURIComponent(data.session.user.user_metadata?.full_name || data.session.user.email || '')}&user_type=${encodeURIComponent(userType)}&professional_type=${encodeURIComponent(professionalType)}`;
              
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 1500);
              return;
            }
            
            // If it's a Hello Planet reservation URL, redirect there
            if (decodedReturnUrl.includes('/reservation/')) {
              setTimeout(() => {
                navigate(decodedReturnUrl.replace(window.location.origin, ''));
              }, 1500);
              return;
            }
          }

          // Default redirect based on user role
          setTimeout(() => {
            switch (profile?.admin_role) {
              case 'admin_full':
              case 'super_admin':
                navigate('/admin');
                break;
              case 'teacher_private':
              case 'teacher_public':
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
          }, 1500);

        } else {
          // No session found, redirect to login
          toast({
            title: "Session expirée",
            description: "Veuillez vous connecter à nouveau.",
            variant: "destructive"
          });
          navigate('/auth');
        }

      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification.",
          variant: "destructive"
        });
        navigate('/auth');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-glow/10">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold text-gray-800">
          Vérification de votre email...
        </h2>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous activons votre compte.
        </p>
      </div>
    </div>
  );
}
