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
import { NarrativeSection } from './narrative';
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
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 3,
        }}>
          <Box sx={{ 
            p: 2,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: theme => theme.shadows[2],
          }}>
            <Box sx={{ 
              borderLeft: 4, 
              borderColor: 'primary.main', 
              pl: 2,
            }}>
              <Typography 
                variant="overline" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                {currentModule.name}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.3,
                }}
              >
                {currentSection.title}
              </Typography>
            </Box>
          </Box>

          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              position: 'relative',
              backgroundColor: 'background.paper',
              boxShadow: theme => theme.shadows[2],
              p: 4,
            }}
          >
            <DynamicTextPreview
              section={currentSection}
              values={values}
              onUpdate={onUpdate}
            />
            <Box sx={{ mt: 2 }}>
              <NavigationButtons
                activeStep={activeStep}
                totalSteps={sections.length}
                onPrevious={() => handleStepClick(activeStep - 1)}
                onNext={() => handleStepClick(activeStep + 1)}
                nextButtonRef={nextButtonRef}
              />
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

interface InstructionsBoxProps {
  currentSection: NarrativeSection;
  isInstructionsExpanded: boolean;
  setIsInstructionsExpanded: (expanded: boolean) => void;
}

export const InstructionsBox: React.FC<InstructionsBoxProps> = ({
  currentSection,
  isInstructionsExpanded,
  setIsInstructionsExpanded,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: theme => theme.shadows[2],
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        gap: 1,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8
        }
      }} 
      onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            }} 
          />
        </Box>
        <Typography variant="subtitle1" color="text.primary" sx={{ 
          fontWeight: 500,
          flex: 1,
          pt: 0.5
        }}>
          What we're asking for and why.
        </Typography>
      </Box>
      <Collapse in={isInstructionsExpanded}>
        <Box sx={{ mt: 2, pl: 2 }}>
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
  );
} 