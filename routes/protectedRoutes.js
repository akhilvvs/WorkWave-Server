/* Authorization -->To determine what an authenticated user is allowed to do.After verifying the token aka authentication.*/
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.mjs";
import { UserModel } from "../models/user_model.mjs";
import { WorkStatus } from "../models/workstatus.mjs";
import { ProjectModel } from "../models/project_model.mjs";
import jwt from "jsonwebtoken";

export const protectedRoutes = express.Router();
protectedRoutes.use(express.json());

protectedRoutes.get("/LoginUser/:username", verifyToken, async (req, res) => {
  try {
    const username = req.params.username;
    const projection = {
      Name: 1,
      Email: 1,
      EmpId: 1,
      Phone: 1,
      userType: 1,
      _id: 0,
    };
    const user = await UserModel.findOne({
      $or: [{ Email: username }, { EmpId: username }],
    },projection);
    if(!user){
      res.status(400).send("user not found!");
    }else{
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send("username not recieved!");
  }
});

protectedRoutes.get("/AllUsers", verifyToken, async (req, res) => {
  try {
    const projection = {
      Name: 1,
      Email: 1,
      EmpId: 1,
      Phone: 1,
      userType: 1,
      _id: 0,
    };
    const allUsers = await UserModel.find({}, projection);
    res.status(200).send(allUsers);
  } catch (err) {
    if (err.Name === "TokenExpiredError") {
      res.status(401).send("Token expired");
    } else {
      res.status(500).send("An error occurred");
    }
    console.error(err);
  }
});

// Post Work Status
protectedRoutes.post("/workstatus", verifyToken, async (req, res) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.headers["authorization"].split(" ")[1];
    const { ProjectName, Today, Tomorrow } = req.body;
    const object = jwt.verify(token, jwtSecretKey);

    if (!req.body) {
      return res.status(400).send("Enter WorkStatus!");
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const user = await UserModel.findOne({
      $or: [{ Email: object.username }, { EmpId: object.username }],
    });
    if (!user) {
      return res.status(400).send("User not found");
    } else {
      const empStatus = {
        EmpId: user.EmpId,
        userType: user.userType,
        ProjectName: ProjectName,
        Date: `${year}-${month}-${day}`,
        EmpWorkStatus: {
          Today: `${Today}`,
          Tomorrow: `${Tomorrow}`,
        },
      };
      const status = new WorkStatus(empStatus);
      await status.save();
      res.status(200).send("WorkStatus was posted..");
    }
  } catch (err) {
    if (err.Name === "TokenExpiredError") {
      res.status(401).send("Token expired");
    } else {
      res.status(500).send("An error occurred !");
    }
    console.error(err);
  }
});

//Filter route
protectedRoutes.post("/filter", verifyToken, async (req, res) => {
  try {
    WorkStatus.find({})
      .then((doc) => {
        let filterData = {
          from: req.body.from || "",
          to: req.body.to || "",
          EmpId: req.body.EmpId || "",
          ProjectName: req.body.ProjectName || "",
          designation: req.body.designation || "",
        };
        let workStatus_Data = doc;
        if (filterData.from.length && filterData.to.length) {
          workStatus_Data = workStatus_Data.filter(
            (value) =>
              new Date(value.Date) >= new Date(filterData.from) &&
              new Date(value.Date) <= new Date(filterData.to)
          );
        } else if (filterData.from.length || filterData.to.length) {
          workStatus_Data = workStatus_Data.filter(
            (value) =>
              new Date(value.Date) >= new Date(filterData.from) ||
              new Date(value.Date) <= new Date(filterData.to)
          );
        }
        if (filterData.EmpId.length) {
          workStatus_Data = workStatus_Data.filter(
            (value) => value.EmpId == filterData.EmpId
          );
        }
        if (filterData.ProjectName.length) {
          workStatus_Data = workStatus_Data.filter(
            (value) => value.ProjectName == filterData.ProjectName
          );
        }
        if (filterData.designation.length) {
          workStatus_Data = workStatus_Data.filter(
            (value) => value.userType == filterData.designation
          );
        }
        res.status(200).send(workStatus_Data);
      })
      .catch((err) => {
        res.status(400).send("Enable to send the data!");
      });
  } catch (err) {
    res.status(400).send("Filter is unavailable!");
  }
});

// Post Projects
protectedRoutes.post("/Projects", verifyToken, async (req, res) => {
  try {
    const data = req.body;

    if (!data) { 
      return res.status(400).send("Enter Project Details!");
    }
    const ProjectDetails = {
      EmpId: data.EmpId,
      ProjectName: data.ProjectName,
    };
    const status = new ProjectModel(ProjectDetails);
    await status.save();
    res.status(200).send("ProjectDetails are posted!");
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).send("Token expired");
    } else {
      res.status(500).send("An error occurred");
    }
    console.error(err);
  }
});

// Get EmployeeIDs
protectedRoutes.get("/employeeID", verifyToken, async (req, res) => {
  try {
    UserModel.find({})
      .then((doc) => {
        const EmpId = [];
        doc.forEach((ele) => EmpId.push(ele.EmpId));
        res.status(200).send(EmpId);
      })
      .catch((err) => {
        res.status(400).send("Unable to fetch data!");
      });
  } catch (err) {
    res.status(400).send("Cannot get EMployee ID");
  }
});

protectedRoutes.post("/AddEmployee/:EmpId", async (req, res) => {
  let EmpId = req.params.EmpId;
  console.log(EmpId);
  try {
    if (!req.body.Email || !req.body.EmpId) {
      return res
        .status(400)
        .json({ success: false, message: "Required felids or not filled" });
    }
    const new_user = new UserModel({
      Name: req.body.Name,
      Email: req.body.Email,
      Phone: "default",
      EmpId: req.params.EmpId,
      userType: "Employee",
      Password: "default",
    });
    await new_user
      .save()
      .then(() => {
        res.status(200).send({ message: "Employee Added successfully!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          // error: `${Object.keys(err.errorResponse.keyPattern)} already existed`,
          status: 400
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error.message,
    });
  }
});
