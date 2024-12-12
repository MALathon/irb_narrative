import React from 'react';
import { Warning as WarningIcon, Check as CheckIcon } from '@mui/icons-material';
import { StepIconProps, styled, Tooltip, Box } from '@mui/material';

interface CustomStepIconProps extends StepIconProps {
  hasWarning?: boolean;
  isComplete?: boolean;
  isActive?: boolean;
  sectionTitle?: string;
  completionStatus?: {
    total: number;
    completed: number;
    required: number;
  };
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
}>(({ theme, progress }) => ({
  position: 'absolute',
  bottom: -4,
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
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease-in-out',
  },
}));

export const CustomStepIcon: React.FC<CustomStepIconProps> = (props) => {
  const { 
    completed, 
    hasWarning, 
    icon, 
    sectionTitle,
    completionStatus,
    isActive,
  } = props;

  const getTooltipContent = () => {
    if (completed) {
      return `${sectionTitle} - Complete`;
    }
    if (hasWarning) {
      return `${sectionTitle} - Incomplete (${completionStatus?.completed}/${completionStatus?.required} required fields)`;
    }
    if (isActive) {
      return `${sectionTitle} - Current section`;
    }
    return `Click to go to ${sectionTitle}`;
  };

  const progress = completionStatus 
    ? (completionStatus.completed / completionStatus.total) * 100
    : 0;

  return (
    <Tooltip title={getTooltipContent()} arrow placement="top">
      <Box>
        <StepIconRoot ownerState={{ active: isActive, completed, hasWarning }}>
          {completed ? (
            <CheckIcon sx={{ fontSize: 20 }} />
          ) : hasWarning ? (
            <WarningIcon sx={{ fontSize: 20 }} />
          ) : (
            <StepNumber ownerState={{ active: isActive }}>{icon}</StepNumber>
          )}
          <ProgressIndicator progress={progress} />
        </StepIconRoot>
      </Box>
    </Tooltip>
  );
}; 