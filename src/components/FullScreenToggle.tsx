'use client';

import { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export function FullScreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const checkFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', checkFullscreen);
        checkFullscreen();
        return () => document.removeEventListener('fullscreenchange', checkFullscreen);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!isFullscreen) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch { /* fullscreen not available */ }
    };

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
