"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const connString = 'mongodb://127.0.0.1:27017/task_manager_api';
mongoose_1.default.connect(connString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
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
    },
    age: {
        type: Number,
        default: 0,
        validate: [(val) => val >= 0, 'Age cannot be negative'],
    },
});
const User = mongoose_1.default.model('User', userSchema);
const user = new User({
    name: ' Bodie ',
    email: 'BODIE@example.com',
    password: ' password123',
    age: 2,
});
// user
//   .save()
//   .then((data) => console.log('created user:', data))
//   .catch((err) => console.error('failed to save user:', err.errors));
// const invalid = new User({ name: 'Andrew', age: 'invalid' });
// invalid
//   .save()
//   .then((data) => console.log('created user:', data))
//   .catch(err => console.error('failed to save user', err));
const taskSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: [true, 'You must provide a task description'],
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});
const Task = mongoose_1.default.model('Task', taskSchema);
const firstTask = new Task({ description: '', completed: true });
firstTask
    .save()
    .then((t) => console.log('created task:', t))
    .catch((e) => console.error('failed to create task:', e));
