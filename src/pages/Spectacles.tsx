import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Heart, Globe, Snowflake, FistRaised, Child } from 'lucide-react';

interface Spectacle {
  id: string;
  title: string;
  date: string;
  description: string;
  duration: string;
  ageGroup: string;
  actors: string;
  theme: string;
  themeIcon: React.ReactNode;
  color: string;
  image: string;
  character: string;
  available: boolean;
}

const spectacles: Spectacle[] = [
  {
    id: 'le-petit-prince',
    title: 'LE PETIT PRINCE',
    date: 'Octobre 2025',
    description: 'Une adaptation magique du chef-d\'œuvre de Saint-Exupéry qui émerveillera petits et grands avec ses messages universels.',
    duration: '50 minutes',
    ageGroup: '6 ans et +',
    actors: '3 comédiens',
    theme: 'Aventure',
    themeIcon: <Globe className="w-4 h-4" />,
    color: 'bg-green-500',
    image: '/assets/img/spectacles/le-petit-prince.png',
    character: '/assets/img/spectacles elements/le petit prince@4x.png',
    available: true
  },
  {
    id: 'tara-sur-la-lune',
    title: 'TARA SUR LA LUNE',
    date: 'Novembre 2025',
    description: 'Une aventure spatiale captivante qui emmène les enfants dans un voyage extraordinaire vers la lune avec Tara.',
    duration: '45 minutes',
    ageGroup: '5 ans et +',
    actors: '2 comédiens',
    theme: 'Espace',
    themeIcon: <Globe className="w-4 h-4" />,
    color: 'bg-purple-500',
    image: '/assets/img/spectacles/tara-sur-la-lune.png',
    character: '/assets/img/spectacles elements/tara@4x.png',
    available: true
  },
  {
    id: 'estevanico',
    title: 'ESTEVANICO',
    date: 'Décembre 2025',
    description: 'L\'histoire fascinante d\'Estevanico, explorateur du 16ème siècle, dans une aventure historique pleine de découvertes.',
    duration: '60 minutes',
    ageGroup: '8 ans et +',
    actors: '4 comédiens',
    theme: 'Aventure',
    themeIcon: <Globe className="w-4 h-4" />,
    color: 'bg-blue-500',
    image: '/assets/img/spectacles/estevanico.png',
    character: '/assets/img/spectacles elements/estevanico@4x.png',
    available: true
  },
  {
    id: 'simple-comme-bonjour',
    title: 'SIMPLE COMME BONJOUR',
    date: 'Décembre 2025',
    description: 'Une comédie touchante sur l\'importance des petits gestes du quotidien et la beauté des relations humaines simples.',
    duration: '40 minutes',
    ageGroup: '4 ans et +',
    actors: '2 comédiens',
    theme: 'Comédie',
    themeIcon: <Heart className="w-4 h-4" />,
    color: 'bg-yellow-500',
    image: '/assets/img/spectacles/simple-comme-bonjour.png',
    character: '/assets/img/spectacles elements/simple comme bonjour@4x.png',
    available: true
  },
  {
    id: 'charlotte',
    title: 'CHARLOTTE',
    date: 'Janvier 2026',
    description: 'Une histoire touchante de Charlotte découvrant l\'amitié, l\'empathie et la force des liens humains dans un monde plein de défis.',
    duration: '55 minutes',
    ageGroup: '8 ans et +',
    actors: '3 comédiens',
    theme: 'Émouvant',
    themeIcon: <Heart className="w-4 h-4" />,
    color: 'bg-pink-500',
    image: '/assets/img/spectacles/charlotte.png',
    character: '/assets/img/spectacles elements/charlotte@4x.png',
    available: true
  },
  {
    id: 'casse-noisette',
    title: 'CASSE-NOISETTE',
    date: 'Décembre 2025',
    description: 'Le conte de Noël classique revisité dans une version moderne et féerique qui ravira toute la famille.',
    duration: '55 minutes',
    ageGroup: '5 ans et +',
    actors: '4 comédiens',
    theme: 'Noël',
    themeIcon: <Snowflake className="w-4 h-4" />,
    color: 'bg-red-500',
    image: '/assets/img/spectacles/casse-noisette.png',
    character: '/assets/img/spectacles elements/casse-noisette@4x.png',
    available: true
  },
  {
    id: 'antigone',
    title: 'ANTIGONE',
    date: 'Mars 2026',
    description: 'Une adaptation moderne de la tragédie de Sophocle qui explore les thèmes de la justice, du courage et de la résistance.',
    duration: '65 minutes',
    ageGroup: '12 ans et +',
    actors: '5 comédiens',
    theme: 'Résistance',
    themeIcon: <FistRaised className="w-4 h-4" />,
    color: 'bg-purple-600',
    image: '/assets/img/spectacles/antigone.png',
    character: '/assets/img/spectacles elements/antigone@4x.png',
    available: true
  },
  {
    id: 'alice-chez-les-merveilles',
    title: 'ALICE CHEZ LES MERVEILLES',
    date: 'Avril 2026',
    description: 'Plongez dans l\'univers fantastique d\'Alice et découvrez un monde merveilleux rempli de personnages extraordinaires.',
    duration: '50 minutes',
    ageGroup: '6 ans et +',
    actors: '4 comédiens',
    theme: 'Fantastique',
    themeIcon: <Heart className="w-4 h-4" />,
    color: 'bg-pink-400',
    image: '/assets/img/spectacles/alice.png',
    character: '/assets/img/spectacles elements/alice@4x.png',
    available: true
  }
];

