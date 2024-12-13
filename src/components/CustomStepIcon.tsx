import React from 'react';
import { Warning as WarningIcon, Check as CheckIcon } from '@mui/icons-material';
import { StepIconProps, styled, Tooltip, Box } from '@mui/material';

interface CompletionStatus {
  total: number;
  completed: number;
  required: number;
  completedRequired: number;
}

interface CustomStepIconProps extends StepIconProps {
  hasWarning?: boolean;
  isComplete?: boolean;
  isActive?: boolean;
  sectionTitle?: string;
  moduleName?: string;
  completionStatus?: CompletionStatus;
}

const StepIconRoot = styled('div')<{
  ownerState: { 
    active?: boolean; 
    hasWarning?: boolean; 
    completed?: boolean;
  };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[300],
  zIndex: 1,
  color: '#fff',
  width: 36,
  height: 36,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  cursor: 'pointer',

  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)',
  },

  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'scale(1.1)',
    },
  }),

  ...(ownerState.completed && {
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
      transform: 'scale(1.1)',
    },
  }),

  ...(ownerState.hasWarning && {
    backgroundColor: theme.palette.warning.main,
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
      transform: 'scale(1.1)',
    },
  }),
}));

const StepNumber = styled('div')<{
  ownerState: { active?: boolean };
}>(({ theme, ownerState }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: ownerState.active ? theme.palette.primary.contrastText : theme.palette.grey[700],
}));

const ProgressIndicator = styled('div')<{
  progress: number;
  type: 'total' | 'required';
}>(({ theme, progress, type }) => ({
  position: 'absolute',
  bottom: type === 'total' ? -4 : -8,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '24px',
  height: '3px',
  backgroundColor: theme.palette.grey[200],
  borderRadius: '2px',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${progress}%`,
    height: '100%',
    backgroundColor: type === 'total' 
      ? theme.palette.primary.main 
      : theme.palette.secondary.main,
    transition: 'width 0.3s ease-in-out',
  },
}));

export const CustomStepIcon: React.FC<CustomStepIconProps> = (props) => {
  const { 
    completed, 
    hasWarning, 
    icon, 
    sectionTitle,
    moduleName,
    completionStatus,
    isActive,
  } = props;

  const getTooltipContent = () => {
    if (!completionStatus) return sectionTitle;

    const requiredProgress = completionStatus.required > 0
      ? Math.round((completionStatus.completedRequired / completionStatus.required) * 100)
      : 100;
    const totalProgress = Math.round((completionStatus.completed / completionStatus.total) * 100);

    let status = '';
    if (completed) {
      status = 'Complete';
    } else if (hasWarning) {
      status = `Incomplete (${completionStatus.completedRequired}/${completionStatus.required} required fields)`;
    } else if (isActive) {
      status = 'Current section';
    }

    return (
      <Box sx={{ p: 1 }}>
        <Box sx={{ fontWeight: 600, mb: 0.5 }}>{sectionTitle}</Box>
        <Box sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 0.5 }}>
          {moduleName}
        </Box>
        <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          {status}
          <br />
          Required: {requiredProgress}% ({completionStatus.completedRequired}/{completionStatus.required})
          <br />
          Total: {totalProgress}% ({completionStatus.completed}/{completionStatus.total})
        </Box>
      </Box>
    );
  };

  const totalProgress = completionStatus 
    ? (completionStatus.completed / completionStatus.total) * 100
    : 0;

  const requiredProgress = completionStatus && completionStatus.required > 0
    ? (completionStatus.completedRequired / completionStatus.required) * 100
    : 100;

  return (
    <Tooltip 
      title={getTooltipContent()} 
      arrow 
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 4,
            '& .MuiTooltip-arrow': {
              color: 'background.paper',
            },
          },
        },
      }}
    >
      <Box>
        <StepIconRoot ownerState={{ active: isActive, completed, hasWarning }}>
          {completed ? (
            <CheckIcon sx={{ fontSize: 20 }} />
          ) : hasWarning ? (
            <WarningIcon sx={{ fontSize: 20 }} />
          ) : (
            <StepNumber ownerState={{ active: isActive }}>{icon}</StepNumber>
          )}
          <ProgressIndicator progress={totalProgress} type="total" />
          <ProgressIndicator progress={requiredProgress} type="required" />
        </StepIconRoot>
      </Box>
    </Tooltip>
  );
}; 