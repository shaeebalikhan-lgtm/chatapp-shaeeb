import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
//CORS = Cross-Origin Resource Sharing.
//cors = allows frontend ↔ backend communication.
//Allow other websites/apps to talk to my backend.

import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";



dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use("/auth/api", authRoute);
app.use("/message/api", messageRoute);

server.listen(PORT, async () => {
  try {
    await connectDB();

    console.log(`Server running on PORT: ${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
});