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

  useEffect(() => {
    // Expose handleReservation to window object for inline event handlers
    (window as any).handleReservation = handleReservation;
  }, [user]);

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
            min-height: 60vh;
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

          .vintage-tv-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 2rem;
          }

          .tv-frame {
            background: linear-gradient(145deg, #BDCF00, #D4E157);
            border-radius: 20px;
            padding: 30px 25px 40px 25px;
            box-shadow: 0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.1);
            position: relative;
            max-width: 400px;
            margin: 0 auto;
          }

          .tv-screen {
            background: #000;
            border-radius: 15px;
            padding: 15px;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
          }

          .hero-character {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 15;
            width: 200px;
            height: 280px;
          }

          .hero-character img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
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

          .btn-outline {
            background: transparent;
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            font-family: 'Raleway', sans-serif;
          }

          .btn-outline:hover {
            background: var(--primary-color);
            color: white;
            text-decoration: none;
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
            
            <div class="hero-right">
              <div class="vintage-tv-container">
                <div class="tv-frame">
                  <div class="tv-screen">
                    <img src="https://edjs.art/assets/img/affiche tara sur la lune VF.jpeg" alt="Tara sur la Lune Affiche" class="tv-video" style="width: 100%; height: auto; border-radius: 10px; display: block;">
                    <div class="play-button-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.3); cursor: pointer; transition: all 0.3s ease;">
                      <div class="play-button" style="background: rgba(255,255,255,0.9); border-radius: 50%; width: 80px; height: 80px; display: flex; justify-content: center; align-items: center; font-size: 2rem; color: #333; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: all 0.3s ease;">
                        <i class="fas fa-play" style="margin-left: 4px;"></i>
                      </div>
                    </div>
                  </div>
                  <div class="tv-controls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding: 0 20px;">
                    <div class="tv-knob" style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(145deg, #C0C0C0, #808080); box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2); position: relative;"></div>
                    <div class="tv-brand" style="color: #FFD700; font-weight: bold; font-size: 1.2rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); letter-spacing: 2px;">EDJS</div>
                    <div class="tv-knob" style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(145deg, #C0C0C0, #808080); box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2); position: relative;"></div>
                  </div>
                </div>
              </div>
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

                <!-- Gallery Section -->
                <div class="content-card">
                  <h2 class="card-title">
                    <i class="fas fa-images"></i>
                    Galerie Photos
                  </h2>
                  <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
                    <div class="gallery-item" style="position: relative; border-radius: 0.75rem; overflow: hidden; cursor: pointer; transition: transform 0.3s ease;">
                      <img src="https://edjs.art/assets/img/gallery/Tara sur la Lune/Tara_sur_la_Lune_Web_002.jpg" alt="Tara sur la Lune - Photo 1" class="gallery-img" style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.3s ease;">
                      <div class="gallery-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(189, 207, 0, 0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                        <i class="fas fa-expand" style="color: white; font-size: 1.5rem;"></i>
                      </div>
                    </div>
                    <div class="gallery-item" style="position: relative; border-radius: 0.75rem; overflow: hidden; cursor: pointer; transition: transform 0.3s ease;">
                      <img src="https://edjs.art/assets/img/gallery/Tara sur la Lune/Tara_sur_la_Lune_Web_003.jpg" alt="Tara sur la Lune - Photo 2" class="gallery-img" style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.3s ease;">
                      <div class="gallery-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(189, 207, 0, 0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                        <i class="fas fa-expand" style="color: white; font-size: 1.5rem;"></i>
                      </div>
                    </div>
                    <div class="gallery-item" style="position: relative; border-radius: 0.75rem; overflow: hidden; cursor: pointer; transition: transform 0.3s ease;">
                      <img src="https://edjs.art/assets/img/gallery/Tara sur la Lune/Tara_sur_la_Lune_Web_004.jpg" alt="Tara sur la Lune - Photo 3" class="gallery-img" style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.3s ease;">
                      <div class="gallery-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(189, 207, 0, 0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                        <i class="fas fa-expand" style="color: white; font-size: 1.5rem;"></i>
                      </div>
                    </div>
                    <div class="gallery-item" style="position: relative; border-radius: 0.75rem; overflow: hidden; cursor: pointer; transition: transform 0.3s ease;">
                      <img src="https://edjs.art/assets/img/gallery/Tara sur la Lune/Tara_sur_la_Lune_Web_005.jpg" alt="Tara sur la Lune - Photo 4" class="gallery-img" style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.3s ease;">
                      <div class="gallery-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(189, 207, 0, 0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                        <i class="fas fa-expand" style="color: white; font-size: 1.5rem;"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reviews Section -->
                <div class="content-card">
                  <h2 class="card-title">
                    <i class="fas fa-star"></i>
                    Avis des Spectateurs
                  </h2>
                  <div class="reviews-container" style="margin-top: 1.5rem;">
                    <div class="review-item" style="background: var(--bg-light); padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                      <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div class="review-author" style="font-weight: 600; color: var(--text-dark); font-size: 0.9rem;">Sarah M. - École Primaire</div>
                        <div class="review-stars" style="color: #ffc107;">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                      <p class="review-text" style="color: var(--text-light); font-style: italic; line-height: 1.6; margin: 0;">"Un spectacle magnifique qui a captivé mes élèves ! L'histoire de Tara les a transportés dans l'espace et leur a donné envie d'en apprendre plus sur l'astronomie."</p>
                    </div>
                    <div class="review-item" style="background: var(--bg-light); padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                      <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div class="review-author" style="font-weight: 600; color: var(--text-dark); font-size: 0.9rem;">Ahmed K. - Parent</div>
                        <div class="review-stars" style="color: #ffc107;">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                      <p class="review-text" style="color: var(--text-light); font-style: italic; line-height: 1.6; margin: 0;">"Ma fille de 6 ans était émerveillée ! Elle n'arrête pas de parler de Tara et de ses aventures sur la Lune. Un spectacle éducatif et divertissant."</p>
                    </div>
                  </div>
                  
                  <!-- Review Submission Form -->
                  <div style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 0.75rem;">
                    <h3 style="color: var(--text-dark); font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem;">Laissez votre avis</h3>
                    <form id="reviewForm">
                      <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark);">Votre nom</label>
                        <input type="text" id="reviewName" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: 0.5rem; font-family: 'Raleway', sans-serif;" placeholder="Votre nom" required>
                      </div>
                      <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark);">Note</label>
                        <div class="star-rating" style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem;">
                          <i class="fas fa-star star-btn" data-rating="1" style="color: #ddd; cursor: pointer; font-size: 1.5rem; transition: color 0.2s;"></i>
                          <i class="fas fa-star star-btn" data-rating="2" style="color: #ddd; cursor: pointer; font-size: 1.5rem; transition: color 0.2s;"></i>
                          <i class="fas fa-star star-btn" data-rating="3" style="color: #ddd; cursor: pointer; font-size: 1.5rem; transition: color 0.2s;"></i>
                          <i class="fas fa-star star-btn" data-rating="4" style="color: #ddd; cursor: pointer; font-size: 1.5rem; transition: color 0.2s;"></i>
                          <i class="fas fa-star star-btn" data-rating="5" style="color: #ddd; cursor: pointer; font-size: 1.5rem; transition: color 0.2s;"></i>
                        </div>
                      </div>
                      <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark);">Votre avis</label>
                        <textarea id="reviewText" rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: 0.5rem; font-family: 'Raleway', sans-serif; resize: vertical;" placeholder="Partagez votre expérience..." required></textarea>
                      </div>
                      <button type="submit" class="btn-primary" style="background: var(--primary-color); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-paper-plane"></i>
                        Publier l'avis
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <!-- Available Sessions Card -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-calendar-alt"></i>
                    Séances Disponibles
                  </h3>
                  <div class="showtime-item" style="background: var(--bg-light); border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                    <div class="showtime-date" style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.25rem; font-family: 'Raleway', sans-serif;">12 au 16 Novembre 2025</div>
                    <div class="showtime-time" style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.75rem; font-family: 'Raleway', sans-serif;">Rabat - Représentations</div>
                    <button class="showtime-btn" onclick="window.handleReservation()" style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; transition: all 0.3s ease; font-family: 'Raleway', sans-serif; cursor: pointer;">
                      <i class="fas fa-ticket-alt"></i>
                      Réserver
                    </button>
                  </div>
                  <div class="showtime-item" style="background: var(--bg-light); border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                    <div class="showtime-date" style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.25rem; font-family: 'Raleway', sans-serif;">17 au 20 Novembre 2025</div>
                    <div class="showtime-time" style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.75rem; font-family: 'Raleway', sans-serif;">Casablanca - Représentations</div>
                    <button class="showtime-btn" onclick="window.handleReservation()" style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; transition: all 0.3s ease; font-family: 'Raleway', sans-serif; cursor: pointer;">
                      <i class="fas fa-ticket-alt"></i>
                      Réserver
                    </button>
                  </div>
                  <div class="showtime-item" style="background: var(--bg-light); border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                    <div class="showtime-date" style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.25rem; font-family: 'Raleway', sans-serif;">Novembre 2025</div>
                    <div class="showtime-time" style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.75rem; font-family: 'Raleway', sans-serif;">Séances supplémentaires</div>
                    <button class="showtime-btn" onclick="window.handleReservation()" style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; transition: all 0.3s ease; font-family: 'Raleway', sans-serif; cursor: pointer;">
                      <i class="fas fa-ticket-alt"></i>
                      Réserver
                    </button>
                  </div>
                </div>

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

                <!-- Author Info Card -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-rocket"></i>
                    Mission spatiale
                  </h3>
                  <p style="color: var(--text-light); font-size: 0.9rem; line-height: 1.6;">Tara nous emmène dans une aventure spatiale extraordinaire où l'imagination n'a pas de limites. Un voyage qui inspire les jeunes explorateurs à rêver grand et à croire en leurs capacités.</p>
                </div>

                ${user && (user.user_metadata?.role === 'teacher_private' || user.user_metadata?.role === 'teacher_public' || user.user_metadata?.role === 'association') ? `
                <!-- Pedagogical Resources Card - Only for Schools -->
                <div class="sidebar-card">
                  <h3>
                    <i class="fas fa-file-pdf"></i>
                    Ressources pédagogiques
                  </h3>
                  <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 1rem;">Téléchargez le dossier pédagogique pour préparer votre classe.</p>
                  <a href="https://edjs.art/assets/dossier%20pres%20edjs%20horaire%20association%20crea%20print%20double%20page.pdf" 
                     target="_blank" 
                     class="btn-outline w-100" 
                     style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">
                    <i class="fas fa-download"></i>
                    Télécharger le dossier PDF
                  </a>
                </div>
                ` : ''}
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

          // Gallery hover effects
          document.addEventListener('DOMContentLoaded', function() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
              const overlay = item.querySelector('.gallery-overlay');
              item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
                overlay.style.opacity = '1';
              });
              item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
                overlay.style.opacity = '0';
              });
            });

            // Star rating functionality
            const starBtns = document.querySelectorAll('.star-btn');
            let selectedRating = 0;
            
            starBtns.forEach((star, index) => {
              star.addEventListener('click', () => {
                selectedRating = index + 1;
                updateStars(selectedRating);
              });
              
              star.addEventListener('mouseenter', () => {
                updateStars(index + 1);
              });
            });
            
            document.querySelector('.star-rating').addEventListener('mouseleave', () => {
              updateStars(selectedRating);
            });
            
            function updateStars(rating) {
              starBtns.forEach((star, index) => {
                if (index < rating) {
                  star.style.color = '#ffc107';
                } else {
                  star.style.color = '#ddd';
                }
              });
            }

            // Review form submission
            document.getElementById('reviewForm').addEventListener('submit', function(e) {
              e.preventDefault();
              const name = document.getElementById('reviewName').value;
              const text = document.getElementById('reviewText').value;
              
              if (selectedRating === 0) {
                alert('Veuillez sélectionner une note');
                return;
              }
              
              alert('Merci pour votre avis ! Il sera publié après modération.');
              this.reset();
              selectedRating = 0;
              updateStars(0);
            });
          });
        </script>
      `
    }} />
  );
}
