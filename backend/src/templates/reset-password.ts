export const forgotPasswordTemplate = (name: string, resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password | EduHub</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #050816;
            color: #d1d5db;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #050816;
            padding-bottom: 60px;
        }
        .main {
            background-color: #0d1b2a;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            border-radius: 24px;
            border: 1px solid #1e293b;
            overflow: hidden;
            margin-top: 40px;
        }
        .header {
            padding: 40px 30px;
            text-align: center;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
        .content {
            padding: 40px 30px;
            text-align: left;
        }
        h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #9ca3af;
            margin-bottom: 24px;
        }
        .btn-container {
            text-align: center;
            padding: 20px 0;
        }
        .btn {
            display: inline-block;
            padding: 16px 36px;
            background-color: #ffffff;
            color: #2563eb !important;
            text-decoration: none;
            border-radius: 14px;
            font-weight: 700;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .footer {
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            border-top: 1px solid #1e293b;
        }
        .link-alt {
            word-break: break-all;
            color: #3b82f6;
            font-size: 13px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <h1>EduHub</h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <p style="color: #ffffff; font-size: 20px; font-weight: 600;">Hello ${name},</p>
                    <p>We received a request to reset your EduHub account password. If you didn't make this request, you can safely ignore this email.</p>
                    <div class="btn-container">
                        <a href="${resetUrl}" class="btn">Reset Password</a>
                    </div>
                    <p style="margin-top: 20px; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
                    <p style="font-size: 12px; margin-top: 40px;">If the button above doesn't work, copy and paste this URL into your browser:</p>
                    <a href="${resetUrl}" class="link-alt">${resetUrl}</a>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p style="margin-bottom: 10px;">&copy; 2026 EduHub Learning Platform. All rights reserved.</p>
                    <p>Tech Park, Bangalore, India</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
`;

