const ToDoController = require("../../controllers/todo.controller");
const ToDoModel = require("../../model/todo.model");
const httpMocks = require('node-mocks-http');
const mockData = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/allTodos.json');

// Multiple Functions per function
// ToDoModel.create = jest.fn();
// ToDoModel.find = jest.fn();
// ToDoModel.findById = jest.fn();
// ToDoModel.findByIdAndUpdate = jest.fn();
// ToDoModel.findByIdAndDelete = jest.fn();

//Shortcut in Jest for Mocking the whole model/class module
jest.mock("../../model/todo.model");

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})
const todoId = "64aa8c245a7b61d1fc0b90a7";

describe('TodoController.getTodos', () => {
    it("should have a get to do function", () => {
        expect(typeof ToDoController.getTodos).toBe("function");
    });
    it("should return all of the documents from mongoose", async () => {
        await ToDoController.getTodos(req, res, next);
        expect(ToDoModel.find).toHaveBeenCalledWith({});
    });
    it("should return response with a status code of 200 and all Todos", async () => {
        ToDoModel.find.mockReturnValue(allTodos);
        await ToDoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Error finding" }
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.find.mockReturnValue(rejectedPromise);
        await ToDoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('TodoController.getTodoByID', () => {
    it("should have a getTodoById", () => {
        expect(typeof ToDoController.getTodoById).toBe("function");
    });
    it("should call TodoModel.findById with route parameters", async () => {
        req.params.todoId = todoId;
        await ToDoController.getTodoById(req, res, next);
        expect(ToDoModel.findById).toBeCalledWith(todoId);
    });
    it("should return response with a status code of 200 and the request Todo", async () => {
        ToDoModel.findById.mockReturnValue(mockData);
        await ToDoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(mockData);
    });
    it("should be able to handle errors", async () => {
        const errorMessage = { message: "No such entry exists!" }
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.findById.mockReturnValue(rejectedPromise);
        await ToDoController.getTodoById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 when the id does not exist", async () => {
        ToDoModel.findById.mockReturnValue(null);
        await ToDoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});
describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = mockData;
    });
    it("should have a create to do function", () => {
        expect(typeof ToDoController.createTodo).toBe("function");
    });
    it("should call TodoModel.create", () => {
        ToDoController.createTodo(req, res, next);
        expect(ToDoModel.create).toBeCalled();
        expect(ToDoModel.create).toBeCalledWith(mockData);
    });
    it("should return 201 response", async () => {
        await ToDoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy;
    });
    it("should return json body in response", async () => {
        ToDoModel.create.mockReturnValue(mockData);
        await ToDoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(mockData);
    });
    it("should handle errors", async () => {
        const errorMessage = { "message": "done property is missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.create.mockReturnValue(rejectedPromise);
        await ToDoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('TodoController.update', () => {
    it('should have a updateTodo Function', () => {
        expect(typeof ToDoController.updateTodo).toBe("function");
    });
    it("should update with TodoModel.findByIdAndUpdate", async () => {
        req.params.todoId = todoId;
        req.body = mockData;
        await ToDoController.updateTodo(req, res, next);

        expect(ToDoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, mockData, {
            new: true,
            useFindAndModify: false
        });
    });
    it("should return a response with the json data", async () => {
        req.params.todoId = todoId;
        req.body = mockData;
        ToDoModel.findByIdAndUpdate.mockReturnValue(mockData);
        await ToDoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(mockData);
    });
    it("should be able to handle the errors", async () => {
        const errorMessage = { message: "Cannot update the resources you want" }
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await ToDoController.updateTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 if the id does not exist", async () => {
        ToDoModel.findByIdAndUpdate.mockReturnValue(null);
        await ToDoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});
describe('TodoController.delete', () => {
    it('should have a deleteTodo function', () => {
        expect(typeof ToDoController.deleteTodo).toBe("function");
    });
    it('should delete with TodoModel.findByIdAndDelete', async () => {
        req.params.todoId = todoId;
        await ToDoController.deleteTodo(req, res, next);
        expect(ToDoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
    });
    it('should return a response with delete Todo Model and 200', async () => {
        ToDoModel.findByIdAndDelete.mockReturnValue(mockData);
        await ToDoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(mockData);
    });
    it('should be able to handle the errors', async () => {
        const errorMessage = { message: "Cannot update the resources you want" }
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await ToDoController.deleteTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it('should handle 404', async () => {
        ToDoModel.findByIdAndDelete.mockReturnValue(null);
        await ToDoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});