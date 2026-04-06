import { Service } from "typedi";
import nodemailer from "nodemailer";

@Service()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerifyCode(email: string, code: string) {
    await this.transporter.sendMail({
      from: `"Travel Web" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email verification",
      html: `<h2>Your verification code: ${code}</h2>`,
    });
  }
  async sendForgotPassword(email: string, code: string) {
    await this.transporter.sendMail({
      from: `"Travel Web" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password reset",
      html: `<h2>Your new password: ${code}</h2>`,
    });
  }
}
