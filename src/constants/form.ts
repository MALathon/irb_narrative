// Form field patterns
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const AGE_RANGE_PATTERN = /^\d+(-\d+)?$/;

// Validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  min: (min: number) => `Must be at least ${min} characters`,
  max: (max: number) => `Must be at most ${max} characters`,
  pattern: {
    date: `Please enter a valid date in ${DATE_FORMAT} format`,
    ageRange: 'Please enter a valid age range (e.g., 18-65 or 18)'
  },
  number: {
    min: (min: number) => `Must be at least ${min}`,
    max: (max: number) => `Must be at most ${max}`
  }
};

// Form layout constants
export const DRAWER_WIDTH = 400;
export const FORM_SPACING = 3;
export const FORM_PADDING = 3;

// Form field defaults
export const DEFAULT_MIN_TEXT_LENGTH = 20;
export const DEFAULT_MAX_TEXT_LENGTH = 1000;

// Form UI constants
export const FORM_TRANSITION_DURATION = 300; // ms
export const PREVIEW_MAX_WIDTH = 800;
export const PREVIEW_MAX_HEIGHT = '90vh'; 