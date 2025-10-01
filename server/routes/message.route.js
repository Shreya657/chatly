
import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { chatWithAi, clearChat,  getMessages, getUsersForSidebar, marksMessageAsSeen, sendMessage } from "../controllers/message.controller.js";

const messageRouter=express.Router();

messageRouter.get("/users",protectRoute,getUsersForSidebar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id", protectRoute, marksMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);
messageRouter.delete("/clear/:id",protectRoute,clearChat)
messageRouter.post("/ai",protectRoute,chatWithAi)

export default messageRouter;