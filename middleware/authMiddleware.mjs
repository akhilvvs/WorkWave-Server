//Authentication Middleware -->To verify the identity of a user.

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401).send("Token not Available");
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey);

    req.Password = decoded.Password;
    next();
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ status: "error", error: "invalid token" });
  }
};
