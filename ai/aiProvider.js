const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = (process.env.GEMINI_MODELS || 'gemini-3.5-flash-lite,gemini-3.8-flash')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);

const FALLBACK_STATUSES = [404, 429, 500, 503];

const SYSTEM_PROMPT = 'You are a helpful assistant inside a task manager and expense tracker app. keep answers short and clear.';

async function generateReply(messages) {
    const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    let lastError;

    for (const model of MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents,
                config: { systemInstruction: SYSTEM_PROMPT },
            });
            return response.text;
        } catch (e) {
            lastError = e;
            if (!FALLBACK_STATUSES.includes(e.status)) throw e;
            console.log(`Model ${model} failed (${e.status}), trying next`);
        }
    }

    throw lastError;
}

module.exports = { generateReply };