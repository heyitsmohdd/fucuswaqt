'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BackgroundVideoProps {
    videoUrl: string;
}

export function BackgroundVideo({ videoUrl }: BackgroundVideoProps) {
    const [isLoaded, setIsLoaded] = useState(true);
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
                setIsLoaded(false);
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

    return (
        <>
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
                onLoadedData={() => setIsLoaded(true)}
            >
                <source src={currentUrl} type="video/mp4" />
            </video>
            {/* Dark overlay for better text readability */}
            <div className="fixed inset-0 bg-black/30 z-[1]" />
        </>
    );
}
