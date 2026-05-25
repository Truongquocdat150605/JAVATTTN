import React from "react";
import { Container } from "@mui/material";
import RoomForm from "./RoomForm";

const RoomAdd = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <RoomForm isEdit={false} initialData={null} />
    </Container>
  );
};

export default RoomAdd;
