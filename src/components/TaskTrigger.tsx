'use client';

import { useAppStore } from '@/stores/appStore';

export function TaskTrigger() {
    const { openTaskModal, tasks } = useAppStore();

    const activeTask = tasks.find(task => !task.is_completed);

    return (
        <button
            onClick={openTaskModal}
            className="text-sm transition-colors duration-200 btn-press text-white/40 hover:text-white/70"
        >
            {activeTask ? (
                <span className="text-white/80 font-medium max-w-[280px] truncate block">{activeTask.title}</span>
            ) : (
                'What are you working on?'
            )}
        </button>
    );
}
