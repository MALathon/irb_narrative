import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Article as ArticleIcon,
  DoubleArrow as DoubleArrowIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { NarrativeSection, ValidationStatus, NarrativeModule, ModuleCompletionStatus } from '../types/narrative';
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

// Simple navigation buttons component
const NavigationButtons: React.FC<{
  activeStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}> = ({ activeStep, totalSteps, onPrevious, onNext, nextButtonRef }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    mt: 3,
    mb: 2,
  }}>
    <Button
      disabled={activeStep === 0}
      onClick={onPrevious}
      variant="outlined"
      sx={{ minWidth: 100 }}
    >
      Previous
    </Button>

    <Button
      ref={nextButtonRef}
      disabled={activeStep === totalSteps - 1}
      onClick={onNext}
      variant="contained"
      sx={{ minWidth: 100 }}
    >
      Next
    </Button>
  </Box>
);

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
  const currentSection = sections[activeStep];
  
  // Group sections by module
  const modules = useMemo(() => {
    const moduleMap = new Map<string, NarrativeModule>();
    
    sections.forEach(section => {
      if (!moduleMap.has(section.moduleId)) {
        moduleMap.set(section.moduleId, {
          id: section.moduleId,
          name: section.moduleName,
          sections: [],
        });
      }
      moduleMap.get(section.moduleId)?.sections.push(section);
    });

    return Array.from(moduleMap.values());
  }, [sections]);

  // Get the module for a section
  const getModuleForSection = useCallback((sectionIndex: number) => {
    let currentIndex = 0;
    for (const module of modules) {
      if (currentIndex + module.sections.length > sectionIndex) {
        return module;
      }
      currentIndex += module.sections.length;
    }
    return modules[modules.length - 1];
  }, [modules]);

  const currentModule = useMemo(() => getModuleForSection(activeStep), [activeStep, getModuleForSection]);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [isModulePreviewOpen, setIsModulePreviewOpen] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    if (formRef.current) {
      const formElement = formRef.current;
      formElement.scrollTo({
        top: formElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Update the scroll hint visibility check
  useEffect(() => {
    const checkVisibility = () => {
      if (formRef.current && nextButtonRef.current) {
        const formRect = formRef.current.getBoundingClientRect();
        const nextButtonRect = nextButtonRef.current.getBoundingClientRect();
        
        // Check if the next button is below the visible area of the form
        const isNextButtonHidden = nextButtonRect.bottom > (formRect.top + formRef.current.clientHeight);
        
        // Only show scroll hint if next button exists and is hidden
        setShowScrollHint(isNextButtonHidden && activeStep < sections.length - 1);
      } else {
        setShowScrollHint(false);
      }
    };

    const formElement = formRef.current;
    if (formElement) {
      // Check visibility on scroll
      formElement.addEventListener('scroll', checkVisibility);
      // Check visibility on window resize
      window.addEventListener('resize', checkVisibility);
      // Check visibility on content changes
      const observer = new MutationObserver(checkVisibility);
      observer.observe(formElement, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
      
      // Initial check
      // Use setTimeout to ensure the check happens after the content is rendered
      setTimeout(checkVisibility, 0);

      return () => {
        formElement.removeEventListener('scroll', checkVisibility);
        window.removeEventListener('resize', checkVisibility);
        observer.disconnect();
      };
    }
  }, [activeStep, sections.length, currentSection?.id]); // Added currentSection?.id to dependencies

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

    // Only show warning if:
    // 1. The section has been visited
    // 2. It has errors or missing required fields
    // 3. It's not the current active step
    // 4. Either it's not the first step, or we've visited other steps
    const showWarning = hasBeenVisited && 
      (hasErrors || hasMissingRequired) && 
      stepIndex !== activeStep &&
      (stepIndex !== 0 || visitedSteps.size > 1);

    return {
      isComplete: !hasErrors && !hasMissingRequired && completionStatus.completed === completionStatus.total,
      hasWarning: showWarning,
      completionStatus,
    };
  }, [sections, visitedSteps, validation, getSectionCompletionStatus, activeStep]);

  const getModuleCompletionStatus = useCallback((module: NarrativeModule): ModuleCompletionStatus => {
    let total = 0;
    let completed = 0;
    let required = 0;
    let completedRequired = 0;
    let hasWarnings = false;

    module.sections.forEach(section => {
      const status = getSectionCompletionStatus(section);
      total += status.total;
      completed += status.completed;
      required += status.required;
      completedRequired += status.completedRequired;
      
      const sectionStatus = getStepStatus(sections.findIndex(s => s.id === section.id));
      if (sectionStatus.hasWarning) {
        hasWarnings = true;
      }
    });

    return {
      total,
      completed,
      required,
      completedRequired,
      hasWarnings,
      isComplete: completed === total && completedRequired === required && !hasWarnings,
    };
  }, [sections, getSectionCompletionStatus, getStepStatus]);

  const handleStepClick = useCallback((step: number) => {
    setActiveStep(step);
    setVisitedSteps(prev => new Set([...prev, step]));
  }, []);

  const renderModulePreview = () => {
    const currentModule = getModuleForSection(activeStep);
    return (
      <Modal
        open={isModulePreviewOpen}
        onClose={() => setIsModulePreviewOpen(false)}
        closeAfterTransition
        disablePortal
        keepMounted={false}
        disableEnforceFocus
        disableAutoFocus
        aria-labelledby="module-preview-title"
      >
        <Fade in={isModulePreviewOpen}>
          <Box
            role="dialog"
            aria-modal="true"
            aria-labelledby="module-preview-title"
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
              <Typography id="module-preview-title" variant="h6">
                {currentModule.name}
              </Typography>
              <IconButton 
                onClick={() => setIsModulePreviewOpen(false)}
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
                  p: 6,
                  minHeight: '100%',
                  boxShadow: theme.shadows[4],
                }}
              >
                {currentModule.sections.map((section, index) => (
                  <Box key={section.id} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    <DynamicTextPreview
                      section={section}
                      values={values}
                    />
                    {index < currentModule.sections.length - 1 && (
                      <Divider sx={{ my: 3 }} />
                    )}
                  </Box>
                ))}
              </Paper>
            </Box>
          </Box>
        </Fade>
      </Modal>
    );
  };

  const renderStepper = () => (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{ 
        mb: 0,
        width: '100%',
        '& .MuiStepLabel-root': {
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        '& .MuiStepLabel-label': {
          mt: 1,
          fontSize: '0.75rem',
          lineHeight: 1.2,
          textAlign: 'center',
          width: '100%',
          '&.Mui-active': {
            color: 'primary.main',
            fontWeight: 600,
          },
        },
        '& .MuiStepConnector-line': {
          borderColor: 'divider',
          borderWidth: '1px',
        },
        '& .MuiStepConnector-root': {
          top: '28px',
          left: 'calc(-50% + 20px)',
          right: 'calc(50% + 20px)',
        },
        '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
          borderColor: 'primary.main',
        },
        '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
          borderColor: 'success.main',
        },
        '& .MuiStep-root': {
          flex: 1,
          padding: '0 12px',
          minWidth: 0,
        },
        '& .MuiStepLabel-iconContainer': {
          py: 0,
          px: 0,
          marginRight: 0,
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1.25rem',
        },
        '& .MuiStepIcon-text': {
          fill: '#fff',
        },
      }}
    >
      {modules.map((module) => {
        const moduleStatus = getModuleCompletionStatus(module);
        const currentModule = getModuleForSection(activeStep);
        const isActiveModule = currentModule.id === module.id;

        return (
          <Step 
            key={module.id}
            completed={moduleStatus.isComplete}
            active={isActiveModule}
          >
            <StepLabel
              onClick={() => {
                const firstIncompleteSection = module.sections.findIndex((section) => {
                  const absoluteIndex = sections.findIndex(s => s.id === section.id);
                  const status = getStepStatus(absoluteIndex);
                  return !status.isComplete;
                });
                
                const targetIndex = firstIncompleteSection === -1
                  ? sections.findIndex(s => s.id === module.sections[0].id)
                  : sections.findIndex(s => s.id === module.sections[firstIncompleteSection].id);
                
                handleStepClick(targetIndex);
              }}
              StepIconComponent={(props) => (
                <CustomStepIcon 
                  {...props}
                  hasWarning={moduleStatus.hasWarnings}
                  isComplete={moduleStatus.isComplete}
                  isActive={isActiveModule}
                  completionStatus={{
                    total: moduleStatus.total,
                    completed: moduleStatus.completed,
                    required: moduleStatus.required,
                    completedRequired: moduleStatus.completedRequired,
                  }}
                  moduleName={module.name}
                />
              )}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                mt: 0.5,
                width: '100%',
                ...(isActiveModule && {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
                }),
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isActiveModule ? 'primary.main' : 'text.secondary',
                    fontWeight: isActiveModule ? 600 : 400,
                    fontSize: '0.75rem',
                    transition: 'all 0.2s ease-in-out',
                    textAlign: 'center',
                    width: '100%',
                    wordBreak: 'break-word',
                  }}
                >
                  {module.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isActiveModule ? 'primary.main' : 'text.secondary',
                    opacity: isActiveModule ? 1 : 0.7,
                    mt: 0.5,
                    fontSize: '0.7rem',
                  }}
                >
                  {moduleStatus.completed}/{moduleStatus.total} completed
                </Typography>
              </Box>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
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
              }}
            >
              {modules.map((module) => (
                <Box key={module.id} sx={{ mb: 6 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    {module.name}
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  {module.sections.map((section) => {
                    const absoluteIndex = sections.findIndex(s => s.id === section.id);
                    return (
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
                            handleStepClick(absoluteIndex);
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
                        <Typography variant="h6" gutterBottom>
                          {section.title}
                        </Typography>
                        <DynamicTextPreview
                          section={section}
                          values={values}
                        />
                        {module.sections.indexOf(section) < module.sections.length - 1 && (
                          <Divider sx={{ my: 3 }} />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );

  return (
    <Container maxWidth={false} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Stepper */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.default',
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: 2,
        py: 0.25,
      }}>
        {renderStepper()}
      </Box>

      {/* Main content */}
      <Box sx={{ 
        display: 'flex',
        gap: 4,
        flexGrow: 1,
        px: 3,
        overflow: 'hidden',
      }}>
        {/* Form content */}
        <Box 
          ref={formRef}
          sx={{ 
            flexGrow: 1,
            maxWidth: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px - 24px)`,
            overflowY: 'auto',
            py: 2,
            pr: 3,
            height: 'calc(100vh - 88px)',
            '& > div': {
              minHeight: 'min-content',
              paddingBottom: 'calc(88px + 2rem)',
            },
            // Custom scrollbar styling
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[300],
              borderRadius: '3px',
              '&:hover': {
                background: theme.palette.grey[400],
              },
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Form Paper */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="overline" color="text.secondary" gutterBottom>
                  {currentModule.name}
                </Typography>
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

              {/* Navigation Buttons */}
              <NavigationButtons
                activeStep={activeStep}
                totalSteps={sections.length}
                onPrevious={() => handleStepClick(activeStep - 1)}
                onNext={() => handleStepClick(activeStep + 1)}
                nextButtonRef={nextButtonRef}
              />
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Module Navigator */}
        {!isMobile && (
          <Paper
            elevation={3}
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              borderRadius: 2,
              margin: 2,
              marginRight: 3,
              marginLeft: 0,
              height: 'calc(100vh - 88px - 32px)',
              backgroundColor: theme.palette.grey[50],
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 2,
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                pointerEvents: 'none',
              }
            }}
          >
            <Box
              sx={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ 
                p: 3,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: `0 1px 2px ${theme.palette.divider}`,
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MenuBookIcon color="primary" />
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      Module Navigator
                    </Typography>
                  </Box>
                  <Tooltip title="View All Sections in Current Module" placement="left" arrow>
                    <Button
                      onClick={() => setIsModulePreviewOpen(true)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      startIcon={<ArticleIcon />}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                        transition: 'all 0.2s ease-in-out',
                        fontSize: '0.75rem',
                      }}
                    >
                      Preview Module
                    </Button>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {currentModule.name}
                </Typography>
              </Box>
              <List component="nav" sx={{ px: 2, py: 1, flex: 1 }}>
                {currentModule.sections.map((section) => {
                  const absoluteIndex = sections.findIndex(s => s.id === section.id);
                  const { isComplete, hasWarning } = getStepStatus(absoluteIndex);
                  return (
                    <ListItem
                      key={section.id}
                      button
                      selected={absoluteIndex === activeStep}
                      onClick={() => handleStepClick(absoluteIndex)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {isComplete ? (
                          <CheckCircleIcon fontSize="small" color="success" />
                        ) : hasWarning ? (
                          <WarningIcon fontSize="small" color="warning" />
                        ) : (
                          <UncheckedIcon fontSize="small" color="action" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={section.title}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: absoluteIndex === activeStep ? 600 : 400 },
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Paper>
        )}

        {/* Scroll hint */}
        {showScrollHint && (
          <IconButton
            onClick={scrollToBottom}
            color="primary"
            sx={{
              position: 'fixed',
              right: isMobile ? theme.spacing(4) : `calc(${DRAWER_WIDTH}px + ${theme.spacing(6)})`,
              bottom: theme.spacing(4),
              backgroundColor: 'background.paper',
              boxShadow: theme.shadows[6],
              zIndex: 1200,
              '&:hover': {
                backgroundColor: 'primary.light',
              },
              animation: 'bounce 1s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-5px)' },
              },
            }}
          >
            <DoubleArrowIcon sx={{ transform: 'rotate(90deg)' }} />
          </IconButton>
        )}
      </Box>

      {renderModulePreview()}
      {renderFullDocumentPreview()}
    </Container>
  );
}; 