import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import RoomForm from "./RoomForm";
import api from "../../../services/api";
import { toast } from "react-toastify";

const RoomEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        setRoom(response.data || response);
      } catch (error) {
        toast.error("Không tìm thấy phòng");
        navigate("/admin/rooms");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchRoom();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!room) {
    return <Typography textAlign="center">Không có dữ liệu phòng.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <RoomForm isEdit={true} initialData={room} roomId={id} />
    </Container>
  );
};

export default RoomEdit;
