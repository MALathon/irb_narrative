import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Modal,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { NarrativeSection, ValidationStatus } from '../types/narrative';
import { DynamicNarrativeSection } from './DynamicNarrativeSection';
import { DynamicTextPreview } from './DynamicTextPreview';
import { CustomStepIcon } from './CustomStepIcon';

interface NarrativeViewProps {
  sections: NarrativeSection[];
  values: { [key: string]: any };
  onUpdate: (fieldId: string, value: any) => void;
  validation?: ValidationStatus;
  isPreviewOpen: boolean;
  onPreviewClose: () => void;
}

const DRAWER_WIDTH = 400;
const VISIBLE_STEPS = 5;

export const NarrativeView: React.FC<NarrativeViewProps> = ({
  sections,
  values,
  onUpdate,
  validation,
  isPreviewOpen,
  onPreviewClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const previewRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize refs array
    previewRefs.current = sections.map((_, i) => previewRefs.current[i] || null);
  }, [sections]);

  useEffect(() => {
    // Scroll to active section in preview
    const activeRef = previewRefs.current[activeStep];
    if (activeRef) {
      activeRef.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeStep]);

  const handleStepClick = useCallback((step: number) => {
    setActiveStep(step);
    setVisitedSteps(prev => new Set([...prev, step]));
    
    // Adjust carousel position if needed
    if (step < carouselStart) {
      setCarouselStart(Math.max(0, step));
    } else if (step >= carouselStart + VISIBLE_STEPS) {
      setCarouselStart(Math.min(sections.length - VISIBLE_STEPS, step));
    }
  }, [carouselStart, sections.length]);

  const handleFastForward = () => {
    const newStart = Math.min(sections.length - VISIBLE_STEPS, carouselStart + VISIBLE_STEPS);
    setCarouselStart(newStart);
    setActiveStep(newStart);
  };

  const handleFastRewind = () => {
    const newStart = Math.max(0, carouselStart - VISIBLE_STEPS);
    setCarouselStart(newStart);
    setActiveStep(newStart);
  };

  const handleCarouselScroll = (direction: 'left' | 'right') => {
    const newStart = direction === 'left' 
      ? Math.max(0, carouselStart - 1)
      : Math.min(sections.length - VISIBLE_STEPS, carouselStart + 1);
    setCarouselStart(newStart);
  };

  const getSectionCompletionStatus = useCallback((section: NarrativeSection) => {
    const sectionFields = section.fields;
    const requiredFields = sectionFields.filter(field => 
      field.validation?.some(v => v.type === 'required')
    );
    
    const completedFields = sectionFields.filter(field => {
      const value = values[field.id];
      return value !== undefined && value !== '' && value !== null;
    });

    const completedRequiredFields = requiredFields.filter(field => {
      const value = values[field.id];
      return value !== undefined && value !== '' && value !== null;
    });

    return {
      total: sectionFields.length,
      completed: completedFields.length,
      required: requiredFields.length,
      completedRequired: completedRequiredFields.length,
    };
  }, [values]);

  const getStepStatus = useCallback((stepIndex: number) => {
    const section = sections[stepIndex];
    const hasBeenVisited = visitedSteps.has(stepIndex);
    const completionStatus = getSectionCompletionStatus(section);
    
    const hasErrors = validation?.errors && section.fields.some(field => 
      validation.errors[field.id]?.length > 0
    );
    
    const hasMissingRequired = completionStatus.required > completionStatus.completedRequired;

    return {
      isComplete: !hasErrors && !hasMissingRequired && completionStatus.completed === completionStatus.total,
      hasWarning: hasBeenVisited && (hasErrors || hasMissingRequired),
      completionStatus,
    };
  }, [sections, visitedSteps, validation, getSectionCompletionStatus]);

  const renderNavigationPanel = () => (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        p: 3,
        backgroundColor: theme.palette.background.default,
        scrollBehavior: 'smooth',
      }}
    >
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 3 }}>
        Navigation
      </Typography>
      {sections.map((section, index) => (
        <Paper
          key={section.id}
          ref={el => previewRefs.current[index] = el}
          sx={{
            p: 3,
            mb: 2,
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            scrollMarginTop: theme.spacing(2),
            '&:hover': {
              transform: 'translateX(-8px)',
              boxShadow: theme.shadows[4],
            },
            ...(index === activeStep && {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              backgroundColor: 'rgba(33, 150, 243, 0.04)',
            }),
          }}
          onClick={() => handleStepClick(index)}
        >
          <Typography variant="subtitle1" gutterBottom>
            {section.title}
          </Typography>
          <DynamicTextPreview
            section={section}
            values={values}
          />
        </Paper>
      ))}
    </Box>
  );

  const renderFullDocumentPreview = () => (
    <Modal
      open={isPreviewOpen}
      onClose={onPreviewClose}
      closeAfterTransition
      disablePortal
      keepMounted={false}
      disableEnforceFocus
      disableAutoFocus
      aria-labelledby="document-preview-title"
    >
      <Fade in={isPreviewOpen}>
        <Box
          role="dialog"
          aria-modal="true"
          aria-labelledby="document-preview-title"
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            maxWidth: 1200,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
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
            <Typography id="document-preview-title" variant="h6">
              Document Preview
            </Typography>
            <IconButton 
              onClick={onPreviewClose}
              size="small"
              aria-label="Close preview"
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
              sx={{
                maxWidth: 800,
                mx: 'auto',
                p: 8,
                minHeight: '100%',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  cursor: 'text',
                  '& .section-link': {
                    opacity: 1,
                  },
                },
              }}
            >
              {sections.map((section, index) => (
                <Box
                  key={section.id}
                  sx={{
                    mb: 4,
                    position: 'relative',
                    '&:hover': {
                      '& .section-link': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Button
                    className="section-link"
                    variant="text"
                    size="small"
                    onClick={() => {
                      handleStepClick(index);
                      onPreviewClose();
                    }}
                    sx={{
                      position: 'absolute',
                      left: -6,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      transform: 'translateX(-100%)',
                      textTransform: 'none',
                    }}
                  >
                    Edit Section
                  </Button>
                  <Typography variant="h6" gutterBottom color="primary">
                    {section.title}
                  </Typography>
                  <DynamicTextPreview
                    section={section}
                    values={values}
                  />
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );

  const renderStepper = () => {
    const leftHidden = carouselStart;
    const rightHidden = Math.max(0, sections.length - (carouselStart + VISIBLE_STEPS));

    return (
      <Box
        sx={{
          width: '100%',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {leftHidden > 0 && (
            <>
              <IconButton onClick={handleFastRewind} color="primary">
                <FastRewindIcon />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                +{leftHidden}
              </Typography>
              <IconButton onClick={() => handleCarouselScroll('left')} size="small">
                <KeyboardArrowLeft />
              </IconButton>
            </>
          )}
        </Box>

        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            flex: 1,
            '& .MuiStepLabel-root': {
              cursor: 'pointer',
            },
          }}
        >
          {sections.slice(carouselStart, carouselStart + VISIBLE_STEPS).map((section, index) => {
            const absoluteIndex = index + carouselStart;
            const { isComplete, hasWarning, completionStatus } = getStepStatus(absoluteIndex);
            return (
              <Step key={section.id} completed={isComplete}>
                <StepLabel
                  onClick={() => handleStepClick(absoluteIndex)}
                  StepIconComponent={(props) => (
                    <CustomStepIcon 
                      {...props} 
                      hasWarning={hasWarning && visitedSteps.has(absoluteIndex) && absoluteIndex !== activeStep}
                      sectionTitle={section.title}
                      completionStatus={completionStatus}
                    />
                  )}
                >
                  {section.title}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {rightHidden > 0 && (
            <>
              <IconButton onClick={() => handleCarouselScroll('right')} size="small">
                <KeyboardArrowRight />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                +{rightHidden}
              </Typography>
              <IconButton onClick={handleFastForward} color="primary">
                <FastForwardIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    );
  };

  const currentSection = sections[activeStep];

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      {renderStepper()}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flexGrow: 1, maxWidth: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)` }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme => {
                      const status = getStepStatus(activeStep);
                      if (status.isComplete) return theme.palette.success.main;
                      if (status.hasWarning && visitedSteps.has(activeStep)) return theme.palette.warning.main;
                      return theme.palette.primary.main;
                    },
                  },
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {currentSection.title}
                </Typography>
                {currentSection.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {currentSection.description}
                  </Typography>
                )}
                
                <DynamicTextPreview
                  section={currentSection}
                  values={values}
                />

                <DynamicNarrativeSection
                  section={currentSection}
                  values={values}
                  onUpdate={onUpdate}
                  errors={validation?.errors}
                />
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={() => handleStepClick(activeStep - 1)}
                  variant="outlined"
                >
                  Previous
                </Button>
                <Button
                  disabled={activeStep === sections.length - 1}
                  onClick={() => handleStepClick(activeStep + 1)}
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {!isMobile && (
          <Paper
            elevation={0}
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              borderLeft: `1px solid ${theme.palette.divider}`,
              height: `calc(100vh - ${theme.spacing(20)})`,
              position: 'sticky',
              top: theme.spacing(20),
              overflowY: 'auto',
            }}
          >
            {renderNavigationPanel()}
          </Paper>
        )}
      </Box>
      {renderFullDocumentPreview()}
    </Container>
  );
}; 