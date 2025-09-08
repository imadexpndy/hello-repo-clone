export interface Session {
  id: string;
  date: string;
  time: string;
  location: string;
  audienceType: 'tout-public' | 'scolaire-privee' | 'scolaire-publique' | 'association';
  spectacleId: string;
  month: string;
}

export const SESSIONS: Session[] = [
  // OCTOBRE - LE PETIT PRINCE
  { id: 'lpp-1', date: '2025-10-15', time: '09:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-2', date: '2025-10-16', time: '14:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-3', date: '2025-10-17', time: '09:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-4', date: '2025-10-18', time: '14:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-5', date: '2025-10-19', time: '15:00', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-6', date: '2025-10-22', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-7', date: '2025-10-23', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-8', date: '2025-10-24', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-9', date: '2025-10-25', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-10', date: '2025-10-26', time: '15:00', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-11', date: '2025-10-30', time: '10:00', location: 'Séances supplémentaires', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-12', date: '2025-10-31', time: '15:00', location: 'Séances supplémentaires', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  
  // Professional sessions for Le Petit Prince
  { id: 'lpp-p1', date: '2025-10-16', time: '09:30', location: 'RABAT - Représentations', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-p2', date: '2025-10-17', time: '14:30', location: 'RABAT - Représentations', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-p3', date: '2025-10-23', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-p4', date: '2025-10-24', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-pub1', date: '2025-10-18', time: '09:30', location: 'RABAT - Représentations', audienceType: 'scolaire-publique', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-pub2', date: '2025-10-25', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-publique', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-a1', date: '2025-10-19', time: '09:30', location: 'RABAT - Représentations', audienceType: 'association', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-a2', date: '2025-10-26', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'association', spectacleId: 'le-petit-prince', month: 'octobre' },

  // OCTOBRE - TARA SUR LA LUNE
  { id: 'tsl-1', date: '2025-10-15', time: '09:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-2', date: '2025-10-16', time: '14:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-3', date: '2025-10-17', time: '09:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-4', date: '2025-10-18', time: '14:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-5', date: '2025-10-19', time: '15:00', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-6', date: '2025-10-22', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-7', date: '2025-10-23', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-8', date: '2025-10-24', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-9', date: '2025-10-25', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-10', date: '2025-10-26', time: '15:00', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-11', date: '2025-10-30', time: '10:00', location: 'Séances supplémentaires', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-12', date: '2025-10-31', time: '15:00', location: 'Séances supplémentaires', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  
  // Professional sessions for Tara sur la Lune
  { id: 'tsl-p1', date: '2025-10-16', time: '09:30', location: 'RABAT - Représentations', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-p2', date: '2025-10-17', time: '14:30', location: 'RABAT - Représentations', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-p3', date: '2025-10-23', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-p4', date: '2025-10-24', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-pub1', date: '2025-10-18', time: '09:30', location: 'RABAT - Représentations', audienceType: 'scolaire-publique', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-pub2', date: '2025-10-25', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-publique', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-a1', date: '2025-10-19', time: '09:30', location: 'RABAT - Représentations', audienceType: 'association', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-a2', date: '2025-10-26', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'association', spectacleId: 'tara-sur-la-lune', month: 'octobre' },

  // NOVEMBRE - MIRATH ATFAL
  { id: 'ma-1', date: '2025-11-05', time: '09:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-2', date: '2025-11-06', time: '14:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-3', date: '2025-11-07', time: '09:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-4', date: '2025-11-08', time: '14:30', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-5', date: '2025-11-09', time: '15:00', location: 'RABAT - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-6', date: '2025-11-12', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-7', date: '2025-11-13', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-8', date: '2025-11-14', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-9', date: '2025-11-15', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-10', date: '2025-11-16', time: '15:00', location: 'CASABLANCA - Représentations', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-11', date: '2025-11-20', time: '10:00', location: 'Séances supplémentaires', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-12', date: '2025-11-21', time: '15:00', location: 'Séances supplémentaires', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  
  // Professional sessions for Mirath Atfal
  { id: 'ma-p1', date: '2025-11-06', time: '09:30', location: 'RABAT - Représentations', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-p2', date: '2025-11-07', time: '14:30', location: 'RABAT - Représentations', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-p3', date: '2025-11-13', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-p4', date: '2025-11-14', time: '14:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-pub1', date: '2025-11-08', time: '09:30', location: 'RABAT - Représentations', audienceType: 'scolaire-publique', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-pub2', date: '2025-11-15', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'scolaire-publique', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-a1', date: '2025-11-09', time: '09:30', location: 'RABAT - Représentations', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-a2', date: '2025-11-16', time: '09:30', location: 'CASABLANCA - Représentations', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre' },
];

export const getUserTypeSessions = (spectacleId: string, userType?: string, userCity?: string) => {
  let spectacleSessions = SESSIONS.filter(s => s.spectacleId === spectacleId);
  
  // Get user type from session storage if not provided
  const sessionUserType = sessionStorage.getItem('userType');
  const sessionProfessionalType = sessionStorage.getItem('professionalType');
  
  // Determine effective user type
  let effectiveUserType = userType;
  if (!effectiveUserType && sessionUserType) {
    if (sessionUserType === 'professional' && sessionProfessionalType) {
      effectiveUserType = sessionProfessionalType;
    } else if (sessionUserType === 'particulier') {
      effectiveUserType = 'particulier';
    }
  }
  
  // For professionals, show sessions from both cities (no city filtering)
  if (effectiveUserType && ['scolaire-privee', 'scolaire-publique', 'association'].includes(effectiveUserType)) {
    // Professional users see sessions from all cities
    switch (effectiveUserType) {
      case 'scolaire-privee':
        return spectacleSessions.filter(s => s.audienceType === 'scolaire-privee');
      case 'scolaire-publique':
        return spectacleSessions.filter(s => s.audienceType === 'scolaire-publique');
      case 'association':
        return spectacleSessions.filter(s => s.audienceType === 'association');
    }
  }
  
  // For particulier users, filter by city
  if (userCity && (effectiveUserType === 'particulier' || !effectiveUserType)) {
    const cityKeywords = {
      'rabat': ['RABAT'],
      'casablanca': ['CASABLANCA'],
      'sale': ['RABAT'], // Sale is close to Rabat
      'temara': ['RABAT'], // Temara is close to Rabat
      'mohammedia': ['CASABLANCA'], // Mohammedia is close to Casablanca
    };
    
    const userCityLower = userCity.toLowerCase();
    const relevantKeywords = cityKeywords[userCityLower] || [userCityLower.toUpperCase()];
    
    spectacleSessions = spectacleSessions.filter(session => 
      relevantKeywords.some(keyword => session.location.includes(keyword))
    );
  }
  
  // Filter by audience type
  if (!effectiveUserType || effectiveUserType === 'particulier') {
    // Particulier and guest users only see public sessions
    return spectacleSessions.filter(s => s.audienceType === 'tout-public');
  }
  
  // Default fallback
  return spectacleSessions.filter(s => s.audienceType === 'tout-public');
};
