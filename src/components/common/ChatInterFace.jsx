// ============================================
// 3. ChatInterface.jsx (Updated Component)
// ============================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Delete, MailOutline, Drafts } from "@mui/icons-material";
import { messaging } from "../../firebase";
import { onMessage } from "firebase/messaging";
import {
  fetchNotifications,
  markAsRead,
  markAsUnread,
  deleteNotification,
  addNotification,
} from "../../redux/notificationSlice";

const ChatInterface = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const { messages, unreadCount, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    // Initial load
    dispatch(fetchNotifications());

    // Firebase foreground listener
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔥 Foreground FCM:", payload);

      // AUTO REFRESH API
      dispatch(fetchNotifications());
      
      // OR add notification directly to Redux without API call:
      // const newNotification = {
      //   id: Date.now(),
      //   title: payload.notification.title,
      //   message: payload.notification.body,
      //   is_read: 0,
      //   status: "new",
      //   created_at: new Date().toISOString(),
      // };
      // dispatch(addNotification(newNotification));
    });

    // Refresh when user returns to tab
    const handleFocus = () => dispatch(fetchNotifications());
    window.addEventListener("focus", handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch]);

  // ==========================
  //   TOGGLE READ/UNREAD
  // ==========================
  const toggleReadStatus = (id, currentStatus) => {
    if (currentStatus === 1) {
      dispatch(markAsUnread(id));
    } else {
      dispatch(markAsRead(id));
    }
  };

  // ==========================
  //    DELETE NOTIFICATION
  // ==========================
  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 mb-2 rounded-lg border flex justify-between items-start gap-4 transition-colors ${
              message.is_read === 0
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-gray-200"
            }`}
          >
            {/* LEFT SIDE */}
            <div className="flex-grow">
              <div className="flex items-center mb-2">
                <h3 className="font-semibold text-lg mr-2">{message.title}</h3>
                {message.status === "new" && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm mb-2">{message.message}</p>
              <p className="text-gray-400 text-xs">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>

            {/* RIGHT SIDE - ACTION BUTTONS */}
            <div className="flex gap-2 flex-shrink-0">
              {/* READ/UNREAD TOGGLE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReadStatus(message.id, message.is_read);
                }}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title={message.is_read === 0 ? "Mark as read" : "Mark as unread"}
              >
                {message.is_read === 0 ? (
                  <MailOutline className="text-blue-600" />
                ) : (
                  <Drafts className="text-gray-600" />
                )}
              </button>

              {/* DELETE BUTTON */}
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(message.id);
                }}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete notification"
              >
                <Delete className="text-red-500" />
              </button> */}
            </div>
          </div>
        ))}

        {/* No Data */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;