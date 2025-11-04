import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup done. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={submit}>
        <div className="form-row"><input required name="name" placeholder="Full name" onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div className="form-row"><input required name="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-row"><input required type="password" name="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <button className="primary" type="submit">Create account</button>
      </form>
    </div>
  );
}
