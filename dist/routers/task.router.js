"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRouter = void 0;
const express_1 = require("express");
const task_model_1 = require("../models/task.model");
exports.TaskRouter = express_1.Router();
exports.TaskRouter.post('/tasks', async (req, res) => {
    const task = new task_model_1.Task({
        ...req.body,
        user: req.user._id,
    });
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});
exports.TaskRouter.get('/tasks', async (req, res) => {
    try {
        const tasks = await task_model_1.Task.find({ user: req.user._id });
        res.status(200).send(tasks);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.TaskRouter.get('/tasks/:id', async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({ _id: req.params.id, user: req.user._id });
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
exports.TaskRouter.patch('/tasks/:id', async (req, res) => {
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
        const task = await task_model_1.Task.findOne({
            _id: req.params.id,
            user: req.params._id,
        });
        if (task) {
            givenFields.forEach((field) => {
                task[field] = req.body[field];
            });
            await task.save();
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
exports.TaskRouter.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await task_model_1.Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if (task) {
            res.status(200).send({ message: 'Task deleted.' });
        }
        else {
            res
                .status(404)
                .send({ error: `Task with id ${req.params.id} not found.` });
        }
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
