
import { axiosInstance } from "../lib/axios";

export const chatUsers = async () => {
  try {
    const response = await axiosInstance.get("/message/api/users");

    return response.data;
  } catch (error) {
    console.error("Error fetching chat users:", error);

    throw error;
  }
};

export const getChatMessages = async (id) => {
  const response = await axiosInstance.get(`/message/api/${id}`);
  return response.data;
};

export const sendChatMessage = async (id,message,image = null) => {
  
  try {
    const formData = new FormData();

    if (message?.trim()) {
      formData.append("text", message);
    }

    if (image) {
      formData.append("image", image);
    }

    const response = await axiosInstance.post(
      `/message/api/send/${id}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};