"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorizer_1 = require("./middleware/authorizer");
const user_router_1 = require("./routers/user.router");
const task_router_1 = require("./routers/task.router");
require('./db/mongoose');
const app = express_1.default();
const port = parseInt(process.env.PORT || '3000');
app.use(authorizer_1.authorizer);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(user_router_1.UserRouter);
app.use(task_router_1.TaskRouter);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
