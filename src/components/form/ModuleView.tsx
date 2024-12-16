import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Alert, IconButton, Collapse } from '@mui/material';
import { ExpandMore, Lightbulb } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleConfig } from '../../types/form';
import { FormSentenceRenderer } from './SentenceRenderer';
import { useFormState } from '../../hooks/useFormState';

interface FormModuleViewProps {
  module: ModuleConfig;
  initialValues?: Record<string, any>;
  onValuesChange?: (values: Record<string, any>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const InstructionsPanel: React.FC<{ module: ModuleConfig }> = ({ module }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Paper 
      elevation={0}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ 
        p: 2,
        mb: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <IconButton 
          size="small" 
          sx={{ 
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <ExpandMore />
        </IconButton>
        <Lightbulb sx={{ ml: 1, color: 'primary.main' }} />
        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 500 }}>
          Instructions & Guidance
        </Typography>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ mt: 2, pl: 4 }}>
          {module.description && (
            <Typography 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              {module.description}
            </Typography>
          )}
          {module.guidance && (
            <Typography 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              variant="body2" 
              color="text.secondary" 
              sx={{ whiteSpace: 'pre-line' }}
            >
              {module.guidance}
            </Typography>
          )}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            sx={{ 
              mt: 2,
              p: 2,
              bgcolor: 'primary.50',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" color="primary.main">
              💡 Tip: Using pre-defined options helps expedite your review
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export const ModuleView: React.FC<FormModuleViewProps> = ({
  module,
  initialValues = {},
  onValuesChange,
  onValidationChange
}) => {
  const { values, updateValue, validation, validateForm, isFieldVisible } = useFormState(module, initialValues);

  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);

  useEffect(() => {
    onValidationChange?.(validation.isValid);
  }, [validation.isValid, onValidationChange]);

  useEffect(() => {
    validateForm();
  }, [values, validateForm]);

  const errorCount = Object.keys(validation.errors).length;

  return (
    <Container maxWidth="lg">
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{ py: 4 }}
      >
        <AnimatePresence>
          {errorCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                There {errorCount === 1 ? 'is' : 'are'} {errorCount} error{errorCount === 1 ? '' : 's'} in the form
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <InstructionsPanel module={module} />

        <Paper 
          elevation={0}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          sx={{ 
            p: 3, 
            mb: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
            {module.name}
          </Typography>

          {module.submoduleOrder.map((submoduleId, index) => {
            const submodule = module.submodules[submoduleId];
            return (
              <Box key={submoduleId} sx={{ mb: index < module.submoduleOrder.length - 1 ? 4 : 0 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {submodule.title}
                </Typography>
                <FormSentenceRenderer
                  sentence={submodule.sentence}
                  path={[submoduleId]}
                  values={values}
                  onUpdate={updateValue}
                  errors={validation.errors}
                  isFieldVisible={isFieldVisible}
                />
              </Box>
            );
          })}
        </Paper>
      </Box>
    </Container>
  );
}; 