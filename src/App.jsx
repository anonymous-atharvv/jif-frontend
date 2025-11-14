import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./auth/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CreateCase from "./pages/CreateCase";
import CaseDetail from "./pages/CaseDetail";
import Precedents from "./pages/Precedents";
import NotFound from "./pages/NotFound";

function PrivateRoute({ children }){
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/cases" element={<PrivateRoute><Layout><Cases /></Layout></PrivateRoute>} />
        <Route path="/cases/create" element={<PrivateRoute><Layout><CreateCase /></Layout></PrivateRoute>} />
        <Route path="/cases/:caseId" element={<PrivateRoute><Layout><CaseDetail /></Layout></PrivateRoute>} />
        <Route path="/precedents" element={<PrivateRoute><Layout><Precedents /></Layout></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
