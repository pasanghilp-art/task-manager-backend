require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const checkAuthenticated = require('./authMiddleware');
const { requireUser } = checkAuthenticated;

const Task = require('./Schemas/taskSchema');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('Connected to MongoDB'))
    .catch((err)=> console.log('Connection error', err.message));

app.use(express.json());

const allowedOrigins = [
    'http://localhost:5173',
    'https://task-manager-react-6uff.onrender.com',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

/*
app.use(cors());
*/

const authRoutes = require('./auth');
app.use('/api', authRoutes);

app.get('/tasks',checkAuthenticated, requireUser, async (req,res)=>{
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
        } catch(e){
        console.log(e.message);
        res.status(500).json({ error: "Server error", message: e.message});
    }
});

app.post('/tasks',checkAuthenticated, requireUser,async (req,res)=>{
    try {
    const { name, priority, done } = req.body;
    const newTask = await Task.create({ name, priority, done, user: req.user.id });
    res.status(201).json(newTask);
    } catch(e){
        console.log(e.message);
        res.status(400).json({ error: 'Invalid task', message: e.message });
    }
    });

app.put('/tasks/:id', checkAuthenticated, requireUser, async (req, res) => {
    try {
        const { name, priority, done } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name, priority, done },
            { returnDocument: 'after', runValidators: true },
        );
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
        res.json(updatedTask);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: 'Invalid task', message: e.message });
    }
});

app.delete('/tasks/:id', checkAuthenticated, requireUser, async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deleted) return res.status(404).json({ error: 'Task not found' });
        res.json(deleted);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: 'Invalid task', message: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));