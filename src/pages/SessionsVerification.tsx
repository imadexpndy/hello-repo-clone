import React, { useState, useMemo } from 'react';
import { SESSIONS, getUserTypeSessions } from '../data/sessions';

const SessionsVerification: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [selectedProfessionalType, setSelectedProfessionalType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSpectacle, setSelectedSpectacle] = useState<string>('all');

  // Get unique values for filters
  const userTypes = ['all', 'tout-public', 'scolaire-privee', 'scolaire-publique', 'association'];
  const professionalTypes = ['all', 'professional', 'non-professional'];
  const cities = ['all', ...Array.from(new Set(SESSIONS.map(s => s.location)))];
  const spectacles = ['all', ...Array.from(new Set(SESSIONS.map(s => s.spectacleId)))];

  // Filter sessions based on selected filters
  const filteredSessions = useMemo(() => {
    let sessions = [...SESSIONS];

    if (selectedUserType !== 'all') {
      sessions = sessions.filter(s => s.audienceType === selectedUserType);
    }

    if (selectedCity !== 'all') {
      sessions = sessions.filter(s => s.location === selectedCity);
    }

    if (selectedSpectacle !== 'all') {
      sessions = sessions.filter(s => s.spectacleId === selectedSpectacle);
    }

    return sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedUserType, selectedCity, selectedSpectacle]);

  // Group sessions by spectacle for better organization
  const sessionsBySpectacle = useMemo(() => {
    const grouped: { [key: string]: typeof SESSIONS } = {};
    filteredSessions.forEach(session => {
      if (!grouped[session.spectacleId]) {
        grouped[session.spectacleId] = [];
      }
      grouped[session.spectacleId].push(session);
    });
    return grouped;
  }, [filteredSessions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAudienceTypeColor = (audienceType: string) => {
    switch (audienceType) {
      case 'tout-public': return 'bg-blue-100 text-blue-800';
      case 'scolaire-privee': return 'bg-green-100 text-green-800';
      case 'scolaire-publique': return 'bg-yellow-100 text-yellow-800';
      case 'association': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpectacleName = (spectacleId: string) => {
    const names: { [key: string]: string } = {
      'le-petit-prince': 'Le Petit Prince',
      'le-petit-prince-ar': 'Le Petit Prince (Arabic)',
      'tara-sur-la-lune': 'Tara sur la Lune',
      'leau-la': "L'Eau Là",
      'mirath-atfal': 'Mirath Atfal',
      'simple-comme-bonjour': 'Simple Comme Bonjour',
      'charlotte': 'Charlotte',
      'estevanico': 'Estevanico',
      'flash': 'Flash',
      'antigone': 'Antigone',
      'alice-chez-les-merveilles': 'Alice chez les Merveilles'
    };
    return names[spectacleId] || spectacleId;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Vérification des Sessions - Tous les Spectacles
          </h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-100 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'audience
              </label>
              <select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="tout-public">Tout Public</option>
                <option value="scolaire-privee">Scolaire Privée</option>
                <option value="scolaire-publique">Scolaire Publique</option>
                <option value="association">Association</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toutes les villes</option>
                {cities.slice(1).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spectacle
              </label>
              <select
                value={selectedSpectacle}
                onChange={(e) => setSelectedSpectacle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les spectacles</option>
                {spectacles.slice(1).map(spectacle => (
                  <option key={spectacle} value={spectacle}>
                    {getSpectacleName(spectacle)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Résumé des Sessions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredSessions.length}</div>
                <div className="text-gray-600">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredSessions.filter(s => s.audienceType === 'tout-public').length}
                </div>
                <div className="text-gray-600">Tout Public</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredSessions.filter(s => s.audienceType === 'association').length}
                </div>
                <div className="text-gray-600">Association</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredSessions.filter(s => s.audienceType.includes('scolaire')).length}
                </div>
                <div className="text-gray-600">Scolaire</div>
              </div>
            </div>
          </div>

          {/* Sessions by Spectacle */}
          <div className="space-y-8">
            {Object.entries(sessionsBySpectacle).map(([spectacleId, sessions]) => (
              <div key={spectacleId} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                  {getSpectacleName(spectacleId)}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({sessions.length} session{sessions.length > 1 ? 's' : ''})
                  </span>
                </h3>

                <div className="grid gap-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAudienceTypeColor(session.audienceType)}`}>
                            {session.audienceType}
                          </span>
                          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                            {session.month}
                          </span>
                          {session.price && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              {session.price} DH
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Date:</strong> {formatDate(session.date)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Heure:</strong> {session.time}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Lieu:</strong> {session.location}
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:ml-4">
                        <span className="text-xs text-gray-500 font-mono">
                          ID: {session.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Aucune session trouvée avec les filtres sélectionnés.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsVerification;
