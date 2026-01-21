import { createClient } from '@supabase/supabase-js';

// 1. Get the Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Note: If serviceRoleKey is missing, rate limiting is bypassed (fail-open)

// 3. Create the Admin Client
// We use the Service Role Key to bypass RLS policies on the 'rate_limits' table
const supabaseAdmin = createClient(
    supabaseUrl,
    serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkRateLimit(identifier: string, type: 'auth' | 'streak') {
    // If the key is missing, "fail open" (allow the request) so we don't block users due to a config error
    if (!serviceRoleKey) return true;

    // Define limits
    let limit = 10; // Default
    const window = 60; // Default seconds

    if (type === 'streak') {
        limit = 60; // 60 requests per minute
    } else if (type === 'auth') {
        limit = 5;  // 5 login attempts per minute
    }

    try {
        // Call the database function
        const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
            rate_key: `${type}:${identifier}`,
            limit_count: limit,
            window_seconds: window
        });

        if (error) {
            return true; // If DB fails, allow the request
        }

        return data; // Returns TRUE if allowed, FALSE if blocked
    } catch {
        return true; // Fail open on exception
    }
}
