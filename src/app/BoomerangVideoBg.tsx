'use client';

import { useEffect, useRef, useState } from 'react';

interface BoomerangVideoBgProps {
  src: string;
  className?: string;
}

const isTouchDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function BoomerangVideoBg({ src, className }: BoomerangVideoBgProps) {
  const playbackVideoRef = useRef<HTMLVideoElement>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [framesReady, setFramesReady] = useState(false);
  const framesRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const playbackVideo = playbackVideoRef.current;
    if (!playbackVideo) return;

    if (isTouchDevice()) {
      playbackVideo.loop = true;
      playbackVideo.play().catch(() => {});
      return;
    }

    const captureVideo = captureVideoRef.current;
    if (!captureVideo) return;

    const frames: HTMLCanvasElement[] = [];
    let capturing = true;
    let lastTime = -1;
    const MAX_WIDTH = 960;

    const captureFrame = () => {
      if (!capturing || captureVideo.readyState < 2) return;
      if (captureVideo.currentTime === lastTime) return;
      lastTime = captureVideo.currentTime;

      const vw = captureVideo.videoWidth;
      const vh = captureVideo.videoHeight;
      if (!vw || !vh) return;

      const scale = Math.min(1, MAX_WIDTH / vw);
      const w = Math.round(vw * scale);
      const h = Math.round(vh * scale);

      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = w;
      frameCanvas.height = h;
      const ctx = frameCanvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(captureVideo, 0, 0, w, h);
      frames.push(frameCanvas);
    };

    type VFCVideo = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
    };
    const vfcVideo = captureVideo as VFCVideo;
    const hasVFC = typeof vfcVideo.requestVideoFrameCallback === 'function';

    let rafId = 0;
    const rafLoop = () => {
      captureFrame();
      if (capturing) rafId = requestAnimationFrame(rafLoop);
    };
    const vfcLoop = () => {
      captureFrame();
      if (capturing && vfcVideo.requestVideoFrameCallback) {
        vfcVideo.requestVideoFrameCallback(vfcLoop);
      }
    };

    const onEnded = () => {
      capturing = false;
      if (frames.length > 0) {
        framesRef.current = frames;
        setFramesReady(true);
      } else {
        playbackVideo.loop = true;
        playbackVideo.play().catch(() => {});
      }
    };

    const onLoaded = () => {
      captureVideo.play().catch(() => {});
      if (hasVFC) {
        vfcVideo.requestVideoFrameCallback!(vfcLoop);
      } else {
        rafId = requestAnimationFrame(rafLoop);
      }
    };

    captureVideo.addEventListener('loadedmetadata', onLoaded);
    captureVideo.addEventListener('ended', onEnded);
    if (captureVideo.readyState >= 1) onLoaded();

    return () => {
      capturing = false;
      cancelAnimationFrame(rafId);
      captureVideo.removeEventListener('loadedmetadata', onLoaded);
      captureVideo.removeEventListener('ended', onEnded);
    };
  }, [src]);

  useEffect(() => {
    if (!framesReady) return;
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const frames = framesRef.current;
    if (frames.length === 0) return;

    const first = frames[0];
    canvas.width = first.width;
    canvas.height = first.height;

    let index = 0;
    let direction = 1;
    let last = performance.now();
    const FRAME_INTERVAL = 1000 / 30;
    let rafId = 0;

    const render = (now: number) => {
      if (now - last >= FRAME_INTERVAL) {
        last = now;
        ctx.drawImage(frames[index], 0, 0);
        index += direction;
        if (index >= frames.length - 1) { index = frames.length - 1; direction = -1; }
        else if (index <= 0) { index = 0; direction = 1; }
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [framesReady]);

  return (
    <div className={className ?? 'absolute inset-0 w-full h-full'}>
      {/* Visible video — no crossOrigin so iOS loads it without CORS restrictions */}
      <video
        ref={playbackVideoRef}
        src={src}
        className="w-full h-full object-cover"
        style={{ display: framesReady ? 'none' : 'block' }}
        muted
        playsInline
        preload="auto"
      />
      {/* Capture video — crossOrigin needed for canvas drawImage on desktop only */}
      <video
        ref={captureVideoRef}
        src={src}
        style={{ display: 'none' }}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      />
      <canvas
        ref={displayCanvasRef}
        className="w-full h-full object-cover"
        style={{ display: framesReady ? 'block' : 'none' }}
      />
    </div>
  );
}
