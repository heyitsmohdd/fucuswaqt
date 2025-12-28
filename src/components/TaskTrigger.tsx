'use client';

import { ListTodo } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function TaskTrigger() {
    const { openTaskModal, tasks } = useAppStore();

    // Get the current task name if any tasks exist
    const currentTaskName = tasks.length > 0 ? tasks[0] : null;

    return (
        <button
            onClick={openTaskModal}
            className="group flex items-center gap-3 text-white hover:text-white/90 transition-all hover:scale-105"
        >
            <ListTodo className="w-6 h-6" />
            <span className="text-xl font-light">
                {currentTaskName || 'What are you working on?'}
            </span>
        </button>
    );
}
