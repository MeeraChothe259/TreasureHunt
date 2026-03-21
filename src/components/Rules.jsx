import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Rules.css';
import { playHoverSound, playClickSound } from '../utils/audioSystem';

const RULES_DATA = [
  {
    id: 1,
    icon: '👥',
    iconClass: 'icon-team',
    num: 'Rule 1',
    head: 'Team Formation',
    desc: 'Every expedition must consist of four brave explorers. Only united minds can survive the trials of Chakravyuh.',
  },
  {
    id: 2,
    icon: '⏳',
    iconClass: 'icon-hourglass',
    num: 'Rule 2',
    head: 'Time is Power',
    desc: 'Speed determines destiny. Teams will be ranked based on how quickly they conquer each challenge.',
  },
  {
    id: 3,
    icon: '⚖️',
    iconClass: 'icon-scale',
    num: 'Rule 3',
    head: 'Mistakes Have Consequences',
    desc: 'Wrong answers will invite penalties. Each error may cost precious time or points — choose wisely.',
  },
  {
    id: 4,
    icon: '🛡️',
    iconClass: 'icon-shield',
    num: 'Rule 4',
    head: 'Honor the Game',
    desc: 'Fair play is sacred within the pyramid. Any unfair advantage or misconduct will lead to disqualification.',
  }
];

const HIEROGLYPHS = ['𓀀', '𓁐', '𓃭', '𓃯', '𓃰', '𓆣', '𓋹', '𓍹', '𓎬', '𓍊'];

export default function Rules() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [footprints, setFootprints] = useState([]);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.15 });
    
    if (sectionRef.current) ob.observe(sectionRef.current);
    
    // Safety fallback
    const fallback = setTimeout(() => setIsVisible(true), 2000);
    return () => { ob.disconnect(); clearTimeout(fallback); };
  }, []);

  // Sand Footprints Track
  const handleMouseMove = useCallback((e) => {
    // Only drop footprint occasionally to save performance
    if (Math.random() > 0.1) return;
    const { clientX, clientY } = e;
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;

    const x = clientX - r.left;
    const y = clientY - r.top;

    const id = Date.now() + Math.random();
    setFootprints(prev => [...prev.slice(-15), { id, x, y }]);
    
    // Cleanup old trail
    setTimeout(() => {
      setFootprints(prev => prev.filter(f => f.id !== id));
    }, 2500);
  }, []);

  const handleTabletHover = () => {
    playHoverSound();
  };
  
  const handleTabletClick = () => {
    playClickSound(); // Ancient thud
  };

  return (
    <section 
      id="rules-section" 
      className={`rules-section ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Background layer */}
      <div className="rules-bg"></div>
      
      {/* Engraved Hieroglyphs Layer */}
      <div className="engraved-hieroglyphs" aria-hidden>
        {Array.from({ length: 90 }).map((_, i) => (
          <span key={i} style={{ animation: `pulse ${Math.random()*4+2}s infinite alternate`, animationDelay: `${Math.random()*2}s` }}>
            {HIEROGLYPHS[Math.floor(Math.random() * HIEROGLYPHS.length)]}
          </span>
        ))}
      </div>

      {/* Torches */}
      <div className="rules-torch left"><div className="rules-torch-flame"></div></div>
      <div className="rules-torch right"><div className="rules-torch-flame"></div></div>

      {/* Falling Sand & Dust */}
      <div className="falling-sand-layer">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="rules-dust" style={{ left: `${Math.random()*100}%`, animationDuration: `${Math.random()*3 + 3}s`, animationDelay: `${Math.random()*3}s` }}></div>
        ))}
        <div className="sand-ripple"></div>
      </div>

      {/* Header */}
      <div className="rules-header">
        <h2 className="rules-title">Laws of the Quest</h2>
      </div>

      {/* Rule Tablets */}
      <div className="tablets-container">
        {RULES_DATA.map((rule, idx) => (
          <div 
            key={rule.id} 
            className={`tablet-card t${rule.id}`}
            onMouseEnter={handleTabletHover}
            onClick={handleTabletClick}
          >
            <div className={`tablet-icon ${rule.iconClass}`}>{rule.icon}</div>
            <div className="rule-num">{rule.num}</div>
            <div className="rule-head">{rule.head}</div>
            <div className="rule-desc">{rule.desc}</div>
            
            {/* Soundwave hover interaction */}
            <div className="tablet-soundwave">
              <span className="tsw-bar"></span>
              <span className="tsw-bar"></span>
              <span className="tsw-bar"></span>
              <span className="tsw-bar"></span>
              <span className="tsw-bar"></span>
            </div>
          </div>
        ))}
      </div>

      {/* Cursor Sand Footprints */}
      {footprints.map(fp => (
        <div 
          key={fp.id} 
          className="sand-footprint" 
          style={{ left: fp.x, top: fp.y, transform: `rotate(${Math.random()*40-20}deg)` }} 
        />
      ))}

    </section>
  );
}
