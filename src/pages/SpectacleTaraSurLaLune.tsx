import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import VideoPopup from '@/components/VideoPopup';

export default function SpectacleTaraSurLaLune() {
  const { user } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [userType, setUserType] = useState<string>('');
  const [professionalType, setProfessionalType] = useState<string>('');

  useEffect(() => {
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

    const checkUserType = () => {
      const storedUserType = sessionStorage.getItem('userType') || localStorage.getItem('userType');
      const storedProfessionalType = sessionStorage.getItem('professionalType') || localStorage.getItem('professionalType');
      
      setUserType(storedUserType || '');
      setProfessionalType(storedProfessionalType || '');
    };

    checkUserType();
    
    const handleStorageChange = () => checkUserType();
    const handleUserTypeChange = () => checkUserType();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userTypeChanged', handleUserTypeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userTypeChanged', handleUserTypeChange);
    };
  }, []);

  const handleReservation = () => {
    if (user) {
      window.location.href = '/reservation/tara-sur-la-lune';
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  const getUserTypeDisplay = () => {
    if (userType === 'professional' && professionalType) {
      const typeLabels = {
        'scolaire-privee': { label: 'École Privée', icon: 'fas fa-graduation-cap' },
        'scolaire-publique': { label: 'École Publique', icon: 'fas fa-school' },
        'association': { label: 'Association', icon: 'fas fa-users' }
      };
      return typeLabels[professionalType as keyof typeof typeLabels] || { label: professionalType, icon: 'fas fa-building' };
    } else if (userType === 'particulier') {
      return { label: 'Particulier', icon: 'fas fa-eye' };
    }
    return null;
  };

  const goBackToSelection = () => {
    window.location.href = '/user-type-selection';
  };

  const userTypeDisplay = getUserTypeDisplay();

  return (
    <>
      <VideoPopup 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl="https://youtube.com/shorts/iARC1DejKHo" 
      />
      
      <style>{`
        :root {
          --primary-color: #6f42c1;
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

        .vintage-tv-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }

        .tv-frame {
          background: linear-gradient(145deg, #6f42c1, #8b5cf6);
          border-radius: 20px;
          padding: 30px 25px 40px 25px;
          box-shadow: 0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.1);
          position: relative;
          width: 400px;
          height: 400px;
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
          font-weight: 400;
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

        .btn-primary {
          background: #6f42c1;
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
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          color: white;
          background: #5a2d91;
        }

        .content-section {
          padding: 4rem 0;
          background: var(--bg-light);
        }

        .content-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
          border: 1px solid var(--border-light);
        }

        .content-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }

        .card-title {
          color: var(--text-dark);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Raleway', sans-serif;
        }

        .card-title i {
          color: var(--primary-color);
        }

        .sidebar-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-light);
        }

        .sidebar-card h3 {
          color: var(--text-dark);
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Raleway', sans-serif;
        }

        .sidebar-card h3 i {
          color: var(--primary-color);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: var(--text-light);
          font-family: 'Raleway', sans-serif;
        }

        .info-item i {
          color: var(--primary-color);
          width: 20px;
        }

        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column;
          }
          
          .hero-left, .hero-right {
            flex: none;
            width: 100%;
          }
          
          .hero-left {
            padding: 2rem 1.5rem;
          }
          
          .hero-right {
            height: 50vh;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {userTypeDisplay && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '0.75rem 1rem',
          borderRadius: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#2c3e50',
          backdropFilter: 'blur(10px)'
        }}>
          <i className={userTypeDisplay.icon} style={{ color: '#6f42c1' }}></i>
          {userTypeDisplay.label}
          <button 
            onClick={goBackToSelection}
            style={{
              background: 'none',
              border: 'none',
              color: '#6c757d',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              fontSize: '0.8rem'
            }}
            title="Changer de type d'utilisateur"
          >
            <i className="fas fa-edit"></i>
          </button>
        </div>
      )}

      <section className="spectacle-hero">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="hero-title">Tara sur la Lune</h1>
              <p className="hero-subtitle">Une aventure spatiale extraordinaire avec Tara et ses amis</p>
              <div className="info-pills">
                <span className="info-pill">
                  <i className="fas fa-clock"></i>55 minutes
                </span>
                <span className="info-pill">
                  <i className="fas fa-users"></i>1 comédien
                </span>
                <span className="info-pill">
                  <i className="fas fa-child"></i>
                  {userType === 'professional' && professionalType === 'scolaire-privee' ? 'Maternelles, Primaires' : '5 ans et +'}
                </span>
                <span className="info-pill">
                  <i className="fas fa-theater-masks"></i>Théâtre avec projection
                </span>
              </div>
              <button className="btn-primary" onClick={handleReservation}>
                <i className="fas fa-ticket-alt"></i>
                {user ? 'Réserver maintenant' : 'Se connecter pour réserver'}
              </button>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="vintage-tv-container">
              <div className="tv-frame">
                <div className="tv-screen">
                  <img 
                    src="/src/assets/tara new poster@4x.png" 
                    alt="Tara sur la Lune Affiche" 
                    style={{
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      borderRadius: '10px'
                    }}
                  />
                  <div 
                    onClick={() => setIsVideoOpen(true)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '2rem',
                      color: '#333',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    }}>
                      <i className="fas fa-play" style={{ marginLeft: '4px' }}></i>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                  padding: '0 20px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #C0C0C0, #808080)',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
                  }}></div>
                  <div style={{
                    color: '#FFD700',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '2px'
                  }}>EDJS</div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #C0C0C0, #808080)',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-book-open"></i>
                  Synopsis
                </h2>
                <p>Tara, une petite fille curieuse et aventureuse, rêve d'explorer l'espace et de découvrir les mystères de la lune. Accompagnée de ses fidèles amis, elle embarque dans une aventure extraordinaire qui la mènera bien au-delà de ce qu'elle avait imaginé.</p>
                
                <p>Cette histoire captivante nous emmène dans un voyage spatial plein de surprises, où Tara découvre que les plus grandes aventures commencent souvent par un simple rêve. Entre science-fiction et réalité, ce spectacle mélange habilement l'imaginaire et les connaissances scientifiques pour créer une expérience unique.</p>
                
                <p>À travers les péripéties de Tara, les jeunes spectateurs découvriront l'importance de la persévérance, de l'amitié et du courage face à l'inconnu. Un spectacle qui inspire et fait rêver toute la famille.</p>
              </div>

              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-lightbulb"></i>
                  Thèmes abordés
                </h2>
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item">
                      <i className="fas fa-rocket"></i>
                      <span>L'exploration spatiale</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-heart"></i>
                      <span>L'amitié et la solidarité</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-brain"></i>
                      <span>La curiosité scientifique</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <i className="fas fa-star"></i>
                      <span>Les rêves et l'imagination</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-globe"></i>
                      <span>La découverte du monde</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <span>Le travail d'équipe</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-star"></i>
                  Avis des Spectateurs
                </h2>
                <div style={{marginTop: '1.5rem'}}>
                  <div style={{background: 'var(--bg-light)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                      <div style={{fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem'}}>Sarah M. - École Primaire</div>
                      <div style={{color: '#ffc107'}}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <p style={{color: 'var(--text-light)', fontStyle: 'italic', lineHeight: 1.6, margin: 0}}>"Un spectacle magnifique qui a captivé mes élèves ! L'histoire de Tara les a transportés dans l'espace et leur a donné envie d'en apprendre plus sur l'astronomie."</p>
                  </div>
                  <div style={{background: 'var(--bg-light)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                      <div style={{fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem'}}>Ahmed K. - Parent</div>
                      <div style={{color: '#ffc107'}}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <p style={{color: 'var(--text-light)', fontStyle: 'italic', lineHeight: 1.6, margin: 0}}>"Ma fille de 6 ans était émerveillée ! Elle n'arrête pas de parler de Tara et de ses aventures sur la Lune. Un spectacle éducatif et divertissant."</p>
                  </div>
                </div>
                
                <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-light)', borderRadius: '0.75rem'}}>
                  <h3 style={{color: 'var(--text-dark)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem'}}>Laissez votre avis</h3>
                  <form>
                    <div style={{marginBottom: '1rem'}}>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)'}}>Votre nom</label>
                      <input type="text" style={{width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '0.5rem', fontFamily: 'Raleway, sans-serif'}} placeholder="Votre nom" required />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)'}}>Note</label>
                      <div style={{display: 'flex', gap: '0.25rem', marginBottom: '0.5rem'}}>
                        <i className="fas fa-star" style={{color: '#ddd', cursor: 'pointer', fontSize: '1.5rem', transition: 'color 0.2s'}}></i>
                        <i className="fas fa-star" style={{color: '#ddd', cursor: 'pointer', fontSize: '1.5rem', transition: 'color 0.2s'}}></i>
                        <i className="fas fa-star" style={{color: '#ddd', cursor: 'pointer', fontSize: '1.5rem', transition: 'color 0.2s'}}></i>
                        <i className="fas fa-star" style={{color: '#ddd', cursor: 'pointer', fontSize: '1.5rem', transition: 'color 0.2s'}}></i>
                        <i className="fas fa-star" style={{color: '#ddd', cursor: 'pointer', fontSize: '1.5rem', transition: 'color 0.2s'}}></i>
                      </div>
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)'}}>Votre avis</label>
                      <textarea rows={4} style={{width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '0.5rem', fontFamily: 'Raleway, sans-serif', resize: 'vertical'}} placeholder="Partagez votre expérience..." required></textarea>
                    </div>
                    <button type="submit" style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease'}}>
                      <i className="fas fa-paper-plane" style={{marginRight: '0.5rem'}}></i>
                      Publier l'avis
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="sidebar-card">
                <h3>
                  <i className="fas fa-calendar-alt"></i>
                  Séances Disponibles
                </h3>
                <div style={{marginBottom: '1rem'}}>
                  <h4 style={{color: '#6f42c1', fontWeight: 'bold', marginBottom: '1rem'}}>TARA SUR LA LUNE</h4>
                  
                  <h5 style={{color: '#333', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>CASABLANCA</h5>
                  <h6 style={{color: '#666', fontWeight: 500, marginBottom: '0.5rem', fontFamily: 'Raleway, sans-serif'}}>COMPLEXE EL HASSANI</h6>
                  <div style={{marginBottom: '1rem'}}>
                    {professionalType === 'scolaire-privee' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: LUNDI 13 OCTOBRE, Heure: 14H30, Séance: Scolaire privée
                      </div>
                    )}
                    
                    {professionalType === 'scolaire-publique' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: MARDI 14 OCTOBRE, Heure: 09H30, Séance: Scolaire publique
                      </div>
                    )}
                    
                    {professionalType === 'association' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: MARDI 14 OCTOBRE, Heure: 14H30, Séance: Associations
                      </div>
                    )}
                    
                    {(userType === 'particulier' || !userType) && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: SAMEDI 18 OCTOBRE, Heure: 15H00, Séance: Tout public
                      </div>
                    )}
                  </div>

                  <h5 style={{color: '#333', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>RABAT</h5>
                  <h6 style={{color: '#666', fontWeight: 500, marginBottom: '0.5rem', fontFamily: 'Raleway, sans-serif'}}>THEATRE BAHNINI</h6>
                  <div style={{marginBottom: '1rem'}}>
                    {professionalType === 'scolaire-privee' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: JEUDI 9 OCTOBRE, Heure: 09H30, Séance: Scolaire privée
                      </div>
                    )}
                    
                    {professionalType === 'scolaire-publique' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: VENDREDI 10 OCTOBRE, Heure: 14H30, Séance: Scolaire publique
                      </div>
                    )}
                    
                    {professionalType === 'association' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: VENDREDI 10 OCTOBRE, Heure: 09H30, Séance: Associations
                      </div>
                    )}
                    
                    {(userType === 'particulier' || !userType) && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid #6f42c1', fontSize: '0.85rem'}}>
                        - Date: DIMANCHE 19 OCTOBRE, Heure: 16H00, Séance: Tout public
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleReservation}
                    style={{
                      background: '#6f42c1',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      marginTop: '1rem',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Raleway, sans-serif'
                    }}
                  >
                    <i className="fas fa-ticket-alt" style={{marginRight: '0.5rem'}}></i>
                    Réserver maintenant
                  </button>
                </div>
              </div>

              <div className="sidebar-card">
                <h3>
                  <i className="fas fa-info-circle"></i>
                  Informations pratiques
                </h3>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span>Durée : 55 minutes</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-users"></i>
                  <span>Distribution : 1 comédien</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-theater-masks"></i>
                  <span>Genre : Théâtre avec projection</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-child"></i>
                  <span>{userType === 'professional' && professionalType === 'scolaire-privee' ? 'Niveaux scolaires : Maternelle, Primaire' : 'Âge recommandé : 5 ans et +'}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <span>Période : Octobre 2025</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Lieux : Casablanca & Rabat</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

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
                <i className="fas fa-phone" style={{color: '#6f42c1'}}></i>
                <span style={{color: 'white'}}>+212 6 61 52 59 02</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px'}}>
                <i className="fas fa-envelope" style={{color: '#6f42c1'}}></i>
                <span style={{color: 'white'}}>inscription@edjs.ma</span>
              </div>
            </div>

            {/* Navigation */}
            <div style={{textAlign: 'center'}}>
              <h3 style={{color: '#cccccc', marginBottom: '20px', fontSize: '1.2rem'}}>Navigation</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{marginBottom: '8px'}}>
                  <a href="/" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}} 
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6f42c1'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Accueil
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="/spectacles" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6f42c1'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Spectacles
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="https://edjs.art/gallery.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6f42c1'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Galerie
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6f42c1'}
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
              Copyright © {new Date().getFullYear()} <a href="/" style={{color: '#6f42c1', textDecoration: 'none'}}>L'École des jeunes spectateurs</a>. Tous droits réservés.
            </p>
            <div style={{display: 'flex', gap: '20px'}}>
              <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6f42c1'}
                 onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                Conditions Générales
              </a>
              <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6f42c1'}
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
