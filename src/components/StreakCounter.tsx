'use client';

import { useAppStore } from '@/stores/appStore';
import { Flame } from 'lucide-react';

export function StreakCounter() {
    const { streakDays } = useAppStore();

    return (
        <div className="glass rounded-full px-6 py-3 flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-white font-medium">
                {streakDays} streak {streakDays === 1 ? 'day' : 'days'}
            </span>
        </div>
    );
}
