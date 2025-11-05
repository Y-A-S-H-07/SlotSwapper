import axios from "axios";

const API = axios.create({
  baseURL: "https://slotswapper-backend-4iti.onrender.com", // 👈 updated port
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
