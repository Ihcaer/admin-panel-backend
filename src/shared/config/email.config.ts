import nodemailer, { Transporter } from "nodemailer";

export const emailUsername: string = String(process.env.EMAIL_USERNAME);
export const emailErrorUsername: string = String(process.env.EMAIL_TO_USERNAME_ERROR);
export const emailContactUsername: string = String(process.env.EMAIL_TO_USERNAME_CONTACT);

const transporter: Transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: Number(process.env.EMAIL_PORT),
   secure: process.env.EMAIL_SECURE === "true",
   auth: {
      user: emailUsername,
      pass: process.env.EMAIL_PASSWORD
   }
});

export default transporter;