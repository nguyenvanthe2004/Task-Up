import { Service } from "typedi";
import axios from "axios";

@Service()
export class MailService {
  async sendVerifyCode(email: string, code: string) {
    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "TaskUp",
            email: process.env.SENDER_EMAIL,
          },
          to: [{ email }],
          subject: "Email verification",
          htmlContent: `<h2>Your verification code: ${code}</h2>`,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY!,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Mail sent:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Send verify mail error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}