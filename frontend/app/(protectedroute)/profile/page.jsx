"use client";
import { useRouter } from "next/navigation";
const ProfilePage = () => {
    const router = useRouter();
  return (
    <>
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "red",
        fontSize: "2rem",
      }}
    >
      <h1>! Currently Working on Profile Page.please come back later!</h1>
      </div>

      <button style={{color:"white",justifyContent: "center",display: "flex",alignItems: "center",  width: "100%",fontSize: "2rem", }} onClick={() => router.replace("/")}>
        ⬅ Back
        </button>
    </>
    
  );
};

export default ProfilePage;
