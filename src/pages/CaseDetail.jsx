import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Loading from "../components/Loading";

export default function CaseDetail(){
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab,setActiveTab] = useState("overview");
  const [extractedText, setExtractedText] = useState("");
  const [textId, setTextId] = useState(null);

  useEffect(()=> {
    async function load(){
      setLoading(true);
      try {
        const r = await api.get(`/cases/${caseId}?token=${encodeURIComponent(localStorage.getItem("jif_token") || "")}`);
        setCaseData(r.data || {});
        const docsRes = await api.get(`/cases/${caseId}/documents?token=${encodeURIComponent(localStorage.getItem("jif_token") || "")}`);
        setDocs(docsRes.data || []);
      } catch(e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [caseId]);

  const uploadDoc = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    fd.append("case_id", caseId);
    fd.append("token", localStorage.getItem("jif_token") || "");
    try {
      const res = await api.raw.post(`/cases/${caseId}/upload-doc`, fd, { headers: { "Content-Type": "multipart/form-data" }});
      alert("Uploaded");
      setDocs(prev => [ ...(prev || []), res.data ]);
    } catch (err) { alert("Upload failed"); }
  };

  const runOCR = async (docId) => {
    try {
      const r = await api.post(`/cases/${caseId}/ocr`, { document_id: docId, token: localStorage.getItem("jif_token") || "" });
      setExtractedText(r.data.extracted_text || "");
      setTextId(r.data.text_id || null);
      setActiveTab("ocr");
      alert("OCR complete");
    } catch(e) { console.error(e); alert("OCR failed"); }
  };

  const suggestIPC = async () => {
    if (!textId) return alert("Run OCR first");
    const r = await api.post("/analyse/suggest_ipc", { case_id: caseId, document_id: docs[0]?.id, text_id: textId, token: localStorage.getItem("jif_token") || "" });
    alert("IPC suggestions: " + JSON.stringify(r.data.suggestions || []));
  };

  const findPrecedents = async () => {
    if (!extractedText) return alert("Run OCR first");
    const r = await api.post("/analyse/find_precedents", { query_text: extractedText.slice(0,1500), top_k: 5, token: localStorage.getItem("jif_token") || "" });
    alert("Found " + (r.data.results?.length || 0) + " precedents");
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Case {caseId}</h1>
        <div>Actions</div>
      </div>

      <div className="mb-6">
        <div className="space-x-3">
          <button onClick={()=>setActiveTab("overview")} className="px-3 py-1 border rounded">Overview</button>
          <button onClick={()=>setActiveTab("documents")} className="px-3 py-1 border rounded">Documents</button>
          <button onClick={()=>setActiveTab("ocr")} className="px-3 py-1 border rounded">OCR</button>
          <button onClick={()=>setActiveTab("ipc")} className="px-3 py-1 border rounded">IPC</button>
          <button onClick={()=>setActiveTab("precedents")} className="px-3 py-1 border rounded">Precedents</button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="bg-white p-4 rounded shadow">
          <div><strong>Client:</strong> {caseData?.client_name}</div>
          <div className="mt-2"><strong>Description:</strong> {caseData?.short_desc}</div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white p-4 rounded shadow space-y-3">
          <div>
            <label className="block mb-2">Upload Document</label>
            <input type="file" onChange={uploadDoc} />
          </div>
          <div>
            <h3 className="font-semibold">Documents</h3>
            {docs.length === 0 && <div className="text-sm text-slate-500">No documents</div>}
            {docs.map(d => (
              <div key={d.id} className="flex items-center justify-between p-2 border rounded">
                <div>{d.filename || d.path || d.id}</div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>runOCR(d.id)} className="px-3 py-1 bg-jifblue-500 text-white rounded">Run OCR</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "ocr" && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="mb-2">Extracted Text</h3>
          <textarea value={extractedText} onChange={e=>setExtractedText(e.target.value)} className="w-full h-48 border p-2 rounded" />
          <div className="flex gap-2 mt-2">
            <button onClick={suggestIPC} className="px-3 py-1 bg-green-600 text-white rounded">Suggest IPC</button>
            <button onClick={findPrecedents} className="px-3 py-1 bg-indigo-600 text-white rounded">Find Precedents</button>
          </div>
        </div>
      )}

      {activeTab === "ipc" && (
        <div className="bg-white p-4 rounded shadow">
          <h3>IPC Suggestions</h3>
          <div className="text-sm text-slate-500">Click Suggest IPC in OCR tab to run.</div>
        </div>
      )}

      {activeTab === "precedents" && (
        <div className="bg-white p-4 rounded shadow">
          <h3>Precedents</h3>
          <div className="text-sm text-slate-500">Use Find Precedents in OCR tab.</div>
        </div>
      )}
    </div>
  );
}
