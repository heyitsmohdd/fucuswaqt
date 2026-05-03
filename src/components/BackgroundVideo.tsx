'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

interface BackgroundVideoProps {
    videoUrl: string;
}

export function BackgroundVideo({ videoUrl }: BackgroundVideoProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(videoUrl);
    const prevUrlRef = useRef(videoUrl);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync with prop changes using a deferred update pattern
    useEffect(() => {
        if (videoUrl !== prevUrlRef.current) {
            prevUrlRef.current = videoUrl;

            // Clear any existing timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Schedule state updates to next microtask to avoid sync setState warning
            queueMicrotask(() => {
                setHasError(false);
                setIsLoaded(false);
                setIsLoading(true);
                timerRef.current = setTimeout(() => {
                    setCurrentUrl(videoUrl);
                }, 300);
            });
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [videoUrl]);

    const handleVideoLoad = () => {
        setIsLoaded(true);
        setIsLoading(false);
        setHasError(false);
    };

    const handleVideoError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    return (
        <>
            {/* Base gradient — always visible, hides blank flash while video buffers */}
            <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800" />

            {/* Scene transition overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-[2] bg-black/60 backdrop-blur-md pointer-events-none animate-fade-in" />
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="fixed inset-0 z-[3] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                </div>
            )}

            {/* Error fallback */}
            {hasError && (
                <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white/40">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">Video unavailable</span>
                        </div>
                    </div>
                </div>
            )}

            {!hasError && (
                <video
                    key={currentUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={cn(
                        'fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-500',
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                >
                    <source src={currentUrl} type="video/mp4" />
                </video>
            )}

            {/* Dark overlay for better text readability */}
            <div className="fixed inset-0 bg-black/30 z-[1]" />
        </>
    );
}
