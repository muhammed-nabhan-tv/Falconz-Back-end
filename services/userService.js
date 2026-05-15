// import User from "../model/UserModel.js";
// import bcrypt from 'bcrypt'
// import jwt from "jsonwebtoken";
// import { AppError } from "../utils/errorHandler.js";

// export const registerUserService = async ({ firstName, lastName, email, password }) => {

//     if (!firstName || !email || !password) {
//         throw new AppError("All required fields must be provided", 400);
//     }

//     if (password.length < 6) {
//         throw new AppError("Password must be at least 6 characters", 400);
//     }

//     email = email.toLowerCase();

//     // checking existing user
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//         throw new AppError("User already exists", 400);
//     }
//     // encrypting the password 
//     const hashPassword = await bcrypt.hash(password, 10);

//     // registering new user
//     const newUser = await User.create({
//         firstName,
//         lastName,
//         email,
//         password: hashPassword
//     });

//     if (!process.env.JWT_SECRET) {
//         throw new AppError("JWT secret not configured", 500);
//     }
//     // creating jwt token 
//     const token = jwt.sign(
//         { id: newUser._id },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//     );
//     return {
//         message: "User registered",
//         token
//     };
// };
// export const loginUserService = async ({password,email}) => {
//     //checking user already  have a account or not
//     const user = await User.findOne({email})
//     if(!user)throw new AppError('user not found',400)

//     //BLOCK CHECK
//     if(user.Blocked)throw new AppError('Your account has been blocked',403)

//     //checking password is valid    
//     const isMatch = await bcrypt.compare(password,user.password)
//     if(!isMatch)throw new AppError('invalid password',400)
        
//     const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})    

//     return {
//         message:"Login succesful",
//         token,
//         user: {
//             id: user._id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             role: user.role,
//             blocked: user.blocked
//         }
//     }
// }

// export const getAllUserService = async()=>{
//     return await User.find().select("-password");
// }

// export const updateUserService = async (userId,)=>{

// }


import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/errorHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

export const registerUserService = async (
  { firstName, lastName, email, password },
  res
) => {
  if (!firstName || !email || !password) {
    throw new AppError("All required fields must be provided", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  email = email.toLowerCase();

  const userExist = await User.findOne({ email });
  if (userExist) throw new AppError("User already exists", 400);

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });

  const accessToken  = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  // ✅ save refresh token in DB
  newUser.refreshToken = refreshToken;
  await newUser.save();

  // ✅ send refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { message: "User registered", accessToken };
};

export const loginUserService = async ({ email, password }, res) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 400);

  if (user.isBlocked) throw new AppError("Your account has been blocked", 403);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid password", 400);

  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // ✅ save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  // ✅ send refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    message: "Login successful",
    accessToken, // ← frontend stores this in localStorage
    user: {
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      role:      user.role,
      isBlocked: user.isBlocked,
    },
  };
};

export const getAllUserService = async () => {
  const users = await User.find({role:"user"}).select("-password -refreshToken").sort({createdAt:-1}).lean();
    return users
};

export const logoutUserService = async (userId, res) => {
  // ✅ wipe refresh token from DB so it can never be reused
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  res.clearCookie("refreshToken");
  return { message: "Logged out successfully" };
};



// export const updateUserService = async (userId, action) => {
//   if (!["block", "unblock"].includes(action)) {
//     throw new AppError("Invalid action. Must be 'block' or 'unblock'", 400);
//   }
//   const user = await User.findById(userId);
//   if (!user) throw new AppError("User not found", 404);
//   if (user.role === "admin") throw new AppError("Cannot block an admin", 403);

//   user.isBlocked = action === "block";
//   await user.save();

//   return {
//     _id:       user._id,
//     name:      `${user.firstName} ${user.lastName}`,
//     email:     user.email,
//     isBlocked: user.isBlocked,
//     message:   `User ${action}ed successfully`,
//   };
// };


export const toggleBlockUserService = async (
  userId,
  blocked
) => {

  const user =
    await User.findByIdAndUpdate(
      userId,
      { isBlocked: blocked },
      {
        new: true,
      }
    );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return user;
};