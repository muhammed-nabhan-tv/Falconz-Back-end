import * as userService from '../services/userService.js'

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const registerUser = catchAsync(async(req,res)=>{
    const data = await userService.registerUserService(req.body,res)
    res.status(200).json(data)
})

export const loginUser = catchAsync(async(req,res)=>{
    const data = await userService.loginUserService(req.body,res)
    res.status(200).json(data)
})

export const getAllUsers = catchAsync(async(req,res)=>{
  const users = await userService.getAllUserService()
  res.status(200).json({users})
})

export const toggleBlockUser = catchAsync(async (req,res) => {
  const {isBlocked} =  req.body
  const user = await userService.toggleBlockUserService(req.params.id ,isBlocked)
  res.status(200).json(user);
})