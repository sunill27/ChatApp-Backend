import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getMessages,
  getSidebarUsers,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getSidebarUsers);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
export default router;
