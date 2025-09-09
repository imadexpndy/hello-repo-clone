import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, School, Users, ArrowLeft } from 'lucide-react';

export default function ProfessionalTypeSelection() {
  const navigate = useNavigate();

  const handleProfessionalTypeChoice = (type: string) => {
    // Set professional type in session storage
    sessionStorage.setItem('userType', 'professional');
    sessionStorage.setItem('professionalType', type);
    
    console.log('ProfessionalTypeSelection - Setting:', {
      userType: 'professional',
      professionalType: type
    });
    
    // Dispatch custom event to notify components of user type change
    window.dispatchEvent(new CustomEvent('userTypeChanged'));
    navigate('/spectacles');
  };

  const goBack = () => {
    navigate('/user-type-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary-glow/10 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <Button 
            onClick={goBack}
            variant="ghost" 
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Type d'organisation
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Sélectionnez votre type d'organisation pour voir les séances adaptées
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Private School */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
            <CardContent className="p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">École Privée</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Établissements d'enseignement privé
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  • Séances dédiées aux écoles privées<br/>
                  • Horaires adaptés aux groupes scolaires<br/>
                  • Rabat et Casablanca
                </div>
              </div>
              <Button 
                onClick={() => handleProfessionalTypeChoice('scolaire-privee')}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Choisir
              </Button>
            </CardContent>
          </Card>

          {/* Public School */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
            <CardContent className="p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <School className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">École Publique</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Établissements d'enseignement public
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  • Séances spéciales écoles publiques<br/>
                  • Tarifs préférentiels<br/>
                  • Rabat et Casablanca
                </div>
              </div>
              <Button 
                onClick={() => handleProfessionalTypeChoice('scolaire-publique')}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Choisir
              </Button>
            </CardContent>
          </Card>

          {/* Association */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
            <CardContent className="p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Association</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Associations et organisations
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  • Séances pour associations<br/>
                  • Groupes et collectivités<br/>
                  • Rabat et Casablanca
                </div>
              </div>
              <Button 
                onClick={() => handleProfessionalTypeChoice('association')}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Choisir
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Vous verrez les séances disponibles dans toutes les villes pour votre type d'organisation
          </p>
        </div>
      </div>
    </div>
  );
}
