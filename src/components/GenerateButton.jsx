export default function GenerateButton({ onClick, loading, disabled }) {
    return (
        <div className="flex justify-center mt-8">
            <button
                onClick={onClick}
                disabled={disabled || loading}
                className={`group relative w-full sm:w-auto p-[2px] rounded-xl overflow-hidden transition-all duration-300
                    ${disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:-translate-y-1 active:translate-y-0 cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.1)] hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                    }`}
            >
                {/* Spinning Glowing Border Background */}
                {!disabled && (
                    <span
                        className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: "conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 75%, #00d4ff 100%)"
                        }}
                    />
                )}

                {/* Inner Hollow Surface */}
                <div className={`relative flex items-center justify-center gap-3 px-10 py-4 w-full h-full rounded-[10px] z-10 font-bold text-lg tracking-wide transition-colors duration-300
                    ${disabled ? "bg-surface-lighter text-text-muted" : "bg-bg text-white group-hover:bg-surface/90"}`}
                >
                    {loading ? (
                        <>
                            <svg
                                className="w-5 h-5 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate Posts
                        </>
                    )}
                </div>
            </button>
        </div>
    );
}
