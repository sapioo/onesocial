/**
 * services/promptService.js
 *
 * Builds AI prompts for each social-media platform.
 * The prompts are later sent to the chosen AI provider
 * (OpenRouter or Bedrock) by captionService and imageService.
 */

const platformConfig = require("../utils/platformConfig");

/**
 * Build a caption generation prompt for a specific platform.
 */
function buildCaptionPrompt(platform, content) {
  const config = platformConfig[platform];

  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  return `
You are an expert social media copywriter.

Topic / Idea:
"${content}"

Your task:
${config.captionStyle}

Write a compelling caption optimized for engagement.

Respond with ONLY the caption text.
No explanations.
`.trim();
}

/**
 * Build an image generation prompt optimized for AI image models
 * like Flux or DALL-E.
 */
function buildImagePrompt(platform, content) {
  const config = platformConfig[platform];

  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  // Base visual style for all platforms
  const baseVisualStyle = `
modern social media marketing poster,
clean minimal startup aesthetic,
orange gradient lighting,
futuristic tech elements,
high quality digital design,
bold typography space,
professional marketing graphic
`;

  // Platform-specific composition
  const platformVisualStyles = {
    instagram: `
square composition,
visually engaging layout,
vibrant colors,
attention grabbing design
`,
    linkedin: `
professional corporate visual,
clean business aesthetic,
modern tech startup branding
`,
    twitter: `
wide banner style composition,
dynamic layout,
bold tech themed visuals
`,
  };

  const platformStyle = platformVisualStyles[platform] || "";

  return `
Create a high-quality social media marketing image.

Topic:
"${content}"

Design style:
${baseVisualStyle}

Platform style:
${platformStyle}

Additional requirements:
${config.imageStyle}

The image should look like a polished marketing graphic for a tech startup.
`.trim();
}

module.exports = { buildCaptionPrompt, buildImagePrompt };