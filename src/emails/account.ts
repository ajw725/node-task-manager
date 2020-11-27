import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const fromAddr = process.env.SEND_FROM_EMAIL!;

export const sendWelcomeEmail = (email: string, name: string): void => {
  sgMail.send({
    from: fromAddr,
    to: email,
    subject: 'Welcome to the Task Manager app!',
    text: `Welcome, ${name}!`,
  });
};

export const sendGoodbyeEmail = (email: string, name: string): void => {
  sgMail.send({
    from: fromAddr,
    to: email,
    subject: "We're sorry to see you go",
    text: `Goodbye, ${name}! We're sorry to see you leave.`,
  });
};
