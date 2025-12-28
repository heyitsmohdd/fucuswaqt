'use client';

import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Timer } from '@/components/Timer';
import { TaskInput } from '@/components/TaskInput';
import { StreakCounter } from '@/components/StreakCounter';
import { IconDock } from '@/components/IconDock';
import { SoundMixerModal } from '@/components/SoundMixerModal';
import { BackgroundPickerModal } from '@/components/BackgroundPickerModal';
import { useAppStore } from '@/stores/appStore';
import { VIDEO_BACKGROUNDS } from '@/constants';

export default function Home() {
  const { currentVideoId, isSoundMixerOpen, closeSoundMixer, isBackgroundPickerOpen, closeBackgroundPicker } = useAppStore();
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

      {/* Main Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-6 md:p-8">
        {/* Top Bar */}
        <div className="w-full flex justify-end">
          <StreakCounter />
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center gap-8">
          <Timer />
          <TaskInput />
        </div>

        {/* Bottom Section - Empty for now */}
        <div className="w-full flex flex-col items-center gap-4">
        </div>
      </div>
    </div>
  );
}
