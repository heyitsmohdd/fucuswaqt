'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  LogIn, Menu, X, Timer, Flame, BarChart2,
  Music, Image as ImageIcon, CheckCircle2, ArrowRight, ArrowDown,
} from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';
const APP_URL = 'https://focuswaqt.space';

const MARQUEE_ITEMS = [
  'Pomodoro Timer', 'Streak Tracking', 'Ambient Sounds', 'Focus Heatmap',
  'Task Tracking', 'Beautiful Backgrounds', 'Deep Work', 'Daily Habits',
  'Pomodoro Timer', 'Streak Tracking', 'Ambient Sounds', 'Focus Heatmap',
  'Task Tracking', 'Beautiful Backgrounds', 'Deep Work', 'Daily Habits',
];

const FEATURES = [
  {
    icon: <Timer className="w-7 h-7" />,
    title: 'Pomodoro Timer',
    description: 'Focus sessions, short breaks, long breaks — fully customisable. Hit space to start. That\'s it.',
    large: true,
  },
  {
    icon: <Music className="w-5 h-5" />,
    title: 'Ambient Soundscapes',
    description: 'Rain, fire, coffee shop, waves. Mix sounds at custom volumes to build your perfect environment.',
    large: false,
  },
  {
    icon: <ImageIcon className="w-5 h-5" />,
    title: 'Beautiful Backgrounds',
    description: 'Curated looping videos. Switch scenes instantly without breaking flow.',
    large: false,
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: 'Streak Tracking',
    description: 'Every completed session builds your streak. Watch discipline compound daily.',
    large: false,
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: 'Focus Heatmap',
    description: 'GitHub-style activity graph across the full year. See your growth.',
    large: false,
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'Task Tracking',
    description: 'Set your intention before each session. Stay intentional, stay on target.',
    large: false,
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Set your intention',
    description: 'Type what you\'re working on. A clear task before the session is the difference between drifting and doing.',
  },
  {
    number: '02',
    title: 'Start the timer',
    description: 'Hit space or press play. The timer runs, your streak watches. No distractions — just the work.',
  },
  {
    number: '03',
    title: 'Build your environment',
    description: 'Choose a background, mix ambient sounds. Make the space feel like yours.',
  },
  {
    number: '04',
    title: 'Watch your progress',
    description: 'Every session fills your heatmap. Streaks grow. Your focus history becomes motivation.',
  },
];

const MOCK_HEATMAP_SEED = [
  0.1, 0.8, 0.9, 0.2, 0.7, 0.95, 0.3, 0.6, 0.85, 0.1, 0.4, 0.9, 0.75, 0.2, 0.5,
  0.88, 0.3, 0.7, 0.15, 0.6, 0.9, 0.4, 0.8, 0.25, 0.7, 0.95, 0.5, 0.3, 0.85, 0.1,
  0.6, 0.9, 0.2, 0.75, 0.4, 0.85, 0.3, 0.9, 0.1, 0.7, 0.5, 0.88, 0.2, 0.6, 0.4,
  0.95, 0.1, 0.8, 0.3, 0.7, 0.9, 0.2, 0.5, 0.85, 0.4, 0.6, 0.3, 0.9, 0.1, 0.75,
  0.5, 0.85, 0.2, 0.6, 0.4, 0.9, 0.3, 0.7, 0.1, 0.8, 0.5, 0.9, 0.2, 0.6, 0.4,
  0.88, 0.1, 0.7, 0.3, 0.9, 0.5, 0.2, 0.85, 0.4, 0.6, 0.1, 0.9, 0.3, 0.75, 0.5,
  0.8, 0.2, 0.6, 0.4, 0.9, 0.1, 0.7, 0.3, 0.85, 0.5,
];

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
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

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'none';
  className?: string;
}

