import express from "express";
import {
  getMessages,
  markMessageAsSeen,
  getUserForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
const messagesRouter = express.Router();

messagesRouter.get("/users", protectRoute, getUserForSidebar);
messagesRouter.get("/:id", protectRoute, getMessages);
messagesRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messagesRouter.post("/send/:id", protectRoute, sendMessage);

export default messagesRouter;
