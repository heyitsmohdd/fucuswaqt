'use client';

import { useEffect, useState } from 'react';

const SHORTCUTS = [
    { key: 'Space', label: 'Play / Pause' },
    { key: 'R', label: 'Reset' },
    { key: 'C', label: 'Scene' },
];

export function KeyboardHint() {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('shortcuts-seen')) return;

        const showT = setTimeout(() => {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        }, 2000);

        const hideT = setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                setMounted(false);
                localStorage.setItem('shortcuts-seen', '1');
            }, 400);
        }, 7000);

        return () => {
            clearTimeout(showT);
            clearTimeout(hideT);
        };
    }, []);

    if (!mounted) return null;

    return (
        <div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
        >
            <div className="glass-light rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <span className="text-white/35 text-[11px] font-medium tracking-wide uppercase">Shortcuts</span>
                <div className="w-px h-3.5 bg-white/10" />
                {SHORTCUTS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded-md text-white/60 text-[10px] font-mono">
                            {key}
                        </kbd>
                        <span className="text-white/35 text-[11px]">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
