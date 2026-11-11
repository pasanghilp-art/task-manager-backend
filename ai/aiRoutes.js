const express = require('express');
const { genrateReply } = require('./aiProvider');

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
         const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages is required' });
        }

        let clean = messages
            .filter((m) => m && typeof m.content === 'string' && m.content.trim())
            .slice(-20)
            .map((m) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content.slice(0, 2000),
            }));

        while (clean.length && clean[0].role !== 'user') clean.shift();

        if (clean.length === 0) {
            return res.status(400).json({ error: 'No valid user message' });
        }

        const reply = await generateReply(clean);
        res.json({ reply });
    } catch (e) {
        console.log(e.message);
        if (e.status === 429) {
            return res.status(429).json({ error: 'Too many requests, try again in a minute.' });
        }
        res.status(500).json({ error: 'AI error', message: e.message });
    }
});

module.exports = router;