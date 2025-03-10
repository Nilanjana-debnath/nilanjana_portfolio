
"use server";

import 'dotenv/config';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { ContactFormSchema } from './schemas';

type ContactFormInputs = z.infer<typeof ContactFormSchema>;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);

  if (result.error) {
    return { error: result.error.format() };
  }

  try {

    const { name, email, message } = result.data;
    const mailOptions = {
      from: `Nilanjana Debnath <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New message from ${name}!`,
      text: `Name:\n${name}\n\nEmail:\n${email}\n\nMessage:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error };
  }
}
