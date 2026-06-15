import React from "react";
import { Box, Button, Typography } from "@mui/material";

const EmptyState = ({
  title = "Không có dữ liệu",
  description = "",
  buttonText = "",
  onButtonClick,
}) => {
  return (
    <Box
      sx={{
        py: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 560,
          width: "100%",
          textAlign: "center",
          p: 4,
          borderRadius: 3,
          bgcolor: "#ffffff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Typography variant="h5" fontWeight={900} color="#0f172a">
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" mt={1.5}>
            {description}
          </Typography>
        )}
        {buttonText && onButtonClick && (
          <Button
            variant="contained"
            onClick={onButtonClick}
            sx={{
              mt: 3,
              px: 3,
              py: 1.1,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 800,
              background: "linear-gradient(135deg, #14b8a6, #0f766e)",
              "&:hover": {
                background: "linear-gradient(135deg, #109f90, #0f6b61)",
              },
            }}
          >
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EmptyState;

