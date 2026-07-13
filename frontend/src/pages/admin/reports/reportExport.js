import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { addCustomFont } from "../../../utils/pdfFont";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount || 0) + "₫";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("vi-VN");

export const handleExportPDF = (reportData, dateRange) => {
  const doc = new jsPDF();

  // Áp dụng font tiếng Việt
  addCustomFont(doc);
  doc.setFont("Roboto");

  // Header
  doc.setFontSize(22);
  doc.setTextColor(6, 78, 59);
  doc.text("BÁO CÁO DOANH THU PHÒNG TRỌ", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Thời gian: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`,
    105, 30, { align: "center" }
  );
  doc.text(`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`, 105, 37, { align: "center" });

  doc.setDrawColor(200);
  doc.line(20, 45, 190, 45);

  // Statistics
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`📊 Tổng số hóa đơn: ${reportData.totalInvoices}`, 20, 60);
  doc.text(`✅ Hóa đơn đã thanh toán: ${reportData.paidInvoices}`, 20, 70);
  doc.text(`⏳ Hóa đơn chưa thanh toán: ${reportData.unpaidInvoices}`, 20, 80);
  doc.text(`💰 Tổng doanh thu: ${formatCurrency(reportData.totalRevenue)}`, 20, 90);
  doc.text(`📈 Giá trị trung bình/hóa đơn: ${formatCurrency(reportData.avgInvoiceValue)}`, 20, 100);
  doc.text(`🎯 Tỷ lệ hoàn thành: ${reportData.completionRate.toFixed(1)}%`, 20, 110);

  // Table for monthly data
  if (reportData.monthlyData && reportData.monthlyData.length > 0) {
    autoTable(doc, {
      startY: 120,
      head: [["Tháng", "Số hóa đơn", "Doanh thu", "Tỷ lệ"]],
      body: reportData.monthlyData.map((item) => [
        `Tháng ${item.month}`,
        item.count,
        formatCurrency(item.revenue),
        `${((item.count / reportData.totalInvoices) * 100).toFixed(1)}%`,
      ]),
      headStyles: { fillColor: [6, 78, 59] },
      theme: "striped",
      styles: { font: "Roboto" },
    });
  }

  // Footer
  const finalY = doc.lastAutoTable?.finalY + 20 || 180;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    "Smart Phòng Trọ - Hệ thống quản lý nhà trọ thông minh",
    105, finalY, { align: "center" }
  );

  doc.save(`bao-cao-doanh-thu-${new Date().getTime()}.pdf`);
  toast.success("Đã xuất file PDF!");
};

export const handleExportExcel = (reportData, dateRange) => {
  try {
    const wb = XLSX.utils.book_new();

    // ---- Sheet 1: Tổng quan ----
    const overviewData = [
      ["BÁO CÁO DOANH THU - SMART PHÒNG TRỌ"],
      [`Từ ngày: ${formatDate(dateRange.startDate)} → Đến ngày: ${formatDate(dateRange.endDate)}`],
      [`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`],
      [],
      ["Chỉ số", "Giá trị"],
      ["Tổng doanh thu", reportData.totalRevenue],
      ["Tổng số hóa đơn", reportData.totalInvoices],
      ["Đã thanh toán", reportData.paidInvoices],
      ["Chưa thanh toán", reportData.unpaidInvoices],
      ["Số tiền chưa thu", reportData.pendingAmount],
      ["Giá trị TB/hóa đơn", reportData.avgInvoiceValue],
      ["Tỷ lệ hoàn thành (%)", parseFloat(reportData.completionRate.toFixed(1))],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
    ws1["!cols"] = [{ wch: 30 }, { wch: 20 }];
    ws1["A1"] = {
      v: "BÁO CÁO DOANH THU - SMART PHÒNG TRỌ",
      t: "s",
      s: { font: { bold: true, sz: 14 } },
    };
    XLSX.utils.book_append_sheet(wb, ws1, "Tổng quan");

    // ---- Sheet 2: Thống kê tháng ----
    if (reportData.monthlyData.length > 0) {
      const monthlyHeaders = ["Tháng", "Số hóa đơn", "Doanh thu (VNĐ)", "Tỷ lệ (%)"];
      const monthlyRows = reportData.monthlyData.map((item) => [
        `Tháng ${item.month}`,
        item.count,
        item.revenue,
        reportData.totalInvoices > 0
          ? parseFloat(((item.count / reportData.totalInvoices) * 100).toFixed(1))
          : 0,
      ]);
      const ws2 = XLSX.utils.aoa_to_sheet([monthlyHeaders, ...monthlyRows]);
      ws2["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 20 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, ws2, "Thống kê tháng");
    }

    XLSX.writeFile(wb, `bao-cao-doanh-thu-${Date.now()}.xlsx`);
    toast.success("✅ Đã xuất file Excel thành công!");
  } catch (err) {
    console.error(err);
    toast.error("Xuất Excel thất bại. Vui lòng thử lại.");
  }
};
