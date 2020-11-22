"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
exports.UserRouter = express_1.Router();
exports.UserRouter.post('/users', async (req, res) => {
    const user = new user_model_1.User(req.body);
    try {
        const token = await user.generateAuthToken(false);
        await user.save();
        res.status(201).send({ user, token });
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});
exports.UserRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findByCredentials(email, password);
        if (user) {
            const token = await user.generateAuthToken();
            res.status(200).send({ user, token });
        }
        else {
            res.status(401).send({ error: 'Invalid credentials.' });
        }
    }
    catch (err) {
        console.error('login error:', err);
        res.status(500).send({ error: err });
    }
});
exports.UserRouter.delete('/logout', async (req, res) => {
    try {
        const thisToken = req.token;
        const user = req.user;
        const removeAll = req.query.all;
        user.tokens = removeAll
            ? []
            : user.tokens.filter((t) => t.token !== thisToken);
        await user.save();
        const msg = `Logged out${removeAll ? ' from all sessions' : ''} successfully`;
        res.status(200).send({ message: msg });
    }
    catch (err) {
        console.error('logout error:', err);
        res.status(500).send({ error: err });
    }
});
exports.UserRouter.get('/users/me', async (req, res) => {
    res.status(200).send(req.user);
});
exports.UserRouter.get('/users/me', async (req, res) => {
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
exports.UserRouter.patch('/users/me', async (req, res) => {
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
        const user = req.user;
        givenFields.forEach((field) => {
            user[field] = req.body[field];
        });
        await user.save();
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
exports.UserRouter.delete('/users/me', async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send({ message: 'Profile deleted.' });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
