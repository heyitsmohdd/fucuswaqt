'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateDailyFocus(minutes: number, tasksCompleted: number = 0) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Use the increment function for efficiency
        const { error } = await supabase.rpc('increment_daily_focus', {
            p_user_id: user.id,
            p_date: today,
            p_minutes: minutes,
            p_sessions: 1,
            p_tasks: tasksCompleted
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Failed to update focus data' };
    }
}
