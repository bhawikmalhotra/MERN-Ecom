import nodemailer from "nodemailer";
import "dotenv/config";

const sendOTP = async (otp, email) => {
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
    subject: "Reset Your Password",
    text: `Hi,

Your OTP is: ${otp}

Best regards,
Your App Team`,
  };

  transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("OTP sent: " + info.response);
    }
  });
};

export { sendOTP };
