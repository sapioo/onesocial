import { useState } from "react";

const aspectRatios = {
    instagram: "aspect-square",
    linkedin: "aspect-[1200/627]",
    twitter: "aspect-video",
};

const platformLabels = {
    instagram: "Instagram",
    linkedin: "LinkedIn",
    twitter: "Twitter / X",
};

export default function ResultCard({ platform, caption, image }) {
    const [copied, setCopied] = useState(false);
    const ratio = aspectRatios[platform] || "aspect-video";
    const label = platformLabels[platform] || platform;

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(caption);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = caption;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadImage = async () => {
        try {
            const res = await fetch(image);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `onesocial-${platform}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            window.open(image, "_blank");
        }
    };

    return (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl shadow-black/30 hover:shadow-2xl transition-all duration-300 group">
            {/* Platform badge */}
            <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                <span className="text-sm font-bold text-primary">{label}</span>
            </div>

            {/* Image */}
            <div className="px-5">
                <div className={`${ratio} w-full rounded-xl overflow-hidden bg-bg border border-border`}>
                    <img
                        src={image}
                        alt={`${label} post`}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                </div>
            </div>

            {/* Caption */}
            <div className="px-5 py-4">
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line line-clamp-6">
                    {caption}
                </p>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex gap-3">
                {/* Copy — icon-only */}
                <button
                    onClick={copyCaption}
                    title={copied ? "Copied!" : "Copy caption"}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 border
            ${copied
                            ? "bg-success text-white border-success shadow-[0_4px_14px_rgba(34,197,94,0.35)]"
                            : "bg-surface-lighter text-text-muted border-border hover:text-text hover:border-text-muted/30"
                        }`}
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>

                {/* Download — orange solid with glow */}
                <button
                    onClick={downloadImage}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0
            bg-primary text-white shadow-[0_6px_20px_rgba(249,115,22,0.3)]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                </button>
            </div>
        </div>
    );
}
