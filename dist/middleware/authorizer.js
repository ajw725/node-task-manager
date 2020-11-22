"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizer = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("../models/user.model");
const validateToken = async (token) => {
    const jwtSecret = process.env.JWT_SECRET || '';
    const decoded = jsonwebtoken_1.verify(token, jwtSecret);
    const user = await user_model_1.User.findOne({
        _id: decoded._id,
        'tokens.token': token,
    });
    if (!user) {
        throw new Error('No user found');
    }
    return user;
};
exports.authorizer = async (req, res, next) => {
    const { method, path } = req;
    const skipAuth = method === 'POST' && (path === '/login' || path === '/users');
    if (skipAuth) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'Unauthorized' });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const user = await validateToken(token);
        req.user = user;
    }
    catch (err) {
        return res.status(401).send({ error: 'Unauthorized' });
    }
    next();
};
