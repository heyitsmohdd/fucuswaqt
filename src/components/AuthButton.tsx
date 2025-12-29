'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
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
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) console.error('Error logging in:', error.message);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setShowDropdown(false);
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <button
                onClick={handleSignIn}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-white font-medium"
            >
                <LogIn className="w-5 h-5" />
                Login with Google
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
            >
                {user.user_metadata?.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.name || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                    </div>
                )}
                <span className="hidden sm:block font-medium">
                    {user.user_metadata?.name || user.email}
                </span>
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <p className="text-sm text-white/70">Signed in as</p>
                            <p className="text-white font-medium truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
