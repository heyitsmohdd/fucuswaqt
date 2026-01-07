'use client';

import { useAppStore } from '@/stores/appStore';
import { Flame } from 'lucide-react';

export function StreakCounter() {
    const { streakDays } = useAppStore();

    return (
        <div
            className="rounded-full px-5 py-2.5 flex items-center gap-2 bg-black/40 backdrop-blur-sm"
            aria-label={`Current streak: ${streakDays} day${streakDays !== 1 ? 's' : ''}`}
            role="status"
        >
            <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
            <span className="text-orange-500 font-semibold text-sm">
                {streakDays}
            </span>
        </div>
    );
}
