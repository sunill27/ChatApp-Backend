import express from "express";
import { app, server } from "./lib/socketIO.js";
import { dbConnection } from "./lib/dbConfig.js";

//DotEnv:
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

//CORS:
import cors from "cors";
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

//To allow express to understand json:
app.use(express.json());

//To invoke cookie-parser so that it allows to parse cookie:
import cookieParser from "cookie-parser";
app.use(cookieParser());

//Routes:
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//Database:
server.listen(PORT, () => {
  console.log("Server has started at port:", PORT);
  dbConnection();
});
