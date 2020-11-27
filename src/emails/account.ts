import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const fromAddr = process.env.SEND_FROM_EMAIL!;

export const sendWelcomeEmail = (email: string, name: string) => {
  sgMail.send({
    from: fromAddr,
    to: email,
    subject: 'Welcome to the Task Manager app!',
    text: `Welcome, ${name}!`,
  });
};
