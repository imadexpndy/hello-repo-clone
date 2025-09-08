import React, { useState, useEffect } from 'react';
import { getUserTypeSessions, Session } from '@/data/sessions';

interface SessionsDisplayProps {
  spectacleId: string;
  onReservation: () => void;
}

interface GroupedSessions {
  rabat: Session[];
  casablanca: Session[];
  supplementaires: Session[];
}

const SessionsDisplay: React.FC<SessionsDisplayProps> = ({ spectacleId, onReservation }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = () => {
      try {
        const userType = sessionStorage.getItem('userType');
        const professionalType = sessionStorage.getItem('professionalType');
        const userCity = sessionStorage.getItem('userCity');
        
        let effectiveUserType = userType;
        if (userType === 'professional' && professionalType) {
          effectiveUserType = professionalType;
        }
        
        const filteredSessions = getUserTypeSessions(spectacleId, effectiveUserType, userCity);
        setSessions(filteredSessions);
        setLoading(false);
      } catch (error) {
        console.error('Error loading sessions:', error);
        setLoading(false);
      }
    };

    loadSessions();

    // Listen for user type changes
    const handleStorageChange = () => {
      loadSessions();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when user type changes
    window.addEventListener('userTypeChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userTypeChanged', handleStorageChange);
    };
  }, [spectacleId]);

  const groupSessions = (sessions: Session[]): GroupedSessions => {
    return {
      rabat: sessions.filter(s => s.location.includes('RABAT')),
      casablanca: sessions.filter(s => s.location.includes('CASABLANCA')),
      supplementaires: sessions.filter(s => s.location.includes('supplémentaires'))
    };
  };

  const formatDateRange = (sessions: Session[], location: string) => {
    if (sessions.length === 0) return '';
    
    const dates = sessions.map(s => new Date(s.date)).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    if (location.includes('supplémentaires')) {
      return 'Octobre 2025';
    }
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    };
    
    if (firstDate.getTime() === lastDate.getTime()) {
      return formatDate(firstDate);
    }
    
    return `${firstDate.getDate()} au ${lastDate.getDate()} ${firstDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
  };

  const getLocationLabel = (location: string) => {
    if (location.includes('RABAT')) return 'Rabat - Représentations';
    if (location.includes('CASABLANCA')) return 'Casablanca - Représentations';
    if (location.includes('supplémentaires')) return 'Séances supplémentaires';
    return location;
  };

  if (loading) {
    return (
      <div className="showtime-item" style={{
        background: 'var(--bg-light)',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
        borderLeft: '4px solid var(--primary-color)'
      }}>
        <div style={{ color: 'var(--text-light)' }}>Chargement des séances...</div>
      </div>
    );
  }

  const groupedSessions = groupSessions(sessions);

  if (sessions.length === 0) {
    return (
      <div className="showtime-item" style={{
        background: 'var(--bg-light)',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
        borderLeft: '4px solid #dc3545'
      }}>
        <div className="showtime-date" style={{
          fontWeight: 600,
          color: 'var(--text-dark)',
          marginBottom: '0.25rem',
          fontFamily: "'Raleway', sans-serif"
        }}>
          Aucune séance disponible
        </div>
        <div className="showtime-time" style={{
          color: 'var(--text-light)',
          fontSize: '0.9rem',
          marginBottom: '0.75rem',
          fontFamily: "'Raleway', sans-serif"
        }}>
          Veuillez sélectionner votre type d'utilisateur
        </div>
      </div>
    );
  }

  const renderSessionGroup = (sessions: Session[], location: string) => {
    if (sessions.length === 0) return null;

    return (
      <div key={location} className="showtime-item" style={{
        background: 'var(--bg-light)',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
        borderLeft: '4px solid var(--primary-color)'
      }}>
        <div className="showtime-date" style={{
          fontWeight: 600,
          color: 'var(--text-dark)',
          marginBottom: '0.25rem',
          fontFamily: "'Raleway', sans-serif"
        }}>
          {formatDateRange(sessions, location)}
        </div>
        <div className="showtime-time" style={{
          color: 'var(--text-light)',
          fontSize: '0.9rem',
          marginBottom: '0.75rem',
          fontFamily: "'Raleway', sans-serif"
        }}>
          {getLocationLabel(location)}
        </div>
        <button 
          className="showtime-btn" 
          onClick={onReservation}
          style={{
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'all 0.3s ease',
            fontFamily: "'Raleway', sans-serif",
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-ticket-alt"></i>
          Réserver
        </button>
      </div>
    );
  };

  return (
    <div>
      {renderSessionGroup(groupedSessions.rabat, 'RABAT')}
      {renderSessionGroup(groupedSessions.casablanca, 'CASABLANCA')}
      {renderSessionGroup(groupedSessions.supplementaires, 'supplémentaires')}
    </div>
  );
};

export default SessionsDisplay;
