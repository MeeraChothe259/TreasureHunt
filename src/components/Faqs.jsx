import React, { useEffect, useRef, useState } from 'react';
import './Faqs.css';
import { playClickSound, playHoverSound } from '../utils/audioSystem';

const FAQ_DATA = [
  {
    id: 0,
    icon: '👥',
    q: 'How many members per team?',
    a: 'Each team must consist of four explorers. Only teamwork and coordination will help you survive the trials ahead.',
  },
  {
    id: 1,
    icon: '🌍',
    q: 'Is the event online or offline?',
    a: 'Chakravyuh is a fully offline adventure experience, where teams physically explore clues and complete real-world challenges inside the arena.',
  },
  {
    id: 2,
    icon: '🏆',
    q: 'How is the winner decided?',
    a: 'The winning team is determined based on speed, accuracy, and final treasure puzzle completion. The first team to unlock the treasure with the correct solution claims victory.',
  },
  {
    id: 3,
    icon: '📱',
    q: 'Are mobile phones allowed?',
    a: 'Mobile phones may be used only in specific levels like QR scanning or technical rounds. Misuse during restricted challenges may result in penalties.',
  },
];

export default function Faqs() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openIds, setOpenIds] = useState([]);
  const [compassAng, setCompassAng] = useState(0);

  // Scroll visibility observer
  useEffect(() => {
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.15 });

    if (sectionRef.current) ob.observe(sectionRef.current);

    // Fallback exactly like QuestJourney
    const fallback = setTimeout(() => setIsVisible(true), 2500);
    return () => { ob.disconnect(); clearTimeout(fallback); };
  }, []);

  const handleCardClick = (id) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(x => x !== id));
      playHoverSound();
    } else {
      setOpenIds([...openIds, id]);
      playClickSound(); // Deep artifact thud
    }
    // Rotate compass randomly
    setCompassAng(prev => prev + (Math.random() * 180 + 90));
  };

  return (
    <section 
      id="faqs-section" 
      className={`faq-section ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      {/* Background Library & Ambient Elements */}
      <div className="faq-bg-library"></div>
      <div className="faq-ambient">
        <span className="floating-scroll" style={{left: '5%', top: '20%', '--dur':'12s'}} aria-hidden>📜</span>
        <span className="floating-scroll" style={{right: '8%', top: '40%', '--dur':'18s', width:'40px'}} aria-hidden>📜</span>
        <span className="floating-scroll" style={{left: '15%', top: '65%', '--dur':'14s', fontSize: '1.8rem'}} aria-hidden>📜</span>

        {/* Dust */}
        {Array.from({ length: 45 }).map((_, i) => (
          <div key={i} className="faq-dust" style={{ left:`${Math.random()*100}%`, animationDuration:`${Math.random()*4+4}s`, animationDelay:`${Math.random()*4}s` }}></div>
        ))}
      </div>

      {/* Header */}
      <div className="faq-header">
        <h2 className="faq-title">Secrets Before the Quest…</h2>
        <div className="compass-spinner" style={{ transform: `rotate(${compassAng}deg)` }}>🧭</div>
      </div>

      {/* Giant Magical Book / Glowing Stand */}
      <div className="faq-pedestal-wrap">
        <div className="book-glow-spread"></div>
        <div className="magic-book">📖</div>
        <div className="pedestal-stone"></div>
      </div>

      {/* Floating FAQ Question Grid */}
      <div className="faq-grid">
        {FAQ_DATA.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div key={faq.id} className={`faq-card-wrap q${faq.id}`}>
              <div 
                className={`faq-card ${isOpen ? 'is-flipped' : ''}`} 
                onClick={() => handleCardClick(faq.id)}
                onMouseEnter={playHoverSound}
              >
                
                {/* Visual Ripple Layer on click */}
                {isOpen && <div className="click-ripple ripple-active"></div>}

                <div className="faq-face faq-front">
                  <div className="faq-icon-wrap">
                    <span className="faq-icon">{faq.icon}</span>
                    <span className="faq-q-text">{faq.q}</span>
                  </div>
                  <span className="faq-q-mark">𓂋❓</span>
                </div>

                <div className="faq-face faq-back">
                  <div className="faq-a-text">{faq.a}</div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
