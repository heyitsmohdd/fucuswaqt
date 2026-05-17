'use server';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { headers } from 'next/headers';

export interface FocusDay {
    date: string;
    focus_minutes: number;
    sessions_completed: number;
    tasks_completed: number;
}

export async function fetchFocusHeatmap(days: number = 365): Promise<FocusDay[]> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) return [];

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const rows = await sql`
            SELECT date, focus_minutes, sessions_completed, tasks_completed
            FROM daily_focus
            WHERE user_id = ${session.user.id}
              AND date >= ${startDateStr}
            ORDER BY date ASC
        `;

        return rows.map(row => ({
            date: String(row.date),
            focus_minutes: Number(row.focus_minutes),
            sessions_completed: Number(row.sessions_completed),
            tasks_completed: Number(row.tasks_completed),
        }));
    } catch {
        return [];
    }
}
