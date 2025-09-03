import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SpectacleEstevanico() {
  const { user } = useAuth();

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
      window.location.href = '/reservation/estevanico';
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  return (
    <div dangerouslySetInnerHTML={{
      __html: `
        <style>
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
            min-height: 100vh;
            display: flex;
            align-items: center;
            overflow: hidden;
            padding: 0;
            background: linear-gradient(135deg, #d4a574 0%, #8b4513 100%);
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
            padding: 4rem 2rem;
            display: flex;
            align-items: center;
            color: white;
          }

          .hero-right {
            flex: 1;
            position: relative;
            background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover;
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

          .hero-character img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
          }

          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-20px); }
          }

          .hero-badge {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
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
            
            .hero-character {
              width: 120px;
              height: 168px;
            }
          }
        </style>

        <!-- Hero Section -->
        <section class="spectacle-hero">
          <div class="hero-container">
            <div class="hero-left">
              <div class="hero-content">
                <div class="hero-badge">
                  <i class="fas fa-compass"></i>
                  Spectacle Historique
                </div>
                <h1 class="hero-title">Estevanico</h1>
                <p class="hero-subtitle">L'explorateur du Nouveau Monde et ses aventures extraordinaires</p>
                <div class="info-pills">
                  <span class="info-pill">
                    <i class="fas fa-clock"></i>60 minutes
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-users"></i>4 comédiens
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-child"></i>8 ans et +
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-globe"></i>Aventure
                  </span>
                </div>
                <div class="hero-buttons">
                  <button class="btn-primary" onclick="window.handleReservation()">
                    <i class="fas fa-ticket-alt"></i>
                    ${user ? 'Réserver Maintenant' : 'Se connecter pour réserver'}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="hero-character">
              <img src="https://edjs.art/assets/img/spectacles elements/estevanico@4x.png" alt="Estevanico Character">
            </div>
            
            <div class="hero-right">
              <img src="https://edjs.art/assets/img/spectacles/estevanico.png" alt="Estevanico Affiche" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          </div>
        </section>

        <!-- Main Content -->
        <section class="content-section">
          <div class="container">
            <div class="row">
              <div class="col-lg-8">
                <!-- Story & Synopsis Card -->
                <div class="content-card">
                  <h2 class="card-title">
                    <i class="fas fa-book-open"></i>
                    Synopsis
                  </h2>
                  <p>Découvrez l'histoire fascinante d'Estevanico, l'un des premiers explorateurs africains du Nouveau Monde. Ce spectacle retrace le parcours extraordinaire de cet homme courageux qui a participé aux expéditions de découverte de l'Amérique du Nord au XVIe siècle.</p>
                  
                  <p>À travers ses aventures périlleuses, Estevanico nous emmène dans un voyage épique à travers des terres inconnues, où il fait face aux défis de l'exploration, aux rencontres avec les peuples autochtones, et aux mystères du Nouveau Monde.</p>
                  
                  <p>Cette adaptation théâtrale mélange histoire et aventure pour créer un spectacle captivant qui met en lumière une figure historique méconnue, tout en abordant des thèmes universels comme le courage, la découverte et le respect des différences culturelles.</p>
                </div>

                <!-- Themes Card -->
                <div class="content-card">
                  <h2 class="card-title">
                    <i class="fas fa-lightbulb"></i>
                    Thèmes abordés
                  </h2>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item">
                        <i class="fas fa-compass"></i>
                        <span>L'exploration et la découverte</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-fist-raised"></i>
                        <span>Le courage et la persévérance</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-handshake"></i>
                        <span>La rencontre des cultures</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <i class="fas fa-scroll"></i>
                        <span>L'histoire et le patrimoine</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-users"></i>
                        <span>La diversité et l'inclusion</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-star"></i>
                        <span>Les héros méconnus</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Educational Value Card -->
                <div class="content-card">
                  <h2 class="card-title">
                    <i class="fas fa-graduation-cap"></i>
                    Valeur pédagogique
                  </h2>
                  <p>Ce spectacle offre une excellente introduction à l'histoire des grandes explorations et permet de découvrir des figures historiques souvent oubliées. Il développe la curiosité historique et géographique des jeunes spectateurs.</p>
                  
                  <p>Les enseignants peuvent utiliser cette représentation pour aborder l'histoire de l'Amérique, les grandes explorations du XVIe siècle, et sensibiliser aux questions de diversité culturelle et d'inclusion dans l'histoire.</p>
                </div>
              </div>

              <div class="col-lg-4">
                <!-- Booking Info Card -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-info-circle"></i>
                    Informations pratiques
                  </h3>
                  <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>Durée : 60 minutes</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-users"></i>
                    <span>Distribution : 4 comédiens</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-child"></i>
                    <span>Âge recommandé : 8 ans et +</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span>Période : Décembre 2025</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-language"></i>
                    <span>Langue : Français</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-compass"></i>
                    <span>Genre : Historique & Aventure</span>
                  </div>
                </div>

                <!-- Reservation Card -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-ticket-alt"></i>
                    Réservation
                  </h3>
                  <p style="color: var(--text-light); margin-bottom: 1.5rem;">Partez à l'aventure avec Estevanico, l'explorateur du Nouveau Monde !</p>
                  <button class="btn-primary w-100" onclick="window.handleReservation()">
                    <i class="fas fa-ticket-alt"></i>
                    ${user ? 'Réserver Maintenant' : 'Se connecter pour réserver'}
                  </button>
                </div>

                <!-- Historical Facts Card -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-scroll"></i>
                    Contexte historique
                  </h3>
                  <p style="color: var(--text-light); font-size: 0.9rem; line-height: 1.6;">Estevanico (vers 1500-1539) était un explorateur marocain qui a participé aux premières expéditions européennes en Amérique du Nord. Il est considéré comme l'un des premiers Africains à avoir exploré le territoire qui deviendra les États-Unis.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <script>
          window.handleReservation = function() {
            ${user ? `window.location.href = '/reservation/estevanico';` : `
              const returnUrl = encodeURIComponent(window.location.href);
              window.location.href = '/auth?return_url=' + returnUrl;
            `}
          };
        </script>
      `
    }} />
  );
}
