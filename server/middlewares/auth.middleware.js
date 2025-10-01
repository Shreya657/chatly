import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new ApiError(401, "No token provided");

    const token = authHeader.split(" ")[1];
    // ["Bearer", "abc123"][1]  // → "abc123"

    if (!token) throw new ApiError(401, "No token provided");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    req.user = user;
    next();
  } catch (err) {
    console.error("Protect route error:", err.message);
    throw new ApiError(401, "Unauthorized");
  }
});

export { protectRoute };
