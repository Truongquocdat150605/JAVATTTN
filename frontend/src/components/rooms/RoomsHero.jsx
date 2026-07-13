import { Box, Container, Chip, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import WhatshotIcon from "@mui/icons-material/Whatshot";

const RoomsHero = ({ roomsCount, searchValue, onSearchChange, onToggleFilters }) => (
  <Box sx={{
    position: "relative",
    overflow: "hidden",
    minHeight: { xs: 280, md: 380 },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}>
    <Box sx={{
      position: "absolute",
      inset: 0,
      backgroundImage: "url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=85)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }} />
    <Box sx={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(160deg, rgba(62,42,26,0.85) 0%, rgba(139,90,43,0.5) 100%)",
    }} />
    <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, py: { xs: 4, md: 6 }, textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Chip
          icon={<WhatshotIcon sx={{ color: "#fcd34d !important", fontSize: 18 }} />}
          label={`${roomsCount} phòng đang có sẵn`}
          sx={{
            bgcolor: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontWeight: 700,
            mb: 2.5,
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.25)"
          }}
        />
        <Typography variant="h2" sx={{
          fontWeight: 900,
          color: "#fff",
          mb: 2,
          fontFamily: "'Playfair Display', serif",
          fontSize: { xs: "1.8rem", md: "3rem" },
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          Danh Sách Phòng Trọ
        </Typography>
        <Typography variant="h6" sx={{
          color: "rgba(255,255,255,0.82)",
          fontWeight: 400,
          mb: 4,
          fontSize: { xs: "0.9rem", md: "1.25rem" }
        }}>
          Lọc & tìm phòng phù hợp với nhu cầu của bạn
        </Typography>

        {/* Search Bar - responsive */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 0 },
          bgcolor: "rgba(255,255,255,0.97)",
          borderRadius: "60px",
          p: "4px 4px 4px 20px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          backdropFilter: "blur(16px)",
          maxWidth: 580,
          mx: "auto",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          justifyContent: "center"
        }}>
          <SearchIcon sx={{ color: "#8B5A2B", mr: 1, flexShrink: 0 }} />
          <input
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Tìm theo số phòng, mô tả, địa chỉ..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: "0.95rem",
              color: "#3E2A1A",
              fontFamily: "inherit",
              padding: "8px 0",
              minWidth: 0,
              width: "100%"
            }}
          />
          <Button
            onClick={onToggleFilters}
            variant="contained"
            startIcon={<TuneIcon />}
            sx={{
              borderRadius: "50px",
              px: { xs: 2, sm: 3 },
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.9rem",
              flexShrink: 0,
              background: "linear-gradient(135deg, #A06E41, #8B5A2B)",
              boxShadow: "0 4px 14px rgba(139,90,43,0.35)",
              "&:hover": { background: "linear-gradient(135deg, #8B5A2B, #6A411B)" },
              mt: { xs: 1, sm: 0 }
            }}
          >
            Lọc
          </Button>
        </Box>
      </motion.div>
    </Container>
  </Box>
);

export default RoomsHero;