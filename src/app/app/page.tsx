'use client';

import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Timer } from '@/components/Timer';
import { TaskTrigger } from '@/components/TaskTrigger';
import { StreakCounter } from '@/components/StreakCounter';
import { AuthButton } from '@/components/AuthButton';
import { IconDock } from '@/components/IconDock';
import { SoundMixerModal } from '@/components/SoundMixerModal';
import { BackgroundPickerModal } from '@/components/BackgroundPickerModal';
import { TaskModal } from '@/components/TaskModal';
import { MusicModal } from '@/components/MusicModal';
import { FullScreenToggle } from '@/components/FullScreenToggle';
import { TimerSettingsModal } from '@/components/TimerSettingsModal';
import { StatsModal } from '@/components/StatsModal';
import { AuthModal } from '@/components/AuthModal';
import { PixelMascot } from '@/components/PixelMascot';
import { ContactModal } from '@/components/ContactModal';
import { QuoteWidget } from '@/components/QuoteWidget';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/stores/appStore';
import { useTimerStore } from '@/stores/timerStore';
import { VIDEO_BACKGROUNDS, IMAGE_BACKGROUNDS } from '@/constants';
import { useEffect, useState, useRef } from 'react';
import { fetchUserStreak } from '@/actions/fetchUserStreak';

export default function Home() {
  const { currentBackgroundId, currentBackgroundType, isSoundMixerOpen, closeSoundMixer, isBackgroundPickerOpen, closeBackgroundPicker, isTaskModalOpen, closeTaskModal, isMusicModalOpen, closeMusicModal, isTimerSettingsOpen, closeTimerSettings, isStatsOpen, closeStats, isAuthModalOpen, closeAuthModal, isContactModalOpen, closeContactModal, openBackgroundPicker, setStreak } = useAppStore();
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimerStore();
  const [switching, setSwitching] = useState(false);
  const switchingReady = useRef(false);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); isRunning ? pauseTimer() : startTimer(); }
      if (e.key === 'r' || e.key === 'R') resetTimer();
      if (e.key === 'c' || e.key === 'C') openBackgroundPicker();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isRunning, startTimer, pauseTimer, resetTimer, openBackgroundPicker]);

  // Delay enabling switching watcher until after Zustand rehydration settles
  useEffect(() => {
    const t = setTimeout(() => { switchingReady.current = true; }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!switchingReady.current) return;
    setSwitching(true);
    const t = setTimeout(() => setSwitching(false), 700);
    return () => clearTimeout(t);
  }, [currentBackgroundType]);

  useEffect(() => {
    fetchUserStreak().then(setStreak);
  }, [setStreak]);

  const currentVideo = VIDEO_BACKGROUNDS.find(v => v.id === currentBackgroundId);
  const currentImage = IMAGE_BACKGROUNDS.find(i => i.id === currentBackgroundId);
  const resolvedVideo = currentVideo ?? VIDEO_BACKGROUNDS[0];
  const backgroundUrl = currentBackgroundType === 'video'
    ? resolvedVideo.url
    : (currentImage?.url ?? IMAGE_BACKGROUNDS[0].url);
  const backgroundPoster = currentBackgroundType === 'video' ? resolvedVideo.thumbnail : undefined;
  const backgroundWebmUrl = currentBackgroundType === 'video' ? resolvedVideo.webmUrl : undefined;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950">
      {/* Type-switch transition overlay */}
      <div
        className="fixed inset-0 z-[200] bg-black pointer-events-none"
        style={{ opacity: switching ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />

      {/* Background */}
      {currentBackgroundType === 'video' ? (
        <BackgroundVideo videoUrl={backgroundUrl} posterUrl={backgroundPoster} webmUrl={backgroundWebmUrl} />
      ) : (
        <>
          <div
            key={backgroundUrl}
            className="fixed inset-0 w-full h-full bg-cover bg-center z-0 animate-fade-in"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
          <div className="fixed inset-0 bg-black/30 z-[1]" />
        </>
      )}

      {/* Modals */}
      <SoundMixerModal isOpen={isSoundMixerOpen} onClose={closeSoundMixer} />
      <BackgroundPickerModal isOpen={isBackgroundPickerOpen} onClose={closeBackgroundPicker} />
      <TaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} />
      <MusicModal isOpen={isMusicModalOpen} onClose={closeMusicModal} />
      <TimerSettingsModal isOpen={isTimerSettingsOpen} onClose={closeTimerSettings} />
      <StatsModal isOpen={isStatsOpen} onClose={closeStats} />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />

      {/* Icon Dock */}
      <IconDock />
      <PixelMascot />

      {/* Quote Widget */}
      <QuoteWidget />


      {/* Main layout */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between px-6 pt-3 pb-6 md:px-8 md:pt-4 md:pb-8">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Logo />
          <div className="flex items-center gap-2">
            <StreakCounter />
            <AuthButton />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <TaskTrigger />
          <Timer />
        </div>

        {/* Bottom */}
        <div className="w-full flex justify-end items-center h-9">
          <div className={`transition-opacity duration-300 ${isRunning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <FullScreenToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
