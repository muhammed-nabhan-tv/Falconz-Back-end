// routes/authRoutes.js
import express from "express";
import { refreshToken,logout } from "../controller/authController.js";
import userAuth from "../middlewares/auth.js";

const AuthRouter = express.Router();

AuthRouter.post("/refresh", refreshToken);           // no auth middleware — token is expired
AuthRouter.post("/logout",  userAuth, logout);       // needs valid access token to logout

export default AuthRouter;