const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",     // 👈 replace this
    pass: "your-app-password"         // 👈 and this
  }
});

function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Email failed:", error);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  });
}

module.exports = sendEmail;
