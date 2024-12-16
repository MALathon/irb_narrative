import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Preview as PreviewIcon,
  MenuBookOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ModuleConfig, Sentence, FormValues, FieldValue } from '../../types/form';

interface FormNavigatorProps {
  module: ModuleConfig;
  values: FormValues;
  onPreviewClick: () => void;
  DRAWER_WIDTH?: number;
}

const isFieldComplete = (value: FieldValue): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== undefined && value !== '' && value !== null;
};

const getCompletionStatus = (
  module: ModuleConfig,
  values: FormValues
): {
  total: number;
  completed: number;
} => {
  let total = 0;
  let completed = 0;

  // Process each submodule
  for (const submoduleId of module.submoduleOrder) {
    const submodule = module.submodules[submoduleId];
    const submoduleStatus = getSubmoduleCompletionStatus(
      submodule.sentence,
      values,
      [submoduleId]
    );
    total += submoduleStatus.total;
    completed += submoduleStatus.completed;
  }

  return { total, completed };
};

const getSubmoduleCompletionStatus = (
  sentence: Sentence,
  values: FormValues,
  path: string[] = []
): {
  total: number;
  completed: number;
} => {
  let total = 0;
  let completed = 0;

  // Count fields in current sentence
  Object.entries(sentence.fields).forEach(([fieldId, field]) => {
    total++;
    const fieldPath = [...path, fieldId];
    const value = fieldPath.reduce<FormValues | FieldValue>((obj, key) => 
      (obj as FormValues)?.[key], 
      values
    ) as FieldValue;
    
    if (isFieldComplete(value)) {
      completed++;

      // Check expansions if they exist and are triggered
      if (field.expansions?.[value as string]) {
        const expansionStatus = getSubmoduleCompletionStatus(
          field.expansions[value as string],
          values,
          [...fieldPath, `expansion_${value}`]
        );
        total += expansionStatus.total;
        completed += expansionStatus.completed;
      }
    }
  });

  // Count fields in child sentences
  sentence.children?.forEach((child, index) => {
    const childStatus = getSubmoduleCompletionStatus(
      child,
      values,
      [...path, `child_${index}`]
    );
    total += childStatus.total;
    completed += childStatus.completed;
  });

  return { total, completed };
};

export const FormNavigator: React.FC<FormNavigatorProps> = ({
  module,
  values,
  onPreviewClick,
  DRAWER_WIDTH = 400
}) => {
  const theme = useTheme();
  const status = getCompletionStatus(module, values);
  const isComplete = status.completed === status.total;
  const hasWarning = status.completed < status.total;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
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
              <Box 
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <MenuBookOutlined color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Module Navigator
                </Typography>
              </Box>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PreviewIcon />}
                  onClick={onPreviewClick}
                  sx={{ 
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.875rem',
                    ml: 2,
                  }}
                >
                  Preview Module
                </Button>
              </motion.div>
            </Box>
            <Typography 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              variant="body2" 
              color="text.secondary" 
              sx={{ fontSize: '0.85rem' }}
            >
              {module.name}
            </Typography>
          </Box>
        </Box>

        <List component="nav" sx={{ px: 1.5, py: 1, flex: 1 }}>
          <ListItem
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              py: 0.75,
              backgroundColor: 'background.default',
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
              primary={`${status.completed}/${status.total} fields completed`}
              primaryTypographyProps={{
                variant: 'body2',
                sx: { 
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  lineHeight: 1.3,
                },
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}; 