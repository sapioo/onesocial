/**
 * services/imageService.js
 *
 * Provider-agnostic image generation.
 *
 * Generates platform-optimized images by passing
 * correct aspect ratios to the AI provider.
 */

const { buildImagePrompt } = require("./promptService");

// Platform-specific image sizes
const PLATFORM_IMAGE_SIZES = {
  instagram: "1024x1024",
  linkedin: "1200x627",
  twitter: "1280x720",
};

// Lazily load providers (same pattern as captionService)
function getProvider() {
  const provider = (process.env.AI_PROVIDER || "openrouter").toLowerCase();

  if (provider === "bedrock") {
    return require("../providers/bedrockProvider");
  }

  return require("../providers/openrouterProvider");
}

/**
 * Generate a platform-appropriate image for the given content.
 *
 * @param {string} platform - instagram | linkedin | twitter
 * @param {string} content  - raw idea/topic
 * @returns {Promise<string>} image URL
 */
async function generateImage(platform, content) {
  const prompt = buildImagePrompt(platform, content);
  const provider = getProvider();

  // Determine correct image size
  const size = PLATFORM_IMAGE_SIZES[platform] || "1024x1024";

  return provider.generateImage(prompt, size);
}

module.exports = { generateImage };