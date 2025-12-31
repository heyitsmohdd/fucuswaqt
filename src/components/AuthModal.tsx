'use client';

import { X } from 'lucide-react';
import CubeLogin from './CubeLogin';

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
                <div className="relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Sign in to save progress</h2>
                        <p className="text-white/60 text-sm">Track your streaks and sync across devices</p>
                    </div>

                    {/* 3D Cube Login Component */}
                    <CubeLogin />
                </div>
            </div>
        </>
    );
}
