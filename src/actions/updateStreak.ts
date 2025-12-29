'use server';

import { createClient } from '@/lib/supabase/server';

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
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'User not authenticated' };
        }

        // Fetch current profile
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (fetchError) {
            return { success: false, error: `Failed to fetch profile: ${fetchError.message}` };
        }

        // Calculate streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        let newStreak = 1;
        let shouldUpdate = true;

        if (profile.last_study_date) {
            const lastStudyDate = new Date(profile.last_study_date);
            lastStudyDate.setHours(0, 0, 0, 0);
            const lastStudyStr = lastStudyDate.toISOString().split('T')[0];

            // Check if already studied today
            if (lastStudyStr === todayStr) {
                // Already studied today, no need to update
                shouldUpdate = false;
                newStreak = profile.current_streak;
            } else {
                // Calculate days difference
                const diffTime = today.getTime() - lastStudyDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Studied yesterday, increment streak
                    newStreak = (profile.current_streak || 0) + 1;
                } else {
                    // Missed day(s), reset to 1
                    newStreak = 1;
                }
            }
        }

        if (!shouldUpdate) {
            return { success: true, profile };
        }

        // Update profile
        const newLongestStreak = Math.max(profile.longest_streak || 0, newStreak);

        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
                current_streak: newStreak,
                longest_streak: newLongestStreak,
                last_study_date: todayStr,
            })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            return { success: false, error: `Failed to update profile: ${updateError.message}` };
        }

        return { success: true, profile: updatedProfile };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
