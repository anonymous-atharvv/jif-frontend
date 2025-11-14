import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <aside className="w-60 bg-gradient-to-b from-jifblue-700 to-jifblue-500 text-white p-6">
      <div className="mb-8">
        <div className="text-2xl font-semibold">J.I.F</div>
        <div className="text-xs opacity-80">Judicial Intelligence Fabric</div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" className="block py-2 px-3 rounded hover:bg-white/10">Dashboard</NavLink>
        <NavLink to="/cases" className="block py-2 px-3 rounded hover:bg-white/10">All Cases</NavLink>
        <NavLink to="/cases/create" className="block py-2 px-3 rounded hover:bg-white/10">Create Case</NavLink>
        <NavLink to="/precedents" className="block py-2 px-3 rounded hover:bg-white/10">Precedents</NavLink>
        <button onClick={() => { logout(); }} className="mt-8 w-full bg-white/10 py-2 rounded">Logout</button>
      </nav>
    </aside>
  );
}
