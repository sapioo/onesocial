/**
 * services/captionService.js
 *
 * Provider-agnostic caption generation.
 *
 * Reads the AI_PROVIDER environment variable to select the correct
 * provider at runtime. Supported values: "openrouter" (default), "bedrock".
 *
 * Usage:
 *   const { generateCaption } = require('./captionService');
 *   const caption = await generateCaption('instagram', content);
 */

const { buildCaptionPrompt } = require('./promptService');

// Lazily load providers to avoid initialisation errors when a provider
// is not configured (e.g., no AWS creds when using openrouter).
function getProvider() {
    const provider = (process.env.AI_PROVIDER || 'openrouter').toLowerCase();

    if (provider === 'bedrock') {
        return require('../providers/bedrockProvider');
    }

    // Default: OpenRouter
    return require('../providers/openrouterProvider');
}

/**
 * Generate a platform-specific caption for the given content.
 *
 * @param {string} platform - Social media platform (instagram | linkedin | twitter)
 * @param {string} content  - Raw topic or idea from the request
 * @returns {Promise<string>} The AI-generated caption
 */
async function generateCaption(platform, content) {
    const prompt = buildCaptionPrompt(platform, content);
    const provider = getProvider();

    return provider.generateCaption(prompt);
}

module.exports = { generateCaption };
