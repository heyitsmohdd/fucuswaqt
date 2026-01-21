'use client';

import { ListTodo, Zap } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function TaskTrigger() {
    const { openTaskModal, tasks } = useAppStore();

    // Find the most recent uncompleted task
    const activeTask = tasks.find(task => !task.is_completed);
    const showFocusMode = activeTask !== undefined;

    return (
        <button
            onClick={openTaskModal}
            className="group flex items-center gap-3 text-white hover:text-white/90 transition-all hover:scale-105"
        >
            {showFocusMode ? (
                <>
                    <Zap className="w-6 h-6" />
                    <span className="text-2xl font-semibold">
                        {activeTask.title}
                    </span>
                </>
            ) : (
                <>
                    <ListTodo className="w-6 h-6" />
                    <span className="text-xl font-light">
                        Today's goal...
                    </span>
                </>
            )}
        </button>
    );
}
