import React, { useEffect, useState } from "react";
import api from "../../services/api";

const TenantMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomId: "", description: "" });

  const loadData = () => api.get("/maintenance/my").then((res) => setRequests(res));
  const loadRooms = () => api.get("/tenant/my-rooms").then((res) => setRooms(res));

  useEffect(() => {
    loadData();
    loadRooms();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ roomId: form.roomId, description: form.description });
    await api.post(`/maintenance?${params.toString()}`);
    setForm({ roomId: "", description: "" });
    loadData();
  };

  return (
    <div className="container">
      <h2>Yêu cầu bảo trì</h2>
      <form onSubmit={submit}>
        <select required value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
          <option value="">Chọn phòng đang thuê</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>Phòng {room.roomNumber}</option>
          ))}
        </select>
        <textarea required placeholder="Mô tả sự cố" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Gửi yêu cầu</button>
      </form>

      <div style={{ marginTop: 16 }}>
        {requests.map((r) => (
          <div key={r.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <p>Phòng: {r.room?.roomNumber}</p>
            <p>Nội dung: {r.description}</p>
            <p>Trạng thái: {r.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenantMaintenance;
