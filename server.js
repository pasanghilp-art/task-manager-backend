const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let Tasks = [];

app.get('/tasks',(req,res)=>{
    res.json(Tasks);
});

app.post('/tasks',(req,res)=>{
    const newTask = {
        id: crypto.randomUUID(),
        done: false,
        ...req.body
    }

    Tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    const taskExists = Tasks.some(task => task.id === id);
    if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    Tasks = Tasks.map(Task => Task.id === id? {
        ...Task, ...req.body
    }: Task)
    const updatedTask = Tasks.find(t => t.id === id);
    res.json(updatedTask);
});

app.delete('/tasks/:id',(req,res)=>{
    const id = req.params.id;

    const taskExists = Tasks.some(task => task.id === id);
    if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
    }
    Tasks = Tasks.filter(Task => Task.id !== id);
    res.json(Tasks);
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${PORT}`));