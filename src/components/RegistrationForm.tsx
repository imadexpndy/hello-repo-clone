import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload, Building2, Users, GraduationCap, User, CheckCircle, Sparkles, MapPin } from 'lucide-react';
import { organizations, getOrganizationsByTypeAndCity, type Organization } from '@/data/organizations';
import { EmailConfirmationModal } from '@/components/EmailConfirmationModal';

interface School {
  id: string;
  name: string;
  school_type: string;
  city: string;
  domain?: string;
}

interface RegistrationFormProps {
  onBack: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onBack }) => {
  // Helper function to get return URL parameter
  const getReturnUrlParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return_url');
    return returnUrl ? `?return_url=${encodeURIComponent(returnUrl)}` : '';
  };
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userCategory, setUserCategory] = useState<'b2c' | 'b2b' | ''>('');
  const [userType, setUserType] = useState<string>('');
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    whatsapp: '',
    professionalEmail: '',
    city: '' as 'casablanca' | 'rabat' | '',
    organizationId: '',
    schoolId: '',
    schoolType: '',
    newSchoolName: '',
    newSchoolICE: '',
    newSchoolAddress: '',
    newSchoolCity: '',
    associationName: '',
    associationICE: '',
    associationAddress: '',
    associationCity: '',
    contactPerson: '',
    requiresVerification: false
  });

  useEffect(() => {
    if (userType === 'teacher_private' || userType === 'teacher_public') {
      fetchSchools();
    }
  }, [userType]);

  const fetchSchools = async () => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .in('verification_status', ['approved', 'pending'])
      .order('name');

    if (error) {
      console.error('Error fetching schools:', error);
    } else {
      setSchools(data || []);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      // Upload to verification/ prefix which allows anonymous uploads during registration
      const filePath = `verification/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Erreur d'upload",
          description: "Impossible d'uploader le fichier",
          variant: "destructive"
        });
      } else {
        uploadedUrls.push(filePath);
        toast({
          title: "Upload réussi",
          description: `Fichier ${file.name} uploadé avec succès`,
        });
      }
    }

    setUploadedDocs(prev => [...prev, ...uploadedUrls]);
    setLoading(false);
  };

  const validateEmail = (email: string, schoolDomain?: string) => {
    if (!email.includes('@')) return false;
    if (schoolDomain && !email.endsWith(`@${schoolDomain}`)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    // Email validation for teachers
    if ((userType === 'teacher_private' || userType === 'teacher_public') && formData.schoolId !== 'other') {
      const selectedSchool = schools.find(s => s.id === formData.schoolId);
      if (selectedSchool?.domain && !validateEmail(formData.professionalEmail, selectedSchool.domain)) {
        toast({
          title: "Erreur",
          description: `L'email professionnel doit utiliser le domaine @${selectedSchool.domain}`,
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);

    try {
      // Check if email already exists in profiles table
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email);

      if (checkError) {
        console.error('Error checking existing email:', checkError);
      } else if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà enregistré. Connectez-vous ou utilisez 'Mot de passe oublié'.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }


      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback${getReturnUrlParam()}`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone
          }
        }
      });

      console.log('Registration response:', { authData, authError });
      console.log('User created:', authData?.user);
      console.log('Email confirmed:', authData?.user?.email_confirmed_at);
      console.log('Confirmation sent:', authData?.user?.confirmation_sent_at);
      console.log('Session:', authData?.session);

      if (authError) {
        // Handle duplicate email error
        if (authError.message.includes('already registered') || authError.message.includes('User already registered') || authError.message.includes('already been registered')) {
          toast({
            title: "Email déjà utilisé",
            description: "Cet email est déjà enregistré. Connectez-vous ou utilisez 'Mot de passe oublié'.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      // 2. Create school/association if needed
      let schoolId = formData.schoolId;
      let associationId = null;

      if ((userType === 'teacher_private' || userType === 'teacher_public') && formData.schoolId === 'other') {
        const { data: newSchool, error: schoolError } = await supabase
          .from('schools')
          .insert({
            name: formData.newSchoolName,
            ice_number: formData.newSchoolICE,
            address: formData.newSchoolAddress,
            city: formData.newSchoolCity,
            school_type: formData.schoolType,
            verification_status: 'pending'
          })
          .select()
          .single();

        if (schoolError) throw schoolError;
        schoolId = newSchool.id;
      }

      if (userType === 'association') {
        const { data: newAssociation, error: associationError } = await supabase
          .from('associations')
          .insert({
            name: formData.associationName,
            ice_number: formData.associationICE,
            address: formData.associationAddress,
            city: formData.associationCity,
            contact_person: formData.contactPerson,
            verification_status: 'pending'
          })
          .select()
          .single();

        if (associationError) throw associationError;
        associationId = newAssociation.id;
      }

      // 3. Create profile with appropriate role
      let role: 'admin' | 'teacher_private' | 'teacher_public' | 'association' | 'partner' | 'b2c_user' | 'super_admin' = 'b2c_user';
      if (userType === 'teacher_private' || userType === 'teacher_public') {
        role = userType as 'teacher_private' | 'teacher_public';
      } else if (userType === 'association') {
        role = 'association';
      }

      const verificationStatus = 
        userType === 'teacher_public' ? 'pending' :
        userType === 'association' ? 'pending' :
        userType === 'teacher_private' ? 'approved' :
        'approved';

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          professional_email: formData.professionalEmail || formData.email,
          school_id: schoolId !== 'other' ? schoolId : null,
          association_id: associationId,
          verification_status: verificationStatus,
          verification_documents: uploadedDocs.length > 0 ? uploadedDocs : null,
          contact_person: userType === 'association' ? formData.contactPerson : null,
          admin_role: role, // Add the admin_role field which is used by the auth system
          is_verified: userType === 'teacher_private' ? true : false, // Private schools get immediate verification
          user_type: userType, // Store the user type for proper profile identification
          professional_type: userType === 'teacher_private' ? 'scolaire-privee' : 
                            userType === 'teacher_public' ? 'scolaire-publique' : 
                            userType === 'association' ? 'association' : null // Store professional type based on user type
        })
        .eq('user_id', authData.user.id);

      if (profileError) throw profileError;

      // Show email confirmation modal instead of toast
      setRegisteredEmail(formData.email);
      setShowEmailConfirmation(true);

      // Additional message for pending verification (only for public schools and associations)
      if (verificationStatus === 'pending') {
        setTimeout(() => {
          toast({
            title: "En attente de vérification",
            description: "Votre compte sera activé après validation par un administrateur",
          });
        }, 1000);
      } else if (userType === 'teacher_private') {
        setTimeout(() => {
          toast({
            title: "Compte activé",
            description: "Votre compte école privée est immédiatement disponible",
          });
        }, 1000);
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySelection = () => (
    <div className="space-y-8">      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
        <Card 
          className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
            userCategory === 'b2c' 
              ? 'ring-2 ring-primary border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => {
            setUserCategory('b2c');
            setUserType('b2c');
          }}
        >
          <CardContent className="p-6 md:p-8 text-center relative">
            {/* Decorative elements */}
            
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">Particulier</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
                Parents et familles souhaitant acheter des billets
              </p>
              
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm font-semibold text-foreground">Accès immédiat</p>
                </div>
                <p className="text-xs text-muted-foreground">Inscription rapide, achat direct</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
            userCategory === 'b2b' 
              ? 'ring-2 ring-primary border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setUserCategory('b2b')}
        >
          <CardContent className="p-6 md:p-8 text-center relative">
            {/* Decorative elements */}
            
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">Professionnel</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
                Écoles, associations et organisations
              </p>
              
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <p className="text-sm font-semibold text-foreground">Tarifs préférentiels</p>
                </div>
                <p className="text-xs text-muted-foreground">Validation requise</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="px-8 py-3 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              if (userCategory === 'b2c') {
                setStep(4); // Skip city selection for B2C users
              } else {
                setStep(2); // City selection for B2B users
              }
              setIsTransitioning(false);
            }, 200);
          }} 
          disabled={!userCategory}
          className="px-8 py-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            Continuer
            <Sparkles className="h-4 w-4 animate-pulse" />
          </span>
        </Button>
      </div>
    </div>
  );

  const renderCitySelection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fade-in">
        <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Dans quelle ville êtes-vous situé ?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card 
          className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
            formData.city === 'casablanca' 
              ? 'ring-2 ring-primary border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setFormData(prev => ({...prev, city: 'casablanca'}))}
        >
          <CardContent className="p-8 text-center relative">
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-foreground">Casablanca</h3>
              
              {formData.city === 'casablanca' && (
                <div className="mt-4 animate-scale-in">
                  <CheckCircle className="h-6 w-6 text-primary mx-auto animate-pulse" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
            formData.city === 'rabat' 
              ? 'ring-2 ring-primary border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setFormData(prev => ({...prev, city: 'rabat'}))}
        >
          <CardContent className="p-8 text-center relative">
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-foreground">Rabat</h3>
              
              {formData.city === 'rabat' && (
                <div className="mt-4 animate-scale-in">
                  <CheckCircle className="h-6 w-6 text-primary mx-auto animate-pulse" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6 animate-fade-in">
        <Button variant="outline" onClick={() => {
          setIsTransitioning(true);
          setTimeout(() => {
            setStep(1);
            setIsTransitioning(false);
          }, 200);
        }} className="px-8 py-3 hover:scale-105 transition-transform">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setStep(3);
              setIsTransitioning(false);
            }, 200);
          }} 
          disabled={!formData.city}
          className="px-8 py-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            Continuer
            <Sparkles className="h-4 w-4 animate-pulse" />
          </span>
        </Button>
      </div>
    </div>
  );

  const renderUserTypeSelection = () => (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            type: 'teacher_private',
            icon: GraduationCap,
            title: 'École Privée',
            description: 'Vérification par email du domaine',
            color: 'from-primary to-primary/80',
            delay: '0ms'
          },
          {
            type: 'teacher_public',
            icon: GraduationCap,
            title: 'École Publique',
            description: 'Documents officiels requis',
            color: 'from-accent to-accent/80',
            delay: '100ms'
          },
          {
            type: 'association',
            icon: Users,
            title: 'Association',
            description: 'Organisation à but non lucratif',
            color: 'from-primary to-accent',
            delay: '200ms'
          }
        ].map((option, index) => (
          <Card 
            key={option.type}
            className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 animate-fade-in ${
              userType === option.type 
                ? 'ring-2 ring-primary border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            style={{ animationDelay: option.delay }}
            onClick={() => setUserType(option.type)}
          >
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full transform translate-x-12 -translate-y-12" />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground">{option.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
                
                {userType === option.type && (
                  <div className="mt-4 animate-scale-in">
                    <CheckCircle className="h-6 w-6 text-primary mx-auto animate-pulse" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <Button variant="outline" onClick={() => {
          setIsTransitioning(true);
          setTimeout(() => {
            setStep(2);
            setIsTransitioning(false);
          }, 200);
        }} className="px-8 py-3 hover:scale-105 transition-transform">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setStep(4);
              setIsTransitioning(false);
            }, 200);
          }} 
          disabled={!userType}
          className="px-8 py-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            Continuer
            <Sparkles className="h-4 w-4 animate-pulse" />
          </span>
        </Button>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            required
            className="mt-2 transition-all duration-200 focus:scale-105"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Label htmlFor="fullName" className="text-sm font-medium">Nom complet *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
            required
            className="mt-2 transition-all duration-200 focus:scale-105"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Label htmlFor="password" className="text-sm font-medium">Mot de passe *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            required
            className="mt-2 transition-all duration-200 focus:scale-105"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
            required
            className="mt-2 transition-all duration-200 focus:scale-105"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Label htmlFor="phone" className="text-sm font-medium">Téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
            required
            className="mt-2 transition-all duration-200 focus:scale-105"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp (optionnel)</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData(prev => ({...prev, whatsapp: e.target.value}))}
            placeholder="Par défaut: même que téléphone"
            className="mt-2 transition-all duration-200 focus:scale-105"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <Button variant="outline" onClick={() => {
          setIsTransitioning(true);
          setTimeout(() => {
            setStep(userCategory === 'b2c' ? 1 : 3);
            setIsTransitioning(false);
          }, 200);
        }} className="px-8 py-3 hover:scale-105 transition-transform">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setStep(userCategory === 'b2c' ? 5 : 5);
              setIsTransitioning(false);
            }, 200);
          }}
          disabled={!formData.email || !formData.fullName || !formData.password || !formData.phone}
          className="px-8 py-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            Continuer
            <Sparkles className="h-4 w-4 animate-pulse" />
          </span>
        </Button>
      </div>
    </div>
  );

  const renderSpecificInfo = () => {
    if (userType === 'b2c') {
      return (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Votre compte sera activé immédiatement après confirmation de l'email. 
              Vous pourrez acheter des billets directement.
            </AlertDescription>
          </Alert>
          
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
            </div>
        </div>
      );
    }

          if (userType === 'teacher_private' || userType === 'teacher_public') {
            const organizationType = userType === 'teacher_private' ? 'private_school' : 'public_school';
            const availableOrganizations = formData.city ? getOrganizationsByTypeAndCity(organizationType, formData.city) : [];
            
            return (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="organization">École *</Label>
                  <Select value={formData.organizationId} onValueChange={(value) => setFormData(prev => ({...prev, organizationId: value, schoolType: organizationType}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre école" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOrganizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Autre (créer une nouvelle école)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.organizationId === 'other' && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold">Nouvelle école {organizationType === 'private_school' ? 'privée' : 'publique'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newSchoolName">Nom de l'école *</Label>
                        <Input
                          id="newSchoolName"
                          value={formData.newSchoolName}
                          onChange={(e) => setFormData(prev => ({...prev, newSchoolName: e.target.value}))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="newSchoolICE">ICE</Label>
                        <Input
                          id="newSchoolICE"
                          value={formData.newSchoolICE}
                          onChange={(e) => setFormData(prev => ({...prev, newSchoolICE: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newSchoolAddress">Adresse</Label>
                      <Input
                        id="newSchoolAddress"
                        value={formData.newSchoolAddress}
                        onChange={(e) => setFormData(prev => ({...prev, newSchoolAddress: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newSchoolCity">Ville</Label>
                      <Input
                        id="newSchoolCity"
                        value={formData.newSchoolCity}
                        onChange={(e) => setFormData(prev => ({...prev, newSchoolCity: e.target.value}))}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="professionalEmail">Email professionnel *</Label>
                  <Input
                    id="professionalEmail"
                    type="email"
                    value={formData.professionalEmail}
                    onChange={(e) => setFormData(prev => ({...prev, professionalEmail: e.target.value}))}
                    required
                  />
                  {formData.schoolId !== 'other' && schools.find(s => s.id === formData.schoolId)?.domain && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Doit utiliser le domaine @{schools.find(s => s.id === formData.schoolId)?.domain}
                    </p>
                  )}
                </div>

                {userType === 'teacher_public' && (
                  <div>
                    <Label htmlFor="documents">Documents de vérification *</Label>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Téléchargez vos documents officiels (carte professionnelle, attestation, etc.)
                    </p>
                    {uploadedDocs.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        {uploadedDocs.length} document(s) téléchargé(s)
                      </p>
                    )}
                  </div>
                )}

                {userType === 'teacher_public' ? (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertDescription>
                      <strong>École Publique:</strong> Votre compte nécessite une validation manuelle avec documents officiels. 
                      Accès après approbation administrative (1-2 jours ouvrables).
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription>
                      <strong>École Privée:</strong> ✅ Accès immédiat après confirmation de l'email. 
                      Aucune approbation administrative requise.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(4)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !formData.organizationId || !formData.professionalEmail || (userType === 'teacher_public' && uploadedDocs.length === 0)}
                  >
                    {loading ? "Création..." : "Créer mon compte"}
                  </Button>
                </div>
              </div>
            );
          }

    if (userType === 'association') {
      const availableAssociations = formData.city ? getOrganizationsByTypeAndCity('association', formData.city) : [];
      
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="associationSelect">Association *</Label>
            <Select value={formData.organizationId} onValueChange={(value) => setFormData(prev => ({...prev, organizationId: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre association" />
              </SelectTrigger>
              <SelectContent>
                {availableAssociations.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
                <SelectItem value="other">Autre (créer une nouvelle association)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.organizationId === 'other' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold">Nouvelle association</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="associationName">Nom de l'association *</Label>
                  <Input
                    id="associationName"
                    value={formData.associationName}
                    onChange={(e) => setFormData(prev => ({...prev, associationName: e.target.value}))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="associationICE">ICE / Numéro officiel</Label>
                  <Input
                    id="associationICE"
                    value={formData.associationICE}
                    onChange={(e) => setFormData(prev => ({...prev, associationICE: e.target.value}))}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="contactPerson">Personne de contact *</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => setFormData(prev => ({...prev, contactPerson: e.target.value}))}
              required
            />
          </div>

          <div>
            <Label htmlFor="associationAddress">Adresse</Label>
            <Textarea
              id="associationAddress"
              value={formData.associationAddress}
              onChange={(e) => setFormData(prev => ({...prev, associationAddress: e.target.value}))}
            />
          </div>

          <div>
            <Label htmlFor="associationCity">Ville</Label>
            <Input
              id="associationCity"
              value={formData.associationCity}
              onChange={(e) => setFormData(prev => ({...prev, associationCity: e.target.value}))}
            />
          </div>

          <div>
            <Label htmlFor="documents">Documents requis *</Label>
            <Input
              id="documents"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Statuts, certificat officiel, etc.
            </p>
            {uploadedDocs.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {uploadedDocs.length} document(s) téléchargé(s)
              </p>
            )}
          </div>

          <Alert>
            <AlertDescription>
              Les associations nécessitent une validation administrative. 
              Votre compte sera activé après approbation.
            </AlertDescription>
          </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !formData.organizationId || (formData.organizationId === 'other' && (!formData.associationName || !formData.contactPerson)) || uploadedDocs.length === 0}
              >
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
            </div>
        </div>
      );
    }

    return null;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Choisir mon profil";
      case 2: return "Sélectionner votre ville";
      case 3: return "Type professionnel";
      case 4: return "Informations personnelles";
      case 5: 
        if (userType === 'teacher_private' || userType === 'teacher_public') return "Informations scolaires";
        if (userType === 'association') return "Informations association";
        if (userType === 'b2c') return "Finalisation";
        return "Informations spécifiques";
      default: return "";
    }
  };

  const maxSteps = userCategory === 'b2c' ? 5 : 5;
  const progress = (step / maxSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/8 via-primary/4 to-primary/12 p-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/12 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-128 h-128 bg-gradient-to-br from-accent/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary-glow/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }} />
        <div className="absolute top-1/6 right-1/3 w-32 h-32 bg-gradient-to-br from-accent/6 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '8s' }} />
      </div>
      
      
      {/* Stylized back button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 backdrop-blur-xl bg-card/60 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Button>
      </div>


      <div className="w-full max-w-3xl mx-auto relative z-10 mt-6 md:mt-12 px-4">

      {/* Main card */}
      <Card className="w-full border-0 shadow-xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/6 pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl" />
        
        {/* Progress indicator at top */}
        <div className="w-full bg-primary/5 border-b border-primary/10 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">Étape {step} sur {maxSteps}</span>
            <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-3 overflow-hidden border border-primary/10">
            <div 
              className="bg-gradient-to-r from-primary via-primary-glow to-primary h-full rounded-full transition-all duration-700 ease-in-out transform shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <CardHeader className="relative text-center pb-6 pt-8">
          <div className="space-y-3">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent animate-fade-in">
              {getStepTitle()}
            </CardTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary mx-auto rounded-full shadow-glow" />
            <CardDescription className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed px-4">
              {step === 1 && "Commençons par identifier votre profil pour personnaliser votre expérience théâtrale"}
              {step === 3 && userCategory === 'b2b' && "Précisez votre type d'organisation pour des services adaptés à vos besoins"}
              {step === 4 && "Vos informations personnelles pour compléter votre profil"}
              {step === 5 && "Informations spécifiques à votre organisation pour la validation"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="relative px-6 md:px-12 pb-10">
          <div 
            className={`transition-all duration-500 ease-in-out transform ${
              isTransitioning 
                ? 'opacity-0 translate-x-8 scale-95' 
                : 'opacity-100 translate-x-0 scale-100'
            }`}
          >
            <div className="animate-fade-in">
              {step === 1 && (
                <div className="animate-scale-in">
                  {renderCategorySelection()}
                </div>
              )}
              {step === 2 && userCategory === 'b2b' && (
                <div className="animate-slide-in-right">
                  {renderCitySelection()}
                </div>
              )}
              {step === 3 && userCategory === 'b2b' && (
                <div className="animate-slide-in-right">
                  {renderUserTypeSelection()}
                </div>
              )}
              {step === 4 && (
                <div className="animate-slide-in-right">
                  {renderBasicInfo()}
                </div>
              )}
              {step === 5 && (
                <div className="animate-slide-in-right">
                  {renderSpecificInfo()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Email Confirmation Modal */}
      <EmailConfirmationModal
        isOpen={showEmailConfirmation}
        onClose={() => {
          setShowEmailConfirmation(false);
          onBack(); // Return to login after closing modal
        }}
        email={registeredEmail}
      />
    </div>
  );
};