import nodemailer from "nodemailer";
import { Verification_Email_Template } from "./EmailTemplate.js";

const pass = process.env.Email_pass_key;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "akhilesh90123@gmail.com",
    pass: "pmnr efct yrbc ptzs", //MAKE SURE REMOVE THIS BEFORE UPLOADED TO GIT HUB
  },
});

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"WorkWave" <akhilesh90123@gmail.com>',
      to: email,
      subject: "Verify your Email",
      text: "Enter the code displayed in the app to verify your Email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    return response
    // console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};
