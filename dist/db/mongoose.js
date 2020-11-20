"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connString = 'mongodb://127.0.0.1:27017/task_manager_api';
mongoose_1.default.connect(connString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const userSchema = new mongoose_1.default.Schema({
    name: { type: String },
    age: { type: Number }
});
const User = mongoose_1.default.model('User', userSchema);
// const andrew = new User({ name: 'Andrew', age: 29 });
// andrew
//   .save()
//   .then((data) => console.log('created user:', data))
//   .catch(err => console.error('failed to save user', err));
const invalid = new User({ name: 'Andrew', age: 'invalid' });
invalid
    .save()
    .then((data) => console.log('created user:', data))
    .catch(err => console.error('failed to save user', err));
