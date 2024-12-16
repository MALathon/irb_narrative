import React from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ModuleConfig, Sentence, FormValues, FieldValue } from '../../types/form';

interface FormPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  module: ModuleConfig;
  values: FormValues;
}

const getDisplayValue = (value: FieldValue, options?: { value: string; label: string }[]): string => {
  if (Array.isArray(value)) {
    return value
      .map(v => options?.find(opt => opt.value === v)?.label || v)
      .join(', ');
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (options?.length) {
    return options.find(opt => opt.value === value)?.label || String(value);
  }

  return String(value);
};

const renderSentencePreview = (
  sentence: Sentence,
  values: FormValues,
  path: string[] = []
): React.ReactNode => {
  let text = sentence.template;

  // Replace field placeholders with values
  Object.entries(sentence.fields).forEach(([fieldId, field]) => {
    const fieldPath = [...path, fieldId];
    const value = fieldPath.reduce<FormValues | FieldValue>((obj, key) => 
      (obj as FormValues)?.[key], 
      values
    ) as FieldValue;
    
    if (value !== undefined && value !== '' && value !== null) {
      const displayValue = getDisplayValue(value, field.options);
      text = text.replace(`{${fieldId}}`, displayValue);

      // Handle expansions
      if (field.expansions?.[value as string]) {
        const expansionText = renderSentencePreview(
          field.expansions[value as string],
          values,
          [...fieldPath, `expansion_${value}`]
        );
        text = text.replace(`{${fieldId}}`, `${displayValue} ${expansionText}`);
      }
    } else {
      text = text.replace(`{${fieldId}}`, '____');
    }
  });

  // Render child sentences
  const childrenText = sentence.children?.map((child, index) =>
    renderSentencePreview(child, values, [...path, `child_${index}`])
  ).join(' ');

  return <>{text} {childrenText}</>;
};

const renderModulePreview = (
  module: ModuleConfig,
  values: FormValues
): React.ReactNode => {
  return (
    <>
      {module.submoduleOrder.map((submoduleId) => {
        const submodule = module.submodules[submoduleId];
        return (
          <Box key={submoduleId} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {submodule.title}
            </Typography>
            {renderSentencePreview(submodule.sentence, values, [submoduleId])}
          </Box>
        );
      })}
    </>
  );
};

export const FormPreview: React.FC<FormPreviewProps> = ({
  isOpen,
  onClose,
  module,
  values
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      disablePortal
      keepMounted={false}
      aria-labelledby="module-preview-title"
    >
      <Fade in={isOpen}>
        <Box
          role="dialog"
          aria-modal="true"
          aria-labelledby="module-preview-title"
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          tabIndex={-1}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            maxWidth: 1000,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography 
              id="module-preview-title" 
              variant="h6"
              component={motion.h2}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {module.name}
            </Typography>
            <IconButton 
              onClick={onClose}
              size="small"
              aria-label="Close preview"
              component={motion.button}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 4,
              backgroundColor: '#f8f9fa',
            }}
          >
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              sx={{
                maxWidth: 800,
                mx: 'auto',
                p: 6,
                minHeight: '100%',
                boxShadow: theme => theme.shadows[4],
                position: 'relative',
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 500,
                  mb: 3
                }}
              >
                {module.name}
              </Typography>
              <Box sx={{ mt: 4 }}>
                {renderModulePreview(module, values)}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}; 