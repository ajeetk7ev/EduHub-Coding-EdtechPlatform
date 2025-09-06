export const forgotPasswordTemplate = (name: string, resetUrl: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        padding: 20px;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h2 {
        color: #007bff;
      }
      p {
        font-size: 15px;
        line-height: 1.5;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background: #007bff;
        color: #fff !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <a href="${resetUrl}" class="btn">Reset Password</a>
      <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <div class="footer">
        <p>If you didn’t request this, you can ignore this email.</p>
        <p>— EduHub Team</p>
      </div>
    </div>
  </body>
</html>
`;
