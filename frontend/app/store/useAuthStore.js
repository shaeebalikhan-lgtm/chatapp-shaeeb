"use client";

import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const BASE_URL = "http://localhost:5000";

/*
=========================================================
SOCKET SINGLETON

This exists outside Zustand so even if React/Next.js
renders a component multiple times, only ONE socket
instance is created in this browser tab.
=========================================================
*/

let socketInstance = null;
let socketUserId = null;

export const useAuthStore = create((set, get) => ({
  // ============================================
  // AUTH STATE
  // ============================================

  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // ============================================
  // SOCKET STATE
  // ============================================

  onlineUsers: [],
  socket: null,

  // ============================================
  // CHECK AUTH
  // ============================================

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(
        "/auth/api/check"
      );

      console.log(
        "Authenticated user:",
        res.data
      );

      set({
        authUser: res.data,
      });

      /*
        IMPORTANT:

        Do NOT use setTimeout here.

        Socket connection happens synchronously after
        authUser is stored.
      */
      get().connectSocket(res.data);

    } catch (error) {
      console.log(
        "Error in checkAuth:",
        error
      );

      /*
        If auth failed, make sure any existing socket
        is also disconnected.
      */
      get().disconnectSocket();

      set({
        authUser: null,
        onlineUsers: [],
      });

    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  // ============================================
  // SIGNUP
  // ============================================

  signup: async (data) => {
    set({
      isSigningUp: true,
    });

    try {
      const res = await axiosInstance.post(
        "/auth/api/signup",
        data
      );

      console.log(
        "Signup user:",
        res.data
      );

      set({
        authUser: res.data,
      });

      toast.success(
        "Account created successfully"
      );

      /*
        Pass the user directly.
        This avoids waiting for another Zustand read.
      */
      get().connectSocket(res.data);

      return true;

    } catch (error) {
      console.log(
        "Signup error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Signup failed"
      );

      return false;

    } finally {
      set({
        isSigningUp: false,
      });
    }
  },

  // ============================================
  // LOGIN
  // ============================================

  login: async (data) => {
    set({
      isLoggingIn: true,
    });

    try {
      const res = await axiosInstance.post(
        "/auth/api/login",
        data
      );

      console.log(
        "Login user:",
        res.data
      );

      /*
        If somehow another socket exists from an
        earlier session, remove it first.
      */
      const currentSocketUserId =
        socketUserId;

      const newUserId =
        res.data?._id
          ? String(res.data._id)
          : null;

      if (
        currentSocketUserId &&
        newUserId &&
        currentSocketUserId !== newUserId
      ) {
        console.log(
          "Different user detected. Disconnecting old socket."
        );

        get().disconnectSocket();
      }

      set({
        authUser: res.data,
      });

      toast.success(
        "Logged in successfully"
      );

      get().connectSocket(res.data);

      return true;

    } catch (error) {
      console.log(
        "Login error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );

      return false;

    } finally {
      set({
        isLoggingIn: false,
      });
    }
  },

  // ============================================
  // LOGOUT
  // ============================================
logout: async () => {
  const socket = socketInstance;

  try {
    // Tell server to remove ALL sockets for this user
    if (socket?.connected) {
      socket.emit("logout");
    }

    // Clear local socket immediately
    get().disconnectSocket();

    // Logout HTTP session
    await axiosInstance.post("/auth/api/logout");

    set({
      authUser: null,
      onlineUsers: [],
      socket: null,
    });

    toast.success("Logged out successfully");
  } catch (error) {
    console.log("Logout error:", error);

    get().disconnectSocket();

    set({
      authUser: null,
      onlineUsers: [],
      socket: null,
    });

    toast.error(
      error.response?.data?.message ||
        "Logout failed"
    );
  }
},

  // ============================================
  // UPDATE PROFILE
  // ============================================

  updateProfile: async (data) => {
    set({
      isUpdatingProfile: true,
    });

    try {
      const res =
        await axiosInstance.put(
          "/auth/api/update-profile",
          data
        );

      set({
        authUser: res.data,
      });

      toast.success(
        "Profile updated successfully"
      );

      return true;

    } catch (error) {
      console.log(
        "Error in update profile:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
      );

      return false;

    } finally {
      set({
        isUpdatingProfile: false,
      });
    }
  },

  // ============================================
  // CONNECT SOCKET
  // ============================================

  connectSocket: (userFromAuth = null) => {
    /*
      Prefer explicitly supplied user.
      Otherwise use Zustand authUser.
    */
    const authUser =
      userFromAuth || get().authUser;

    if (!authUser?._id) {
      console.log(
        "Socket connection skipped: authUser not available"
      );

      return;
    }

    const userId =
      String(authUser._id);

    /*
    =====================================================
    CASE 1
    Same socket already exists for same user.
    =====================================================
    */

    if (
      socketInstance &&
      socketUserId === userId
    ) {
      console.log(
        "Socket already exists:",
        socketInstance.id,
        "connected:",
        socketInstance.connected,
        "userId:",
        userId
      );

      /*
        Make sure Zustand points to the same socket.
      */
      if (
        get().socket !== socketInstance
      ) {
        set({
          socket: socketInstance,
        });
      }

      return;
    }

    /*
    =====================================================
    CASE 2
    A socket exists but belongs to another user.
    =====================================================
    */

    if (
      socketInstance &&
      socketUserId !== userId
    ) {
      console.log(
        "Removing socket belonging to old user:",
        socketUserId
      );

      socketInstance.removeAllListeners();
      socketInstance.disconnect();

      socketInstance = null;
      socketUserId = null;

      set({
        socket: null,
      });
    }

    /*
    =====================================================
    CASE 3
    Create the ONLY socket.
    =====================================================
    */

    console.log(
      "================================"
    );

    console.log(
      "CREATING NEW SOCKET"
    );

    console.log(
      "User ID:",
      userId
    );

    console.log(
      "================================"
    );

    const newSocket = io(
      BASE_URL,
      {
        query: {
          userId,
        },

        withCredentials: true,

        /*
          Explicitly enabled.
        */
        autoConnect: true,
      }
    );

    /*
      Store globally.
    */
    socketInstance = newSocket;
    socketUserId = userId;

    /*
      Store in Zustand.
    */
    set({
      socket: newSocket,
    });

    // ============================================
    // CONNECT
    // ============================================

    newSocket.on(
      "connect",
      () => {
        console.log(
          "================================"
        );

        console.log(
          "SOCKET CONNECTED"
        );

        console.log(
          "Socket ID:",
          newSocket.id
        );

        console.log(
          "User ID:",
          userId
        );

        console.log(
          "================================"
        );
      }
    );

    // ============================================
    // ONLINE USERS
    // ============================================

    newSocket.on(
      "getOnlineUsers",
      (userIds) => {
        console.log(
          "Online users received:",
          userIds
        );

        const normalizedIds =
          Array.isArray(userIds)
            ? userIds.map(String)
            : [];

        set({
          onlineUsers:
            normalizedIds,
        });
      }
    );

    // ============================================
    // DISCONNECT
    // ============================================

    newSocket.on(
      "disconnect",
      (reason) => {
        console.log(
          "================================"
        );

        console.log(
          "SOCKET DISCONNECTED"
        );

        console.log(
          "Socket ID:",
          newSocket.id
        );

        console.log(
          "User ID:",
          userId
        );

        console.log(
          "Reason:",
          reason
        );

        console.log(
          "================================"
        );
      }
    );

    // ============================================
    // CONNECTION ERROR
    // ============================================

    newSocket.on(
      "connect_error",
      (error) => {
        console.error(
          "Socket connection error:",
          error.message
        );
      }
    );
  },

  // ============================================
  // DISCONNECT SOCKET
  // ============================================

  disconnectSocket: () => {
    const socket =
      socketInstance ||
      get().socket;

    if (!socket) {
      console.log(
        "No socket to disconnect"
      );

      set({
        socket: null,
        onlineUsers: [],
      });

      socketInstance = null;
      socketUserId = null;

      return;
    }

    console.log(
      "Disconnecting socket:",
      socket.id
    );

    /*
      Remove all frontend listeners.
    */
    socket.removeAllListeners();

    /*
      Disconnect this socket.
    */
    socket.disconnect();

    /*
      Clear singleton.
    */
    socketInstance = null;
    socketUserId = null;

    /*
      Clear Zustand.
    */
    set({
      socket: null,
      onlineUsers: [],
    });
  },
}));