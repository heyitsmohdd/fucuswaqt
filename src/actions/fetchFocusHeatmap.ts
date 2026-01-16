'use server';

import { createClient } from '@/lib/supabase/server';

export interface FocusDay {
    date: string;
    focus_minutes: number;
    sessions_completed: number;
    tasks_completed: number;
}

export async function fetchFocusHeatmap(days: number = 365): Promise<FocusDay[]> {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return [];
        }

        // Calculate start date (X days ago)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        // Fetch focus data
        const { data, error } = await supabase
            .from('daily_focus')
            .select('date, focus_minutes, sessions_completed, tasks_completed')
            .eq('user_id', user.id)
            .gte('date', startDateStr)
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching heatmap data:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchFocusHeatmap:', error);
        return [];
    }
}
