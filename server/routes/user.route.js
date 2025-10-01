import express from 'express';
import { checkAuth, login, signup, updateProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const userRouer=express.Router();

userRouer.post("/signup",signup);
userRouer.post("/login",login);
userRouer.put("/update-profile",protectRoute, updateProfile);
userRouer.get("/check-auth",protectRoute,checkAuth);

export default userRouer;
