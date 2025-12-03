import IMAGES from "@/utils/images.js";
import { api } from "../../api/axios";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";

const ChatInterface = () => {
 
  // const messages = [
  //   {
  //     id: 1,
  //     sender: "Dinesh",
  //     profileImg: IMAGES.profile,
  //     text: "Lorem ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been",
  //     isNew: true,
  //   },
  //   {
  //     id: 2,
  //     sender: "Dinesh",
  //     profileImg: IMAGES.profile,
  //     text: "Lorem ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been",
  //     isNew: true,
  //   },
  //   {
  //     id: 3,
  //     sender: "Dinesh",
  //     profileImg: IMAGES.profile,
  //     text: "Lorem ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since/Lorem Ipsum Has Been",
  //     isNew: false,
  //   },
  // ];

   const [messages, setMessages] = useState([]);
     // ==========================
  //   FETCH NOTIFICATIONS
  // ==========================
  
  
  
  const fetchNotifications = async () => {
    try {
      const response = await api.get("notifications");
      setMessages(response.data?.data); // Make sure backend returns array
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  // ==========================
  //   MARK AS READ
  // ==========================
  const handleRead = async (id) => {
    try {
      await api.post(`notification/read/${id}`);

      // Update UI → isNew = false
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, isNew: false } : msg
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

   // ==========================
  //    DELETE NOTIFICATION
  // ==========================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      // Remove deleted item from UI
      setMessages((prev) => prev.filter((msg) => msg.id !== id));

      // Optional toast
      // toast.success("Notification deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      // toast.error("Failed to delete");
    }
  };


  return (
   <div className="w-full">
      <div className="max-w-4xl mx-auto py-8">
        {messages.map((message) => (
          <div
            key={message.id}
             onClick={() => handleRead(message.id)}   // 👈 CLICK = READ API
            className="p-4 border-b border-gray-100 flex justify-between flex-wrap md:flex-nowrap gap-2"
          >
            {/* LEFT SIDE */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <img
                  src={message.profileImg || IMAGES.profile}
                  alt={message.sender}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              <div className="flex-grow">
                <div className="flex items-center mb-1">
                  <h3 className="font-medium mr-2">{message.title}</h3>

                  {message.status && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                     {message.status}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 text-sm">{message.message}</p>
              </div>
            </div>

            {/* DELETE BUTTON */}
            <button
              // onClick={(e) => {
              //   e.stopPropagation(); // 👈 Prevent read API on delete click
              //   handleDelete(message.id);
              // }}
              className="flex  items-center gap-2 cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium bg-gray-200 p-2 rounded-[10px] h-[fit-content] "
            >
              <Delete />Delete
            </button>
          </div>
        ))}

        {/* No Data */}
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No notifications found
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
