'use client';

import { X } from 'lucide-react';
import SimpleLogin from './SimpleLogin';

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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative bg-black rounded-xl border border-white/10 w-full max-w-[480px] py-12 px-10 shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        aria-label="Close authentication modal"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 id="auth-modal-title" className="text-3xl font-bold text-white mb-3">Sign in</h2>
                        <p className="text-gray-400 text-base">Login to count your streak</p>
                    </div>

                    {/* Simple Login Component */}
                    <SimpleLogin />

                    {/* Decorative Skip Link (Visual only for now, or closes modal) */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={onClose}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            Skip login →
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
