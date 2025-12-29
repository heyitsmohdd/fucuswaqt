'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogOut, Settings, ChevronRight, X } from 'lucide-react';
import { AuthModal } from './AuthModal';

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setShowAuthModal(false); // Close modal on successful auth
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setShowDropdown(false);
    };

    // Get first name from full name
    const getFirstName = () => {
        const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
        if (fullName) {
            return fullName.split(' ')[0];
        }
        return user?.email?.split('@')[0] || 'User';
    };

    // Get full name
    const getFullName = () => {
        return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    };

    if (loading) {
        return (
            <div className="rounded-full px-5 py-2.5 bg-black/40 backdrop-blur-sm">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // Logged OUT state
    if (!user) {
        return (
            <>
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="rounded-full px-5 py-2.5 bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 text-white font-medium text-sm"
                >
                    Sign In
                </button>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </>
        );
    }

    // Logged IN state
    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="rounded-full p-1.5 bg-black/50 backdrop-blur-sm hover:bg-black/60 transition-all duration-200"
            >
                {user.user_metadata?.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt={getFirstName()}
                        className="w-9 h-9 rounded-full ring-2 ring-blue-500"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-blue-500">
                        {getFirstName().charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute -right-4 top-full mt-2 w-64 rounded-xl bg-[#1E1E1E] border border-white/10 shadow-2xl z-50 overflow-hidden">
                        {/* User Header */}
                        <div className="p-4 relative">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <h3 className="text-white font-bold text-base pr-6">{getFullName()}</h3>
                            <p className="text-gray-400 text-sm mt-0.5">
                                {user.email || 'Guest Account'}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10" />

                        {/* Actions */}
                        <div className="py-1">
                            {/* Settings */}
                            <button
                                onClick={() => alert('Settings coming soon!')}
                                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-sm text-gray-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Settings className="w-4 h-4" />
                                    <span>App settings</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Logout */}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-sm text-gray-200"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
