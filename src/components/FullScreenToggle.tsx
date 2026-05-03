'use client';

import { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useShortcutHint } from '@/hooks/useShortcutHint';

export function FullScreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenHint = useShortcutHint('hint-f', 'Press F for fullscreen');

    useEffect(() => {
        const checkFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', checkFullscreen);
        checkFullscreen();
        return () => document.removeEventListener('fullscreenchange', checkFullscreen);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        try {
            if (!isFullscreen) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
            fullscreenHint.trigger();
        } catch { /* fullscreen not available */ }
    }, [isFullscreen, fullscreenHint]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'f' || e.key === 'F') toggleFullscreen();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggleFullscreen]);

    return (
        <button
            onClick={toggleFullscreen}
            className="has-tooltip w-9 h-9 flex items-center justify-center rounded-xl glass-light hover:bg-white/20 transition-all btn-press text-white/60 hover:text-white"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
            {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
            ) : (
                <Maximize2 className="w-4 h-4" />
            )}
            <span className="tooltip-label">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
        </button>
    );
}
