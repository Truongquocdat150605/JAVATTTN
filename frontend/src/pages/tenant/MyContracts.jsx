/**
 * @file MyContracts.jsx
 * @description Trang quản lý hợp đồng thuê của khách thuê.
 * @module pages/tenant
 */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Paper, Typography, Grid, Box, CircularProgress, Alert } from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";
import api from "../../services/api";
import { connectContractSocket, disconnectContractSocket } from "../../services/contractSocket";

import ContractList from "../../components/tenant/ContractList";
import ContractSignDialog from "../../components/contracts/ContractSignDialog";

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [signDialog, setSignDialog] = useState({ open: false, contract: null });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/contracts/my");
        setContracts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setErrorMsg("Không thể tải danh sách hợp đồng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();

    const socketClient = connectContractSocket({
      onMessage: (msg) => {
        const message = msg?.message;
        toast.info(message || "Hợp đồng đã thay đổi. Đang đồng bộ...");
        fetchContracts();
      },
    });

    return () => disconnectContractSocket(socketClient);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{errorMsg}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DescriptionIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>Hợp Đồng Của Tôi</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tất cả hợp đồng thuê phòng của bạn</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#0f766e">{contracts.length}</Typography>
            <Typography variant="body2" color="text.secondary">Tổng hợp đồng</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#10b981">{contracts.filter(c => c.status === "ACTIVE").length}</Typography>
            <Typography variant="body2" color="text.secondary">Đang hiệu lực</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#f59e0b">{contracts.filter(c => c.status === "PENDING").length}</Typography>
            <Typography variant="body2" color="text.secondary">Chờ duyệt</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#94a3b8">{contracts.filter(c => c.status === "EXPIRED").length}</Typography>
            <Typography variant="body2" color="text.secondary">Đã kết thúc</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Contracts List */}
      <ContractList contracts={contracts} setSignDialog={setSignDialog} />

      {/* E-Signature & PDF Dialog */}
      <ContractSignDialog
        open={signDialog.open}
        contract={signDialog.contract}
        onClose={() => setSignDialog({ open: false, contract: null })}
      />
    </Container>
  );
};

export default MyContracts;