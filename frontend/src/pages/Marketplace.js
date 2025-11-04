import React, { useEffect, useState } from "react";
import API from "../api";

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selected, setSelected] = useState("");

  async function load() {
    const [s1, s2] = await Promise.all([API.get("/swaps"), API.get("/events")]);
    setSlots(s1.data);
    setMySlots(s2.data.filter(e => e.status === "SWAPPABLE"));
  }

  useEffect(() => { load(); }, []);

  async function requestSwap(theirSlotId) {
    if (!selected) return alert("Select one of your swappable slots");
    try {
      await API.post("/swaps", { mySlotId: selected, theirSlotId });
      alert("Requested");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  }

  return (
    <div>
      <h2>Marketplace</h2>
      <div className="form-row">
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">Select your slot</option>
          {mySlots.map(s => <option key={s._id} value={s._id}>{s.title} ({new Date(s.startTime).toLocaleString()})</option>)}
        </select>
      </div>

      <div>
        {slots.length === 0 && <div className="small">No swappable slots</div>}
        {slots.map(s => (
          <div key={s._id} className="card">
            <div>
              <div style={{ fontWeight: 600 }}>{s.title}</div>
              <div className="small">{new Date(s.startTime).toLocaleString()}</div>
              <div className="small">Owner: {s.owner?.name || s.owner}</div>
            </div>
            <div>
              <button onClick={() => requestSwap(s._id)}>Request swap</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
