'use client';

// Supabase paused — all task operations use local Zustand store only.
// Supabase sync logic is preserved below in comments; re-enable when DB is back.

import { useAppStore } from '@/stores/appStore';
import { TASK_MAX_LENGTH } from '@/constants';

export function useTasks() {
    const { tasks, addTask: addTaskToStore, toggleTask: toggleTaskInStore, removeTask: removeTaskFromStore } = useAppStore();

    const addTask = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || trimmed.length > TASK_MAX_LENGTH) return;
        addTaskToStore(text);
    };

    const toggleTask = async (id: string) => {
        toggleTaskInStore(id);
    };

    const removeTask = async (id: string) => {
        removeTaskFromStore(id);
    };

    return {
        tasks,
        loading: false,
        isLoggedIn: false,
        addTask,
        toggleTask,
        removeTask,
    };
}

// ── Supabase sync (re-enable when DB is back) ────────────────────────────────
// import { useEffect, useState } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { User } from '@supabase/supabase-js';
//
// const supabase = createClient();
// const [user, setUser] = useState<User | null>(null);
// const [loading, setLoading] = useState(false);
//
// useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//         setUser(session?.user ?? null);
//     });
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//         setUser(session?.user ?? null);
//     });
//     return () => subscription.unsubscribe();
// }, [supabase.auth]);
//
// ... (full Supabase sync logic preserved in git history)
