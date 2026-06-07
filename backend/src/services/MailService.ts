import { Service } from "typedi";
import * as brevo from "@getbrevo/brevo";

@Service()
export class MailService {
  private apiInstance: brevo.TransactionalEmailsApi;

  constructor() {
    console.log(
      "BREVO_API_KEY =",
      process.env.BREVO_API_KEY ? "EXISTS" : "MISSING"
    );

    this.apiInstance = new brevo.TransactionalEmailsApi();

    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );
  }

  async sendVerifyCode(email: string, code: string) {
    try {
      console.log("Start send Email");

      const result = await this.apiInstance.sendTransacEmail({
        sender: {
          name: "TaskUp",
          email: process.env.SENDER_EMAIL!,
        },
        to: [
          {
            email,
          },
        ],
        subject: "Email verification",
        htmlContent: `<h2>Your verification code: ${code}</h2>`,
      });

      console.log("Mail sent:", result.body);
      return result;
    } catch (error) {
      console.error("Send verify mail error:", error);
      throw error;
    }
  }

  async sendForgotPassword(email: string, code: string) {
    return this.apiInstance.sendTransacEmail({
      sender: {
        name: "TaskUp",
        email: process.env.SENDER_EMAIL!,
      },
      to: [{ email }],
      subject: "Password reset",
      htmlContent: `<h2>Your new password: ${code}</h2>`,
    });
  }

  async sendInviteEmail(email: string, inviteToken: string) {
    const acceptUrl = `${process.env.FRONTEND_URL}/landing?inviteToken=${inviteToken}`;

    return this.apiInstance.sendTransacEmail({
      sender: {
        name: "TaskUp",
        email: process.env.SENDER_EMAIL!,
      },
      to: [{ email }],
      subject: "You've been invited to join a workspace on TaskUp",
      htmlContent: `
        <h2>You've been invited!</h2>
        <p>Click below to join:</p>
        <a href="${acceptUrl}">
          Accept Invitation
        </a>
      `,
    });
  }
}