import React, { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";

export default function Dashboard(){
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    async function load() {
      setLoading(true);
      try {
        // example endpoint: GET /cases/all or /cases
        const res = await api.get("/cases/all?token=" + encodeURIComponent(localStorage.getItem("jif_token") || ""));
        // assume response is array
        const cases = res.data || [];
        const total = cases.length;
        const pending = cases.filter(c => c.status === "pending").length;
        const high = cases.filter(c => c.priority === "high").length;
        setStats({ total, pending, high, resolved: total - pending });
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    }
    load();
  },[]);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow"> <div className="text-sm">Total Cases</div> <div className="text-2xl">{stats?.total ?? "—"}</div></div>
        <div className="bg-white p-4 rounded shadow"> <div className="text-sm">Pending</div> <div className="text-2xl">{stats?.pending ?? "—"}</div></div>
        <div className="bg-white p-4 rounded shadow"> <div className="text-sm">High Priority</div> <div className="text-2xl">{stats?.high ?? "—"}</div></div>
        <div className="bg-white p-4 rounded shadow"> <div className="text-sm">Resolved</div> <div className="text-2xl">{stats?.resolved ?? "—"}</div></div>
      </div>
    </div>
  );
}
