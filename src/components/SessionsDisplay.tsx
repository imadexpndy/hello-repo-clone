import React, { useState, useEffect } from 'react';
import { SESSIONS, Session } from '@/data/sessions';

interface SessionsDisplayProps {
  spectacleId: string;
  onReservation?: () => void;
}

const SessionsDisplay: React.FC<SessionsDisplayProps> = ({ spectacleId, onReservation }) => {
  const [userType, setUserType] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Get user type from multiple sources
    const checkUserType = () => {
      const userType = sessionStorage.getItem('userType') || localStorage.getItem('userType');
      const professionalType = sessionStorage.getItem('professionalType') || localStorage.getItem('professionalType');
      
      let effectiveUserType = userType;
      
      // Handle professional types
      if (userType === 'professional' && professionalType) {
        effectiveUserType = professionalType;
      } else if (userType === 'particulier') {
        effectiveUserType = 'individual';
      }
      
      setUserType(effectiveUserType || '');
      
      // Filter sessions for this spectacle and user type
      let filteredSessions = SESSIONS.filter(s => s.spectacleId === spectacleId);
      
      if (effectiveUserType === 'individual') {
        filteredSessions = filteredSessions.filter(s => s.audienceType === 'tout-public');
      } else if (effectiveUserType === 'scolaire-privee') {
        filteredSessions = filteredSessions.filter(s => s.audienceType === 'scolaire-privee');
      } else if (effectiveUserType === 'scolaire-publique') {
        filteredSessions = filteredSessions.filter(s => s.audienceType === 'scolaire-publique');
      } else if (effectiveUserType === 'association') {
        filteredSessions = filteredSessions.filter(s => s.audienceType === 'association');
      }
      
      setSessions(filteredSessions);
    };

    checkUserType();
    
    // Listen for changes
    const interval = setInterval(checkUserType, 1000);
    window.addEventListener('storage', checkUserType);
    window.addEventListener('userTypeChanged', checkUserType);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkUserType);
      window.removeEventListener('userTypeChanged', checkUserType);
    };
  }, [spectacleId]);

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const months = ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getAudienceLabel = (type: string) => {
    switch (type) {
      case 'tout-public': return 'Tout public';
      case 'scolaire-privee': return 'Scolaire privée';
      case 'scolaire-publique': return 'Scolaire publique';
      case 'association': return 'Association';
      default: return type;
    }
  };

  // Debug logging
  console.log('SessionsDisplay Debug:', {
    spectacleId,
    userType,
    allSessions: SESSIONS.filter(s => s.spectacleId === spectacleId),
    filteredSessions: sessions,
    sessionCount: sessions.length
  });

  if (!userType) {
    return (
      <div style={{
        background: '#f8f9fa',
        borderRadius: '0.5rem',
        padding: '1rem',
        borderLeft: '4px solid #BDCF00',
        textAlign: 'center'
      }}>
        <div style={{ color: '#666', marginBottom: '1rem' }}>
          Veuillez sélectionner votre profil pour voir les séances disponibles
        </div>
        <button 
          onClick={() => window.location.href = '/user-type-selection'}
          style={{
            background: '#BDCF00',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Choisir mon profil
        </button>
      </div>
    );
  }

  if (sessions.length === 0) {
    // Show all sessions for debugging when no filtered sessions found
    const allSpectacleSessions = SESSIONS.filter(s => s.spectacleId === spectacleId);
    
    return (
      <div>
        <div style={{
          background: '#fff3cd',
          borderRadius: '0.5rem',
          padding: '1rem',
          borderLeft: '4px solid #ffc107',
          marginBottom: '1rem'
        }}>
          <div style={{ color: '#856404', marginBottom: '0.5rem', fontWeight: 500 }}>
            Aucune séance disponible pour votre profil ({userType})
          </div>
          <div style={{ color: '#856404', fontSize: '0.85rem' }}>
            Toutes les séances pour ce spectacle:
          </div>
        </div>
        
        {allSpectacleSessions.map((session) => (
          <div key={session.id} style={{
            background: '#f8f9fa',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            borderLeft: '4px solid #6c757d',
            opacity: 0.7
          }}>
            <div style={{
              fontWeight: 500,
              color: '#333',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }}>
              Date: {formatSessionDate(session.date)}, Heure: {session.time.replace(':', 'H')}, Séance: {getAudienceLabel(session.audienceType)}
            </div>
            <div style={{
              color: '#666',
              fontSize: '0.85rem',
              marginBottom: '0.75rem'
            }}>
              {session.location}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              (Non disponible pour votre profil)
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => window.location.href = '/user-type-selection'}
          style={{
            background: '#BDCF00',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          Changer mon profil
        </button>
      </div>
    );
  }

  return (
    <div>
      {sessions.map((session) => (
        <div key={session.id} style={{
          background: '#f8f9fa',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
          borderLeft: '4px solid #BDCF00'
        }}>
          <div style={{
            fontWeight: 500,
            color: '#333',
            marginBottom: '0.5rem',
            fontSize: '0.9rem'
          }}>
            Date: {formatSessionDate(session.date)}, Heure: {session.time.replace(':', 'H')}, Séance: {getAudienceLabel(session.audienceType)}
          </div>
          <div style={{
            color: '#666',
            fontSize: '0.85rem',
            marginBottom: '0.75rem'
          }}>
            {session.location}
          </div>
          <button 
            onClick={onReservation || (() => (window as any).handleReservation?.())}
            style={{
              background: '#BDCF00',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-ticket-alt"></i> Réserver
          </button>
        </div>
      ))}
    </div>
  );
};

export default SessionsDisplay;
