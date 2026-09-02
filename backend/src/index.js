import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

const PORT = Number(process.env.PORT) || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());
app.use(cookieParser());

// ============================================
// CORS
// ============================================

const allowedOrigins = [
  "http://localhost:3000",
  "https://chatapp-shaeeb.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);

console.log("CORS ALLOWED ORIGINS:", allowedOrigins);

// ============================================
// HEALTH CHECK
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ChatApp backend is running",
  });
});

// ============================================
// ROUTES
// ============================================

app.use("/auth/api", authRoute);
app.use("/message/api", messageRoute);

// ============================================
// START SERVER
// ============================================

server.listen(PORT, "0.0.0.0", async () => {
  try {
    await connectDB();

    console.log(`Server running on PORT: ${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
});