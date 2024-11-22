import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user_model.mjs";
import { sendVerificationEmail } from "../middleware/Email.js";
import { EmailCodes } from "../models/email_codes.mjs";

export const router = express.Router();
router.use(express.json());

router.post("/register", async (req, res) => {
  try {
    console.log(req.body)
    if (!req.body.Email || !req.body.userType || !req.body.EmpId) {
      return res
        .status(400)
        .json({ success: false, message: "Required felids or not filled" });
    }
    const hashed_Password = await bcrypt.hash(req.body.Password, 10);
    const new_user = new UserModel({
      Name: req.body.Name,
      Email: req.body.Email,
      Phone: req.body.Phone || null,
      EmpId: req.body.EmpId,
      userType: req.body.userType, 
      Password: hashed_Password || null,
    });
    console.log(new_user)
    await new_user
      .save()
      .then(() => {
        res.status(200).send({ message: "User registered successfully!" });
      })
      .catch((err) => {
        res.status(400).json({
          error: `${Object.keys(err.errorResponse.keyPattern)} already existed`,
          status: 400,
        });
      });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    // console.log(req.body);

    const { User, Password } = req.body;
    const user = await UserModel.findOne({
      $or: [{ Email: User }, { EmpId: User }],
    });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ error: "User Not found", status: 400 });
    }
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    // console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid Password", status: 400 });
    }
    const token = jwt.sign(
      {
        username: User,
        password: Password,
      },
      jwtSecretKey,
      { expiresIn: "20minutes" }
    );
    // console.log(token);
    res.json({ accessToken: token });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/VerificationCode", async (req, res) => {
  try {
    const Email = req.body.Email;
    console.log(Email);
    const ExistsUser = await UserModel.findOne({ Email });
    if (ExistsUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists Please Login" });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log(verificationToken);

    const Verification_Code_Email = new EmailCodes({
      Email: Email,
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await Verification_Code_Email.save().then((res) => console.log(res));
    const response = await sendVerificationEmail(Email, verificationToken);

    return res
      .status(200)
      .json({ success: true, message: "Verification code sent" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "internal server error" });
  }
});

router.post("/VerifyEmail", async (req, res) => {
  try {
    const { code } = req.body;
    console.log(code);
    const user = await EmailCodes.findOne({
      verificationToken: code,
    });
    console.log(user, code);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired Code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    // user.verificationTokenExpiresAt = undefined;
    await user.save().then((res)=>console.log(res))
    // await senWelcomeEmail(user.Email, user.Name);
    return res
      .status(200)
      .json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "internal server error" });
  }
});
