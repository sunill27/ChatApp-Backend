import cloudinary from "../lib/cloudinary.js";
import generateToken from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

//SIGNUP Function:
export const signup = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;
  // console.log("Password received:", password);
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Fullname, email and password are required.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must have at least 6 characters",
      });
    }

    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      //Generate jwt token:
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        message: "Invalid user Data",
      });
    }
  } catch (error) {
    console.log("Error in signUp controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//LOGIN Function:
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//LOGOUT Function:
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maaxAge: 0 });
    res.status(200).json({
      message: "Logged out successfullly",
    });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//Profile Update Function:
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({
        message: "Profile pic is required",
      });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profiles", // Optional: save images in a specific folder on Cloudinary
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in profileUpdate controller", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//CheckAuth Function: Gives authenticated user
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
