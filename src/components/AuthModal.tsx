'use client';

import { X } from 'lucide-react';
import SimpleLogin from './SimpleLogin';

const INK = '#0D2118';

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
                        borderRadius: 20,
                        width: '100%',
                        maxWidth: 380,
                        padding: '40px 32px 36px',
                        pointerEvents: 'auto',
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: 14, right: 14,
                            width: 30, height: 30,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `2px solid ${INK}`, borderRadius: 8,
                            background: '#FFFFFF', cursor: 'pointer',
                            color: INK, padding: 0,
                        }}
                        aria-label="Close authentication modal"
                    >
                        <X style={{ width: 14, height: 14 }} />
                    </button>

                    <p id="auth-modal-title" style={{
                        color: INK, fontSize: '1.05rem', fontWeight: 800,
                        letterSpacing: '-0.02em', marginBottom: 6,
                    }}>
                        Sign in
                    </p>
                    <p style={{ color: INK, fontSize: '0.875rem', fontWeight: 600, opacity: 0.5, marginBottom: 28 }}>
                        Track streaks &amp; focus history
                    </p>

                    <SimpleLogin />
                </div>
            </div>
        </>
    );
}
