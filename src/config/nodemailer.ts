// Looking to send emails in production? Check out our Email API/SMTP product!

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({});

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

const config = () => {
  return {
    host: SMTP_HOST,
    port: +SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  };
};

export const transporter = nodemailer.createTransport(config());
