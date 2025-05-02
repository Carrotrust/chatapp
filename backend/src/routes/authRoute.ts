import express, { RequestHandler } from "express";
import { signup, login, logout, getMe } from "../controllers/authController";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.get("/me", protectRoute as RequestHandler, getMe as RequestHandler);

router.post("/signup", signup as RequestHandler);

router.post("/login", login as RequestHandler);

router.post("/logout", logout as RequestHandler);

export default router;
