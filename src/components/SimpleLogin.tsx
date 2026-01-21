'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { ALLOWED_ORIGINS, PRODUCTION_URL } from '@/constants';
import { Loader2 } from 'lucide-react';

// Validate and get safe redirect origin
function getSafeRedirectOrigin(): string {
    if (typeof window === 'undefined') return PRODUCTION_URL;

    const currentOrigin = window.location.origin;

    // Check if current origin is in allowed list
    if (ALLOWED_ORIGINS.includes(currentOrigin as typeof ALLOWED_ORIGINS[number])) {
        return currentOrigin;
    }

    // Fallback to production URL for security
    return PRODUCTION_URL;
}

export default function SimpleLogin() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleLogin = async (provider: 'google' | 'github') => {
        try {
            setIsLoading(provider);
            const safeOrigin = getSafeRedirectOrigin();

            await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${safeOrigin}/auth/callback`,
                },
            });
        } catch {
            // Silent fail - reset loading state
            setIsLoading(null);
        }
    };

    return (
        <div className="w-full">
            {/* Google Button - Outlined Style */}
            <button
                onClick={() => handleLogin('google')}
                disabled={!!isLoading}
                className="group relative flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white text-gray-800 text-[15px] font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
                {isLoading === 'google' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                ) : (
                    <>
                        {/* Google Logo SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Continue with Google</span>
                    </>
                )}
            </button>
        </div>
    );
}
