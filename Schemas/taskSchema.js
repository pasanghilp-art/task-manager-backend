const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: String,
    priority: String,
    done: { type: Boolean, default: false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;