const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apikey: process.env.GEMINI_API_KEY });

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const SYSTEM_PROMT = 'You are a helpful assistant inside a task manager and expense tracker app. keep answers short and clear.';

async function generateReply(messages) {
    const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: { systemInstruction: SYSTEM_PROMPT },
    });

    return response.text;
}

module.exports = { generateReply };