const categories = [
  { id: 'all', label: 'Tous les spectacles' },
  { id: 'maternelle', label: 'Maternelle (3-5 ans)' },
  { id: 'primaire', label: 'Primaire (6-11 ans)' },
  { id: 'college', label: 'Collège (12+ ans)' }
];

export default function Spectacles() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleReservation = (spectacleId: string) => {
    // Navigate to reservation page or handle booking
    window.location.href = `/reservation/${spectacleId}`;
  };

  const handleDetails = (spectacleId: string) => {
    // Navigate to spectacle details
    window.location.href = `/spectacle/${spectacleId}`;
  };

  const filteredSpectacles = spectacles.filter(spectacle => {
    if (selectedCategory === 'all') return true;
    
    const age = parseInt(spectacle.ageGroup);
    switch (selectedCategory) {
      case 'maternelle':
        return age <= 5;
      case 'primaire':
        return age >= 6 && age <= 11;
      case 'college':
        return age >= 12;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Nos Spectacles
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre programmation de spectacles culturels adaptés aux écoles, associations et familles
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id 
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-800' 
                  : 'hover:bg-yellow-50'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Spectacles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSpectacles.map((spectacle) => (
            <Card key={spectacle.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex h-96">
                  {/* Left Side - Image */}
                  <div className="w-1/2 relative bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
                    <img 
                      src={spectacle.image} 
                      alt={spectacle.title}
                      className="w-3/4 h-3/4 object-contain"
                    />
                    <img 
                      src={spectacle.character}
                      alt={`${spectacle.title} Character`}
                      className="absolute bottom-2 right-2 w-24 h-24 object-contain"
                    />
                    {spectacle.available && (
                      <Badge className={`absolute top-3 right-3 ${spectacle.color} text-white`}>
                        Disponible
                      </Badge>
                    )}
                  </div>

                  {/* Right Side - Content */}
                  <div className="w-1/2 p-6 flex flex-col justify-center">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-3">{spectacle.date}</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 font-['Amatic_SC']">
                        {spectacle.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        {spectacle.description}
                      </p>

                      {/* Info Pills */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg py-2 px-3">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium">{spectacle.duration}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg py-2 px-3">
                          <Child className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium">{spectacle.ageGroup}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg py-2 px-3">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium">{spectacle.actors}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg py-2 px-3">
                          {spectacle.themeIcon}
                          <span className="text-xs font-medium">{spectacle.theme}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleReservation(spectacle.id)}
                          className={`flex-1 ${spectacle.color} hover:opacity-90 text-white font-bold`}
                        >
                          {user ? 'Réserver maintenant' : 'Réserver'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDetails(spectacle.id)}
                          className="flex-1 border-gray-300 hover:bg-gray-50"
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
