import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma";

interface DecodedToken extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token " });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, fullname: true, profilePic: true },
    });

    if (!user) {
      return res.status(400).json({ error: " user not found" });
    }

    req.user = user;

    next();
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log(`Error in signup`, err.message);
    res.status(500).json();
  }
};

export default protectRoute;
