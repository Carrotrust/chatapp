import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;

    if (!fullname || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all details " });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords does not match" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, 10);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
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
      generateToken(newUser.id, res);

      return res.status(201).json({
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log(`Error in signup`, err.message);
    res.status(500).json();
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect Password" });
    }

    generateToken(user.id, res);
    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log(`Error in login`, err.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log(`Error in login`, err.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    const err = error as { message?: string };
    console.log(`Error`, err.message);
    res.status(500).json({ error: `Internal server error` });
  }
};
