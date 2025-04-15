import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtHelper = {
  generateToken: (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  },
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Error verifying token:", error);
      throw new Error("Token verification failed");
    }
  },
};

export default jwtHelper;
