'use client';

import { useAppStore } from '@/stores/appStore';
import { Flame } from 'lucide-react';

export function StreakCounter() {
    const { streakDays } = useAppStore();

    return (
        <div
            className="rounded-full px-4 py-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/8 hover:border-white/15 transition-colors"
            aria-label={`Current streak: ${streakDays} day${streakDays !== 1 ? 's' : ''}`}
            role="status"
        >
            <Flame
                className="w-3.5 h-3.5 text-orange-400"
                aria-hidden="true"
                style={{ filter: streakDays > 0 ? 'drop-shadow(0 0 4px rgba(251,146,60,0.6))' : undefined }}
            />
            <span className="text-orange-400 font-semibold text-sm tabular-nums">
                {streakDays}
            </span>
        </div>
    );
}
