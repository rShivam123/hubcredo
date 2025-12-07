
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT == 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify SMTP connection at server start
transporter.verify((err, success) => {
  if (err) console.error("SMTP Connection Error:", err);
  else console.log("SMTP Ready to send emails");
});

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log("Email sent to:", to, "MessageID:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email send failed:", err.message);
    throw err;
  }
}

module.exports = { sendEmail };

