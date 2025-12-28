'use client';

import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Timer } from '@/components/Timer';
import { TaskTrigger } from '@/components/TaskTrigger';
import { StreakCounter } from '@/components/StreakCounter';
import { IconDock } from '@/components/IconDock';
import { SoundMixerModal } from '@/components/SoundMixerModal';
import { BackgroundPickerModal } from '@/components/BackgroundPickerModal';
import { TaskModal } from '@/components/TaskModal';
import { MusicModal } from '@/components/MusicModal';
import { FullScreenToggle } from '@/components/FullScreenToggle';
import { useAppStore } from '@/stores/appStore';
import { useTimerStore } from '@/stores/timerStore';
import { VIDEO_BACKGROUNDS } from '@/constants';

export default function Home() {
  const { currentVideoId, isSoundMixerOpen, closeSoundMixer, isBackgroundPickerOpen, closeBackgroundPicker, isTaskModalOpen, closeTaskModal, isMusicModalOpen, closeMusicModal } = useAppStore();
  const { isRunning } = useTimerStore();
  const currentVideo = VIDEO_BACKGROUNDS.find(v => v.id === currentVideoId) || VIDEO_BACKGROUNDS[0];

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Video */}
      <BackgroundVideo videoUrl={currentVideo.url} />

      {/* Icon Dock */}
      <IconDock />

      {/* Sound Mixer Modal */}
      <SoundMixerModal isOpen={isSoundMixerOpen} onClose={closeSoundMixer} />

      {/* Background Picker Modal */}
      <BackgroundPickerModal isOpen={isBackgroundPickerOpen} onClose={closeBackgroundPicker} />

      {/* Task Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} />

      {/* Music Modal */}
      <MusicModal isOpen={isMusicModalOpen} onClose={closeMusicModal} />

      {/* Main Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-6 md:p-8">
        {/* Top Bar */}
        <div className="w-full flex justify-end">
          <StreakCounter />
        </div>

        {/* Fullscreen Toggle (only when timer is running) */}
        {isRunning && (
          <div className="absolute top-6 right-6 z-50">
            <FullScreenToggle />
          </div>
        )}

        {/* Center Content */}
        <div className="flex flex-col items-center gap-8">
          <TaskTrigger />
          <Timer />
        </div>

        {/* Bottom Section - Empty for now */}
        <div className="w-full flex flex-col items-center gap-4">
        </div>
      </div>
    </div>
  );
}
