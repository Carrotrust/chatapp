"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../db/prisma"));
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token " });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token" });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullname: true, profilePic: true },
        });
        if (!user) {
            return res.status(400).json({ error: " user not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        const err = error;
        console.log(`Error in signup`, err.message);
        res.status(500).json();
    }
};
exports.default = protectRoute;
