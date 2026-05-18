'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

const C = {
  cream:  '#1A3328',
  ink:    '#0D2118',
  amber:  '#85AB8B',
  white:  '#FFFFFF',
  yellow: '#A8D4B4',
  mint:   '#6ECFA0',
  pink:   '#B5DCC2',
  muted:  '#7BA88A',
} as const;

const TEXT_ON_DARK = '#F0F7F1';
const TEXT_MUTED_ON_DARK = 'rgba(240,247,241,0.6)';

const BORDER = `2px solid ${C.ink}`;
const CARD_SHADOW  = `5px 5px 0px ${C.ink}`;
const BTN_SHADOW   = `4px 4px 0px ${C.ink}`;
const BTN_SHADOW_SM = `2px 2px 0px ${C.ink}`;

const APP_URL = '/app';

const MARQUEE_ITEMS = [
  'Pomodoro Timer', 'Streak Tracking', 'Ambient Sounds', 'Focus Heatmap',
  'Task Tracking',  'Beautiful Backgrounds', 'Deep Work', 'Daily Habits',
  'Pomodoro Timer', 'Streak Tracking', 'Ambient Sounds', 'Focus Heatmap',
  'Task Tracking',  'Beautiful Backgrounds', 'Deep Work', 'Daily Habits',
];

const FEATURES = [
  {
    emoji: '⏱',
    title: 'Pomodoro Timer',
    desc: 'Focus sessions, short breaks, long breaks — fully customisable. Hit space to start. That\'s it.',
    wide: true,
    accent: C.yellow,
  },
  {
    emoji: '🎵',
    title: 'Ambient Sounds',
    desc: 'Rain, fire, coffee shop, waves. Mix at custom volumes for your perfect environment.',
    wide: false,
    accent: C.mint,
  },
  {
    emoji: '🖼',
    title: 'Backgrounds',
    desc: 'Curated looping videos. Switch scenes without breaking flow.',
    wide: false,
    accent: C.pink,
  },
  {
    emoji: '🔥',
    title: 'Streak Tracking',
    desc: 'Every session builds your streak. Watch discipline compound daily.',
    wide: false,
    accent: C.yellow,
  },
  {
    emoji: '📊',
    title: 'Focus Heatmap',
    desc: 'GitHub-style activity graph across the full year. See your growth.',
    wide: false,
    accent: C.mint,
  },
  {
    emoji: '✅',
    title: 'Task Tracking',
    desc: 'Set intention before each session. Stay intentional, stay on target.',
    wide: false,
    accent: C.pink,
  },
] as const;

const STEPS = [
  { n: '01', title: 'Set your intention',   desc: 'Type what you\'re working on. A clear task is the difference between drifting and doing.' },
  { n: '02', title: 'Start the timer',       desc: 'Hit space or press play. The timer runs, your streak watches.' },
  { n: '03', title: 'Build your environment', desc: 'Choose a background, mix ambient sounds. Make the space feel like yours.' },
  { n: '04', title: 'Watch your progress',   desc: 'Every session fills your heatmap. Streaks grow. Your focus history becomes motivation.' },
];

const HEATMAP_SEED = [
  0.1,0.8,0.9,0.2,0.7,0.95,0.3,0.6,0.85,0.1,0.4,0.9,0.75,0.2,0.5,
  0.88,0.3,0.7,0.15,0.6,0.9,0.4,0.8,0.25,0.7,0.95,0.5,0.3,0.85,0.1,
  0.6,0.9,0.2,0.75,0.4,0.85,0.3,0.9,0.1,0.7,0.5,0.88,0.2,0.6,0.4,
  0.95,0.1,0.8,0.3,0.7,0.9,0.2,0.5,0.85,0.4,0.6,0.3,0.9,0.1,0.75,
  0.5,0.85,0.2,0.6,0.4,0.9,0.3,0.7,0.1,0.8,0.5,0.9,0.2,0.6,0.4,
  0.88,0.1,0.7,0.3,0.9,0.5,0.2,0.85,0.4,0.6,0.1,0.9,0.3,0.75,0.5,
  0.8,0.2,0.6,0.4,0.9,0.1,0.7,0.3,0.85,0.5,
];

