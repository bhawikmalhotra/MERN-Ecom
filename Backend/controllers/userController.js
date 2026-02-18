import User  from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import Sessions from "../model/sessionModel.js";


const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save()
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user    
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

const verify = async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Authorization Token is missing",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded){
            return res.status(400).json({
                success: false,
                message: "Token Expired",
            });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.token = null;
        user.isverified = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify user",
            error: error.message,
        });
    }
}

const reverify = async(req,res) => {
    try {
        const {email} = req.body;
        if (!email){
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.isverified){
            return res.status(400).json({
                success: false,
                message: "User is already verified",
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            token: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify user",
            error: error.message,
        });
    }
}
 
const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }
        if (!user.isverified){
            return res.status(400).json({
                success: false,
                message: "User is not verified",
            });
        }
        // Generating tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        user.isLoggedIn = true
        await user.save();


        // Checking existing session
        const existingSession = await Sessions.findOne({userId: user._id})
        if (existingSession){
            await Sessions.deleteOne({userId: user._id})
        }

        await Sessions.create({userId: user._id})

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.firstName}`,
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
   } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to login user",
            error: error.message,
        });
    }
}

const logout = async (req, res) => {
    try {
        const userId = req.id;
        await Sessions.deleteOne({userId: userId});
        const user = await User.findById(userId);
        user.isLoggedIn = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to logout user",
        });
        
    }
}

export { registerUser, verify, reverify, login, logout };