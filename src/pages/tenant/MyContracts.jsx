import React, { useEffect, useState } from "react";
import api from "../../services/api";

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    api.get("/contracts/my").then((res) => setContracts(res));
  }, []);

  return (
    <div className="container">
      <h2>Hợp đồng của tôi</h2>
      {contracts.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <p>Phòng: {c.room?.roomNumber}</p>
          <p>Bắt đầu: {c.startDate}</p>
          <p>Kết thúc: {c.endDate || "Chưa xác định"}</p>
          <p>Giá thuê: {c.rentPrice}</p>
          <p>Trạng thái: {c.status}</p>
        </div>
      ))}
    </div>
  );
};

export default MyContracts;
