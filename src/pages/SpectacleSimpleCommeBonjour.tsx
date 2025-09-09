import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import VideoPopup from '@/components/VideoPopup';
import SessionsDisplay from '@/components/SessionsDisplay';
import SpectacleFooter from '@/components/SpectacleFooter';
import { getUserTypeInfo, getStudyLevelForSpectacle } from '@/utils/userTypeUtils';

export default function SpectacleSimpleCommeBonjour() {
  const { user } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [userTypeInfo, setUserTypeInfo] = useState(getUserTypeInfo());

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
      window.location.href = '/reservation/simple-comme-bonjour';
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  useEffect(() => {
    // Expose handleReservation to window object for inline event handlers
    (window as any).handleReservation = handleReservation;
    // Expose video popup handler
    (window as any).openVideoPopup = () => setIsVideoOpen(true);
    
    // Listen for user type changes
    const handleUserTypeChange = () => {
      setUserTypeInfo(getUserTypeInfo());
    };
    
    window.addEventListener('userTypeChanged', handleUserTypeChange);
    
    return () => {
      window.removeEventListener('userTypeChanged', handleUserTypeChange);
    };
  }, [user]);

  return (
    <>
      <style>{`
        :root {
          --primary-color: #FF6B6B;
          --secondary-color: #4ECDC4;
          --accent-color: #FFE66D;
          --primary-dark: #e55555;
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
          background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
          background-size: cover, cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.1);
          z-index: 1;
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
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 2rem;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: 'Amatic SC', cursive;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: rgba(255,255,255,0.9);
        }

        .info-pills {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
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

        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6f42c1 0%, #8e44ad 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
          text-decoration: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(111, 66, 193, 0.4);
          color: white;
        }

        .vintage-tv-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
        }

        .tv-frame {
          background: linear-gradient(145deg, #BDCF00, #D4E157);
          border-radius: 20px;
          padding: 30px 25px 40px 25px;
          box-shadow: 0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.1);
          position: relative;
          width: 600px;
          height: 450px;
          margin: 0 auto;
        }

        .tv-screen {
          background: #000;
          border-radius: 15px;
          padding: 15px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
          width: 100%;
          height: calc(100% - 60px);
          aspect-ratio: 1;
        }

        .tv-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
          display: block;
        }

        .play-button-overlay {
          position: absolute;
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 10px;
        }

        .play-button-overlay:hover {
          background: rgba(0,0,0,0.5);
        }

        .play-button {
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          color: #333;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .play-button:hover {
          transform: scale(1.1);
          background: white;
        }

        .play-button i {
          margin-left: 4px;
        }

        .tv-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding: 0 20px;
        }

        .tv-knob {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(145deg, #C0C0C0, #808080);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
          position: relative;
        }

        .tv-knob::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
        }

        .tv-brand {
          color: #333;
          font-weight: bold;
          font-size: 1.2rem;
          text-shadow: 0 1px 2px rgba(255,255,255,0.5);
          font-family: 'Amatic SC', cursive;
        }

        .content-section {
          padding: 5rem 0;
          background: white;
        }

        .content-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: var(--shadow);
          margin-bottom: 2rem;
          border-left: 5px solid var(--primary-color);
        }

        .card-title {
          font-family: 'Amatic SC', cursive;
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .theme-item {
          background: var(--bg-light);
          padding: 1rem;
          border-radius: 10px;
          border-left: 3px solid var(--primary-color);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .theme-item i {
          color: var(--primary-color);
          font-size: 1.2rem;
          width: 20px;
          text-align: center;
        }

        .sidebar-card {
          background: transparent;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: none;
          margin-bottom: 2rem;
          border-top: none;
        }

        .sidebar-card h3 {
          font-family: 'Amatic SC', cursive;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .info-item i {
          color: var(--primary-color);
          width: 20px;
          text-align: center;
        }

        .sessions-list h4 {
          color: var(--primary-color);
          font-weight: bold;
          margin-bottom: 1rem;
          font-family: 'Amatic SC', cursive;
          font-size: 1.8rem;
        }

        .sessions-list h5 {
          color: #333;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-family: 'Raleway', sans-serif;
          font-size: 1.1rem;
        }

        .sessions-list h6 {
          color: #666;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-family: 'Raleway', sans-serif;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column;
          }
          
          .hero-left {
            padding: 3rem 1.5rem 2rem;
            text-align: center;
            margin-left: 0;
          }
          
          .hero-title {
            font-size: 3rem;
          }
          
          .info-pills {
            justify-content: center;
          }
          
          .hero-buttons {
            justify-content: center;
          }

          .tv-frame {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="spectacle-hero">
        <div className="hero-overlay"></div>
        <div className="container-fluid">
          <div className="hero-container">
            <div className="hero-left">
              <div className="hero-content">
                <h1 className="hero-title">Simple comme Bonjour</h1>
                <p className="hero-subtitle">Un spectacle musical plein de joie et de simplicité pour les plus jeunes</p>
                <div className="info-pills">
                  <span className="info-pill">
                    <i className="fas fa-clock"></i>35 minutes
                  </span>
                  <span className="info-pill">
                    <i className="fas fa-users"></i>2 comédiens
                  </span>
                  <span className="info-pill">
                    <i className="fas fa-child"></i>
                    {userTypeInfo.showStudyLevel ? 'PS, MS' : '3 ans et +'}
                  </span>
                  <span className="info-pill">
                    <i className="fas fa-theater-masks"></i>Théâtre interactif
                  </span>
                </div>
                <div className="hero-buttons">
                  <button className="btn-primary" onClick={handleReservation}>
                    <i className="fas fa-ticket-alt"></i>
                    Se connecter pour réserver
                  </button>
                </div>
              </div>
            </div>
            
            <div className="hero-right">
              <div className="vintage-tv-container">
                <div className="tv-frame">
                  <div className="tv-screen">
                    <img src="/assets/img/spectacles/simple-comme-bonjour.png" alt="Simple comme bonjour" className="tv-video" />
                    <div className="play-button-overlay" onClick={() => setIsVideoOpen(true)}>
                      <div className="play-button">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                  </div>
                  <div className="tv-controls">
                    <div className="tv-knob"></div>
                    <div className="tv-brand">EDJS</div>
                    <div className="tv-knob"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Story Section */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-book-open"></i>
                  L'Histoire
                </h2>
                <p className="card-text">
                  "Simple comme bonjour" est un spectacle musical qui célèbre les petits bonheurs du quotidien. 
                  À travers des chansons entraînantes et des mélodies joyeuses, nos trois comédiens invitent les enfants 
                  à découvrir que les plus belles choses de la vie sont souvent les plus simples.
                </p>
                <p className="card-text">
                  Entre rires, musique et interactions, ce spectacle transforme les gestes du quotidien en moments magiques, 
                  rappelant aux petits comme aux grands que dire "bonjour" peut être le début d'une belle aventure.
                </p>
              </div>

              {/* Themes Section */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-lightbulb"></i>
                  Thèmes Abordés
                </h2>
                <p className="card-text">
                  Ce spectacle développe chez les enfants l'appréciation des petites choses de la vie 
                  tout en renforçant les valeurs de politesse et de bienveillance.
                </p>
                
                <div className="themes-grid">
                  <div className="theme-item">
                    <i className="fas fa-handshake"></i>
                    <div>
                      <strong>Savoir-vivre</strong><br />
                      <span>Importance de la politesse et du respect</span>
                    </div>
                  </div>
                  <div className="theme-item">
                    <i className="fas fa-smile"></i>
                    <div>
                      <strong>Joie de vivre</strong><br />
                      <span>Célébration des petits bonheurs</span>
                    </div>
                  </div>
                  <div className="theme-item">
                    <i className="fas fa-music"></i>
                    <div>
                      <strong>Expression musicale</strong><br />
                      <span>Développement du sens rythmique</span>
                    </div>
                  </div>
                  <div className="theme-item">
                    <i className="fas fa-comments"></i>
                    <div>
                      <strong>Interaction sociale</strong><br />
                      <span>Communication et échange</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-star"></i>
                  Avis des spectateurs
                </h2>
                <div className="reviews-container" style={{
                  display: 'grid',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div className="review-item" style={{
                    background: 'var(--bg-light)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    borderLeft: '3px solid var(--primary-color)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <div className="stars" style={{
                        color: '#ffc107',
                        marginRight: '0.5rem'
                      }}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <strong>Maman de Yasmine</strong>
                    </div>
                    <p style={{
                      color: 'var(--text-dark)',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>"Un spectacle merveilleux qui enseigne la politesse avec tant de douceur. Ma fille a adoré et n'arrête pas de dire bonjour à tout le monde depuis !"</p>
                  </div>
                  
                  <div className="review-item" style={{
                    background: 'var(--bg-light)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    borderLeft: '3px solid var(--primary-color)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <div className="stars" style={{
                        color: '#ffc107',
                        marginRight: '0.5rem'
                      }}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <strong>Enseignante PS/MS</strong>
                    </div>
                    <p style={{
                      color: 'var(--text-dark)',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>"Parfait pour les tout-petits ! Les enfants étaient captivés et ont participé avec enthousiasme. Un excellent outil pédagogique."</p>
                  </div>
                  
                  <div className="review-item" style={{
                    background: 'var(--bg-light)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    borderLeft: '3px solid var(--primary-color)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <div className="stars" style={{
                        color: '#ffc107',
                        marginRight: '0.5rem'
                      }}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <strong>Papa de Karim</strong>
                    </div>
                    <p style={{
                      color: 'var(--text-dark)',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>"Simple mais efficace ! Les comédiens ont su créer une atmosphère chaleureuse. Mon fils de 4 ans était ravi."</p>
                  </div>
                </div>

                {/* Review Submission Form */}
                <div className="review-form" style={{
                  background: 'var(--bg-light)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-light)'
                }}>
                  <h4 style={{
                    color: 'var(--text-dark)',
                    marginBottom: '1rem',
                    fontSize: '1.1rem'
                  }}>Partagez votre avis</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: 'var(--text-dark)',
                      fontWeight: 500
                    }}>Votre nom</label>
                    <input 
                      type="text" 
                      placeholder="Votre nom ou pseudonyme"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: '0.25rem',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: 'var(--text-dark)',
                      fontWeight: 500
                    }}>Note</label>
                    <div className="star-rating" style={{
                      display: 'flex',
                      gap: '0.25rem'
                    }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <i key={star} className="far fa-star" style={{
                          fontSize: '1.2rem',
                          color: '#ddd',
                          cursor: 'pointer',
                          transition: 'color 0.2s'
                        }}></i>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: 'var(--text-dark)',
                      fontWeight: 500
                    }}>Votre avis</label>
                    <textarea 
                      placeholder="Partagez votre expérience du spectacle..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: '0.25rem',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                    ></textarea>
                  </div>
                  
                  <button 
                    style={{
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--primary-dark)'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--primary-color)'}
                  >
                    Publier mon avis
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div style={{
                background: 'transparent',
                borderRadius: '15px',
                padding: '2rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  color: 'var(--text-dark)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Raleway, sans-serif'
                }}>
                  <i className="fas fa-calendar-alt" style={{color: 'var(--primary-color)'}}></i>
                  Séances Disponibles
                </h3>
                <SessionsDisplay spectacleId="simple-comme-bonjour" onReservation={handleReservation} />
              </div>
              
              <div style={{
                background: 'transparent',
                borderRadius: '15px',
                padding: '2rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  color: 'var(--text-dark)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Raleway, sans-serif'
                }}>
                  <i className="fas fa-info-circle" style={{color: 'var(--primary-color)'}}></i>
                  Informations Pratiques
                </h3>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span><strong>Durée :</strong> 35 minutes</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-users"></i>
                  <span><strong>Distribution :</strong> 2 comédiens</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-child"></i>
                  <span><strong>Âge :</strong> {userTypeInfo.showStudyLevel ? 'PS, MS' : '3 ans et +'}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-theater-masks"></i>
                  <span><strong>Genre :</strong> Théâtre musical interactif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoPopup 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/iARC1DejKHo"
        title="Simple comme bonjour - Bande-annonce"
      />

      {/* Footer */}
      <footer style={{background: '#000', color: 'white', padding: '60px 0 20px 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '40px'}}>
            
            {/* Logo and Description */}
            <div style={{textAlign: 'left'}}>
              <div style={{marginBottom: '25px'}}>
                <img 
                  src="https://edjs.art/assets/img/Asset 2@4x.png" 
                  alt="L'École des jeunes spectateurs" 
                  style={{height: '80px', width: 'auto'}}
                />
              </div>
              <p style={{color: 'white', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px'}}>
                Chaque élève a l'opportunité de découvrir et d'explorer la richesse des arts de la scène à travers la danse, le théâtre et la musique, qui sont au cœur de notre programme.
              </p>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', marginBottom: '10px'}}>
                <i className="fas fa-phone" style={{color: '#FF6B6B'}}></i>
                <span style={{color: 'white'}}>+212 6 61 52 59 02</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px'}}>
                <i className="fas fa-envelope" style={{color: '#FF6B6B'}}></i>
                <span style={{color: 'white'}}>inscription@edjs.ma</span>
              </div>
            </div>

            {/* Navigation */}
            <div style={{textAlign: 'center'}}>
              <h3 style={{color: '#cccccc', marginBottom: '20px', fontSize: '1.2rem'}}>Navigation</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{marginBottom: '8px'}}>
                  <a href="/" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}} 
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FF6B6B'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Accueil
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="/spectacles" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FF6B6B'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Spectacles
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="https://edjs.art/gallery.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FF6B6B'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Galerie
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FF6B6B'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
            <p style={{color: 'white', margin: 0, fontSize: '0.85rem'}}>
              Copyright © {new Date().getFullYear()} <a href="/" style={{color: '#FF6B6B', textDecoration: 'none'}}>L'École des jeunes spectateurs</a>. Tous droits réservés.
            </p>
            <div style={{display: 'flex', gap: '20px'}}>
              <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FF6B6B'}
                 onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                Conditions Générales
              </a>
              <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FF6B6B'}
                 onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                Politique de Confidentialité
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
