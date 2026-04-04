import express from "express";
import { getNotifications, markAsRead, clearNotifications } from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/get").get(isAuthenticated, getNotifications);
router.route("/mark-read/:id").post(isAuthenticated, markAsRead);
router.route("/clear").delete(isAuthenticated, clearNotifications);

export default router;
