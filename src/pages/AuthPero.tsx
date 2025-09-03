import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AuthPero = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    childBirthday: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store guest information in a simple table or localStorage for now
      const guestData = {
        ...formData,
        created_at: new Date().toISOString(),
        type: 'guest'
      };

      // Store in localStorage for now (can be moved to database later)
      localStorage.setItem('guestUser', JSON.stringify(guestData));
      
      toast({
        title: "Bienvenue !",
        description: "Vos informations ont été enregistrées. Vous pouvez maintenant explorer nos spectacles.",
      });

      // Redirect to spectacles catalog
      navigate('/spectacles');
    } catch (error) {
      console.error('Error saving guest data:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Accès Invité
          </CardTitle>
          <CardDescription className="text-gray-600">
            Remplissez ce formulaire simple pour découvrir nos spectacles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="childBirthday">Anniversaire de votre enfant</Label>
              <Input
                id="childBirthday"
                name="childBirthday"
                type="date"
                value={formData.childBirthday}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="text-center text-sm text-gray-500 italic mt-4 mb-6">
              Pour plein de petites surprises !
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#BDCF00] hover:bg-[#a8b800] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Continuer'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a 
                href="/auth" 
                className="text-[#BDCF00] hover:underline font-medium"
              >
                Se connecter
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPero;