function card(extra?: React.CSSProperties): React.CSSProperties {
  return { background: C.white, border: BORDER, boxShadow: CARD_SHADOW, borderRadius: 0, color: C.ink, ...extra };
}

function btn(bg: string, color: string = C.ink, small = false): React.CSSProperties {
  return {
    background: bg,
    border: BORDER,
    boxShadow: small ? BTN_SHADOW_SM : BTN_SHADOW,
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 700,
    color,
    transition: 'transform 0.07s ease, box-shadow 0.07s ease',
    userSelect: 'none' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isInView };
}

interface FadeInProps { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties; }
function FadeIn({ children, delay = 0, className, style }: FadeInProps) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}


function HeatmapBlock() {
  const heatmap = useMemo(
    () => Array.from({ length: 7 * 52 }, (_, i) => HEATMAP_SEED[i % HEATMAP_SEED.length]),
    []
  );

  return (
    <div style={card({ padding: '28px 28px' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>Focus Activity</span>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', fontWeight: 600, color: C.muted }}>
          <span>124h total</span>
          <span>38 days</span>
          <span>7 streak 🔥</span>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateRows: 'repeat(7, 1fr)',
          gap: 3,
          width: 'max-content',
        }}>
          {heatmap.map((value, i) => (
            <div
              key={i}
              style={{
                width: 13, height: 13,
                border: `1.5px solid ${C.ink}`,
                background: value > 0.85 ? `rgba(133,171,139,0.95)`
                  : value > 0.7 ? `rgba(133,171,139,0.65)`
                  : value > 0.55 ? `rgba(133,171,139,0.4)`
                  : value > 0.4 ? `rgba(133,171,139,0.2)`
                  : '#E8F5EC',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: C.muted }}>Less</span>
        {[0, 0.2, 0.4, 0.65, 0.95].map(op => (
          <div key={op} style={{
            width: 12, height: 12,
            border: `1.5px solid ${C.ink}`,
            background: op === 0 ? '#E8F5EC' : `rgba(133,171,139,${op})`,
          }} />
        ))}
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: C.muted }}>More</span>
      </div>
    </div>
  );
}

export default function LandingPage() {

  const NAV_LINKS = [
    { label: 'Features',    href: '#features' },
    { label: 'How It Works', href: '#steps'   },
    { label: 'Progress',    href: '#progress' },
    { label: 'Blog',        href: '/blog'      },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .neo-btn:hover  { transform: translateY(2px) !important; box-shadow: 2px 2px 0px ${C.ink} !important; }
        .neo-btn:active { transform: translateY(3px) !important; box-shadow: 1px 1px 0px ${C.ink} !important; }
        .task-input:focus { outline: none; box-shadow: 5px 5px 0px ${C.ink}; }
        .task-input::placeholder { color: ${C.muted}; opacity: 0.8; }
        @keyframes rec-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.3;transform:scale(0.75);} }
        .rec-dot { animation: rec-pulse 1.1s ease-in-out infinite; }
        @keyframes marquee { 0%{transform:translateX(0);}100%{transform:translateX(-50%);} }
        html { scroll-behavior: smooth; scroll-padding-top: 90px; }
        .nav-link { transition: color 0.18s ease, opacity 0.18s ease; }
        .nav-link:hover { color: ${C.amber} !important; opacity: 0.9; }
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
          .nav-pill { padding: 8px 10px 8px 16px !important; gap: 12px !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .feat-wide { grid-column: span 1 !important; }
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .progress-grid { grid-template-columns: 1fr !important; }
          .hero-section { padding: 40px 16px 56px !important; }
          .sections-pad { padding-left: 16px !important; padding-right: 16px !important; }
        }
        @media (max-width: 400px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: C.cream,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        color: TEXT_ON_DARK,
        overflowX: 'hidden',
      }}>

        {/* ── Navbar ── */}
        <header style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 50, background: C.cream }}>
          <nav className="nav-pill" style={{
            background: C.white, border: BORDER,
            boxShadow: BTN_SHADOW, borderRadius: '999px',
            padding: '10px 20px 10px 28px',
            display: 'flex', alignItems: 'center', gap: 28, color: C.ink,
          }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.03em', color: C.ink }}>
              FocusWaqt
            </span>

            <div className="nav-links" style={{ display: 'flex', gap: 20 }}>
              {NAV_LINKS.filter(l => l.href !== '/blog').map(l => (
                <a key={l.href} href={l.href} className="nav-link" style={{
                  fontWeight: 600, fontSize: '0.87rem', color: C.ink,
                  textDecoration: 'none', letterSpacing: '-0.01em',
                }}>
                  {l.label}
                </a>
              ))}
            </div>
            <a href="/blog" className="nav-link" style={{
              fontWeight: 600, fontSize: '0.87rem', color: C.ink,
              textDecoration: 'none', letterSpacing: '-0.01em',
              border: BORDER, padding: '4px 12px', boxShadow: BTN_SHADOW_SM, borderRadius: 8,
            }}>
              Blog
            </a>

            <a
              href={APP_URL}
              className="neo-btn"
              style={{ ...btn(C.amber, C.white), padding: '8px 20px', fontSize: '0.87rem', letterSpacing: '-0.01em', textDecoration: 'none' }}
            >
              Start Focusing →
            </a>
          </nav>
        </header>

        {/* ── Hero ── */}
        <section className="hero-section" style={{ padding: '72px 24px 80px', textAlign: 'center', maxWidth: 820, margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 800, letterSpacing: '-0.04em',
            lineHeight: 0.95, marginBottom: 28,
          }}>
            Deep focus,<br />
            <span style={{ color: C.amber }}>every single</span><br />
            day.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 600,
            color: TEXT_MUTED_ON_DARK, maxWidth: 480, margin: '0 auto 48px',
            lineHeight: 1.5, letterSpacing: '-0.01em',
          }}>
            A Pomodoro timer built for people who take deep work seriously.
            No clutter. Just you and the work.
          </p>

          <a href={APP_URL} className="neo-btn" style={{
            ...btn(C.white, C.ink), padding: '18px 48px',
            fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em', textDecoration: 'none',
          }}>
            Get Started
          </a>
        </section>

        {/* ── Marquee ── */}
        <div style={{
          borderTop: BORDER, borderBottom: BORDER,
          background: C.ink, padding: '14px 0', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', gap: 32, width: 'max-content', animation: 'marquee 28s linear infinite' }}>
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} style={{
                display: 'flex', alignItems: 'center', gap: 24,
                color: TEXT_ON_DARK, fontSize: '0.88rem', fontWeight: 600,
                whiteSpace: 'nowrap', letterSpacing: '0.01em',
              }}>
                {item}
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.amber, display: 'inline-block' }} />
              </span>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <section id="features" style={{ padding: '96px 24px', maxWidth: 900, margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.amber, marginBottom: 16 }}>
              Features
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.97 }}>
              Everything you need<br />
              <span style={{ color: TEXT_MUTED_ON_DARK }}>to do your best work</span>
            </h2>
          </FadeIn>

          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {/* Wide card first */}
            <FadeIn delay={0} className="feat-wide" style={{ gridColumn: 'span 2' }}>
              <div style={card({ padding: '32px 28px', height: '100%' })}>
                <div style={{
                  width: 44, height: 44, background: FEATURES[0].accent,
                  border: BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', marginBottom: 20, flexShrink: 0,
                }}>
                  {FEATURES[0].emoji}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', marginBottom: 10 }}>{FEATURES[0].title}</h3>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', color: C.muted, lineHeight: 1.55, maxWidth: 360 }}>{FEATURES[0].desc}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                  {['25 min', '5 min', '15 min'].map((label, i) => (
                    <span key={label} style={{
                      padding: '5px 14px', border: BORDER,
                      background: i === 0 ? C.yellow : '#E8F5EC',
                      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '-0.01em',
                      boxShadow: BTN_SHADOW_SM,
                    }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            {FEATURES.slice(1).map((f, i) => (
              <FadeIn key={f.title} delay={i * 50}>
                <div style={card({ padding: '24px 22px', height: '100%' })}>
                  <div style={{
                    width: 36, height: 36, background: f.accent,
                    border: BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', marginBottom: 14, flexShrink: 0,
                  }}>
                    {f.emoji}
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontWeight: 600, fontSize: '0.8rem', color: C.muted, lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="steps" style={{
          borderTop: BORDER, borderBottom: BORDER,
          background: C.ink, color: C.cream,
          padding: '96px 24px',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.amber, marginBottom: 16 }}>
                How It Works
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.97, color: TEXT_ON_DARK }}>
                Simple by design,<br />
                <span style={{ color: 'rgba(240,247,241,0.4)' }}>powerful by habit</span>
              </h2>
            </FadeIn>

            <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {STEPS.map((s, i) => (
                <FadeIn key={s.n} delay={i * 80}>
                  <div style={{
                    border: BORDER, borderColor: 'rgba(240,247,241,0.15)',
                    padding: '32px 24px', height: '100%',
                  }}>
                    <div style={{
                      fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                      letterSpacing: '-0.05em', lineHeight: 1, color: C.amber,
                      marginBottom: 16,
                    }}>
                      {s.n}
                    </div>
                    <div style={{ width: 28, height: 2, background: C.amber, marginBottom: 16 }} />
                    <h3 style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em', marginBottom: 10, color: TEXT_ON_DARK }}>{s.title}</h3>
                    <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'rgba(240,247,241,0.55)', lineHeight: 1.55 }}>{s.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Progress / Heatmap ── */}
        <section id="progress" style={{ padding: '96px 24px', maxWidth: 900, margin: '0 auto' }}>
          <div className="progress-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <FadeIn>
              <p style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.amber, marginBottom: 16 }}>
                Progress
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.97, marginBottom: 24 }}>
                Your focus,<br />
                <span style={{ color: TEXT_MUTED_ON_DARK }}>visualised</span>
              </h2>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: TEXT_MUTED_ON_DARK, lineHeight: 1.6, marginBottom: 28, maxWidth: 360 }}>
                Every session logged. Watch your annual heatmap fill up — the same feeling as a green GitHub graph, but for deep work.
              </p>
              {[
                'GitHub-style heatmap across the full year',
                'Daily streak counter with fire indicator',
                'Total focus hours, active days, longest streak',
                'Session history auto-saved to your account',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, background: C.amber, border: BORDER, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontWeight: 600, fontSize: '0.87rem', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </FadeIn>
            <FadeIn delay={120}>
              <HeatmapBlock />
            </FadeIn>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '96px 24px' }}>
          <FadeIn>
            <div style={{
              ...card({ padding: '64px 40px' }),
              maxWidth: 700, margin: '0 auto', textAlign: 'center',
            }}>
              <p style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.amber, marginBottom: 20, opacity: 0.8 }}>
                Get Started
              </p>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
                letterSpacing: '-0.04em', lineHeight: 0.95,
                color: C.ink, marginBottom: 20,
              }}>
                Your most focused day<br />starts right now.
              </h2>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: C.muted, marginBottom: 36, maxWidth: 380, margin: '0 auto 36px', lineHeight: 1.55 }}>
                No install. No setup. Just open the app and start your first session.
              </p>
              <a href={APP_URL} className="neo-btn" style={{
                ...btn(C.amber, C.white), padding: '18px 48px',
                fontSize: '1.1rem', fontWeight: 800,
                letterSpacing: '-0.01em', textDecoration: 'none',
                display: 'inline-flex',
              }}>
                Open FocusWaqt →
              </a>
            </div>
          </FadeIn>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: BORDER, background: C.white, padding: '28px 32px' }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontWeight: 600, fontSize: '0.85rem', color: C.muted, flexWrap: 'wrap', gap: 12,
          }}>
            <a href="https://github.com/heyitsmohdd/fucuswaqt" target="_blank" rel="noopener noreferrer"
              className="nav-link" style={{ fontWeight: 800, color: C.ink, textDecoration: 'none' }}>
              GitHub
            </a>
            <span>© {new Date().getFullYear()} FocusWaqt.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="/blog" className="nav-link" style={{ color: C.muted, textDecoration: 'none' }}>Blog</a>
              <a href={APP_URL} className="nav-link" style={{ color: C.ink, fontWeight: 800, textDecoration: 'none' }}>Open App →</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
