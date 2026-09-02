import axios from 'axios';

export const axiosInstance = axios.create(
    {
        baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://chatapp-backend-96a2.onrender.com",
        withCredentials: true,
    }
)