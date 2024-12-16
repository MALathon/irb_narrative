import React, { useState } from 'react';
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
  Grid,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { ModuleView } from "./components/form/ModuleView";
import { FormNavigator } from "./components/form/Navigator";
import { FormPreview } from "./components/form/Preview";
import { moduleRegistry, moduleFlow } from "./data/modules";
import { FormValues } from './types/form';

const DRAWER_WIDTH = 400;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

interface ContentProps {
  isPreviewOpen: boolean;
  onPreviewClose: () => void;
  values: FormValues;
  onValuesChange: (values: FormValues) => void;
}

const Content: React.FC<ContentProps> = ({
  isPreviewOpen,
  onPreviewClose,
  values,
  onValuesChange,
}) => {
  const currentModule = moduleRegistry[moduleFlow[0].id];
  
  return (
    <Container maxWidth={false} disableGutters>
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item sx={{ width: DRAWER_WIDTH }}>
          <FormNavigator
            module={currentModule}
            values={values}
            onPreviewClick={() => onPreviewClose()}
            DRAWER_WIDTH={DRAWER_WIDTH}
          />
        </Grid>

        <Grid item xs>
          <ModuleView
            module={currentModule}
            initialValues={values}
            onValuesChange={onValuesChange}
          />
        </Grid>
      </Grid>

      <FormPreview
        isOpen={isPreviewOpen}
        onClose={onPreviewClose}
        module={currentModule}
        values={values}
      />
    </Container>
  );
};

const App: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar 
          position="static" 
          color="default" 
          elevation={1}
          sx={{ 
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              IRB Protocol Builder
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setIsPreviewOpen(true)}
              sx={{ mr: 2 }}
            >
              Preview Full Document
            </Button>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
            <IconButton color="inherit">
              <HelpIcon />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Content
            isPreviewOpen={isPreviewOpen}
            onPreviewClose={() => setIsPreviewOpen(false)}
            values={formValues}
            onValuesChange={setFormValues}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 