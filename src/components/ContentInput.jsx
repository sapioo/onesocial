import { useRef } from "react";

export default function ContentInput({ content, setContent, images, setImages }) {
    const maxLength = 2000;
    const charCount = content.length;
    const isNearLimit = charCount > maxLength * 0.9;
    const isOverLimit = charCount > maxLength;
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
        }));
        setImages((prev) => [...prev, ...newImages].slice(0, 5));
    };

    const removeImage = (index) => {
        setImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    return (
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-xl shadow-black/30">
            <label
                htmlFor="content-input"
                className="block text-sm font-semibold text-text mb-1"
            >
                Your Content
            </label>
            <p className="text-xs text-text-muted mb-4">
                Paste your idea, blog post, or transcript below and let AI transform it
                into platform-optimized posts.
            </p>

            {/* Textarea */}
            <div className="relative">
                <textarea
                    id="content-input"
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
                    placeholder="Paste your idea, blog, or transcript here..."
                    rows={7}
                    className="w-full bg-bg border border-border rounded-xl p-4 text-sm text-text placeholder:text-text-muted/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <div
                    className={`absolute bottom-3 right-3 text-xs font-mono ${isOverLimit
                            ? "text-error"
                            : isNearLimit
                                ? "text-amber-400"
                                : "text-text-muted/50"
                        }`}
                >
                    {charCount}/{maxLength}
                </div>
            </div>

            {/* Image Upload */}
            <div className="mt-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-surface-light text-text-muted border border-border
            hover:bg-surface-lighter hover:text-text hover:border-primary/40
            transition-all duration-200 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Images
                    <span className="text-xs text-text-muted/50 ml-1">(max 5)</span>
                </button>

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                        {images.map((img, i) => (
                            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border">
                                <img
                                    src={img.preview}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
