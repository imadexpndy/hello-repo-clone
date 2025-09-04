import React from 'react';

export default function SpectacleMinimal() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#333', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Le Petit Prince
        </h1>
        
        <div style={{
          backgroundColor: '#e0f2fe',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#0277bd', fontSize: '1.1rem' }}>
            ✅ Page loaded successfully! No more white screen.
          </p>
        </div>

        <p style={{ 
          fontSize: '1.2rem', 
          lineHeight: '1.6', 
          color: '#555',
          marginBottom: '2rem'
        }}>
          Une aventure poétique à travers les étoiles, où l'innocence rencontre la sagesse 
          dans un voyage extraordinaire qui touche le cœur de tous les âges.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontWeight: 'bold' }}>3 acteurs</div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
            <div style={{ fontWeight: 'bold' }}>50 minutes</div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👶</div>
            <div style={{ fontWeight: 'bold' }}>7 ans et +</div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => {
              console.log('Reservation button clicked');
              alert('Reservation functionality works!');
            }}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🎫 Réserver maintenant
          </button>
        </div>

      </div>
    </div>
  );
}
