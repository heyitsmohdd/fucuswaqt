import { EXTERNAL_AUDIO } from '@/lib/mediaConstants';

export interface VideoBackground {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  icon: string;
  url: string;
}

// Input validation constants
export const TASK_MAX_LENGTH = 30;
export const QUOTE_MAX_LENGTH = 80;
export const TASK_LIMIT = 3;
export const QUOTE_LIMIT = 5;

// Links
export const BUY_ME_COFFEE_URL = 'https://buymeacoffee.com/heyitsmohdd';

// Video backgrounds - using local custom videos
export const VIDEO_BACKGROUNDS: VideoBackground[] = [
  {
    id: 'catt',
    name: 'Lofi Dock',
    url: '/videos/catt.mp4',
  },
  {
    id: 'night',
    name: 'Starlit Night',
    url: '/videos/night.mp4',
  },
  {
    id: 'cozy',
    name: 'Cozy Fireplace',
    url: '/videos/cozy.mp4',
  },
  {
    id: 'good',
    name: 'Mountain Lake',
    url: '/videos/good.mp4',
  },
  {
    id: 'working',
    name: 'Night Grind',
    url: '/videos/working.mp4',
  },
  {
    id: 'rain',
    name: 'Rainy Window',
    url: '/videos/rain.mp4',
  },
  {
    id: 'sky',
    name: 'Cave Fire',
    url: '/videos/sky.mp4',
  },
  {
    id: 'city',
    name: 'City Lights',
    url: '/videos/city.mp4',
  },
];

export interface ImageBackground {
  id: string;
  name: string;
  url: string;
}

// Static image backgrounds - using local images
export const IMAGE_BACKGROUNDS: ImageBackground[] = [
  {
    id: 'cat',
    name: 'Sleepy Cat',
    url: '/images/cat.jpg',
  },
  {
    id: 'goku',
    name: 'Ultra Instinct',
    url: '/images/goku.jpg',
  },
  {
    id: 'calm',
    name: 'Morning Calm',
    url: '/images/calm.jpg',
  },
  {
    id: 'nature',
    name: 'Forest Path',
    url: '/images/nature2.jpg',
  },
];

// Audio tracks - using local custom sounds

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'rain',
    name: 'Rain',
    icon: 'CloudRain',
    url: EXTERNAL_AUDIO.RAIN_SOUND,
  },
  {
    id: 'fire',
    name: 'Fireplace',
    icon: 'Flame',
    url: '/sounds/fire-sound.mp3',
  },
  {
    id: 'night',
    name: 'Night',
    icon: 'Moon',
    url: '/sounds/night.mp3',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    icon: 'Waves',
    url: '/sounds/sea-waves.mp3',
  },
  {
    id: 'birds',
    name: 'Forest Birds',
    icon: 'Bird',
    url: '/sounds/birds-sound-2.mp3',
  },
];

// Timer constants
export const TIMER_DEFAULTS = {
  FOCUS_DURATION: 25 * 60, // 25 minutes in seconds
  BREAK_DURATION: 5 * 60, // 5 minutes in seconds
  LONG_BREAK_DURATION: 15 * 60, // 15 minutes in seconds
} as const;

// Timer presets (in minutes)
export type TimerPresetKey = 'short' | 'medium' | 'long' | 'custom';

export interface TimerPreset {
  focus: number;
  break: number;
  longBreak: number;
  label: string;
}

export const TIMER_PRESETS: Record<Exclude<TimerPresetKey, 'custom'>, TimerPreset> = {
  short: { focus: 25, break: 5, longBreak: 15, label: 'Short (25/5/15)' },
  medium: { focus: 50, break: 10, longBreak: 20, label: 'Medium (50/10/20)' },
  long: { focus: 90, break: 15, longBreak: 30, label: 'Long (90/15/30)' },
};

// Allowed OAuth redirect origins (security)
export const ALLOWED_ORIGINS = [
  'https://focuswaqt.vercel.app',
  'https://focuswaqt.space',
  'https://www.focuswaqt.space',
  'http://localhost:3000',
  'http://localhost:3001',
] as const;

// Production URL fallback
export const PRODUCTION_URL = 'https://focuswaqt.space';

// Default YouTube URL for music modal
// Lofi hip hop radio - beats to relax/study to
export const DEFAULT_YOUTUBE_URL = process.env.NEXT_PUBLIC_DEFAULT_YOUTUBE_URL || 'https://youtu.be/Srwxd7hcygM?si=x4wFO2uvldELprZR';
