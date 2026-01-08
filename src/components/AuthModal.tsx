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
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="relative bg-white rounded-3xl w-full max-w-[460px] py-14 px-12 shadow-xl pointer-events-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close authentication modal"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 id="auth-modal-title" className="text-[28px] font-semibold text-gray-900 tracking-tight">Welcome to FocusWaqt</h2>
                    </div>

                    {/* Simple Login Component */}
                    <SimpleLogin />
                </div>
            </div>
        </>
    );
}
