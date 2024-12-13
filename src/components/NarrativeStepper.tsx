import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
} from '@mui/material';
import { NarrativeModule, ModuleCompletionStatus } from '../types/narrative';
import { CustomStepIcon } from './CustomStepIcon';

interface NarrativeStepperProps {
  modules: NarrativeModule[];
  activeStep: number;
  getModuleCompletionStatus: (module: NarrativeModule) => ModuleCompletionStatus;
  getModuleForSection: (sectionIndex: number) => NarrativeModule;
  handleStepClick: (step: number) => void;
  sections: any[];
}

interface StepStatus {
  isComplete: boolean;
}

export const NarrativeStepper: React.FC<NarrativeStepperProps> = ({
  modules,
  activeStep,
  getModuleCompletionStatus,
  getModuleForSection,
  handleStepClick,
  sections,
}) => {
  const getStepStatus = (sectionIndex: number): StepStatus => {
    const module = getModuleForSection(sectionIndex);
    const moduleStatus = getModuleCompletionStatus(module);
    return {
      isComplete: moduleStatus.isComplete
    };
  };

  return (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{ 
        mb: 0,
        width: '100%',
        '& .MuiStepLabel-root': {
          cursor: 'pointer',
          padding: '8px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '&.Mui-active': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s ease-in-out',
          }
        },
        '& .MuiStepLabel-label': {
          mt: 1.5,
          fontSize: '0.875rem',
          lineHeight: 1.2,
          textAlign: 'center',
          width: '100%',
          color: 'text.secondary',
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
          top: '24px',
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
          padding: '0 8px',
          minWidth: 0,
        },
        '& .MuiStepLabel-iconContainer': {
          py: 0,
          px: 0,
          marginRight: 0,
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
                width: '100%',
                gap: 0.5,
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isActiveModule ? 'primary.main' : 'text.primary',
                    fontWeight: isActiveModule ? 600 : 400,
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    width: '100%',
                    wordBreak: 'break-word',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {module.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isActiveModule ? 'primary.main' : 'text.secondary',
                    fontSize: '0.75rem',
                    opacity: isActiveModule ? 0.9 : 0.8,
                    fontWeight: isActiveModule ? 500 : 400,
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
}; 