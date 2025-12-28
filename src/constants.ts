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

// Video backgrounds - using Pexels stock videos
export const VIDEO_BACKGROUNDS: VideoBackground[] = [
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    url: 'https://videos.pexels.com/video-files/6473896/6473896-uhd_2732_1440_25fps.mp4',
  },
  {
    id: 'lofi-cafe',
    name: 'Cozy Cafe',
    url: 'https://videos.pexels.com/video-files/7562101/7562101-uhd_2560_1440_25fps.mp4',
  },
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
  },
  {
    id: 'city-night',
    name: 'City Night',
    url: 'https://videos.pexels.com/video-files/2611250/2611250-uhd_2560_1440_30fps.mp4',
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
