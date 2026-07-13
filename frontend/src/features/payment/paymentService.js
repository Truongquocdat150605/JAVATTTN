import api from "../../services/api";

const paymentService = {
  // Backend mới thường trả về dữ liệu QR (vd: { qrUrl } hoặc { qrBase64 })
  createQrForInvoice: (invoiceId) =>
    api.post(`/payments/invoices/${invoiceId}/create-qr`),

  payWithStripe: (invoiceId) =>
    api.post(`/payments/stripe/${invoiceId}`),
  payWithPayOS: (invoiceId) =>
    api.post(`/payments/payos/${invoiceId}`),
  payWithCash: (invoiceId) =>
    api.post(`/payments/cash/${invoiceId}`),
  confirmCashPayment: (invoiceId) =>
    api.put(`/payments/cash/${invoiceId}/confirm`),

  // Xác nhận thanh toán: truyền paymentId/transactionId đúng theo backend
  // Nếu backend dùng invoiceId thay vì paymentId thì sẽ đổi ở đây khi bạn cung cấp contract API.
  confirmPayment: (paymentId) => api.put(`/payments/${paymentId}/confirm`),

  getMyPayments: () => api.get("/payments/my"),
  getByInvoice: (invoiceId) => api.get(`/payments/invoice/${invoiceId}`),
};

export default paymentService;

