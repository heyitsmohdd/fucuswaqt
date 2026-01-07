'use client';

import { useEffect, useState } from 'react';
import { X, GripVertical, Plus } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useAppStore } from '@/stores/appStore';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
    const { currentTask, setCurrentTask } = useAppStore();
    const { tasks, loading, addTask, toggleTask, removeTask } = useTasks();
    const [isAddingTask, setIsAddingTask] = useState(false);

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleAddTask = async () => {
        if (currentTask.trim()) {
            await addTask(currentTask);
            setIsAddingTask(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddTask();
        } else if (e.key === 'Escape') {
            setIsAddingTask(false);
            setCurrentTask('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
                    <div className="flex gap-6">
                        <button className="text-lg font-semibold text-white border-b-2 border-white pb-1">
                            Tasks
                        </button>
                        <button
                            onClick={() => toast('📅 Live Calendar feature is coming soon!')}
                            className="text-lg text-white/40 hover:text-white/60 transition-colors"
                        >
                            Events
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-white/80" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 min-h-[300px]">
                    {/* Empty State */}
                    {tasks.length === 0 && !isAddingTask && (
                        <div className="text-center py-8">
                            <p className="text-white/60 text-sm mb-8">
                                No tasks yet! Click the button below to add your first one.
                            </p>
                        </div>
                    )}

                    {/* Task List */}
                    {tasks.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors"
                                >
                                    <GripVertical className="w-4 h-4 text-white/30" />
                                    <input
                                        type="checkbox"
                                        checked={task.is_completed}
                                        onChange={() => toggleTask(task.id)}
                                        className="w-4 h-4 rounded bg-transparent border-2 border-white/30 checked:bg-white checked:border-white cursor-pointer"
                                    />
                                    <span className={cn(
                                        "text-white text-sm flex-1",
                                        task.is_completed && "line-through text-white/50"
                                    )}>
                                        {DOMPurify.sanitize(task.title)}
                                    </span>
                                    <button
                                        onClick={() => removeTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 text-white/60 hover:text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Task Input (when active) */}
                    {isAddingTask && (
                        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg mb-4">
                            <GripVertical className="w-4 h-4 text-white/30" />
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded bg-white/10 border-white/30"
                                disabled
                            />
                            <input
                                type="text"
                                value={currentTask}
                                onChange={(e) => setCurrentTask(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleAddTask}
                                placeholder="Task name..."
                                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/40"
                                autoFocus
                            />
                        </div>
                    )}

                    {/* New Task Button */}
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="w-full p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 transition-colors flex items-center justify-center gap-2 text-white/60 hover:text-white/80"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">New task</span>
                    </button>

                    {/* Footer Text */}
                    <p className="text-center text-white/30 text-xs mt-4">
                        Add up to 3 tasks.
                    </p>
                </div>
            </div>
        </div>
    );
}
