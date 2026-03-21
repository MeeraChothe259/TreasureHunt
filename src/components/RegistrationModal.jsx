import React, { useState, useEffect } from 'react';
import './RegistrationModal.css';
import { playClickSound, playLevelActivate } from '../utils/audioSystem';

export default function RegistrationModal({ onClose }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    playLevelActivate();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (data.captain_phone) {
      data.captain_phone = parseInt(data.captain_phone.replace(/\D/g, ''), 10) || 0;
    }
    
    try {
      const response = await fetch('http://localhost:5053/registerTeam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Alliance formed! Your team has been registered for Chakravyuh.');
        onClose();
      } else {
        alert('Registration failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert('Network error while registering. Ensure your backend is running.');
    }
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
            <input type="text" name="team_name" className="reg-input" placeholder="e.g. Sphinx Coders" required onClick={handleClick} />
          </div>

          <div className="members-grid">
            <div className="member-card">
              <label>Member 1 (Captain)</label>
              <input type="text" name="member1_name" className="reg-input" placeholder="Name" required onClick={handleClick} />
              <input type="text" name="member1_college" className="reg-input" placeholder="College Name" required onClick={handleClick} />
              <div className="member-row">
                <input type="text" name="member1_department" className="reg-input" placeholder="Department" required onClick={handleClick} />
                <select name="member1_year" className="reg-input select-placeholder" defaultValue="" required onChange={(e) => e.target.classList.remove('select-placeholder')} onClick={handleClick}>
                  <option value="" disabled hidden>Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="member-card">
              <label>Member 2</label>
              <input type="text" name="member2_name" className="reg-input" placeholder="Name" required onClick={handleClick} />
              <input type="text" name="member2_college" className="reg-input" placeholder="College Name" required onClick={handleClick} />
              <div className="member-row">
                <input type="text" name="member2_department" className="reg-input" placeholder="Department" required onClick={handleClick} />
                <select name="member2_year" className="reg-input select-placeholder" defaultValue="" required onChange={(e) => e.target.classList.remove('select-placeholder')} onClick={handleClick}>
                  <option value="" disabled hidden>Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="member-card">
              <label>Member 3</label>
              <input type="text" name="member3_name" className="reg-input" placeholder="Name" onClick={handleClick} />
              <input type="text" name="member3_college" className="reg-input" placeholder="College Name" onClick={handleClick} />
              <div className="member-row">
                <input type="text" name="member3_department" className="reg-input" placeholder="Department" onClick={handleClick} />
                <select name="member3_year" className="reg-input select-placeholder" defaultValue="" onChange={(e) => e.target.classList.remove('select-placeholder')} onClick={handleClick}>
                  <option value="" disabled hidden>Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="member-card">
              <label>Member 4</label>
              <input type="text" name="member4_name" className="reg-input" placeholder="Name" onClick={handleClick} />
              <input type="text" name="member4_college" className="reg-input" placeholder="College Name" onClick={handleClick} />
              <div className="member-row">
                <input type="text" name="member4_department" className="reg-input" placeholder="Department" onClick={handleClick} />
                <select name="member4_year" className="reg-input select-placeholder" defaultValue="" onChange={(e) => e.target.classList.remove('select-placeholder')} onClick={handleClick}>
                  <option value="" disabled hidden>Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
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
            Seal The Pact (Register)
          </button>

        </form>
      </div>
    </div>
  );
}
