import express from "express";
import {
  getMessages,
  markMessageAsSeen,
  getUserForSidebar,
} from "../controllers/message.Controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
const messagesRouter = express.Router();

messagesRouter.get("/users", protectRoute, getUserForSidebar);
messagesRouter.get("/:id", protectRoute, getMessages);
messagesRouter.put("mark/:id", protectRoute, markMessageAsSeen);

export default messagesRouter;
