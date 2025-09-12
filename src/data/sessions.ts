export interface Session {
  id: string;
  date: string;
  time: string;
  location: string;
  audienceType: 'tout-public' | 'scolaire-privee' | 'scolaire-publique' | 'association';
  spectacleId: string;
  month: string;
  price?: number;
  capacity: number;
}

export const SESSIONS: Session[] = [
  // OCTOBRE - LE PETIT PRINCE
  // RABAT - THEATRE BAHNINI
  { id: 'lpp-1', date: '2025-10-04', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre', capacity: 220 },
  { id: 'lpp-2', date: '2025-10-06', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre', price: 100, capacity: 400 },
  { id: 'lpp-3', date: '2025-10-06', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre', price: 100, capacity: 400 },
  { id: 'lpp-4', date: '2025-10-07', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'le-petit-prince', month: 'octobre', capacity: 400 },
  { id: 'lpp-5', date: '2025-10-07', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'le-petit-prince', month: 'octobre', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'lpp-6', date: '2025-10-09', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'le-petit-prince', month: 'octobre', capacity: 300 },
  { id: 'lpp-7', date: '2025-10-09', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'le-petit-prince', month: 'octobre', capacity: 300 },
  { id: 'lpp-8', date: '2025-10-10', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre', price: 100, capacity: 300 },
  { id: 'lpp-9', date: '2025-10-10', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'le-petit-prince', month: 'octobre', price: 100, capacity: 300 },
  { id: 'lpp-10', date: '2025-10-11', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'le-petit-prince', month: 'octobre', capacity: 220 },
  
  // LE PETIT PRINCE ARABIC VERSION
  { id: 'lpp-ar-1', date: '2025-10-05', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'le-petit-prince-ar', month: 'octobre', capacity: 220 },
  { id: 'lpp-ar-2', date: '2025-10-12', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'le-petit-prince-ar', month: 'octobre', capacity: 220 },

  // OCTOBRE - TARA SUR LA LUNE
  // RABAT - THEATRE BAHNINI
  { id: 'tsl-1', date: '2025-10-11', time: '14:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre', capacity: 220 },
  { id: 'tsl-2', date: '2025-10-09', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre', price: 100, capacity: 400 },
  { id: 'tsl-3', date: '2025-10-09', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'tara-sur-la-lune', month: 'octobre', capacity: 400 },
  { id: 'tsl-4', date: '2025-10-10', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'tara-sur-la-lune', month: 'octobre', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'tsl-5', date: '2025-10-18', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'tara-sur-la-lune', month: 'octobre', capacity: 220 },
  { id: 'tsl-6', date: '2025-10-13', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'tara-sur-la-lune', month: 'octobre', price: 100, capacity: 300 },
  { id: 'tsl-7', date: '2025-10-14', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'tara-sur-la-lune', month: 'octobre', capacity: 300 },
  { id: 'tsl-8', date: '2025-10-14', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'tara-sur-la-lune', month: 'octobre', capacity: 300 },

  // NOVEMBRE - L'EAU LA
  // RABAT - THEATRE BAHNINI
  { id: 'leau-1', date: '2025-11-08', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'leau-la', month: 'novembre', capacity: 220 },
  { id: 'leau-2', date: '2025-11-10', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre', price: 100, capacity: 400 },
  { id: 'leau-3', date: '2025-11-10', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre', price: 100, capacity: 400 },
  { id: 'leau-4', date: '2025-11-11', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'leau-la', month: 'novembre', capacity: 400 },
  { id: 'leau-5', date: '2025-11-11', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'leau-la', month: 'novembre', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'leau-6', date: '2025-11-13', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre', price: 100, capacity: 300 },
  { id: 'leau-7', date: '2025-11-13', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre', price: 100, capacity: 300 },
  { id: 'leau-8', date: '2025-11-14', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'leau-la', month: 'novembre', capacity: 300 },
  { id: 'leau-9', date: '2025-11-14', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'leau-la', month: 'novembre', capacity: 300 },
  { id: 'leau-10', date: '2025-11-14', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre', price: 100, capacity: 300 },
  { id: 'leau-11', date: '2025-11-15', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'leau-la', month: 'novembre', capacity: 220 },
  { id: 'leau-12', date: '2025-11-13', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre', price: 100, capacity: 400 },
  { id: 'leau-13', date: '2025-11-13', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'leau-la', month: 'novembre', price: 100, capacity: 400 },

  // NOVEMBRE - MIRATH ATFAL
  // CASABLANCA - THEATRE ZEFZAF
  { id: 'ma-1', date: '2025-11-08', time: '15:00', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre', capacity: 220 },
  { id: 'ma-2', date: '2025-11-10', time: '09:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre', price: 100, capacity: 300 },
  { id: 'ma-3', date: '2025-11-10', time: '14:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'scolaire-publique', spectacleId: 'mirath-atfal', month: 'novembre', capacity: 300 },
  { id: 'ma-4', date: '2025-11-11', time: '14:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre', capacity: 300 },
  
  // RABAT - SALLE ALLAL EL FASSI
  { id: 'ma-5', date: '2025-11-13', time: '09:30', location: 'RABAT - SALLE ALLAL EL FASSI', audienceType: 'scolaire-privee', spectacleId: 'mirath-atfal', month: 'novembre', price: 100, capacity: 400 },
  { id: 'ma-6', date: '2025-11-13', time: '14:30', location: 'RABAT - SALLE ALLAL EL FASSI', audienceType: 'scolaire-publique', spectacleId: 'mirath-atfal', month: 'novembre', capacity: 400 },
  { id: 'ma-7', date: '2025-11-14', time: '09:30', location: 'RABAT - SALLE ALLAL EL FASSI', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre', capacity: 400 },
  { id: 'ma-8', date: '2025-11-14', time: '14:30', location: 'RABAT - SALLE ALLAL EL FASSI', audienceType: 'association', spectacleId: 'mirath-atfal', month: 'novembre', capacity: 400 },
  { id: 'ma-9', date: '2025-11-15', time: '15:00', location: 'RABAT - SALLE ALLAL EL FASSI', audienceType: 'tout-public', spectacleId: 'mirath-atfal', month: 'novembre', capacity: 220 },

  // DECEMBRE - SIMPLE COMME BONJOUR
  // RABAT - THEATRE BAHNINI
  { id: 'scb-1', date: '2025-12-13', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'simple-comme-bonjour', month: 'decembre', capacity: 220 },
  { id: 'scb-2', date: '2025-12-15', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre', price: 100, capacity: 400 },
  { id: 'scb-3', date: '2025-12-15', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre', price: 100, capacity: 400 },
  { id: 'scb-4', date: '2025-12-16', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'simple-comme-bonjour', month: 'decembre', capacity: 400 },
  { id: 'scb-5', date: '2025-12-16', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'simple-comme-bonjour', month: 'decembre', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'scb-6', date: '2025-12-18', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre', price: 100, capacity: 300 },
  { id: 'scb-7', date: '2025-12-18', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'simple-comme-bonjour', month: 'decembre', price: 100, capacity: 300 },
  { id: 'scb-8', date: '2025-12-19', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'simple-comme-bonjour', month: 'decembre', capacity: 300 },
  { id: 'scb-9', date: '2025-12-19', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'simple-comme-bonjour', month: 'decembre', capacity: 300 },
  { id: 'scb-10', date: '2025-12-20', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'simple-comme-bonjour', month: 'decembre', capacity: 220 },

  // JANVIER - CHARLOTTE
  // RABAT - THEATRE BAHNINI
  { id: 'cha-1', date: '2026-01-24', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'charlotte', month: 'janvier', capacity: 220 },
  { id: 'cha-2', date: '2026-01-26', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'charlotte', month: 'janvier', price: 100, capacity: 400 },
  { id: 'cha-3', date: '2026-01-26', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'charlotte', month: 'janvier', price: 100, capacity: 400 },
  { id: 'cha-4', date: '2026-01-27', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'charlotte', month: 'janvier', capacity: 400 },
  { id: 'cha-5', date: '2026-01-27', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'charlotte', month: 'janvier', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'cha-6', date: '2026-01-29', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'charlotte', month: 'janvier', price: 100, capacity: 300 },
  { id: 'cha-7', date: '2026-01-29', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'charlotte', month: 'janvier', price: 100, capacity: 300 },
  { id: 'cha-8', date: '2026-01-30', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'charlotte', month: 'janvier', capacity: 300 },
  { id: 'cha-9', date: '2026-01-30', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'charlotte', month: 'janvier', capacity: 300 },
  { id: 'cha-10', date: '2026-01-31', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'charlotte', month: 'janvier', capacity: 220 },

  // FEVRIER - ESTEVANICO
  // RABAT - THEATRE BAHNINI
  { id: 'est-1', date: '2026-02-14', time: '14:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'estevanico', month: 'fevrier', capacity: 220 },
  { id: 'est-2', date: '2026-02-16', time: '10:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'estevanico', month: 'fevrier', price: 100, capacity: 400 },
  { id: 'est-3', date: '2026-02-16', time: '14:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'estevanico', month: 'fevrier', price: 100, capacity: 400 },
  { id: 'est-4', date: '2026-02-17', time: '10:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'estevanico', month: 'fevrier', capacity: 400 },
  { id: 'est-5', date: '2026-02-17', time: '14:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'estevanico', month: 'fevrier', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'est-6', date: '2026-02-19', time: '10:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'estevanico', month: 'fevrier', price: 100, capacity: 300 },
  { id: 'est-7', date: '2026-02-19', time: '14:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'estevanico', month: 'fevrier', price: 100, capacity: 300 },
  { id: 'est-8', date: '2026-02-20', time: '10:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'estevanico', month: 'fevrier', capacity: 300 },
  { id: 'est-9', date: '2026-02-20', time: '14:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'estevanico', month: 'fevrier', capacity: 300 },
  { id: 'est-10', date: '2026-02-21', time: '14:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'estevanico', month: 'fevrier', capacity: 220 },

  // MARS - FLASH
  // RABAT - THEATRE BAHNINI
  { id: 'flash-1', date: '2026-03-28', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'flash', month: 'mars', capacity: 220 },
  { id: 'flash-2', date: '2026-03-30', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'flash', month: 'mars', price: 100, capacity: 400 },
  { id: 'flash-3', date: '2026-03-30', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'flash', month: 'mars', price: 100, capacity: 400 },
  { id: 'flash-4', date: '2026-03-31', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'flash', month: 'mars', capacity: 400 },
  { id: 'flash-5', date: '2026-03-31', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'flash', month: 'mars', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'flash-6', date: '2026-04-02', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'flash', month: 'avril', price: 100, capacity: 300 },
  { id: 'flash-7', date: '2026-04-02', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'flash', month: 'avril', price: 100, capacity: 300 },
  { id: 'flash-8', date: '2026-04-03', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'flash', month: 'avril', capacity: 300 },
  { id: 'flash-9', date: '2026-04-03', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'flash', month: 'avril', capacity: 300 },
  { id: 'flash-10', date: '2026-04-04', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'flash', month: 'avril', capacity: 220 },

  // AVRIL - ANTIGONE
  // RABAT - THEATRE BAHNINI
  { id: 'ant-1', date: '2026-04-18', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'antigone', month: 'avril', capacity: 220 },
  { id: 'ant-2', date: '2026-04-20', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'antigone', month: 'avril', price: 100, capacity: 400 },
  { id: 'ant-3', date: '2026-04-20', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'antigone', month: 'avril', price: 100, capacity: 400 },
  { id: 'ant-4', date: '2026-04-21', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'antigone', month: 'avril', capacity: 400 },
  { id: 'ant-5', date: '2026-04-21', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'antigone', month: 'avril', capacity: 400 },
  
  // CASABLANCA - THEATRE ZEFZAF
  { id: 'ant-6', date: '2026-04-23', time: '09:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'scolaire-privee', spectacleId: 'antigone', month: 'avril', price: 100, capacity: 300 },
  { id: 'ant-7', date: '2026-04-23', time: '14:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'scolaire-privee', spectacleId: 'antigone', month: 'avril', price: 100, capacity: 300 },
  { id: 'ant-8', date: '2026-04-24', time: '09:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'scolaire-publique', spectacleId: 'antigone', month: 'avril', capacity: 300 },
  { id: 'ant-9', date: '2026-04-24', time: '14:30', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'association', spectacleId: 'antigone', month: 'avril', capacity: 300 },
  { id: 'ant-10', date: '2026-04-25', time: '15:00', location: 'CASABLANCA - THEATRE ZEFZAF', audienceType: 'tout-public', spectacleId: 'antigone', month: 'avril', capacity: 220 },

  // MAI - ALICE CHEZ LES MERVEILLES
  // RABAT - THEATRE BAHNINI
  { id: 'ali-1', date: '2026-05-16', time: '15:00', location: 'RABAT - THEATRE BAHNINI', audienceType: 'tout-public', spectacleId: 'alice-chez-les-merveilles', month: 'mai', capacity: 220 },
  { id: 'ali-2', date: '2026-05-18', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'alice-chez-les-merveilles', month: 'mai', price: 100, capacity: 400 },
  { id: 'ali-3', date: '2026-05-18', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-privee', spectacleId: 'alice-chez-les-merveilles', month: 'mai', price: 100, capacity: 400 },
  { id: 'ali-4', date: '2026-05-19', time: '09:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'association', spectacleId: 'alice-chez-les-merveilles', month: 'mai', capacity: 400 },
  { id: 'ali-5', date: '2026-05-19', time: '14:30', location: 'RABAT - THEATRE BAHNINI', audienceType: 'scolaire-publique', spectacleId: 'alice-chez-les-merveilles', month: 'mai', capacity: 400 },
  
  // CASABLANCA - COMPLEXE EL HASSANI
  { id: 'ali-6', date: '2026-05-21', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'alice-chez-les-merveilles', month: 'mai', price: 100, capacity: 300 },
  { id: 'ali-7', date: '2026-05-21', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-privee', spectacleId: 'alice-chez-les-merveilles', month: 'mai', price: 100, capacity: 300 },
  { id: 'ali-8', date: '2026-05-22', time: '09:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'scolaire-publique', spectacleId: 'alice-chez-les-merveilles', month: 'mai', capacity: 300 },
  { id: 'ali-9', date: '2026-05-22', time: '14:30', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'association', spectacleId: 'alice-chez-les-merveilles', month: 'mai', capacity: 300 },
  { id: 'ali-10', date: '2026-05-23', time: '15:00', location: 'CASABLANCA - COMPLEXE EL HASSANI', audienceType: 'tout-public', spectacleId: 'alice-chez-les-merveilles', month: 'mai', capacity: 220 },

];

export const getUserTypeSessions = (spectacleId: string, userType?: string, userCity?: string) => {
  let filteredSessions = SESSIONS.filter(session => session.spectacleId === spectacleId);

  // Filter out Arabic version of Le Petit Prince for private schools only
  if (spectacleId === 'le-petit-prince-ar' && userType === 'scolaire-privee') {
    return [];
  }

  console.log('getUserTypeSessions called with:', { spectacleId, userType, userCity, totalSessions: filteredSessions.length });

  if (!userType || userType === '') {
    console.log('No userType provided, returning all sessions');
    return filteredSessions;
  }

  // Filter by user type
  if (userType === 'individual' || userType === 'particulier') {
    // Individual users see only "tout-public" sessions
    filteredSessions = filteredSessions.filter(session => 
      session.audienceType === 'tout-public'
    );
    console.log('Filtered for particulier/individual:', filteredSessions.length);
    
    // Don't filter by city for particulier - they should see both Rabat and Casablanca sessions
    // This allows them to choose their preferred city
    console.log('Particulier sees all cities - no city filtering applied');
  } else if (userType === 'scolaire-privee') {
    // Private schools see only their specific sessions
    filteredSessions = filteredSessions.filter(session => 
      session.audienceType === 'scolaire-privee'
    );
    console.log('Filtered for scolaire-privee:', filteredSessions.length);
  } else if (userType === 'scolaire-publique') {
    // Public schools see only their specific sessions
    filteredSessions = filteredSessions.filter(session => 
      session.audienceType === 'scolaire-publique'
    );
    console.log('Filtered for scolaire-publique:', filteredSessions.length);
  } else if (userType === 'association') {
    // Associations see only their specific sessions
    filteredSessions = filteredSessions.filter(session => 
      session.audienceType === 'association'
    );
    console.log('Filtered for association:', filteredSessions.length);
  } else {
    console.log('Unknown userType:', userType, 'returning all sessions');
  }

  const result = filteredSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  console.log('Final filtered sessions:', result.map(s => ({ id: s.id, audienceType: s.audienceType })));
  return result;
};
