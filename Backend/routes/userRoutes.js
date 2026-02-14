import express from "express";
import { registerUser, verify, reverify } from "../controllers/userController.js";


const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verify);
router.post('/reverify', reverify);


export default router;