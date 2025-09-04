import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ReservationData {
  spectacle: string;
  profileType: 'PRO' | 'Particulier' | '';
  location: 'Rabat' | 'Casablanca' | '';
  publicType: 'Écoles privées' | 'Écoles publiques' | 'Associations' | '';
  
  // Common fields
  fullName: string;
  email: string;
  phone: string;
  professionalEmail: string;
  
  // Professional fields
  establishmentName: string;
  numberOfChildren: number;
  classLevel: string;
  numberOfAccompanists: number;
  
  // Individual fields
  numberOfTickets: number;
}

const spectacleNames: { [key: string]: string } = {
  'le-petit-prince': 'Le Petit Prince',
  'tara-sur-la-lune': 'Tara sur la Lune',
  'estevanico': 'Estevanico',
  'charlotte': 'Charlotte',
  'alice-chez-les-merveilles': 'Alice Chez Les Merveilles'
};

export default function Reservation() {
  const { spectacleId } = useParams<{ spectacleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({
    spectacle: spectacleId || '',
    profileType: '',
    location: '',
    publicType: '',
    fullName: '',
    email: user?.email || '',
    phone: '',
    professionalEmail: '',
    establishmentName: '',
    numberOfChildren: 0,
    classLevel: '',
    numberOfAccompanists: 0,
    numberOfTickets: 1
  });

  useEffect(() => {
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.href);
      navigate('/auth?return_url=' + returnUrl);
    }
  }, [user, navigate]);

  useEffect(() => {
    // Load external stylesheets
    const loadStylesheet = (href: string) => {
      if (!document.querySelector('link[href="' + href + '"]')) {
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

  const handleInputChange = (field: keyof ReservationData, value: any) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(reservationData.profileType && reservationData.location && 
                 (reservationData.profileType === 'Particulier' || reservationData.publicType));
      case 2:
        if (reservationData.profileType === 'PRO') {
          return !!(reservationData.fullName && reservationData.email && reservationData.phone && 
                   reservationData.establishmentName && reservationData.professionalEmail && 
                   reservationData.numberOfChildren > 0 && reservationData.classLevel);
        } else {
          return !!(reservationData.fullName && reservationData.email && reservationData.phone && 
                   reservationData.professionalEmail && reservationData.numberOfTickets > 0);
        }
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const submitReservation = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare email data
      const emailData = {
        to: 'inscription@edjs.ma',
        subject: 'Nouvelle réservation - ' + (spectacleNames[reservationData.spectacle] || reservationData.spectacle),
        spectacle: spectacleNames[reservationData.spectacle] || reservationData.spectacle,
        ...reservationData,
        timestamp: new Date().toISOString(),
        userEmail: user?.email
      };

      // Send email (this would need to be implemented with your backend)
      console.log('Sending reservation data:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentStep(4);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Une erreur est survenue lors de l\'envoi de votre réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (window as any).handleInputChange = handleInputChange;
    (window as any).nextStepHandler = nextStep;
    (window as any).prevStepHandler = prevStep;
    (window as any).submitReservationHandler = submitReservation;
    (window as any).validateStep = validateStep;
  }, [reservationData, currentStep, isSubmitting]);

  if (!user) {
    return <div>Redirection vers la connexion...</div>;
  }

  const getStepClass = (step: number) => {
    if (currentStep >= step) {
      return currentStep > step ? 'completed' : 'active';
    }
    return 'inactive';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2 className="step-title">Réservation du spectacle</h2>
            <h3 style={{textAlign: 'center', color: 'var(--primary-color)', marginBottom: '2rem'}}>
              {spectacleNames[reservationData.spectacle] || reservationData.spectacle}
            </h3>
            {/* Profile selection content */}
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2 className="step-title">Formulaire d'inscription</h2>
            {/* Form content */}
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2 className="step-title">Paiement & Confirmation</h2>
            {/* Confirmation content */}
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <div className="success-message">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 style={{color: '#28a745', marginBottom: '1rem'}}>Réservation envoyée avec succès !</h2>
              {/* Success content */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      dangerouslySetInnerHTML={{
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

          .reservation-container {
            min-height: 100vh;
            padding: 2rem 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .reservation-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin: 0 auto;
            max-width: 800px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          }

          .step-indicator {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            gap: 1rem;
          }

          .step {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .step.active {
            background: var(--primary-color);
            color: white;
          }

          .step.completed {
            background: #28a745;
            color: white;
          }

          .step.inactive {
            background: #e9ecef;
            color: #6c757d;
          }

          .step-title {
            text-align: center;
            margin-bottom: 2rem;
            color: var(--text-dark);
            font-size: 1.5rem;
            font-weight: 600;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--text-dark);
          }

          .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--border-light);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.3s ease;
          }

          .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
          }

          .form-select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--border-light);
            border-radius: 0.5rem;
            font-size: 1rem;
            background: white;
            cursor: pointer;
          }

          .radio-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .radio-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-light);
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .radio-option:hover {
            border-color: var(--primary-color);
          }

          .radio-option.selected {
            border-color: var(--primary-color);
            background: rgba(189, 207, 0, 0.1);
          }

          .radio-option input[type="radio"] {
            margin: 0;
          }

          .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .btn-primary {
            background: var(--primary-color);
            color: white;
          }

          .btn-primary:hover {
            background: #a8b800;
            transform: translateY(-1px);
          }

          .btn-secondary {
            background: #6c757d;
            color: white;
          }

          .btn-secondary:hover {
            background: #545b62;
          }

          .btn-success {
            background: #28a745;
            color: white;
          }

          .btn-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          .warning-text {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
          }

          .success-message {
            text-align: center;
            padding: 2rem;
          }

          .success-icon {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1rem;
          }

          @media (max-width: 768px) {
            .form-row {
              grid-template-columns: 1fr;
            }
            
            .radio-group {
              flex-direction: column;
            }
            
            .btn-actions {
              flex-direction: column;
              gap: 1rem;
            }
          }
        </style>

        <div class="reservation-container">
          <div class="container">
            <div class="reservation-card">
              <div class="step-indicator">
                <div class="step \${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : 'inactive'}">1</div>
                <div class="step \${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : 'inactive'}">2</div>
                <div class="step \${currentStep >= 3 ? (currentStep > 3 ? 'completed' : 'active') : 'inactive'}">3</div>
                <div class="step \${currentStep >= 4 ? 'active' : 'inactive'}">4</div>
              </div>

              \${currentStep === 1 ? \`
                <div class="step-content">
                  <h2 class="step-title">Réservation du spectacle</h2>
                  <h3 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">
                    \${spectacleNames[reservationData.spectacle] || reservationData.spectacle}
                  </h3>

                  <div class="form-group">
                    <label class="form-label">Choisissez votre profil :</label>
                    <div class="radio-group">
                      <div class="radio-option \${reservationData.profileType === 'PRO' ? 'selected' : ''}" onclick="window.updateProfile('PRO')">
                        <input type="radio" name="profile" value="PRO" \${reservationData.profileType === 'PRO' ? 'checked' : ''}>
                        <span>Professionnel (PRO)</span>
                      </div>
                      <div class="radio-option \${reservationData.profileType === 'Particulier' ? 'selected' : ''}" onclick="window.updateProfile('Particulier')">
                        <input type="radio" name="profile" value="Particulier" \${reservationData.profileType === 'Particulier' ? 'checked' : ''}>
                        <span>Particulier</span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Lieu du spectacle :</label>
                    <div class="radio-group">
                      <div class="radio-option \${reservationData.location === 'Rabat' ? 'selected' : ''}" onclick="window.updateLocation('Rabat')">
                        <input type="radio" name="location" value="Rabat" \${reservationData.location === 'Rabat' ? 'checked' : ''}>
                        <span>Rabat</span>
                      </div>
                      <div class="radio-option \${reservationData.location === 'Casablanca' ? 'selected' : ''}" onclick="window.updateLocation('Casablanca')">
                        <input type="radio" name="location" value="Casablanca" \${reservationData.location === 'Casablanca' ? 'checked' : ''}>
                        <span>Casablanca</span>
                      </div>
                    </div>
                  </div>

                  \${reservationData.profileType === 'PRO' ? \`
                    <div class="form-group">
                      <label class="form-label">Public concerné :</label>
                      <div class="radio-group">
                        <div class="radio-option \${reservationData.publicType === 'Écoles privées' ? 'selected' : ''}" onclick="window.updatePublicType('Écoles privées')">
                          <input type="radio" name="publicType" value="Écoles privées" \${reservationData.publicType === 'Écoles privées' ? 'checked' : ''}>
                          <span>Écoles privées</span>
                        </div>
                        <div class="radio-option \${reservationData.publicType === 'Écoles publiques' ? 'selected' : ''}" onclick="window.updatePublicType('Écoles publiques')">
                          <input type="radio" name="publicType" value="Écoles publiques" \${reservationData.publicType === 'Écoles publiques' ? 'checked' : ''}>
                          <span>Écoles publiques</span>
                        </div>
                        <div class="radio-option \${reservationData.publicType === 'Associations' ? 'selected' : ''}" onclick="window.updatePublicType('Associations')">
                          <input type="radio" name="publicType" value="Associations" \${reservationData.publicType === 'Associations' ? 'checked' : ''}>
                          <span>Associations</span>
                        </div>
                      </div>
                    </div>
                  \` : ''}
                </div>
              \` : ''}

              \${currentStep === 2 ? \`
                <div class="step-content">
                  <h2 class="step-title">Formulaire d'inscription</h2>
                  
                  \${reservationData.profileType === 'PRO' ? \`
                    <h4 style="color: var(--primary-color); margin-bottom: 1.5rem;">Pour écoles et associations</h4>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nom complet *</label>
                        <input type="text" class="form-control" value="\${reservationData.fullName}" onchange="window.updateField('fullName', this.value)" required>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-control" value="\${reservationData.email}" onchange="window.updateField('email', this.value)" required>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Téléphone *</label>
                        <input type="tel" class="form-control" value="\${reservationData.phone}" onchange="window.updateField('phone', this.value)" required>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Nom de l'établissement *</label>
                        <input type="text" class="form-control" value="\${reservationData.establishmentName}" onchange="window.updateField('establishmentName', this.value)" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Email professionnel *</label>
                      <input type="email" class="form-control" value="\${reservationData.professionalEmail}" onchange="window.updateField('professionalEmail', this.value)" required>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nombre d'enfants *</label>
                        <input type="number" class="form-control" min="1" value="\${reservationData.numberOfChildren || ''}" onchange="window.updateField('numberOfChildren', parseInt(this.value) || 0)" required>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Niveau des classes *</label>
                        <input type="text" class="form-control" value="\${reservationData.classLevel}" onchange="window.updateField('classLevel', this.value)" placeholder="Ex: CP, CE1, CE2..." required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Nombre d'accompagnateurs</label>
                      <input type="number" class="form-control" min="0" max="4" value="\${reservationData.numberOfAccompanists || ''}" onchange="window.updateField('numberOfAccompanists', parseInt(this.value) || 0)">
                      <div class="warning-text">
                        <i class="fas fa-info-circle"></i> Maximum : 4 accompagnateurs par groupe de 30 enfants
                      </div>
                    </div>
                  \` : \`
                    <h4 style="color: var(--primary-color); margin-bottom: 1.5rem;">Pour particuliers</h4>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nom complet *</label>
                        <input type="text" class="form-control" value="\${reservationData.fullName}" onchange="window.updateField('fullName', this.value)" required>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-control" value="\${reservationData.email}" onchange="window.updateField('email', this.value)" required>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Téléphone *</label>
                        <input type="tel" class="form-control" value="\${reservationData.phone}" onchange="window.updateField('phone', this.value)" required>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Email professionnel *</label>
                        <input type="email" class="form-control" value="\${reservationData.professionalEmail}" onchange="window.updateField('professionalEmail', this.value)" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Nombre de tickets souhaités *</label>
                      <input type="number" class="form-control" min="1" value="\${reservationData.numberOfTickets || ''}" onchange="window.updateField('numberOfTickets', parseInt(this.value) || 1)" required>
                    </div>
                  \`}
                </div>
              \` : ''}

              \${currentStep === 3 ? \`
                <div class="step-content">
                  <h2 class="step-title">Paiement & Confirmation</h2>
                  
                  <div style="background: #f8f9fa; padding: 2rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                    <h4 style="color: var(--text-dark); margin-bottom: 1rem;">Récapitulatif de votre réservation</h4>
                    
                    <div style="margin-bottom: 1rem;">
                      <strong>Spectacle :</strong> \${spectacleNames[reservationData.spectacle] || reservationData.spectacle}
                    </div>
                    <div style="margin-bottom: 1rem;">
                      <strong>Profil :</strong> \${reservationData.profileType}
                    </div>
                    <div style="margin-bottom: 1rem;">
                      <strong>Lieu :</strong> \${reservationData.location}
                    </div>
                    \${reservationData.profileType === 'PRO' ? \`
                      <div style="margin-bottom: 1rem;">
                        <strong>Public :</strong> \${reservationData.publicType}
                      </div>
                      <div style="margin-bottom: 1rem;">
                        <strong>Établissement :</strong> \${reservationData.establishmentName}
                      </div>
                      <div style="margin-bottom: 1rem;">
                        <strong>Nombre d'enfants :</strong> \${reservationData.numberOfChildren}
                      </div>
                      <div style="margin-bottom: 1rem;">
                        <strong>Niveau :</strong> \${reservationData.classLevel}
                      </div>
                    \` : \`
                      <div style="margin-bottom: 1rem;">
                        <strong>Nombre de tickets :</strong> \${reservationData.numberOfTickets}
                      </div>
                    \`}
                    <div style="margin-bottom: 1rem;">
                      <strong>Contact :</strong> \${reservationData.fullName} - \${reservationData.email}
                    </div>
                  </div>

                  <div class="warning-text">
                    <i class="fas fa-envelope"></i> 
                    <strong>Information importante :</strong> Toutes les informations seront automatiquement envoyées à inscription@edjs.ma
                  </div>

                  <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #28a745;">
                    <h5 style="color: #28a745; margin-bottom: 1rem;">
                      <i class="fas fa-check-circle"></i> Après validation
                    </h5>
                    <ul style="margin: 0; padding-left: 1.5rem; color: #155724;">
                      <li>Réception d'un email de confirmation</li>
                      <li>Contact dans les plus brefs délais pour finaliser</li>
                      <li>Réception des billets par email</li>
                      <li>Option de téléchargement via QR Code sur le site EDJS</li>
                    </ul>
                  </div>
                </div>
              \` : ''}

              \${currentStep === 4 ? \`
                <div class="step-content">
                  <div class="success-message">
                    <div class="success-icon">
                      <i class="fas fa-check-circle"></i>
                    </div>
                    <h2 style="color: #28a745; margin-bottom: 1rem;">Réservation envoyée avec succès !</h2>
                    <p style="color: var(--text-light); margin-bottom: 2rem;">
                      Votre demande de réservation a été transmise à notre équipe. Vous recevrez un email de confirmation sous peu.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                      <h4 style="color: var(--text-dark); margin-bottom: 1rem;">Prochaines étapes :</h4>
                      <ul style="text-align: left; color: var(--text-light);">
                        <li>Vérifiez votre boîte email (y compris les spams)</li>
                        <li>Notre équipe vous contactera dans les plus brefs délais</li>
                        <li>Vous recevrez vos billets par email après confirmation</li>
                        <li>Possibilité de télécharger vos billets via QR Code sur edjs.art</li>
                      </ul>
                    </div>

                    <button class="btn btn-primary" onclick="window.location.href='/spectacles'">
                      <i class="fas fa-arrow-left"></i>
                      Retour aux spectacles
                    </button>
                  </div>
                </div>
              \` : ''}

              \${currentStep < 4 ? \`
                <div class="btn-actions">
                  <div>
                    \${currentStep > 1 ? \`
                      <button class="btn btn-secondary" onclick="window.prevStep()">
                        <i class="fas fa-arrow-left"></i>
                        Précédent
                      </button>
                    \` : ''}
                  </div>
                  <div>
                    \${currentStep < 3 ? \`
                      <button class="btn btn-primary" onclick="window.nextStep()" \${!validateStep(currentStep) ? 'disabled' : ''}>
                        Suivant
                        <i class="fas fa-arrow-right"></i>
                      </button>
                    \` : \`
                      <button class="btn btn-success" onclick="window.submitReservation()" \${isSubmitting ? 'disabled' : ''}>
                        \${isSubmitting ? '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...' : '<i class="fas fa-paper-plane"></i> Envoyer la réservation'}
                      </button>
                    \`}
                  </div>
                </div>
              \` : ''}
            </div>
          </div>
        </div>

        <script>
          window.updateProfile = function(profile) {
            window.handleInputChange('profileType', profile);
          };

          window.updateLocation = function(location) {
            window.handleInputChange('location', location);
          };

          window.updatePublicType = function(publicType) {
            window.handleInputChange('publicType', publicType);
          };

          window.updateField = function(field, value) {
            window.handleInputChange(field, value);
          };

          window.nextStep = function() {
            window.nextStepHandler();
          };

          window.prevStep = function() {
            window.prevStepHandler();
          };

          window.submitReservation = function() {
            window.submitReservationHandler();
          };
        </script>
        </div>
        `
      }}
    />
  );
}
