import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';


export default function Spectacles() {
  const { user } = useAuth();

  const handleReservation = (spectacleId: string) => {
    if (user) {
      window.location.href = `/reservation-${spectacleId}.html`;
    } else {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?return_url=${returnUrl}`;
    }
  };

  const handleDetails = (spectacleId: string) => {
    window.location.href = `/spectacle-${spectacleId}.html`;
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
      } else {
        if (authGateSection) authGateSection.style.display = 'block';
        if (filterSection) filterSection.style.display = 'none';
        if (spectaclesSection) spectaclesSection.style.display = 'none';
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

      // User dropdown functionality
      const userDropdownBtn = document.getElementById('userDropdownBtn');
      const userDropdownMenu = document.getElementById('userDropdownMenu');
      const logoutBtn = document.getElementById('logoutBtn');

      if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          userDropdownMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
          userDropdownMenu.classList.remove('show');
        });

        userDropdownMenu.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            await supabase.auth.signOut();
            // Force page reload to clear auth state
            window.location.reload();
          } catch (error) {
            console.error('Logout error:', error);
            // Fallback: redirect to auth page
            window.location.href = '/auth';
          }
        });
      }
    };

    // Expose functions to window object for inline event handlers
    (window as any).handleReservation = handleReservation;
    (window as any).handleDetails = handleDetails;

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
            gap: 60px;
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
            gap: 20px;
            align-items: center;
            width: 100%;
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

          /* User Dropdown Styles */
          .user-dropdown {
            position: relative;
          }

          .user-dropdown-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 25px;
            transition: background-color 0.3s ease;
            display: flex;
            align-items: center;
            white-space: nowrap;
          }

          .user-dropdown-btn:hover {
            background-color: rgba(126, 138, 1, 0.1);
          }

          .user-dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 200px;
            z-index: 1000;
            display: none;
            padding: 8px 0;
          }

          .user-dropdown-menu.show {
            display: block;
          }

          .dropdown-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            text-decoration: none;
            color: #333;
            transition: background-color 0.2s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            font-size: 14px;
          }

          .dropdown-item:hover {
            background-color: #f8f9fa;
            color: #333;
          }

          .dropdown-item i {
            margin-right: 8px;
            width: 16px;
            color: #666;
          }

          .dropdown-divider {
            margin: 8px 0;
            border: none;
            border-top: 1px solid #eee;
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
                <a href="https://edjs.art/gallery" class="nav-link">GALERIE</a>
              </li>
              <li class="nav-item">
                <a href="https://edjs.art/partners" class="nav-link">PARTENAIRES</a>
              </li>
              ${user ? `
              <!-- User Dropdown for authenticated users -->
              <li class="nav-item user-dropdown" style="margin-left: auto;">
                <button class="user-dropdown-btn" id="userDropdownBtn">
                  <i class="fas fa-user-circle" style="color: #7e8a01; font-size: 24px; margin-right: 8px;"></i>
                  <span style="color: #333; font-weight: 500;">Bonjour ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'}</span>
                  <i class="fas fa-chevron-down" style="margin-left: 8px; font-size: 12px; color: #666;"></i>
                </button>
                <div class="user-dropdown-menu" id="userDropdownMenu">
                  <a href="/spectacles" class="dropdown-item">
                    <i class="fas fa-theater-masks"></i> Spectacles
                  </a>
                  <a href="/b2c" class="dropdown-item">
                    <i class="fas fa-calendar-alt"></i> Réservations
                  </a>
                  <a href="/profile" class="dropdown-item">
                    <i class="fas fa-user"></i> Profil
                  </a>
                  <a href="/help" class="dropdown-item">
                    <i class="fas fa-question-circle"></i> Aide et support
                  </a>
                  <hr class="dropdown-divider">
                  <button class="dropdown-item logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                  </button>
                </div>
              </li>
              ` : `
              <!-- Auth buttons for non-authenticated users -->
              <li class="nav-item">
                <a href="/auth" class="auth-btn">Se connecter</a>
              </li>
              <li class="nav-item">
                <a href="/auth?mode=register" class="auth-btn">S'inscrire</a>
              </li>
              `}
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
            background-image: url('https://edjs.art/assets/edjs img/bg-header-home-v2.webp');
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

    .auth-option:hover .option-icon i {
      color: #BDCF00;
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
      padding: 12px 30px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .auth-btn:hover {
      background: #a8b800;
      color: white;
      text-decoration: none;
      transform: translateY(-2px);
    }

    .guest-link {
      display: block;
      margin-top: 15px;
      color: #6c757d;
      text-decoration: underline;
      font-size: 0.9rem;
    }

    .guest-link:hover {
      color: #BDCF00;
      text-decoration: none;
    }
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
            padding: 60px 0 0 0;
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


        <!-- Hero Section -->
        <section class="spectacles-hero" style="display: ${user ? 'block' : 'none'};">
          <div class="hero-background"></div>
          <div class="hero-overlay"></div>
          <div class="container">
            <div class="hero-content">
              <h1 class="hero-title">Nos Spectacles</h1>
              <p class="hero-subtitle">Découvrez notre programmation complète d'arts de la scène</p>
            </div>
          </div>
        </section>

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
        <section class="filter-section" id="filterSection" style="display: ${user ? 'block' : 'none'}; background: #f8f9fa; padding: 60px 0 0 0;">
          <div class="container">
            <div class="text-center">
              <h2 class="filter-title" style="color: #333; text-shadow: none;">Nos Spectacles</h2>
              <p class="filter-subtitle" style="color: #666; text-shadow: none;">Découvrez notre programmation complète</p>
              
              <button class="back-btn" id="backBtn" style="display: ${user ? 'none' : 'inline-flex'};">
                <i class="fas fa-arrow-left"></i> Retour
              </button>
            </div>
          </div>
          <!-- Breadcrumb End -->

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
                      <a href="/auth" class="auth-btn" id="professionalLoginBtn">
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
                      <a href="/auth" class="auth-btn login-btn" id="individualLoginBtn">
                        <span>Se connecter</span>
                        <i class="fas fa-users"></i>
                      </a>
                      <a href="/auth-pero" class="guest-link" id="guestAccessBtn" style="color: #666; text-decoration: underline; font-size: 14px; margin-top: 10px; display: inline-block;">
                        Continuer en tant qu'invité
                      </a>
                    </div>
                  </div>
                </div>

                <div class="auth-gate-footer">
                </div>
              </div>
            </div>
          </section>

          <!-- Spectacles Section -->
        <section class="spectacles-grid" id="spectaclesSection">
          <div class="container">
            <div class="row g-4">
              <!-- Le Petit Prince -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #BDCF00; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/le-petit-prince.png" alt="Le Petit Prince" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="/src/assets/spectacles elements/petit prince@4x.png" alt="Le Petit Prince Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Oct 2025</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="color: #000; font-size: 32px; font-weight: 800; margin-bottom: 15px; line-height: 1.2; font-family: 'Amatic SC', cursive; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block;">LE PETIT PRINCE</h3>
                      
                      <!-- Info badges -->
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #BDCF00;"></i>
                            <span>50 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #BDCF00;"></i>
                            <span>7 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: flex-start; gap: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #BDCF00;"></i>
                            <span>3 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-heart" style="color: #BDCF00;"></i>
                            <span>Émotionnel</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 10px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('le-petit-prince')" style="background: #BDCF00; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer; transition: all 0.3s ease;">Réserver</button>
                        <button class="btn-details" onclick="window.handleDetails('le-petit-prince')" style="background: white; color: #2c3e50; border: 2px solid #2c3e50; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer; transition: all 0.3s ease;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Le Petit Prince Arabic -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #BDCF00; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">متاح</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/src/assets/spectacles elements/petite prince.png" alt="الأمير الصغير" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="/src/assets/spectacles elements/petit prince@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Oct 2025</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="color: #000; font-size: 32px; font-weight: 800; margin-bottom: 15px; line-height: 1.2; font-family: 'Amatic SC', cursive; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block;">الأمير الصغير</h3>
                      
                      <!-- Info badges -->
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #BDCF00;"></i>
                            <span>50 دقيقة</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #BDCF00;"></i>
                            <span>7 سنوات وأكثر</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: flex-start; gap: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #BDCF00;"></i>
                            <span>3 ممثلين</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-heart" style="color: #BDCF00;"></i>
                            <span>عاطفي</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; justify-content: flex-start; margin-bottom: 20px;">
                        <button class="btn-reserve" onclick="window.handleReservation('le-petit-prince-ar')" style="background: #BDCF00; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px;">
                          احجز
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('le-petit-prince-ar')" style="background: transparent; color: #BDCF00; padding: 12px 24px; border: 2px solid #BDCF00; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px;">التفاصيل</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tara sur la Lune -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #6f42c1; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/tara-sur-la-lune.png" alt="Tara sur la Lune" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="/src/assets/spectacles elements/tara@4x.png" alt="Tara Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Oct 2025</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="color: #000; font-size: 32px; font-weight: 800; margin-bottom: 15px; line-height: 1.2; font-family: 'Amatic SC', cursive; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block;">TARA SUR LA LUNE</h3>
                      
                      <!-- Info badges -->
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #6f42c1;"></i>
                            <span>45 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #6f42c1;"></i>
                            <span>5 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: flex-start; gap: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #6f42c1;"></i>
                            <span>4 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-star" style="color: #6f42c1;"></i>
                            <span>Interactif</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; justify-content: flex-start; margin-bottom: 20px;">
                        <button class="btn-reserve" onclick="window.handleReservation('tara-sur-la-lune')" style="background: #6f42c1; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('tara-sur-la-lune')" style="background: transparent; color: #6f42c1; padding: 12px 24px; border: 2px solid #6f42c1; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mirath Atfal -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #dc3545; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/mirat@4x.png" alt="Mirath Atfal" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="/src/assets/spectacles elements/estevanico@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Nov 2025</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="color: #000; font-size: 32px; font-weight: 800; margin-bottom: 15px; line-height: 1.2; font-family: 'Amatic SC', cursive; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block;">MIRATH ATFAL</h3>
                      
                      <!-- Info badges -->
                      <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-clock" style="color: #dc3545;"></i>
                            <span>55 minutes</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-child" style="color: #dc3545;"></i>
                            <span>8 ans et +</span>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: flex-start; gap: 10px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-users" style="color: #dc3545;"></i>
                            <span>5 comédiens</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                            <i class="fas fa-heart" style="color: #dc3545;"></i>
                            <span>Culturel</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; justify-content: flex-start; margin-bottom: 20px;">
                        <button class="btn-reserve" onclick="window.handleReservation('mirath-atfal')" style="background: #dc3545; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('estevanico')" style="background: transparent; color: #dc3545; padding: 12px 24px; border: 2px solid #dc3545; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Simple comme bonjour -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #ffc107; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/simple-comme-bonjour.png" alt="Simple comme bonjour" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="https://edjs.art/assets/img/spectacles elements/simple comme bonjour@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Déc 2025</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="font-size: 24px; font-weight: 800; margin: 15px 0; line-height: 1.1; background: white; padding: 6px 12px; border-radius: 8px; display: inline-block; color: #333; white-space: nowrap;">SIMPLE COMME BONJOUR</h3>
                      
                      
                      <!-- Info Badges -->
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: flex-start;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #ffc107;"></i>
                          <span>60 minutes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #ffc107;"></i>
                          <span>6 ans et +</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #ffc107;"></i>
                          <span>3 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-heart" style="color: #ffc107;"></i>
                          <span>Musical</span>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('simple-comme-bonjour')" style="background: #ffc107; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('simple-comme-bonjour')" style="background: transparent; color: #333; padding: 12px 24px; border: 2px solid #333; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Charlotte -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #e91e63; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/charlotte.png" alt="Charlotte" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="https://edjs.art/assets/img/spectacles elements/charlotte@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Janvier 2026</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="font-size: 32px; font-weight: 800; margin: 15px 0; line-height: 1.2; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block; color: #333;">CHARLOTTE</h3>
                      
                      
                      <!-- Info Badges -->
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: flex-start;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #e91e63;"></i>
                          <span>55 minutes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #e91e63;"></i>
                          <span>8 ans et +</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #e91e63;"></i>
                          <span>3 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-heart" style="color: #e91e63;"></i>
                          <span>Émotionnel</span>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('charlotte')" style="background: #e91e63; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('charlotte')" style="background: transparent; color: #e91e63; padding: 12px 24px; border: 2px solid #e91e63; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Estevanico -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #17a2b8; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/estevanico.png" alt="Estevanico" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="https://edjs.art/assets/img/spectacles elements/estevanico@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Février 2026</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="font-size: 32px; font-weight: 800; margin: 15px 0; line-height: 1.2; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block; color: #333;">ESTEVANICO</h3>
                      
                      
                      <!-- Info Badges -->
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: flex-start;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #17a2b8;"></i>
                          <span>50 minutes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #17a2b8;"></i>
                          <span>10 ans et +</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #17a2b8;"></i>
                          <span>4 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-heart" style="color: #17a2b8;"></i>
                          <span>Aventure</span>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('estevanico')" style="background: #17a2b8; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('estevanico')" style="background: transparent; color: #17a2b8; padding: 12px 24px; border: 2px solid #17a2b8; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- L'enfant de l'arbre -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #28a745; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/enfant-de-larbre.png" alt="L'enfant de l'arbre" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="https://edjs.art/assets/img/spectacles elements/larbre@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Mars 2026</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="font-size: 32px; font-weight: 800; margin: 15px 0; line-height: 1.2; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block; color: #333;">L'ENFANT DE L'ARBRE</h3>
                      
                      
                      <!-- Info Badges -->
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: flex-start;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #28a745;"></i>
                          <span>65 minutes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #28a745;"></i>
                          <span>10 ans et +</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #28a745;"></i>
                          <span>2 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-heart" style="color: #28a745;"></i>
                          <span>Nature</span>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('lenfant-de-larbre')" style="background: #28a745; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('lenfant-de-larbre')" style="background: transparent; color: #28a745; padding: 12px 24px; border: 2px solid #28a745; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Antigone -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="college">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #6f42c1; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/antigone.png" alt="Antigone" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="https://edjs.art/assets/img/PION DE CHESS.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Avril 2026</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="font-size: 32px; font-weight: 800; margin: 15px 0; line-height: 1.2; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block; color: #333;">ANTIGONE, SOPHOCLE</h3>
                      
                      
                      <!-- Info Badges -->
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: flex-start;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #6f42c1;"></i>
                          <span>60 minutes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #6f42c1;"></i>
                          <span>12 ans et +</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #6f42c1;"></i>
                          <span>5 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-heart" style="color: #6f42c1;"></i>
                          <span>Tragédie</span>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('antigone')" style="background: #6f42c1; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('antigone')" style="background: transparent; color: #6f42c1; padding: 12px 24px; border: 2px solid #6f42c1; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Alice chez les merveilles -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #e83e8c; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/alice.png" alt="Alice chez les merveilles" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="https://edjs.art/assets/img/spectacles elements/alice@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Mai 2026</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="font-size: 32px; font-weight: 800; margin: 15px 0; line-height: 1.2; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block; color: #333;">ALICE CHEZ LES MERVEILLES</h3>
                      
                      
                      <!-- Info Badges -->
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: flex-start;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #e83e8c;"></i>
                          <span>50 minutes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #e83e8c;"></i>
                          <span>5 ans et +</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #e83e8c;"></i>
                          <span>4 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-heart" style="color: #e83e8c;"></i>
                          <span>Fantastique</span>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('alice-chez-les-merveilles')" style="background: #e83e8c; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('alice-chez-les-merveilles')" style="background: transparent; color: #e83e8c; padding: 12px 24px; border: 2px solid #e83e8c; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">Détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- L'EAU LA -->
              <div class="col-lg-6 col-md-6 spectacle-item" data-category="primaire">
                <div class="spectacle-card fade-in-up visible" style="background: url('https://edjs.art/assets/img/Asset%209@4x.png') center/cover; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; width: 100%; height: 400px; display: flex; transition: all 0.4s ease; position: relative; margin: 20px 0;">
                  <!-- Status Badge -->
                  <div style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                    <div class="spectacle-card__status" style="background: #20c997; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Disponible</div>
                  </div>
                  
                  <!-- Left Side: Affiche -->
                  <div style="width: 50%; height: 100%; position: relative; display: flex; align-items: center; justify-content: flex-start; padding: 20px 5px 20px 60px;">
                    <img src="/assets/img/spectacles/leau-la.png" alt="L'EAU LA" style="width: 150%; height: 120%; object-fit: contain;" />
                    <!-- Character Image -->
                    <img src="/src/assets/spectacles elements/leau@4x.png" alt="Character" style="position: absolute; bottom: 10px; right: -30px; width: 130px; height: 130px; object-fit: contain; z-index: 5;" />
                  </div>
                  
                  <!-- Right Side: Content -->
                  <div style="width: 50%; padding: 25px 80px 25px 5px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 100%; margin-left: 30px;">
                      <!-- Date Badge -->
                      <div style="margin-bottom: 15px;">
                        <div class="spectacle-card__date" style="color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase;">Juin 2026</div>
                      </div>
                      
                      <!-- Title -->
                      <h3 class="spectacle-card__title" style="font-size: 32px; font-weight: 800; margin: 15px 0; line-height: 1.2; background: white; padding: 8px 15px; border-radius: 8px; display: inline-block; color: #333;">L'EAU LA</h3>
                      
                      
                      <!-- Info Badges -->
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; justify-content: flex-start;">
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-clock" style="color: #20c997;"></i>
                          <span>45 minutes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-child" style="color: #20c997;"></i>
                          <span>6 ans et +</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-users" style="color: #20c997;"></i>
                          <span>3 comédiens</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; background: #f8f9fa; padding: 6px 10px; border-radius: 12px; font-size: 11px; color: #666; font-weight: 600;">
                          <i class="fas fa-heart" style="color: #20c997;"></i>
                          <span>Écologique</span>
                        </div>
                      </div>
                      
                      <!-- Buttons -->
                      <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-start;">
                        <button class="btn-reserve" onclick="window.handleReservation('leau-la')" style="background: #20c997; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">
                          Réserver
                        </button>
                        <button class="btn-details" onclick="window.handleDetails('leau-la')" style="background: transparent; color: #20c997; padding: 12px 24px; border: 2px solid #20c997; border-radius: 8px; font-weight: 600; font-size: 14px; min-width: 120px; cursor: pointer;">Détails</button>
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

        <!-- Simple Footer -->
        <footer style="background: #000; color: white; padding: 40px 0 0 0; margin: 0;">
          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <div style="margin-bottom: 20px;">
                  <img src="https://edjs.art/assets/img/Asset%202@4x.png" alt="L'École des jeunes spectateurs" style="height: 60px; width: auto; filter: brightness(0) invert(1);">
                </div>
                <p style="color: #ccc; font-size: 14px; margin-bottom: 15px;">
                  L'École des jeunes spectateurs - Arts de la scène pour tous
                </p>
                <div style="color: #ccc; font-size: 14px;">
                  <div style="margin-bottom: 5px;">
                    <i class="fas fa-phone" style="margin-right: 8px; color: #BDCF00;"></i>
                    +212 5 22 98 10 85
                  </div>
                  <div>
                    <i class="fas fa-envelope" style="margin-right: 8px; color: #BDCF00;"></i>
                    contact@edjs.art
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                  <div style="margin-bottom: 20px;">
                    <h5 style="color: white; font-size: 16px; margin-bottom: 15px;">Navigation</h5>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      <li style="margin-bottom: 8px;"><a href="/" style="color: #ccc; text-decoration: none; font-size: 14px;">Accueil</a></li>
                      <li style="margin-bottom: 8px;"><a href="/spectacles" style="color: #ccc; text-decoration: none; font-size: 14px;">Spectacles</a></li>
                      <li style="margin-bottom: 8px;"><a href="https://edjs.art/gallery.html" style="color: #ccc; text-decoration: none; font-size: 14px;">Galerie</a></li>
                      <li style="margin-bottom: 8px;"><a href="https://edjs.art/contact.html" style="color: #ccc; text-decoration: none; font-size: 14px;">Contact</a></li>
                    </ul>
                  </div>
                  <div style="margin-bottom: 20px;">
                    <h5 style="color: white; font-size: 16px; margin-bottom: 15px;">Suivez-nous</h5>
                    <div style="display: flex; gap: 10px;">
                      <a href="#" style="color: #BDCF00; font-size: 18px;"><i class="fab fa-facebook-f"></i></a>
                      <a href="#" style="color: #BDCF00; font-size: 18px;"><i class="fab fa-linkedin-in"></i></a>
                      <a href="#" style="color: #BDCF00; font-size: 18px;"><i class="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr style="border-color: #333; margin: 30px 0 0 0;">
            <div style="text-align: center; color: #888; font-size: 12px; padding: 20px 0; margin: 0;">
              © 2025 L'École des jeunes spectateurs. Tous droits réservés.
            </div>
          </div>
        </footer>

        <style>
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          html, body {
            height: 100%;
            overflow-x: hidden;
          }
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
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          #root {
            margin: 0 !important;
            padding: 0 !important;
          }
        </style>
      `
    }} />
  );
}
