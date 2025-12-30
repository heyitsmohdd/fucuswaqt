'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Github, X, Chrome } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (provider: 'github' | 'google') => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    // This forces Supabase to redirect back to the current domain (localhost OR Vercel)
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                console.error('OAuth error:', error.message);
                alert(`Login failed: ${error.message}`);
                setLoading(false);
            }
            // Note: If successful, user will be redirected, so no need to setLoading(false)
        } catch (err) {
            console.error('Unexpected error during login:', err);
            setLoading(false);
        }
    };

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
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Sign in to save progress</h2>
                        <p className="text-white/60 text-sm">Track your streaks and sync across devices</p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        {/* GitHub Button */}
                        <button
                            onClick={() => handleLogin('github')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <Github className="w-5 h-5" />
                                    <span>Continue with GitHub</span>
                                </>
                            )}
                        </button>

                        {/* Google Button */}
                        <button
                            onClick={() => handleLogin('google')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-black font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <Chrome className="w-5 h-5" />
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
