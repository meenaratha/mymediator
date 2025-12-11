// ============================================
// 1. notificationSlice.js (Redux Slice)
// ============================================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/axios";

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("notifications");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notifications");
    }
  }
);

// Async thunk to mark as read
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`notification/read/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark as read");
    }
  }
);

// Async thunk to mark as unread
export const markAsUnread = createAsyncThunk(
  "notifications/markAsUnread",
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`notification/unread/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark as unread");
    }
  }
);

// Async thunk to delete notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete notification");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    messages: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Add a new notification (for Firebase real-time updates)
    addNotification: (state, action) => {
      state.messages.unshift(action.payload);
      if (action.payload.is_read === 0) {
        state.unreadCount += 1;
      }
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data || [];
        state.unreadCount = action.payload.unread_count || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.messages.find((msg) => msg.id === id);
        if (notification && notification.is_read === 0) {
          notification.is_read = 1;
          notification.status = "read";
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark as Unread
      .addCase(markAsUnread.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.messages.find((msg) => msg.id === id);
        if (notification && notification.is_read === 1) {
          notification.is_read = 0;
          notification.status = "new";
          state.unreadCount += 1;
        }
      })

      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.messages.find((msg) => msg.id === id);
        if (notification && notification.is_read === 0) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.messages = state.messages.filter((msg) => msg.id !== id);
      });
  },
});

export const { addNotification, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;