import React from 'react';
import {
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
  MenuBookOutlined,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { NarrativeModule, NarrativeSection } from './narrative';

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
    <Box
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        margin: 0,
        marginBottom: 2,
        height: '400px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ 
          p: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: `0 1px 2px ${theme.palette.divider}`,
        }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1,
              px: 0.5,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MenuBookOutlined color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Module Navigator
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PreviewIcon />}
                onClick={() => setIsModulePreviewOpen(true)}
                sx={{ 
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.875rem',
                  ml: 2,
                }}
              >
                Preview Module
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {currentModule.name}
            </Typography>
          </Box>
        </Box>
        <List component="nav" sx={{ px: 1.5, py: 1, flex: 1, width: '100%', boxSizing: 'border-box' }}>
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
                  py: 0.75,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
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
                    sx: { 
                      fontWeight: absoluteIndex === activeStep ? 600 : 400,
                      fontSize: '0.85rem',
                      lineHeight: 1.3,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}; 