'use client';

import { CloudRain, Music, Image as ImageIcon, Coffee, BarChart2, AtSign } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { BUY_ME_COFFEE_URL } from '@/constants';
import { useShortcutHint } from '@/hooks/useShortcutHint';
import Link from 'next/link';
import { useState } from 'react';

interface DockButtonProps {
    onClick?: () => void;
    label: string;
    children: React.ReactNode;
    className?: string;
    isLink?: boolean;
    href?: string;
    external?: boolean;
    lift: number;
    onHover: () => void;
    onLeave: () => void;
}

function DockButton({ onClick, label, children, className = '', isLink, href, external, lift, onHover, onLeave }: DockButtonProps) {
    const base =
        'has-tooltip group relative w-10 h-10 rounded-xl flex items-center justify-center btn-press text-white/70 hover:text-white hover:bg-white/15';

    const style = {
        transform: `translateY(${-lift}px) scale(${1 + lift * 0.012})`,
        transition: lift > 0
            ? 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)'
            : 'transform 0.5s cubic-bezier(0.25,0.1,0.25,1)',
    };

    const content = (
        <>
            {children}
            <span className="tooltip-label">{label}</span>
        </>
    );

    if (isLink && href) {
        const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
        return (
            <Link
                href={href}
                className={`${base} ${className}`}
                aria-label={label}
                style={style}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                {...props}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`${base} ${className}`}
            aria-label={label}
            style={style}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {content}
        </button>
    );
}

function getLift(hoveredIdx: number | null, idx: number): number {
    return hoveredIdx === idx ? 10 : 0;
}

export function IconDock() {
    const { openSoundMixer, openBackgroundPicker, toggleMusicModal, openStats, openContactModal } = useAppStore();
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const sceneHint = useShortcutHint('hint-c', 'Press C for scene dock');

    const items = [
        { label: 'Sounds', icon: <CloudRain className="w-4.5 h-4.5" />, onClick: openSoundMixer },
        { label: 'Music',  icon: <Music className="w-4.5 h-4.5" />,     onClick: toggleMusicModal },
        { label: 'Scene',  icon: <ImageIcon className="w-4.5 h-4.5" />, onClick: () => { openBackgroundPicker(); sceneHint.trigger(); } },
        { label: 'Stats',  icon: <BarChart2 className="w-4.5 h-4.5" />, onClick: openStats },
    ] as const;

    return (
        <div className="fixed bottom-6 left-6 z-20 animate-slide-up">
            <div className="glass-light rounded-2xl px-2 py-2 flex items-end gap-1">
                {items.map((item, i) => (
                    <div key={item.label} className="relative">
                        {item.label === 'Scene' && sceneHint.visible && (
                            <kbd className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white/15 border border-white/20 rounded-lg text-white/70 text-[11px] font-mono whitespace-nowrap pointer-events-none animate-fade-in">
                                C
                            </kbd>
                        )}
                        <DockButton
                            onClick={item.onClick}
                            label={item.label}
                            lift={getLift(hoveredIdx, i)}
                            onHover={() => setHoveredIdx(i)}
                            onLeave={() => setHoveredIdx(null)}
                        >
                            {item.icon}
                        </DockButton>
                    </div>
                ))}

                <div className="w-px h-5 bg-white/10 mx-1 self-center" />

                <DockButton
                    isLink
                    href={BUY_ME_COFFEE_URL}
                    external
                    label="Buy me a coffee"
                    className="hover:text-yellow-400 hover:bg-yellow-400/10"
                    lift={getLift(hoveredIdx, 4)}
                    onHover={() => setHoveredIdx(4)}
                    onLeave={() => setHoveredIdx(null)}
                >
                    <Coffee className="w-4.5 h-4.5" />
                </DockButton>

                <DockButton
                    onClick={openContactModal}
                    label="Contact"
                    className="hover:text-pink-400 hover:bg-pink-400/10"
                    lift={getLift(hoveredIdx, 5)}
                    onHover={() => setHoveredIdx(5)}
                    onLeave={() => setHoveredIdx(null)}
                >
                    <AtSign className="w-4.5 h-4.5" />
                </DockButton>
            </div>
        </div>
    );
}
