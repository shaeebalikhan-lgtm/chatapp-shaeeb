
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

// ============================================
// GET CHAT USERS
// ============================================

export const chatUsers = async () => {
  try {
    const response = await axiosInstance.get(
      "/message/api/users"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching chat users:",
      error
    );

    throw error;
  }
};

// ============================================
// GET CHAT MESSAGES
// ============================================

export const getChatMessages = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/message/api/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching chat messages:",
      error
    );

    throw error;
  }
};

// ============================================
// SEND MESSAGE
// ============================================

export const sendChatMessage = async (
  id,
  message,
  image = null
) => {
  try {
    const formData = new FormData();

    if (message?.trim()) {
      formData.append(
        "text",
        message.trim()
      );
    }

    if (image) {
      formData.append(
        "image",
        image
      );
    }

    const response =
      await axiosInstance.post(
        `/message/api/send/${id}`,
        formData
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error
    );

    throw error;
  }
};

// ============================================
// SUBSCRIBE TO NEW MESSAGES
// ============================================
export const subsCribeToMessage = (selectedUser, callback) => {
  if (!selectedUser?._id) return;

  const socket = useAuthStore.getState().socket;

  if (!socket) {
    console.warn("Socket not available");
    return;
  }

  console.log("Socket connected:", socket.connected);
  console.log("Listening for newMessage");

  const handleNewMessage = (newMessage) => {
    console.log("🔥 SOCKET MESSAGE RECEIVED:", newMessage);

    const isFromSelectedUser =
      String(newMessage.senderId) === String(selectedUser._id);

    console.log({
      senderId: newMessage.senderId,
      selectedUserId: selectedUser._id,
      isFromSelectedUser,
    });

    if (!isFromSelectedUser) return;

    callback?.(newMessage);
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
};
// ============================================
// UNSUBSCRIBE
// ============================================

export const UnsubsCribeFromMessage = () => {
  const socket =
    useAuthStore.getState().socket;

  if (!socket) {
    return;
  }

  socket.off("newMessage");

  console.log(
    "Unsubscribed from new messages"
  );
};
