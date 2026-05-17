import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: '#336443',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'FocusWaqt',
    template: '%s | FocusWaqt',
  },
  description: 'Deep focus, every single day.',
  metadataBase: new URL('https://focuswaqt.space'),
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FocusWaqt',
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" />
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Analytics />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