function FadeIn({ children, delay = 0, direction = 'up', className = '' }: FadeInProps) {
  const { ref, isInView } = useInView();
  const translateY = direction === 'up' ? (isInView ? 0 : 32) : 0;
  const translateX = direction === 'left' ? (isInView ? 0 : 32) : 0;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: `translateY(${translateY}px) translateX(${translateX}px)`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AppMockup() {
  const miniHeatmap = useMemo(
    () => MOCK_HEATMAP_SEED.slice(0, 3 * 18).map(v => v),
    []
  );

  return (
    <div className="relative w-full max-w-[320px] mx-auto lg:mx-0">
      <div className="absolute -inset-8 bg-[#85AB8B]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="relative bg-[#0a0f0a]/70 backdrop-blur-2xl border border-white/12 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <span className="text-white/40 text-xs font-medium tracking-wide">FocusWaqt</span>
          <div className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/20 px-2.5 py-1 rounded-full">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-orange-400 text-xs font-semibold">7</span>
          </div>
        </div>

        <div className="text-center mb-5">
          <div
            className="text-white font-extralight tabular-nums"
            style={{ fontSize: '3.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            25:00
          </div>
          <div className="text-white/25 text-[10px] uppercase tracking-[0.2em] mt-2">Focus Session</div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          {['Focus', 'Short', 'Long'].map((label, i) => (
            <div
              key={label}
              className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                i === 0
                  ? 'bg-[#85AB8B]/20 text-[#85AB8B] border border-[#85AB8B]/25'
                  : 'text-white/25 hover:text-white/40'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-4">
          <div className="text-white/30 text-[9px] uppercase tracking-widest mb-2">Activity</div>
          <div className="grid grid-flow-col grid-rows-3 gap-[3px]">
            {miniHeatmap.map((value, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-[2px]"
                style={{
                  backgroundColor: value > 0.6
                    ? `rgba(133, 171, 139, ${0.3 + value * 0.7})`
                    : 'rgba(255,255,255,0.04)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatmapShowcase() {
  const heatmapData = useMemo(
    () => Array.from({ length: 7 * 52 }, (_, i) => MOCK_HEATMAP_SEED[i % MOCK_HEATMAP_SEED.length]),
    []
  );

  return (
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-6 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <span className="text-white/60 text-sm font-medium">Focus Activity</span>
        <div className="flex items-center gap-5 text-xs text-white/35">
          <span>124h total</span>
          <span>38 days</span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>7 streak</span>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-max">
          {heatmapData.map((value, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-[2px]"
              style={{
                backgroundColor: value > 0.85
                  ? 'rgba(133,171,139,0.95)'
                  : value > 0.7
                  ? 'rgba(133,171,139,0.65)'
                  : value > 0.55
                  ? 'rgba(133,171,139,0.4)'
                  : value > 0.4
                  ? 'rgba(133,171,139,0.2)'
                  : 'rgba(255,255,255,0.04)',
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-white/25">
        <span>Less</span>
        {[0.04, 0.2, 0.4, 0.65, 0.95].map(opacity => (
          <div
            key={opacity}
            className="w-2.5 h-2.5 rounded-[2px]"
            style={{ backgroundColor: opacity < 0.1 ? 'rgba(255,255,255,0.04)' : `rgba(133,171,139,${opacity})` }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#progress', label: 'Progress' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isScrolled = useScrolled();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <main className="bg-[#0e1710] text-white overflow-x-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── Sticky Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 md:px-12 py-4 transition-all duration-500"
        style={{
          backgroundColor: isScrolled ? 'rgba(14,23,16,0.92)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="text-white/90 text-base font-semibold tracking-tight">FocusWaqt</div>

        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={APP_URL}
            className="hidden sm:flex items-center gap-1.5 text-sm text-white/60 hover:text-white/90 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            Open App
          </a>
          <a
            href={APP_URL}
            className="hidden lg:inline-flex text-sm font-medium px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full transition-colors"
          >
            Start Focusing
          </a>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/8 border border-white/10 text-white/70 transition-colors hover:bg-white/12"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-40 w-72 bg-[#0e1710]/95 backdrop-blur-2xl border-l border-white/8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-xl font-medium text-white/80 py-3.5 border-b border-white/6 transition-all duration-500"
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'none' : 'translateX(16px)',
                  transitionDelay: menuOpen ? `${100 + i * 60}ms` : '0ms',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={APP_URL}
            className="mt-8 bg-[#336443] text-white text-sm font-semibold px-5 py-3.5 rounded-full text-center transition-colors hover:bg-[#2d5a3b]"
          >
            Start Focusing
          </a>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#0e1710]" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-32 pb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-screen">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/60 text-xs font-medium mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#85AB8B] animate-pulse" />
              Free forever · No install needed
            </div>

            <h1
              className="font-normal leading-[0.93] text-[#c5dfc8]"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '-0.035em' }}
            >
              Deep focus,
              <br />
              <span className="text-[#85AB8B]">every single</span>
              <br />
              day.
            </h1>

            <p className="mt-7 text-white/45 leading-relaxed max-w-md mx-auto lg:mx-0"
               style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}>
              A beautiful Pomodoro timer with ambient sounds, streak tracking, and a GitHub-style focus heatmap.
            </p>

            <div className="mt-10 flex items-center gap-3 flex-wrap justify-center lg:justify-start">
              <a
                href={APP_URL}
                className="flex items-center gap-2 bg-[#336443] hover:bg-[#2d5a3b] text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-green-900/30 hover:shadow-green-900/50 hover:-translate-y-0.5"
              >
                Start Focusing — it&apos;s free
              </a>
              <a
                href="#features"
                className="flex items-center gap-1.5 text-white/45 hover:text-white/70 transition-colors text-sm"
              >
                See features <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: app preview */}
          <div className="flex-shrink-0 w-full max-w-xs lg:max-w-sm">
            <AppMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#features"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition-colors"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* ── Marquee Strip ── */}
      <div className="border-y border-white/6 bg-white/[0.02] py-4 overflow-hidden">
        <div
          className="flex gap-8 w-max"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-8 text-white/25 text-sm font-medium whitespace-nowrap">
              {item}
              <span className="w-1 h-1 rounded-full bg-[#85AB8B]/50" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="py-28 md:py-36 px-5 sm:px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[#85AB8B] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Features</p>
            <h2
              className="font-normal text-white"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.025em' }}
            >
              Everything you need to do
              <br />
              <span className="text-white/40">your best work</span>
            </h2>
          </FadeIn>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Large card */}
            <FadeIn delay={0} className="sm:col-span-2 lg:col-span-2">
              <div className="h-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 hover:border-white/12 rounded-2xl p-7 transition-all duration-300 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-[#336443]/20 border border-[#336443]/20 flex items-center justify-center text-[#85AB8B] mb-6 group-hover:bg-[#336443]/30 transition-colors">
                  <Timer className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">Pomodoro Timer</h3>
                <p className="text-white/45 text-sm leading-relaxed max-w-sm">
                  Focus sessions, short breaks, long breaks — fully customisable to match your rhythm. Hit space to start, space to pause. No friction between you and your work.
                </p>
                <div className="mt-6 flex items-center gap-2">
                  {['25 min', '5 min', '15 min'].map((label, i) => (
                    <span
                      key={label}
                      className={`text-xs px-3 py-1 rounded-full ${i === 0 ? 'bg-[#85AB8B]/15 text-[#85AB8B] border border-[#85AB8B]/20' : 'bg-white/5 text-white/30 border border-white/8'}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Regular cards */}
            {FEATURES.slice(1).map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 60}>
                <div className="h-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 hover:border-white/12 rounded-2xl p-5 transition-all duration-300 group cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-[#336443]/15 border border-[#336443]/15 flex items-center justify-center text-[#85AB8B] mb-4 group-hover:bg-[#336443]/25 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-28 md:py-36 px-5 sm:px-8 md:px-12 bg-white/[0.02] border-y border-white/6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-20">
            <p className="text-[#85AB8B] text-xs font-semibold uppercase tracking-[0.2em] mb-4">How It Works</p>
            <h2
              className="font-normal text-white"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.025em' }}
            >
              Simple by design,
              <br />
              <span className="text-white/40">powerful by habit</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {STEPS.map((step, i) => (
              <FadeIn key={step.number} delay={i * 80}>
                <div className="relative">
                  <div
                    className="font-bold tabular-nums text-[#336443]/30 mb-4 select-none"
                    style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', letterSpacing: '-0.05em', lineHeight: 1 }}
                  >
                    {step.number}
                  </div>
                  <div className="w-6 h-[2px] bg-[#85AB8B]/30 mb-4" />
                  <h3 className="text-white font-semibold text-sm mb-3">{step.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Progress / Heatmap ── */}
      <section id="progress" className="py-28 md:py-36 px-5 sm:px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeIn direction="left">
              <p className="text-[#85AB8B] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Progress</p>
              <h2
                className="font-normal text-white mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.025em' }}
              >
                Your focus,
                <br />
                <span className="text-white/40">visualised</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
                Every completed session is logged. Watch your annual heatmap fill up day by day — the same feeling as a green GitHub graph, but for deep work instead of code.
              </p>
              <ul className="space-y-3.5">
                {[
                  'GitHub-style heatmap across the full year',
                  'Daily streak counter with fire indicator',
                  'Total focus hours, active days, longest streak',
                  'Session history auto-saved to your account',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/55">
                    <CheckCircle2 className="w-4 h-4 text-[#85AB8B] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={150}>
              <HeatmapShowcase />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 md:py-36 px-5 sm:px-8">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center bg-white/[0.04] border border-white/8 rounded-3xl px-8 py-16 md:py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#336443]/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[#85AB8B] text-xs font-semibold uppercase tracking-[0.2em] mb-5">Get Started</p>
              <h2
                className="font-normal text-white mb-6"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', letterSpacing: '-0.03em' }}
              >
                Your most focused day
                <br />
                <span className="text-white/35">starts right now</span>
              </h2>
              <p className="text-white/35 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                Free to use. No install. Just open the app and start your first session.
              </p>
              <a
                href={APP_URL}
                className="inline-flex items-center gap-2.5 bg-[#336443] hover:bg-[#2d5a3b] text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-xl shadow-green-900/25 hover:shadow-green-900/45 hover:-translate-y-0.5 text-sm"
              >
                Open FocusWaqt <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 px-5 sm:px-8 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/25 text-sm">
          <span className="font-semibold text-white/40">FocusWaqt</span>
          <span>© {new Date().getFullYear()} FocusWaqt. Free forever.</span>
          <a href={APP_URL} className="hover:text-white/50 transition-colors">Open App →</a>
        </div>
      </footer>
    </main>
  );
}
