/**
 * utils/platformConfig.js
 *
 * Central configuration for each supported social-media platform.
 * Used by promptService to build platform-specific AI prompts.
 */

const platformConfig = {
  instagram: {
    // Caption style guidance sent to the AI
    captionStyle: `
      Write an Instagram caption that is:
      - Engaging and conversational
      - Includes 3–5 relevant emojis scattered naturally throughout
      - Ends with 5–8 relevant hashtags on a new line
      - Feels authentic and speaks directly to the audience
      - Between 100 and 200 words
    `.trim(),

    // Image prompt style guidance
    imageStyle: `
      Vibrant, high-quality, eye-catching social media image.
      Bright colours, modern aesthetic, suitable for Instagram feed.
      Aspect ratio 1:1 (square). No text overlay.
    `.trim(),
  },

  linkedin: {
    captionStyle: `
      Write a LinkedIn post that is:
      - Professional and authoritative in tone
      - Structured with a compelling opening line, 2–3 insightful paragraphs, and a clear call-to-action
      - No emojis or slang
      - Between 150 and 300 words
      - Ends with 3 relevant professional hashtags
    `.trim(),

    imageStyle: `
      Clean, professional business image.
      Corporate aesthetic, neutral colours, modern design.
      Landscape orientation (1200x627). No decorative borders.
    `.trim(),
  },

  twitter: {
    captionStyle: `
      Write a Tweet (X post) that is:
      - Punchy and attention-grabbing
      - Strictly under 280 characters (this is a hard limit)
      - May include 1–2 emojis if they add value
      - Includes 1–2 relevant hashtags
      - Ends with impact – no filler words
    `.trim(),

    imageStyle: `
      Bold, simple, thumb-stopping image for Twitter/X.
      High contrast, minimal composition, 16:9 ratio.
      No text overlay.
    `.trim(),
  },
};

module.exports = platformConfig;
