export const getUserTypeInfo = () => {
  const userType = sessionStorage.getItem('userType');
  const professionalType = sessionStorage.getItem('professionalType');
  
  const isProfessional = userType === 'professional';
  const isPrivateSchool = professionalType === 'scolaire-privee';
  const isPublicSchool = professionalType === 'scolaire-publique';
  const isAssociation = professionalType === 'association';
  const isParticulier = userType === 'particulier';
  
  return {
    userType,
    professionalType,
    isProfessional,
    isPrivateSchool,
    isPublicSchool,
    isAssociation,
    isParticulier,
    showStudyLevel: isPrivateSchool, // Only show study levels for private schools
    showAgeRange: isParticulier || isPublicSchool || isAssociation, // Show age ranges for these user types
    getAgeOrStudyText: (age: string, studyLevel: string) => {
      return isPrivateSchool ? studyLevel : age; // Only private schools see study levels
    }
  };
};

export const getStudyLevelForSpectacle = (spectacleId: string) => {
  // Mapping of spectacle IDs to their study levels for private schools
  const spectacleStudyLevels: Record<string, string> = {
    'le-petit-prince': 'CM1, CM2, Collège, Lycée',
    'le-petit-prince-ar': 'CM1, CM2, Collège, Lycée',
    'tara-sur-la-lune': 'Maternelles, Primaires',
    'estevanico': 'CE2, CM1, CM2, Collège',
    'charlotte': 'Du GS au CE2',
    'alice-chez-les-merveilles': 'MS, GS, CP',
    'casse-noisette': 'CE1 - 5ème',
    'antigone': 'Collège, Lycée',
    'leau-la': 'CM1, CM2, Collège, Lycée',
    'mirath-atfal': 'Primaire, Collège, Lycée',
    'simple-comme-bonjour': 'Du GS au CE2',
    'lenfant-de-larbre': 'CM2, Collège'
  };
  
  return spectacleStudyLevels[spectacleId] || 'Tous niveaux';
};

export const getAgeRangeForSpectacle = (spectacleId: string) => {
  // Mapping of spectacle IDs to their age ranges for non-private school users
  const spectacleAgeRanges: Record<string, string> = {
    'le-petit-prince': '7 ans et +',
    'le-petit-prince-ar': '7 ans et +',
    'tara-sur-la-lune': '5 ans et +',
    'estevanico': '8 ans et +',
    'charlotte': '6 ans et +',
    'alice-chez-les-merveilles': '5 ans et +',
    'casse-noisette': '6 ans et +',
    'antigone': '12 ans et +',
    'leau-la': '9 ans et +',
    'mirath-atfal': '7 ans et +',
    'simple-comme-bonjour': '5 ans et +',
    'lenfant-de-larbre': '9 ans et +'
  };
  
  return spectacleAgeRanges[spectacleId] || 'Tout âge';
};
