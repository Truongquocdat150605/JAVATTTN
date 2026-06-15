// src/components/common/PillFilter.jsx
import { Box, Stack, Chip, Typography } from "@mui/material";

const PillFilter = ({ options, value, onChange, label }) => (
  <Box>
    <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1}>
      {label}
    </Typography>
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Chip
            key={opt.label}
            label={opt.label}
            onClick={() => onChange(opt.value)}
            sx={{
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
              borderRadius: "50px",
              transition: "all 0.2s",
              bgcolor: active ? "#0f766e" : "#f1f5f9",
              color: active ? "#fff" : "#475569",
              border: active ? "2px solid #0f766e" : "2px solid transparent",
              "&:hover": {
                bgcolor: active ? "#0d9488" : "#e2e8f0",
                transform: "translateY(-1px)",
              },
            }}
          />
        );
      })}
    </Stack>
  </Box>
);

export default PillFilter;