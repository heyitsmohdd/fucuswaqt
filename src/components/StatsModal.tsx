'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { FocusHeatmap } from './FocusHeatmap';
import { cn } from '@/lib/utils';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
        } else {
            setIsVisible(false);
            const t = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return (
        <div
            className={cn(
                'fixed inset-0 z-[150] flex items-center justify-center p-4 transition-all duration-300',
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
        >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className={cn(
                'relative w-full max-w-3xl bg-white/8 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden',
                isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            )}>
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 className="text-white font-semibold text-lg tracking-tight">Focus Stats</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors btn-press"
                        aria-label="Close stats"
                    >
                        <X className="w-4 h-4 text-white/60" />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <FocusHeatmap />
                </div>
            </div>
        </div>
    );
}
