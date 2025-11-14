import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("judge@court.gov");
  const [password, setPassword] = useState("superjudge123");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (r.ok) navigate("/");
    else alert("Login failed: " + JSON.stringify(r.error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Judge Login</h2>
        <form onSubmit={handle} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Email" />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" placeholder="Password" />
          <div className="flex items-center justify-between">
            <button className="bg-jifblue-500 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Logging..." : "Login"}</button>
            <button type="button" onClick={() => { setEmail("judge@court.gov"); setPassword("superjudge123"); }} className="text-sm text-slate-500">Use Demo Judge</button>
          </div>
        </form>
      </div>
    </div>
  );
}
