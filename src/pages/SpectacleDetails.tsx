import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const SpectacleDetails = () => {
  const { spectacleId } = useParams();
  const { user } = useAuth();

  const spectacleData = {
    'tara-sur-la-lune': {
      title: 'Tara sur la Lune',
      description: "L'aventure spatiale de Tara, une petite fille qui rêve d'explorer la Lune. Un spectacle merveilleux sur les rêves, l'exploration et la curiosité scientifique.",
      image: 'https://edjs.art/assets/edjs%20img/Tara-sur-la-lune_Web_002.webp',
      duration: '45 minutes',
      ageRange: '6-12 ans',
      genre: 'Théâtre jeunesse',
      synopsis: "Tara est une petite fille passionnée par l'espace et les étoiles. Elle rêve de marcher sur la Lune et de découvrir ses mystères. Accompagnée de son fidèle ami imaginaire, elle entreprend un voyage extraordinaire à travers l'univers, rencontrant des personnages fantastiques et apprenant sur l'astronomie, la persévérance et le pouvoir des rêves.",
      themes: ['Exploration spatiale', 'Rêves et imagination', 'Science et découverte', 'Amitié'],
      cast: ['Actrice principale', 'Musicien', 'Marionnettiste'],
      director: 'Équipe EDJS',
      reservationUrl: '/reservation/tara-sur-la-lune'
    },
    'le-petit-prince': {
      title: 'Le Petit Prince',
      description: "L'adaptation théâtrale du chef-d'œuvre d'Antoine de Saint-Exupéry. Une histoire intemporelle sur l'amitié, l'amour et la quête de sens.",
      image: 'https://edjs.art/assets/edjs%20img/Le-Petit-Prince_Web_001.webp',
      duration: '50 minutes',
      ageRange: '8-15 ans',
      genre: 'Théâtre classique',
      synopsis: "L'histoire d'un aviateur qui rencontre un mystérieux petit prince venu d'une autre planète. À travers leurs conversations, nous découvrons les aventures du petit prince et les leçons de vie qu'il a apprises lors de ses voyages à travers l'univers.",
      themes: ['Amitié', 'Philosophie', 'Voyage initiatique', 'Relations humaines'],
      cast: ['Le Petit Prince', 'L\'Aviateur', 'La Rose', 'Le Renard'],
      director: 'Équipe EDJS',
      reservationUrl: '/reservation/le-petit-prince'
    },
    'charlotte': {
      title: 'Charlotte',
      description: "L'histoire touchante de Charlotte, une petite fille qui découvre la force de l'amitié et de la solidarité.",
      image: 'https://edjs.art/assets/edjs%20img/Charlotte_Web_001.webp',
      duration: '40 minutes',
      ageRange: '5-10 ans',
      genre: 'Théâtre jeunesse',
      synopsis: "Charlotte est une petite fille timide qui vient d'arriver dans une nouvelle école. Elle doit apprendre à se faire des amis et à surmonter sa timidité. Une histoire sur l'acceptation de soi et l'importance de l'amitié.",
      themes: ['Amitié', 'Confiance en soi', 'Intégration', 'Émotions'],
      cast: ['Charlotte', 'Ses nouveaux amis', 'L\'institutrice'],
      director: 'Équipe EDJS',
      reservationUrl: '/reservation/charlotte'
    },
    'estevanico': {
      title: 'Estevanico',
      description: "L'épopée d'Estevanico, explorateur marocain du 16ème siècle. Une histoire d'aventure, de courage et de découverte.",
      image: 'https://edjs.art/assets/edjs%20img/Estevanico_Web_001.webp',
      duration: '55 minutes',
      ageRange: '10-16 ans',
      genre: 'Théâtre historique',
      synopsis: "L'histoire vraie d'Estevanico, un explorateur marocain qui a participé aux premières explorations du continent américain au 16ème siècle. Un récit captivant sur le courage, la persévérance et la découverte de nouveaux mondes.",
      themes: ['Histoire du Maroc', 'Exploration', 'Courage', 'Identité culturelle'],
      cast: ['Estevanico', 'Les explorateurs', 'Les peuples rencontrés'],
      director: 'Équipe EDJS',
      reservationUrl: '/reservation/estevanico'
    },
    'alice-chez-les-merveilles': {
      title: 'Alice chez les Merveilles',
      description: "L'adaptation théâtrale du conte de Lewis Carroll. Alice découvre un monde fantastique rempli de personnages extraordinaires.",
      image: 'https://edjs.art/assets/edjs%20img/Alice_Web_001.webp',
      duration: '48 minutes',
      ageRange: '6-14 ans',
      genre: 'Théâtre fantastique',
      synopsis: "Alice tombe dans un terrier de lapin et découvre un monde merveilleux peuplé de créatures extraordinaires : le Chapelier Fou, le Chat de Cheshire, la Reine de Cœur... Une aventure pleine de surprises et d'imagination.",
      themes: ['Imagination', 'Aventure', 'Grandir', 'Monde fantastique'],
      cast: ['Alice', 'Le Lapin Blanc', 'Le Chapelier Fou', 'La Reine de Cœur'],
      director: 'Équipe EDJS',
      reservationUrl: '/reservation/alice-chez-les-merveilles'
    }
  };

  const spectacle = spectacleData[spectacleId as keyof typeof spectacleData];

  const handleReservation = () => {
    if (user) {
      window.location.href = spectacle.reservationUrl;
    } else {
      window.location.href = '/auth';
    }
  };

  if (!spectacle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Spectacle non trouvé</h1>
          <a href="/spectacles" className="text-blue-500 hover:underline">
            Retour aux spectacles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/spectacles" className="text-gray-600 hover:text-gray-900">
              ← Retour aux spectacles
            </a>
            <img 
              src="https://edjs.art/assets/img/edjs%20logo%20black@4x.png" 
              alt="EDJS" 
              className="h-12"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Amatic SC, cursive' }}>
                {spectacle.title}
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                {spectacle.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                  {spectacle.duration}
                </span>
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                  {spectacle.ageRange}
                </span>
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                  {spectacle.genre}
                </span>
              </div>
              <button 
                onClick={handleReservation}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: 'Amatic SC, cursive' }}
              >
                Réserver maintenant
              </button>
            </div>
            <div className="relative">
              <img 
                src={spectacle.image} 
                alt={spectacle.title}
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Amatic SC, cursive' }}>
                Synopsis
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {spectacle.synopsis}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Amatic SC, cursive' }}>
                Thèmes abordés
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {spectacle.themes.map((theme, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-gray-700">{theme}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Amatic SC, cursive' }}>
                Informations pratiques
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-600">Durée:</span>
                  <span className="ml-2 text-gray-900">{spectacle.duration}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Âge recommandé:</span>
                  <span className="ml-2 text-gray-900">{spectacle.ageRange}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Genre:</span>
                  <span className="ml-2 text-gray-900">{spectacle.genre}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Mise en scène:</span>
                  <span className="ml-2 text-gray-900">{spectacle.director}</span>
                </div>
              </div>
            </div>


            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: 'Amatic SC, cursive' }}>
                Réservez votre place
              </h3>
              <p className="text-black mb-4">
                Ne manquez pas cette représentation exceptionnelle !
              </p>
              <button 
                onClick={handleReservation}
                className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
                style={{ fontFamily: 'Amatic SC, cursive' }}
              >
                Réserver maintenant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="https://edjs.art/assets/img/edjs%20logo%20black@4x.png" 
            alt="EDJS" 
            className="h-16 mx-auto mb-4 filter invert"
          />
          <p className="text-gray-400">
            L'École des jeunes spectateurs - Culture Pour Tous
          </p>
          <p className="text-gray-400 mt-2">
            Connecter la culture au Maroc à travers des spectacles théâtraux
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SpectacleDetails;
