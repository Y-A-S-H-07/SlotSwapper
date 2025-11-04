import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="form-row"><input required name="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-row"><input required type="password" name="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <button className="primary" type="submit">Login</button>
      </form>
    </div>
  );
}
