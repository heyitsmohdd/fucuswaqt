'use server';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { headers } from 'next/headers';

export async function updateDailyFocus(minutes: number, tasksCompleted: number = 0) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) return { success: false, error: 'Not authenticated' };

        const today = new Date().toISOString().split('T')[0];

        await sql`
            INSERT INTO daily_focus (user_id, date, focus_minutes, sessions_completed, tasks_completed)
            VALUES (${session.user.id}, ${today}, ${minutes}, 1, ${tasksCompleted})
            ON CONFLICT (user_id, date)
            DO UPDATE SET
                focus_minutes = daily_focus.focus_minutes + EXCLUDED.focus_minutes,
                sessions_completed = daily_focus.sessions_completed + 1,
                tasks_completed = daily_focus.tasks_completed + EXCLUDED.tasks_completed
        `;

        return { success: true };
    } catch {
        return { success: false, error: 'Failed to update focus data' };
    }
}
