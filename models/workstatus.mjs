import mongoose from "mongoose";

// checking connection
mongoose
  .connect("mongodb://localhost:27017/mongooseDataBase")
  .then(() => {
    console.log("connected to WorkStatus");
  })
  .catch((error) => {
    console.log(error.message);
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
  EmpWorkStatus: {
    type: String,
    required: true,
  },
});

//creating Model
export const WorkStatus = mongoose.model("workStatus", workStatusSchema);
