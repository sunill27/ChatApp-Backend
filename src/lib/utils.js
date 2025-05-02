import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 100, //milisecond
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks
    sameSite: true, //prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", //True in productiion
  });

  return token;
};
export default generateToken;
