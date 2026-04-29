'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogOut, Settings, ChevronRight, X } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setShowAuthModal(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    // Dropdown animate in
    useEffect(() => {
        if (showDropdown) {
            requestAnimationFrame(() => requestAnimationFrame(() => setDropdownVisible(true)));
        } else {
            setDropdownVisible(false);
        }
    }, [showDropdown]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setShowDropdown(false);
    };

    const getFirstName = () => {
        const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
        if (fullName) return fullName.split(' ')[0];
        return user?.email?.split('@')[0] || 'User';
    };

    const getFullName = () => {
        return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    };

    if (loading) {
        return (
            <div className="rounded-full px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/8" role="status" aria-label="Loading">
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" aria-hidden="true" />
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="rounded-full px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/8 hover:bg-black/55 hover:border-white/15 transition-all duration-200 text-white/90 font-medium text-sm btn-press"
                >
                    Sign In
                </button>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="rounded-full p-1 bg-black/40 backdrop-blur-sm border border-white/8 hover:border-white/20 transition-all duration-200 btn-press"
                aria-label="Open user menu"
                aria-expanded={showDropdown}
                aria-haspopup="menu"
            >
                {user.user_metadata?.avatar_url ? (
                    <Image
                        src={user.user_metadata.avatar_url}
                        alt={getFirstName()}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full ring-1 ring-white/20"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20">
                        {getFirstName().charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />

                    <div className={cn(
                        'absolute -right-2 top-full mt-2 w-60 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 overflow-hidden transition-all duration-200',
                        dropdownVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
                    )}>
                        {/* User Header */}
                        <div className="p-4 relative">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors btn-press"
                                aria-label="Close user menu"
                            >
                                <X className="w-3.5 h-3.5 text-white/50" aria-hidden="true" />
                            </button>
                            <p className="text-white font-semibold text-sm pr-8">{getFullName()}</p>
                            <p className="text-white/40 text-xs mt-0.5 truncate">
                                {user.email || 'Guest Account'}
                            </p>
                        </div>

                        <div className="border-t border-white/8" />

                        <div className="py-1.5">
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    toast.info('Settings coming soon!');
                                }}
                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/6 transition-colors text-sm text-white/80"
                            >
                                <div className="flex items-center gap-3">
                                    <Settings className="w-4 h-4 text-white/50" />
                                    <span>App settings</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                            </button>

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/6 transition-colors text-sm text-white/80"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut className="w-4 h-4 text-white/50" />
                                    <span>Sign out</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
