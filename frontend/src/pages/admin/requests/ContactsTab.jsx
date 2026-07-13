/**
 * @file ContactsTab.jsx
 * @description Tab hien thi danh sach tin nhan lien he tu khach hang.
 * @module pages/admin/requests
 */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { Phone as PhoneIcon } from "@mui/icons-material";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const ContactsTab = ({ contacts, formatDate }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const sortedContacts = sortNewestFirst(contacts, ["updatedAt", "lastModifiedDate", "createdAt", "id"]);
  const paginatedContacts = paginateRows(sortedContacts, page, rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [contacts]);

  if (sortedContacts.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
        <Typography color="text.secondary">Chua co tin nhan lien he nao tu khach hang.</Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Khi khach gui lien he qua trang /contact, tin nhan se xuat hien o day.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {paginatedContacts.map((contact) => (
          <Grid item xs={12} md={6} key={contact.id}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: "#0f766e" }}>
                      {contact.fullName?.charAt(0) || "U"}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700}>{contact.fullName}</Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
                        <Typography variant="caption">{contact.phone}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Chip label="Moi" size="small" color="error" />
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {contact.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                  {formatDate(contact.createdAt)}
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ mt: 3, borderRadius: 2, overflowX: "auto", overflowY: "visible" }}>
        <TablePagination
          component="div"
          count={sortedContacts.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="Dong/trang"
        />
      </Paper>
    </Box>
  );
};

export default ContactsTab;
