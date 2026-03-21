import React, { useEffect, useRef, useState, useCallback } from 'react';
import './QuestJourney.css';
import { playHoverSound, playClickSound, playLevelActivate } from '../utils/audioSystem';

/* ══════════════════════════════════════════════════════════════
   LEVEL DATA
═══════════════════════════════════════════════════════════════ */
const LEVELS = [
  {
    id: 1,
    icon: '𓇳',
    title: 'Cheats',
    type: 'Warm-Up',
    accentColor: '#f0c362',
    glowColor: 'rgba(240,195,98,0.6)',
    heading: 'Warm Up Your Mind',
    sub: 'Start your quest with fun and engaging mini challenges that test awareness and quick thinking.',
    hint: "A gentle beginning — but don't get too comfortable… the real adventure lies ahead.",
    cardClass: 'lvl-warmup',
    emoji: '🏛️',
  },
  {
    id: 2,
    icon: '⚽',
    title: 'Sports',
    type: 'Physical',
    accentColor: '#ff7043',
    glowColor: 'rgba(255,112,67,0.55)',
    heading: 'Move. Compete. Conquer.',
    sub: 'Physical tasks and sports-based challenges push teams to act fast and think faster.',
    hint: 'Energy rises. Competition begins.',
    cardClass: 'lvl-sports',
    emoji: '⚽',
  },
  {
    id: 3,
    icon: '📱',
    title: 'QR Scan',
    type: 'Digital',
    accentColor: '#29b6f6',
    glowColor: 'rgba(41,182,246,0.55)',
    heading: 'Scan the Secrets',
    sub: 'Hidden clues appear only to those who observe carefully.',
    hint: 'Decode images. Unlock the unknown.',
    cardClass: 'lvl-qr',
    emoji: '📱',
  },
  {
    id: 4,
    icon: '𓂋',
    title: 'Code Decode',
    type: 'Logic',
    accentColor: '#ab47bc',
    glowColor: 'rgba(171,71,188,0.55)',
    heading: 'Think Beyond Limits',
    sub: 'Logical reasoning and decoding challenges test intelligence and teamwork.',
    hint: 'One wrong move… and the path fades.',
    cardClass: 'lvl-decode',
    emoji: '🧩',
  },
  {
    id: 5,
    icon: '💻',
    title: 'TechRush',
    type: 'Technical',
    accentColor: '#ef5350',
    glowColor: 'rgba(239,83,80,0.55)',
    heading: 'Final Intelligence Battle',
    sub: 'Rapid fire questions. Memory challenges. Logo guessing.',
    hint: 'Only the smartest teams reach the treasure gate.',
    cardClass: 'lvl-tech',
    emoji: '💻',
  },
];

const EGYPTIAN_SYMBOLS = ['𓂀', '𓆣', '𓋹', '𓍊', '𓎬', '𓀀', '𓃭', '𓂋', '𓍹', '𓀁'];
const CLUE_ICONS = ['📦', '🔑', '🧩', '📱', '💡', '⚡', '🎯', '🔮', '🗝️', '🧬'];

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

const DustParticles = () => {
  const [particles] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      dur: `${Math.random() * 14 + 8}s`,
      delay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.55 + 0.1,
      drift: `${(Math.random() - 0.5) * 80}px`,
    }))
  );
  return (
    <div className="qj-dust-layer" aria-hidden>
      {particles.map(p => (
        <span key={p.id} className="qj-dust" style={{
          left: p.x, width: p.size, height: p.size,
          opacity: p.opacity,
          animationDuration: p.dur,
          animationDelay: p.delay,
          '--drift': p.drift,
        }} />
      ))}
    </div>
  );
};

