/**
 * providers/openrouterProvider.js
 *
 * Handles OpenRouter API calls for:
 *   - Caption generation
 *   - Image generation
 */

const axios = require("axios");

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Ensure API key exists
 */
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing in .env");
}

/**
 * Create reusable OpenRouter client
 */
const openrouterClient = axios.create({
  baseURL: OPENROUTER_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.APP_URL || "http://localhost:5000",
    "X-Title": process.env.APP_NAME || "OneSocial",
  },
  timeout: 60000,
});

/**
 * Generate caption using OpenRouter chat models
 */
async function generateCaption(prompt) {
  try {
    const response = await openrouterClient.post("/chat/completions", {
      model:
        process.env.OPENROUTER_CAPTION_MODEL ||
        "mistralai/mistral-small-3.1",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_tokens: 300,
    });

    const caption = response.data?.choices?.[0]?.message?.content;

    if (!caption) {
      throw new Error("OpenRouter returned an empty caption response.");
    }

    return caption.trim();
  } catch (error) {
    console.error(
      "[OpenRouter Caption Error]",
      error?.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Generate image using OpenRouter image models
 */
async function generateImage(prompt) {
  try {
    const response = await openrouterClient.post("/chat/completions", {
      model:
        process.env.OPENROUTER_IMAGE_MODEL ||
        "black-forest-labs/flux.2-klein-4b",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      modalities: ["image"],
    });

    const imageUrl =
      response.data?.choices?.[0]?.message?.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error("OpenRouter returned no image.");
    }

    return imageUrl;
  } catch (error) {
    console.error(
      "[OpenRouter Image Error]",
      error?.response?.data || error.message
    );
    throw error;
  }
}

/**
 * IMPORTANT: Export functions so other services can use them
 */
module.exports = {
  generateCaption,
  generateImage,
};