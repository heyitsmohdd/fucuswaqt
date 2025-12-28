'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface BackgroundVideoProps {
    videoUrl: string;
}

export function BackgroundVideo({ videoUrl }: BackgroundVideoProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(videoUrl);

    useEffect(() => {
        // Fade transition when video URL changes
        setIsLoaded(false);
        const timer = setTimeout(() => {
            setCurrentUrl(videoUrl);
            setIsLoaded(true);
        }, 300);

        return () => clearTimeout(timer);
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
