import React from 'react';
import { StepIconProps } from '@mui/material';
import { Box, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

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
  completionStatus: CompletionStatus;
  moduleName: string;
}

export const CustomStepIcon: React.FC<CustomStepIconProps> = ({
  hasWarning,
  isComplete,
  isActive,
  completionStatus,
  moduleName,
}) => {
  const requiredProgress = Math.round((completionStatus.completedRequired / completionStatus.required) * 100);

  const tooltipContent = (
    <>
      {moduleName}
      <br />
      {completionStatus.completed}/{completionStatus.total} fields completed
      <br />
      Required fields: {requiredProgress}% ({completionStatus.completedRequired}/{completionStatus.required})
      {hasWarning && <br />}
      {hasWarning && 'Some fields need attention'}
    </>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
        }}
      >
        {isComplete ? (
          <CheckCircleIcon
            sx={{
              color: hasWarning ? 'warning.main' : 'success.main',
              fontSize: 32,
            }}
          />
        ) : isActive ? (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              backgroundColor: 'primary.light',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: hasWarning ? 'warning.main' : 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
        {hasWarning && (
          <WarningIcon
            sx={{
              position: 'absolute',
              bottom: -8,
              right: -8,
              color: 'warning.main',
              fontSize: '1.25rem',
              background: '#fff',
              borderRadius: '50%',
              filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
}; 