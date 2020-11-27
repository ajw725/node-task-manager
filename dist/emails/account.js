"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGoodbyeEmail = exports.sendWelcomeEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const fromAddr = process.env.SEND_FROM_EMAIL;
exports.sendWelcomeEmail = (email, name) => {
    mail_1.default.send({
        from: fromAddr,
        to: email,
        subject: 'Welcome to the Task Manager app!',
        text: `Welcome, ${name}!`,
    });
};
exports.sendGoodbyeEmail = (email, name) => {
    mail_1.default.send({
        from: fromAddr,
        to: email,
        subject: "We're sorry to see you go",
        text: `Goodbye, ${name}! We're sorry to see you leave.`,
    });
};
