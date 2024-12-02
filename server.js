import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { router } from "./routes/auth.js";
import { protectedRoutes } from "./routes/protectedRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
dotenv.config();

const port = process.env.port;

app.use("/employee", router);
app.use("/api", protectedRoutes);

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
