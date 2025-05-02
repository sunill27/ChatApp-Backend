import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    //To decode token:
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(400).json({
        message: "Unauthorized - Invalid Token",
      });
    }

    //To find user:
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "No user found!",
      });
    }
    req.user = user;
    //If everything is valid then next function is called:
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
