import React, { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  async function loadEvents() {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error loading events:", err);
      alert("Failed to load events");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function addEvent(e) {
    e.preventDefault();
    if (!form.title || !form.startTime || !form.endTime) {
      return alert("Please fill all fields");
    }

    try {
      await API.post("/events", form);
      setForm({ title: "", startTime: "", endTime: "" });
      loadEvents();
    } catch (err) {
      console.error("Error adding event:", err);
      alert(err.response?.data?.message || "Failed to add event");
    }
  }

  async function makeSwappable(id) {
    try {
      await API.put(`/events/${id}`, { status: "SWAPPABLE" });
      loadEvents();
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  }

  // 🗑️ delete event function
  async function deleteEvent(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event");
    }
  }

  return (
    <div>
      <h2>My events</h2>

      {/* --- Event creation form --- */}
      <form onSubmit={addEvent} style={{ marginBottom: "20px" }}>
        <div className="form-row">
          <input
            type="text"
            name="title"
            placeholder="Event title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <label style={{ fontSize: "0.9rem", color: "#555" }}>
            Start time:
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <label style={{ fontSize: "0.9rem", color: "#555" }}>
            End time:
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            required
          />
        </div>

        <button className="primary" type="submit">
          Add
        </button>
      </form>

      {/* --- Event list --- */}
      {events.length === 0 && <div className="small">No events yet</div>}

      {events.map((ev) => (
        <div key={ev._id} className="card">
          <div>
            <strong>{ev.title}</strong>
            <div className="small">
              {new Date(ev.startTime).toLocaleString()} →{" "}
              {new Date(ev.endTime).toLocaleString()}
            </div>
            <div className="small">Status: {ev.status}</div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {ev.status === "BUSY" && (
              <button onClick={() => makeSwappable(ev._id)}>
                Make swappable
              </button>
            )}
            <button
              onClick={() => deleteEvent(ev._id)}
              style={{
                backgroundColor: "#e63946",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "5px",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
