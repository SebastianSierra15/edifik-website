import nodemailer from "nodemailer";
import { EmailSender } from "../../domain/email/EmailSender";

export class NodemailerEmailSender implements EmailSender {
  async send(to: string, subject: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"EdifiK" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}
