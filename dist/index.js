"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('./db/mongoose');
const dotenv_1 = __importDefault(require("dotenv"));
const user_router_1 = require("./routers/user.router");
const task_router_1 = require("./routers/task.router");
dotenv_1.default.config();
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = parseInt(process.env.PORT || '3000');
app.use(user_router_1.UserRouter);
app.use(task_router_1.TaskRouter);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
