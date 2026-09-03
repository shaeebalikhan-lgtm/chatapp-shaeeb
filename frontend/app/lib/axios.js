import axios from 'axios';

// export const axiosInstance = axios.create(
//     {
//         baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://chatapp-backend-96a2.onrender.com",
//         withCredentials: true,
//     }
// )

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});