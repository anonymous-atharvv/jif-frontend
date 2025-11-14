import React from "react";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Topbar(){
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("jif_token");
  const openDocs = () => {
    if (!token) return alert("Login first");
    window.open(`/docs?token=${encodeURIComponent(token)}`, "_blank");
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <div className="flex items-center gap-4">
        <input placeholder="Search cases, documents..." className="border rounded px-3 py-2 w-96" />
      </div>
      <div className="flex items-center gap-4">
        <button onClick={openDocs} className="bg-jifblue-500 text-white px-3 py-2 rounded">API Docs</button>
        <div className="text-sm">{user?.email || "Guest"}</div>
      </div>
    </header>
  );
}
