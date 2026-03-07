import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
    // ── Typing animation for the hero title ────────────────────────────────
    const fullTitle = "Create Social Media Content Instantly";
    const [typedCount, setTypedCount] = useState(0);
    const [typingDone, setTypingDone] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait ~1s (2 cursor blinks at 500ms intervals) before starting
        const delay = setTimeout(() => setIsReady(true), 1000);
        return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
        if (!isReady) return;
        if (typedCount < fullTitle.length) {
            const timeout = setTimeout(() => {
                setTypedCount((c) => c + 1);
            }, 45);
            return () => clearTimeout(timeout);
        } else {
            setTypingDone(true);
        }
    }, [typedCount, isReady, fullTitle.length]);

    // ── Mouse-follow parallax for hero blur circles ──────────────────────────
    const blob1Ref = useRef(null);
    const blob2Ref = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            if (blob1Ref.current) {
                blob1Ref.current.style.transform = `translate(${x * 250}px, ${y * 200}px)`;
            }
            if (blob2Ref.current) {
                blob2Ref.current.style.transform = `translate(${x * -200}px, ${y * -160}px)`;
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <motion.div
            className="absolute top-0 left-0 w-full min-h-screen bg-bg"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div ref={blob1Ref} className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl transition-transform duration-300 ease-out" />
                    <div ref={blob2Ref} className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl transition-transform duration-300 ease-out" />
                </div>
                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        AI-Powered Content Engine
                    </div>
                    <h2 className="flex flex-col items-center justify-center text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.3] mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {(() => {
                            const typed = fullTitle.slice(0, typedCount);

                            // The text splits exactly at "Create Social" vs "Media Content Instantly"
                            // Break index is 14
                            const breakIndex = "Create Social ".length;

                            if (typedCount <= breakIndex) {
                                return (
                                    <span>
                                        {typed}
                                        {!typingDone && (
                                            <span className="ml-0.5 inline-block" style={{ borderLeft: "3px solid var(--color-primary)", animation: "cursorBlink 1s step-end infinite", height: "0.85em", verticalAlign: "middle" }} />
                                        )}
                                    </span>
                                );
                            }

                            const line1 = typed.slice(0, breakIndex);
                            const line2 = typed.slice(breakIndex); // starts with "Media..."

                            const mediaWord = line2.slice(0, "Media ".length);
                            const orangePart = line2.slice("Media ".length);

                            return (
                                <>
                                    <span>{line1}</span>
                                    <span className="whitespace-nowrap flex items-center mt-1">
                                        {mediaWord}
                                        {orangePart && (
                                            <span className="ml-2 inline-block px-1 text-shimmer drop-shadow-sm">
                                                {orangePart}
                                            </span>
                                        )}
                                        {!typingDone && (
                                            <span className="ml-1 inline-block" style={{ borderLeft: "3px solid var(--color-primary)", animation: "cursorBlink 1s step-end infinite", height: "0.85em" }} />
                                        )}
                                    </span>
                                </>
                            );
                        })()}
                    </h2>
                    <p className="text-lg sm:text-xl text-text-muted mx-auto mb-10 leading-relaxed text-center whitespace-nowrap overflow-x-auto">
                        AI-crafted captions and visuals, perfectly tuned for each platform.
                    </p>
                    <Link
                        to="/generator"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold bg-primary hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        style={{ boxShadow: "0 8px 24px rgba(0,212,255,0.35), 0 2px 8px rgba(0,212,255,0.2)" }}
                    >
                        START GENERATING
                    </Link>
                </div>
            </section>
        </motion.div >
    );
}
