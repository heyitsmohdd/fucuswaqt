import { createClient } from "@/lib/supabase/server";

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt?: Date;
}

export async function checkRateLimit(
    userId: string,
    endpoint: string,
    limit: number = 10,
    windowMinutes: number = 1
): Promise<RateLimitResult> {
    const supabase = await createClient();
    const now = new Date();

    // Calculate when the current window started
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

    // 1. Get current rate limit entry
    const { data } = await supabase
        .from('rate_limits')
        .select('count, last_reset')
        .eq('user_id', userId)
        .eq('endpoint', endpoint)
        .single();

    // 2. Decide if we need to reset the window
    // Reset if: no entry exists OR the last reset was older than our window
    const shouldReset = !data || new Date(data.last_reset) < windowStart;

    if (shouldReset) {
        const { error: upsertError } = await supabase
            .from('rate_limits')
            .upsert({
                user_id: userId,
                endpoint: endpoint,
                count: 1,
                last_reset: now.toISOString()
            }, {
                onConflict: 'user_id,endpoint'
            });

        if (upsertError) {
            // Fallback: allow request if DB fails
            return { success: true, remaining: limit - 1 };
        }

        return {
            success: true,
            remaining: limit - 1,
            resetAt: new Date(now.getTime() + windowMinutes * 60 * 1000)
        };
    }

    // 3. Check if over limit
    if (data.count >= limit) {
        return {
            success: false,
            remaining: 0,
            resetAt: new Date(new Date(data.last_reset).getTime() + windowMinutes * 60 * 1000)
        };
    }

    // 4. Increment count
    await supabase
        .from('rate_limits')
        .update({ count: data.count + 1 })
        .eq('user_id', userId)
        .eq('endpoint', endpoint);

    return {
        success: true,
        remaining: limit - data.count - 1,
        resetAt: new Date(new Date(data.last_reset).getTime() + windowMinutes * 60 * 1000)
    };
}
