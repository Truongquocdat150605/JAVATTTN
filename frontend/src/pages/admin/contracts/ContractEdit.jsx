/**
 * @file ContractEdit.jsx
 * @description Trang chỉnh sửa hợp đồng.
 * @module pages/admin/contracts
 */
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import ContractForm from "./ContractForm";

const ContractEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  const [editFormData, setEditFormData] = useState({
    tenantId: "",
    roomId: "",
    startDate: "",
    endDate: "",
    rentPrice: "",
    deposit: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contractRes, roomsRes, usersRes] = await Promise.all([
          api.get(`/contracts/${id}`),
          api.get("/rooms/available"), // We might need to append the current room to this list if it's not in available
          api.get("/admin/users")
        ]);

        const contract = contractRes?.data || contractRes;
        const availableRooms = Array.isArray(roomsRes) ? roomsRes : (roomsRes?.data || roomsRes?.content || []);
        const allUsers = Array.isArray(usersRes) ? usersRes : (usersRes?.data || usersRes?.content || []);

        // Add current room to available rooms if it's not there
        if (contract.room && !availableRooms.find(r => r.id === contract.room.id)) {
          availableRooms.push(contract.room);
        }

        setRooms(availableRooms);
        setUsers(allUsers);

        setEditFormData({
          tenantId: contract.tenant?.id || "",
          roomId: contract.room?.id || "",
          startDate: contract.startDate || "",
          endDate: contract.endDate || "",
          rentPrice: contract.rentPrice || "",
          deposit: contract.deposit || "",
          status: contract.status || "ACTIVE",
        });

      } catch (error) {
        toast.error("Không tìm thấy hợp đồng");
        navigate("/admin/contracts");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));

  const handleSubmit = async () => {
    if (!editFormData.tenantId) return toast.error("Vui lòng chọn khách thuê");
    if (!editFormData.roomId) return toast.error("Vui lòng chọn phòng");
    if (!isValidDate(editFormData.startDate)) return toast.error("Ngày bắt đầu phải đúng định dạng YYYY-MM-DD");

    const payload = {
      tenant: { id: editFormData.tenantId },
      room: { id: editFormData.roomId },
      startDate: editFormData.startDate,
      endDate: editFormData.endDate || null,
      rentPrice: Number(editFormData.rentPrice),
      deposit: Number(editFormData.deposit) || 0,
      status: editFormData.status,
      active: true,
    };

    setSaving(true);
    try {
      await api.put(`/contracts/${id}`, payload);
      toast.success("Cập nhật hợp đồng thành công");
      navigate("/admin/contracts");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Lỗi khi cập nhật hợp đồng");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/contracts")} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Chỉnh sửa hợp đồng #{id}
          </Typography>
        </Box>
        <ContractForm 
          isEdit={true}
          editFormData={editFormData}
          handleEditChange={handleEditChange}
          handleSubmit={handleSubmit}
          saving={saving}
          rooms={rooms}
          users={users}
        />
      </Container>
    </Box>
  );
};

export default ContractEdit;
