import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.uri;

// checking connection
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to Projects");
  })
  .catch((error) => {
    console.log(error.message);
  });

//Setting schema
const ProjectSchema = new mongoose.Schema({
  EmpId: {
    type: String,
    required: true,
  },
  ProjectName: {
    type: String,
    required: true,
  },
});

//creating Model
export const ProjectModel = mongoose.model("Projects", ProjectSchema);
