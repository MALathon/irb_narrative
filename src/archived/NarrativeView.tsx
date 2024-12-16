import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Box, Container, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { DoubleArrow as DoubleArrowIcon } from '@mui/icons-material';
import { NarrativeSection, ValidationStatus, NarrativeModule, ModuleCompletionStatus } from './narrative';
import { NarrativeStepper } from './NarrativeStepper';
import { NarrativeForm, InstructionsBox } from './NarrativeForm';
import { NarrativeModuleNavigator } from './NarrativeModuleNavigator';
import { NarrativePreviewModal } from './NarrativePreviewModal';

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
  const currentSection = sections[activeStep];
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [isModulePreviewOpen, setIsModulePreviewOpen] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true);

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

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        height: '100%',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        height: '100%',
        position: 'relative',
      }}>
        <NarrativeStepper
          modules={modules}
          activeStep={activeStep}
          getModuleCompletionStatus={getModuleCompletionStatus}
          getModuleForSection={getModuleForSection}
          handleStepClick={handleStepClick}
          sections={sections}
        />
        
        <Box sx={{ 
          display: 'flex',
          gap: 3,
          height: 'calc(100% - 72px)', // Account for stepper height
        }}>
          {!isMobile && (
            <Box sx={{ 
              width: DRAWER_WIDTH,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}>
              <NarrativeModuleNavigator
                currentModule={currentModule}
                sections={sections}
                activeStep={activeStep}
                handleStepClick={handleStepClick}
                getStepStatus={getStepStatus}
                setIsModulePreviewOpen={setIsModulePreviewOpen}
                DRAWER_WIDTH={DRAWER_WIDTH}
              />
              <Box sx={{
                borderRadius: 2,
                '& .MuiTypography-root': {
                  fontSize: '0.95rem',
                },
              }}>
                <InstructionsBox
                  currentSection={sections[activeStep]}
                  isInstructionsExpanded={isInstructionsExpanded}
                  setIsInstructionsExpanded={setIsInstructionsExpanded}
                />
              </Box>
            </Box>
          )}

          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>
            <Box
              ref={formRef}
              sx={{
                flex: 1,
                overflowY: 'auto',
                maxWidth: '100%',
                p: 1,
              }}
            >
              <NarrativeForm
                currentSection={currentSection}
                currentModule={currentModule}
                values={values}
                onUpdate={onUpdate}
                activeStep={activeStep}
                sections={sections}
                handleStepClick={handleStepClick}
                nextButtonRef={nextButtonRef}
                isInstructionsExpanded={isInstructionsExpanded}
                setIsInstructionsExpanded={setIsInstructionsExpanded}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {showScrollHint && (
        <IconButton
          onClick={scrollToBottom}
          color="primary"
          sx={{
            position: 'fixed',
            right: theme.spacing(4),
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

      <NarrativePreviewModal
        isOpen={isModulePreviewOpen}
        onClose={() => setIsModulePreviewOpen(false)}
        currentModule={currentModule}
        values={values}
        onUpdate={onUpdate}
      />
      <NarrativePreviewModal
        isOpen={isPreviewOpen}
        onClose={onPreviewClose}
        modules={modules}
        values={values}
        handleStepClick={handleStepClick}
        onUpdate={onUpdate}
      />
    </Container>
  );
}; 