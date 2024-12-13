import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { NarrativeProvider, useNarrative } from './context/NarrativeContext';
import { NarrativeView } from './components/NarrativeView';
import { irbNarrativeSchema } from './schemas/irbNarrativeSchema';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

interface NarrativeContentProps {
  isPreviewOpen: boolean;
  onPreviewClose: () => void;
}

const NarrativeContent: React.FC<NarrativeContentProps> = ({
  isPreviewOpen,
  onPreviewClose,
}) => {
  const { state, updateField } = useNarrative();
  
  return (
    <Container maxWidth={false}>
      <NarrativeView
        sections={irbNarrativeSchema.sections}
        values={state}
        onUpdate={updateField}
        isPreviewOpen={isPreviewOpen}
        onPreviewClose={onPreviewClose}
      />
    </Container>
  );
};

const App: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NarrativeProvider>
        <Box 
          sx={{ 
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <AppBar 
            position="fixed"
            elevation={0}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              '& .MuiToolbar-root': {
                minHeight: '40px !important',
                padding: '0 16px',
              },
            }}
          >
            <Toolbar variant="dense" disableGutters>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
              )}
              
              <DescriptionIcon 
                sx={{ 
                  mr: 1,
                  color: 'primary.main',
                  fontSize: '20px',
                }} 
              />
              
              <Typography 
                variant="subtitle2" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  color: 'text.primary',
                }}
              >
                IRB Protocol Builder
              </Typography>

              <Button
                startIcon={<ArticleIcon sx={{ fontSize: '18px' }} />}
                onClick={() => setIsPreviewOpen(true)}
                sx={{ 
                  mr: 1,
                  py: 0.5,
                  minHeight: '28px',
                }}
                variant="outlined"
                color="primary"
                size="small"
              >
                Preview Full Document
              </Button>
            </Toolbar>
          </AppBar>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              pt: '40px',
            }}
          >
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                height: 'calc(100vh - 40px)',
                overflow: 'hidden',
              }}
            >
              <NarrativeContent 
                isPreviewOpen={isPreviewOpen} 
                onPreviewClose={() => setIsPreviewOpen(false)} 
              />
            </Box>
          </Box>
        </Box>
      </NarrativeProvider>
    </ThemeProvider>
  );
};

export default App; 