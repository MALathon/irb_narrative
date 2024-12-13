import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Article as ArticleIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { NarrativeModule, NarrativeSection } from '../types/narrative';

interface NarrativeModuleNavigatorProps {
  currentModule: NarrativeModule;
  sections: NarrativeSection[];
  activeStep: number;
  handleStepClick: (step: number) => void;
  getStepStatus: (stepIndex: number) => { isComplete: boolean; hasWarning: boolean };
  setIsModulePreviewOpen: (open: boolean) => void;
  DRAWER_WIDTH: number;
}

export const NarrativeModuleNavigator: React.FC<NarrativeModuleNavigatorProps> = ({
  currentModule,
  sections,
  activeStep,
  handleStepClick,
  getStepStatus,
  setIsModulePreviewOpen,
  DRAWER_WIDTH,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        borderRadius: 2,
        margin: 2,
        marginRight: 3,
        marginLeft: 0,
        height: 'calc(100vh - 88px - 32px)',
        backgroundColor: theme.palette.grey[50],
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 2,
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
          pointerEvents: 'none',
        }
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ 
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          boxShadow: `0 1px 2px ${theme.palette.divider}`,
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon color="primary" />
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Module Navigator
              </Typography>
            </Box>
            <Tooltip title="View All Sections in Current Module" placement="left" arrow>
              <Button
                onClick={() => setIsModulePreviewOpen(true)}
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<ArticleIcon />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                  transition: 'all 0.2s ease-in-out',
                  fontSize: '0.75rem',
                }}
              >
                Preview Module
              </Button>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {currentModule.name}
          </Typography>
        </Box>
        <List component="nav" sx={{ px: 2, py: 1, flex: 1 }}>
          {currentModule.sections.map((section) => {
            const absoluteIndex = sections.findIndex(s => s.id === section.id);
            const { isComplete, hasWarning } = getStepStatus(absoluteIndex);
            return (
              <ListItem
                key={section.id}
                button
                selected={absoluteIndex === activeStep}
                onClick={() => handleStepClick(absoluteIndex)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {isComplete ? (
                    <CheckCircleIcon fontSize="small" color="success" />
                  ) : hasWarning ? (
                    <WarningIcon fontSize="small" color="warning" />
                  ) : (
                    <UncheckedIcon fontSize="small" color="action" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={section.title}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { fontWeight: absoluteIndex === activeStep ? 600 : 400 },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
}; 