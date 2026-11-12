const express = require('express');
const { generateReply } = require('./aiProvider');

const router = express.Router();
const Task = require('../Schemas/taskSchema');

function buildTaskContext(tasks) {
    const today = new Date().toDateString();
    if (tasks.length === 0) {
        return `Today is ${today}. The user has no tasks yet.`;
    }

    const open = tasks.filter((t) => !t.done);
    const high = open.filter((t) => String(t.priority).toLowerCase() === 'high');

    const lines = tasks.map(
        (t) =>
            `- [${t.done ? 'done' : 'open'}] ${String(t.name).slice(0, 100)} (priority: ${t.priority})`,
    );

    return [
        `Today is ${today}.`,
        `The user has ${tasks.length} tasks: ${open.length} open (${high.length} high priority) and ${tasks.length - open.length} done.`,
        'Tasks:',
        ...lines,
    ].join('\n');
}

router.post('/chat', async (req, res) => {
    try {
        return res.json({ reply: 'test reply' });
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

        const tasks = await Task.find({ user: req.user.id }).limit(50).lean();
        const context = buildTaskContext(tasks);
        const reply = await generateReply(clean, context);
    } catch (e) {
            console.log(e.message);
            if (e.status === 503 || e.status === 429) {
             return res.status(503).json({ error: 'The AI is busy right now. Please try again in a moment.' });
            }
        }
});

module.exports = router;