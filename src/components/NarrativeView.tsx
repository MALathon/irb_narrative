import React, { useState, useCallback, useMemo } from 'react';
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
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [isModulePreviewOpen, setIsModulePreviewOpen] = useState(false);

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

    // Only show warning if it's not the first step or if we've visited other steps
    const showWarning = hasBeenVisited && (hasErrors || hasMissingRequired) && (stepIndex !== 0 || visitedSteps.size > 1);

    return {
      isComplete: !hasErrors && !hasMissingRequired && completionStatus.completed === completionStatus.total,
      hasWarning: showWarning,
      completionStatus,
    };
  }, [sections, visitedSteps, validation, getSectionCompletionStatus]);

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

  const renderNavigationPanel = () => {
    const currentModule = getModuleForSection(activeStep);
    return (
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Module Navigator
            </Typography>
            <Tooltip title="Read Current Module">
              <IconButton
                onClick={() => setIsModulePreviewOpen(true)}
                size="small"
                color="primary"
              >
                <ArticleIcon />
              </IconButton>
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
    );
  };

  const renderStepper = () => (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{ 
        mb: 4,
        '& .MuiStepLabel-root': {
          cursor: 'pointer',
        },
      }}
    >
      {modules.map((module) => {
        const moduleStatus = getModuleCompletionStatus(module);
        return (
          <Step 
            key={module.id}
            completed={moduleStatus.isComplete}
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
              {module.name}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );

  const currentSection = sections[activeStep];
  const currentModule = getModuleForSection(activeStep);

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
    <Container 
      maxWidth={false} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        pt: `${theme.spacing(8)}`,
      }}
    >
      <Box 
        sx={{ 
          position: 'fixed',
          top: theme.spacing(8),
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar - 1,
          backgroundColor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ py: 2 }}>
            {renderStepper()}
          </Box>
        </Container>
      </Box>

      <Box sx={{ height: theme.spacing(8) }} />
      
      <Box 
        sx={{ 
          display: 'flex',
          gap: 3,
          flexGrow: 1,
          px: 3,
        }}
      >
        <Box 
          sx={{ 
            flexGrow: 1,
            maxWidth: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
            overflowY: 'auto',
            height: `calc(100vh - ${theme.spacing(24)})`,
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
                      if (status.hasWarning) return theme.palette.warning.main;
                      return theme.palette.primary.main;
                    },
                  },
                }}
              >
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
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
              height: `calc(100vh - ${theme.spacing(24)})`,
              position: 'sticky',
              top: theme.spacing(16),
              overflowY: 'auto',
            }}
          >
            {renderNavigationPanel()}
          </Paper>
        )}
      </Box>
      {renderModulePreview()}
      {renderFullDocumentPreview()}
    </Container>
  );
}; 