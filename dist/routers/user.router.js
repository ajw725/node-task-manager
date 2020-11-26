"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
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
        const { user } = req;
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
exports.UserRouter.get('/users/me', (req, res) => {
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
        const { user } = req;
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
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const uploader = multer_1.default({
    limits: {
        fileSize: 1048576,
    },
    fileFilter: (_req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Please upload a JPG or PNG image'));
        }
        cb(null, true);
    },
});
exports.UserRouter.post('/users/me/avatar', uploader.single('avatar'), async (req, res) => {
    const buf = await sharp_1.default(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
    const { user } = req;
    user.avatar = buf;
    await user.save();
    res.status(200).send({ message: 'Avatar uploaded' });
}, (err, _req, res, _next) => {
    res.status(400).json({ error: err.message });
});
exports.UserRouter.delete('/users/me/avatar', async (req, res) => {
    try {
        const { user } = req;
        user.avatar = undefined;
        await user.save();
        res.status(200).json({ message: 'Avatar image removed.' });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
exports.UserRouter.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await user_model_1.User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png').send(user.avatar);
    }
    catch (err) {
        res.status(404).json({ message: 'Image not found.' });
    }
});
