const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let Tasks = [];

app.listen(3000, () => console.log('Listening on port 5000'));


app.get('/task',(req,res)=>{
    res.send(Tasks);
});

app.post('/task',(req,res)=>{
    const newTask = {
        id: Tasks.id + 1,
        name: req.body
    }

    Tasks.push(newTask);
    res.status(201).send(Tasks);
});

app.put('task/:id',(req,res)=>{
    const Task = Tasks.find(t => t.id === parseInt(req.params.id));
    Task.name = req.body.name;
    res.send(Tasks);

app.delete('task/:id',(req,res)=>{
    const Task = Tasks.find(t=> t.id === parseInt(req.params.id));
    const index = Tasks.indexOf(Task);
    Tasks.splice(index, 1);
    res.send(Tasks);
});

});