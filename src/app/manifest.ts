import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FocusWaqt',
    short_name: 'FocusWaqt',
    description: 'Deep focus, every single day. A beautiful Pomodoro timer with streak tracking, ambient sounds, and a focus heatmap.',
    start_url: '/app',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0e1710',
    theme_color: '#336443',
    categories: ['productivity', 'lifestyle'],
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
