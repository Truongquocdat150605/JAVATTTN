import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Container } from "@mui/material";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;