"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersForSidebar = exports.getMessage = exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const socket_1 = require("../socket/socket");
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = await prisma_1.default.conversation.findFirst({
            where: { participantIds: { hasEvery: [senderId, receiverId] } },
        });
        if (!conversation) {
            conversation = await prisma_1.default.conversation.create({
                data: { participantIds: { set: [senderId, receiverId] } },
            });
        }
        const newMessage = await prisma_1.default.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = await prisma_1.default.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        const err = error;
        console.log(`Error`, err.message);
        res.status(500).json({ error: `Internal server error` });
    }
};
exports.sendMessage = sendMessage;
const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma_1.default.conversation.findFirst({
            where: {
                participantIds: { hasEvery: [senderId, userToChatId] },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            return res.status(200).json([]);
        }
        return res.status(200).json(conversation.messages);
    }
    catch (error) {
        const err = error;
        console.log(`Error`, err.message);
        res.status(500).json({ error: `Internal server error` });
    }
};
exports.getMessage = getMessage;
const getUsersForSidebar = async (req, res) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma_1.default.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullname: true,
                profilePic: true,
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        const err = error;
        console.log(`Error`, err.message);
        res.status(500).json({ error: `Internal server error` });
    }
};
exports.getUsersForSidebar = getUsersForSidebar;
