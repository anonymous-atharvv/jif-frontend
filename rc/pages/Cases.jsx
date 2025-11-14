import React, { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

export default function Cases(){
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(()=> {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/cases/all?token=" + encodeURIComponent(localStorage.getItem("jif_token") || ""));
        setCases(res.data || []);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    }
    load();
  },[]);

  const filtered = cases.filter(c => !q || (c.client_name + " " + c.id + " " + c.short_desc).toLowerCase().includes(q.toLowerCase()));

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">All Cases</h1>
        <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} className="border px-3 py-2 rounded" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="p-6 bg-white rounded shadow">No cases found</div>}
        {filtered.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
            <div>
              <div className="font-semibold">{c.client_name} — <span className="text-sm opacity-80">{c.short_desc}</span></div>
              <div className="text-xs text-slate-500">Case ID: {c.id} • Status: {c.status || "—"} • Priority: {c.priority || "—"}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(c.id)} className="px-3 py-1 bg-slate-100 rounded">Copy ID</button>
              <Link to={`/cases/${c.id}`} className="px-3 py-1 bg-jifblue-500 text-white rounded">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
