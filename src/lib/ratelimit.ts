import { sql } from '@/lib/db';

const RATE_LIMIT_CONFIG = {
    auth: { limit: 5, windowSeconds: 60 },
    streak: { limit: 60, windowSeconds: 60 },
} as const;

export async function checkRateLimit(identifier: string, type: 'auth' | 'streak'): Promise<boolean> {
    const { limit, windowSeconds } = RATE_LIMIT_CONFIG[type];
    const key = `${type}:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    try {
        await sql`DELETE FROM rate_limits WHERE key = ${key} AND timestamp < ${windowStart}`;

        const countRows = await sql`SELECT COUNT(*) as count FROM rate_limits WHERE key = ${key}`;
        const currentCount = Number(countRows[0].count);

        if (currentCount >= limit) return false;

        await sql`INSERT INTO rate_limits (key, timestamp) VALUES (${key}, ${now})`;

        return true;
    } catch {
        return true;
    }
}
