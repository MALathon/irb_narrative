import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DynamicField } from './DynamicField';
import { DynamicSectionProps } from '../types/narrative';
import { format } from 'date-fns';

export const DynamicNarrativeSection: React.FC<DynamicSectionProps> = ({
  section,
  values,
  onUpdate,
  errors,
}) => {
  const renderFieldValue = (value: any): string => {
    if (value instanceof Date) {
      return format(value, 'MM/dd/yyyy');
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value ?? '');
  };

  return (
    <Paper elevation={0}>
      <Box sx={{ p: 2 }}>
        {section.fields.map((field) => (
          <Box key={field.id} sx={{ mb: 3 }}>
            <DynamicField
              field={field}
              value={values[field.id]}
              onChange={(value) => onUpdate(field.id, value)}
              error={errors?.[field.id]?.[0]}
            />
            {values[field.id] && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Current value: {renderFieldValue(values[field.id])}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}; 