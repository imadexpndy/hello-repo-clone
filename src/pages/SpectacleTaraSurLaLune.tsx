import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SpectacleTaraSurLaLune() {
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
      window.location.href = '/reservation/tara-sur-la-lune';
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
                  <i class="fas fa-rocket"></i>
                  Aventure Spatiale
                </div>
                <h1 class="hero-title">Tara sur la Lune</h1>
                <p class="hero-subtitle">Une aventure extraordinaire dans l'espace avec Tara et ses amis</p>
                <div class="info-pills">
                  <span class="info-pill">
                    <i class="fas fa-clock"></i>45 minutes
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-users"></i>4 comédiens
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-child"></i>5 ans et +
                  </span>
                  <span class="info-pill">
                    <i class="fas fa-star"></i>Aventure
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
              <img src="https://edjs.art/assets/img/spectacles elements/tara@4x.png" alt="Tara Character">
            </div>
            
            <div class="hero-right">
              <img src="https://edjs.art/assets/img/affiche tara sur la lune VF.jpeg" alt="Tara sur la Lune Affiche" style="width: 100%; height: 100%; object-fit: cover;">
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
                  <p>Tara, une petite fille curieuse et aventureuse, rêve d'explorer l'espace et de découvrir les mystères de la lune. Accompagnée de ses fidèles amis, elle embarque dans une aventure extraordinaire qui la mènera bien au-delà de ce qu'elle avait imaginé.</p>
                  
                  <p>Cette histoire captivante nous emmène dans un voyage spatial plein de surprises, où Tara découvre que les plus grandes aventures commencent souvent par un simple rêve. Entre science-fiction et réalité, ce spectacle mélange habilement l'imaginaire et les connaissances scientifiques pour créer une expérience unique.</p>
                  
                  <p>À travers les péripéties de Tara, les jeunes spectateurs découvriront l'importance de la persévérance, de l'amitié et du courage face à l'inconnu. Un spectacle qui inspire et fait rêver toute la famille.</p>
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
                        <i class="fas fa-rocket"></i>
                        <span>L'exploration spatiale</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-heart"></i>
                        <span>L'amitié et la solidarité</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-brain"></i>
                        <span>La curiosité scientifique</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <i class="fas fa-star"></i>
                        <span>Les rêves et l'imagination</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-fist-raised"></i>
                        <span>Le courage et la persévérance</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-globe"></i>
                        <span>La découverte de nouveaux mondes</span>
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
                  <p>Ce spectacle offre une excellente introduction à l'astronomie et aux sciences spatiales de manière ludique et accessible. Il encourage les enfants à s'intéresser aux sciences tout en développant leur imagination.</p>
                  
                  <p>Les enseignants peuvent utiliser cette représentation pour aborder des notions scientifiques comme le système solaire, les phases de la lune, et l'exploration spatiale, tout en travaillant sur des valeurs humaines essentielles comme l'amitié et la persévérance.</p>
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
                    <span>Durée : 45 minutes</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-users"></i>
                    <span>Distribution : 4 comédiens</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-child"></i>
                    <span>Âge recommandé : 5 ans et +</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span>Période : Novembre 2025</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-language"></i>
                    <span>Langue : Français</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-rocket"></i>
                    <span>Genre : Aventure & Science-fiction</span>
                  </div>
                </div>

                <!-- Reservation Card -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-ticket-alt"></i>
                    Réservation
                  </h3>
                  <p style="color: var(--text-light); margin-bottom: 1.5rem;">Embarquez avec Tara dans cette aventure spatiale extraordinaire !</p>
                  <button class="btn-primary w-100" onclick="window.handleReservation()">
                    <i class="fas fa-ticket-alt"></i>
                    ${user ? 'Réserver Maintenant' : 'Se connecter pour réserver'}
                  </button>
                </div>

                <!-- Fun Facts Card -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-lightbulb"></i>
                    Le saviez-vous ?
                  </h3>
                  <p style="color: var(--text-light); font-size: 0.9rem; line-height: 1.6;">La lune est située à environ 384 400 kilomètres de la Terre. Il faudrait marcher sans s'arrêter pendant plus de 9 ans pour l'atteindre à pied ! Heureusement, Tara a trouvé un moyen plus rapide...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <script>
          window.handleReservation = function() {
            ${user ? `window.location.href = '/reservation/tara-sur-la-lune';` : `
              const returnUrl = encodeURIComponent(window.location.href);
              window.location.href = '/auth?return_url=' + returnUrl;
            `}
          };
        </script>
      `
    }} />
  );
}
