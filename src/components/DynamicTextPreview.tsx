import React from 'react';
import { Box, Typography, Chip, Tooltip, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { NarrativeSection, Field } from '../types/narrative';

interface DynamicTextPreviewProps {
  section: NarrativeSection;
  values: { [key: string]: any };
}

export const DynamicTextPreview: React.FC<DynamicTextPreviewProps> = ({
  section,
  values,
}) => {
  const theme = useTheme();

  const renderPlaceholder = (field: Field) => (
    <Tooltip title={`Please fill in: ${field.label}`} arrow placement="top">
      <Chip
        label={field.label}
        size="small"
        variant="outlined"
        color="primary"
        sx={{
          mx: 0.5,
          backgroundColor: 'rgba(33, 150, 243, 0.08)',
          borderStyle: 'dashed',
          cursor: 'default',
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.12)',
          },
        }}
      />
    </Tooltip>
  );

  const renderValue = (field: Field, value: any) => {
    if (field.type === 'select' || field.type === 'radio') {
      const option = field.options?.find(opt => opt.value === value);
      return option?.label || value;
    }

    if (field.type === 'multiSelect') {
      const selectedOptions = field.options?.filter(opt => 
        Array.isArray(value) && value.includes(opt.value)
      );
      return selectedOptions?.map(opt => opt.label).join(', ') || value;
    }

    if (field.type === 'date') {
      return value instanceof Date ? value.toLocaleDateString() : value;
    }

    return value;
  };

  const renderTemplate = (template: string) => {
    const parts = template.split(/(\{[^}]+\})/g);
    return parts.map((part, index) => {
      const match = part.match(/^\{([^}]+)\}$/);
      if (match) {
        const [fieldId, modifier] = match[1].split(',').map(s => s.trim());
        const field = section.fields.find(f => f.id === fieldId);
        if (!field) return null;

        const value = values[fieldId];
        if (!value) {
          return (
            <Box component="span" key={index} sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
              {renderPlaceholder(field)}
            </Box>
          );
        }

        if (modifier?.startsWith('select:')) {
          const [trueValue, falseValue] = modifier
            .replace('select:', '')
            .split('|')
            .map(s => s.trim());
          return value ? trueValue : falseValue;
        }

        return (
          <Box 
            component="span" 
            key={index}
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 500,
            }}
          >
            {renderValue(field, value)}
          </Box>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="body1"
        component={motion.div}
        sx={{
          lineHeight: 2,
          backgroundColor: theme.palette.background.paper,
          p: 3,
          borderRadius: 1,
          boxShadow: theme.shadows[1],
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTemplate(section.template)}
      </Typography>

      <AnimatePresence>
        {section.dynamicContent?.map((content, index) => {
          const shouldShow = (() => {
            const { fieldId, value, operator = 'equals' } = content.condition;
            const fieldValue = values[fieldId];

            switch (operator) {
              case 'contains':
                return Array.isArray(fieldValue) && fieldValue.includes(value);
              case 'in':
                return Array.isArray(value) && value.includes(fieldValue);
              case 'not':
                return fieldValue !== value;
              case 'greater':
                return fieldValue > value;
              case 'less':
                return fieldValue < value;
              default:
                return fieldValue === value;
            }
          })();

          return shouldShow ? (
            <Typography
              key={index}
              variant="body1"
              component={motion.div}
              sx={{
                mt: 2,
                lineHeight: 2,
                backgroundColor: 'rgba(33, 150, 243, 0.04)',
                p: 2,
                borderRadius: 1,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTemplate(content.content)}
            </Typography>
          ) : null;
        })}
      </AnimatePresence>
    </Box>
  );
}; 