'use client';

import { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';

export function FullScreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Check if currently in fullscreen
    useEffect(() => {
        const checkFullscreen = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        // Listen for fullscreen changes (including Esc key)
        document.addEventListener('fullscreenchange', checkFullscreen);

        // Initial check
        checkFullscreen();

        return () => {
            document.removeEventListener('fullscreenchange', checkFullscreen);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!isFullscreen) {
                // Enter fullscreen
                await document.documentElement.requestFullscreen();
            } else {
                // Exit fullscreen
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen toggle failed:', error);
        }
    };

    return (
        <button
            onClick={toggleFullscreen}
            className="text-white/80 hover:text-white transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
            {isFullscreen ? (
                <Minimize className="w-6 h-6" />
            ) : (
                <Maximize className="w-6 h-6" />
            )}
        </button>
    );
}
