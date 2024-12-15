import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.uri;

// checking connection
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to VerificationCodes");
  })
  .catch((error) => {
    console.log(error.message);
  });

//Setting schema
const codesSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 7200,//expires in 2hours
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: { type: Boolean, required: true },
    verificationToken: { type: String },
  }
);

export const EmailCodes = mongoose.model("Verification_codes", codesSchema);
