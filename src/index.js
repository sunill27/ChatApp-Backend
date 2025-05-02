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
app.use("/api/auth", authRoutes);

//Database:
import { dbConnection } from "./lib/dbConfig.js";
app.listen(PORT, () => {
  console.log("Server has started at port:", PORT);
  dbConnection();
});
