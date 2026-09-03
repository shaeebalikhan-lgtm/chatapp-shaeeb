
"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./sidebar";
import MessageBox from "./messageBox";
import "./chat.css";

import {getChatMessages,sendChatMessage,subsCribeToMessage,} from "@/app/store/messageStore.js";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Image state
  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const fileInputRef =
    useRef(null);

  // =========================
  // Get Messages
  // =========================

  useEffect(() => {
    if (!selectedUser?._id) {
      setMessages([]);
      return;
    }

    let unsubscribe;

    const getMessages = async () => {
      try {
        setLoading(true);

        const data =
          await getChatMessages(
            selectedUser._id
          );

        setMessages(data || []);

        // Subscribe AFTER messages are loaded
        unsubscribe =
          subsCribeToMessage(
            selectedUser,
            (newMessage) => {
              setMessages((prev) => [
                ...prev,
                newMessage,
              ]);
            }
          );

      } catch (error) {
        console.error(
          "Failed to load messages:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    getMessages();

    // Cleanup only when selected user changes
    // or component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedUser]);

  // =========================
  // Select Image
  // =========================

  const handleUpload = () => {
    if (!selectedUser?._id) {
      console.error(
        "No user selected"
      );

      return;
    }

    fileInputRef.current?.click();
  };

  // =========================
  // File Change
  // =========================

  const handleFileChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(
      previewUrl
    );

    e.target.value = "";
  };

  // =========================
  // Remove Image
  // =========================

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(null);
    setImagePreview(null);
  };

  // =========================
  // Send Message
  // =========================

  const handleSendMessage = async (
    e
  ) => {
    e.preventDefault();

    if (!selectedUser?._id) {
      console.error(
        "No user selected"
      );

      return;
    }

    if (
      !message.trim() &&
      !selectedImage
    ) {
      return;
    }

    try {
      setLoading(true);

      const newMessage =
        await sendChatMessage(
          selectedUser._id,
          message.trim(),
          selectedImage
        );

      // Add sent message locally
      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      setMessage("");

      removeImage();

    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="chat-page">
      <Sidebar
        onSelectUser={
          setSelectedUser
        }
        selectedUser={
          selectedUser
        }
      />

      <section className="chat-window">
        {!selectedUser ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              💬
            </div>

            <h1>
              Welcome to ChatApp
            </h1>

            <p>
              Select a conversation
              from the sidebar to
              start chatting.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}

            <div className="chat-header">
              <div className="user-avatar">
                {selectedUser.fullName
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {selectedUser.fullName}
              </h2>
            </div>

            {/* Messages */}

            <div className="messages-container">
              {loading ? (
                <p>
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <p>
                  No messages yet.
                </p>
              ) : (
                messages.map(
                  (msg) => (
                    <MessageBox
                      key={msg._id}
                      message={msg}
                      isCurrentUser={
                        String(
                          msg.senderId
                        ) !==
                        String(
                          selectedUser._id
                        )
                      }
                    />
                  )
                )
              )}
            </div>

            {/* Message Form */}

            <form
              className="message-form"
              onSubmit={
                handleSendMessage
              }
            >
              <button
                type="button"
                onClick={
                  handleUpload
                }
              >
                +
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleFileChange
                }
                style={{
                  display: "none",
                }}
              />

              <div className="message-input-wrapper">
                {imagePreview && (
                  <div className="image-preview">
                    <img
                      src={
                        imagePreview
                      }
                      alt="Selected"
                    />

                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                      className="remove-image"
                    >
                      ×
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Type a message..."
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  (!message.trim() &&
                    !selectedImage)
                }
              >
                Send
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
