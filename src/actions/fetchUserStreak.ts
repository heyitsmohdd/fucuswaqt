'use server';

import { createClient } from '@/lib/supabase/server';

export async function fetchUserStreak(): Promise<number> {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return 0; // Not authenticated, return 0
        }

        // Fetch current profile
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('current_streak')
            .eq('id', user.id)
            .single();

        if (fetchError || !profile) {
            return 0; // Profile not found, return 0
        }

        return profile.current_streak || 0;
    } catch (error) {
        console.error('Error fetching user streak:', error);
        return 0;
    }
}
