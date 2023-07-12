const TodoModel = require('../model/todo.model');

exports.createTodo = async (req, res, next) => {
    try {
        const createdTodo = await TodoModel.create(req.body);
        res.status(201).json(createdTodo);
    } catch (error) {
        next(error);
    }
};

exports.getTodos = async (req, res, next) => {
    try {
        const allTodos = await TodoModel.find({});
        res.status(200).json(allTodos);
    } catch (err) {
        next(err);
    }
};

exports.getTodoById = async (req, res, next) => {
    try {
        const singleTodo = await TodoModel.findById(req.params.todoId);
        if (singleTodo) {
            res.status(200).json(singleTodo);
        }
        else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.updateTodo = async (req, res, next) => {
    try {
        const todoId = req.params.todoId;
        const newTodo = req.body;

        const updatedTodo = await TodoModel.findByIdAndUpdate(todoId, newTodo, {
            new: true,
            useFindAndModify: false,
        });
        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteTodo = async (req, res, next) => {
    try {
        const todoId = req.params.todoId;
        const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
        if (deletedTodo) {
            res.status(200).json(deletedTodo);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        next(error);
    }
}