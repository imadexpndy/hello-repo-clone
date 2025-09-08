import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SpectacleFooter from '@/components/SpectacleFooter';
import VideoPopup from '@/components/VideoPopup';
import SessionsDisplay from '@/components/SessionsDisplay';

export default function SpectacleLePetitPrinceFixed() {
  const { user } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    // Load external stylesheets
    const loadStylesheet = (href: string) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    };

    loadStylesheet('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Kalam:wght@300;400;700&display=swap');
    loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
    loadStylesheet('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
  }, []);

  const handleReservation = () => {
    if (user) {
      window.location.href = '/reservation/le-petit-prince';
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  useEffect(() => {
    // Expose handlers to window object for inline event handlers
    (window as any).handleReservation = handleReservation;
    (window as any).openVideoPopup = () => setIsVideoOpen(true);
  }, [user]);

  return (
    <>
      <style>{`
        :root {
          --primary-color: #BDCF00;
          --text-dark: #2c3e50;
          --text-light: #6c757d;
          --bg-light: #f8f9fa;
          --border-light: #e9ecef;
          --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-hover: 0 8px 25px rgba(0,0,0,0.15);
        }

        body { 
          background-color: #f8f9fa; 
          font-family: 'Raleway', sans-serif; 
          margin: 0;
          padding: 0;
        }

        .spectacle-hero {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 0;
          background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-size: cover, cover;
        }

        .hero-container {
          width: 100%;
          height: 100%;
          margin: 0;
          position: relative;
          z-index: 10;
          display: flex;
        }

        .hero-left {
          flex: 1;
          padding: 4rem 2rem 4rem 6rem;
          display: flex;
          align-items: center;
          color: white;
          margin-left: 5%;
        }

        .hero-right {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-character {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 15;
          width: 200px;
          height: 280px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }

        .hero-content h1 {
          font-family: 'Amatic SC', cursive;
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .info-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .info-pill {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
        }

        .btn-primary {
          background: #BDCF00;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(189, 207, 0, 0.3);
        }

        .btn-primary:hover {
          background: #a8b800;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(189, 207, 0, 0.4);
          color: white;
        }

        .content-section {
          padding: 4rem 0;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-title {
          font-family: 'Amatic SC', cursive;
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
          color: var(--text-dark);
        }

        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 4rem;
        }

        .story-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-dark);
        }

        .story-image {
          text-align: center;
        }

        .story-image img {
          max-width: 100%;
          border-radius: 1rem;
          box-shadow: var(--shadow-hover);
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .info-card {
          background: var(--bg-light);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: var(--shadow);
          transition: transform 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
        }

        .info-card i {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .info-card h3 {
          font-family: 'Amatic SC', cursive;
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .sidebar {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: var(--shadow);
          position: sticky;
          top: 2rem;
        }

        .sidebar h3 {
          font-family: 'Amatic SC', cursive;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: var(--text-dark);
        }

        .sidebar-info {
          margin-bottom: 2rem;
        }

        .sidebar-info div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-info strong {
          color: var(--text-dark);
        }

        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column;
          }
          
          .hero-left {
            padding: 2rem 1rem;
          }
          
          .hero-content h1 {
            font-size: 2.5rem;
          }
          
          .story-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .info-pills {
            justify-content: center;
          }
        }
      `}</style>

      <div className="spectacle-hero">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-content">
              <h1>Le Petit Prince</h1>
              <p>
                Une aventure poétique à travers les étoiles, où l'innocence rencontre la sagesse 
                dans un voyage extraordinaire qui touche le cœur de tous les âges.
              </p>
              
              <div className="info-pills">
                <div className="info-pill">
                  <i className="fas fa-users"></i>
                  3 acteurs
                </div>
                <div className="info-pill">
                  <i className="fas fa-clock"></i>
                  50 minutes
                </div>
                <div className="info-pill">
                  <i className="fas fa-child"></i>
                  7 ans et +
                </div>
              </div>
              
              <button 
                className="btn-primary"
                onClick={handleReservation}
              >
                <i className="fas fa-ticket-alt"></i>
                Réserver maintenant
              </button>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-character">
              <img 
                src="https://edjs.art/assets/img/petit-prince-character.png" 
                alt="Le Petit Prince"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          <h2 className="section-title">L'Histoire</h2>
          
          <div className="story-grid">
            <div className="story-text">
              <p>
                Plongez dans l'univers magique du Petit Prince, cette œuvre intemporelle 
                d'Antoine de Saint-Exupéry qui continue de fasciner petits et grands. 
                Notre adaptation théâtrale vous emmène dans un voyage extraordinaire 
                à travers les planètes et les rencontres qui façonnent l'âme.
              </p>
              <p>
                Le Petit Prince nous enseigne que "l'essentiel est invisible pour les yeux" 
                et que seul le cœur permet de bien voir. Une leçon de vie précieuse 
                transmise avec poésie et émotion sur scène.
              </p>
            </div>
            
            <div className="story-image">
              <img 
                src="https://edjs.art/assets/edjs img/Casse-Noisette_Web_007.webp" 
                alt="Le Petit Prince sur scène"
              />
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <i className="fas fa-heart"></i>
              <h3>Valeurs Éducatives</h3>
              <p>
                Amitié, tolérance, respect de la différence et découverte de soi 
                à travers les rencontres et les voyages.
              </p>
            </div>
            
            <div className="info-card">
              <i className="fas fa-star"></i>
              <h3>Thèmes Abordés</h3>
              <p>
                L'enfance, l'imagination, la critique sociale douce et 
                l'importance des relations humaines authentiques.
              </p>
            </div>
            
            <div className="info-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>Pédagogie</h3>
              <p>
                Développement de l'empathie, réflexion sur les valeurs essentielles 
                et ouverture sur le monde et les autres cultures.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="section-title">Détails du Spectacle</h2>
              
              <div className="story-text">
                <h4>Synopsis</h4>
                <p>
                  Un aviateur en panne dans le désert rencontre un mystérieux petit garçon 
                  venu d'une autre planète. À travers ses récits de voyage de planète en planète, 
                  le Petit Prince nous fait découvrir des personnages étonnants et nous livre 
                  ses réflexions sur la vie, l'amour et l'amitié.
                </p>
                
                <h4>Mise en Scène</h4>
                <p>
                  Notre adaptation privilégie la poésie visuelle avec des décors évolutifs, 
                  des costumes colorés et une bande sonore originale qui accompagne 
                  ce voyage initiatique plein de tendresse et de sagesse.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="sidebar">
                <h3><i className="fas fa-calendar-alt"></i> Séances Disponibles</h3>
                <SessionsDisplay 
                  spectacleId="le-petit-prince" 
                  onReservation={handleReservation}
                />
              </div>
              
              <div className="sidebar" style={{ marginTop: '2rem' }}>
                <h3>Informations Pratiques</h3>
                
                <div className="sidebar-info">
                  <div>
                    <span>Durée:</span>
                    <strong>50 minutes</strong>
                  </div>
                  <div>
                    <span>Âge recommandé:</span>
                    <strong>7 ans et +</strong>
                  </div>
                  <div>
                    <span>Nombre d'acteurs:</span>
                    <strong>3</strong>
                  </div>
                  <div>
                    <span>Genre:</span>
                    <strong>Conte philosophique</strong>
                  </div>
                  <div>
                    <span>Langue:</span>
                    <strong>Français</strong>
                  </div>
                </div>
                
                <button 
                  className="btn-primary w-100"
                  onClick={handleReservation}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <i className="fas fa-calendar-alt"></i>
                  Réserver une séance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VideoPopup 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoId="iARC1DejKHo" 
      />
    </>
  );
}
