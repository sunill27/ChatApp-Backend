import mongoose from "mongoose";

export const dbConnection = async (req, res) => {
  try {
    const conn = await mongoose.connect(process.env.MongoDB_URL);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Something went wrong.", error);
  }
};
