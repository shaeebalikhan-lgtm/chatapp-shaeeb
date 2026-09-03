
"use client";

import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          boxSizing: "border-box",
          background: "#f8fafc",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            maxWidth: "700px",
            color: "#ef4444",
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          ! Currently Working on Profile Page. Please come back later!
        </h1>
      </div>

      <button
        onClick={() => router.back()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          padding: "14px 20px",
          border: "none",
          background: "transparent",
          color: "#111827",
          fontSize: "1.1rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "1.4rem" }}>←</span>
        Back
      </button>
    </>
  );
};

export default ProfilePage;
