import nodemailer from "nodemailer";
import "dotenv/config";

const verifyEmail = async (token, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailConfiguration = {
    from: process.env.MAIL_ID,
    to: email,
    subject: "Verify your email address",
    text: `Hi,

Thank you for signing up. Please verify your email address by clicking the link below:

http://localhost:3000/verify-email?token=${token}

If you did not create this account, you can safely ignore this email.

Best regards,
Your App Team`,
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #333333; text-align: center;">Verify Your Email</h2>
      
      <p style="font-size: 16px; color: #555555;">
        Hi there,
      </p>
      
      <p style="font-size: 16px; color: #555555;">
        Thank you for signing up! Please confirm your email address by clicking the button below.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000/verify-email?token=${token}" 
           style="background-color: #4CAF50; 
                  color: #ffffff; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  font-size: 16px; 
                  display: inline-block;">
          Verify Email
        </a>
      </div>

      <p style="font-size: 14px; color: #888888;">
        If you did not create an account, no further action is required.
      </p>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />

      <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
        © ${new Date().getFullYear()} Your App Name. All rights reserved.
      </p>

    </div>
  </div>
  `,
  };

  transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export { verifyEmail };
