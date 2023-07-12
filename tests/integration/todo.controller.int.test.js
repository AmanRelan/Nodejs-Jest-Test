const request = require('supertest');
const app = require('../../app');
const mockData = require('../mock-data/new-todo.json');

const endpointURL = "/todos/";
const testData = { title: "Make integration test for PUT", done: true };

let firstTodo, newTodoId;
describe(endpointURL, () => {
    it('GET ' + endpointURL, async () => {
        const response = await request(app)
            .get(endpointURL);
        expect(response.statusCode).toBe(200);
        // expect(typeof response.body).toBe("array");
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    });
});

describe(endpointURL, () => {
    test("GET BY ID " + endpointURL + ":todoID", async () => {
        const response = await request(app)
            .get(endpointURL + firstTodo._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });
    test("to do item that does not exist", async () => {
        const response = await request(app)
            .get(endpointURL + "64aa8c7092d141e77e475cf3");
        expect(response.statusCode).toBe(404);
    })
});
describe(endpointURL, () => {
    it('POST ' + endpointURL, async () => {
        const response = await request(app)
            .post(endpointURL)
            .send(mockData);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(mockData.title);
        expect(response.body.done).toBe(mockData.done);
        newTodoId = response.body._id;
    });
    it("should return 500  on malformed data with the POST " + endpointURL, async () => {
        const response = await request(app)
            .post(endpointURL)
            .send({ title: "Missing done property" });
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            "message": "Todo validation failed: done: Path `done` is required."
        });
    });
});

describe(endpointURL, () => {
    it('PUT ' + endpointURL, async () => {
        const response = await request(app)
            .put(endpointURL + newTodoId)
            .send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    test("to do item that does not exist", async () => {
        const response = await request(app)
            .put(endpointURL + "64aa8c7092d141e77e475cf3")
            .send(testData);
        expect(response.statusCode).toBe(404);
    })
});

describe(endpointURL, () => {
    it('DELETE ' + endpointURL, async () => {
        const response = await request(app)
            .delete(endpointURL + newTodoId)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    test("to do item that does not exist", async () => {
        const response = await request(app)
            .delete(endpointURL + "64aa8c7092d141e77e475cf3")
            .send();
        expect(response.statusCode).toBe(404);
    })
})