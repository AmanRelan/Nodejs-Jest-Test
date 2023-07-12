const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    }
});

const ToDoModel = mongoose.model("Todo", toDoSchema);

module.exports = ToDoModel;