"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill in all details " });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords does not match" });
        }
        const user = await prisma_1.default.user.findUnique({ where: { username } });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }
        // const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = await prisma_1.default.user.create({
            data: {
                fullname,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            },
        });
        if (newUser) {
            // generate token
            (0, generateToken_1.default)(newUser.id, res);
            return res.status(201).json({
                id: newUser.id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }
    }
    catch (error) {
        const err = error;
        console.log(`Error in signup`, err.message);
        res.status(500).json();
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect Password" });
        }
        (0, generateToken_1.default)(user.id, res);
        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        const err = error;
        console.log(`Error in login`, err.message);
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        const err = error;
        console.log(`Error in login`, err.message);
        res.status(500).json({ error: "Internal server error " });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        const err = error;
        console.log(`Error`, err.message);
        res.status(500).json({ error: `Internal server error` });
    }
};
exports.getMe = getMe;
