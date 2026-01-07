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
export const TASK_MAX_LENGTH = 200;
export const QUOTE_MAX_LENGTH = 300;

// Video backgrounds - using local custom videos
export const VIDEO_BACKGROUNDS: VideoBackground[] = [
  {
    id: 'flowers',
    name: 'Flowers',
    url: '/videos/flowers.mp4',
  },
  {
    id: 'jungle-walk',
    name: 'Jungle Walk',
    url: '/videos/jungle-walk.mp4',
  },
  {
    id: 'forest',
    name: 'Forest',
    url: '/videos/forest.mp4',
  },
  {
    id: 'sky-loop',
    name: 'Sky Loop',
    url: '/videos/sky-loop.mp4',
  },
  {
    id: 'sky',
    name: 'Sky',
    url: '/videos/sky.mp4',
  },
  {
    id: 'sleeping-in-flowers',
    name: 'Sleeping in Flowers',
    url: '/videos/sleeping-in-flowers.mp4',
  },
  {
    id: 'three-loop',
    name: 'Three Loop',
    url: '/videos/three-loop.mp4',
  },
  {
    id: 'train-view',
    name: 'Train View',
    url: '/videos/train-view.mp4',
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
    name: 'Cat',
    url: '/images/cat.jpg',
  },
  {
    id: 'goku',
    name: 'Goku',
    url: '/images/goku.jpg',
  },
  {
    id: 'calm',
    name: 'Calm',
    url: '/images/calm.jpg',
  },
  {
    id: 'nature',
    name: 'Nature',
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
    id: 'cafe',
    name: 'Coffee Shop',
    icon: 'Coffee',
    url: '/sounds/drip-coffee.mp3',
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

// Allowed OAuth redirect origins (security)
export const ALLOWED_ORIGINS = [
  'https://focuswaqt.vercel.app',
  'https://www.focuswaqt.com',
  'http://localhost:3000',
  'http://localhost:3001',
] as const;

// Production URL fallback
export const PRODUCTION_URL = 'https://focuswaqt.vercel.app';

// Default YouTube URL for music modal
// Lofi hip hop radio - beats to relax/study to
export const DEFAULT_YOUTUBE_URL = process.env.NEXT_PUBLIC_DEFAULT_YOUTUBE_URL || 'https://youtu.be/uyTtCdaEux8?si=E9KEDBOkM2qjtfKu';
