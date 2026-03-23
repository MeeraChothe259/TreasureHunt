import React, { useState } from 'react';
import './RegistrationModal.css';
import { playClickSound, playLevelActivate } from '../utils/audioSystem';
import imageOR from '../assets/headerImages/originalOR.png';

export default function RegistrationModal({ onClose }) {
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleNextToPayment = (e) => {
    e.preventDefault();
    playClickSound();
    
    const data = new FormData(e.target);
    const entries = Object.fromEntries(data.entries());
    
    if (entries.captain_phone) {
      entries.captain_phone = parseInt(entries.captain_phone.replace(/\D/g, ''), 10) || 0;
    }
    
    setFormData(entries);
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    playLevelActivate();
    
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5053';
    
    try {
      const response = await fetch(`${API_BASE_URL}/registerTeam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsRegistered(true);
      } else {
        let errorMessage = result.error || 'Unknown error';
        if (errorMessage.includes('duplicate key value violates unique constraint') && 
            errorMessage.includes('registrations_team_name_key')) {
          errorMessage = 'This team name is already taken. Please choose a different one.';
        }
        alert('Registration failed: ' + errorMessage);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert('Network error while registering. Ensure your backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    playClickSound();
  };

  return (
    <div className="reg-overlay" onClick={() => { playClickSound(); onClose(); }}>
      <div className="reg-modal" onClick={e => e.stopPropagation()}>
        <button className="reg-close" onClick={() => { playClickSound(); onClose(); }}>&times;</button>

        {!showPayment ? (
          <>
            <div className="reg-header">
              <h2 className="reg-title">Enter The Quest</h2>
            </div>

            <form className="reg-form" onSubmit={handleNextToPayment}>
              <div className="input-group">
                <label>Team Name</label>
                <input type="text" name="team_name" className="reg-input" placeholder="e.g. Sphinx Coders" required onClick={handleClick} />
              </div>

              <div className="members-grid">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="member-card">
                    <label>Member {num} {num === 1 && '(Captain)'}</label>
                    <input type="text" name={`member${num}_name`} className="reg-input" placeholder="Name" required={num <= 2} onClick={handleClick} />
                    <input type="text" name={`member${num}_college`} className="reg-input" placeholder="College Name" required={num <= 2} onClick={handleClick} />
                    <div className="member-row">
                      <input type="text" name={`member${num}_department`} className="reg-input" placeholder="Department" required={num <= 2} onClick={handleClick} />
                      <select name={`member${num}_year`} className="reg-input select-placeholder" defaultValue="" required={num <= 2} onChange={(e) => e.target.classList.remove('select-placeholder')} onClick={handleClick}>
                        <option value="" disabled hidden>Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="input-group">
                <label>Mobile Number</label>
                <input type="tel" name="captain_phone" className="reg-input" placeholder="Enter your mobile no." required onClick={handleClick} />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="captain_email" className="reg-input" placeholder="Enter your email address" required onClick={handleClick} />
              </div>

              <button type="submit" className="reg-submit-btn" onMouseEnter={handleClick}>
                Continue to Payment
              </button>
            </form>
          </>
        ) : isRegistered ? (
          <div className="success-step">
            <div className="reg-header">
              <h2 className="reg-title">Pact Sealed!</h2>
            </div>
            
            <div className="success-content">
              <div className="success-icon">✨</div>
              <p className="success-message">
                Your team has been registered! 
              </p>
              <p className="success-note">
                To finalize, click the button below to send your payment screenshot to Vedant on WhatsApp.
              </p>

              <a 
                href={`https://wa.me/918149787422?text=Hi%20Vedant!%20I've%20just%20registered%20the%20team%20"${formData?.team_name}"%20for%20Chakravyuh.%20Here%20is%20my%20payment%20screenshot.`}
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-btn"
                onClick={handleClick}
              >
                Send Screenshot on WhatsApp 📱
              </a>

              <button className="reg-submit-btn secondary-btn" onClick={onClose} style={{ marginTop: '20px' }}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="payment-step">
            <div className="reg-header">
              <h2 className="reg-title">Secure Your Entry</h2>
            </div>
            
            <div className="payment-content">
              <div className="qr-container">
                <img src={imageOR} alt="Payment QR" className="payment-qr-img" />
              </div>
              
              <div className="payment-info">
                <p className="payment-instruction">
                  Scan it manually then only registration will be approved.
                </p>
                <p className="payment-note">
                  Please complete the payment and then click the button below to finalize your registration.
                </p>
              </div>

              <div className="payment-actions">
                <button className="reg-back-btn" onClick={() => setShowPayment(false)}>Back</button>
                <button 
                  className="reg-submit-btn" 
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'I have paid & register'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
