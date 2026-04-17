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
      from: `"TaskUp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email verification",
      html: `<h2>Your verification code: ${code}</h2>`,
    });
  }
  async sendForgotPassword(email: string, code: string) {
    await this.transporter.sendMail({
      from: `"TaskUp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password reset",
      html: `<h2>Your new password: ${code}</h2>`,
    });
  }
  async sendInviteEmail(email: string, inviteToken: string) {
    const acceptUrl = `${process.env.FRONTEND_URL}/landing?inviteToken=${inviteToken}`;
    const currentYear = new Date().getFullYear();

    await this.transporter.sendMail({
      from: `"TaskUp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "You've been invited to join a workspace on TaskUp",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>You're Invited – TaskUp</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Email card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:40px 48px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <!-- Logo / Brand -->
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.15);border-radius:10px;padding:8px 14px;">
                          <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                            ✦ TaskUp
                          </span>
                        </td>
                      </tr>
                    </table>
                    <!-- Headline -->
                    <p style="margin:24px 0 0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.5px;">
                      You've been invited!
                    </p>
                    <p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.5;">
                      Someone has invited you to collaborate on TaskUp.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">

              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
                Hi there,
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
                You've received an invitation to join a <strong style="color:#111827;">workspace on TaskUp</strong> —
                the all-in-one platform for teams to manage tasks, track progress, and get work done.
              </p>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-top:1px solid #e5e7eb;"></td>
                </tr>
              </table>

              <!-- Info box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" valign="middle">
                          <div style="width:36px;height:36px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:8px;text-align:center;line-height:36px;font-size:17px;">
                            🏢
                          </div>
                        </td>
                        <td style="padding-left:14px;" valign="middle">
                          <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.4;">You're joining</p>
                          <p style="margin:2px 0 0;font-size:15px;font-weight:600;color:#111827;">A TaskUp Workspace</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);border-radius:8px;">
                    <a href="${acceptUrl}"
                      style="display:inline-block;padding:15px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;border-radius:8px;">
                      Accept Invitation &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 10px;font-size:13px;color:#6b7280;line-height:1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:13px;color:#4f46e5;word-break:break-all;line-height:1.6;">
                <a href="${acceptUrl}" style="color:#4f46e5;text-decoration:none;">${acceptUrl}</a>
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e5e7eb;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;line-height:1.6;">
                      This invitation link will expire in <strong>7 days</strong>.
                      If you did not expect this email, you can safely ignore it — no action is required.
                    </p>
                    <p style="margin:0;font-size:12px;color:#d1d5db;line-height:1.6;">
                      &copy; ${currentYear} TaskUp. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End email card -->

      </td>
    </tr>
  </table>

</body>
</html>
    `,
    });
  }
}
