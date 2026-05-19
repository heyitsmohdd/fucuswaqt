'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { LogOut, Settings, ChevronRight, X } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const INK = '#0D2118';
const SAGE = '#85AB8B';

export function AuthButton() {
    const { data: session, isPending } = authClient.useSession();
    const { openAuthModal, closeAuthModal } = useAppStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        if (!session) closeAuthModal();
    }, [session, closeAuthModal]);

    useEffect(() => {
        if (showDropdown) {
            requestAnimationFrame(() => requestAnimationFrame(() => setIsDropdownVisible(true)));
        } else {
            setIsDropdownVisible(false);
        }
    }, [showDropdown]);

    const handleSignOut = async () => {
        await authClient.signOut();
        setShowDropdown(false);
    };

    const getFirstName = () => {
        const fullName = session?.user.name;
        if (fullName) return fullName.split(' ')[0];
        return session?.user.email?.split('@')[0] ?? 'User';
    };

    const getFullName = () => {
        return session?.user.name ?? session?.user.email?.split('@')[0] ?? 'User';
    };

    if (isPending) {
        return (
            <div
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '5px 14px',
                    background: 'rgba(255,255,255,0.92)',
                    border: `2px solid ${INK}`,
                    boxShadow: `2px 2px 0px ${INK}`,
                    borderRadius: 999,
                }}
                role="status"
                aria-label="Loading"
            >
                <div className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: `${INK}40`, borderTopColor: INK }}
                    aria-hidden="true"
                />
            </div>
        );
    }

    if (!session) {
        return (
            <>
                <style>{`
                    .signin-btn:hover { transform: translateY(2px) !important; box-shadow: 1px 1px 0px ${INK} !important; }
                    .signin-btn:active { transform: translateY(3px) !important; box-shadow: 0px 0px 0px ${INK} !important; }
                `}</style>
                <button
                    onClick={openAuthModal}
                    className="signin-btn"
                    style={{
                        padding: '6px 16px',
                        background: 'rgba(255,255,255,0.92)',
                        border: `2px solid ${INK}`,
                        boxShadow: `2px 2px 0px ${INK}`,
                        borderRadius: 999,
                        color: INK,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'transform 0.07s ease, box-shadow 0.07s ease',
                    }}
                >
                    Sign In
                </button>
            </>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                    padding: 3,
                    background: 'rgba(255,255,255,0.92)',
                    border: `2px solid ${INK}`,
                    boxShadow: `2px 2px 0px ${INK}`,
                    borderRadius: 999,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                }}
                aria-label="Open user menu"
                aria-expanded={showDropdown}
                aria-haspopup="menu"
            >
                {session.user.image ? (
                    <Image
                        src={session.user.image}
                        alt={getFirstName()}
                        width={30}
                        height={30}
                        style={{ borderRadius: '50%', display: 'block' }}
                    />
                ) : (
                    <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: SAGE,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: INK, fontSize: '0.75rem', fontWeight: 800,
                    }}>
                        {getFirstName().charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />

                    <div
                        className={cn(
                            'absolute z-50 overflow-hidden transition-all duration-200',
                            isDropdownVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
                        )}
                        style={{
                            right: -4, top: 'calc(100% + 8px)',
                            width: 240,
                            background: '#FFFFFF',
                            border: `2px solid ${INK}`,
                            boxShadow: `4px 4px 0px ${INK}`,
                            borderRadius: 0,
                        }}
                    >
                        <div style={{ padding: '16px', position: 'relative', borderBottom: `2px solid ${INK}` }}>
                            <button
                                onClick={() => setShowDropdown(false)}
                                style={{
                                    position: 'absolute', top: 10, right: 10,
                                    width: 24, height: 24,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `1.5px solid ${INK}`, borderRadius: 6,
                                    background: '#FFFFFF', cursor: 'pointer',
                                    color: INK, padding: 0,
                                }}
                                aria-label="Close user menu"
                            >
                                <X style={{ width: 12, height: 12 }} aria-hidden="true" />
                            </button>
                            <p style={{ color: INK, fontWeight: 800, fontSize: '0.875rem', paddingRight: 28 }}>
                                {getFullName()}
                            </p>
                            <p style={{ color: INK, fontSize: '0.75rem', marginTop: 2, opacity: 0.45, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {session.user.email ?? 'Guest Account'}
                            </p>
                        </div>

                        <div>
                            <button
                                onClick={() => { setShowDropdown(false); toast.info('Settings coming soon!'); }}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 16px',
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    borderBottom: `1px solid rgba(13,33,24,0.1)`,
                                    color: INK,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(133,171,139,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Settings style={{ width: 15, height: 15, opacity: 0.5 }} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>App settings</span>
                                </div>
                                <ChevronRight style={{ width: 14, height: 14, opacity: 0.3 }} />
                            </button>

                            <button
                                onClick={handleSignOut}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 16px',
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: INK,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(133,171,139,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <LogOut style={{ width: 15, height: 15, opacity: 0.5 }} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Sign out</span>
                                </div>
                                <ChevronRight style={{ width: 14, height: 14, opacity: 0.3 }} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
