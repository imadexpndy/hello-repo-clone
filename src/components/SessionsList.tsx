import React from 'react';
import { getUserTypeSessions } from '@/data/sessions';
import { formatDateToFrench, formatTime, formatLocation } from '@/utils/dateUtils';

interface SessionsListProps {
  spectacleId: string;
  userType: string;
  professionalType?: string;
  onReservationClick?: () => void;
}

export const SessionsList: React.FC<SessionsListProps> = ({
  spectacleId,
  userType,
  professionalType,
  onReservationClick
}) => {
  const sessions = getUserTypeSessions(spectacleId, userType, professionalType);
  
  if (!sessions || sessions.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-light)',
        fontStyle: 'italic'
      }}>
        Aucune séance disponible pour ce profil.
      </div>
    );
  }

  const handleReservationClick = (sessionId: string) => {
    if (onReservationClick) {
      onReservationClick();
    } else {
      window.location.href = `/reservation/${spectacleId}?session=${sessionId}`;
    }
  };

  return (
    <>
      {sessions.map((session) => (
        <div 
          key={session.id}
          className="showtime-item" 
          style={{
            background: 'var(--bg-light)', 
            borderRadius: '0.5rem', 
            padding: '1rem', 
            marginBottom: '1rem', 
            borderLeft: '4px solid var(--primary-color)'
          }}
        >
          <div 
            className="showtime-date" 
            style={{
              fontWeight: 600, 
              color: 'var(--text-dark)', 
              marginBottom: '0.25rem', 
              fontFamily: 'Raleway, sans-serif'
            }}
          >
            {formatDateToFrench(session.date)}
          </div>
          <div 
            className="showtime-time" 
            style={{
              color: 'var(--text-light)', 
              fontSize: '0.9rem', 
              marginBottom: '0.75rem', 
              fontFamily: 'Raleway, sans-serif'
            }}
          >
            {formatTime(session.time)} - {formatLocation(session.location)}
          </div>
          {session.price && (
            <div 
              style={{
                color: 'var(--primary-color)', 
                fontSize: '0.9rem', 
                fontWeight: 600,
                marginBottom: '0.75rem'
              }}
            >
              {session.price} DH
            </div>
          )}
          <button 
            onClick={() => handleReservationClick(session.id)}
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
              fontFamily: 'Raleway, sans-serif', 
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-ticket-alt"></i>
            Réserver
          </button>
        </div>
      ))}
    </>
  );
};
