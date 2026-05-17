'use client';

import { X } from 'lucide-react';
import SimpleLogin from './SimpleLogin';
import { Logo } from './Logo';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="relative bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-[460px] py-14 px-12 shadow-2xl pointer-events-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors"
                        aria-label="Close authentication modal"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex justify-center mb-10">
                        <Logo />
                    </div>

                    {/* Simple Login Component */}
                    <SimpleLogin />
                </div>
            </div>
        </>
    );
}
