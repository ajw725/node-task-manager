"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = require("bcrypt");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: true,
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
        select: false,
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
});
// CANNOT use an arrow function, because we need to bind "this"
userSchema.pre('save', async function (next) {
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
exports.User = mongoose_1.default.model('User', userSchema);
