import express, { RequestHandler } from "express";
import protectRoute from "../middleware/protectRoute";
import {
  sendMessage,
  getMessage,
  getUsersForSidebar,
} from "../controllers/messageController";

const router = express.Router();

router.get(
  "/conversations",
  protectRoute as RequestHandler,
  getUsersForSidebar
);
router.get(
  "/:id",
  protectRoute as RequestHandler,
  getMessage as RequestHandler
);
router.post("/send/:id", protectRoute as RequestHandler, sendMessage);

export default router;
