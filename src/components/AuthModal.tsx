'use client';

import { X } from 'lucide-react';
import SimpleLogin from './SimpleLogin';

const INK = '#0D2118';
const SAGE = '#85AB8B';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    style={{
                        position: 'relative',
                        background: '#FFFFFF',
                        border: `2px solid ${INK}`,
                        boxShadow: `6px 6px 0px ${INK}`,
                        borderRadius: 0,
                        width: '100%',
                        maxWidth: 400,
                        padding: '48px 36px 40px',
                        pointerEvents: 'auto',
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: 16, right: 16,
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `2px solid ${INK}`, borderRadius: 8,
                            background: '#FFFFFF', cursor: 'pointer',
                            color: INK, padding: 0,
                        }}
                        aria-label="Close authentication modal"
                    >
                        <X style={{ width: 16, height: 16 }} />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            marginBottom: 12,
                        }}>
                            <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <circle cx="16" cy="9"  r="8" fill={SAGE} opacity="0.85" />
                                <circle cx="23" cy="16" r="8" fill={SAGE} opacity="0.85" />
                                <circle cx="16" cy="23" r="8" fill={SAGE} opacity="0.85" />
                                <circle cx="9"  cy="16" r="8" fill={SAGE} opacity="0.85" />
                                <circle cx="16" cy="16" r="4" fill={INK} />
                            </svg>
                            <span id="auth-modal-title" style={{
                                fontWeight: 800, fontSize: '1.25rem',
                                letterSpacing: '-0.03em', color: INK,
                            }}>
                                FocusWaqt
                            </span>
                        </div>
                        <p style={{ color: INK, fontSize: '0.875rem', fontWeight: 600, opacity: 0.55 }}>
                            Sign in to track streaks &amp; progress
                        </p>
                    </div>

                    <SimpleLogin />
                </div>
            </div>
        </>
    );
}
