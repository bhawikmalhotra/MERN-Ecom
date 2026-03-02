import express from "express";
import { registerUser, verify, reverify, login, logout, forgetPassword, verifyOTP, changePassword, allUser} from "../controllers/userController.js";
import {isAuthorized, isAdmin} from "../middleware/auth.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verify);
router.post('/reverify', reverify);
router.post('/login', login);   
router.post('/logout', isAuthorized, logout);   
router.post('/forget-password', forgetPassword);
router.post('/verify-otp/:email', verifyOTP);
router.post('/change-password/:email',changePassword);
router.get('/all-user', allUser);


export default router;  