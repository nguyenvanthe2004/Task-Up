import { Service } from "typedi";
import axios from "axios";

@Service()
export class MailService {
  private async sendEmail(
    to: string,
    subject: string,
    htmlContent: string
  ) {
    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "TaskUp",
            email: process.env.SENDER_EMAIL,
          },
          to: [{ email: to }],
          subject,
          htmlContent,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY!,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Mail sent:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Send mail error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async sendVerifyCode(email: string, code: string) {
    return this.sendEmail(
      email,
      "Email verification",
      `<h2>Your verification code: <strong>${code}</strong></h2>`
    );
  }

  async sendForgotPassword(email: string, code: string) {
    return this.sendEmail(
      email,
      "Password reset",
      `<h2>Your new password: <strong>${code}</strong></h2>`
    );
  }

  async sendInviteEmail(email: string, inviteToken: string) {
    const acceptUrl = `${process.env.FRONTEND_URL}/landing?inviteToken=${inviteToken}`;

    return this.sendEmail(
      email,
      "You've been invited to join a workspace on TaskUp",
      `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif">
        <h2>You've been invited!</h2>
        <p>Click below to join your workspace:</p>

        <a
          href="${acceptUrl}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#6366f1;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          Accept Invitation
        </a>

        <p style="margin-top:20px">
          Or open this link manually:
        </p>

        <p>
          <a href="${acceptUrl}">
            ${acceptUrl}
          </a>
        </p>
      </body>
      </html>
      `
    );
  }
}