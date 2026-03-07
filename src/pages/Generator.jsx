import { useState } from "react";
import { motion } from "framer-motion";
import ContentInput from "../components/ContentInput";
import PlatformSelector from "../components/PlatformSelector";
import GenerateButton from "../components/GenerateButton";
import ResultsPage from "./ResultsPage";

// ── Progress steps shown during generation ────────────────────────────────
const PROGRESS_STEPS = [
    { id: "analyzing", label: "Analyzing image…", icon: "🔍" },
    { id: "prompting", label: "Engineering prompts…", icon: "✍️" },
    { id: "generating", label: "Generating visuals…", icon: "🎨" },
    { id: "captioning", label: "Writing captions…", icon: "📝" },
    { id: "done", label: "Almost ready!", icon: "✨" },
];

// ── Convert a blob URL to base64 string ──────────────────────────────────
async function blobUrlToBase64(blobUrl) {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

export default function Generator() {
    // ── View state ─────────────────────────────────────────────────────────
    const [view, setView] = useState("editor"); // "editor" | "results"

    // ── Caption state ──────────────────────────────────────────────────────
    const [content, setContent] = useState("");
    const [captionVibe, setCaptionVibe] = useState("");
    const [accountType, setAccountType] = useState("personal");
    const [manualCaption, setManualCaption] = useState("");
    const [writeOwn, setWriteOwn] = useState(false);

    // ── Image state ────────────────────────────────────────────────────────
    const [images, setImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(null);
    const [imageAction, setImageAction] = useState("generate_new");

    // ── Platform state ─────────────────────────────────────────────────────
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [platformContexts, setPlatformContexts] = useState({});

    // ── Results & UI state ─────────────────────────────────────────────────
    const [results, setResults] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [warnings, setWarnings] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const canGenerate = (content.trim() || manualCaption.trim()) && selectedPlatforms.length > 0;

    const advanceStep = (() => {
        let timers = [];
        return {
            start() {
                setCurrentStep(0);
                const delays = [700, 1800, 3200, 5000];
                timers = delays.map((delay, i) =>
                    setTimeout(() => setCurrentStep(i + 1), delay)
                );
            },
            stop() {
                timers.forEach(clearTimeout);
                timers = [];
            },
        };
    })();

    const handleGenerate = async () => {
        if (!canGenerate) {
            setError("Please enter some content and select at least one platform.");
            return;
        }
        setError("");
        setWarnings([]);
        setLoading(true);
        setResults(null);
        advanceStep.start();

        let primaryImageBase64 = null;
        if (images.length > 0 && primaryImageIndex !== null) {
            const blobUrl = images[primaryImageIndex]?.preview;
            if (blobUrl) {
                primaryImageBase64 = await blobUrlToBase64(blobUrl);
                setOriginalImage(primaryImageBase64);
            }
        }

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    platforms: selectedPlatforms,
                    captionVibe,
                    accountType,
                    manualCaption,
                    imageAction,
                    primaryImage: primaryImageBase64,
                    platformContexts,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to generate posts");
            }

            const data = await response.json();

            if (data._warnings) {
                setWarnings(data._warnings);
                delete data._warnings;
            }

            setCurrentStep(PROGRESS_STEPS.length - 1);
            setResults(data);

            setTimeout(() => {
                advanceStep.stop();
                setLoading(false);
                setView("results");
            }, 600);

        } catch (err) {
            console.error(err);
            advanceStep.stop();
            setLoading(false);
            setError("Failed to generate posts. Please try again.");
        }
    };

    // ── Results page ───────────────────────────────────────────────────────
    if (view === "results" && results) {
        return (
            <motion.div
                className="absolute top-0 left-0 w-full min-h-screen pt-20 bg-bg"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <ResultsPage
                    results={results}
                    originalImage={originalImage}
                    imageAction={imageAction}
                    warnings={warnings}
                    onBack={() => setView("editor")}
                />
            </motion.div>
        );
    }

    // ── Editor page ────────────────────────────────────────────────────────
    return (
        <motion.div
            className="absolute top-0 left-0 w-full min-h-screen pt-24 pb-12 bg-bg"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Create Campaign</h1>
                    <p className="text-text-muted">Configure your primary content style and pick destination platforms to auto-generate posts.</p>
                </div>

                <ContentInput
                    content={content} setContent={setContent}
                    images={images} setImages={setImages}
                    primaryImageIndex={primaryImageIndex} setPrimaryImageIndex={setPrimaryImageIndex}
                    captionVibe={captionVibe} setCaptionVibe={setCaptionVibe}
                    accountType={accountType} setAccountType={setAccountType}
                    manualCaption={manualCaption} setManualCaption={setManualCaption}
                    imageAction={imageAction} setImageAction={setImageAction}
                    writeOwn={writeOwn} setWriteOwn={setWriteOwn}
                />

                <PlatformSelector
                    selectedPlatforms={selectedPlatforms}
                    setSelectedPlatforms={setSelectedPlatforms}
                    platformContexts={platformContexts}
                    setPlatformContexts={setPlatformContexts}
                />

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 bg-error/10 border border-error/20 text-error rounded-xl px-5 py-3 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        {error}
                    </div>
                )}

                <GenerateButton onClick={handleGenerate} loading={loading} disabled={!canGenerate} />

                {/* ── Progress Stepper ────────────────────────────────────── */}
                {loading && (
                    <div className="flex flex-col items-center gap-6 py-10">
                        {/* Animated ring */}
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-surface-lighter" />
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-xl">
                                {PROGRESS_STEPS[Math.min(currentStep, PROGRESS_STEPS.length - 1)].icon}
                            </div>
                        </div>

                        {/* Step labels */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                            {PROGRESS_STEPS.map((step, i) => (
                                <div key={step.id} className="flex items-center gap-1 sm:gap-2">
                                    <span
                                        className={`text-xs font-semibold transition-all duration-500
                                            ${i < currentStep ? "text-success line-through opacity-50" : ""}
                                            ${i === currentStep ? "text-primary" : ""}
                                            ${i > currentStep ? "text-text-muted/40" : ""}
                                        `}
                                    >
                                        {step.label}
                                    </span>
                                    {i < PROGRESS_STEPS.length - 1 && (
                                        <span className={`text-xs transition-colors duration-500 ${i < currentStep ? "text-success" : "text-border"}`}>→</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </motion.div>
    );
}
