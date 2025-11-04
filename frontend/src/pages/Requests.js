import React, { useEffect, useState } from "react";
import API from "../api";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  async function load() {
    try {
      const [inc, out] = await Promise.all([API.get("/swaps/incoming"), API.get("/swaps/outgoing")]);
      setIncoming(inc.data);
      setOutgoing(out.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    }
  }

  useEffect(() => { load(); }, []);

  async function respond(id, accept) {
    try {
      await API.post(`/swaps/${id}/respond`, { accept });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  }

  return (
    <div>
      <h2>Incoming</h2>
      {incoming.length === 0 && <div className="small">No incoming requests</div>}
      {incoming.map(r => (
        <div key={r._id} className="card">
          <div>
            <div style={{ fontWeight: 600 }}>{r.offeredSlot?.title} offered by {r.requester?.name}</div>
            <div className="small">Your slot: {r.requestedSlot?.title}</div>
            <div className="small">Status: {r.status}</div>
          </div>
          <div>
            {r.status === "PENDING" && <>
              <button onClick={() => respond(r._id, true)} style={{ marginRight: 6 }}>Accept</button>
              <button onClick={() => respond(r._id, false)}>Reject</button>
            </>}
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: 20 }}>Outgoing</h2>
      {outgoing.length === 0 && <div className="small">No outgoing requests</div>}
      {outgoing.map(r => (
        <div key={r._id} className="card">
          <div>
            <div style={{ fontWeight: 600 }}>To: {r.requestedSlot?.owner?.name || "User"}</div>
            <div className="small">{r.offeredSlot?.title} → {r.requestedSlot?.title}</div>
            <div className="small">Status: {r.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
