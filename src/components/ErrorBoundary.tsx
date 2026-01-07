'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';

interface FallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-black/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">
                    Something went wrong
                </h2>

                <p className="text-white/60 mb-6">
                    We encountered an unexpected error. Please try again or refresh the page.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mb-6 text-left">
                        <summary className="text-white/40 text-sm cursor-pointer hover:text-white/60">
                            Error details
                        </summary>
                        <pre className="mt-2 p-3 bg-black/40 rounded-lg text-xs text-red-400 overflow-auto max-h-32">
                            {error.message}
                        </pre>
                    </details>
                )}

                <button
                    onClick={resetErrorBoundary}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset any error state here if needed
                window.location.reload();
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
}
