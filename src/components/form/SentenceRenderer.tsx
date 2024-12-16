import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { get } from 'lodash';
import { Sentence, FormValues, FieldValue, ValidationError } from '../../types/form';
import { FieldRenderer } from './FieldRenderer';

interface FormSentenceRendererProps {
  sentence: Sentence;
  path: string[];
  values: FormValues;
  onUpdate: (path: string[], value: FieldValue) => void;
  errors?: Record<string, ValidationError[]>;
  isFieldVisible?: (path: string[]) => boolean;
}

const renderTemplate = (
  template: string,
  fields: Record<string, React.ReactNode>
): React.ReactNode[] => {
  const parts = template.split(/(\{[^}]+\})/g);
  
  return parts.map((part, index) => {
    const match = part.match(/\{(\w+)\}/);
    if (!match) return part;

    const fieldId = match[1];
    return (
      <motion.span
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="field-wrapper"
      >
        {fields[fieldId] || `{${fieldId}}`}
      </motion.span>
    );
  });
};

export const FormSentenceRenderer: React.FC<FormSentenceRendererProps> = ({
  sentence,
  path,
  values,
  onUpdate,
  errors = {},
  isFieldVisible = () => true
}) => {
  const renderedFields: Record<string, React.ReactNode> = {};
  
  // First render all base fields
  Object.entries(sentence.fields).forEach(([fieldId, field]) => {
    const fieldPath = [...path, fieldId];
    const value = get(values, fieldPath.join('.')) as FieldValue;
    const fieldErrors = errors[fieldPath.join('.')] || [];

    renderedFields[fieldId] = (
      <Box 
        key={fieldId}
        component={motion.div}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        sx={{ display: 'inline-block', mx: 1 }}
      >
        <FieldRenderer
          field={field}
          value={value}
          path={fieldPath}
          onUpdate={onUpdate}
          errors={fieldErrors}
          isVisible={isFieldVisible(fieldPath)}
        />
      </Box>
    );

    // Render expansion if it exists
    if (value && field.expansions?.[value as string]) {
      const expansionSentence = field.expansions[value as string];
      const expansionPath = [...fieldPath, `expansion_${value}`];
      
      renderedFields[`${fieldId}_expansion`] = (
        <Box 
          key={`${fieldId}_expansion`}
          component={motion.div}
          sx={{ display: 'inline-block', ml: 1 }}
        >
          <FormSentenceRenderer
            sentence={expansionSentence}
            path={expansionPath}
            values={values}
            onUpdate={onUpdate}
            errors={errors}
            isFieldVisible={isFieldVisible}
          />
        </Box>
      );
    }
  });

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ my: 2 }}
    >
      <Typography component="div" sx={{ mb: 2 }}>
        {renderTemplate(sentence.template, renderedFields)}
      </Typography>

      {/* Render expansion fields */}
      {Object.entries(renderedFields)
        .filter(([key]) => key.endsWith('_expansion'))
        .map(([key, element]) => (
          <React.Fragment key={key}>{element}</React.Fragment>
        ))}

      {/* Render children */}
      {sentence.children?.map((child, index) => (
        <Box 
          key={`child_${index}`}
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          sx={{ ml: 3, mt: 2, borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}
        >
          <FormSentenceRenderer
            sentence={child}
            path={[...path, `child_${index}`]}
            values={values}
            onUpdate={onUpdate}
            errors={errors}
            isFieldVisible={isFieldVisible}
          />
        </Box>
      ))}
    </Box>
  );
}; 