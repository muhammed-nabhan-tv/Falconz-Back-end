import * as userService from '../services/userService.js'

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const registerUser = catchAsync(async(req,res)=>{
    const data = await userService.registerUserService(req.body)
    res.status(200).json(data)
})

export const loginUser = catchAsync(async(req,res)=>{
    const data = await userService.loginUserService(req.body)
    res.cookie("token", data.token, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "Lax"
  });
    res.status(200).json(data)
})