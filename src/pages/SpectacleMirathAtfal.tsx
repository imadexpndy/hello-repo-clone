import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import VideoPopup from '@/components/VideoPopup';

export default function SpectacleMirathAtfal() {
  const { user } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [userType, setUserType] = useState<string>('');
  const [professionalType, setProfessionalType] = useState<string>('');
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    name: '',
    organization: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Check user type on component mount and set up listeners
    const checkUserType = () => {
      const storedUserType = sessionStorage.getItem('userType') || localStorage.getItem('userType');
      const storedProfessionalType = sessionStorage.getItem('professionalType') || localStorage.getItem('professionalType');
      
      console.log('Debug - User Type:', storedUserType);
      console.log('Debug - Professional Type:', storedProfessionalType);
      
      setUserType(storedUserType || '');
      setProfessionalType(storedProfessionalType || '');
    };

    // Initial check
    checkUserType();
    
    // Set up event listeners
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
      // Pass user type as parameter to show only relevant sessions
      const userTypeParam = professionalType || userType || '';
      window.location.href = `/reservation/mirath-atfal?userType=${userTypeParam}`;
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

  // Review form handlers
  const handleReviewInputChange = (field: string, value: string | number) => {
    setReviewForm(prev => ({ ...prev, [field]: value }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment || reviewForm.rating === 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Merci pour votre avis ! Il sera publié après modération.');
      setReviewForm({ name: '', organization: '', rating: 0, comment: '' });
    } catch (error) {
      alert('Erreur lors de l\'envoi de votre avis. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userTypeDisplay = getUserTypeDisplay();

  return (
    <>
      <style>{`
        :root {
          --primary-color: #8E44AD;
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
          background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #8E44AD 0%, #9B59B6 100%);
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
          background: linear-gradient(145deg, #8E44AD, #9B59B6);
          border-radius: 20px;
          padding: 40px 35px 50px 35px;
          box-shadow: 
            0 0 30px rgba(0,0,0,0.3),
            inset 0 0 20px rgba(0,0,0,0.2),
            inset 0 2px 5px rgba(255,255,255,0.1);
          position: relative;
          max-width: 750px;
          width: 100%;
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
          aspect-ratio: 16/9;
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
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          color: white;
          background: #a8b800;
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

      <VideoPopup 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl="https://youtube.com/shorts/iARC1DejKHo?feature=share" 
      />
      
      {userTypeDisplay && (
        <div style={{
          background: 'rgba(189, 207, 0, 0.05)',
          borderBottom: '1px solid rgba(189, 207, 0, 0.1)',
          padding: '12px 0'
        }}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className={userTypeDisplay.icon} style={{color: '#BDCF00', fontSize: '18px'}}></i>
              <div>
                <span style={{
                  fontWeight: 600,
                  color: '#333',
                  fontSize: '16px'
                }}>{userTypeDisplay.label}</span>
                <span style={{
                  color: '#666',
                  marginLeft: '8px',
                  fontSize: '14px'
                }}>• Rabat - Casablanca</span>
              </div>
            </div>
            <button 
              onClick={goBackToSelection}
              style={{
                background: 'transparent',
                border: '1px solid #ccc',
                color: '#666',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Changer de profil
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="spectacle-hero">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="hero-title">Mirath Atfal</h1>
              <p className="hero-subtitle">Découvrez le riche patrimoine culturel marocain à travers les yeux des enfants</p>
              <div className="info-pills">
                <span className="info-pill">
                  <i className="fas fa-clock"></i>55 minutes
                </span>
                <span className="info-pill">
                  <i className="fas fa-users"></i>4 comédiens
                </span>
                {/* Debug conditional rendering */}
                {/* Show study levels only for private schools */}
                {userType === 'professional' && professionalType === 'scolaire-privee' && (
                  <span className="info-pill">
                    <i className="fas fa-child"></i>CE2, CM1, CM2, Collège
                  </span>
                )}
                {/* Show age ranges for public schools, associations, and particulier */}
                {(userType === 'particulier' || 
                  (userType === 'professional' && professionalType === 'scolaire-publique') ||
                  (userType === 'professional' && professionalType === 'association')) && (
                  <span className="info-pill">
                    <i className="fas fa-child"></i>8 ans et +
                  </span>
                )}
                <span className="info-pill">
                  <i className="fas fa-theater-masks"></i>Patrimoine culturel
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
            <div className="vintage-tv-container" style={{
              position: 'relative',
              maxWidth: '750px',
              margin: '0 auto'
            }}>
              <div className="tv-frame">
                <div className="tv-screen">
                  <img 
                    src="/src/assets/Tara_Sur_La_Lune_Web_020.jpg" 
                    alt="Mirath Atfal" 
                    style={{
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: '10px', 
                      display: 'block'
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
                      <i className="fas fa-play" style={{marginLeft: '4px'}}></i>
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

      {/* Main Content */}
      <section className="content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Story & Synopsis Card */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-book-open"></i>
                  Synopsis
                </h2>
                <p>Plongez dans l'univers fascinant du patrimoine marocain avec "Mirath Atfal" ! Ce spectacle unique fait découvrir aux enfants les trésors de notre culture à travers des contes, des traditions et des légendes transmises de génération en génération.</p>
                
                <p>Les jeunes spectateurs voyagent à travers les différentes régions du Maroc, découvrant l'artisanat, la musique, la poésie et les valeurs qui font la richesse de notre identité. Un voyage initiatique qui renforce le sentiment d'appartenance et la fierté culturelle.</p>
                
                <p>Un spectacle éducatif et divertissant qui sensibilise les enfants à l'importance de préserver et de transmettre notre héritage culturel aux futures générations.</p>
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
                      <i className="fas fa-mosque"></i>
                      <span>Patrimoine architectural</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-music"></i>
                      <span>Musique traditionnelle</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-palette"></i>
                      <span>Artisanat marocain</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <i className="fas fa-flag"></i>
                      <span>Identité culturelle</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-book"></i>
                      <span>Contes et légendes</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <span>Transmission générationnelle</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="content-card">
                <h2 className="card-title">
                  <i className="fas fa-star"></i>
                  Avis et commentaires
                </h2>
                
                {/* Existing Reviews */}
                <div className="reviews-list" style={{marginBottom: '2rem'}}>
                  <div className="review-item" style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid #BDCF00'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <div className="stars" style={{color: '#BDCF00', marginRight: '0.5rem'}}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <strong style={{color: '#333'}}>M. Fassi</strong>
                      <span style={{color: '#666', marginLeft: '0.5rem', fontSize: '0.9rem'}}>Collège Mohammed V</span>
                    </div>
                    <p style={{color: '#555', margin: 0}}>"Mirath Atfal a été une révélation pour nos élèves ! Ils ont redécouvert la richesse de leur patrimoine culturel avec fierté et émotion."</p>
                  </div>
                  
                  <div className="review-item" style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid #BDCF00'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <div className="stars" style={{color: '#BDCF00', marginRight: '0.5rem'}}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                      <strong style={{color: '#333'}}>Nadia Z.</strong>
                      <span style={{color: '#666', marginLeft: '0.5rem', fontSize: '0.9rem'}}>Parent</span>
                    </div>
                    <p style={{color: '#555', margin: 0}}>"Mon fils est rentré à la maison en me racontant les légendes marocaines qu'il a découvertes. Il est fier de ses racines maintenant !"</p>
                  </div>
                </div>
                
                {/* Review Submission Form */}
                <form onSubmit={handleReviewSubmit} className="review-form" style={{backgroundColor: '#fff', padding: '1.5rem', border: '2px solid #BDCF00', borderRadius: '8px'}}>
                  <h3 style={{color: '#333', marginBottom: '1rem', fontSize: '1.2rem'}}>Laissez votre avis</h3>
                  
                  <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Votre nom *</label>
                    <input 
                      type="text" 
                      value={reviewForm.name}
                      onChange={(e) => handleReviewInputChange('name', e.target.value)}
                      placeholder="Entrez votre nom"
                      required
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
                      value={reviewForm.organization}
                      onChange={(e) => handleReviewInputChange('organization', e.target.value)}
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
                          className={reviewForm.rating >= star ? 'fas fa-star' : 'far fa-star'}
                          onClick={() => handleReviewInputChange('rating', star)}
                          style={{
                            fontSize: '1.5rem',
                            color: '#BDCF00',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        ></i>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group" style={{marginBottom: '1.5rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Votre commentaire *</label>
                    <textarea 
                      value={reviewForm.comment}
                      onChange={(e) => handleReviewInputChange('comment', e.target.value)}
                      placeholder="Partagez votre expérience du spectacle..."
                      rows={4}
                      required
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
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting ? '#ccc' : '#BDCF00',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) (e.target as HTMLElement).style.backgroundColor = '#a8b800'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) (e.target as HTMLElement).style.backgroundColor = '#BDCF00'
                    }}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Publier mon avis'}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              {/* Available Sessions Card */}
              <div className="sidebar-card">
                <h3>
                  <i className="fas fa-calendar-alt"></i>
                  Séances Disponibles
                </h3>
                
                {/* Tout public sessions - show for particulier */}
                {(userType === 'particulier' || !userType) && (
                  <>
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Mardi 26 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>14H00 - Rabat, Théâtre Bahnini</div>
                      <button 
                        onClick={handleReservation}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                    
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Mercredi 27 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>10H00 - Casablanca, Complexe El Hassani</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=casablanca-nov-27-10h00'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                  </>
                )}
                
                {/* Private school sessions - show for scolaire-privee */}
                {professionalType === 'scolaire-privee' && (
                  <>
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Lundi 25 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>09H30 - Rabat, Théâtre Bahnini</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=rabat-nov-25-09h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                    
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Lundi 25 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>14H30 - Rabat, Théâtre Bahnini</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=rabat-nov-25-14h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                    
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Vendredi 28 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>09H30 - Casablanca, Complexe El Hassani</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=casablanca-nov-28-09h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                    
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Vendredi 28 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>14H30 - Casablanca, Complexe El Hassani</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=casablanca-nov-28-14h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                  </>
                )}
                
                {/* Public school sessions - show for scolaire-publique */}
                {professionalType === 'scolaire-publique' && (
                  <>
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Mardi 26 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>09H30 - Rabat, Théâtre Bahnini</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=rabat-nov-26-09h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                    
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Jeudi 27 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>14H30 - Casablanca, Complexe El Hassani</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=casablanca-nov-27-14h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                  </>
                )}
                
                {/* Association sessions - show for association */}
                {professionalType === 'association' && (
                  <>
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Mardi 26 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>09H30 - Rabat, Théâtre Bahnini</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=rabat-nov-26-09h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                    
                    <div className="showtime-item" style={{background: 'var(--bg-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                      <div className="showtime-date" style={{fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', fontFamily: 'Raleway, sans-serif'}}>Jeudi 27 Novembre 2025</div>
                      <div className="showtime-time" style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'Raleway, sans-serif'}}>14H30 - Casablanca, Complexe El Hassani</div>
                      <button 
                        onClick={() => window.location.href = '/reservation/mirath-atfal?session=casablanca-nov-27-14h30'}
                        style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease', fontFamily: 'Raleway, sans-serif', cursor: 'pointer'}}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Réserver
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Booking Info Card */}
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
                  <span>Distribution : 4 comédiens</span>
                </div>
                {/* Age recommendation - hidden for private schools */}
                {professionalType !== 'scolaire-privee' && (
                  <div className="info-item">
                    <i className="fas fa-child"></i>
                    <span>Âge recommandé : 8 ans et +</span>
                  </div>
                )}
                
                {/* Study level - visible only for private schools */}
                {professionalType === 'scolaire-privee' && (
                  <div className="info-item">
                    <i className="fas fa-graduation-cap"></i>
                    <span>Niveaux scolaires : CE2, CM1, CM2, Collège</span>
                  </div>
                )}
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <span>Période : Novembre 2025</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-language"></i>
                  <span>Langue : Français</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-heart"></i>
                  <span>Genre : Patrimoine culturel</span>
                </div>
              </div>

              {/* Reservation Card */}
              <div className="sidebar-card">
                <h3>
                  <i className="fas fa-ticket-alt"></i>
                  Réservation
                </h3>
                <p style={{color: 'var(--text-light)', marginBottom: '1.5rem'}}>Réservez dès maintenant vos places pour découvrir le riche patrimoine marocain avec Mirath Atfal.</p>
                <button className="btn-primary w-100" onClick={handleReservation} style={{width: '100%'}}>
                  <i className="fas fa-ticket-alt"></i>
                  {user ? 'Réserver Maintenant' : 'Se connecter pour réserver'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Spectacle Card Section */}
      <section style={{padding: '4rem 0', background: '#f8f9fa'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="content-card" style={{textAlign: 'center'}}>
                <h2 className="card-title" style={{marginBottom: '2rem'}}>
                  <i className="fas fa-forward"></i>
                  Prochain Spectacle
                </h2>
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <img 
                      src="/assets/img/spectacles/simple-comme-bonjour.png" 
                      alt="Simple Comme Bonjour" 
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }}
                    />
                  </div>
                  <div className="col-md-8" style={{textAlign: 'left', paddingLeft: '2rem'}}>
                    <h3 style={{color: '#BDCF00', fontSize: '2rem', marginBottom: '1rem'}}>Simple Comme Bonjour</h3>
                    <p style={{color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                      Un spectacle chaleureux qui célèbre les petits bonheurs du quotidien et l'importance des gestes simples. 
                      Une comédie touchante sur l'humanité et la bienveillance.
                    </p>
                    <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
                      <span style={{background: '#e3f2fd', color: '#1976d2', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem'}}>
                        <i className="fas fa-clock"></i> 45 min
                      </span>
                      <span style={{background: '#f3e5f5', color: '#7b1fa2', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem'}}>
                        <i className="fas fa-users"></i> 2 comédiens
                      </span>
                      <span style={{background: '#e8f5e8', color: '#388e3c', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem'}}>
                        <i className="fas fa-child"></i> 3 ans et +
                      </span>
                    </div>
                    <button 
                      className="btn-primary"
                      onClick={() => window.location.href = '/spectacle/simple-comme-bonjour'}
                      style={{
                        padding: '0.75rem 2rem', 
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = '#a8b800';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = '#BDCF00';
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <i className="fas fa-eye"></i>
                      Découvrir Simple Comme Bonjour
                    </button>
                  </div>
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
                  <a href="https://edjs.ma/" style={{color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}} 
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
              Copyright © {new Date().getFullYear()} <a href="https://edjs.ma/" style={{color: '#BDCF00', textDecoration: 'none'}}>L'École des jeunes spectateurs</a>. Tous droits réservés.
            </p>
            <div style={{display: 'flex', gap: '20px'}}>
              <a href="https://edjs.ma/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BDCF00'}
                 onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}>
                Conditions Générales
              </a>
              <a href="https://edjs.ma/contact.html" style={{color: 'white', textDecoration: 'none', fontSize: '0.85rem'}}
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
