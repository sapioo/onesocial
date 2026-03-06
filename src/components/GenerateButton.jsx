export default function GenerateButton({ onClick, loading, disabled }) {
    return (
        <div className="flex justify-center">
            <button
                onClick={onClick}
                disabled={disabled || loading}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-xl text-white font-bold text-base
          bg-primary
          hover:-translate-y-0.5
          active:translate-y-0
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
          transition-all duration-200 cursor-pointer"
                style={{
                    boxShadow: disabled
                        ? "none"
                        : "0 8px 24px rgba(249,115,22,0.35), 0 2px 8px rgba(249,115,22,0.2)",
                }}
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate Posts
                    </>
                )}
            </button>
        </div>
    );
}
