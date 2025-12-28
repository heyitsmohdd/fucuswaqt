'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface BackgroundPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BackgroundPickerModal({ isOpen, onClose }: BackgroundPickerModalProps) {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 className="text-2xl font-bold text-white">Set your focus scene</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-white/80" />
                    </button>
                </div>

                {/* Body - Empty for now, will be filled in future steps */}
                <div className="px-6 pb-6">
                    <div className="min-h-[300px] flex items-center justify-center">
                        <p className="text-white/50 text-sm">Background selection content will be added here</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
