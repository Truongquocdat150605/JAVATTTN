import React, { useEffect, useState } from "react";
import {
  Box, Button, Chip, CircularProgress, Container,
  IconButton, Paper, Stack, Switch, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip
} from "@mui/material";
import { Add, Delete, Edit, MiscellaneousServices } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

// Helper để convert enum sang tiếng Việt
const CATEGORY_LABELS = {
  WATER: "💧 Nước", ELECTRICITY: "⚡ Điện", GARBAGE: "🗑️ Rác",
  INTERNET: "📡 Internet", SECURITY: "🔒 An ninh", CLEANING: "🧹 Vệ sinh",
  MAINTENANCE: "🔧 Bảo trì", OTHER: "📝 Khác"
};

const UNIT_LABELS = {
  UNIT: "Bộ", PERSON: "Người", MONTH: "Tháng", WEEK: "Tuần", DAY: "Ngày",
  KWH: "kWh", CUBIC_METER: "m³", LITER: "Lít", HOUR: "Giờ", TIME: "Lần"
};

const FREQUENCY_LABELS = {
  MONTHLY: "Hàng tháng", WEEKLY: "Hàng tuần", DAILY: "Hàng ngày",
  ONE_TIME: "Một lần", QUARTERLY: "Quý", ANNUAL: "Năm"
};

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.get("/services");
      setServices(Array.isArray(data) ? data : data?.data || []);
    } catch {
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa dịch vụ này? Nếu dịch vụ đang được dùng bởi phòng, hệ thống sẽ từ chối.")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Xóa dịch vụ thành công");
      fetchServices();
    } catch (error) {
      const msg = error.response?.data?.error || "Không thể xóa dịch vụ";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await api.patch(`/services/${service.id}/toggle-active`);
      toast.success(service.active ? "Đã ngưng dịch vụ" : "Đã kích hoạt dịch vụ");
      fetchServices();
    } catch {
      toast.error("Không thể thay đổi trạng thái");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} display="flex" alignItems="center" gap={1}>
            <MiscellaneousServices color="primary" />
            Quản lý Dịch vụ phụ
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Các dịch vụ đính kèm với phòng: rác, wifi, trông xe, v.v...
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/admin/services/add")}>
          Thêm dịch vụ
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Tên dịch vụ</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Đơn giá</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Loại</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Đơn vị</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Tần suất</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: 700 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}

            {!loading && services.map((svc) => (
              <TableRow key={svc.id} hover sx={{ opacity: svc.active ? 1 : 0.5 }}>
                <TableCell sx={{ fontWeight: 600 }}>{svc.name}</TableCell>
                <TableCell>
                  {Number(svc.price).toLocaleString("vi-VN")}₫
                </TableCell>
                <TableCell>
                  {svc.category ? (
                    <Chip label={CATEGORY_LABELS[svc.category] || svc.category} size="small" variant="outlined" />
                  ) : "—"}
                </TableCell>
                <TableCell>
                  {svc.unit ? UNIT_LABELS[svc.unit] || svc.unit : "—"}
                </TableCell>
                <TableCell>
                  {svc.frequency ? (
                    <Chip label={FREQUENCY_LABELS[svc.frequency] || svc.frequency} size="small" />
                  ) : "—"}
                </TableCell>
                <TableCell>
                  <Tooltip title={svc.active ? "Click để ngưng" : "Click để kích hoạt"}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        size="small"
                        checked={svc.active}
                        onChange={() => handleToggleActive(svc)}
                        color="success"
                      />
                      <Chip
                        label={svc.active ? "Hoạt động" : "Ngưng"}
                        color={svc.active ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Chỉnh sửa">
                    <IconButton color="primary" onClick={() => navigate(`/admin/services/edit/${svc.id}`)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton color="error" onClick={() => handleDelete(svc.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!loading && services.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  Chưa có dịch vụ nào. Bấm "Thêm dịch vụ" để bắt đầu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ServiceList;
