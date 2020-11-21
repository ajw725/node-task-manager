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
app.post('/users', (req, res) => {
    const user = new user_1.User(req.body);
    user
        .save()
        .then(() => {
        res.status(201).send(user);
    })
        .catch((err) => {
        res.status(400).send({ error: err });
    });
});
app.get('/users', (_req, res) => {
    user_1.User.find()
        .then((users) => res.status(200).send(users))
        .catch((err) => res.status(500).send({ error: err }));
});
app.get('/users/:id', (req, res) => {
    user_1.User.findById(req.params.id)
        .then((user) => {
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(404).send({ error: 'User not found' });
        }
    })
        .catch((err) => res.status(500).send({ error: err }));
});
app.post('/tasks', (req, res) => {
    const task = new task_1.Task(req.body);
    task
        .save()
        .then(() => {
        res.status(201).send(task);
    })
        .catch((err) => {
        res.status(400).send({ error: err });
    });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
