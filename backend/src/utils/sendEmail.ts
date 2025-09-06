import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: any; // optional, if you want rich HTML email
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST!,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
    });

    const mailOptions = {
      from: 'EduHub | Learning Platform',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
