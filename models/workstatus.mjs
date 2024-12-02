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
