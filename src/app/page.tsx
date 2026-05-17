import type { Metadata } from 'next';
import LandingPage from '@/app/LandingPage';

export const metadata: Metadata = {
  title: 'FocusWaqt — Deep focus, every single day',
  description:
    'A beautiful Pomodoro timer with streak tracking, ambient sounds, and a GitHub-style focus heatmap. Free forever, no install needed.',
  metadataBase: new URL('https://focuswaqt.space'),
  alternates: {
    canonical: 'https://focuswaqt.space',
  },
  openGraph: {
    title: 'FocusWaqt — Deep focus, every single day',
    description:
      'A beautiful Pomodoro timer with streak tracking, ambient sounds, and a GitHub-style focus heatmap. Free forever.',
    url: 'https://focuswaqt.space',
    siteName: 'FocusWaqt',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FocusWaqt — Deep focus, every single day',
    description:
      'A beautiful Pomodoro timer with streak tracking, ambient sounds, and a GitHub-style focus heatmap.',
    site: '@focuswaqt',
  },
  keywords: [
    'pomodoro timer',
    'focus timer',
    'productivity app',
    'streak tracking',
    'ambient sounds',
    'deep work',
    'focus heatmap',
    'time management',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function Page() {
  return <LandingPage />;
}
