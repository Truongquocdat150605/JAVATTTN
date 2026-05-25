import React, { useEffect, useState } from "react";
import paymentService from "../../features/payment/paymentService";

const MyPayments = () => {
  const [payments, setPayments] = useState([]);

  const load = () => paymentService.getMyPayments().then(setPayments);

  useEffect(() => {
    load();
  }, []);

  const confirm = async (id) => {
    await paymentService.confirmPayment(id);
    load();
  };

  return (
    <div className="container">
      <h2>Lịch sử thanh toán online</h2>
      {payments.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <p>Hóa đơn: #{p.invoice?.id}</p>
          <p>Số tiền: {p.amount}</p>
          <p>Phương thức: {p.method}</p>
          <p>Trạng thái: {p.status}</p>
          {p.qrUrl && (
            <p>
              QR: <a href={p.qrUrl} target="_blank" rel="noreferrer">Mở mã QR thanh toán</a>
            </p>
          )}
          {p.status === "PENDING" && (
            <button onClick={() => confirm(p.id)}>Tôi đã chuyển khoản</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyPayments;
