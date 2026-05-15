
import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";
import { AppError } from "../utils/errorHandler.js";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token is missing", 401);
    }

    const token = authHeader.split(" ")[1];

    // ✅ verify access token — if expired, client must call /auth/refresh
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new AppError("Access token expired", 401);
        // frontend intercepts this 401 → calls /api/auth/refresh → retries
      }
      throw new AppError("Invalid token", 401);
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new AppError("User not found", 404);
    if (user.isBlocked) throw new AppError("Your account has been blocked", 403);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default userAuth;