import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.uri;

// checking connection
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to WorkStatus");
  })
  .catch((error) => {
    console.log(error.message);
  });

const statusSchema = new mongoose.Schema({
  Today: { type: String, required: true },
  Tomorrow: { type: String, required: true },
});
//Setting schema
const workStatusSchema = new mongoose.Schema({
  EmpId: {
    type: String,
    required: true,
  },
  ProjectName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  Date: { type: String },
  EmpWorkStatus: statusSchema,
});

//creating Model
export const WorkStatus = mongoose.model("workStatus", workStatusSchema);
