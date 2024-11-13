import mongoose from "mongoose";

// checking connection
mongoose
  .connect("mongodb://localhost:27017/mongooseDataBase")
  .then(() => {
    console.log("connected to Users");
  })
  .catch((error) => {
    console.log(error.message);
  });

//Setting schema
const userSchema = new mongoose.Schema(
  {
    Name:{
        type: String
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
  },
  { timeStamp: true }
);

export const UserModel = mongoose.model("users", userSchema); 
