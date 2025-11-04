import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">SlotSwapper</Link>
        {token && <Link to="/marketplace">Marketplace</Link>}
        {token && <Link to="/requests">Requests</Link>}
      </div>
      <div>
        {!token ? (
          <>
            <Link to="/login">Login</Link>{" "}
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
