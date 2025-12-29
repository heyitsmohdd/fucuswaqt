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
    id: 'sea',
    name: 'Sea',
    url: '/videos/sea.mp4',
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

// Static image backgrounds - using Unsplash images
export const IMAGE_BACKGROUNDS: ImageBackground[] = [
  {
    id: 'nature',
    name: 'Nature',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'city',
    name: 'City',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'cozy',
    name: 'Cozy',
    url: 'https://images.unsplash.com/photo-1485470733090-0a44848d82cb?q=80&w=1920&auto=format&fit=crop',
  },
];

// Audio tracks - using placeholder URLs (replace with actual lofi ambiance tracks)
export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'rain',
    name: 'Rain',
    icon: 'CloudRain',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3', // Placeholder
  },
  {
    id: 'fire',
    name: 'Fireplace',
    icon: 'Flame',
    url: 'https://assets.mixkit.co/active_storage/sfx/2494/2494-preview.mp3', // Placeholder
  },
  {
    id: 'cafe',
    name: 'Coffee Shop',
    icon: 'Coffee',
    url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3', // Placeholder
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    icon: 'Waves',
    url: 'https://assets.mixkit.co/active_storage/sfx/2394/2394-preview.mp3', // Placeholder
  },
  {
    id: 'birds',
    name: 'Forest Birds',
    icon: 'Bird',
    url: 'https://assets.mixkit.co/active_storage/sfx/2396/2396-preview.mp3', // Placeholder
  },
];

// Timer constants
export const TIMER_DEFAULTS = {
  FOCUS_DURATION: 25 * 60, // 25 minutes in seconds
  BREAK_DURATION: 5 * 60, // 5 minutes in seconds
  LONG_BREAK_DURATION: 15 * 60, // 15 minutes in seconds
} as const;
