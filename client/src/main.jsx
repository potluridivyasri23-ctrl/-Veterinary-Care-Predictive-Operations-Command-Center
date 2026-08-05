import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#0284c7' },
    background: {
      default: '#eff6ff',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569'
    }
  },
  typography: {
    fontFamily: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'].join(','),
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#eff6ff',
          backgroundImage: 'radial-gradient(circle at top, rgba(37,99,235,0.12), transparent 20%), radial-gradient(circle at bottom, rgba(14,165,233,0.10), transparent 18%)',
          backgroundAttachment: 'fixed'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid rgba(148, 163, 184, 0.16)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled'
      },
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: '#f8fafc'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#eef2ff',
          color: '#0f172a',
          borderBottom: '1px solid rgba(148,163,184,0.16)'
        },
        body: {
          borderBottom: '1px solid rgba(148,163,184,0.12)'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#f8fafc'
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(37,99,235,0.12)'
          },
          '&:hover': {
            backgroundColor: 'rgba(37,99,235,0.08)'
          }
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
