import React, { useEffect, useState } from "react";
import api from "../../services/api";

const RequestManagement = () => {
  const [rentalRequests, setRentalRequests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  const loadData = async () => {
    const [rentalRes, contactRes] = await Promise.all([
      api.get("/admin/requests/rental"),
      api.get("/admin/requests/contacts"),
    ]);
    setRentalRequests(rentalRes);
    setContacts(contactRes);
    const userRes = await api.get("/admin/users");
    setUsers(userRes.filter((u) => u.role === "TENANT"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/requests/rental/${id}/status?status=${status}`);
    loadData();
  };

  const approveAndCreateContract = async (request) => {
    const tenantId = window.prompt("Nhập tenantId để tạo hợp đồng:");
    if (!tenantId) return;
    const rentPrice = window.prompt("Nhập giá thuê:");
    if (!rentPrice) return;
    const deposit = window.prompt("Nhập tiền cọc:", "0");
    if (deposit === null) return;
    const startDate = window.prompt("Nhập ngày bắt đầu (YYYY-MM-DD):", new Date().toISOString().slice(0, 10));
    if (!startDate) return;
    const endDate = window.prompt("Nhập ngày kết thúc (YYYY-MM-DD, có thể để trống):", "");

    const qs = new URLSearchParams({
      tenantId: String(tenantId),
      rentPrice: String(rentPrice),
      deposit: String(deposit),
      startDate,
    });
    if (endDate) qs.append("endDate", endDate);

    await api.post(`/admin/requests/rental/${request.id}/approve-and-create-contract?${qs.toString()}`);
    loadData();
    alert("Đã duyệt và tạo hợp đồng thành công.");
  };

  return (
    <div className="container">
      <h2>Duyệt yêu cầu thuê phòng</h2>
      {rentalRequests.map((req) => (
        <div key={req.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <p>Phòng: {req.room?.roomNumber}</p>
          <p>Khách: {req.fullName} - {req.phone}</p>
          <p>CCCD: {req.identityNumber || "N/A"}</p>
          <p>Ngày muốn vào: {req.desiredMoveInDate || "N/A"}</p>
          <p>Trạng thái: {req.status}</p>
          <p>Gợi ý tenant:</p>
          <ul>
            {users.slice(0, 5).map((u) => (
              <li key={u.id}>{u.id} - {u.fullName} ({u.username})</li>
            ))}
          </ul>
          {req.status === "PENDING" && (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => approveAndCreateContract(req)}>Duyệt + Tạo hợp đồng</button>
              <button onClick={() => updateStatus(req.id, "APPROVED")}>Chấp nhận</button>
              <button onClick={() => updateStatus(req.id, "REJECTED")}>Từ chối</button>
            </div>
          )}
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Tin nhắn liên hệ</h2>
      {contacts.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <p><strong>{c.fullName}</strong> - {c.phone}</p>
          <p>{c.message}</p>
          <p style={{ color: "#666" }}>{c.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default RequestManagement;
