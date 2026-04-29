'use client';

import { useEffect, useState } from 'react';
import { X, Plus, CheckCircle2, Circle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useAppStore } from '@/stores/appStore';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TASK_MAX_LENGTH, TASK_LIMIT } from '@/constants';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
    const { currentTask, setCurrentTask } = useAppStore();
    const { tasks, addTask, toggleTask, removeTask } = useTasks();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    // Animate in / out
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else {
            setVisible(false);
            const t = setTimeout(() => setMounted(false), 220);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const handleAddTask = async () => {
        const trimmed = currentTask.trim();
        if (!trimmed) return;

        if (tasks.length >= TASK_LIMIT) {
            toast.error(`Maximum ${TASK_LIMIT} tasks allowed. Delete one to add more.`);
            return;
        }

        if (trimmed.length > TASK_MAX_LENGTH) {
            toast.error(`Task must be ${TASK_MAX_LENGTH} characters or less`);
            return;
        }

        await addTask(currentTask);
        setIsAddingTask(false);
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
                className={cn(
                    'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
                    visible ? 'opacity-100' : 'opacity-0'
                )}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full max-w-lg bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-220',
                    visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
                    <h2 id="task-modal-title" className="text-lg font-semibold text-white tracking-tight">
                        Today&apos;s Tasks
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors btn-press"
                        aria-label="Close task manager"
                    >
                        <X className="w-4 h-4 text-white/60" aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 min-h-[260px]">
                    {/* Empty State */}
                    {tasks.length === 0 && !isAddingTask && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 animate-fade-in">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white/20" />
                            </div>
                            <p className="text-white/40 text-sm text-center">
                                No tasks yet. Add your first one below.
                            </p>
                        </div>
                    )}

                    {/* Task List */}
                    {tasks.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="group flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors border border-transparent hover:border-white/8"
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="shrink-0 transition-all btn-press"
                                        aria-label={`Mark "${DOMPurify.sanitize(task.title)}" as ${task.is_completed ? 'incomplete' : 'complete'}`}
                                    >
                                        {task.is_completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-white/60" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-white/25 group-hover:text-white/40 transition-colors" />
                                        )}
                                    </button>
                                    <span className={cn(
                                        'text-sm flex-1 transition-all',
                                        task.is_completed
                                            ? 'line-through text-white/35'
                                            : 'text-white/90'
                                    )}>
                                        {DOMPurify.sanitize(task.title)}
                                    </span>
                                    <button
                                        onClick={() => removeTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                                        aria-label={`Delete task "${DOMPurify.sanitize(task.title)}"`}
                                    >
                                        <X className="w-3.5 h-3.5 text-white/50 hover:text-white/80" aria-hidden="true" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Task Input */}
                    {isAddingTask && (
                        <div className="flex flex-col gap-1.5 mb-4 animate-slide-down">
                            <div className="flex items-center gap-3 px-3 py-3 bg-white/10 rounded-xl border border-white/15">
                                <Circle className="w-5 h-5 text-white/25 shrink-0" />
                                <input
                                    type="text"
                                    value={currentTask}
                                    onChange={(e) => setCurrentTask(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleAddTask}
                                    placeholder="Task name..."
                                    maxLength={TASK_MAX_LENGTH}
                                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
                                    autoFocus
                                />
                            </div>
                            <span className={cn(
                                'text-xs text-right pr-1',
                                currentTask.length > TASK_MAX_LENGTH ? 'text-red-400' : 'text-white/30'
                            )}>
                                {currentTask.length}/{TASK_MAX_LENGTH}
                            </span>
                        </div>
                    )}

                    {/* Add Task Button */}
                    <button
                        onClick={() => setIsAddingTask(true)}
                        disabled={tasks.length >= TASK_LIMIT}
                        className={cn(
                            'w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all border-dashed border',
                            tasks.length >= TASK_LIMIT
                                ? 'border-white/8 text-white/20 cursor-not-allowed'
                                : 'border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 hover:bg-white/5'
                        )}
                    >
                        <Plus className="w-4 h-4" />
                        <span>
                            {tasks.length >= TASK_LIMIT
                                ? `Limit reached (${TASK_LIMIT} tasks)`
                                : 'Add task'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
