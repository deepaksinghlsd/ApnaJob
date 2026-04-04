import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markNotificationAsRead: (state, action) => {
            const index = state.notifications.findIndex(n => n._id === action.payload);
            if (index !== -1 && !state.notifications[index].isRead) {
                state.notifications[index].isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    }
});

export const { setNotifications, addNotification, markNotificationAsRead, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
