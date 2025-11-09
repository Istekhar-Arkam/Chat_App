// middleware to protect route
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "not authorized to access this route");
  }
};
