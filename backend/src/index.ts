import express, { Response, Request } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute";
import messageRoutes from "./routes/messageRoute";
import dotenv from "dotenv";
import { app, server } from "./socket/socket";
dotenv.config();

const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
  console.log(`Serving running on: ${PORT}`);
});
