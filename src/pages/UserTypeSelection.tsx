import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Eye, GraduationCap, Users, School } from 'lucide-react';

export default function UserTypeSelection() {
  const navigate = useNavigate();

  const handleParticulierChoice = () => {
    // Set user type in session storage for later use
    sessionStorage.setItem('userType', 'particulier');
    // Dispatch custom event to notify components of user type change
    window.dispatchEvent(new CustomEvent('userTypeChanged'));
    navigate('/spectacles');
  };

  const handleProfessionalChoice = () => {
    navigate('/professional-type-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary-glow/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Je réserve mon spectacle
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Choisissez votre profil pour découvrir nos spectacles
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Particulier Option */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Eye className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">PARTICULIER</h3>
                <p className="text-gray-600 mb-6">
                  Parents, familles, amis, amoureux du théâtre
                </p>
                <div className="text-sm text-gray-500 mb-6">
                  • Accès aux séances tout public<br/>
                  • Réservation simple et rapide<br/>
                  • Pas besoin de compte pour explorer
                </div>
              </div>
              <Button 
                onClick={handleParticulierChoice}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Découvrir les spectacles
              </Button>
            </CardContent>
          </Card>

          {/* Professional Option */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">PROFESSIONNEL</h3>
                <p className="text-gray-600 mb-6">
                  Écoles privées, écoles publiques, associations
                </p>
                <div className="text-sm text-gray-500 mb-6">
                  • Séances dédiées aux groupes<br/>
                  • Tarifs préférentiels<br/>
                  • Sessions dans toutes les villes
                </div>
              </div>
              <Button 
                onClick={handleProfessionalChoice}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Choisir mon type d'organisation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Vous pourrez créer un compte plus tard pour finaliser votre réservation
          </p>
        </div>
      </div>
    </div>
  );
}
