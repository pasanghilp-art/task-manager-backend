const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let Tasks = [];

app.get('/tasks',(req,res)=>{
    res.send(Tasks);
});

app.post('/tasks',(req,res)=>{
    const newTask = {
        id: crypto.randomUUID(),
        ...req.body
    }

    Tasks.push(newTask);
    res.status(201).send(Tasks);
});

app.put('/tasks/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const taskExists = Tasks.some(task => task.id === id);
    if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    Tasks = Tasks.map(Task => Task.id === id? {
        ...Task, ...req.body
    }: Task)
    res.send(Tasks);
});

app.delete('/tasks/:id',(req,res)=>{
    const id = parseInt(req.params.id);

    const taskExists = Tasks.some(task => task.id === id);
    if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
    }
    Tasks = Tasks.filter(Task => Task.id !== id);
    res.json(Tasks);
});

app.listen(3000, () => console.log('Listening on port 3000'));