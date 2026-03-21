import React, { useEffect, useRef, useState } from 'react';
import './Footer.css';
import { playHoverSound } from '../utils/audioSystem';

const HIEROGLYPHS = ['𓀀', '𓁐', '𓃭', '𓃯', '𓃰', '𓆣', '𓋹', '𓍹', '𓎬', '𓍊'];

export default function Footer() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Intersection Observer
  useEffect(() => {
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 }); // Trigger early to smoothly fade in
    if (sectionRef.current) ob.observe(sectionRef.current);
    return () => ob.disconnect();
  }, []);

  // Constant arrays to prevent re-rendering math randoms on mouse move
  const stars = React.useMemo(() => Array.from({ length: 60 }).map(() => ({
    l: Math.random()*100, t: Math.random()*100,
    w: Math.random()*3,
    dur: Math.random()*3+2, del: Math.random()*3
  })), []);
  
  const particles = React.useMemo(() => Array.from({ length: 25 }).map(() => ({
    l: Math.random()*100, t: Math.random()*100,
    s: Math.random()*4+2,
    del: Math.random()*0.2,
    mx: Math.random()*1.5+0.5, my: Math.random()*1.5+0.5
  })), []);

  const hiero = React.useMemo(() => Array.from({ length: 12 }).map(() => ({
    l: Math.random()*90, t: Math.random()*90,
    dur: Math.random()*5+4, del: Math.random()*3,
    char: HIEROGLYPHS[Math.floor(Math.random() * HIEROGLYPHS.length)]
  })), []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
    setMousePos({ x, y });
  };

  return (
    <footer 
      id="footer-section" 
      ref={sectionRef}
      className={`footer-section ${isVisible ? 'is-visible' : ''}`}
      onMouseMove={handleMouseMove}
    >
      
      {/* ── Night Sky ── */}
      <div className="footer-stars">
        {stars.map((s, i) => (
          <div 
            key={i} className="footer-star" 
            style={{ 
              left: `${s.l}%`, 
              top: `${s.t}%`, 
              width: `${s.w}px`, height: `${s.w}px`,
              animationDuration: `${s.dur}s`, 
              animationDelay: `${s.del}s` 
            }}
          />
        ))}
      </div>
      <div className="footer-shooting-star"></div>
      
      <div className="footer-moon"></div>
      <div className="footer-clouds"></div>

      {/* ── Pyramids & Parallax Dunes ── */}
      <div 
        className="footer-pyramids"
        style={{ transform: `translateX(${mousePos.x * 0.5}px)` }}
      >
        <div className="pyramid-silhouette p1"></div>
        <div className="pyramid-silhouette p2"></div>
        <div className="pyramid-silhouette p3"></div>
      </div>
      
      <div className="footer-dunes">
        <div className="sand-trail-glow"></div>
      </div>

      {/* ── Interactive Sand Particles ── */}
      <div className="footer-particle-layer">
        {particles.map((p, i) => (
          <div 
            key={i} className="fps-particle"
            style={{
              left: `${p.l}%`, top: `${p.t}%`,
              width: `${p.s}px`, height: `${p.s}px`,
              transitionDelay: `${p.del}s`,
              transform: `translate(${-mousePos.x * p.mx}px, ${-mousePos.y * p.my}px)`
            }}
          />
        ))}
      </div>

      {/* ── Ambient Hieroglyphs ── */}
      <div className="footer-hieroglyphs">
        {hiero.map((h, i) => (
          <div 
            key={i} className="fh-sym"
            style={{ 
              left: `${h.l}%`, top: `${h.t}%`, 
              animationDuration: `${h.dur}s`, animationDelay: `${h.del}s`
            }}
          >
            {h.char}
          </div>
        ))}
      </div>

      {/* ── Floating Compass ── */}
      <div className="footer-compass">🧭</div>

      {/* ── Glassmorphism Content Panel ── */}
      <div className="footer-glass-panel">
        
        <h2 className="footer-org-title">🏺 Chakravyuh — The Tech Treasure Hunt</h2>
        <div className="footer-org-sub">Organized by CSI-CATT DMCE</div>
        
        <div className="footer-contact-box">
          <div className="fcb-head">📞 For Queries & Registrations</div>
          <div className="fcb-numbers">
            <span className="fcb-num" onMouseEnter={playHoverSound}>📱 8453871717</span>
            <span className="fcb-num" onMouseEnter={playHoverSound}>📱 8149787422</span>
          </div>
        </div>

        <div className="footer-quote">
          ✨ "The treasure may be won… but the legend lives forever."
        </div>

      </div>

    </footer>
  );
}
