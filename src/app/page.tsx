'use client';

import { useEffect } from 'react';
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
import { QuoteWidget } from '@/components/QuoteWidget';
import { useAppStore } from '@/stores/appStore';
import { useTimerStore } from '@/stores/timerStore';
import { VIDEO_BACKGROUNDS, IMAGE_BACKGROUNDS } from '@/constants';
import { fetchUserStreak } from '@/actions/fetchUserStreak';

export default function Home() {
  const { currentBackgroundId, currentBackgroundType, isSoundMixerOpen, closeSoundMixer, isBackgroundPickerOpen, closeBackgroundPicker, isTaskModalOpen, closeTaskModal, isMusicModalOpen, closeMusicModal, setStreak } = useAppStore();
  const { isRunning } = useTimerStore();

  useEffect(() => {
    const loadStreak = async () => {
      const streak = await fetchUserStreak();
      setStreak(streak);
    };
    loadStreak();
  }, [setStreak]);

  const currentVideo = VIDEO_BACKGROUNDS.find(v => v.id === currentBackgroundId);
  const currentImage = IMAGE_BACKGROUNDS.find(i => i.id === currentBackgroundId);
  const backgroundUrl = currentBackgroundType === 'video'
    ? (currentVideo?.url || VIDEO_BACKGROUNDS[0].url)
    : (currentImage?.url || IMAGE_BACKGROUNDS[0].url);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background */}
      {currentBackgroundType === 'video' ? (
        <BackgroundVideo videoUrl={backgroundUrl} />
      ) : (
        <>
          <div
            className="fixed inset-0 w-full h-full bg-cover bg-center z-0 transition-opacity duration-700"
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

      {/* Icon Dock */}
      <IconDock />

      {/* Quote Widget */}
      <QuoteWidget />

      {/* Main layout */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between px-6 py-6 md:px-8 md:py-8">
        {/* Top Bar */}
        <div className="w-full flex justify-end items-center gap-2">
          <StreakCounter />
          <AuthButton />
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center gap-6">
          <TaskTrigger />
          <Timer />
        </div>

        {/* Bottom */}
        <div className="w-full flex justify-end items-center">
          {isRunning && <FullScreenToggle />}
        </div>
      </div>
    </div>
  );
}
