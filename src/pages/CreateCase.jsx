import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateCase(){
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Example: POST /cases/create
      const res = await api.post("/cases/create", { id: (Math.random()+Date.now()).toString(36), client_name: client, short_desc: desc, created_by: localStorage.getItem("jif_email") });
      if (res.data) {
        alert("Case created");
        navigate("/cases");
      }
    } catch (err) {
      alert("Failed to create case: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h1 className="text-xl mb-4">Create New Case</h1>
      <form onSubmit={submit} className="space-y-4">
        <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Case Title" className="w-full border px-3 py-2 rounded" />
        <input required value={client} onChange={e=>setClient(e.target.value)} placeholder="Client Name" className="w-full border px-3 py-2 rounded" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description" className="w-full border px-3 py-2 rounded h-28" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={()=>{ setTitle(""); setClient(""); setDesc("");}} className="px-4 py-2 border rounded">Cancel</button>
          <button className="px-4 py-2 bg-jifblue-500 text-white rounded">Create Case</button>
        </div>
      </form>
    </div>
  );
}
