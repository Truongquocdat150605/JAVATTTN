/**
 * @file HomeScrollTop.jsx
 * @description Nút cuộn (FAB) nổi ở góc màn hình giúp người dùng bấm để trượt lên đầu trang.
 * @module components/home
 */
import React from "react";
import { Fab, Zoom, useScrollTrigger } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

const HomeScrollTop = () => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 300 });
  return (
    <Zoom in={trigger}>
      <Fab onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size="small"
        sx={{
          position: "fixed", bottom: 32, right: 32, zIndex: 1000,
          background: "linear-gradient(135deg,#A06E41,#8B5A2B)", color: "#fff",
          boxShadow: "0 8px 24px rgba(139, 90, 43,0.4)",
          "&:hover": { transform: "scale(1.1)" }, transition: "transform 0.2s"
        }}>
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

export default HomeScrollTop;
