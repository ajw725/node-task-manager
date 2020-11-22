"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('./db/mongoose');
const user_1 = require("./models/user");
const task_1 = require("./models/task");
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = parseInt(process.env.PORT || '3000');
app.post('/users', async (req, res) => {
    const user = new user_1.User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});
app.get('/users', async (_req, res) => {
    try {
        const users = await user_1.User.find();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
app.get('/users/:id', async (req, res) => {
    try {
        const user = await user_1.User.findById(req.params.id);
        if (user) {
            res.status(200).send(user);
        }
        else {
            res
                .status(404)
                .send({ error: `User with id ${req.params.id} not found` });
        }
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
app.patch('/users/:id', async (req, res) => {
    const givenFields = Object.keys(req.body);
    const allowedFields = ['name', 'email', 'password', 'age'];
    if (givenFields.length === 0) {
        res
            .status(400)
            .send({ error: 'You must provide at least one field to update.' });
    }
    const isValid = givenFields.every((f) => allowedFields.includes(f));
    if (!isValid) {
        res.status(400).send({ error: 'Invalid field provided for update' });
    }
    try {
        const user = await user_1.User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (user) {
            res.status(200).send(user);
        }
        else {
            res
                .status(404)
                .send({ error: `User with id ${req.params.id} not found` });
        }
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
app.patch('/tasks/:id', async (req, res) => {
    const givenFields = Object.keys(req.body);
    if (givenFields.length === 0) {
        res
            .status(400)
            .send({ error: 'You must provide at least one field to update.' });
    }
    const allowedFields = ['description', 'completed'];
    const isValid = givenFields.every((f) => allowedFields.includes(f));
    if (!isValid) {
        res.status(400).send({ error: 'Invalid field provided for update' });
    }
    try {
        const task = await task_1.Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (task) {
            res.status(200).send(task);
        }
        else {
            res
                .status(404)
                .send({ error: `Task with id ${req.params.id} not found` });
        }
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
app.post('/tasks', async (req, res) => {
    const task = new task_1.Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});
app.get('/tasks', async (_req, res) => {
    try {
        const tasks = await task_1.Task.find();
        res.status(200).send(tasks);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await task_1.Task.findById(req.params.id);
        if (task) {
            res.status(200).send(task);
        }
        else {
            res
                .status(404)
                .send({ error: `Task with id ${req.params.id} not found.` });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
