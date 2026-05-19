'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { FocusHeatmap } from './FocusHeatmap';
import { cn } from '@/lib/utils';

const INK = '#0D2118';
const SAGE = '#85AB8B';

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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div
                className={cn(
                    'relative w-full max-w-3xl overflow-hidden transition-all duration-300',
                    isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                )}
                style={{
                    background: INK,
                    border: `2px solid ${SAGE}`,
                    boxShadow: `6px 6px 0px ${SAGE}`,
                    borderRadius: 0,
                }}
            >
                <div
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '20px 24px 16px',
                        borderBottom: `2px solid rgba(133,171,139,0.25)`,
                    }}
                >
                    <h2 style={{ color: '#F0F7F1', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                        Focus Stats
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `2px solid rgba(133,171,139,0.4)`,
                            borderRadius: 8,
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'rgba(240,247,241,0.6)',
                            padding: 0,
                        }}
                        aria-label="Close stats"
                    >
                        <X style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                <div style={{ padding: '20px 24px 24px' }}>
                    <FocusHeatmap />
                </div>
            </div>
        </div>
    );
}