const EgyptianSymbols = () => {
  const [syms] = useState(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      char: EGYPTIAN_SYMBOLS[i % EGYPTIAN_SYMBOLS.length],
      top: `${Math.random() * 75 + 5}%`,
      left: `${Math.random() * 90 + 2}%`,
      fontSize: `${Math.random() * 36 + 16}px`,
      dur: `${Math.random() * 10 + 6}s`,
      delay: `${Math.random() * 8}s`,
    }))
  );
  return (
    <div className="qj-symbols-layer" aria-hidden>
      {syms.map(s => (
        <span key={s.id} className="qj-symbol" style={{
          top: s.top, left: s.left, fontSize: s.fontSize,
          animationDuration: s.dur, animationDelay: s.delay,
        }}>{s.char}</span>
      ))}
    </div>
  );
};

const FloatingClues = () => {
  const [clues] = useState(() =>
    CLUE_ICONS.map((icon, i) => ({
      id: i, icon,
      top: `${18 + Math.random() * 60}%`,
      left: `${4 + i * 9.5}%`,
      dur: `${Math.random() * 6 + 5}s`,
      delay: `${Math.random() * 4}s`,
    }))
  );
  return (
    <div className="qj-clues-layer" aria-hidden>
      {clues.map(c => (
        <span key={c.id} className="qj-clue-icon" style={{
          top: c.top, left: c.left,
          animationDuration: c.dur, animationDelay: c.delay,
        }}>{c.icon}</span>
      ))}
    </div>
  );
};

const Compass = ({ activeLevel }) => {
  const angles = [0, 72, 144, 216, 288];
  const angle = angles[Math.min(activeLevel, 4)];
  return (
    <div className="qj-compass" title="Quest Compass">
      <div className="qj-compass-outer-ring">
        <div className="qj-compass-ring">
          <span className="comp-n">N</span>
          <span className="comp-e">E</span>
          <span className="comp-s">S</span>
          <span className="comp-w">W</span>
          <div className="qj-compass-needle" style={{ transform: `rotate(${angle}deg)` }}>
            <div className="needle-north" />
            <div className="needle-south" />
          </div>
          <div className="compass-center-dot" />
        </div>
      </div>
      <div className="compass-level-label">Lvl {activeLevel + 1}</div>
    </div>
  );
};

const Sandstorm = ({ active }) => (
  <div className={`qj-sandstorm ${active ? 'storm-active' : ''}`} aria-hidden>
    <div className="storm-grain-layer" />
    <div className="storm-grain-layer grain-2" />
  </div>
);

const Scarab = ({ active }) => (
  <div className={`qj-scarab-wrap ${active ? 'scarab-go' : ''}`} aria-hidden>
    <span className="qj-scarab-icon">𓆣</span>
    <span className="scarab-trail" />
  </div>
);

/* ── SAND BURST PARTICLES ── */
const SandBurst = ({ active, color }) => {
  const [dots] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (360 / 12) * i,
      dist: 30 + Math.random() * 30,
    }))
  );
  if (!active) return null;
  return (
    <div className="sand-burst-container" aria-hidden>
      {dots.map(d => (
        <span key={d.id} className="sand-burst-dot"
          style={{
            '--angle': `${d.angle}deg`,
            '--dist': `${d.dist}px`,
            background: color,
          }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   LEVEL CARD INNER VISUALS
═══════════════════════════════════════════════════════════════ */

const WarmupCard = () => (
  <div className="card-inner">
    <div className="lvl-sparkle-ring">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="sparkle-dot" style={{ '--idx': i }} />
      ))}
    </div>
    <div className="lvl-badge-num bounce-in">1</div>
    <div className="lvl-pyramid-icon">𓇳</div>
    <div className="card-sand-swirl" aria-hidden>
      {[0, 1, 2, 3].map(i => <span key={i} className="swirl-ring" style={{ '--si': i }} />)}
    </div>
    <div className="warm-glow-orb" />
  </div>
);

const SportsCard = () => (
  <div className="card-inner">
    <div className="lvl-badge-num">2</div>
    <div className="sports-icon-wrap">
      <span className="sports-icon">⚽</span>
      <span className="sports-shadow" />
    </div>
    <div className="speed-lines" aria-hidden>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <span key={i} className="speed-line" style={{ '--si': i }} />
      ))}
    </div>
    <div className="motion-blur-bars" aria-hidden>
      {[0, 1, 2].map(i => <span key={i} className="blur-bar" style={{ '--bi': i }} />)}
    </div>
  </div>
);

