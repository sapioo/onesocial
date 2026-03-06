import { useState } from "react";
import ContentInput from "../components/ContentInput";
import PlatformSelector from "../components/PlatformSelector";
import GenerateButton from "../components/GenerateButton";
import ResultCard from "../components/ResultCard";


export default function Home() {
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        // Validation
        if (!content.trim()) {
            setError("Please enter content and select at least one platform.");
            return;
        }

        if (selectedPlatforms.length === 0) {
            setError("Please enter content and select at least one platform.");
            return;
        }

        setError("");
        setLoading(true);
        setResults(null);

        try {
            const response = await fetch('/api/generate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    platforms: selectedPlatforms,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to generate posts");
            }

            const data = await response.json();

            setResults(data);
        } catch (err) {
            console.error(err);
            setError("Failed to generate posts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-28">
                {/* Background glow effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        AI-Powered Content Engine
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                        Create Social Media{" "}
                        <span className="text-primary">
                            Content Instantly
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
                        Generate platform-optimized captions and visuals from one idea.
                    </p>
                    <a
                        href="#generator"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold bg-primary hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        style={{ boxShadow: '0 8px 24px rgba(249,115,22,0.35), 0 2px 8px rgba(249,115,22,0.2)' }}
                    >
                        Start Generating
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </section>

            {/* Generator Section */}
            <section id="generator" className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 space-y-6">
                <ContentInput content={content} setContent={setContent} images={images} setImages={setImages} />
                <PlatformSelector
                    selectedPlatforms={selectedPlatforms}
                    setSelectedPlatforms={setSelectedPlatforms}
                />

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 bg-error/10 border border-error/20 text-error rounded-xl px-5 py-3 text-sm font-medium animate-[shake_0.3s_ease-in-out]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        {error}
                    </div>
                )}

                <GenerateButton
                    onClick={handleGenerate}
                    loading={loading}
                    disabled={!content.trim() || selectedPlatforms.length === 0}
                />

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center gap-4 py-12">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-surface-lighter" />
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </div>
                        <p className="text-text-muted text-sm font-medium animate-pulse">
                            Generating your social media posts...
                        </p>
                    </div>
                )}

                {/* Results */}
                {results && !loading && (
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />
                            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">
                                Generated Posts
                            </h3>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(results).map(([platform, data]) => (
                                <ResultCard
                                    key={platform}
                                    platform={platform}
                                    caption={data.caption}
                                    image={data.image}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
