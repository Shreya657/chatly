import express from 'express';
import { checkAuth, checkEmailAvailability, login, signup, updateProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const userRouer=express.Router();

userRouer.post("/signup",signup);
userRouer.post("/login",login);
userRouer.post("/check-email",checkEmailAvailability);
userRouer.put("/update-profile",protectRoute, updateProfile);
userRouer.get("/check-auth",protectRoute,checkAuth);

export default userRouer;
