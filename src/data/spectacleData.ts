export interface SpectacleInfo {
  id: string;
  title: string;
  duration: number; // in minutes
  comedians: number;
  genre: string;
  language: string;
  period: string;
  locations: string[];
  ageRecommendation: string; // for particulier, public schools, associations
  studyLevels: string; // for private schools
  color: string; // theme color for the spectacle
}

export const spectacleData: Record<string, SpectacleInfo> = {
  'le-petit-prince': {
    id: 'le-petit-prince',
    title: 'Le Petit Prince',
    duration: 60,
    comedians: 2,
    genre: 'Conte avec dessin sur sable',
    language: 'Français',
    period: 'Octobre 2025',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '7 ans et +',
    studyLevels: 'CM1, CM2, Collège, Lycée',
    color: '#BDCF00'
  },
  'le-petit-prince-ar': {
    id: 'le-petit-prince-ar',
    title: 'الأمير الصغير',
    duration: 60,
    comedians: 3,
    genre: 'مسرح موسيقي',
    language: 'العربية',
    period: 'أكتوبر 2025',
    locations: ['الدار البيضاء', 'الرباط'],
    ageRecommendation: '7 سنوات وأكثر',
    studyLevels: 'CM1, CM2, Collège, Lycée',
    color: '#BDCF00'
  },
  'tara-sur-la-lune': {
    id: 'tara-sur-la-lune',
    title: 'Tara sur la Lune',
    duration: 55,
    comedians: 1,
    genre: 'Théâtre avec projection',
    language: 'Français',
    period: 'Octobre 2025',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '5 ans et +',
    studyLevels: 'Maternelles, Primaires',
    color: '#6f42c1'
  },
  'leau-la': {
    id: 'leau-la',
    title: 'L\'eau là',
    duration: 55,
    comedians: 3,
    genre: 'Théâtre musical',
    language: 'Français',
    period: 'Novembre 2025',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '8 ans et +',
    studyLevels: 'CM1, CM2, Collège, Lycée',
    color: '#20c997'
  },
  'mirath-atfal': {
    id: 'mirath-atfal',
    title: 'ميراث الأطفال',
    duration: 60,
    comedians: 4,
    genre: 'Concert interactif',
    language: 'Darija',
    period: 'Novembre 2025',
    locations: ['الدار البيضاء', 'الرباط'],
    ageRecommendation: '5 ans et +',
    studyLevels: 'Primaire, Collège, Lycée',
    color: '#dc3545'
  },
  'simple-comme-bonjour': {
    id: 'simple-comme-bonjour',
    title: 'Simple comme bonjour',
    duration: 60,
    comedians: 3,
    genre: 'Théâtre musical',
    language: 'Français',
    period: 'Décembre 2025',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '6 ans et +',
    studyLevels: 'Du GS au CE2',
    color: '#ffc107'
  },
  'charlotte': {
    id: 'charlotte',
    title: 'Charlotte',
    duration: 50,
    comedians: 2,
    genre: 'Théâtre musical',
    language: 'Français',
    period: 'Janvier 2026',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '5 ans et +',
    studyLevels: 'Du GS au CE2',
    color: '#e91e63'
  },
  'estevanico': {
    id: 'estevanico',
    title: 'Estevanico',
    duration: 70,
    comedians: 4,
    genre: 'Théâtre historique',
    language: 'Français',
    period: 'Février 2026',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '10 ans et +',
    studyLevels: 'CE2, CM1, CM2, Collège',
    color: '#17a2b8'
  },
  'flash': {
    id: 'flash',
    title: 'Flash',
    duration: 65,
    comedians: 3,
    genre: 'Théâtre interactif',
    language: 'Français',
    period: 'Mars 2026',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '5 ans et +',
    studyLevels: 'GS au CM2',
    color: '#ff6b35'
  },
  'antigone': {
    id: 'antigone',
    title: 'Antigone',
    duration: 60,
    comedians: 6,
    genre: 'Tragédie moderne',
    language: 'Français',
    period: 'Avril 2026',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '12 ans et +',
    studyLevels: 'Collège, Lycée',
    color: '#6f42c1'
  },
  'alice-chez-les-merveilles': {
    id: 'alice-chez-les-merveilles',
    title: 'Alice chez les Merveilles',
    duration: 50,
    comedians: 3,
    genre: 'Conte fantastique',
    language: 'Français',
    period: 'Mai 2026',
    locations: ['Casablanca', 'Rabat'],
    ageRecommendation: '4 ans et +',
    studyLevels: 'MS, GS, CP',
    color: '#e83e8c'
  }
};

// Helper function to get spectacle info by ID
export const getSpectacleInfo = (spectacleId: string): SpectacleInfo | null => {
  return spectacleData[spectacleId] || null;
};

// Helper function to get info pills data based on user type
export const getInfoPills = (spectacleId: string, userType: string, professionalType?: string) => {
  const spectacle = getSpectacleInfo(spectacleId);
  if (!spectacle) return null;

  const pills = [
    {
      icon: 'fas fa-clock',
      text: `${spectacle.duration} mins`
    },
    {
      icon: 'fas fa-users',
      text: `${spectacle.comedians} comédien${spectacle.comedians > 1 ? 's' : ''}`
    }
  ];

  // Add age/study level pill based on user type
  if (userType === 'professional' && professionalType === 'scolaire-privee') {
    pills.push({
      icon: 'fas fa-baby',
      text: spectacle.studyLevels
    });
  } else {
    pills.push({
      icon: 'fas fa-baby',
      text: spectacle.ageRecommendation
    });
  }

  pills.push({
    icon: 'fas fa-theater-masks',
    text: spectacle.genre
  });

  return pills;
};

// Helper function to get sidebar info
export const getSidebarInfo = (spectacleId: string, userType: string, professionalType?: string) => {
  const spectacle = getSpectacleInfo(spectacleId);
  if (!spectacle) return null;

  const info = [
    {
      icon: 'fas fa-clock',
      label: 'Durée',
      value: `${spectacle.duration} minutes`
    },
    {
      icon: 'fas fa-users',
      label: 'Nombre de comédiens',
      value: spectacle.comedians.toString()
    }
  ];

  // Add age/study level info based on user type
  if (userType === 'professional' && professionalType === 'scolaire-privee') {
    info.push({
      icon: 'fas fa-graduation-cap',
      label: 'Niveaux scolaires',
      value: spectacle.studyLevels
    });
  } else {
    info.push({
      icon: 'fas fa-child',
      label: 'Âge recommandé',
      value: spectacle.ageRecommendation
    });
  }

  info.push(
    {
      icon: 'fas fa-calendar',
      label: 'Période',
      value: spectacle.period
    },
    {
      icon: 'fas fa-map-marker-alt',
      label: 'Lieux',
      value: spectacle.locations.join(' & ')
    },
    {
      icon: 'fas fa-theater-masks',
      label: 'Genre',
      value: spectacle.genre
    },
    {
      icon: 'fas fa-language',
      label: 'Langue',
      value: spectacle.language
    }
  );

  return info;
};
