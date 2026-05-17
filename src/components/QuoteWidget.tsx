'use client';

import { useEffect, useState, useMemo } from 'react';
import { Settings, X, Trash2, Plus } from 'lucide-react';
import DOMPurify from 'dompurify';

// Guard DOMPurify for SSR
const sanitize = (text: string): string => {
    if (typeof window === 'undefined') return text;
    return DOMPurify.sanitize(text);
};
import { useTimerStore } from '@/stores/timerStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { QUOTE_MAX_LENGTH, QUOTE_LIMIT } from '@/constants';

const DEFAULT_QUOTES = [
    "Verily, with hardship comes ease.",
    "The secret of getting ahead is getting started.",
    "You don't have to be great to start, but you have to start to be great.",
    "Discipline is choosing between what you want now and what you want most.",
    "Small steps every day lead to big results over time.",
];

const STORAGE_KEY = 'focus-quotes';

const loadStoredQuotes = (): string[] => {
    if (typeof window === 'undefined') return DEFAULT_QUOTES;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch { /* ignore */ }
    }
    return DEFAULT_QUOTES;
};

export function QuoteWidget() {
    const { isRunning } = useTimerStore();
    const [quotes, setQuotes] = useState<string[]>(loadStoredQuotes);
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * loadStoredQuotes().length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMounted, setModalMounted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newQuote, setNewQuote] = useState('');

    const currentQuote = useMemo(() => {
        return quotes[quoteIndex % quotes.length] || quotes[0] || '';
    }, [quotes, quoteIndex]);

    useEffect(() => {
        if (quotes.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    }, [quotes]);

    // Modal animate in/out
    useEffect(() => {
        if (isModalOpen) {
            setModalMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
        } else {
            setModalVisible(false);
            const t = setTimeout(() => setModalMounted(false), 220);
            return () => clearTimeout(t);
        }
    }, [isModalOpen]);

    const handleAddQuote = () => {
        const trimmed = newQuote.trim();
        if (!trimmed) return;
        if (quotes.length >= QUOTE_LIMIT) {
            toast.error(`Maximum ${QUOTE_LIMIT} quotes allowed. Delete one to add more.`);
            return;
        }
        if (trimmed.length > QUOTE_MAX_LENGTH) {
            toast.error(`Quote must be ${QUOTE_MAX_LENGTH} characters or less`);
            return;
        }
        if (quotes.includes(trimmed)) {
            toast.error('This quote already exists');
            return;
        }
        setQuotes([...quotes, trimmed]);
        setNewQuote('');
    };

    const handleDeleteQuote = (index: number) => {
        if (quotes.length > 1) setQuotes(quotes.filter((_, i) => i !== index));
    };

    const handleChangeQuote = () => {
        if (quotes.length > 1) {
            let newIndex: number;
            do { newIndex = Math.floor(Math.random() * quotes.length); }
            while (newIndex === quoteIndex % quotes.length);
            setQuoteIndex(newIndex);
        }
    };

    return (
        <>
            {/* Quote Display — visible always but fades when not running */}
            <div className={cn(
                'absolute top-6 left-6 z-20 flex flex-col gap-2 max-w-xs transition-all duration-500',
                isRunning ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
            )}>
                <div className="flex items-start gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center bg-white/8 backdrop-blur-sm hover:bg-white/15 transition-colors btn-press shrink-0"
                        aria-label="Customize quotes"
                    >
                        <Settings className="w-3.5 h-3.5 text-white/50 hover:text-white/80 transition-colors" />
                    </button>
                    <button
                        onClick={handleChangeQuote}
                        className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 border-0 hover:bg-white/8 transition-all text-left cursor-pointer"
                        aria-label="Next quote"
                    >
                        <p className="text-white/85 text-sm font-medium leading-relaxed">
                            {sanitize(currentQuote)}
                        </p>
                    </button>
                </div>
            </div>

            {/* Customize Modal */}
            {modalMounted && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className={cn(
                            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
                            modalVisible ? 'opacity-100' : 'opacity-0'
                        )}
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className={cn(
                        'relative w-full max-w-md bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-220',
                        modalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                    )}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
                            <h2 className="text-lg font-semibold text-white tracking-tight">Quotes</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors btn-press"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4 text-white/60" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {/* Add */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                                    Add Quote
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newQuote}
                                        onChange={(e) => setNewQuote(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddQuote(); }}
                                        placeholder="Enter a quote or dua..."
                                        maxLength={QUOTE_MAX_LENGTH}
                                        className="flex-1 px-3 py-2 bg-white/8 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all appearance-none [color-scheme:dark]"
                                    />
                                    <button
                                        onClick={handleAddQuote}
                                        disabled={!newQuote.trim() || quotes.length >= QUOTE_LIMIT}
                                        className={cn(
                                            'px-3 py-2 rounded-xl transition-all btn-press',
                                            newQuote.trim() && quotes.length < QUOTE_LIMIT
                                                ? 'bg-white/15 hover:bg-white/25 text-white'
                                                : 'bg-white/4 text-white/25 cursor-not-allowed'
                                        )}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className={cn(
                                    'text-xs text-right block',
                                    newQuote.length > QUOTE_MAX_LENGTH ? 'text-red-400' : 'text-white/30'
                                )}>
                                    {newQuote.length}/{QUOTE_MAX_LENGTH}
                                </span>
                            </div>

                            {/* List */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                                    Your Quotes ({quotes.length}/{QUOTE_LIMIT})
                                </label>
                                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                    {quotes.map((quote, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 p-3 bg-white/4 rounded-xl border-0 hover:bg-white/8 transition-colors group"
                                        >
                                            <p className="flex-1 text-white/80 text-sm leading-relaxed">
                                                {sanitize(quote)}
                                            </p>
                                            <button
                                                onClick={() => handleDeleteQuote(index)}
                                                disabled={quotes.length === 1}
                                                className={cn(
                                                    'w-7 h-7 rounded-lg flex items-center justify-center transition-all btn-press shrink-0',
                                                    quotes.length === 1
                                                        ? 'text-white/15 cursor-not-allowed'
                                                        : 'text-white/35 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
                                                )}
                                                aria-label="Delete quote"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
