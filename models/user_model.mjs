import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.uri;

// checking connection
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to AllUsers");
  })
  .catch((error) => {
    console.log(error.message);
  });

//Setting schema
const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Phone: {
      type: Number,
      required: true,
    },
    EmpId: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamp: true }
);

export const UserModel = mongoose.model("users", userSchema);
