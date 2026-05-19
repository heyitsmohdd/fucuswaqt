'use client';

import { useAppStore } from '@/stores/appStore';
import { Flame } from 'lucide-react';

const INK = '#0D2118';

export function StreakCounter() {
    const { streakDays } = useAppStore();

    return (
        <div
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#FFFFFF',
                border: `2px solid ${INK}`,
                boxShadow: `2px 2px 0px ${INK}`,
                borderRadius: 999,
                padding: '5px 14px',
            }}
            aria-label={`Current streak: ${streakDays} day${streakDays !== 1 ? 's' : ''}`}
            role="status"
        >
            <Flame
                style={{
                    width: 14, height: 14, color: '#FB923C',
                    filter: streakDays > 0 ? 'drop-shadow(0 0 4px rgba(251,146,60,0.7))' : undefined,
                    flexShrink: 0,
                }}
                aria-hidden="true"
            />
            <span style={{ color: INK, fontWeight: 700, fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
                {streakDays}
            </span>
        </div>
    );
}
