import mongoose from "mongoose";

// checking connection
mongoose
  .connect("mongodb://localhost:27017/mongooseDataBase")
  .then(() => {
    console.log("connected to Projects");
  })
  .catch((error) => {
    console.log(error.message);
  });

//Setting schema
const ProjectSchema = new mongoose.Schema(
{
  EmpId: {
    type: String,
    required: true,
  },
  ProjectName: {
    type: String,
    required: true,
  }
});

//creating Model
export const ProjectModel = mongoose.model("Projects", ProjectSchema);
