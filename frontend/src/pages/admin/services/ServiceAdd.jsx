import React from "react";
import { Container } from "@mui/material";
import ServiceForm from "./ServiceForm";

const ServiceAdd = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <ServiceForm isEdit={false} initialData={null} />
  </Container>
);

export default ServiceAdd;
