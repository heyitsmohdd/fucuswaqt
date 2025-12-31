"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import styles from "./CubeLogin.module.css";

export default function CubeLogin() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (provider: 'google' | 'github') => {
        setLoading(true);
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
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
