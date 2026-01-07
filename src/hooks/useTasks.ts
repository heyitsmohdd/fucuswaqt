'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { TASK_MAX_LENGTH } from '@/constants';

export function useTasks() {
    const { tasks, addTask: addTaskToStore, toggleTask: toggleTaskInStore, removeTask: removeTaskFromStore } = useAppStore();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    // Get current user
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    // Fetch tasks on mount (only if user is logged in)
    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    return;
                }

                if (data) {
                    // Clear existing tasks and populate with Supabase data
                    useAppStore.setState({ tasks: data });
                }
            } catch {
                // Silently handle fetch errors
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user, supabase]);

    // Add task (with Supabase sync if logged in)
    const addTask = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        // Validate length (UI should have shown error, this is a safeguard)
        if (trimmed.length > TASK_MAX_LENGTH) return;

        if (user) {
            // If logged in, add to Supabase first
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert([
                        { user_id: user.id, title: text.trim(), is_completed: false }
                    ])
                    .select();

                if (error) {
                    return;
                }

                if (data && data[0]) {
                    // Add the returned task to local state
                    useAppStore.setState((state) => ({
                        tasks: [data[0], ...state.tasks],
                        currentTask: '',
                    }));
                }
            } catch {
                // Silently handle add errors
            } finally {
                setLoading(false);
            }
        } else {
            // If not logged in, just use local storage via Zustand
            addTaskToStore(text);
        }
    };

    // Toggle task completion (with Supabase sync if logged in)
    const toggleTask = async (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        if (user) {
            // If logged in, update in Supabase first
            setLoading(true);
            try {
                const { error } = await supabase
                    .from('tasks')
                    .update({ is_completed: !task.is_completed })
                    .eq('id', id);

                if (error) {
                    return;
                }

                // Update local state
                toggleTaskInStore(id);
            } catch {
                // Silently handle toggle errors
            } finally {
                setLoading(false);
            }
        } else {
            // If not logged in, just use local storage via Zustand
            toggleTaskInStore(id);
        }
    };

    // Remove task (with Supabase sync if logged in)
    const removeTask = async (id: string) => {
        if (user) {
            // If logged in, delete from Supabase first
            setLoading(true);
            try {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', id);

                if (error) {
                    return;
                }

                // Update local state
                removeTaskFromStore(id);
            } catch {
                // Silently handle remove errors
            } finally {
                setLoading(false);
            }
        } else {
            // If not logged in, just use local storage via Zustand
            removeTaskFromStore(id);
        }
    };

    return {
        tasks,
        loading,
        isLoggedIn: !!user,
        addTask,
        toggleTask,
        removeTask,
    };
}
