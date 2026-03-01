import express from "express";
import { registerUser, verify, reverify, login, logout, forgetPassword, verifyOTP, changePassword} from "../controllers/userController.js";
import isAuthorized from "../middleware/auth.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verify);
router.post('/reverify', reverify);
router.post('/login', login);   
router.post('/logout', isAuthorized, logout);   
router.post('/forget-password', forgetPassword);
router.post('/forget-password/:email', verifyOTP);
router.post('/change-password/:email',changePassword);


export default router;  