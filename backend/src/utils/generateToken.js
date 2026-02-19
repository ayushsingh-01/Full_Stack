import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your_secret_key", {
    expiresIn: "7d",
  });
};

export default generateToken;
