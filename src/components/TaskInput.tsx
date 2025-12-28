'use client';

import { useAppStore } from '@/stores/appStore';
import { KeyboardEvent } from 'react';
import { X } from 'lucide-react';

export function TaskInput() {
    const { currentTask, tasks, setCurrentTask, addTask, removeTask } = useAppStore();

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTask(currentTask);
        }
    };

    return (
        <div className="w-full max-w-2xl space-y-4">
            {/* Input Field */}
            <input
                type="text"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What are you working on?"
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 backdrop-blur-sm transition-all"
            />

            {/* Task List */}
            {tasks.length > 0 && (
                <div className="glass rounded-xl p-4 space-y-2">
                    {tasks.map((task, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg group"
                        >
                            <span className="text-gray-200 text-sm flex-1">{task}</span>
                            <button
                                onClick={() => removeTask(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
