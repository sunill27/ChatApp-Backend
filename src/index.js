import express from "express";
const app = express();

//DotEnv:
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

//To allow express to understand json:
app.use(express.json());

//To invoke cookie-parser so that it allows to parse cookie:
import cookieParser from "cookie-parser";
app.use(cookieParser());

//Routes:
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

//Database:
import { dbConnection } from "./lib/dbConfig.js";
app.listen(PORT, () => {
  console.log("Server has started at port:", PORT);
  dbConnection();
});
