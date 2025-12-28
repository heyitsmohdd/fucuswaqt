'use client';

import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Timer } from '@/components/Timer';
import { SoundMixer } from '@/components/SoundMixer';
import { TaskInput } from '@/components/TaskInput';
import { StreakCounter } from '@/components/StreakCounter';
import { BackgroundSwitcher } from '@/components/BackgroundSwitcher';
import { useAppStore } from '@/stores/appStore';
import { VIDEO_BACKGROUNDS } from '@/constants';

export default function Home() {
  const { currentVideoId } = useAppStore();
  const currentVideo = VIDEO_BACKGROUNDS.find(v => v.id === currentVideoId) || VIDEO_BACKGROUNDS[0];

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Video */}
      <BackgroundVideo videoUrl={currentVideo.url} />

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

        {/* Bottom Section */}
        <div className="w-full flex flex-col items-center gap-4">
          <SoundMixer />
          <BackgroundSwitcher />
        </div>
      </div>
    </div>
  );
}
