'use client';

import { useEffect, useState, useMemo } from 'react';
import { Settings, X, Trash2, Plus } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useTimerStore } from '@/stores/timerStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { QUOTE_MAX_LENGTH, QUOTE_LIMIT } from '@/constants';

const DEFAULT_QUOTES = [
    "Take it one step at a time.",
    "Verily, with hardship comes ease.",
    "Focus on the process, not the outcome.",
    "O Allah, increase me in knowledge.",
    "Every small effort counts.",
];

const STORAGE_KEY = 'focus-quotes';

// Helper function to load quotes from localStorage
const loadStoredQuotes = (): string[] => {
    if (typeof window === 'undefined') return DEFAULT_QUOTES;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch {
            // Invalid stored quotes, use defaults
        }
    }
    return DEFAULT_QUOTES;
};

export function QuoteWidget() {
    const { isRunning } = useTimerStore();
    // Use lazy initialization to avoid setState in effect
    const [quotes, setQuotes] = useState<string[]>(loadStoredQuotes);
    const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * loadStoredQuotes().length));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newQuote, setNewQuote] = useState('');

    // Derive currentQuote from quotes and index
    const currentQuote = useMemo(() => {
        return quotes[quoteIndex % quotes.length] || quotes[0] || '';
    }, [quotes, quoteIndex]);

    // Save quotes to localStorage whenever they change
    useEffect(() => {
        if (quotes.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
        }
    }, [quotes]);

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
        if (quotes.length > 1) {
            const updated = quotes.filter((_, i) => i !== index);
            setQuotes(updated);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddQuote();
        }
    };

    const handleChangeQuote = () => {
        if (quotes.length > 1) {
            // Get a random index that's different from the current one
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * quotes.length);
            } while (newIndex === quoteIndex % quotes.length);
            setQuoteIndex(newIndex);
        }
    };

    // Only show when timer is running
    if (!isRunning) return null;

    return (
        <>
            {/* Quote Display */}
            <div className="absolute top-6 left-6 z-50 flex flex-col gap-2 max-w-md text-left">
                <div className="flex items-start gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                        aria-label="Customize quotes"
                    >
                        <Settings className="w-4 h-4 text-white/70 hover:text-white" />
                    </button>
                    <button
                        onClick={handleChangeQuote}
                        className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-all cursor-pointer text-left"
                    >
                        <p className="text-white text-base font-medium leading-relaxed">
                            {DOMPurify.sanitize(currentQuote)}
                        </p>
                    </button>
                </div>
            </div>

            {/* Customization Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Customize Quotes</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6 text-white/80" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {/* Add New Quote */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">
                                    Add New Quote
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newQuote}
                                        onChange={(e) => setNewQuote(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter your quote or dua..."
                                        maxLength={QUOTE_MAX_LENGTH}
                                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    />
                                    <button
                                        onClick={handleAddQuote}
                                        disabled={!newQuote.trim() || quotes.length >= QUOTE_LIMIT}
                                        className={cn(
                                            "px-4 py-2 rounded-xl font-medium transition-all",
                                            newQuote.trim() && quotes.length < QUOTE_LIMIT
                                                ? "bg-white/20 hover:bg-white/30 text-white"
                                                : "bg-white/5 text-white/30 cursor-not-allowed"
                                        )}
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <span className={cn(
                                    "text-xs text-right block",
                                    newQuote.length > QUOTE_MAX_LENGTH ? "text-red-400" : "text-white/40"
                                )}>
                                    {newQuote.length}/{QUOTE_MAX_LENGTH}
                                </span>
                            </div>

                            {/* Quote List */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">
                                    Your Quotes ({quotes.length}/{QUOTE_LIMIT})
                                </label>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                    {quotes.map((quote, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                                        >
                                            <p className="flex-1 text-white/90 text-sm leading-relaxed">
                                                {DOMPurify.sanitize(quote)}
                                            </p>
                                            <button
                                                onClick={() => handleDeleteQuote(index)}
                                                disabled={quotes.length === 1}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    quotes.length === 1
                                                        ? "text-white/20 cursor-not-allowed"
                                                        : "text-white/50 hover:text-red-400 hover:bg-red-500/10"
                                                )}
                                                aria-label="Delete quote"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
