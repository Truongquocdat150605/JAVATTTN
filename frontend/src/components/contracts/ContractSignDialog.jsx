import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Divider, IconButton, Alert, Stack
} from "@mui/material";
import {
  Draw as DrawIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

// Hàm chuyển tiếng Việt có dấu thành không dấu (để PDF không lỗi font)
const removeAccents = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const ContractSignDialog = ({ open, onClose, contract }) => {
  const sigCanvas = useRef(null);
  const [signed, setSigned] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setSigned(false);
  };

  const handleEnd = () => {
    if (!sigCanvas.current?.isEmpty()) {
      setSigned(true);
    }
  };

  const handleGeneratePDF = async () => {
    if (!signed || sigCanvas.current?.isEmpty()) {
      toast.error("Vui lòng ký tên trước khi xuất hợp đồng!");
      return;
    }
    setGenerating(true);
    try {
      const signatureImg = sigCanvas.current.toDataURL("image/png");
      const doc = new jsPDF();

      // ===== HEADER =====
      doc.setFillColor(15, 118, 110);
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text(removeAccents("HỢP ĐỒNG THUÊ PHÒNG TRỌ"), 105, 16, { align: "center" });
      doc.setFontSize(10);
      doc.text(removeAccents("Smart Phòng Trọ - Hệ thống quản lý nhà trọ thông minh"), 105, 26, { align: "center" });

      // ===== Contract Info =====
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Mã hợp đồng: #${contract?.id || "---"}`, 20, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Ngày ký: ${new Date().toLocaleDateString("vi-VN")}`, 20, 58);
      doc.text(`Trạng thái: Đang hiệu lực`, 120, 58);

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 63, 190, 63);

      // ===== Parties =====
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(removeAccents("BÊN CHO THUÊ (Bên A):"), 20, 74);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(removeAccents("Smart Phòng Trọ Management System"), 20, 82);
      doc.text(removeAccents("Hotline: 0123 456 789"), 20, 89);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(removeAccents("BÊN THUÊ (Bên B):"), 20, 102);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`${removeAccents(contract?.tenant?.fullName) || "---"}`, 20, 110);
      doc.text(`Số điện thoại: ${contract?.tenant?.phone || "---"}`, 20, 117);
      doc.text(`Email: ${contract?.tenant?.email || "---"}`, 20, 124);
      if (contract?.tenant?.identityNumber) {
        doc.text(`CCCD: ${contract.tenant.identityNumber}`, 20, 131);
      }

      const startY = contract?.tenant?.identityNumber ? 138 : 131;
      doc.line(20, startY, 190, startY);

      // ===== Contract Details =====
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(removeAccents("NỘI DUNG HỢP ĐỒNG:"), 20, startY + 11);

      autoTable(doc, {
        startY: startY + 17,
        head: [[removeAccents("Nội dung"), removeAccents("Chi tiết")]],
        body: [
          [removeAccents("Phòng thuê"), `Phòng ${contract?.room?.roomNumber || "---"}`],
          [removeAccents("Giá thuê"), `${new Intl.NumberFormat("vi-VN").format(contract?.rentPrice || 0)} VND/tháng`],
          [removeAccents("Tiền cọc"), `${new Intl.NumberFormat("vi-VN").format(contract?.deposit || 0)} VND`],
          [removeAccents("Ngày bắt đầu"), contract?.startDate || "---"],
          [removeAccents("Ngày kết thúc"), contract?.endDate || "Không xác định"],
          [removeAccents("Trạng thái"), contract?.status || "---"],
        ],
        headStyles: { fillColor: [15, 118, 110], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 253, 250] },
        styles: { fontSize: 10, cellPadding: 4 },
        margin: { left: 20, right: 20 },
      });

      const afterTable = doc.lastAutoTable.finalY + 10;

      // ===== Terms =====
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(removeAccents("ĐIỀU KHOẢN CHUNG:"), 20, afterTable);
      doc.setFont("helvetica", "normal");
      const terms = [
        "1. Bên B cam kết thanh toán tiền thuê đúng hạn vào ngày 05 hàng tháng.",
        "2. Bên B phải bảo quản tài sản, không gây ồn ào sau 22h.",
        "3. Không được cho người khác ở cùng khi chưa có sự đồng ý của Bên A.",
        "4. Thông báo trước 30 ngày nếu có nhu cầu chấm dứt hợp đồng.",
      ];
      terms.forEach((term, idx) => {
        doc.text(removeAccents(term), 20, afterTable + 8 + idx * 7);
      });

      const sigY = afterTable + 46;

      // ===== Signature Section =====
      doc.line(20, sigY, 190, sigY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(removeAccents("BÊN A KÝ TÊN"), 50, sigY + 8, { align: "center" });
      doc.text(removeAccents("BÊN B KÝ TÊN"), 160, sigY + 8, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.text(removeAccents("(Chữ ký điện tử)"), 50, sigY + 14, { align: "center" });

      // Embed signature image
      doc.addImage(signatureImg, "PNG", 125, sigY + 8, 70, 28);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Đã ký điện tử ngày ${new Date().toLocaleDateString("vi-VN")}`, 160, sigY + 40, { align: "center" });

      // ===== Footer =====
      doc.setFillColor(15, 118, 110);
      doc.rect(0, 282, 210, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(removeAccents("Smart Phòng Trọ © 2026 - Hệ thống quản lý nhà trọ thông minh"), 105, 291, { align: "center" });

      doc.save(`hop-dong-${contract?.id || "moi"}-${Date.now()}.pdf`);
      toast.success("Đã ký và xuất hợp đồng PDF thành công!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi tạo PDF. Vui lòng thử lại.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <DrawIcon />
          <Typography variant="h6" fontWeight={700}>
            Ký Hợp Đồng Điện Tử #{contract?.id}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            Phòng {contract?.room?.roomNumber} — {contract?.tenant?.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ký tên bằng chuột (hoặc ngón tay trên điện thoại) vào khung bên dưới để xác nhận hợp đồng.
          </Typography>
        </Alert>

        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: "#374151" }}>
          ✍️ Vùng ký tên:
        </Typography>

        <Box
          sx={{
            border: signed ? "2px solid #0f766e" : "2px dashed #cbd5e1",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#f8fafc",
            transition: "border-color 0.3s",
            cursor: "crosshair",
          }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            penColor="#0f172a"
            canvasProps={{
              width: 500,
              height: 200,
              style: { width: "100%", height: 200 },
            }}
            onEnd={handleEnd}
          />
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="caption" color={signed ? "success.main" : "text.secondary"}>
            {signed ? "✅ Đã ký tên" : "Chưa ký tên"}
          </Typography>
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            color="inherit"
            sx={{ fontSize: "0.75rem" }}
          >
            Xóa & ký lại
          </Button>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          startIcon={generating ? null : <DownloadIcon />}
          onClick={handleGeneratePDF}
          disabled={!signed || generating}
          sx={{
            bgcolor: "#0f766e",
            fontWeight: 700,
            px: 3,
            "&:hover": { bgcolor: "#0d9488" },
          }}
        >
          {generating ? "Đang tạo PDF..." : "Ký & Xuất PDF"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractSignDialog;