import React from 'react';

export default function SpectacleTest() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        Test Spectacle Page
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem' }}>
        If you can see this, React is working properly.
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        marginTop: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Le Petit Prince</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          This is a simple test to verify the component is rendering correctly.
        </p>
        <button 
          style={{
            backgroundColor: '#BDCF00',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
          className="spectacle-hero"
          onClick={() => alert('Button works!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}
