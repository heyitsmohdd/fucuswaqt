'use server';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { checkRateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

interface Profile {
    id: string;
    current_streak: number;
    longest_streak: number;
    last_study_date: string | null;
    updated_at: string;
}

interface UpdateStreakResult {
    success: boolean;
    profile?: Profile;
    error?: string;
}

export async function updateStreak(): Promise<UpdateStreakResult> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) return { success: false, error: 'User not authenticated' };

        const allowed = await checkRateLimit(session.user.id, 'streak');
        if (!allowed) return { success: false, error: 'You are doing that too fast. Please wait a moment.' };

        const profileRows = await sql`SELECT * FROM profiles WHERE id = ${session.user.id}`;

        if (!profileRows[0]) {
            return { success: false, error: 'Failed to fetch profile' };
        }

        const profile = profileRows[0] as Profile;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        let newStreak = 1;
        let shouldUpdate = true;

        if (profile.last_study_date) {
            const lastStudyDate = new Date(profile.last_study_date);
            lastStudyDate.setHours(0, 0, 0, 0);
            const lastStudyStr = lastStudyDate.toISOString().split('T')[0];

            if (lastStudyStr === todayStr) {
                shouldUpdate = false;
                newStreak = profile.current_streak;
            } else {
                const diffTime = today.getTime() - lastStudyDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                newStreak = diffDays === 1 ? (profile.current_streak || 0) + 1 : 1;
            }
        }

        if (!shouldUpdate) return { success: true, profile };

        const newLongestStreak = Math.max(profile.longest_streak || 0, newStreak);

        const updatedRows = await sql`
            UPDATE profiles
            SET current_streak = ${newStreak},
                longest_streak = ${newLongestStreak},
                last_study_date = ${todayStr},
                updated_at = NOW()
            WHERE id = ${session.user.id}
              AND (last_study_date IS NULL OR last_study_date < ${todayStr})
            RETURNING *
        `;

        if (!updatedRows[0]) {
            const currentRows = await sql`SELECT * FROM profiles WHERE id = ${session.user.id}`;
            return { success: true, profile: currentRows[0] as Profile };
        }

        return { success: true, profile: updatedRows[0] as Profile };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
