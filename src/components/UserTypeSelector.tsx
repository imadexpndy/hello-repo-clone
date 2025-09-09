import React, { useState, useEffect } from 'react';
import './UserTypeSelector.css';

interface UserTypeSelectorProps {
  onUserTypeChange?: (userType: string) => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onUserTypeChange }) => {
  const [userType, setUserType] = useState<string>('particulier');

  useEffect(() => {
    // Load saved user type from localStorage
    const savedUserType = localStorage.getItem('hello_planet_user_type') || 'particulier';
    setUserType(savedUserType);
  }, []);

  const handleUserTypeChange = (newType: string) => {
    setUserType(newType);
    localStorage.setItem('hello_planet_user_type', newType);
    if (onUserTypeChange) {
      onUserTypeChange(newType);
    }
  };

  return (
    <div className="user-type-selector">
      <div className="selector-container">
        <div className="selector-label">
          <i className="fas fa-user-tag"></i>
          <span>Je suis :</span>
        </div>
        <div className="selector-buttons">
          <button 
            className={`user-type-btn ${userType === 'particulier' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('particulier')}
          >
            <i className="fas fa-user"></i>
            Particulier
          </button>
          <button 
            className={`user-type-btn ${userType === 'scolaire-privee' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('scolaire-privee')}
          >
            <i className="fas fa-graduation-cap"></i>
            École Privée
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;
