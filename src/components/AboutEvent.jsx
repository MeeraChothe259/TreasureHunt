import React, { useEffect, useState, useRef } from 'react';
import './AboutEvent.css';

/* ── Intersection Observer hook ─────────────────────────────── */
const useInView = (options) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);
    if (ref.current) ob.observe(ref.current);
    return () => { if (ref.current) ob.unobserve(ref.current); };
  }, [ref, options]);

  return [ref, inView];
};

/* ── Torch component ────────────────────────────────────────── */
const Torch = ({ position }) => (
  <div className={`torch ${position}`}>
    <div className="flame" />
  </div>
);

/* ── Floating emoji clues ───────────────────────────────────── */
const FloatingClues = () => {
  const clues = ['📱', '🧩', '🗝️', '⚽', '💻', '💡'];
  const [elements, setElements] = useState([]);

  useEffect(() => {
    setElements(
      clues.map((c, i) => ({
        id: i,
        char: c,
        top:  `${Math.random() * 75 + 10}%`,
        left: `${Math.random() * 75 + 10}%`,
        duration: `${Math.random() * 9 + 5}s`,
        delay:    `${Math.random() * 4}s`,
      }))
    );
  }, []);

  return (
    <>
      {elements.map((el) => (
        <div
          key={el.id}
          className="floating-clue"
          style={{
            top: el.top,
            left: el.left,
            animation: `hieroglyphFloatUp ${el.duration} ease-in-out infinite alternate ${el.delay}`,
          }}
        >
          {el.char}
        </div>
      ))}
    </>
  );
};

/* ── Level metadata ─────────────────────────────────────────── */
const LEVELS = [
  {
    num: 1,
    icon: '🔥',
    name: 'The Awakening',
    desc: 'Warm-up riddles to ignite your mind',
  },
  {
    num: 2,
    icon: '🧩',
    name: 'Cipher Halls',
    desc: 'Decode hidden patterns & logic puzzles',
  },
  {
    num: 3,
    icon: '⚡',
    name: 'Arena Rush',
    desc: 'Physical & rapid-fire tech challenges',
  },
  {
    num: 4,
    icon: '🧠',
    name: 'Mind Vault',
    desc: 'Deep problem-solving under pressure',
  },
  {
    num: 5,
    icon: '👑',
    name: 'The Final Chamber',
    desc: 'One treasure. One true champion.',
  },
];

/* ── Main component ─────────────────────────────────────────── */
export default function AboutEvent() {
  const [sectionRef, inView] = useInView({ threshold: 0.25 });
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 18;
    setMousePos({ x, y });
  };

  return (
    <section
      className="about-section"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic background */}
      <div className={`about-bg ${inView ? 'corridor-glow' : 'dark-sand'}`} />

      {/* Stone doors */}
      <div className={`door-container ${inView ? 'is-open rumble' : ''}`}>
        <div className="stone-door left-door"  />
        <div className="stone-door right-door" />
      </div>

      {/* Interior */}
      <div
        className={`pyramid-interior ${inView ? 'visible' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
        }}
      >
        <Torch position="left"  />
        <Torch position="right" />
        <FloatingClues />

        {/* Scarab */}
        <div className="scarab-beetle">𓆣</div>

        {/* Main glass card */}
        <div className="glass-card">

          {/* Typewriter title */}
          <h2 className={`about-title ${inView ? 'typewrite-anim' : ''}`}>
            The Quest Begins...
          </h2>

          {/* Text + image split */}
          <div className="content-split">
            <div className="text-content">
              <p className="glow-entrance delay-1">
                Step into the world of Pharaoh's Quest — where curiosity is your weapon and intelligence is your treasure.
              </p>
              <p className="glow-entrance delay-2">
                Teams of explorers will travel through ancient pyramid chambers, uncover hidden clues, scan mysterious symbols, and decode secrets buried for centuries.
              </p>
              <p className="glow-entrance delay-3">
                Each level is a new challenge — from fun warm-ups to logic puzzles, physical activities to rapid-fire tech battles. The difficulty rises, and only the smartest survive.
              </p>
              <p className="glow-entrance delay-4" style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>
                Follow the glowing trail, conquer all five levels, and unlock the final treasure chamber where victory awaits the true champions.
              </p>
            </div>

            <div className="image-content reveal-image">
              <img src="/students-pyramid.png" alt="Students in Pyramids" className="pyramid-image" />
            </div>
          </div>

          {/* ─── Levels ─────────────────────────────────── */}
          <div className="levels-section">
            <p className="levels-heading">Your Journey Through the Pyramid</p>

            <div className="level-path">
              {/* Background dashed line */}
              <div className="path-line" />
              {/* Animated gold fill */}
              <div className="path-fill" />

              {LEVELS.map((lvl, idx) => (
                <div key={lvl.num} className="level-card">
                  {/* Orbiting badge */}
                  <div className="level-badge">
                    <div className="badge-ring" style={{ animationDuration: `${10 + idx * 2}s` }} />
                    <div className="badge-inner">
                      <span className="badge-num">{lvl.num}</span>
                      <span className="badge-icon">{lvl.icon}</span>
                    </div>
                  </div>

                  {/* Info pill */}
                  <div className="level-info">
                    <span className="level-label">Level {lvl.num}</span>
                    <span className="level-name">{lvl.name}</span>
                    <span className="level-desc">{lvl.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
