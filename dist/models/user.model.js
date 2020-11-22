"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [
            (val) => validator_1.default.isEmail(val),
            'Invalid email address',
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate: [
            (val) => !val.toLowerCase().includes('password'),
            'Password cannot contain the string "password"',
        ],
    },
    salt: {
        type: String,
        select: false,
    },
    age: {
        type: Number,
        default: 0,
        validate: [(val) => val >= 0, 'Age cannot be negative'],
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});
UserSchema.methods.generateAuthToken = async function (save = true) {
    const user = this;
    const payload = { _id: user._id.toString() };
    const secret = process.env.JWT_SECRET || '';
    const token = jsonwebtoken_1.sign(payload, secret);
    user.tokens = [...user.tokens, { token }];
    if (save) {
        await user.save();
    }
    return token;
};
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await exports.User.findOne({ email: email });
    if (!user)
        return null;
    const passwordMatch = await bcrypt_1.compare(password, user.password);
    return passwordMatch ? user : null;
};
// CANNOT use an arrow function, because we need to bind "this"
UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const rawPassword = user.get('password');
        let salt = user.get('salt');
        if (!salt) {
            salt = await bcrypt_1.genSalt();
            user.set('salt', salt);
        }
        const hashedPassword = await bcrypt_1.hash(rawPassword, salt);
        user.set('password', hashedPassword);
    }
    next();
});
exports.User = mongoose_1.model('User', UserSchema);
