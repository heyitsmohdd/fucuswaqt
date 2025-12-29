'use server';

import { createClient } from '@/lib/supabase/server';

export async function fetchUserStreak(): Promise<number> {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.log('⚠️ fetchUserStreak: User not authenticated');
            return 0; // Not authenticated, return 0
        }

        console.log('📊 fetchUserStreak: Fetching streak for user:', user.email);

        // Fetch current profile
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('current_streak')
            .eq('id', user.id)
            .single();

        if (fetchError || !profile) {
            console.log('⚠️ fetchUserStreak: Profile not found or error:', fetchError?.message);
            return 0; // Profile not found, return 0
        }

        console.log('✅ fetchUserStreak: Current streak is', profile.current_streak || 0);
        return profile.current_streak || 0;
    } catch (error) {
        console.error('❌ fetchUserStreak error:', error);
        return 0;
    }
}
