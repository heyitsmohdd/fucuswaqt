'use client';

import { CloudRain, Music, Image as ImageIcon, Coffee } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { BUY_ME_COFFEE_URL } from '@/constants';
import Link from 'next/link';

interface DockButtonProps {
    onClick?: () => void;
    label: string;
    children: React.ReactNode;
    className?: string;
    isLink?: boolean;
    href?: string;
    external?: boolean;
}

function DockButton({ onClick, label, children, className = '', isLink, href, external }: DockButtonProps) {
    const base =
        'has-tooltip group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 btn-press text-white/70 hover:text-white hover:bg-white/15';

    if (isLink && href) {
        const props = external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {};
        return (
            <Link href={href} className={`${base} ${className}`} aria-label={label} {...props}>
                {children}
                <span className="tooltip-label">{label}</span>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={`${base} ${className}`} aria-label={label}>
            {children}
            <span className="tooltip-label">{label}</span>
        </button>
    );
}

export function IconDock() {
    const { openSoundMixer, openBackgroundPicker, toggleMusicModal } = useAppStore();

    return (
        <div className="fixed bottom-6 left-6 z-20 animate-slide-up">
            <div className="glass-light rounded-2xl px-2 py-2 flex items-center gap-1">
                <DockButton onClick={openSoundMixer} label="Sounds">
                    <CloudRain className="w-4.5 h-4.5" />
                </DockButton>

                <DockButton onClick={toggleMusicModal} label="Music">
                    <Music className="w-4.5 h-4.5" />
                </DockButton>

                {/* Stats hidden — Supabase paused */}

                <DockButton onClick={openBackgroundPicker} label="Scene">
                    <ImageIcon className="w-4.5 h-4.5" />
                </DockButton>

                {/* Divider */}
                <div className="w-px h-5 bg-white/10 mx-1" />

                <DockButton
                    isLink
                    href={BUY_ME_COFFEE_URL}
                    external
                    label="Buy me a coffee"
                    className="hover:text-yellow-400 hover:bg-yellow-400/10"
                >
                    <Coffee className="w-4.5 h-4.5" />
                </DockButton>
            </div>
        </div>
    );
}
