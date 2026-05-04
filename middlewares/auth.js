import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";
import { AppError } from "../utils/errorHandler.js";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token is missing", 401);
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // ⚠️ Fix property name (case-sensitive)
    if (user.blocked) {
      throw new AppError("User is blocked", 403);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default userAuth;