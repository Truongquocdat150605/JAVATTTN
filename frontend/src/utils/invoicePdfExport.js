import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { addCustomFont } from "./pdfFont";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount || 0) + "đ";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const exportInvoicePDF = (invoice) => {
  if (!invoice) {
    toast.error("Không có dữ liệu hóa đơn để xuất PDF.");
    return;
  }

  try {
    const doc = new jsPDF();

    // Embed UTF-8 font for Vietnamese support
    addCustomFont(doc);
    doc.setFont("Roboto");

    // Header Title
    doc.setFontSize(20);
    doc.setTextColor(15, 118, 110);
    doc.text("SMART PHÒNG TRỌ", 105, 18, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text("HÓA ĐƠN TIỀN PHÒNG & DỊCH VỤ", 105, 26, { align: "center" });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.8);
    doc.line(15, 32, 195, 32);

    // Invoice Info Block
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    const invoiceIdText = `Mã hóa đơn: #HD${String(invoice.id || 0).padStart(6, "0")}`;
    const roomText = `Phòng: ${invoice.contract?.room?.roomNumber || "N/A"}`;
    const tenantText = `Khách thuê: ${invoice.contract?.tenant?.fullName || invoice.contract?.tenant?.username || "Khách hàng"}`;
    const dateText = `Ngày tạo: ${formatDate(invoice.billingDate || invoice.createdAt)}`;
    const statusText = `Trạng thái: ${invoice.status === "PAID" ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}`;

    doc.text(invoiceIdText, 15, 42);
    doc.text(roomText, 15, 49);
    doc.text(tenantText, 15, 56);

    doc.text(dateText, 135, 42);
    doc.text(statusText, 135, 49);
    if (invoice.paymentDate) {
      doc.text(`Ngày trả: ${formatDate(invoice.paymentDate)}`, 135, 56);
    }

    // Table Data
    const tableBody = [];

    // Room Rent
    tableBody.push([
      "1",
      "Tiền thuê phòng",
      "1 tháng",
      formatVND(invoice.roomPrice || invoice.contract?.rentPrice || 0),
    ]);

    // Electricity
    if (invoice.electricityReadingOld !== undefined && invoice.electricityReadingNew !== undefined) {
      const elUsed = (invoice.electricityReadingNew || 0) - (invoice.electricityReadingOld || 0);
      tableBody.push([
        "2",
        `Tiền điện (${invoice.electricityReadingOld} kWh -> ${invoice.electricityReadingNew} kWh = ${elUsed} kWh)`,
        `${elUsed} kWh`,
        formatVND(invoice.electricityAmount || 0),
      ]);
    } else if (invoice.electricityAmount) {
      tableBody.push(["2", "Tiền điện", "Theo chỉ số", formatVND(invoice.electricityAmount)]);
    }

    // Water
    if (invoice.waterReadingOld !== undefined && invoice.waterReadingNew !== undefined) {
      const waterUsed = (invoice.waterReadingNew || 0) - (invoice.waterReadingOld || 0);
      tableBody.push([
        "3",
        `Tiền nước (${invoice.waterReadingOld} m³ -> ${invoice.waterReadingNew} m³ = ${waterUsed} m³)`,
        `${waterUsed} m³`,
        formatVND(invoice.waterAmount || 0),
      ]);
    } else if (invoice.waterAmount) {
      tableBody.push(["3", "Tiền nước", "Theo chỉ số", formatVND(invoice.waterAmount)]);
    }

    // Services
    if (invoice.serviceAmount) {
      tableBody.push(["4", "Phí dịch vụ & Quản lý", "Gói tháng", formatVND(invoice.serviceAmount)]);
    }

    // Auto Table
    autoTable(doc, {
      startY: 64,
      head: [["STT", "Khoản mục thanh toán", "Số lượng / Chi tiết", "Thành tiền"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [15, 118, 110],
        textColor: 255,
        fontStyle: "bold",
        font: "Roboto",
      },
      styles: { font: "Roboto", fontSize: 9.5 },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 95 },
        2: { cellWidth: 45 },
        3: { cellWidth: 30, halign: "right" },
      },
    });

    // Total Amount Section
    const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 120) + 10;

    doc.setFontSize(12);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(15, 118, 110);
    doc.text(`TỔNG CỘNG THANH TOÁN: ${formatVND(invoice.totalAmount)}`, 195, finalY, { align: "right" });

    // Footer
    doc.setFontSize(9);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Cảm ơn quý khách đã sử dụng dịch vụ của Smart Phòng Trọ!", 105, finalY + 20, { align: "center" });

    // Save File
    const fileName = `hoa-don-HD${String(invoice.id || 0).padStart(6, "0")}.pdf`;
    doc.save(fileName);

    toast.success(`Đã xuất hóa đơn ${fileName} thành công!`);
  } catch (error) {
    console.error("Lỗi xuất PDF hóa đơn:", error);
    toast.error("Không thể xuất file PDF hóa đơn. Vui lòng thử lại.");
  }
};
