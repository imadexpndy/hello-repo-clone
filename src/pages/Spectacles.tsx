import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';


export default function Spectacles() {
  const { user } = useAuth();

  const handleReservation = (spectacleId: string) => {
    if (user) {
      window.location.href = `/reservation/${spectacleId}`;
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  useEffect(() => {
    // Expose handleReservation to global window object for inline handlers
    (window as any).handleReservation = handleReservation;

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

    // Initialize JavaScript functionality after DOM is ready
    const initializeSpectacles = () => {
      const professionalBtn = document.getElementById('professionalLoginBtn');
      const individualBtn = document.getElementById('individualLoginBtn');
      const backBtn = document.getElementById('backBtn');
      const authGateSection = document.getElementById('authGateSection');
      const filterSection = document.getElementById('filterSection');
      const spectaclesSection = document.getElementById('spectaclesSection');

      // Show spectacles directly if user is authenticated
      if (user) {
        if (authGateSection) authGateSection.style.display = 'none';
        if (filterSection) filterSection.style.display = 'block';
        if (spectaclesSection) spectaclesSection.style.display = 'block';
      }

      // Professional login button
      if (professionalBtn) {
        professionalBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const returnUrl = encodeURIComponent(window.location.href);
          window.location.href = `/auth?return_url=${returnUrl}`;
        });
      }

      // Individual login button
      if (individualBtn) {
        individualBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const returnUrl = encodeURIComponent(window.location.href);
          window.location.href = `/auth?return_url=${returnUrl}`;
        });
      }

      // Back button
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          if (authGateSection) authGateSection.style.display = 'block';
          if (filterSection) filterSection.style.display = 'none';
          if (spectaclesSection) spectaclesSection.style.display = 'none';
        });
      }
    };

    // Expose handleReservation to window object for inline event handlers
    (window as any).handleReservation = handleReservation;

    setTimeout(initializeSpectacles, 100);
  }, [user]);

  return (
    <div dangerouslySetInnerHTML={{
      __html: `
        <!-- EDJS Header -->
        <style>
          /* Modern Header Styles */
          .modern-header {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            position: sticky;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
          }

          .modern-header.scrolled {
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
          }

          .header-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 15px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .logo-section img {
            height: 80px;
            width: auto;
            transition: transform 0.3s ease;
          }

          .logo-section img:hover {
            transform: scale(1.05);
          }

          .nav-menu {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 40px;
            align-items: center;
          }

          .nav-item {
            position: relative;
          }

          .nav-link {
            text-decoration: none;
            color: #2c3e50;
            font-family: 'Amatic SC', cursive;
            font-weight: 700;
            font-size: 26px;
            padding: 12px 20px;
            border-radius: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .nav-link:hover {
            background: #BDCF00;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(189, 207, 0, 0.3);
          }

          .auth-section {
            display: flex;
            gap: 15px;
            align-items: center;
          }

          .auth-btn {
            padding: 15px 30px;
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            font-family: 'Amatic SC', cursive;
            font-weight: 700;
            font-size: 18px;
            text-decoration: none;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border: none;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px rgba(189, 207, 0, 0.3);
            position: relative;
            overflow: hidden;
            background: #BDCF00;
            color: white;
          }

          .auth-btn:hover {
            background: #a8b800;
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 25px rgba(189, 207, 0, 0.5);
          }

          .mobile-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: #2c3e50;
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .nav-menu {
              display: none;
            }
            .mobile-toggle {
              display: block;
            }
            .header-container {
              padding: 10px 20px;
            }
            .logo-section img {
              height: 60px;
            }
          }
        </style>

        <header class="modern-header" id="main-header">
          <div class="header-container">
            <!-- Logo Section -->
            <div class="logo-section">
              <a href="https://edjs.art/">
                <img src="https://edjs.art/assets/img/edjs%20logo%20black@4x.png" alt="L'École des jeunes spectateurs" class="logo">
              </a>
            </div>

            <!-- Navigation Menu -->
            <nav class="nav-menu">
              <li class="nav-item">
                <a href="https://edjs.art/" class="nav-link">QUI SOMMES NOUS</a>
              </li>
              <li class="nav-item">
                <a href="/spectacles" class="nav-link">SPECTACLES</a>
              </li>
              <li class="nav-item">
                <a href="https://edjs.art/gallery.html" class="nav-link">GALERIE</a>
              </li>
              <li class="nav-item">
                <a href="https://edjs.art/partners.html" class="nav-link">PARTENAIRES</a>
              </li>
              <li class="nav-item">
                <a href="/auth" class="auth-btn">Se connecter</a>
              </li>
              <li class="nav-item">
                <a href="/auth?mode=register" class="auth-btn">S'inscrire</a>
              </li>
            </nav>

            <!-- Auth Section -->
            <div class="auth-section">
              <!-- Mobile Menu Toggle -->
              <button class="mobile-toggle" id="mobileMenuToggle">
                <i class="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </header>

        <style>
          /* Exact CSS from original spectacles.html */
          body { background-color: #f8f9fa; font-family: 'Raleway', sans-serif; }
          
          .spectacles-hero {
            padding: 120px 0 80px;
            position: relative;
            overflow: hidden;
            min-height: 500px;
            display: flex;
            align-items: center;
          }

          .hero-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://edjs.art/assets/img/rooms/room-video-bg.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 1;
          }

          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2;
          }

          .hero-content {
            text-align: center;
            color: white;
            position: relative;
            z-index: 3;
          }

          .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            font-family: 'Amatic SC', cursive;
            margin-bottom: 20px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }

          .hero-subtitle {
            font-size: 1.2rem;
            margin-bottom: 40px;
            color: white;
            opacity: 0.95;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          }

          /* Authentication Gate Styles */
          .auth-gate-section {
            padding: 80px 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          }

          .auth-gate-wrapper {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
          }

          .auth-gate-header {
            margin-bottom: 50px;
          }

          .auth-gate-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 15px;
          }

          .auth-gate-subtitle {
            font-size: 1.1rem;
            color: #6c757d;
            margin-bottom: 30px;
          }

          .auth-gate-divider {
            width: 80px;
            height: 4px;
            background: #BDCF00;
            margin: 0 auto;
            border-radius: 2px;
          }

          .auth-gate-options {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 40px;
            flex-wrap: wrap;
          }

          .auth-option {
            background: white;
            border: 3px solid #e9ecef;
            border-radius: 20px;
            padding: 40px 30px;
            width: 320px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          }

          .auth-option:hover {
            transform: translateY(-8px);
            border-color: #BDCF00;
            box-shadow: 0 15px 40px rgba(189, 207, 0, 0.2);
          }

          .option-icon {
            margin-bottom: 20px;
          }

          .option-icon i {
            font-size: 3rem;
            color: #BDCF00;
            transition: color 0.3s ease;
          }

          .option-content h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .option-content p {
            font-size: 1rem;
            color: #6c757d;
            margin-bottom: 25px;
          }

          .auth-btn {
            background: #BDCF00;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 1rem;
            text-decoration: none;
          }

          .auth-btn:hover {
            background: #a8b800;
            transform: translateY(-2px);
            color: white;
          }

          /* Filter Section */
          .filter-section {
            padding: 60px 0 40px;
            background: white;
          }

          .filter-title {
            font-size: 2.2rem;
            color: #2c3e50;
            margin-bottom: 15px;
            font-family: 'Amatic SC', cursive;
            font-weight: 700;
          }

          .filter-subtitle {
            color: #BDCF00;
            font-size: 1.1rem;
            margin-bottom: 40px;
          }

          .back-btn {
            background: #BDCF00;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .back-btn:hover {
            background: #a8b800;
            transform: translateY(-2px);
          }

          /* Spectacles Grid */
          .spectacles-grid {
            padding: 40px 0 80px;
            background: #f8f9fa;
            display: ${user ? 'block' : 'none'};
          }

          .spectacle-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            width: 100%;
            height: 400px;
            display: flex !important;
            transition: all 0.4s ease;
            position: relative;
            margin: 20px 0;
          }

          .spectacle-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          }

          .spectacle-card__status {
            position: absolute;
            top: 15px;
            right: 15px;
            z-index: 10;
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 10px;
          }

          .spectacle-card__date {
            color: #999;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 15px;
            clear: both;
            position: relative;
            z-index: 5;
          }

          .spectacle-card__title {
            color: #2c3e50;
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 15px;
            line-height: 1.2;
            font-family: 'Amatic SC', cursive;
          }

          .spectacle-card__description {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 20px;
          }

          .btn-reserve {
            background: #BDCF00;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-reserve:hover {
            background: #9BB800;
            transform: translateY(-2px);
          }

          .btn-details {
            background: white;
            color: #2c3e50;
            border: 2px solid #2c3e50;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-details:hover {
            background: #2c3e50;
            color: white;
          }

          @media (max-width: 768px) {
            .hero-title { font-size: 2.2rem !important; }
            .auth-gate-options { flex-direction: column; align-items: center; gap: 25px; }
            .auth-option { width: 100%; max-width: 350px; }
            .spectacle-card { height: auto !important; flex-direction: column !important; }
            .spectacle-card > div:first-child { width: 100% !important; height: 200px !important; }
            .spectacle-card > div:last-child { width: 100% !important; }
          }
        </style>


        <!-- Authentication Gate Section -->
        <section class="auth-gate-section" id="authGateSection" style="display: ${user ? 'none' : 'block'};">
          <div class="container">
            <div class="auth-gate-wrapper">
              <div class="auth-gate-header">
                <h2 class="auth-gate-title">Je réserve mon spectacle</h2>
                <p class="auth-gate-subtitle">Choisissez votre profil et réservez en quelques clics !</p>
                <div class="auth-gate-divider"></div>
              </div>

              <div class="auth-gate-options">
                <div class="auth-option professional">
                  <div class="option-icon">
                    <i class="fas fa-building"></i>
                  </div>
                  <div class="option-content">
                    <h3>Professionnel</h3>
                    <p>Écoles privées, écoles publiques, associations</p>
                    <a href="#" class="auth-btn" id="professionalLoginBtn">
                      <span>Se connecter</span>
                      <i class="fas fa-sign-in-alt"></i>
                    </a>
                  </div>
                </div>

                <div class="auth-option guest">
                  <div class="option-icon">
                    <i class="fas fa-eye"></i>
                  </div>
                  <div class="option-content">
                    <h3>PARTICULIER</h3>
                    <p>Parents, familles, amis, amoureux du théâtre</p>
                    <a href="#" class="auth-btn login-btn" id="individualLoginBtn">
                      <span>Se connecter</span>
                      <i class="fas fa-users"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Filter Section -->
        <section class="filter-section" id="filterSection" style="display: ${user ? 'block' : 'none'}; background-image: url('https://edjs.art/assets/edjs img/bg-header-home-v2.webp'); background-size: cover; background-position: center; background-repeat: no-repeat; padding: 60px 0;">
          <div class="container">
            <div class="text-center">
              <h2 class="filter-title" style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">Nos Spectacles</h2>
              <p class="filter-subtitle" style="color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">Découvrez notre programmation complète</p>
              
              <button class="back-btn" id="backBtn" style="display: ${user ? 'none' : 'inline-flex'};">
                <i class="fas fa-arrow-left"></i> Retour
              </button>
            </div>
          </div>
        </section>

        <!-- Spectacles Grid -->
        <section class="spectacles-grid" id="spectaclesSection">
          <div class="container">
            <div class="row g-4">
              <!-- Le Petit Prince -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #BDCF00;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/affiche LPP VF .jpeg" alt="Le Petit Prince" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/petit prince@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Oct 2025</div>
                      </div>
                      
                      <h3 class="spectacle-card__title">LE PETIT PRINCE</h3>
                      
                      <p class="spectacle-card__description">Un voyage poétique et philosophique à travers l'univers du Petit Prince, explorant les thèmes de l'amitié, de l'amour et de la sagesse.</p>
                      
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #BDCF00;"></i>
                            <span>50 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #BDCF00;"></i>
                            <span>7 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #BDCF00;"></i>
                            <span>3 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-heart" style="color: #BDCF00;"></i>
                            <span>Émotionnel</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn-reserve" onclick="window.handleReservation('le-petit-prince')">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-le-petit-prince'">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Le Petit Prince (Arabic) -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #BDCF00;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/contrat TARA SUR LA LUNE.jpeg" alt="الأمير الصغير" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/petit prince@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Oct 2025</div>
                      </div>
                      
                      <h3 class="spectacle-card__title">الأمير الصغير</h3>
                      
                      <p class="spectacle-card__description">رحلة شاعرية وفلسفية عبر عالم الأمير الصغير، تستكشف موضوعات الصداقة والحب والحكمة.</p>
                      
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #BDCF00;"></i>
                            <span>50 دقيقة</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #BDCF00;"></i>
                            <span>7 سنوات فما فوق</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #BDCF00;"></i>
                            <span>3 ممثلين</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-language" style="color: #BDCF00;"></i>
                            <span>عربي</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn-reserve" onclick="window.handleReservation('le-petit-prince-ar')">
                          ${user ? 'احجز' : 'احجز'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-le-petit-prince'">التفاصيل</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tara sur la Lune -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #6f42c1;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/spectacles/tara-sur-la-lune.png" alt="Tara sur la Lune Affiche" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/tara@4x.png" alt="Tara Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Oct 2025</div>
                      </div>
                      
                      <h3 class="spectacle-card__title">TARA SUR LA LUNE</h3>
                      
                      <p class="spectacle-card__description">Une aventure spatiale extraordinaire qui emmène les enfants dans un voyage magique vers la lune, stimulant leur imagination et leur curiosité.</p>
                      
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #6f42c1;"></i>
                            <span>45 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #6f42c1;"></i>
                            <span>5 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #6f42c1;"></i>
                            <span>4 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-star" style="color: #6f42c1;"></i>
                            <span>Interactif</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn-reserve" onclick="window.handleReservation('tara-sur-la-lune')" style="background: #6f42c1;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-tara-sur-la-lune'">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mirath Atfal -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #dc3545;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/Affiche Mirath Atfal portrait FR.jpg" alt="Mirath Atfal" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/estevanico@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Nov 2025</div>
                      </div>
                      
                      <h3 class="spectacle-card__title">MIRATH ATFAL</h3>
                      
                      <p class="spectacle-card__description">Une découverte culturelle et aventure historique passionnante qui plonge les enfants dans l'héritage arabe et les traditions ancestrales.</p>
                      
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #17a2b8;"></i>
                            <span>55 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #17a2b8;"></i>
                            <span>8 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #17a2b8;"></i>
                            <span>5 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-globe" style="color: #17a2b8;"></i>
                            <span>Culturel</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn-reserve" onclick="window.handleReservation('estevanico')" style="background: #17a2b8;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-estevanico'">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Simple comme bonjour -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #ffc107;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/spectacles/simple.png" alt="Simple comme bonjour" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/simple comme bonjour@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Déc 2025</div>
                      </div>
                      
                      <h3 class="spectacle-card__title">SIMPLE COMME BONJOUR</h3>
                      
                      <p class="spectacle-card__description">Un spectacle musical joyeux et interactif qui célèbre la simplicité de la vie et l'importance des petits bonheurs quotidiens.</p>
                      
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #ffc107;"></i>
                            <span>60 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #ffc107;"></i>
                            <span>6 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #ffc107;"></i>
                            <span>2 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-music" style="color: #ffc107;"></i>
                            <span>Musical</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn-reserve" onclick="window.handleReservation('simple-comme-bonjour')" style="background: #ffc107;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-simple-comme-bonjour'">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Charlotte -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #e91e63;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/spectacles/charlotte.png" alt="Charlotte" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/charlotte@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Janvier 2026</div>
                      </div>
                      
                      <h3 class="spectacle-card__title">CHARLOTTE</h3>
                      
                      <p class="spectacle-card__description">Une histoire touchante de Charlotte découvrant l'amitié, l'empathie et la force des liens humains dans un monde plein de défis.</p>
                      
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #e91e63;"></i>
                            <span>55 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #e91e63;"></i>
                            <span>8 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #e91e63;"></i>
                            <span>3 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 8px 12px; border-radius: 12px; font-size: 12px; color: #666; font-weight: 600;">
                            <i class="fas fa-heart" style="color: #e91e63;"></i>
                            <span>Émouvant</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn-reserve" onclick="window.handleReservation('charlotte')" style="background: #e91e63;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-charlotte'">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Estevanico -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 20px; right: 20px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #17a2b8; padding: 8px 16px; border-radius: 20px; font-size: 12px;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/spectacles/estavine.png" alt="Estevanico" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/estevanico@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Février 2026</div>
                      </div>
                      
                      <h3 class="spectacle-card__title" style="font-size: 28px; margin-bottom: 10px; line-height: 1.1;">ESTEVANICO</h3>
                      
                      <p class="spectacle-card__description" style="font-size: 12px; line-height: 1.4; margin-bottom: 15px; height: 34px; overflow: hidden;">Histoire fascinante épique d'Estevanico,<br>explorateur courageux intrépide et aventurier.</p>
                      
                      <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #17a2b8;"></i>
                          <span>50 min</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #17a2b8;"></i>
                          <span>10 ans+</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #17a2b8;"></i>
                          <span>4 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-compass" style="color: #17a2b8;"></i>
                          <span>Aventure</span>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 15px;">
                        <button class="btn-reserve" onclick="window.handleReservation('estevanico')" style="flex: 1; background: #17a2b8; padding: 12px 20px; border-radius: 10px;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-estevanico'" style="padding: 12px 20px; border-radius: 10px;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- L'enfant de l'arbre -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 20px; right: 20px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #28a745; padding: 8px 16px; border-radius: 20px; font-size: 12px;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/spectacles/enfant de l'arbre.png" alt="L'enfant de l'arbre" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/larbre@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 40px;">
                        <div class="spectacle-card__date">Mars 2026</div>
                      </div>
                      
                      <h3 class="spectacle-card__title" style="font-size: 28px; margin-bottom: 10px; line-height: 1.1;">L'ENFANT DE L'ARBRE</h3>
                      
                      <p class="spectacle-card__description" style="font-size: 12px; line-height: 1.4; margin-bottom: 15px; height: 34px; overflow: hidden;">Fable poétique sur la relation<br>entre l'enfant et la nature.</p>
                      
                      <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #28a745;"></i>
                          <span>1h05 min</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #28a745;"></i>
                          <span>10 ans+</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #28a745;"></i>
                          <span>2 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-tree" style="color: #28a745;"></i>
                          <span>Nature</span>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 15px;">
                        <button class="btn-reserve" onclick="window.handleReservation('lenfant-de-larbre')" style="flex: 1; background: #28a745; padding: 12px 20px; border-radius: 10px;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-lenfant-de-larbre'" style="padding: 12px 20px; border-radius: 10px;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Antigone -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="college">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 20px; right: 20px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #6f42c1; padding: 8px 16px; border-radius: 20px; font-size: 12px;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/spectacles/antigone.png" alt="Antigone" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/PION DE CHESS.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Avril 2026</div>
                      </div>
                      
                      <h3 class="spectacle-card__title" style="font-size: 28px; margin-bottom: 10px; line-height: 1.1;">ANTIGONE, SOPHOCLE</h3>
                      
                      <p class="spectacle-card__description" style="font-size: 12px; line-height: 1.4; margin-bottom: 15px; height: 34px; overflow: hidden;">Tragédie intemporelle de Sophocle<br>adaptée pour jeunes.</p>
                      
                      <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #6f42c1;"></i>
                          <span>60 min</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #6f42c1;"></i>
                          <span>12 ans+</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #6f42c1;"></i>
                          <span>5 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-theater-masks" style="color: #6f42c1;"></i>
                          <span>Tragédie</span>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 15px;">
                        <button class="btn-reserve" onclick="window.handleReservation('antigone')" style="flex: 1; background: #6f42c1; padding: 12px 20px; border-radius: 10px;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-antigone'" style="padding: 12px 20px; border-radius: 10px;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Alice chez les merveilles -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible">
                  <div style="position: absolute; top: 20px; right: 20px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #e83e8c; padding: 8px 16px; border-radius: 20px; font-size: 12px;">Disponible</div>
                  </div>
                  
                  <div style="width: 50%; height: 100%; position: relative; overflow: hidden; background: url('https://edjs.art/assets/img/Asset 9@4x.png') center/cover, linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); display: flex; align-items: center; justify-content: center;">
                    <img src="https://edjs.art/assets/img/spectacles/alice chez le .png" alt="Alice chez les merveilles" style="width: 70%; height: 70%; object-fit: contain; padding: 10px;" />
                    <img src="https://edjs.art/assets/img/spectacles elements/alice@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: 10px; width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));" />
                  </div>
                  
                  <div style="width: 50%; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 100%;">
                      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 25px;">
                        <div class="spectacle-card__date">Mai 2026</div>
                      </div>
                      
                      <h3 class="spectacle-card__title" style="font-size: 28px; margin-bottom: 10px; line-height: 1.1;">ALICE CHEZ LES MERVEILLES</h3>
                      
                      <p class="spectacle-card__description" style="font-size: 12px; line-height: 1.4; margin-bottom: 15px; height: 34px; overflow: hidden;">Adaptation moderne du classique<br>de Carroll surprenante.</p>
                      
                      <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #e83e8c;"></i>
                          <span>50 min</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #e83e8c;"></i>
                          <span>5 ans+</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #e83e8c;"></i>
                          <span>4 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #666; font-weight: 600;">
                          <i class="fas fa-magic" style="color: #e83e8c;"></i>
                          <span>Fantastique</span>
                        </div>
                      </div>
                      
                      <div style="display: flex; gap: 15px;">
                        <button class="btn-reserve" onclick="window.handleReservation('alice-chez-les-merveilles')" style="flex: 1; background: #e83e8c; padding: 12px 20px; border-radius: 10px;">
                          ${user ? 'Réserver maintenant' : 'Réserver'}
                        </button>
                        <button class="btn-details" onclick="window.location.href='/spectacle-alice-chez-les-merveilles'" style="padding: 12px 20px; border-radius: 10px;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        <script>
          // Make handleReservation available globally
          window.handleReservation = function(spectacleId) {
            console.log('handleReservation called with:', spectacleId);
            ${user ? `
              console.log('User is authenticated, redirecting to reservation');
              window.location.href = '/reservation/' + spectacleId;
            ` : `
              console.log('User not authenticated, redirecting to auth');
              const returnUrl = encodeURIComponent(window.location.href);
              window.location.href = '/auth?return_url=' + returnUrl;
            `}
          };
          
          // Ensure function is available immediately
          console.log('handleReservation function set up:', typeof window.handleReservation);
        </script>

        <!-- EDJS Footer -->
        <div class="vs-footer bg-title">
          <div class="vs-footer__top z-index-common space-extra-top space-extra-bottom">
            <div class="container">
              <div class="row gy-4 gx-5">
                <div class="col-lg-4 col-md-6 wow animate__fadeInUp" data-wow-delay="0.25s">
                  <div class="vs-footer__widget">
                    <div class="vs-footer__logo text-center text-md-start mb-25">
                      <a href="https://edjs.art/" class="vs-logo">
                        <img src="https://edjs.art/assets/img/Asset%202@4x.png" alt="L'École du jeune spectateur" style="height: 80px; width: auto; max-width: none !important;">
                      </a>
                    </div>
                    <p class="vs-footer__desc text-center text-md-start" style="color: white;">
                      Chaque élève a l'opportunité de découvrir et d'explorer la richesse des arts de la scène à travers la danse, le théâtre et la musique, qui sont au cœur de notre programme.
                    </p>
                    <div class="icon-call justify-content-center justify-content-md-start pt-10 mb-10">
                      <span class="icon-call__icon"><i class="fa-solid fa-phone-rotary"></i></span>
                      <div class="icon-call__content">
                        <span class="icon-call__title">support téléphonique</span>
                        <a href="tel:+212522981085" class="icon-call__number">+212 5 22 98 10 85</a>
                      </div>
                    </div>
                    <div class="social-style social-style--version2 w-100 justify-content-center justify-content-md-start pt-25">
                      <span class="social-style__label">suivez-nous :</span>
                      <a href="#"><i class="fab fa-facebook-f"></i></a>
                      <a href="#"><i class="fab fa-linkedin-in"></i></a>
                      <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 wow animate__fadeInUp" data-wow-delay="0.35s">
                  <div class="vs-footer__widget">
                    <h3 class="vs-footer__title" style="color: #cccccc;">Navigation</h3>
                    <div class="vs-footer__menu">
                      <ul class="vs-footer__menu--list">
                        <li><a href="https://edjs.art/">Accueil</a></li>
                        <li><a href="/spectacles">Spectacles</a></li>
                        <li><a href="https://edjs.art/gallery.html">Galerie</a></li>
                        <li><a href="https://edjs.art/partners.html">Partenaires</a></li>
                        <li><a href="https://edjs.art/contact.html">Contact</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 wow animate__fadeInUp" data-wow-delay="0.45s">
                  <div class="vs-footer__widget">
                    <h3 class="vs-footer__title" style="color: #cccccc;">Gallery</h3>
                    <div class="sidebar-gallery" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Les_Trois_Brigands_Web_026.jpg" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Les_Trois_Brigands_Web_026.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Casse-Noisette_Web_007.jpg" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Casse-Noisette_Web_007.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Le_Petit_Prince_Web_032.jpg" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Le_Petit_Prince_Web_032.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Gretel_Hansel_Web_023.jpg" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Gretel_Hansel_Web_023.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Dans_la_peau_de_Cyrano_Web_016.jpg" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Dans_la_peau_de_Cyrano_Web_016.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Tara_Sur_La_Lune_Web_012.jpg" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Tara_Sur_La_Lune_Web_012.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="vs-footer__bottom bg-theme-color-1">
            <div class="container">
              <div class="row gy-3 gx-5 align-items-center justify-content-center justify-content-lg-between flex-column-reverse flex-lg-row">
                <div class="col-md-auto">
                  <p class="vs-footer__copyright mb-0" style="color: white;">
                    Copyright © <span id="currentYear">2025</span>
                    <a href="https://edjs.art/">L'École des jeunes spectateurs</a>. Tous droits réservés.
                  </p>
                </div>
                <div class="col-md-auto">
                  <ul class="vs-footer__bottom--menu">
                    <li><a href="https://edjs.art/contact.html">Conditions Générales</a></li>
                    <li><a href="https://edjs.art/contact.html">Politique de Confidentialité</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>
          /* Footer Styles */
          .vs-footer {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
          }
          
          .vs-footer__top {
            padding: 80px 0 60px;
          }
          
          .vs-footer__widget {
            margin-bottom: 30px;
          }
          
          .vs-footer__logo img {
            filter: brightness(0) invert(1);
          }
          
          .vs-footer__desc {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          
          .icon-call {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .icon-call__icon {
            width: 50px;
            height: 50px;
            background: #BDCF00;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
          }
          
          .icon-call__content {
            flex: 1;
          }
          
          .icon-call__title {
            display: block;
            font-size: 14px;
            color: #bbb;
            margin-bottom: 5px;
          }
          
          .icon-call__number {
            font-size: 18px;
            font-weight: 600;
            color: white;
            text-decoration: none;
          }
          
          .social-style {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .social-style__label {
            font-size: 16px;
            font-weight: 600;
            margin-right: 10px;
          }
          
          .social-style a {
            width: 40px;
            height: 40px;
            background: #BDCF00;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          
          .social-style a:hover {
            background: #a8b800;
            transform: translateY(-2px);
          }
          
          .vs-footer__title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 30px;
            color: #BDCF00;
          }
          
          .vs-footer__menu--list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .vs-footer__menu--list li {
            margin-bottom: 12px;
          }
          
          .vs-footer__menu--list a {
            color: #bbb;
            text-decoration: none;
            font-size: 16px;
            transition: color 0.3s ease;
          }
          
          .vs-footer__menu--list a:hover {
            color: #BDCF00;
          }
          
          .gallery-thumb {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .gallery-thumb .gal-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: rgba(189, 207, 0, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .gallery-thumb:hover .gal-btn {
            opacity: 1;
          }
          
          .vs-footer__bottom {
            background: #1a252f;
            padding: 20px 0;
          }
          
          .vs-footer__copyright {
            font-size: 14px;
          }
          
          .vs-footer__copyright a {
            color: #BDCF00;
            text-decoration: none;
          }
          
          .vs-footer__bottom--menu {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: 30px;
          }
          
          .vs-footer__bottom--menu a {
            color: #bbb;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
          }
          
          .vs-footer__bottom--menu a:hover {
            color: #BDCF00;
          }
          
          @media (max-width: 768px) {
            .vs-footer__top {
              padding: 60px 0 40px;
            }
            
            .social-style {
              justify-content: center;
            }
            
            .vs-footer__bottom--menu {
              flex-direction: column;
              gap: 15px;
              text-align: center;
            }
          }
        </style>
      `
    }} />
  );
}
