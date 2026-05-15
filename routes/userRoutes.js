import express from 'express';
import {
    registerUser,
    loginUser,
    toggleBlockUser,
    getAllUsers
} from "../controller/userController.js";
import User from '../model/UserModel.js';
import userAuth from '../middlewares/auth.js';
import { adminAuth } from '../middlewares/adminAuth.js';
// import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/allusers',userAuth,adminAuth,getAllUsers)
userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser)
userRouter.patch('/block/:id',userAuth,adminAuth,toggleBlockUser)

export default userRouter;