import React from 'react';

export default function SpectacleFooter() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
        <footer class="vs-footer" style="background: #2c3e50; color: white; padding: 60px 0 20px;">
          <div class="container">
            <div class="vs-footer__top" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px;">
              <!-- About Section -->
              <div class="footer-widget">
                <h3 style="color: #BDCF00; margin-bottom: 20px; font-size: 1.2rem; font-weight: 600;">À propos d'EDJS</h3>
                <p style="color: #bdc3c7; line-height: 1.6; margin-bottom: 20px;">
                  École de Jeunes Spectateurs - Nous créons des spectacles éducatifs et divertissants pour éveiller l'imagination des enfants et transmettre des valeurs importantes.
                </p>
                <div class="social-style" style="display: flex; gap: 15px;">
                  <a href="#" style="color: #BDCF00; font-size: 1.2rem; transition: color 0.3s ease;">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" style="color: #BDCF00; font-size: 1.2rem; transition: color 0.3s ease;">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a href="#" style="color: #BDCF00; font-size: 1.2rem; transition: color 0.3s ease;">
                    <i class="fab fa-youtube"></i>
                  </a>
                  <a href="#" style="color: #BDCF00; font-size: 1.2rem; transition: color 0.3s ease;">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>

              <!-- Quick Links -->
              <div class="footer-widget">
                <h3 style="color: #BDCF00; margin-bottom: 20px; font-size: 1.2rem; font-weight: 600;">Liens rapides</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 10px;">
                    <a href="/spectacles" style="color: #bdc3c7; text-decoration: none; transition: color 0.3s ease;">
                      <i class="fas fa-theater-masks" style="margin-right: 8px; color: #BDCF00;"></i>
                      Nos Spectacles
                    </a>
                  </li>
                  <li style="margin-bottom: 10px;">
                    <a href="/dashboard" style="color: #bdc3c7; text-decoration: none; transition: color 0.3s ease;">
                      <i class="fas fa-calendar-alt" style="margin-right: 8px; color: #BDCF00;"></i>
                      Réservations
                    </a>
                  </li>
                  <li style="margin-bottom: 10px;">
                    <a href="/contact" style="color: #bdc3c7; text-decoration: none; transition: color 0.3s ease;">
                      <i class="fas fa-envelope" style="margin-right: 8px; color: #BDCF00;"></i>
                      Contact
                    </a>
                  </li>
                  <li style="margin-bottom: 10px;">
                    <a href="/support" style="color: #bdc3c7; text-decoration: none; transition: color 0.3s ease;">
                      <i class="fas fa-question-circle" style="margin-right: 8px; color: #BDCF00;"></i>
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Contact Info -->
              <div class="footer-widget">
                <h3 style="color: #BDCF00; margin-bottom: 20px; font-size: 1.2rem; font-weight: 600;">Contact</h3>
                <div style="color: #bdc3c7; line-height: 1.8;">
                  <p style="margin-bottom: 10px;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 10px; color: #BDCF00;"></i>
                    Casablanca, Maroc
                  </p>
                  <p style="margin-bottom: 10px;">
                    <i class="fas fa-phone" style="margin-right: 10px; color: #BDCF00;"></i>
                    +212 5 22 XX XX XX
                  </p>
                  <p style="margin-bottom: 10px;">
                    <i class="fas fa-envelope" style="margin-right: 10px; color: #BDCF00;"></i>
                    contact@edjs.ma
                  </p>
                  <p style="margin-bottom: 10px;">
                    <i class="fas fa-clock" style="margin-right: 10px; color: #BDCF00;"></i>
                    Lun-Ven: 9h-18h
                  </p>
                </div>
              </div>

              <!-- Newsletter -->
              <div class="footer-widget">
                <h3 style="color: #BDCF00; margin-bottom: 20px; font-size: 1.2rem; font-weight: 600;">Newsletter</h3>
                <p style="color: #bdc3c7; margin-bottom: 20px; line-height: 1.6;">
                  Restez informé de nos nouveaux spectacles et événements spéciaux.
                </p>
                <form style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <input 
                    type="email" 
                    placeholder="Votre email" 
                    style="flex: 1; min-width: 200px; padding: 12px; border: none; border-radius: 5px; background: #34495e; color: white; font-size: 14px;"
                  />
                  <button 
                    type="submit" 
                    style="padding: 12px 20px; background: #BDCF00; color: #2c3e50; border: none; border-radius: 5px; font-weight: 600; cursor: pointer; transition: background 0.3s ease;"
                  >
                    S'abonner
                  </button>
                </form>
              </div>
            </div>

            <!-- Footer Bottom -->
            <div class="vs-footer__bottom" style="border-top: 1px solid #34495e; padding-top: 20px;">
              <div class="vs-footer__bottom--menu" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                <div style="color: #bdc3c7; font-size: 14px;">
                  © 2024 École de Jeunes Spectateurs. Tous droits réservés.
                </div>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                  <a href="/privacy" style="color: #bdc3c7; text-decoration: none; font-size: 14px; transition: color 0.3s ease;">
                    Politique de confidentialité
                  </a>
                  <a href="/terms" style="color: #bdc3c7; text-decoration: none; font-size: 14px; transition: color 0.3s ease;">
                    Conditions d'utilisation
                  </a>
                  <a href="/cookies" style="color: #bdc3c7; text-decoration: none; font-size: 14px; transition: color 0.3s ease;">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </div>

          <style>
            .vs-footer a:hover {
              color: #BDCF00 !important;
            }
            
            .vs-footer button:hover {
              background: #D4E157 !important;
            }
            
            @media (max-width: 768px) {
              .vs-footer__top {
                grid-template-columns: 1fr !important;
                gap: 30px !important;
                text-align: center;
              }
              
              .social-style {
                justify-content: center !important;
              }
              
              .vs-footer__bottom--menu {
                flex-direction: column !important;
                gap: 15px !important;
                text-align: center !important;
              }
              
              .footer-widget form {
                justify-content: center !important;
              }
            }
          </style>
        </footer>
      `
    }} />
  );
}
