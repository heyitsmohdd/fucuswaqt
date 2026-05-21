'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { TIMER_PRESETS, type TimerPresetKey } from '@/constants';
import { cn } from '@/lib/utils';

const SAGE = '#85AB8B';

interface TimerSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TimerSettingsModal({ isOpen, onClose }: TimerSettingsModalProps) {
    const { currentPreset, customDurations, setPreset, setCustomDurations } = useTimerStore();

    const [localCustom, setLocalCustom] = useState({
        focus: String(customDurations.focus),
        break: String(customDurations.break),
        longBreak: String(customDurations.longBreak),
    });

    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            setLocalCustom({
                focus: String(customDurations.focus),
                break: String(customDurations.break),
                longBreak: String(customDurations.longBreak),
            });
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else {
            setVisible(false);
            const t = setTimeout(() => setMounted(false), 220);
            return () => clearTimeout(t);
        }
    }, [isOpen, customDurations]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const handlePresetSelect = (preset: Exclude<TimerPresetKey, 'custom'>) => {
        const p = TIMER_PRESETS[preset];
        setLocalCustom({
            focus: String(p.focus),
            break: String(p.break),
            longBreak: String(p.longBreak),
        });
    };

    const handleCustomSave = () => {
        const parsed = {
            focus: Math.max(1, Math.min(180, Number(localCustom.focus) || 25)),
            break: Math.max(1, Math.min(60, Number(localCustom.break) || 5)),
            longBreak: Math.max(1, Math.min(90, Number(localCustom.longBreak) || 15)),
        };
        setCustomDurations(parsed);
        setPreset('custom');
        onClose();
    };

    const presetButtons: { key: Exclude<TimerPresetKey, 'custom'>; focus: number; breakMin: number; long: number }[] = [
        { key: 'short',  focus: 25, breakMin: 5,  long: 15 },
        { key: 'medium', focus: 50, breakMin: 10, long: 20 },
        { key: 'long',   focus: 90, breakMin: 15, long: 30 },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <style>{`
                .nb-preset:hover { background: rgba(133,171,139,0.15) !important; }
                .nb-save-btn:hover { transform: translateY(1px) !important; opacity: 0.85 !important; }
                .nb-settings-input:focus { outline: none; border-color: rgba(255,255,255,0.4) !important; }
                .nb-settings-input::-webkit-outer-spin-button,
                .nb-settings-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .nb-settings-input[type=number] { -moz-appearance: textfield; }
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
                    maxWidth: 340,
                    background: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'none',
                    borderRadius: 0,
                    padding: 24,
                }}
            >
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 24,
                }}>
                    <h2 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                        Timer Settings
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                            background: '#0A0A0A', cursor: 'pointer',
                            color: '#FFFFFF', padding: 0,
                        }}
                        aria-label="Close"
                    >
                        <X style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <p style={{
                        fontSize: '0.7rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: '#FFFFFF', opacity: 0.45, marginBottom: 10,
                    }}>
                        Presets — Focus / Break / Long
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {presetButtons.map(({ key, focus, breakMin, long }) => {
                            const isActive = localCustom.focus === String(focus) && localCustom.break === String(breakMin) && localCustom.longBreak === String(long);
                            return (
                                <button
                                    key={key}
                                    onClick={() => handlePresetSelect(key)}
                                    className="nb-preset"
                                    style={{
                                        padding: '10px 6px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: isActive ? `rgba(133,171,139,0.2)` : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'background 0.12s',
                                    }}
                                >
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF', marginBottom: 2 }}>
                                        {focus}m
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#FFFFFF', opacity: 0.5 }}>
                                        {breakMin} / {long}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0' }} />

                <div>
                    <p style={{
                        fontSize: '0.7rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: '#FFFFFF', opacity: 0.45, marginBottom: 10,
                    }}>
                        Custom (minutes)
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                        {[
                            { field: 'focus' as const, label: 'Focus', max: 180 },
                            { field: 'break' as const, label: 'Break', max: 60 },
                            { field: 'longBreak' as const, label: 'Long', max: 90 },
                        ].map(({ field, label, max }) => (
                            <div key={field}>
                                <label style={{
                                    display: 'block', fontSize: '0.7rem',
                                    fontWeight: 700, color: '#FFFFFF', opacity: 0.45, marginBottom: 6,
                                }}>
                                    {label}
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={max}
                                    value={localCustom[field]}
                                    onChange={(e) => setLocalCustom({ ...localCustom, [field]: e.target.value })}
                                    className="nb-settings-input"
                                    style={{
                                        width: '100%', padding: '8px 6px',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        background: '#0A0A0A',
                                        borderRadius: 0,
                                        color: '#FFFFFF',
                                        fontSize: '0.875rem', fontWeight: 700,
                                        textAlign: 'center',
                                        transition: 'box-shadow 0.07s ease',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleCustomSave}
                        className="nb-save-btn"
                        style={{
                            width: '100%', padding: '10px 0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: currentPreset === 'custom' ? SAGE : 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: 'none',
                            borderRadius: 0,
                            color: '#FFFFFF',
                            fontWeight: 800, fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'transform 0.07s ease, box-shadow 0.07s ease',
                        }}
                    >
                        <Check style={{ width: 16, height: 16 }} />
                        {currentPreset === 'custom' ? 'Custom active' : 'Use custom'}
                    </button>
                </div>
            </div>
        </div>
    );
}
