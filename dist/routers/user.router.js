"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
exports.UserRouter = express_1.Router();
exports.UserRouter.post('/users', async (req, res) => {
    const user = new user_model_1.User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});
exports.UserRouter.get('/users', async (_req, res) => {
    try {
        const users = await user_model_1.User.find();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
exports.UserRouter.get('/users/:id', async (req, res) => {
    try {
        const user = await user_model_1.User.findById(req.params.id);
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
exports.UserRouter.patch('/users/:id', async (req, res) => {
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
        // TODO: figure out how to make this typescript-friendly
        const user = user_model_1.User.findById(req.params.id);
        if (user) {
            givenFields.forEach((field) => {
                user[field] = req.body[field];
            });
            await user.save();
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
exports.UserRouter.delete('/users/:id', async (req, res) => {
    try {
        const user = await user_model_1.User.findByIdAndDelete(req.params.id);
        if (user) {
            res.status(200).send({ message: 'User deleted.' });
        }
        else {
            res
                .status(404)
                .send({ error: `User with id ${req.params.id} not found.` });
        }
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
