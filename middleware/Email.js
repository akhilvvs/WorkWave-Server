import nodemailer from "nodemailer";
import { Verification_Email_Template } from "./EmailTemplate.js";
import dotenv from "dotenv";

dotenv.config();

const Email = process.env.Email_Id;
const pass = process.env.Email_pass_key;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, 
  secure: false,
  auth: {
    user: Email,
    pass: pass,
  },
});

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: `WorkWave <${Email}>`,
      to: email,
      subject: "Verify your Email",
      text: "Enter the code displayed in the app to verify your Email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    return response;
  } catch (error) {
    console.log("Email error", error);
  }
};
