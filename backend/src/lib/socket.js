import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

/*
=========================================================
USER SOCKET MAP

userId -> Set(socketId)

Example:

user1 -> Set([
  socket1,
  socket2
])

user2 -> Set([
  socket3
])
=========================================================
*/

const userSocketMap = new Map();

// ============================================
// GET ONE RECEIVER SOCKET
// ============================================

export function getReceiverSocketId(
  userId
) {
  const sockets =
    userSocketMap.get(
      String(userId)
    );

  if (
    !sockets ||
    sockets.size === 0
  ) {
    return undefined;
  }

  return [...sockets][0];
}

// ============================================
// GET ONLINE USERS
// ============================================

function getOnlineUsers() {
  return [
    ...userSocketMap.keys(),
  ];
}

// ============================================
// EMIT ONLINE USERS
// ============================================

function emitOnlineUsers() {
  const onlineUsers =
    getOnlineUsers();

  console.log(
    "Current online users:",
    onlineUsers
  );

  io.emit(
    "getOnlineUsers",
    onlineUsers
  );
}

// ============================================
// SOCKET CONNECTION
// ============================================

io.on(
  "connection",
  (socket) => {
    console.log(
      "\n=============================="
    );

    console.log(
      "User connected:",
      socket.id
    );

    // ============================================
    // GET USER ID
    // ============================================

    const userId =
      socket.handshake.query.userId;

    console.log(
      "Socket userId:",
      userId
    );

    // ============================================
    // NO USER ID
    // ============================================

    if (!userId) {
      console.log(
        "WARNING: Socket connected WITHOUT userId:",
        socket.id
      );

      socket.disconnect(true);

      return;
    }

    const normalizedUserId =
      String(userId);

    /*
      Save userId directly on socket.
    */
    socket.userId =
      normalizedUserId;

    // ============================================
    // GET USER SOCKETS
    // ============================================

    let sockets =
      userSocketMap.get(
        normalizedUserId
      );

    if (!sockets) {
      sockets = new Set();

      userSocketMap.set(
        normalizedUserId,
        sockets
      );
    }

    // ============================================
    // ADD SOCKET
    // ============================================

    sockets.add(
      socket.id
    );

    console.log(
      `User ${normalizedUserId} is ONLINE`
    );

    console.log(
      `Sockets for user ${normalizedUserId}:`,
      [...sockets]
    );

    emitOnlineUsers();

    // ============================================
    // LOGOUT
    // ============================================

    socket.on(
      "logout",
      () => {
        const logoutUserId =
          socket.userId;

        console.log(
          "\n================================"
        );

        console.log(
          "LOGOUT REQUEST RECEIVED"
        );

        console.log(
          "User:",
          logoutUserId
        );

        console.log(
          "================================"
        );

        if (!logoutUserId) {
          return;
        }

        const userSockets =
          userSocketMap.get(
            logoutUserId
          );

        if (
          !userSockets ||
          userSockets.size === 0
        ) {
          console.log(
            "No active sockets for:",
            logoutUserId
          );

          emitOnlineUsers();

          return;
        }

        /*
        =================================================
        Disconnect EVERY socket belonging to this user.
        =================================================
        */

        const socketsToDisconnect =
          [...userSockets];

        console.log(
          "Disconnecting ALL sockets:",
          socketsToDisconnect
        );

        for (
          const socketId
          of socketsToDisconnect
        ) {
          const userSocket =
            io.sockets.sockets.get(
              socketId
            );

          if (userSocket) {
            userSocket.disconnect(
              true
            );
          }
        }

        /*
          disconnect event will remove sockets
          from userSocketMap.
        */
      }
    );

    // ============================================
    // DISCONNECT
    // ============================================

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "\n=============================="
        );

        console.log(
          "User disconnected:",
          socket.id
        );

        console.log(
          "Reason:",
          reason
        );

        const disconnectedUserId =
          socket.userId;

        console.log(
          "Disconnect userId:",
          disconnectedUserId
        );

        if (
          !disconnectedUserId
        ) {
          console.log(
            "No userId attached to socket:",
            socket.id
          );

          return;
        }

        // ============================================
        // FIND USER SOCKETS
        // ============================================

        const userSockets =
          userSocketMap.get(
            disconnectedUserId
          );

        if (!userSockets) {
          console.log(
            "No socket record found for user:",
            disconnectedUserId
          );

          emitOnlineUsers();

          return;
        }

        // ============================================
        // REMOVE THIS SOCKET ONLY
        // ============================================

        userSockets.delete(
          socket.id
        );

        console.log(
          `Removed socket ${socket.id} from user ${disconnectedUserId}`
        );

        // ============================================
        // USER OFFLINE
        // ============================================

        if (
          userSockets.size === 0
        ) {
          userSocketMap.delete(
            disconnectedUserId
          );

          console.log(
            `User ${disconnectedUserId} is now OFFLINE`
          );
        } else {
          console.log(
            `User ${disconnectedUserId} still has active sockets:`,
            [...userSockets]
          );
        }

        // ============================================
        // UPDATE ALL CLIENTS
        // ============================================

        emitOnlineUsers();
      }
    );
  }
);

export {
  app,
  server,
  io,
};