/**
 * routes/generateRoute.js
 *
 * Defines the POST /api/generate endpoint.
 *
 * Request body:
 *   {
 *     "content":   "AI helps automate marketing workflows",
 *     "platforms": ["instagram", "linkedin", "twitter"]
 *   }
 *
 * Response:
 *   {
 *     "instagram": { "caption": "...", "image": "..." },
 *     "linkedin":  { "caption": "...", "image": "..." },
 *     "twitter":   { "caption": "...", "image": "..." }
 *   }
 */

const express = require('express');
const router = express.Router();

const { generateCaption } = require('../services/captionService');
const { generateImage } = require('../services/imageService');

// Supported platforms
const SUPPORTED_PLATFORMS = ['instagram', 'linkedin', 'twitter'];

/**
 * POST /api/generate
 *
 * Validates the request, runs caption + image generation for each platform
 * concurrently, and returns the assembled response.
 */
router.post('/', async (req, res) => {
    try {
        const { content, platforms } = req.body;

        // ── 1. Validate request body ──────────────────────────────────────────
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({
                error: 'Validation Error',
                message: '"content" is required and must be a non-empty string.',
            });
        }

        if (!Array.isArray(platforms) || platforms.length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: '"platforms" is required and must be a non-empty array.',
            });
        }

        // Filter out any unsupported platform names
        const invalidPlatforms = platforms.filter(
            (p) => !SUPPORTED_PLATFORMS.includes(p.toLowerCase())
        );

        if (invalidPlatforms.length > 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: `Unsupported platforms: ${invalidPlatforms.join(', ')}. Supported: ${SUPPORTED_PLATFORMS.join(', ')}.`,
            });
        }

        // Normalise platform names to lowercase
        const normalisedPlatforms = platforms.map((p) => p.toLowerCase());

        console.log(
            `[generate] Content: "${content.substring(0, 60)}..." | Platforms: ${normalisedPlatforms.join(', ')}`
        );

        // ── 2–4. Build prompts, generate captions + images (per platform) ─────
        // Run all platforms concurrently to minimise total latency.
        const platformPromises = normalisedPlatforms.map(async (platform) => {
            // Caption and image can run in parallel per platform
            const [caption, image] = await Promise.all([
                generateCaption(platform, content),
                generateImage(platform, content),
            ]);

            return { platform, caption, image };
        });

        const results = await Promise.all(platformPromises);

        // ── 5. Format response ────────────────────────────────────────────────
        const response = {};
        results.forEach(({ platform, caption, image }) => {
            response[platform] = { caption, image };
        });

        return res.status(200).json(response);
    } catch (error) {
        // Log the full error server-side but only send a safe message to the client
        console.error('[generate] Error:', error.message);
        console.error(error.stack);

        // Handle provider-level HTTP errors (e.g. invalid API key)
        if (error.response) {
            return res.status(502).json({
                error: 'Provider Error',
                message: `The AI provider returned an error: ${error.response.data?.error?.message || error.message}`,
            });
        }

        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Something went wrong while generating content. Please try again.',
        });
    }
});

module.exports = router;
