import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SpectacleFooter from '@/components/SpectacleFooter';
import VideoPopup from '@/components/VideoPopup';
import { getUserTypeInfo } from '@/utils/userTypeUtils';

export default function SpectacleMirathAtfal() {
  const { user } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [userTypeInfo, setUserTypeInfo] = useState(getUserTypeInfo());

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
  }, []);

  const handleReservation = () => {
    if (user) {
      window.location.href = '/reservation/mirath-atfal';
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  const handleUserTypeChange = () => {
    setUserTypeInfo(getUserTypeInfo());
  };

  useEffect(() => {
    window.addEventListener('userTypeChanged', handleUserTypeChange);
    return () => {
      window.removeEventListener('userTypeChanged', handleUserTypeChange);
    };
  }, [user]);

  const sessions = [
    { date: 'SAMEDI 8 NOVEMBRE', time: '15H00', venue: 'Theatre Zefzaf', city: 'Casablanca', type: 'tout-public', label: 'Tout public' },
    { date: 'LUNDI 10 NOVEMBRE', time: '9H30', venue: 'Theatre Zefzaf', city: 'Casablanca', type: 'scolaire-privee', label: 'Scolaire privée' },
    { date: 'LUNDI 10 NOVEMBRE', time: '14H30', venue: 'Theatre Zefzaf', city: 'Casablanca', type: 'scolaire-publique', label: 'Scolaire publique' },
    { date: 'MARDI 11 NOVEMBRE', time: '14H30', venue: 'Theatre Zefzaf', city: 'Casablanca', type: 'association', label: 'Association' },
    { date: 'JEUDI 13 NOVEMBRE', time: '09H30', venue: 'Theatre Bahnini', city: 'Rabat', type: 'scolaire-privee', label: 'Scolaire privée' },
    { date: 'JEUDI 13 NOVEMBRE', time: '14H30', venue: 'Theatre Bahnini', city: 'Rabat', type: 'scolaire-publique', label: 'Scolaire publique' },
    { date: 'VENDREDI 14 NOVEMBRE', time: '09H30', venue: 'Theatre Bahnini', city: 'Rabat', type: 'association', label: 'Association' },
    { date: 'VENDREDI 14 NOVEMBRE', time: '14H30', venue: 'Theatre Bahnini', city: 'Rabat', type: 'association', label: 'Association' },
    { date: 'SAMEDI 15 NOVEMBRE', time: '15H00', venue: 'Theatre Bahnini', city: 'Rabat', type: 'tout-public', label: 'Tout public' }
  ];

  const getFilteredSessions = () => {
    const { userType, professionalType } = userTypeInfo;
    
    // Debug logging to see what user type is being detected
    console.log('Current userType:', userType, 'professionalType:', professionalType);
    
    if (userType === 'individual') {
      return sessions.filter(session => session.type === 'tout-public');
    } else if (userType === 'professional') {
      if (professionalType === 'private_school') {
        return sessions.filter(session => session.type === 'scolaire-privee');
      } else if (professionalType === 'public_school') {
        return sessions.filter(session => session.type === 'scolaire-publique');
      } else if (professionalType === 'association') {
        return sessions.filter(session => session.type === 'association');
      }
    }
    
    // Default: show all sessions if user type is not determined
    return sessions;
  };

  return (
    <>
      <style>{`
        :root {
          --primary-color: #e74c3c;
          --primary-dark: #c0392b;
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
          background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
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
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 2rem;
        }

        .vintage-tv-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 400px;
        }

        .tv-frame {
          background: linear-gradient(145deg, #BDCF00, #D4E157);
          border-radius: 20px;
          padding: 30px 25px 40px 25px;
          box-shadow: 0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.1);
          position: relative;
          width: 400px;
          height: 400px;
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
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
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
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
          text-decoration: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
          color: white;
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

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: var(--text-dark);
        }

        .info-item i {
          color: var(--primary-color);
          width: 20px;
          text-align: center;
        }

        .sidebar-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: var(--shadow);
          margin-bottom: 2rem;
          border-top: 4px solid var(--primary-color);
        }

        .sidebar-card h3 {
          font-family: 'Amatic SC', cursive;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .session-card {
          background: var(--bg-light);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
          border-left: 3px solid var(--primary-color);
        }

        .session-date {
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .session-details {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .reviews-section {
          background: var(--bg-light);
          padding: 4rem 0;
        }

        .review-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow);
          border-left: 4px solid var(--primary-color);
        }

        .review-stars {
          color: #ffc107;
          margin-bottom: 1rem;
        }

        .review-form {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: var(--shadow);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--border-light);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column;
          }
          
          .hero-left {
            padding: 3rem 1.5rem 2rem;
            text-align: center;
          }
          
          .hero-title {
            font-size: 3rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="spectacle-hero">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="hero-title">Mirath Atfal</h1>
              <p className="hero-subtitle">Un concert interactif célébrant le patrimoine musical arabe pour enfants</p>
              <div className="info-pills">
                <span className="info-pill">
                  <i className="fas fa-clock"></i>40 minutes
                </span>
                <span className="info-pill">
                  <i className="fas fa-users"></i>3 comédiens
                </span>
                <span className="info-pill">
                  <i className="fas fa-child"></i>
                  <span>{userTypeInfo.showStudyLevel ? 'Maternelle, Primaire' : '5 ans et +'}</span>
                </span>
                <span className="info-pill">
                  <i className="fas fa-theater-masks"></i>Concert interactif
                </span>
              </div>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={handleReservation}>
                  <i className="fas fa-ticket-alt"></i>
                  {user ? 'Réserver Maintenant' : 'Se connecter pour réserver'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="vintage-tv-container">
              <div className="tv-frame">
                <div className="tv-screen">
                  <img src="https://edjs.art/assets/img/spectacles/mirath-atfal.png" alt="Mirath Atfal Affiche" className="tv-video" />
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
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Synopsis Card */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-book-open"></i>
                  Synopsis
                </h2>
                <p className="card-text">
                  "Mirath Atfal" est un concert interactif unique qui fait découvrir aux enfants la richesse du patrimoine musical arabe. À travers des chansons traditionnelles, des comptines ancestrales et des mélodies intemporelles, les jeunes spectateurs sont invités à participer activement à cette célébration musicale.
                </p>
                <p className="card-text">
                  Nos trois artistes talentueux guident les enfants dans un voyage sonore captivant, où chaque mélodie raconte une histoire, chaque rythme éveille une émotion, et chaque participation renforce le lien avec cette culture musicale précieuse.
                </p>
                <p className="card-text">
                  Cette adaptation respectueuse du patrimoine musical arabe met en scène la poésie des traditions dans un spectacle visuel et musical enchanteur, accessible aux enfants tout en touchant le cœur des adultes.
                </p>
              </div>

              {/* Themes Card */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-lightbulb"></i>
                  Thèmes abordés
                </h2>
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item">
                      <i className="fas fa-music"></i>
                      <span>Patrimoine musical arabe</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-heart"></i>
                      <span>Participation active</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-globe"></i>
                      <span>Diversité culturelle</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <i className="fas fa-star"></i>
                      <span>Éveil musical</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <span>Interaction artistique</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-book"></i>
                      <span>Traditions ancestrales</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section - Same as Le Petit Prince */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-star"></i>
                  Avis et commentaires
                </h2>
                
                {/* Existing Reviews */}
                <div className="reviews-list" style={{marginBottom: '2rem'}}>
                  <div className="review-item" style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <div className="stars" style={{color: 'var(--primary-color)', marginRight: '0.5rem'}}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <strong style={{color: '#333'}}>Fatima M.</strong>
                      <span style={{color: '#666', marginLeft: '0.5rem', fontSize: '0.9rem'}}>École Al-Andalus</span>
                    </div>
                    <p style={{color: '#555', margin: 0}}>"Un spectacle magnifique qui a captivé nos élèves ! La richesse du patrimoine musical arabe présentée de manière si accessible et interactive. Les enfants ont chanté pendant des jours après le spectacle."</p>
                  </div>
                  
                  <div className="review-item" style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <div className="stars" style={{color: 'var(--primary-color)', marginRight: '0.5rem'}}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                      <strong style={{color: '#333'}}>Ahmed B.</strong>
                      <span style={{color: '#666', marginLeft: '0.5rem', fontSize: '0.9rem'}}>Parent</span>
                    </div>
                    <p style={{color: '#555', margin: 0}}>"Une belle découverte pour toute la famille. Mes enfants ont adoré participer et découvrir ces mélodies traditionnelles. Un moment de partage culturel précieux."</p>
                  </div>
                </div>
                
                {/* Review Submission Form */}
                <div className="review-form" style={{backgroundColor: '#fff', padding: '1.5rem', border: '2px solid var(--primary-color)', borderRadius: '8px'}}>
                  <h3 style={{color: '#333', marginBottom: '1rem', fontSize: '1.2rem'}}>Laissez votre avis</h3>
                  
                  <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Votre nom *</label>
                    <input 
                      type="text" 
                      placeholder="Entrez votre nom"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Organisation (optionnel)</label>
                    <input 
                      type="text" 
                      placeholder="École, association, etc."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Note *</label>
                    <div className="star-rating" style={{display: 'flex', gap: '0.25rem', marginBottom: '0.5rem'}}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <i 
                          key={star}
                          className="far fa-star" 
                          style={{
                            fontSize: '1.5rem',
                            color: 'var(--primary-color)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => (e.target as HTMLElement).className = 'fas fa-star'}
                          onMouseLeave={(e) => (e.target as HTMLElement).className = 'far fa-star'}
                        ></i>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group" style={{marginBottom: '1.5rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Votre commentaire *</label>
                    <textarea 
                      placeholder="Partagez votre expérience du spectacle..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
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
              {/* Sessions Card */}
              <div className="sidebar-card">
                <h3>
                  <i className="fas fa-calendar-alt"></i>
                  Séances Disponibles
                </h3>
                <div className="sessions-list">
                  <h4 style={{color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '1rem'}}>MIRATH ATFAL</h4>
                  
                  {/* CASABLANCA Sessions */}
                  <h5 style={{color: '#333', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>CASABLANCA</h5>
                  <h6 style={{color: '#666', fontWeight: 500, marginBottom: '0.5rem', fontFamily: 'Raleway, sans-serif'}}>THEATRE ZEFZAF</h6>
                  <div style={{marginBottom: '1rem'}}>
                    {/* Tout public session - show for individual users */}
                    {(userTypeInfo.userType === 'particulier' || !userTypeInfo.userType) && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                        - Date: SAMEDI 8 NOVEMBRE, Heure: 15H00, Séance: Tout public
                      </div>
                    )}
                    
                    {/* Private school sessions - show for scolaire-privee */}
                    {userTypeInfo.professionalType === 'scolaire-privee' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                        - Date: LUNDI 10 NOVEMBRE, Heure: 9H30, Séance: École privée
                      </div>
                    )}
                    
                    {/* Public school session - show for scolaire-publique */}
                    {userTypeInfo.professionalType === 'scolaire-publique' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                        - Date: LUNDI 10 NOVEMBRE, Heure: 14H30, Séance: École publique
                      </div>
                    )}
                    
                    {/* Association session - show for association */}
                    {userTypeInfo.professionalType === 'association' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                        - Date: MARDI 11 NOVEMBRE, Heure: 14H30, Séance: Association
                      </div>
                    )}
                  </div>

                  {/* RABAT Sessions */}
                  <h5 style={{color: '#333', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>RABAT</h5>
                  <h6 style={{color: '#666', fontWeight: 500, marginBottom: '0.5rem', fontFamily: 'Raleway, sans-serif'}}>THEATRE BAHNINI</h6>
                  <div style={{marginBottom: '1rem'}}>
                    {/* Private school sessions - show for scolaire-privee */}
                    {userTypeInfo.professionalType === 'scolaire-privee' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                        - Date: JEUDI 13 NOVEMBRE, Heure: 09H30, Séance: École privée
                      </div>
                    )}
                    
                    {/* Public school session - show for scolaire-publique */}
                    {userTypeInfo.professionalType === 'scolaire-publique' && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                        - Date: JEUDI 13 NOVEMBRE, Heure: 14H30, Séance: École publique
                      </div>
                    )}
                    
                    {/* Association sessions - show for association */}
                    {userTypeInfo.professionalType === 'association' && (
                      <>
                        <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                          - Date: VENDREDI 14 NOVEMBRE, Heure: 09H30, Séance: Association
                        </div>
                        <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                          - Date: VENDREDI 14 NOVEMBRE, Heure: 14H30, Séance: Association
                        </div>
                      </>
                    )}
                    
                    {/* Tout public session - show for individual users */}
                    {(userTypeInfo.userType === 'particulier' || !userTypeInfo.userType) && (
                      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '0.25rem', borderLeft: '3px solid var(--primary-color)', fontSize: '0.85rem'}}>
                        - Date: SAMEDI 15 NOVEMBRE, Heure: 15H00, Séance: Tout public
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleReservation}
                    style={{
                      background: 'var(--primary-color)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '0.5rem', 
                      fontSize: '1rem', 
                      fontWeight: 500, 
                      cursor: 'pointer', 
                      width: '100%', 
                      marginTop: '1rem'
                    }}
                  >
                    <i className="fas fa-ticket-alt" style={{marginRight: '0.5rem'}}></i>
                    {user ? 'Réserver Maintenant' : 'Se connecter pour réserver'}
                  </button>
                </div>
              </div>

              {/* Booking Info Card */}
              <div className="sidebar-card">
                <h3>
                  <i className="fas fa-info-circle"></i>
                  Informations pratiques
                </h3>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span>Durée : 40 minutes</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-users"></i>
                  <span>Distribution : 3 comédiens</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-theater-masks"></i>
                  <span>Genre : Concert interactif</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-child"></i>
                  <span>{userTypeInfo.showStudyLevel ? 'Niveau scolaire : Maternelle, Primaire' : 'Âge recommandé : 5 ans et +'}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <span>Période : Novembre 2025</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-language"></i>
                  <span>Langue : Arabe/Français</span>
                </div>
              </div>

              {/* Reservation Card */}
              <div className="sidebar-card">
                <h3>
                  <i className="fas fa-ticket-alt"></i>
                  Réservation
                </h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Découvrez le patrimoine musical arabe avec vos enfants !
                </p>
                <button className="btn-primary w-100" onClick={handleReservation}>
                  <i className="fas fa-ticket-alt"></i>
                  {user ? 'Réserver Maintenant' : 'Se connecter pour réserver'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoPopup 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://youtube.com/shorts/iARC1DejKHo"
        title="Mirath Atfal - Bande-annonce"
      />

      {/* Footer - Same as Le Petit Prince */}
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
                <i className="fas fa-phone" style={{color: '#BDCF00'}}></i>
                <span style={{color: 'white'}}>+212 6 61 52 59 02</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px'}}>
                <i className="fas fa-envelope" style={{color: '#BDCF00'}}></i>
                <span style={{color: 'white'}}>inscription@edjs.ma</span>
              </div>
            </div>

            {/* Navigation */}
            <div style={{textAlign: 'center'}}>
              <h3 style={{color: '#cccccc', marginBottom: '20px', fontSize: '1.2rem'}}>Navigation</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{marginBottom: '8px'}}>
                  <a href="/" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}} 
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BDCF00'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Accueil
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="/spectacles" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BDCF00'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Spectacles
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="https://edjs.art/gallery.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BDCF00'}
                     onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                    Galerie
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}
                     onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BDCF00'}
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
              Copyright © {new Date().getFullYear()} <a href="/" style={{color: '#BDCF00', textDecoration: 'none'}}>L'École des jeunes spectateurs</a>. Tous droits réservés.
            </p>
            <div style={{display: 'flex', gap: '20px'}}>
              <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BDCF00'}
                 onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                Conditions Générales
              </a>
              <a href="https://edjs.art/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BDCF00'}
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
