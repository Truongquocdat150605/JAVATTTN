import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B5A2B', // Terracotta/Brown
      light: '#A06E41',
      dark: '#6A411B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2E4F32', // Deep Forest Green
      light: '#426846',
      dark: '#1C3620',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FDFBF7', // Warm beige/cream
      paper: '#ffffff',
    },
    text: {
      primary: '#3E2A1A', // Dark charcoal/brown
      secondary: '#6E5C4F', // Muted brown
    },
  },
  typography: {
    fontFamily: '"Nunito", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.2,
      color: '#4A3424',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      color: '#4A3424',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.4,
      color: '#4A3424',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      color: '#4A3424',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontFamily: '"Nunito", sans-serif',
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // Pill shape
          padding: '10px 28px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #A06E41 0%, #8B5A2B 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8B5A2B 0%, #6A411B 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #426846 0%, #2E4F32 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2E4F32 0%, #1C3620 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 24px rgba(139, 90, 43, 0.08)',
          border: '1px solid rgba(139, 90, 43, 0.1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 16px 32px rgba(139, 90, 43, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 24,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: 'rgba(139, 90, 43, 0.2)',
          },
          '&:hover fieldset': {
            borderColor: '#8B5A2B !important',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          backgroundColor: '#F3E8DF',
          color: '#6A411B',
        },
      },
    },
  },
});

export default theme;
