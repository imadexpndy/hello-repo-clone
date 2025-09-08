export const getUserTypeInfo = () => {
  const userType = sessionStorage.getItem('userType');
  const professionalType = sessionStorage.getItem('professionalType');
  
  const isProfessional = userType === 'professional';
  const isPrivateSchool = professionalType === 'scolaire-privee';
  const isPublicSchool = professionalType === 'scolaire-publique';
  const isAssociation = professionalType === 'association';
  
  return {
    userType,
    professionalType,
    isProfessional,
    isPrivateSchool,
    isPublicSchool,
    isAssociation,
    showStudyLevel: isProfessional,
    getAgeOrStudyText: (age: string, studyLevel: string) => {
      return isProfessional ? studyLevel : age;
    }
  };
};

export const getStudyLevelForSpectacle = (spectacleId: string) => {
  // Mapping of spectacle IDs to their study levels for professional users
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
