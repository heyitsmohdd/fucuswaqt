'use client';

import { Zap, Target } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function TaskTrigger() {
    const { openTaskModal, tasks } = useAppStore();

    const activeTask = tasks.find(task => !task.is_completed);
    const showFocusMode = activeTask !== undefined;

    return (
        <button
            onClick={openTaskModal}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/8 hover:bg-black/45 hover:border-white/18 transition-all duration-200 btn-press"
        >
            {showFocusMode ? (
                <>
                    <Zap className="w-4 h-4 text-white/70 group-hover:text-white/90 transition-colors shrink-0" />
                    <span className="text-white/90 text-sm font-medium max-w-[240px] truncate">
                        {activeTask.title}
                    </span>
                </>
            ) : (
                <>
                    <Target className="w-4 h-4 text-white/35 group-hover:text-white/55 transition-colors shrink-0" />
                    <span className="text-white/40 text-sm font-medium group-hover:text-white/60 transition-colors">
                        What are you working on?
                    </span>
                </>
            )}
        </button>
    );
}
