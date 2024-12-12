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
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description as DescriptionIcon,
  ViewList as ViewListIcon,
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

  const handleSwitchToForm = () => {
    console.log('Switching to traditional form view');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NarrativeProvider>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar 
            position="fixed" 
            elevation={0}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <DescriptionIcon 
                sx={{ 
                  mr: 2,
                  color: 'primary.main',
                }} 
              />
              
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  color: 'text.primary',
                }}
              >
                IRB Protocol Builder
              </Typography>

              <Button
                startIcon={<ArticleIcon />}
                onClick={() => setIsPreviewOpen(true)}
                sx={{ mr: 2 }}
                variant="outlined"
                color="primary"
              >
                View Full Document
              </Button>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <Button
                startIcon={<ViewListIcon />}
                onClick={handleSwitchToForm}
                sx={{ ml: 1 }}
              >
                Switch to Form View
              </Button>
            </Toolbar>
          </AppBar>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: { xs: 8, sm: 9 },
              minHeight: '100vh',
              backgroundColor: 'background.default',
            }}
          >
            <NarrativeContent 
              isPreviewOpen={isPreviewOpen} 
              onPreviewClose={() => setIsPreviewOpen(false)} 
            />
          </Box>
        </Box>
      </NarrativeProvider>
    </ThemeProvider>
  );
};

export default App; 