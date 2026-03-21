import React, { useState, useEffect } from 'react';
import './RegistrationModal.css';
import { playClickSound, playLevelActivate } from '../utils/audioSystem';

export default function RegistrationModal({ onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    playLevelActivate();
    alert('Alliance formed! Your team has been registered for Chakravyuh.');
    onClose();
  };

  const handleClick = () => {
    playClickSound();
  };

  return (
    <div className="reg-overlay" onClick={() => { playClickSound(); onClose(); }}>
      <div className="reg-modal" onClick={e => e.stopPropagation()}>
        <button className="reg-close" onClick={() => { playClickSound(); onClose(); }}>&times;</button>
        
        <div className="reg-header">
          <h2 className="reg-title">Enter The Quest</h2>
        </div>

        <form className="reg-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Team Name</label>
            <input type="text" className="reg-input" placeholder="e.g. Sphinx Coders" required onClick={handleClick} />
          </div>

          <div className="members-grid">
            <div className="input-group">
              <label>Member 1 (Captain)</label>
              <input type="text" className="reg-input" placeholder="Name" required onClick={handleClick} />
            </div>
            <div className="input-group">
              <label>Member 2</label>
              <input type="text" className="reg-input" placeholder="Name" required onClick={handleClick} />
            </div>
            <div className="input-group">
              <label>Member 3</label>
              <input type="text" className="reg-input" placeholder="Name" required onClick={handleClick} />
            </div>
            <div className="input-group">
              <label>Member 4</label>
              <input type="text" className="reg-input" placeholder="Name" required onClick={handleClick} />
            </div>
          </div>

          <div className="input-group">
            <label>Contact Number (Captain)</label>
            <input type="tel" className="reg-input" placeholder="+1..." required onClick={handleClick} />
          </div>

          <div className="input-group">
            <label>Captain Email</label>
            <input type="email" className="reg-input" placeholder="captain@egypt.com" required onClick={handleClick} />
          </div>

          <button type="submit" className="reg-submit-btn" onMouseEnter={handleClick}>
            Seal The Pact (Register)
          </button>

        </form>
      </div>
    </div>
  );
}
