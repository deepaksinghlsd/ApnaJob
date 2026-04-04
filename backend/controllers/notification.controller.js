import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('job', 'title company')
            .limit(20);

        return res.status(200).json({
            notifications,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        return res.status(200).json({
            message: "Notification marked as read",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const clearNotifications = async (req, res) => {
    try {
        const userId = req.id;
        await Notification.deleteMany({ user: userId });
        return res.status(200).json({
            message: "Notifications cleared",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
