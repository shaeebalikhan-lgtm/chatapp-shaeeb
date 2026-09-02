
"use client";

import { useEffect, useState } from "react";
import { chatUsers } from "@/app/store/messageStore.js";
import "./sidebar.css";
import { useAuthStore } from "../../store/useAuthStore";

export default function Sidebar({ onSelectUser, selectedUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnline, setShowOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { onlineUsers, authUser } = useAuthStore();

  console.log("users:", users);
  console.log("onlineUsers:", onlineUsers);
  console.log("authUser:", authUser);

  /* =========================================================
     LOAD USERS
  ========================================================= */

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await chatUsers();

        console.log("Chat users received:", data);

        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  /* =========================================================
     NORMALIZED ONLINE USERS
  ========================================================= */

  const normalizedOnlineUsers = Array.isArray(onlineUsers)
    ? onlineUsers.map((id) => String(id))
    : [];

  /* =========================================================
     OTHER ONLINE USERS
     
     Excludes the currently logged-in user from the count.
  ========================================================= */

  const otherOnlineUsers = normalizedOnlineUsers.filter(
    (id) => id !== String(authUser?._id)
  );

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = users.filter((user) => {
    const userId = String(user?._id);

    const matchesOnline =
      !showOnline ||
      normalizedOnlineUsers.includes(userId);

    const matchesSearch = user?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesOnline && matchesSearch;
  });

  return (
    <aside className="chat-sidebar">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="chat-sidebar__header">
        <div className="chat-sidebar__title-wrapper">

          <div>
            <h2 className="chat-sidebar__title">
              Messages
            </h2>

            <p className="chat-sidebar__subtitle">
              Stay connected with your friends
            </p>
          </div>

          <span className="chat-sidebar__count">
            {users.length}
          </span>

        </div>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="chat-sidebar__search-wrapper">

        <div className="chat-sidebar__search">

          <svg
            className="chat-sidebar__search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="text"
            className="chat-sidebar__search-input"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          {searchQuery && (
            <button
              type="button"
              className="chat-sidebar__search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          ONLINE FILTER
      ===================================================== */}

      <div className="chat-sidebar__filters">

        <button
          type="button"
          className={`chat-sidebar__online-filter ${
            showOnline
              ? "chat-sidebar__online-filter--active"
              : ""
          }`}
          onClick={() =>
            setShowOnline((prev) => !prev)
          }
        >

          <span className="chat-sidebar__online-indicator"></span>

          <span>Online</span>

          <span className="chat-sidebar__online-count">
            {otherOnlineUsers.length}
          </span>

        </button>

        {showOnline && (
          <span className="chat-sidebar__filter-label">
            Showing online
          </span>
        )}

      </div>

      {/* =====================================================
          USER LIST
      ===================================================== */}

      <div className="chat-sidebar__users">

        {/* LOADING */}

        {loading ? (

          <div className="chat-sidebar__loading">

            <div className="chat-sidebar__spinner"></div>

            <span>
              Loading people...
            </span>

          </div>

        ) : filteredUsers.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="chat-sidebar__empty">

            <div className="chat-sidebar__empty-icon">
              {searchQuery ? "⌕" : "◌"}
            </div>

            <h3>
              {searchQuery
                ? "No people found"
                : showOnline
                ? "No one is online"
                : "No users found"}
            </h3>

            <p>
              {searchQuery
                ? "Try a different name."
                : showOnline
                ? "Your friends are currently offline."
                : "There are no users to show."}
            </p>

          </div>

        ) : (

          /* =================================================
             USERS
          ================================================= */

          filteredUsers.map((user) => {

            const userId = String(user?._id);

            const isOnline =
              normalizedOnlineUsers.includes(userId);

            const isSelected =
              String(selectedUser?._id) === userId;

            return (

              <button
                key={user?._id}
                type="button"
                className={`chat-user-card ${
                  isSelected
                    ? "chat-user-card--selected"
                    : ""
                }`}
                onClick={() =>
                  onSelectUser(user)
                }
              >

                {/* =========================================
                    AVATAR
                ========================================= */}

                <div className="chat-user-card__avatar-wrapper">

                  <div className="chat-user-card__avatar">

                    {user?.fullName
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                  {isOnline && (
                    <span className="chat-user-card__status"></span>
                  )}

                </div>

                {/* =========================================
                    USER INFO
                ========================================= */}

                <div className="chat-user-card__content">

                  <div className="chat-user-card__top">

                    <h3 className="chat-user-card__name">
                      {user?.fullName}
                    </h3>

                    {isOnline && (
                      <span className="chat-user-card__online-text">
                        Online
                      </span>
                    )}

                  </div>

                  <p className="chat-user-card__message">

                    {isOnline
                      ? "Available to chat"
                      : "Click to start chatting"}

                  </p>

                </div>

                {/* =========================================
                    ARROW
                ========================================= */}

                <span className="chat-user-card__arrow">
                  ›
                </span>

              </button>

            );
          })

        )}

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      {!loading && users.length > 0 && (

        <div className="chat-sidebar__footer">

          <span>
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1
              ? "person"
              : "people"}
          </span>

          {showOnline && (

            <span className="chat-sidebar__footer-online">

              <span className="chat-sidebar__footer-dot"></span>

              Online now

            </span>

          )}

        </div>

      )}

    </aside>
  );
}
