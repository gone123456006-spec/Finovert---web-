import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use an App Password, not your real Gmail password
  },
});

const FROM_ADDRESS = `"Finovert No-Reply" <${process.env.GMAIL_USER}>`;

// ─── Templates ────────────────────────────────────────────────────────────────

const baseHtml = (body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1d4ed8, #3b82f6); padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
    .header p { color: #bfdbfe; margin: 6px 0 0; font-size: 14px; }
    .body { padding: 36px 40px; color: #1e293b; line-height: 1.7; }
    .body h2 { font-size: 20px; margin: 0 0 12px; }
    .body p { margin: 0 0 16px; font-size: 15px; color: #475569; }
    .badge { display: inline-block; padding: 6px 18px; border-radius: 999px; font-weight: 700; font-size: 13px; }
    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-red { background: #fee2e2; color: #b91c1c; }
    .badge-blue { background: #dbeafe; color: #1d4ed8; }
    .cred-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 24px; margin: 20px 0; }
    .cred-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { font-weight: 600; color: #64748b; font-size: 13px; }
    .cred-value { font-family: monospace; font-size: 14px; color: #1e293b; font-weight: 700; }
    .btn { display: inline-block; margin-top: 8px; padding: 12px 28px; background: #1d4ed8; color: #fff; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 40px; text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Finovert</h1>
      <p>Official Communication</p>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      This is an automated message. Please do not reply to this email.<br />
      © ${new Date().getFullYear()} Finovert. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

// ─── Email Sending Function ────────────────────────────────────────────────────

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: err.message };
  }
};

// ─── Pre-built Email Templates ─────────────────────────────────────────────────

export const emails = {

  // Internship application received
  internshipReceived: (name) => ({
    subject: 'Application Received – Finovert Internship Program',
    html: baseHtml(`
      <h2>Hi ${name} 👋</h2>
      <p>Thank you for applying to the <strong>Finovert Internship Program</strong>! We have successfully received your application and it is currently under review.</p>
      <p>Our team will go through your details and documents, and we will get back to you shortly with an update.</p>
      <p>In the meantime, feel free to explore our website and learn more about what we do.</p>
      <p>We appreciate your interest in joining the Finovert family!</p>
      <a class="btn" href="https://finovert.com">Visit Finovert</a>
    `),
  }),

  // Internship selected
  internshipSelected: (name) => ({
    subject: '🎉 Congratulations! You Have Been Selected – Finovert',
    html: baseHtml(`
      <h2>Congratulations, ${name}! 🎉</h2>
      <p>We are thrilled to inform you that your application for the <strong>Finovert Internship Program</strong> has been <span class="badge badge-green">Selected</span>.</p>
      <p>Our team was impressed with your profile and we look forward to working with you. A member of our HR team will contact you shortly with further details about the onboarding process.</p>
      <p>Welcome aboard, ${name}! You are now officially part of the Finovert journey. 🚀</p>
    `),
  }),

  // Internship rejected
  internshipRejected: (name) => ({
    subject: 'Update on Your Finovert Internship Application',
    html: baseHtml(`
      <h2>Hi ${name},</h2>
      <p>Thank you for taking the time to apply to the <strong>Finovert Internship Program</strong>.</p>
      <p>After careful consideration, we regret to inform you that your application status has been updated to <span class="badge badge-red">Not Selected</span> at this time.</p>
      <p>This was a highly competitive selection process and we encourage you to keep building your skills. We will keep your profile on file and you are welcome to apply again in future cycles.</p>
      <p>We wish you the very best in your career ahead!</p>
    `),
  }),

  // Sub-admin approved — never email the password (it is hashed and the user already chose it)
  subAdminApproved: (name, username) => ({
    subject: '✅ Your Sub-Admin Access Has Been Approved – Finovert',
    html: baseHtml(`
      <h2>Welcome to the Team, ${name}! ✅</h2>
      <p>Great news! Your request for Sub-Admin access on the <strong>Finovert Admin Portal</strong> has been <span class="badge badge-green">Approved</span>.</p>
      <p>You can now log in with the username <strong>${username}</strong> and the password you created when you requested access.</p>
      <p>If you forgot that password, request access again or contact the main admin.</p>
      <a class="btn" href="https://www.finovert.com/TawangJOB">Go to Admin Portal</a>
    `),
  }),

  // Sub-admin rejected
  subAdminRejected: (name) => ({
    subject: 'Update on Your Finovert Sub-Admin Request',
    html: baseHtml(`
      <h2>Hi ${name},</h2>
      <p>Thank you for your interest in joining the <strong>Finovert Admin Team</strong>.</p>
      <p>Unfortunately, your Sub-Admin access request has been <span class="badge badge-red">Rejected</span> at this time.</p>
      <p>If you believe this was a mistake or would like to provide additional information, please contact us directly.</p>
    `),
  }),

  // Sub-admin account deleted
  subAdminDeleted: (name) => ({
    subject: 'Your Finovert Sub-Admin Account Has Been Removed',
    html: baseHtml(`
      <h2>Hi ${name},</h2>
      <p>This is to inform you that your <strong>Finovert Sub-Admin account</strong> has been <span class="badge badge-red">Permanently Removed</span> from our system by the administrator.</p>
      <p>Your login credentials are no longer valid. If you have any questions or concerns, please contact the Finovert team.</p>
    `),
  }),

  // Custom message from main admin (individual or broadcast)
  customAdmin: (adminMessage) => ({
    subject: 'Message from Finovert Admin',
    html: baseHtml(`
      <h2>Important Message from Finovert</h2>
      <p>${adminMessage.replace(/\n/g, '<br/>')}</p>
    `),
  }),
};
