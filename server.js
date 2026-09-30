require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const Task = require('./Schemas/taskSchema');
const User = require('./Schemas/userSchema');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('Connected to MongoDB'))
    .catch((err)=> console.log('Connection error', err.message));

const initializePassport = require('./passport-config');
initializePassport(passport);

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
    },
    credentials: true,
}));

app.set('trust proxy', 1);

const isProduction = process.env.NODE_ENV === 'production';
const MongoStore = require('connect-mongo');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    },
}));
app.use(passport.initialize());
app.use(passport.session());

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Not logged in'});
}

const authRoutes = require('./auth');
app.use('/api', authRoutes);

app.get('/tasks', async (req,res)=>{
    try {
        const tasks = await Task.find();
        res.json(tasks);
        } catch(e){
        console.log(e.message);
        res.status(500).json({ error: "Server error", message: e.message});
    }
});

app.post('/tasks',async (req,res)=>{
    try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
    } catch(e){
        console.log(e.message);
        res.status(400).json({ error: 'Invalid task', message: e.message });
    }
    });

app.put('/tasks/:id',async (req,res)=>{
    try {
        const id = req.params.id;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });

        if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
        }

        res.json(updatedTask);
    }
    catch(e){
        console.log(e.message);
        res.status(400).json({ error: 'Invalid task', message: e.message });
    }
});

app.delete('/tasks/:id',async (req,res)=>{
    try {
         const id = req.params.id;
        const TaskDelete = await Task.findByIdAndDelete(id);
         if(!TaskDelete){
            return res.status(404).json({ error: "Task not found"});
    }
    res.json(TaskDelete);
    }
    catch (e){
        console.log(e.message);
        res.status(400).json({ error: 'Invalid task', message: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));