import { useState } from "react";

// ── Platform definitions ──────────────────────────────────────────────────
const platforms = [
    {
        id: "instagram",
        name: "Instagram",
        color: "#e1306c",
        icon: (active) => active ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 32 32">
                <defs>
                    <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#feda75" />
                        <stop offset="25%" stopColor="#fa7e1e" />
                        <stop offset="50%" stopColor="#d62976" />
                        <stop offset="75%" stopColor="#962fbf" />
                        <stop offset="100%" stopColor="#4f5bd5" />
                    </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#ig-grad)" />
                <rect x="3" y="3" width="26" height="26" rx="6" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="16" cy="16" r="5.5" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="23" cy="9" r="1.5" fill="white" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        ),
        contextFields: [
            {
                key: "postType", label: "Post Type",
                options: [
                    { value: "feed", label: "📸 Feed Post" },
                    { value: "reel", label: "🎬 Reel" },
                    { value: "story", label: "⏱️ Story" },
                    { value: "carousel", label: "🖼️ Carousel" },
                ],
            },
            {
                key: "account", label: "Account",
                options: [
                    { value: "public", label: "🌐 Public" },
                    { value: "private", label: "🔒 Private" },
                    { value: "spam", label: "🤙 Close Friends" },
                    { value: "group", label: "👥 Group / Collab" },
                ],
            },
            {
                key: "tone", label: "Creator Tone",
                options: [
                    { value: "casual", label: "😊 Casual" },
                    { value: "influencer", label: "⭐ Influencer" },
                    { value: "brand", label: "🏷️ Brand" },
                ],
            },
        ],
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        color: "#0a66c2",
        icon: () => (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        contextFields: [
            {
                key: "postType", label: "Post Type",
                options: [
                    { value: "regular", label: "📝 Regular Post" },
                    { value: "article", label: "📄 Article" },
                    { value: "poll", label: "📊 Poll" },
                ],
            },
            {
                key: "audience", label: "Target Audience",
                options: [
                    { value: "recruiters", label: "🎯 Recruiters" },
                    { value: "founders", label: "🚀 Founders" },
                    { value: "professionals", label: "💼 Professionals" },
                    { value: "students", label: "🎓 Students" },
                ],
            },
            {
                key: "goal", label: "Post Goal",
                options: [
                    { value: "thought_leadership", label: "💡 Thought Leadership" },
                    { value: "networking", label: "🤝 Networking" },
                    { value: "job_seeking", label: "📬 Job Seeking" },
                    { value: "company_update", label: "📢 Company Update" },
                ],
            },
        ],
    },
    {
        id: "x",
        name: "X",
        color: "#000000",
        icon: () => (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        contextFields: [
            {
                key: "format", label: "Format",
                options: [
                    { value: "single", label: "✉️ Single Tweet" },
                    { value: "thread", label: "🧵 Thread Starter" },
                ],
            },
            {
                key: "audience", label: "Audience",
                options: [
                    { value: "general", label: "🌐 General" },
                    { value: "niche", label: "🎯 Niche Community" },
                    { value: "tech", label: "💻 Tech & Dev" },
                ],
            },
            {
                key: "goal", label: "Goal",
                options: [
                    { value: "engagement", label: "💬 Engagement" },
                    { value: "awareness", label: "📣 Brand Awareness" },
                    { value: "viral", label: "🔥 Humour / Viral" },
                ],
            },
        ],
    },
];

// ── Sub-component: context options for a selected platform ────────────────
function PlatformContextPanel({ platform, context, setContext }) {
    const def = platforms.find((p) => p.id === platform);
    if (!def) return null;

    return (
        <div className="mt-4 p-5 rounded-2xl bg-black/40 border border-white/10 space-y-5 animate-[fadeIn_0.3s_ease]">
            {def.contextFields.map((field) => (
                <div key={field.key}>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{field.label}</label>
                    <div className="flex flex-wrap gap-1.5">
                        {field.options.map((opt) => {
                            const active = context[field.key] === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => setContext((prev) => ({
                                        ...prev,
                                        [field.key]: active ? "" : opt.value,
                                    }))}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer border
                                        ${active
                                            ? "bg-primary/15 border-primary/60 text-primary"
                                            : "bg-surface border-border text-text-muted hover:border-primary/30 hover:text-text"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────
export default function PlatformSelector({ selectedPlatforms, setSelectedPlatforms, platformContexts, setPlatformContexts }) {
    const toggle = (id) => {
        setSelectedPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const updateContext = (platformId, updater) => {
        setPlatformContexts((prev) => ({
            ...prev,
            [platformId]: updater(prev[platformId] || {}),
        }));
    };

    return (
        <div className="bg-surface/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Destinations</h3>
            <p className="text-sm text-text-muted mb-6">Select where you want to post. We’ll auto-format everything.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {platforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const isX = platform.id === "x";
                    return (
                        <div key={platform.id} className="relative">
                            <button
                                onClick={() => toggle(platform.id)}
                                className={`w-full flex flex-col items-center justify-center py-6 px-4 gap-3 bg-black/40 border-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group
                                    ${isSelected
                                        ? "scale-[1.02] shadow-2xl"
                                        : "border-white/10 hover:border-white/30 hover:bg-white/5 hover:-translate-y-1 hover:shadow-xl"
                                    }`}
                                style={{
                                    borderColor: isSelected ? platform.color : undefined,
                                    boxShadow: isSelected ? `0 10px 30px ${platform.color}40, inset 0 0 20px ${platform.color}15` : undefined
                                }}
                            >
                                <span className={`transition-transform duration-300 ${isSelected ? "scale-110 drop-shadow-lg" : "scale-100 group-hover:scale-110 opacity-70 group-hover:opacity-100"}`} style={{ color: isSelected ? (isX ? "#ffffff" : platform.color) : "var(--color-text-muted)" }}>
                                    {platform.icon(isSelected)}
                                </span>
                                <span className={`text-sm font-bold tracking-wide transition-colors ${isSelected ? "text-white" : "text-text-muted group-hover:text-text"}`}>
                                    {platform.name}
                                </span>
                            </button>
                            {isSelected && (
                                <span
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-black/50 z-10"
                                    style={{ background: platform.color, boxShadow: `0 0 10px ${platform.color}` }}
                                >
                                    ✓
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Per-platform context panels */}
            {
                selectedPlatforms.map((platformId) => (
                    <div key={platformId}>
                        <div className="flex items-center gap-2 mt-4 mb-1">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                {platforms.find((p) => p.id === platformId)?.name} Options
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        <PlatformContextPanel
                            platform={platformId}
                            context={platformContexts[platformId] || {}}
                            setContext={(updater) => updateContext(platformId, updater)}
                        />
                    </div>
                ))
            }
        </div >
    );
}
