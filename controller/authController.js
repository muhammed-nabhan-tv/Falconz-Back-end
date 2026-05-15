import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";
import { generateAccessToken } from "../utils/generateTokens.js";

// POST /api/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    // ✅ read from httpOnly cookie — not from request body
    const token = req.cookies.refreshToken;
    
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // ✅ verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Refresh token expired, please login again" });
    }

    // ✅ check it matches what's stored in DB (invalidated on logout)
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    // ✅ issue a fresh access token
    const newAccessToken = generateAccessToken(user._id);
    res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    await logoutUserService(req.user._id, res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};