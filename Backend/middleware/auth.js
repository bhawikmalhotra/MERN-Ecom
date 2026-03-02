import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import 'dotenv/config'


const isAuthorized = async (req, res, next) => {
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
        req.user = user
        req.id = user._id;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to authorize user",
            error: error.message,
        });
    }
}

const isAdmin = async (req, res, next) => {
    try {
        if(req.user && req.user.role === "admin"){
            next();
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Access Denied: ADMIN only",
            error: error.message,
        });
    }
}

export {isAuthorized, isAdmin};