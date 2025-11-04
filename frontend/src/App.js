import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Requests from "./pages/Requests";
import Navbar from "./components/Navbar";

function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={token ? <Marketplace /> : <Navigate to="/login" />} />
          <Route path="/requests" element={token ? <Requests /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
