import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  ExpandMore,
  Lightbulb,
} from '@mui/icons-material';
import { NarrativeSection } from '../types/narrative';
import { DynamicTextPreview } from './DynamicTextPreview';
import { NavigationButtons } from './NavigationButtons';

interface NarrativeFormProps {
  currentSection: NarrativeSection;
  currentModule: any;
  values: { [key: string]: any };
  onUpdate: (fieldId: string, value: any) => void;
  activeStep: number;
  sections: NarrativeSection[];
  handleStepClick: (step: number) => void;
  nextButtonRef: React.RefObject<HTMLButtonElement>;
  isInstructionsExpanded: boolean;
  setIsInstructionsExpanded: (expanded: boolean) => void;
}

export const NarrativeForm: React.FC<NarrativeFormProps> = ({
  currentSection,
  currentModule,
  values,
  onUpdate,
  activeStep,
  sections,
  handleStepClick,
  nextButtonRef,
  isInstructionsExpanded,
  setIsInstructionsExpanded,
}) => {
  return (
    <motion.div
      key={activeStep}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Paper elevation={2} sx={{ 
        p: 4, 
        mb: 3,
        position: 'relative',
      }}>
        <Box sx={{ mb: 4, borderLeft: 4, borderColor: 'primary.main', pl: 2 }}>
          <Typography variant="overline" color="text.secondary" gutterBottom>
            {currentModule.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {currentSection.title}
          </Typography>
        </Box>

        <Box sx={{ 
          mb: 4, 
          p: 3, 
          bgcolor: 'grey.50', 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }} 
          onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}>
            <IconButton 
              size="small" 
              sx={{ 
                transform: isInstructionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            >
              <ExpandMore fontSize="small" />
            </IconButton>
            <Lightbulb 
              sx={{ 
                color: 'primary.main',
                fontSize: '1.2rem',
                mr: 1 
              }} 
            />
            <Typography variant="subtitle1" color="text.primary" sx={{ 
              fontWeight: 500,
              flex: 1 
            }}>
              What we're asking
            </Typography>
          </Box>
          <Collapse in={isInstructionsExpanded}>
            <Box sx={{ mt: 2, pl: 7 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                Help us understand why your AI/ML study is necessary. Click the highlighted elements in the narrative below to make your selections.
              </Typography>
              {currentSection.guidance && (
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line' 
                  }}
                >
                  {currentSection.guidance}
                </Typography>
              )}
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: 'primary.50', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Typography variant="body2" color="primary.main">
                  💡 Tip: Using pre-defined options helps expedite your review
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <DynamicTextPreview
            section={currentSection}
            values={values}
            onUpdate={onUpdate}
          />
        </Paper>

        <NavigationButtons
          activeStep={activeStep}
          totalSteps={sections.length}
          onPrevious={() => handleStepClick(activeStep - 1)}
          onNext={() => handleStepClick(activeStep + 1)}
          nextButtonRef={nextButtonRef}
        />
      </Paper>
    </motion.div>
  );
}; 