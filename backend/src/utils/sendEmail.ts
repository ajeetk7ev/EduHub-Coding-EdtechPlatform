import * as SibApiV3Sdk from "@getbrevo/brevo";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: any; // optional, if you want rich HTML email
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Configure API key
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
      name: "EduHub",
      email: process.env.BREVO_MAIL_FROM!
    };
    sendSmtpEmail.to = [{ email: to }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully using Brevo:", response.body);
    return true;
  } catch (error: any) {
    console.error("Error sending email via Brevo:", error);
    if (error.response && error.response.body) {
      console.error(JSON.stringify(error.response.body, null, 2));
    }
    return false;
  }
};

