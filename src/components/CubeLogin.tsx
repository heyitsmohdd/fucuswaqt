"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { ALLOWED_ORIGINS, PRODUCTION_URL } from "@/constants";
import styles from "./CubeLogin.module.css";

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

export default function CubeLogin() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (provider: 'google' | 'github') => {
        setLoading(true);
        const safeOrigin = getSafeRedirectOrigin();
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${safeOrigin}/auth/callback`,
            },
        });
    };

    return (
        <div className={styles.form}>
            <h1 className={styles.title}>System Access</h1>

            {/* GOOGLE BUTTON */}
            <button
                className={`${styles.control} ${styles.blockCube}`}
                onClick={() => handleLogin('google')}
                disabled={loading}
            >
                <div className={styles.bgTop}><div className={styles.bgInner}></div></div>
                <div className={styles.bgRight}><div className={styles.bgInner}></div></div>
                <div className={styles.bg}><div className={styles.bgInner}></div></div>
                <div className={styles.text}>
                    {loading ? "CONNECTING..." : "LOG IN WITH GOOGLE"}
                </div>
            </button>

            {/* GITHUB BUTTON */}
            <button
                className={`${styles.control} ${styles.blockCube}`}
                onClick={() => handleLogin('github')}
                disabled={loading}
            >
                <div className={styles.bgTop}><div className={styles.bgInner}></div></div>
                <div className={styles.bgRight}><div className={styles.bgInner}></div></div>
                <div className={styles.bg}><div className={styles.bgInner}></div></div>
                <div className={styles.text}>
                    {loading ? "CONNECTING..." : "LOG IN WITH GITHUB"}
                </div>
            </button>

            <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '12px', fontFamily: 'monospace', color: '#fff' }}>
                SECURE CONNECTION // ENCRYPTED
            </div>
        </div>
    );
}
