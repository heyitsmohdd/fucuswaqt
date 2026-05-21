'use client';

import { useEffect, useState } from 'react';
import { X, Mail, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GITHUB_URL, CONTACT_EMAIL } from '@/constants';

const INK = '#0D2118';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function GitHubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
        } else {
            setIsVisible(false);
            const t = setTimeout(() => setMounted(false), 220);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <style>{`
                .contact-card:hover { background: rgba(133,171,139,0.1) !important; transform: translateY(-1px); box-shadow: 5px 5px 0px ${INK} !important; }
                .contact-card:active { transform: translateY(1px) !important; box-shadow: 2px 2px 0px ${INK} !important; }
            `}</style>

            <div
                className={cn(
                    'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200',
                    isVisible ? 'opacity-100' : 'opacity-0'
                )}
                onClick={onClose}
            />

            <div
                className={cn(
                    'relative w-full transition-all duration-220',
                    isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                )}
                style={{
                    maxWidth: 400,
                    background: '#D4EDD8',
                    border: `2px solid ${INK}`,
                    boxShadow: `6px 6px 0px ${INK}`,
                    borderRadius: 16,
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
            >
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px 16px',
                    borderBottom: `2px solid ${INK}`,
                }}>
                    <div>
                        <h2 id="contact-modal-title" style={{ color: INK, fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                            Get in touch
                        </h2>
                        <p style={{ color: INK, fontSize: '0.75rem', opacity: 0.45, marginTop: 2 }}>
                            Questions, bugs, or just saying hi
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `2px solid ${INK}`, borderRadius: 8,
                            background: '#D4EDD8', cursor: 'pointer',
                            color: INK, padding: 0,
                        }}
                        aria-label="Close contact"
                    >
                        <X style={{ width: 16, height: 16 }} aria-hidden="true" />
                    </button>
                </div>

                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 14px',
                            border: `1.5px solid ${INK}`,
                            borderRadius: 10,
                            background: '#D4EDD8',
                            textDecoration: 'none',
                            boxShadow: `3px 3px 0px ${INK}`,
                            transition: 'transform 0.08s ease, box-shadow 0.08s ease, background 0.12s',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{
                            width: 36, height: 36, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `1.5px solid ${INK}`,
                            borderRadius: 8,
                            background: `rgba(133,171,139,0.2)`,
                            color: INK,
                        }}>
                            <GitHubIcon className="w-4.5 h-4.5" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: INK, fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>GitHub</p>
                            <p style={{ color: INK, fontSize: '0.72rem', opacity: 0.5, margin: 0, marginTop: 1 }}>Open an issue or browse source</p>
                        </div>
                        <ArrowUpRight style={{ width: 15, height: 15, color: INK, opacity: 0.35, flexShrink: 0 }} />
                    </a>

                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="contact-card"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 14px',
                            border: `1.5px solid ${INK}`,
                            borderRadius: 10,
                            background: '#D4EDD8',
                            textDecoration: 'none',
                            boxShadow: `3px 3px 0px ${INK}`,
                            transition: 'transform 0.08s ease, box-shadow 0.08s ease, background 0.12s',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{
                            width: 36, height: 36, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `1.5px solid ${INK}`,
                            borderRadius: 8,
                            background: `rgba(133,171,139,0.2)`,
                        }}>
                            <Mail style={{ width: 18, height: 18, color: INK }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: INK, fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>Email</p>
                            <p style={{ color: INK, fontSize: '0.72rem', opacity: 0.5, margin: 0, marginTop: 1 }}>{CONTACT_EMAIL}</p>
                        </div>
                        <ArrowUpRight style={{ width: 15, height: 15, color: INK, opacity: 0.35, flexShrink: 0 }} />
                    </a>
                </div>
            </div>
        </div>
    );
}
