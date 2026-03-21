import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import './App.css';
import AboutEvent from './components/AboutEvent';
import QuestJourney from './components/QuestJourney';
import Rules from './components/Rules';
import Faqs from './components/Faqs';
import FinalTreasure from './components/FinalTreasure';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';
import { playAmbientDrone, playClickSound, initAudio, playBoomSound } from './utils/audioSystem';

const SandParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 5 + 1}px`,
      duration: `${Math.random() * 8 + 5}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="sand-particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `sandDrift ${p.duration} infinite linear ${p.delay}`
          }}
        />
      ))}
    </div>
  );
};

const Hieroglyphs = () => {
  const [symbols, setSymbols] = useState([]);
  const hieroglyphChars = ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇', '𓀈', '𓃭', '𓃯', '𓃰', '𓃱', '𓃲', '𓍊', '𓋹', '𓍹', '𓎬'];

  useEffect(() => {
    const newSymbols = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      char: hieroglyphChars[Math.floor(Math.random() * hieroglyphChars.length)],
      left: `${Math.random() * 100}vw`,
      fontSize: `${Math.random() * 40 + 20}px`,
      duration: `${Math.random() * 15 + 12}s`,
      delay: `${Math.random() * 8}s`,
    }));
    setSymbols(newSymbols);
  }, []);

  return (
    <div className="hieroglyphs-container">
      {symbols.map((s) => (
        <div
          key={s.id}
          className="hieroglyph"
          style={{
            left: s.left,
            fontSize: s.fontSize,
            animation: `hieroglyphFloatUp ${s.duration} infinite ease-in-out ${s.delay}`
          }}
        >
          {s.char}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const questRef = useRef(null);
  const [showQuest, setShowQuest] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleAppInteraction = () => {
    if (!hasStartedAudio) {
      initAudio();
      playBoomSound();
      playAmbientDrone();
      setHasStartedAudio(true);
    }
  };

  const openRegistration = () => {
    playClickSound();
    playAmbientDrone();
    setShowRegistration(true);
  };

  const handleExploreLevels = () => {
    playClickSound();
    playAmbientDrone();
    setTimeout(() => {
      questRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="app-wrapper" onClick={handleAppInteraction}>
      <div className="hero-container" onMouseMove={handleMouseMove} ref={containerRef}>
        {/* Background with parallax effect reacting to mouse */}
        <img 
          src="/pharaoh-bg.png" 
          alt="Pharaoh's Quest Desert" 
          className="hero-bg" 
          style={{
            transform: `scale(1.1) translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)`
          }}
        />
        
        {/* Mystical overlapping gradients */}
        <div className="hero-overlay"></div>
        <div className="hero-glow-ring"></div>
        
        {/* Dynamic Particle Systems */}
        <SandParticles />
        <Hieroglyphs />

        {/* Hero Content with 3D Tilt based on mouse position */}
        <div 
          className="hero-content"
          style={{
            transform: `perspective(1200px) rotateY(${mousePosition.x * 20}deg) rotateX(${-mousePosition.y * 20}deg)`
          }}
        >
          <div className="title-wrapper">
            <h1 className="hero-title">Chakravyuh</h1>
            <h2 className="hero-subtitle-glow">The Tech Treasure Hunt</h2>
          </div>
          
          <p className="hero-description shimmer-text">
            <span>5 Levels.</span> 1 Treasure. Only the smartest survive.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary pulse-btn" onClick={openRegistration}>
              <span className="btn-content">Register Now</span>
              <div className="btn-glare"></div>
            </button>
            <button className="btn btn-secondary slide-btn" onClick={handleExploreLevels}>
              <span className="btn-content">Explore Levels</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Triggered About Section */}
      <AboutEvent />

      {/* Quest Journey */}
      <div ref={questRef}>
        <QuestJourney visible={true} />
      </div>

      {/* Rules Section (Pre-Arena) */}
      <Rules />

      {/* FAQ Section (Knowledge Chamber) */}
      <Faqs />

      {/* Final Treasure Round (Climax) */}
      <FinalTreasure />

      {/* Cinematic Night Footer (Resolution) */}
      <Footer />

      {/* Registration Modal Overlay */}
      {showRegistration && <RegistrationModal onClose={() => setShowRegistration(false)} />}
    </div>
  );
}

export default App;
