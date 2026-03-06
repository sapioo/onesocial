/**
 * providers/bedrockProvider.js
 *
 * Wraps the Amazon Bedrock Runtime API for:
 *   - generateCaption(prompt) – using Anthropic Claude
 *   - generateImage(prompt)   – using Stability AI (SDXL)
 *
 * AWS SDK v3 docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/
 */

const {
    BedrockRuntimeClient,
    InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

// Initialise the Bedrock client once (uses env vars automatically)
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Generate a caption using Anthropic Claude on Amazon Bedrock.
 *
 * @param {string} prompt - The fully-formed caption prompt
 * @returns {Promise<string>} Generated caption text
 */
async function generateCaption(prompt) {
    const modelId =
        process.env.BEDROCK_CAPTION_MODEL_ID ||
        'anthropic.claude-3-sonnet-20240229-v1:0';

    // Claude Messages API body format
    const requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1024,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    };

    const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody),
    });

    const response = await bedrockClient.send(command);

    // The response body is a Uint8Array – decode it to a string
    const responseBody = JSON.parse(
        Buffer.from(response.body).toString('utf-8')
    );

    const caption = responseBody?.content?.[0]?.text;

    if (!caption) {
        throw new Error('Bedrock returned an empty caption response.');
    }

    return caption.trim();
}

/**
 * Generate an image using Stability AI (SDXL) on Amazon Bedrock.
 *
 * @param {string} prompt - The fully-formed image prompt
 * @returns {Promise<string>} Base-64 encoded PNG image string
 */
async function generateImage(prompt) {
    const modelId =
        process.env.BEDROCK_IMAGE_MODEL_ID ||
        'stability.stable-diffusion-xl-v1';

    // SDXL request body format
    const requestBody = {
        text_prompts: [
            { text: prompt, weight: 1 },
        ],
        cfg_scale: 10,
        steps: 50,
        width: 1024,
        height: 1024,
    };

    const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody),
    });

    const response = await bedrockClient.send(command);

    const responseBody = JSON.parse(
        Buffer.from(response.body).toString('utf-8')
    );

    // SDXL returns base-64 encoded image data
    const imageBase64 = responseBody?.artifacts?.[0]?.base64;

    if (!imageBase64) {
        throw new Error('Bedrock returned an empty image response.');
    }

    // Return as a data URL so React can render it directly
    return `data:image/png;base64,${imageBase64}`;
}

module.exports = { generateCaption, generateImage };
