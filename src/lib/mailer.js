import nodemailer from "nodemailer";

export const sendVerificationEmail = async ({
  email,
  username,
  verifyToken,
}) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyLink = `${process.env.NEXTAUTH_URL}/verify?token=${verifyToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Email | Auth App",
    html: `
      <h2>Hello ${username},</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyLink}" style="color: blue;">Verify Email</a>
      <br /><br />
      <p>This link will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
