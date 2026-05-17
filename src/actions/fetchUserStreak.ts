'use server';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { headers } from 'next/headers';

export async function fetchUserStreak(): Promise<number> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) return 0;

        const rows = await sql`
            SELECT current_streak FROM profiles WHERE id = ${session.user.id}
        `;

        return rows[0]?.current_streak ?? 0;
    } catch {
        return 0;
    }
}
