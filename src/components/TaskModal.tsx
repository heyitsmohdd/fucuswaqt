'use client';

import { useEffect, useState } from 'react';
import { X, Plus, CheckCircle2, Circle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useAppStore } from '@/stores/appStore';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TASK_MAX_LENGTH, TASK_LIMIT } from '@/constants';

const INK = '#0D2118';
const SAGE = '#85AB8B';

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

    const isAtLimit = tasks.length >= TASK_LIMIT;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <style>{`
                .task-row:hover { background: rgba(133,171,139,0.08) !important; }
                .task-del-btn { opacity: 0; transition: opacity 0.15s; }
                .task-row:hover .task-del-btn { opacity: 1; }
                .nb-add-btn:hover:not(:disabled) { transform: translateY(2px) !important; box-shadow: 2px 2px 0px ${INK} !important; }
                .nb-add-btn:active:not(:disabled) { transform: translateY(3px) !important; box-shadow: 1px 1px 0px ${INK} !important; }
            `}</style>

            <div
                className={cn(
                    'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200',
                    visible ? 'opacity-100' : 'opacity-0'
                )}
                onClick={onClose}
            />

            <div
                className={cn(
                    'relative w-full transition-all duration-220',
                    visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                )}
                style={{
                    maxWidth: 480,
                    background: '#D4EDD8',
                    border: `2px solid ${INK}`,
                    boxShadow: `6px 6px 0px ${INK}`,
                    borderRadius: 16,
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
            >
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px 16px',
                    borderBottom: `2px solid ${INK}`,
                }}>
                    <h2 id="task-modal-title" style={{ color: INK, fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                        Today&apos;s Tasks
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `2px solid ${INK}`, borderRadius: 8,
                            background: '#D4EDD8', cursor: 'pointer',
                            color: INK, padding: 0,
                        }}
                        aria-label="Close task manager"
                    >
                        <X style={{ width: 16, height: 16 }} aria-hidden="true" />
                    </button>
                </div>

                <div style={{ padding: '20px 24px', minHeight: 240 }}>
                    {tasks.length === 0 && !isAddingTask && (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', padding: '32px 0', gap: 10,
                        }}>
                            <div style={{
                                width: 40, height: 40,
                                border: `2px solid ${INK}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(133,171,139,0.1)',
                            }}>
                                <CheckCircle2 style={{ width: 20, height: 20, color: INK, opacity: 0.3 }} />
                            </div>
                            <p style={{ color: INK, fontSize: '0.875rem', fontWeight: 600, opacity: 0.45, textAlign: 'center' }}>
                                No tasks yet. Add your first one below.
                            </p>
                        </div>
                    )}

                    {tasks.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="task-row"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 12px',
                                        border: `1.5px solid ${INK}`,
                                        borderRadius: 8,
                                        background: '#D4EDD8',
                                        transition: 'background 0.12s',
                                    }}
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                                        aria-label={`Mark "${DOMPurify.sanitize(task.title)}" as ${task.is_completed ? 'incomplete' : 'complete'}`}
                                    >
                                        {task.is_completed ? (
                                            <CheckCircle2 style={{ width: 18, height: 18, color: SAGE }} />
                                        ) : (
                                            <Circle style={{ width: 18, height: 18, color: INK, opacity: 0.3 }} />
                                        )}
                                    </button>
                                    <span style={{
                                        fontSize: '0.875rem', fontWeight: 600, flex: 1, color: INK,
                                        textDecoration: task.is_completed ? 'line-through' : 'none',
                                        opacity: task.is_completed ? 0.4 : 1,
                                    }}>
                                        {DOMPurify.sanitize(task.title)}
                                    </span>
                                    <button
                                        onClick={() => removeTask(task.id)}
                                        className="task-del-btn"
                                        style={{
                                            width: 24, height: 24,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: INK, opacity: 0.4, padding: 0,
                                        }}
                                        aria-label={`Delete task "${DOMPurify.sanitize(task.title)}"`}
                                    >
                                        <X style={{ width: 13, height: 13 }} aria-hidden="true" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {isAddingTask && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px',
                                border: `2px solid ${INK}`,
                                borderRadius: 8,
                                background: '#D4EDD8',
                                boxShadow: `3px 3px 0px ${INK}`,
                            }}>
                                <Circle style={{ width: 18, height: 18, color: INK, opacity: 0.3, flexShrink: 0 }} />
                                <input
                                    type="text"
                                    value={currentTask}
                                    onChange={(e) => setCurrentTask(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Task name..."
                                    maxLength={TASK_MAX_LENGTH}
                                    style={{
                                        flex: 1, background: 'transparent',
                                        border: 'none', outline: 'none',
                                        color: INK, fontSize: '0.875rem', fontWeight: 600,
                                    }}
                                    autoFocus
                                />
                            </div>
                            <span style={{
                                fontSize: '0.7rem', textAlign: 'right', paddingRight: 4,
                                color: currentTask.length > TASK_MAX_LENGTH ? '#dc2626' : INK,
                                opacity: 0.4,
                            }}>
                                {currentTask.length}/{TASK_MAX_LENGTH}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={() => setIsAddingTask(true)}
                        disabled={isAtLimit}
                        className="nb-add-btn"
                        style={{
                            width: '100%', padding: '10px 0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            border: `2px dashed ${INK}`,
                            background: 'transparent',
                            color: INK,
                            fontSize: '0.875rem', fontWeight: 700,
                            cursor: isAtLimit ? 'not-allowed' : 'pointer',
                            opacity: isAtLimit ? 0.35 : 0.65,
                            transition: 'transform 0.07s ease, box-shadow 0.07s ease, opacity 0.15s',
                            borderRadius: 8,
                            boxShadow: `4px 4px 0px ${INK}`,
                        }}
                    >
                        <Plus style={{ width: 16, height: 16 }} />
                        {isAtLimit ? `Limit reached (${TASK_LIMIT} tasks)` : 'Add task'}
                    </button>
                </div>
            </div>
        </div>
    );
}
