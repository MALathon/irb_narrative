import React, { useMemo, memo } from 'react';
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

const MemoizedFieldRenderer = memo(({ 
  field, 
  value, 
  fieldPath, 
  onUpdate, 
  fieldErrors, 
  isVisible 
}: {
  field: any;
  value: FieldValue;
  fieldPath: string[];
  onUpdate: (path: string[], value: FieldValue) => void;
  fieldErrors: ValidationError[];
  isVisible: boolean;
}) => (
  <Box 
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
      isVisible={isVisible}
    />
  </Box>
));

const MemoizedExpansion = memo(({ 
  expansionSentence,
  expansionPath,
  values,
  onUpdate,
  errors,
  isFieldVisible
}: {
  expansionSentence: Sentence;
  expansionPath: string[];
  values: FormValues;
  onUpdate: (path: string[], value: FieldValue) => void;
  errors: Record<string, ValidationError[]>;
  isFieldVisible: (path: string[]) => boolean;
}) => (
  <Box 
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
));

export const FormSentenceRenderer: React.FC<FormSentenceRendererProps> = memo(({
  sentence,
  path,
  values,
  onUpdate,
  errors = {},
  isFieldVisible = () => true
}) => {
  const renderedFields = useMemo(() => {
    const fields: Record<string, React.ReactNode> = {};
    
    Object.entries(sentence.fields).forEach(([fieldId, field]) => {
      const fieldPath = [...path, fieldId];
      const value = get(values, fieldPath.join('.')) as FieldValue;
      const fieldErrors = errors[fieldPath.join('.')] || [];
      
      fields[fieldId] = (
        <MemoizedFieldRenderer
          key={fieldId}
          field={field}
          value={value}
          fieldPath={fieldPath}
          onUpdate={onUpdate}
          fieldErrors={fieldErrors}
          isVisible={isFieldVisible(fieldPath)}
        />
      );

      if (field.expansions && isFieldVisible(fieldPath)) {
        const expansionKey = (() => {
          if (value === null || value === undefined) return '';
          if (Array.isArray(value)) return value[0] || '';
          if (typeof value === 'object') {
            if ('value' in value) return value.value;
            const expansionKeys = Object.keys(value).filter(k => k.startsWith('expansion_'));
            if (expansionKeys.length > 0) {
              return expansionKeys[0].replace('expansion_', '');
            }
            const keys = Object.keys(value);
            if (keys.length > 0) return keys[0];
            return '';
          }
          return String(value);
        })();

        const expansionSentence = field.expansions?.[expansionKey];
        if (expansionSentence) {
          const expansionPath = [...fieldPath, `expansion_${expansionKey}`];
          fields[`${fieldId}_expansion`] = (
            <MemoizedExpansion
              key={`${fieldId}_expansion`}
              expansionSentence={expansionSentence}
              expansionPath={expansionPath}
              values={values}
              onUpdate={onUpdate}
              errors={errors}
              isFieldVisible={isFieldVisible}
            />
          );
        }
      }
    });

    return fields;
  }, [sentence.fields, path, values, onUpdate, errors, isFieldVisible]);

  const templateParts = useMemo(() => 
    sentence.template.split(/(\{[^}]+\})/g).map((part, index) => {
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
          {renderedFields[fieldId] || `{${fieldId}}`}
        </motion.span>
      );
    }),
    [sentence.template, renderedFields]
  );

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ my: 2 }}
    >
      <Typography component="div" sx={{ mb: 2 }}>
        {templateParts}
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
}); 