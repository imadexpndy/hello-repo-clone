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
  // Define study levels for each spectacle
  const studyLevels: Record<string, string> = {
    'le-petit-prince': 'CE2 - 6ème',
    'tara-sur-la-lune': 'CP - CE2',
    'estevanico': '4ème - Terminale',
    'charlotte': 'CE1 - CM2',
    'alice-chez-les-merveilles': 'CP - CE2',
    'casse-noisette': 'Maternelle - CP',
    'leau-la': 'CE2 - 5ème',
    'lenfant-de-larbre': 'CE1 - 6ème',
    'antigone': '3ème - Terminale',
    'simple-comme-bonjour': 'Maternelle - CE1'
  };
  
  return studyLevels[spectacleId] || 'Tous niveaux';
};
