import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SpectacleFooter from '@/components/SpectacleFooter';
import VideoPopup from '@/components/VideoPopup';
import SessionsDisplay from '@/components/SessionsDisplay';
import { getUserTypeInfo, getStudyLevelForSpectacle } from '@/utils/userTypeUtils';

export default function SpectacleAntigone() {
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
      window.location.href = '/reservation/antigone';
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
    <div dangerouslySetInnerHTML={{
      __html: `
        <style>
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
            background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #6f42c1 0%, #8e44ad 100%);
            background-size: cover, cover;
          }

          .hero-container {
            display: flex;
            align-items: center;
            min-height: 70vh;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          .hero-left {
            flex: 1;
            padding-right: 3rem;
            color: white;
          }

          .hero-content {
            max-width: 600px;
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
            background: linear-gradient(145deg, #8BC34A, #689F38);
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

          .btn-secondary-custom {
            background: transparent;
            color: white;
            padding: 1rem 2rem;
            border: 2px solid white;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
          }

          .btn-secondary-custom:hover {
            background: white;
            color: var(--primary-color);
            transform: translateY(-2px);
          }

          .content-section {
            padding: 5rem 0;
            background: white;
          }

          .section-title {
            font-family: 'Amatic SC', cursive;
            font-size: 3rem;
            font-weight: 700;
            color: var(--text-dark);
            text-align: center;
            margin-bottom: 3rem;
          }

          .story-card, .educational-card {
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
          }

          .card-text {
            font-size: 1.1rem;
            line-height: 1.7;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
          }

          .themes-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .theme-item {
            background: var(--bg-light);
            padding: 1rem;
            border-radius: 10px;
            border-left: 3px solid var(--primary-color);
          }

          .sidebar-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
            border-top: 4px solid var(--primary-color);
          }

          .sidebar-title {
            font-family: 'Amatic SC', cursive;
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
            text-align: center;
          }

          @media (max-width: 768px) {
            .hero-container {
              flex-direction: column;
              text-align: center;
              padding: 2rem 1rem;
            }
            
            .hero-left {
              padding-right: 0;
              margin-bottom: 2rem;
            }
            
            .hero-right {
              padding-left: 0;
            }
            
            .hero-title {
              font-size: 3rem;
            }
            
            .vintage-tv-container {
              max-width: 300px;
            }
            
            .tv-frame {
              width: 300px;
              height: 300px;
            }
          }
        </style>

        <!-- Hero Section -->
        <section class="spectacle-hero">
          <div class="hero-container">
            <div class="hero-left">
              <div class="hero-content">
                <h1 class="hero-title">Antigone</h1>
                <p class="hero-subtitle">La tragédie intemporelle de Sophocle adaptée pour le jeune public</p>
                
                <div class="info-pills">
                  <span class="info-pill">
                    <i class="fas fa-clock"></i>60 minutes
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-users"></i>6 comédiens
                  </span>
                  <span class="info-pill" id="age-level-pill">
                    <i class="fas fa-child"></i><span id="age-level-text">Collège, Lycée</span>
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-theater-masks"></i>Théâtre classique
                  </span>
                </div>
                
                <div class="hero-buttons">
                  <button class="btn-primary" onclick="window.handleReservation()">
                    <i class="fas fa-ticket-alt"></i>
                    Se connecter pour réserver
                  </button>
                </div>
              </div>
            </div>
            
            <div class="hero-right">
              <div class="vintage-tv-container">
                <div class="tv-frame">
                  <div class="tv-screen">
                    <img src="https://edjs.art/assets/img/spectacles/antigone.png" alt="Antigone Affiche" class="tv-video">
                    <div class="play-button-overlay" onclick="openVideoPopup()">
                      <div class="play-button">
                        <i class="fas fa-play"></i>
                      </div>
                    </div>
                  </div>
                  <div class="tv-controls">
                    <div class="tv-knob"></div>
                    <div class="tv-brand">EDJS</div>
                    <div class="tv-knob"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Content Section -->
        <section class="content-section">
          <div class="container">
            <div class="row">
              <div class="col-lg-8">
                <h2 class="section-title">L'Histoire</h2>
                
                <div class="story-card">
                  <h3 class="card-title">Une Tragédie Universelle</h3>
                  <p class="card-text">
                    "Antigone" de Sophocle est l'une des plus grandes tragédies de l'Antiquité grecque. 
                    Cette adaptation respectueuse rend accessible aux jeunes spectateurs l'histoire d'Antigone, 
                    jeune femme courageuse qui défie les lois de la cité pour honorer son frère défunt.
                  </p>
                  <p class="card-text">
                    Face au roi Créon, Antigone incarne la résistance morale et le courage de ses convictions. 
                    Cette pièce intemporelle interroge les notions de justice, de devoir familial et de désobéissance civile, 
                    offrant aux spectateurs une réflexion profonde sur les valeurs humaines fondamentales.
                  </p>
                </div>

                <div class="educational-card">
                  <h3 class="card-title">Valeurs Pédagogiques</h3>
                  <p class="card-text">
                    Cette tragédie classique développe l'esprit critique des jeunes spectateurs 
                    et les sensibilise aux grands questionnements éthiques et philosophiques.
                  </p>
                  
                  <div class="themes-list">
                    <div class="theme-item">
                      <strong>Justice et loi</strong><br>
                      Réflexion sur l'autorité et la morale
                    </div>
                    <div class="theme-item">
                      <strong>Courage civique</strong><br>
                      Importance de défendre ses convictions
                    </div>
                    <div class="theme-item">
                      <strong>Patrimoine culturel</strong><br>
                      Découverte du théâtre antique
                    </div>
                    <div class="theme-item">
                      <strong>Philosophie</strong><br>
                      Questionnements éthiques universels
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-lg-4">
                <div class="sidebar-card">
                  <h3 class="sidebar-title">
                    <i class="fas fa-calendar-alt"></i>
                    Séances Disponibles
                  </h3>
                  <SessionsDisplay spectacleId="antigone" onReservation={handleReservation} />
                </div>
                
                <div class="sidebar-card">
                  <h3 class="sidebar-title">Informations Pratiques</h3>
                  <div style="space-y: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                      <i class="fas fa-clock" style="color: var(--primary-color); width: 20px;"></i>
                      <span><strong>Durée :</strong> 60 minutes</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                      <i class="fas fa-users" style="color: var(--primary-color); width: 20px;"></i>
                      <span><strong>Distribution :</strong> 6 comédiens</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                      <i class="fas fa-child" style="color: var(--primary-color); width: 20px;"></i>
                      <span><strong>Âge :</strong> <span class="age-display">12 ans et +</span></span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                      <i class="fas fa-theater-masks" style="color: var(--primary-color); width: 20px;"></i>
                      <span><strong>Genre :</strong> Théâtre classique</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <script>
          // Update age display based on user type
          function updateAgeDisplay() {
            const userType = sessionStorage.getItem('userType');
            const professionalType = sessionStorage.getItem('professionalType');
            const ageElements = document.querySelectorAll('.age-display');
            
            let displayText = '12 ans et +';
            if (userType === 'professional' && professionalType === 'private_school') {
              displayText = 'Collège, Lycée';
            }
            
            ageElements.forEach(el => {
              el.textContent = displayText;
            });
          }

          // Update on page load
          updateAgeDisplay();
          
          // Listen for user type changes
          window.addEventListener('userTypeChanged', updateAgeDisplay);
          window.addEventListener('storage', updateAgeDisplay);
        </script>
      `
    }} />

    <div style={{ marginTop: '2rem' }}>
      <SessionsDisplay 
        spectacleId="antigone" 
        onReservation={handleReservation}
      />
    </div>

    <VideoPopup 
      isOpen={isVideoOpen}
      onClose={() => setIsVideoOpen(false)}
      videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Antigone - Bande-annonce"
    />

    <SpectacleFooter />
    </>
  );
}
