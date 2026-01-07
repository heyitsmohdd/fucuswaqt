import Link from "next/link";

export default function RateLimitExceeded() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="text-center max-w-md border border-white/10 bg-white/5 p-8 rounded-2xl backdrop-blur-sm">
                <h1 className="text-3xl font-bold mb-4 text-red-500">Too Many Attempts</h1>
                <p className="text-white/70 mb-8 leading-relaxed">
                    For security reasons, we have temporarily blocked this request.
                    Please wait 1 minute before trying again.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
