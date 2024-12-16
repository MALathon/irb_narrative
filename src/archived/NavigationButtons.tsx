import React from 'react';
import { Box, Button } from '@mui/material';

interface NavigationButtonsProps {
  activeStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  activeStep,
  totalSteps,
  onPrevious,
  onNext,
  nextButtonRef,
}) => (
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