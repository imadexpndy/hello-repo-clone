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
  // RABAT - THEATRE BAHNINI
  { id: 'lpp-1', date: '2025-10-04', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-2', date: '2025-10-06', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-3', date: '2025-10-06', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-4', date: '2025-10-07', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-5', date: '2025-10-07', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'le-petit-prince', month: 'octobre' },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'lpp-6', date: '2025-10-09', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-7', date: '2025-10-09', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-8', date: '2025-10-10', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-9', date: '2025-10-10', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre' },
  { id: 'lpp-10', date: '2025-10-11', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre' },

  // OCTOBRE - TARA SUR LA LUNE
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'tsl-1', date: '2025-10-13', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-2', date: '2025-10-14', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-3', date: '2025-10-14', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-4', date: '2025-10-18', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  
  // RABAT - THEATRE BAHNINI
  { id: 'tsl-5', date: '2025-10-09', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-6', date: '2025-10-09', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-7', date: '2025-10-10', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'tara-sur-la-lune', month: 'octobre' },
  { id: 'tsl-8', date: '2025-10-11', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre' },

  // NOVEMBRE - L'EAU LA
  // RABAT - THEATRE BAHNINI
  { id: 'leau-1', date: '2025-11-08', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-2', date: '2025-11-10', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-3', date: '2025-11-10', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-4', date: '2025-11-11', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-5', date: '2025-11-11', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'leau-la', month: 'novembre' },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'leau-6', date: '2025-11-13', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-7', date: '2025-11-13', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-8', date: '2025-11-14', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-9', date: '2025-11-14', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-10', date: '2025-11-14', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre' },
  { id: 'leau-11', date: '2025-11-15', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'leau-la', month: 'novembre' },

  // NOVEMBRE - MIRATH ATFAL
  // CASABLANCA - THEATRE ZEFZAF
  { id: 'ma-1', date: '2025-11-08', time: '15:00', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-2', date: '2025-11-10', time: '09:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-3', date: '2025-11-10', time: '14:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'scolaire-publique', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-4', date: '2025-11-11', time: '14:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre' },
  
  // RABAT - THEATRE BAHNINI
  { id: 'ma-5', date: '2025-11-13', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-6', date: '2025-11-13', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-7', date: '2025-11-14', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-8', date: '2025-11-14', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre' },
  { id: 'ma-9', date: '2025-11-15', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre' },

  // DECEMBRE - SIMPLE COMME BONJOUR
  // RABAT - THEATRE BAHNINI
  { id: 'scb-1', date: '2025-12-13', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-2', date: '2025-12-15', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-3', date: '2025-12-15', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-4', date: '2025-12-16', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-5', date: '2025-12-16', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'scb-6', date: '2025-12-18', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-7', date: '2025-12-18', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-8', date: '2025-12-19', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-9', date: '2025-12-19', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
  { id: 'scb-10', date: '2025-12-20', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'simple-comme-bonjour', month: 'decembre' },
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
