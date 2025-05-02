"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
router.get("/conversations", protectRoute_1.default, messageController_1.getUsersForSidebar);
router.get("/:id", protectRoute_1.default, messageController_1.getMessage);
router.post("/send/:id", protectRoute_1.default, messageController_1.sendMessage);
exports.default = router;