const QrCard = () => (
  <div className="card-inner">
    <div className="lvl-badge-num">3</div>
    <div className="qr-pyramid-bg" aria-hidden />
    <div className="qr-grid">
      {Array.from({ length: 25 }, (_, i) => (
        <span key={i} className="qr-cell" style={{ '--qi': i }} />
      ))}
    </div>
    <div className="qr-scan-beam" aria-hidden>
      <div className="beam-glow" />
    </div>
    <div className="glitch-particles" aria-hidden>
      {[0, 1, 2, 3, 4].map(i => <span key={i} className="glitch-p" style={{ '--gi': i }} />)}
    </div>
    <div className="neon-hiero" aria-hidden>𓂀</div>
  </div>
);

const DecodeCard = () => {
  const syms = ['𓀀', '𓂀', '𓋹', '𓎬', '𓆣', '𓍊', '𓂋', '𓃭', '𓍹'];
  return (
    <div className="card-inner">
      <div className="lvl-badge-num">4</div>
      <div className="decode-fog" aria-hidden />
      <div className="hieroglyph-grid">
        {syms.map((s, i) => (
          <span key={i} className="hg-sym" style={{ '--hi': i }}>{s}</span>
        ))}
      </div>
      <svg className="neural-lines" viewBox="0 0 200 120" fill="none">
        <path d="M20 60 Q60 20 100 60 Q140 100 180 60" stroke="rgba(171,71,188,0.5)" strokeWidth="1.5" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M20 80 Q80 30 140 80" stroke="rgba(171,71,188,0.3)" strokeWidth="1" strokeDasharray="3 5">
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M20 40 Q100 80 180 40" stroke="rgba(200,100,220,0.2)" strokeWidth="1" strokeDasharray="2 6">
          <animate attributeName="stroke-dashoffset" from="0" to="-15" dur="4s" repeatCount="indefinite" />
        </path>
        {[20, 60, 100, 140, 180].map((x, i) => (
          <circle key={i} cx={x} cy={60} r="4" fill="rgba(171,71,188,0.7)">
            <animate attributeName="r" values="4;7;4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
};

const TechCard = () => (
  <div className="card-inner">
    <div className="lvl-badge-num">5</div>
    <div className="mem-grid">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="mem-cell" style={{ '--mi': i }} />
      ))}
    </div>
    <div className="tech-lightning" aria-hidden>
      {[0, 1, 2, 3].map(i => <span key={i} className="bolt" style={{ '--bi': i }}>⚡</span>)}
    </div>
    <div className="hologram-overlay" aria-hidden />
    <div className="tech-scan-ring" aria-hidden>
      {[0, 1].map(i => <span key={i} className="scan-ring" style={{ '--ri': i }} />)}
    </div>
  </div>
);

const CARD_RENDERS = [WarmupCard, SportsCard, QrCard, DecodeCard, TechCard];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function QuestJourney({ visible = true }) {
  const sectionRef   = useRef(null);
  const scrollRef    = useRef(null);
  const [inView, setInView]           = useState(false);
  const [activeLevel, setActiveLevel] = useState(0);
  const [trailWidth, setTrailWidth]   = useState(0);
  const [storm, setStorm]             = useState(false);
  const [scarab, setScarab]           = useState(false);
  const [clickedCard, setClickedCard] = useState(null);
  const [sandBurst, setSandBurst]     = useState(null);
  const [mousePos, setMousePos]       = useState({ x: 0, y: 0 });
  const [scrollPct, setScrollPct]     = useState(0);
  const [isDragging, setIsDragging]   = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const dragStart      = useRef({ x: 0, scrollLeft: 0 });
  const lastLevel      = useRef(0);
  const lastScrollPos  = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const speedTimeout   = useRef(null);

  /* Intersection observer */
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          setTimeout(() => setScarab(true), 2500);
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    );
    if (sectionRef.current) ob.observe(sectionRef.current);
    
    return () => {
      ob.disconnect();
    };
  }, []);

  /* Horizontal scroll → trail + active level */
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Calculate scroll speed
    const now = Date.now();
    const dt = now - lastScrollTime.current;
    if (dt > 0) {
      const dx = Math.abs(el.scrollLeft - lastScrollPos.current);
      const speed = dx / dt; // pixels per ms
      setScrollSpeed(speed);
      
      if (speedTimeout.current) clearTimeout(speedTimeout.current);
      speedTimeout.current = setTimeout(() => setScrollSpeed(0), 150);
    }
    lastScrollTime.current = now;
    lastScrollPos.current = el.scrollLeft;

    const pct = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    setScrollPct(pct);
    setTrailWidth(Math.min(pct * 108, 100));

    const lvl = Math.min(Math.floor(pct * 5), 4);
    setActiveLevel(lvl);

    if (lvl !== lastLevel.current) {
      setStorm(true);
      setTimeout(() => setStorm(false), 900);
      setSandBurst(lvl);
      setTimeout(() => setSandBurst(null), 800);
      lastLevel.current = lvl;
    }
  }, []);

  /* Mouse tilt */
  const onMouseMove = useCallback((e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    setMousePos({
      x: ((e.clientX - r.left) / r.width - 0.5) * 12,
      y: ((e.clientY - r.top) / r.height - 0.5) * 6,
    });
  }, []);

  /* Drag-to-scroll */
  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current.scrollLeft };
    scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };
  const onMouseDrag = (e) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  /* Card click */
  const handleCardClick = (id) => {
    // Determine tone based on sequence logic or just randomize a tech ping
    Math.random() > 0.5 ? playLevelActivate() : playClickSound();
    setClickedCard(id);
    setTimeout(() => setClickedCard(null), 800);
  };

  /* Parallax offsets */
  const bgShift  = scrollPct * -130;
  const midShift = scrollPct * -45;

  if (!visible) return null;

  return (
    <section
      id="quest-journey"
      className={`qj-section ${inView ? 'qj-visible' : ''}`}
      ref={sectionRef}
      onMouseMove={onMouseMove}
    >
      {/* Parchment base with mouse tilt */}
      <div className="qj-parchment" style={{
        transform: `perspective(1400px) rotateX(${-mousePos.y * 0.25}deg) rotateY(${mousePos.x * 0.25}deg)`,
      }}>

        {/* Torn edges */}
        <div className="torn-top" aria-hidden />
        <div className="torn-bottom" aria-hidden />

        {/* Burn marks overlays on top */}
        <div className="burn-marks" aria-hidden />

        {/* Parallax bg — pyramid silhouettes */}
        <div className="qj-bg-pyramids" aria-hidden
          style={{ transform: `translateX(${bgShift}px)` }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`pyramid-sil p${i}`} />
          ))}
        </div>

        {/* Ambient glow waves (visual wind) */}
        <div className="qj-ambient" aria-hidden>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="ambient-wave" style={{ '--ai': i }} />
          ))}
        </div>

        {/* Egyptian symbols */}
        <EgyptianSymbols />

        {/* Dust */}
        <DustParticles />

        {/* Floating clue icons */}
        <FloatingClues />

        {/* Compass */}
        <Compass activeLevel={activeLevel} />

        {/* Sandstorm */}
        <Sandstorm active={storm} />

        {/* Scarab */}
        <Scarab active={scarab} />

        {/* ── SECTION HEADER ── */}
        <div className="qj-header">
          <span className="qj-eyebrow">𓋹 The Path to Chakravyuh 𓋹</span>
          <h2 className="qj-title">Quest Journey</h2>
          <p className="qj-hint-text">
            ← Drag the map to explore your expedition →
          </p>
        </div>

        {/* ── HORIZONTAL SCROLL TRACK ── */}
        <div
          className="qj-scroll-track"
          ref={scrollRef}
          onScroll={onScroll}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseDrag}
        >
          <div className="qj-track-inner" style={{
            transform: `translateY(${midShift * 0.18}px)`,
          }}>

            {/* Dotted trail background */}
            <div className="trail-bg" aria-hidden />
            {/* Animated golden fill */}
            <div className="trail-fill" style={{ 
              width: `${trailWidth}%`,
              filter: `brightness(${1 + Math.min(scrollSpeed * 0.8, 1.2)})`
            }} aria-hidden>
              <div className="trail-sparkle" style={{
                animationDuration: `${Math.max(0.2, 0.8 - scrollSpeed * 0.15)}s`
              }} />
            </div>

            {/* ── LEVEL CARDS ── */}
            {LEVELS.map((lvl, idx) => {
              const CardInner = CARD_RENDERS[idx];
              const isActive  = activeLevel === idx;
              const isDone    = activeLevel > idx;
              const isLocked  = !isDone && !isActive;
              return (
                <div
                  key={lvl.id}
                  className={`qj-level-card ${lvl.cardClass} ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''} ${isLocked ? 'is-locked' : ''} ${clickedCard === lvl.id ? 'is-clicked' : ''}`}
                  style={{ '--accent': lvl.accentColor, '--glow': lvl.glowColor }}
                  onClick={() => handleCardClick(lvl.id)}
                  onMouseEnter={() => playHoverSound()}
                >
                  {/* Radiant aura */}
                  <div className="card-aura" />

                  {/* Neon border sweep */}
                  <div className="card-border-sweep" />

                  {/* Lock icon strips off when active */}
                  {isLocked && (
                    <div className={`card-lock ${isActive ? 'lock-break' : ''}`}>🔒</div>
                  )}

                  {/* Done checkmark */}
                  {isDone && <div className="card-done-mark">✓</div>}

                  {/* Sand burst on activation */}
                  {sandBurst === idx && <SandBurst active color={lvl.accentColor} />}

                  {/* Unique inner visuals */}
                  <CardInner />

                  {/* Text */}
                  <div className="card-text">
                    <div className="card-level-label">Level {lvl.id}</div>
                    <div className="card-type">{lvl.type}</div>
                    <h3 className="card-title">{lvl.title}</h3>
                    <p className="card-heading">{lvl.heading}</p>
                    <p className="card-sub">{lvl.sub}</p>
                    <p className="card-hint">{lvl.hint}</p>
                  </div>

                  {/* Soundwave hover visualizer */}
                  <div className="card-soundwave" aria-hidden>
                    {Array.from({ length: 11 }, (_, i) => (
                      <span key={i} className="sw-bar" style={{ '--swi': i }} />
                    ))}
                  </div>

                  {/* Click ripple */}
                  {clickedCard === lvl.id && (
                    <div className="card-ripple" style={{ '--accent': lvl.accentColor }} />
                  )}

                  {/* Checkpoint dot on trail */}
                  <div className={`checkpoint-dot ${isActive ? 'pulse-dot' : ''} ${isDone ? 'done-dot' : ''}`}>
                    <span>{lvl.id}</span>
                  </div>

                  {/* Active indicator card glow bottom bar */}
                  {isActive && <div className="card-active-bar" style={{ background: lvl.accentColor }} />}
                </div>
              );
            })}

          </div>
        </div>

        {/* ── BOTTOM PROGRESS BAR ── */}
        <div className="qj-progress-bar">
          <div className="qj-progress-fill" style={{
            width: `${scrollPct * 100}%`,
            background: `linear-gradient(90deg, #b8860b, ${LEVELS[activeLevel].accentColor})`,
          }}>
            <div className="progress-glow-tip" style={{ background: LEVELS[activeLevel].accentColor }} />
          </div>
          <span className="qj-progress-label">
            {activeLevel < 4
              ? `Level ${activeLevel + 1} — ${LEVELS[activeLevel].type}`
              : '🏆 Final Chamber!'}
          </span>
        </div>

      </div>
    </section>
  );
}
