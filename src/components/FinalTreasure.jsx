import React, { useEffect, useRef, useState, useCallback } from 'react';
import './FinalTreasure.css';
import { playClickSound, playLevelActivate } from '../utils/audioSystem';

const SYMBOLS = ['𓂀', '𓆣', '𓋹', '𓍊', '𓎬'];
const HIEROGLYPHS = ['𓀀', '𓀁', '𓀂', '𓀃', '𓃭', '𓃯', '𓃰', '𓋹', '𓍹'];

export default function FinalTreasure() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [chestCracked, setChestCracked] = useState(false);
  const [bursts, setBursts] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [time, setTime] = useState(600); // 10 minutes
  
  // Floating Chits state
  const [chits, setChits] = useState([]);

  useEffect(() => {
    // Generate random chits
    const initialChits = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 15,
      delay: Math.random() * 3,
      dur: Math.random() * 4 + 3
    }));
    setChits(initialChits);

    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setIsVisible(true);
        // Chest cracks after section loads
        setTimeout(() => {
          setChestCracked(true);
          playLevelActivate();
        }, 3500);
      }
    }, { threshold: 0.3 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Timer run
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTime(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleChestClick = () => {
    playClickSound();
    
    // Sand Burst
    const newBursts = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      angle: (360 / 24) * i + Math.random() * 10,
      dist: Math.random() * 150 + 50
    }));
    setBursts(newBursts);
    setTimeout(() => setBursts([]), 1000);

    // Victory Confetti
    const newConfetti = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i + 1000,
      left: Math.random() * 100,
      dur: Math.random() * 3 + 2,
      delay: Math.random() * 1,
      char: HIEROGLYPHS[Math.floor(Math.random() * HIEROGLYPHS.length)]
    }));
    setConfetti(prev => [...prev, ...newConfetti]);
    setTimeout(() => setConfetti([]), 6000);
  };

  const handleChitHover = (e, index) => {
    // Move chit slightly toward cursor on hover via state update
    playClickSound(); // A tiny tick
  };

  const mins = Math.floor(time / 60).toString().padStart(2, '0');
  const secs = (time % 60).toString().padStart(2, '0');

  return (
    <section 
      id="final-treasure" 
      ref={sectionRef} 
      className={`ft-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="ft-camera">
        
        {/* Rumble Layer */}
        <div className="ft-rumble">
          
          {/* Background Pillars & Walls */}
          <div className="ft-bg-walls">
            <div className="ft-pillar p1"></div>
            <div className="ft-pillar p2"></div>
            <div className="ft-pillar p3"></div>
            <div className="ft-pillar p4"></div>
            
            <div className="torch"><div className="torch-flame"></div><div className="torch-glow"></div></div>
          </div>

          {/* Golden Fog */}
          <div className="ft-fog"></div>

          {/* Sliding Ancient Doors */}
          <div className="ft-door ft-door-left"></div>
          <div className="ft-door ft-door-right"></div>

          {/* Central Beam */}
          <div className="ft-light-beam"></div>

          {/* Text Content */}
          <div className="ft-content">
            <h2 className="ft-title">The Final Chamber Awaits…</h2>
            <div className="ft-timer">{mins}:{secs}</div>
            <p className="ft-desc">
              The team that completes the journey in the least amount of time shall claim the ultimate victory.<br/>
              Here, intelligence meets pressure in a high-stakes 10-minute final challenge.<br/>
              Teams must search for hidden clue chits, connect the puzzle pieces, and decode the ultimate mystery.<br/>
              One correct solution unlocks the ancient treasure — crowning the true champions of Chakravyuh.
            </p>
          </div>

          {/* 5 Podium Qualifiers */}
          <div className="ft-podiums">
            {SYMBOLS.map((sym, i) => (
              <div key={i} className="ft-podium" style={{ '--pi': i }}>
                <div className="podium-sym">{sym}</div>
                <div style={{
                  color:'rgba(240,195,98,0.9)', 
                  fontSize:'0.75rem', 
                  fontWeight: 'bold',
                  marginTop:'12px', 
                  fontFamily:'sans-serif', 
                  letterSpacing:'2px',
                  textShadow: '0 2px 4px #000, 0 0 10px rgba(0,0,0,0.8)'
                }}>TEAM {i+1}</div>
              </div>
            ))}
          </div>

          {/* Platform and Chest */}
          <div className="ft-platform-container">
            <div className="ft-platform"></div>
            <div className="ft-chest-wrap" onClick={handleChestClick}>
              <div className="chest-rays"></div>
              <div className="ft-chest-glow"></div>
              <div className="ft-chest ft-chest-shake">
                <div className={`chest-lock ${chestCracked ? 'cracked' : ''}`}></div>
              </div>
            </div>
            {/* Burst Particles */}
            {bursts.map(b => (
              <div key={b.id} className="ft-chest-burst chest-p" style={{'--a': `${b.angle}deg`, '--d': `${b.dist}px`}} />
            ))}
          </div>

          {/* Floating Chits */}
          <div className="ft-chits-layer">
            {chits.map((c) => (
              <div 
                key={c.id} 
                className="ft-chit"
                style={{
                  left: `${c.x}%`, 
                  top: `${c.y}%`, 
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.dur}s`
                }}
                onMouseEnter={(e) => handleChitHover(e, c.id)}
              >
                ?
              </div>
            ))}
          </div>

          {/* Confetti */}
          {confetti.map(c => (
            <div 
              key={c.id} 
              className="confetti"
              style={{
                left: `${c.left}%`,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`
              }}
            >
              {c.char}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
