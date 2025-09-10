import React from 'react';

export default function SpectacleFooter() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
        <div class="vs-footer bg-title">
          <div class="vs-footer__top z-index-common space-extra-top space-extra-bottom">
            <div class="container">
              <div class="row gy-4 gx-xxl-5">
                <div class="col-lg-4 col-md-6 wow animate__fadeInUp" data-wow-delay="0.25s">
                  <div class="vs-footer__widget">
                    <div class="vs-footer__logo text-center text-md-start mb-25">
                      <a href="/" class="vs-logo">
                        <img src="https://edjs.art/assets/img/Asset 2@4x.png" alt="L'École des jeunes spectateurs" style="height: 160px; width: auto; max-width: none !important;">
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
                        <li><a href="https://edjs.ma/">Accueil</a></li>
                        <li><a href="/spectacles">Spectacles</a></li>
                        <li><a href="https://edjs.ma/gallery.html">Galerie</a></li>
                        <li><a href="https://edjs.ma/partners.html">Partenaires</a></li>
                        <li><a href="https://edjs.ma/contact.html">Contact</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 wow animate__fadeInUp" data-wow-delay="0.45s">
                  <div class="vs-footer__widget">
                    <h3 class="vs-footer__title" style="color: #cccccc;">GALERIE</h3>
                    <div class="sidebar-gallery" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Les_Trois_Brigands_Web_026.jpg" alt="GALERIE Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Les_Trois_Brigands_Web_026.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Casse-Noisette_Web_007.jpg" alt="GALERIE Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Casse-Noisette_Web_007.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Le_Petit_Prince_Web_032.jpg" alt="GALERIE Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Le_Petit_Prince_Web_032.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Gretel_Hansel_Web_023.jpg" alt="GALERIE Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Gretel_Hansel_Web_023.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Dans_la_peau_de_Cyrano_Web_016.jpg" alt="GALERIE Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <a href="https://edjs.art/assets/img/Dans_la_peau_de_Cyrano_Web_016.jpg" class="popup-image gal-btn"><i class="fal fa-plus" style="color: white;"></i></a>
                      </div>
                      <div class="gallery-thumb" style="aspect-ratio: 1; overflow: hidden;">
                        <img src="https://edjs.art/assets/img/Tara_Sur_La_Lune_Web_012.jpg" alt="GALERIE Image" style="width: 100%; height: 100%; object-fit: cover;">
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
                    Copyright © <span id="currentYear">2024</span>
                    <a href="https://edjs.ma/">L'École des jeunes spectateurs</a>. Tous droits réservés.
                  </p>
                </div>
                <div class="col-md-auto">
                  <ul class="vs-footer__bottom--menu">
                    <li><a href="https://edjs.ma/contact.html">Conditions Générales</a></li>
                    <li><a href="https://edjs.ma/contact.html">Politique de Confidentialité</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>
          .vs-footer {
            background: #2c3e50;
            color: white;
          }
          
          .bg-title {
            background: #2c3e50 !important;
          }
          
          .space-extra-top {
            padding-top: 60px;
          }
          
          .space-extra-bottom {
            padding-bottom: 40px;
          }
          
          .vs-footer__widget {
            margin-bottom: 30px;
          }
          
          .vs-footer__logo {
            display: block;
          }
          
          .vs-footer__desc {
            color: white;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          
          .icon-call {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .icon-call__icon {
            color: #BDCF00;
            font-size: 1.5rem;
          }
          
          .icon-call__title {
            display: block;
            color: #bdc3c7;
            font-size: 0.9rem;
            text-transform: lowercase;
          }
          
          .icon-call__number {
            color: white;
            text-decoration: none;
            font-weight: 600;
          }
          
          .social-style {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .social-style__label {
            color: #bdc3c7;
            margin-right: 10px;
          }
          
          .social-style a {
            color: #BDCF00;
            font-size: 1.2rem;
            transition: color 0.3s ease;
          }
          
          .social-style a:hover {
            color: #D4E157;
          }
          
          .vs-footer__title {
            color: #cccccc;
            margin-bottom: 20px;
            font-size: 1.2rem;
            font-weight: 600;
          }
          
          .vs-footer__menu--list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .vs-footer__menu--list li {
            margin-bottom: 10px;
          }
          
          .vs-footer__menu--list a {
            color: #bdc3c7;
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .vs-footer__menu--list a:hover {
            color: #BDCF00;
          }
          
          .sidebar-gallery .gallery-thumb {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .sidebar-gallery .gallery-thumb img {
            transition: transform 0.3s ease;
          }
          
          .sidebar-gallery .gallery-thumb:hover img {
            transform: scale(1.1);
          }
          
          .popup-image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .gallery-thumb:hover .popup-image {
            opacity: 1;
          }
          
          .bg-theme-color-1 {
            background: #1a252f !important;
          }
          
          .vs-footer__bottom {
            padding: 20px 0;
          }
          
          .vs-footer__copyright {
            color: white;
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
            gap: 20px;
          }
          
          .vs-footer__bottom--menu a {
            color: #bdc3c7;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
          }
          
          .vs-footer__bottom--menu a:hover {
            color: #BDCF00;
          }
          
          @media (max-width: 768px) {
            .vs-footer__widget {
              text-align: center;
            }
            
            .icon-call {
              justify-content: center;
            }
            
            .social-style {
              justify-content: center;
            }
            
            .vs-footer__bottom .row {
              flex-direction: column-reverse;
              gap: 15px;
              text-align: center;
            }
            
            .vs-footer__bottom--menu {
              justify-content: center;
              flex-wrap: wrap;
            }
          }
        </style>
        
        <script>
          // Set current year
          document.getElementById('currentYear').textContent = new Date().getFullYear();
        </script>
      `
    }} />
  );
}
