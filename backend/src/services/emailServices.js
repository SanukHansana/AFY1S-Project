import sgMail from "@sendgrid/mail";

export const sendWelcomeEmail = async (toEmail, name) => {
  // Check if variables are loading
  if (!process.env.SENDGRID_API_KEY) {
    console.error("Missing SENDGRID_API_KEY in .env");
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: toEmail,
    from: process.env.EMAIL_FROM,
    subject: "Welcome!",
    html: `<h1>Welcome ${name}!</h1><p>Thanks for joining.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent via Service");
  } catch (error) {
    console.error("Service Error:", error.response?.body || error.message);
  }
};