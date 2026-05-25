import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ServiceForm from "./ServiceForm";
import api from "../../../services/api";
import { toast } from "react-toastify";

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await api.get(`/services/${id}`);
        setService(data?.data || data);
      } catch {
        toast.error("Không tìm thấy dịch vụ");
        navigate("/admin/services");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
  }, [id, navigate]);

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={10}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ServiceForm isEdit={true} initialData={service} serviceId={id} />
    </Container>
  );
};

export default ServiceEdit;
