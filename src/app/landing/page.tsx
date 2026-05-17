'use client';

import { useState, useEffect } from 'react';
import {
  LogIn, Menu, X, Timer, Flame, BarChart2,
  Music, Image as ImageIcon, CheckCircle2, Sparkles, ArrowRight,
} from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

const APP_URL = 'https://focuswaqt.space';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#progress', label: 'Progress' },
];

const features = [
  {
    icon: <Timer className="w-6 h-6" />,
    title: 'Pomodoro Timer',
    description: 'Focus sessions, short breaks, and long breaks — fully customisable to match your rhythm.',
  },
  {
    icon: <Music className="w-6 h-6" />,
    title: 'Ambient Soundscapes',
    description: 'Rain, fire, coffee shop, waves. Mix sounds at custom volumes to build your perfect focus environment.',
  },
  {
    icon: <ImageIcon className="w-6 h-6" />,
    title: 'Beautiful Backgrounds',
    description: 'Curated looping videos and images. Switch scenes instantly without breaking your flow.',
  },
  {
    icon: <Flame className="w-6 h-6" />,
    title: 'Streak Tracking',
    description: 'Every completed session counts. Build a daily streak and watch your discipline compound.',
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: 'Focus Heatmap',
    description: 'A GitHub-style activity graph of your focus minutes — see your progress across the whole year.',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Task Tracking',
    description: 'Add what you\'re working on before each session. Stay intentional, stay on target.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Set your intention',
    description: 'Type what you\'re working on. A clear task before the session is the difference between drifting and doing.',
  },
  {
    number: '02',
    title: 'Start the timer',
    description: 'Hit space or press play. The timer runs, your streak counter watches. No distractions — just the work.',
  },
  {
    number: '03',
    title: 'Build your environment',
    description: 'Choose a background scene, mix ambient sounds to your taste. Make the space feel like yours.',
  },
  {
    number: '04',
    title: 'Watch your progress',
    description: 'Every session fills your heatmap. Streaks grow. Your focus history becomes a source of motivation.',
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <main className="bg-[#0e1710] text-white">

      {/* ── Hero ── */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6">
          <div className="text-[#2d3a2a] text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
            FocusWaqt
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md rounded-full pl-6 pr-1 py-1 shadow-sm border border-white/60">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-2 transition-colors ${
                  i === 0 ? 'font-semibold text-[#1f2a1d]' : 'font-medium text-[#4b5b47] hover:text-[#1f2a1d]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={APP_URL}
              className="ml-2 bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Start Focusing
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-[#2d3a2a]">
            <a href={APP_URL} className="hidden sm:flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
              <LogIn className="w-4 h-4" />
              Open App
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/60 text-[#1f2a1d] transition-all duration-300 hover:bg-white/90"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <Menu className={`w-5 h-5 absolute transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`w-5 h-5 absolute transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
            </button>
          </div>
        </nav>

        {/* Mobile overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-20 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-[#1f2a1d]/40 backdrop-blur-sm" />
        </div>

        {/* Mobile drawer */}
        <div className={`lg:hidden fixed top-0 right-0 bottom-0 z-20 w-[85%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full pt-24 px-8 pb-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl font-semibold text-[#1f2a1d] py-4 border-b border-[#1f2a1d]/10 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                  style={{ transitionDelay: menuOpen ? `${150 + i * 70}ms` : '0ms' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div
              className={`mt-8 flex flex-col gap-4 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
              style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}
            >
              <a href={APP_URL} className="flex items-center gap-2 text-sm font-medium text-[#2d3a2a]">
                <LogIn className="w-4 h-4" /> Open App
              </a>
              <a href={APP_URL} className="mt-2 bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors text-center">
                Start Focusing
              </a>
            </div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex flex-col items-center text-center pt-36 sm:pt-40 md:pt-48 px-4 sm:px-6">
          <h1
            className="font-normal leading-[0.95] text-[#336443] text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-5xl"
            style={{ letterSpacing: '-0.035em' }}
          >
            Deep focus,{' '}
            <span className="text-[#85AB8B]">
              every single
              <br className="hidden sm:block" /> day
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 text-[#4b5b47] text-sm sm:text-base md:text-lg leading-relaxed max-w-md px-2">
            A beautiful Pomodoro timer with streak tracking, ambient sounds, and a GitHub-style focus heatmap.
          </p>
          <div className="mt-10 flex items-center gap-4 flex-wrap justify-center">
            <a
              href={APP_URL}
              className="bg-[#1f2a1d] hover:bg-[#2a3827] text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg"
            >
              Start Focusing — it's free
            </a>
            <a href="#features" className="text-[#3d5638] text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1.5">
              See features <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom-left badge */}
        <div className="absolute left-4 sm:left-6 md:left-10 bottom-6 sm:bottom-10 z-10">
          <div className="flex items-center gap-2 text-white/70 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Built for deep work</span>
          </div>
          <p className="text-white/40 text-[11px] max-w-[200px] leading-relaxed">
            Free forever. No sign-up required to start.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 md:py-32 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#85AB8B] text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white" style={{ letterSpacing: '-0.025em' }}>
            Everything you need to do<br className="hidden sm:block" />{' '}
            <span className="text-[#85AB8B]">your best work</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:bg-white/8 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#336443]/20 flex items-center justify-center text-[#85AB8B] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 md:py-32 px-4 sm:px-6 md:px-10 bg-white/3 border-y border-white/6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#85AB8B] text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white" style={{ letterSpacing: '-0.025em' }}>
              Simple by design,<br className="hidden sm:block" />{' '}
              <span className="text-[#85AB8B]">powerful by habit</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-gradient-to-r from-white/15 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <span className="text-[#336443] text-4xl font-bold tabular-nums" style={{ letterSpacing: '-0.04em' }}>
                    {step.number}
                  </span>
                  <h3 className="text-white font-semibold text-base mt-4 mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Progress ── */}
      <section id="progress" className="py-24 md:py-32 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#85AB8B] text-sm font-semibold uppercase tracking-widest mb-3">Progress</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-6" style={{ letterSpacing: '-0.025em' }}>
              Your focus,{' '}
              <span className="text-[#85AB8B]">visualised</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              Every completed session is logged. Watch your annual heatmap fill up day by day — the same feeling as a green GitHub graph, but for deep work instead of code.
            </p>
            <ul className="space-y-4">
              {[
                'GitHub-style heatmap across the full year',
                'Daily streak counter with fire indicator',
                'Total focus hours, active days, longest streak',
                'Session history auto-saved to your account',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[#85AB8B] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Heatmap mock */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-sm font-medium">Focus Activity</span>
              <div className="flex gap-4 text-xs text-white/40">
                <span>124h total</span>
                <span>38 days</span>
                <span>🔥 7 streak</span>
              </div>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto">
              {Array.from({ length: 7 * 52 }).map((_, i) => {
                const rand = Math.random();
                const colorClass =
                  rand > 0.85 ? 'bg-green-500' :
                  rand > 0.7  ? 'bg-green-600/85' :
                  rand > 0.55 ? 'bg-green-700/70' :
                  rand > 0.4  ? 'bg-green-900/50' :
                  'bg-gray-800/30';
                return <div key={i} className={`w-3 h-3 rounded-sm ${colorClass}`} />;
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-white/30">
              <span>Less</span>
              <div className="flex gap-0.5">
                {['bg-gray-800/30', 'bg-green-900/50', 'bg-green-700/70', 'bg-green-600/85', 'bg-green-500'].map(c => (
                  <div key={c} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 text-center border-t border-white/6">
        <p className="text-[#85AB8B] text-sm font-semibold uppercase tracking-widest mb-4">Get Started</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-6 max-w-2xl mx-auto" style={{ letterSpacing: '-0.025em' }}>
          Your most focused day<br />
          <span className="text-[#85AB8B]">starts right now</span>
        </h2>
        <p className="text-white/40 text-base mb-10 max-w-md mx-auto">
          Free to use. No install. Just open the app and start your first session.
        </p>
        <a
          href={APP_URL}
          className="inline-flex items-center gap-2 bg-[#336443] hover:bg-[#2d5a3b] text-white font-semibold px-8 py-4 rounded-full transition-colors text-base shadow-xl shadow-green-900/30"
        >
          Open FocusWaqt <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 px-4 sm:px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
        <span className="font-semibold text-white/50">FocusWaqt</span>
        <span>© {new Date().getFullYear()} FocusWaqt. Free forever.</span>
        <a href={APP_URL} className="hover:text-white/60 transition-colors">Open App →</a>
      </footer>
    </main>
  );
}
