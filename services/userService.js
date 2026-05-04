import User from "../model/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler.js";

export const registerUserService = async ({ firstName, lastName, email, password }) => {

    if (!firstName || !email || !password) {
        throw new AppError("All required fields must be provided", 400);
    }

    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
    }

    email = email.toLowerCase();

    // checking existing user
    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new AppError("User already exists", 400);
    }
    // encrypting the password 
    const hashPassword = await bcrypt.hash(password, 10);

    // registering new user
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashPassword
    });

    if (!process.env.JWT_SECRET) {
        throw new AppError("JWT secret not configured", 500);
    }
    // creating jwt token 
    const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    return {
        message: "User registered",
        token
    };
};
export const loginUserService = async ({password,email}) => {
    //checking user already  have a account or not
    const user = await User.findOne({email})
    if(!user)throw new AppError('user not found',400)

    //BLOCK CHECK
    if(user.Blocked)throw new AppError('Your account has been blocked',403)

    //checking password is valid    
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)throw new AppError('invalid password',400)
        
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})    

    return {
        message:"Login succesful",
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            blocked: user.blocked
        }
    }
}