import React, { useState } from "react";
import api from "../api";

export default function Precedents(){
  const [snippet, setSnippet] = useState("");
  const [results, setResults] = useState([]);

  const indexSnippet = async () => {
    try {
      const r = await api.post("/embeddings/index_doc", { source_id: (new Date()).toISOString(), source_type: "precedent", snippet, token: localStorage.getItem("jif_token") });
      alert("Indexed: " + r.data.uid);
      setSnippet("");
    } catch (e) { alert("Index failed"); console.error(e); }
  };

  const find = async () => {
    try {
      const r = await api.post("/analyse/find_precedents", { query_text: snippet, top_k: 5, token: localStorage.getItem("jif_token") });
      setResults(r.data.results || []);
    } catch(e){ alert("Find failed"); }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Precedents</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <textarea value={snippet} onChange={e => setSnippet(e.target.value)} placeholder="Paste precedent snippet..." className="w-full h-36 border p-2 rounded" />
        <div className="flex gap-2 mt-2">
          <button onClick={indexSnippet} className="px-3 py-1 bg-green-600 text-white rounded">Index snippet</button>
          <button onClick={find} className="px-3 py-1 bg-jifblue-500 text-white rounded">Find similar</button>
        </div>
      </div>

      <div className="space-y-3">
        {results.map(r => (
          <div key={r.uid} className="bg-white p-3 rounded shadow">
            <div className="text-sm font-semibold">{r.source_id} • score {r.score.toFixed(3)}</div>
            <div className="text-sm text-slate-600">{r.snippet}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
