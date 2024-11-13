import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user_model.mjs";

export const router = express.Router();
router.use(express.json());

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const newPassword = await bcrypt.hash(req.body.Password, 10);
    await UserModel({
      Name: req.body.Name,
      Email: req.body.Email,
      Phone: req.body.Phone,
      EmpId: req.body.EmpId,
      userType: req.body.userType,
      Password: newPassword,
    })
      .save()
      .then(() => {
        res.status(200).send({ message: "User registered successfully!" });
      })
      .catch((err) => {
        res
          .status(400)
          .json({
            error: `${Object.keys(
              err.errorResponse.keyPattern
            )} already existed`,
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
