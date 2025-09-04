import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SpectacleSimple() {
  const { user } = useAuth();

  const handleReservation = () => {
    if (user) {
      window.location.href = '/reservation/le-petit-prince';
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Le Petit Prince</h1>
          <p className="text-xl mb-8 opacity-90">
            Une aventure poétique à travers les étoiles
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              👥 3 acteurs
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              ⏰ 50 minutes
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              👶 7 ans et +
            </span>
          </div>
          
          <button 
            onClick={handleReservation}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
          >
            🎫 Réserver maintenant
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">L'Histoire</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Plongez dans l'univers magique du Petit Prince, cette œuvre intemporelle 
              d'Antoine de Saint-Exupéry qui continue de fasciner petits et grands. 
              Notre adaptation théâtrale vous emmène dans un voyage extraordinaire 
              à travers les planètes et les rencontres qui façonnent l'âme.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Le Petit Prince nous enseigne que "l'essentiel est invisible pour les yeux" 
              et que seul le cœur permet de bien voir. Une leçon de vie précieuse 
              transmise avec poésie et émotion sur scène.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Valeurs Éducatives</h3>
              <p className="text-gray-600">
                Amitié, tolérance, respect de la différence et découverte de soi.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Thèmes Abordés</h3>
              <p className="text-gray-600">
                L'enfance, l'imagination et l'importance des relations humaines.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Pédagogie</h3>
              <p className="text-gray-600">
                Développement de l'empathie et ouverture sur le monde.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Informations Pratiques</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Durée:</span>
                    <span>50 minutes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Âge recommandé:</span>
                    <span>7 ans et +</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Nombre d'acteurs:</span>
                    <span>3</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Genre:</span>
                    <span>Conte philosophique</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <button 
                  onClick={handleReservation}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors w-full"
                >
                  📅 Réserver une séance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
