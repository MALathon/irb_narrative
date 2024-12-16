import {
  DATE_PATTERN,
  DATE_FORMAT,
  AGE_RANGE_PATTERN,
  VALIDATION_MESSAGES
} from '../form';

describe('Form Constants', () => {
  describe('DATE_PATTERN', () => {
    it('matches valid dates', () => {
      expect('2023-12-31').toMatch(DATE_PATTERN);
      expect('2024-01-01').toMatch(DATE_PATTERN);
    });

    it('does not match invalid dates', () => {
      expect('2023/12/31').not.toMatch(DATE_PATTERN);
      expect('31-12-2023').not.toMatch(DATE_PATTERN);
      expect('2023-13-01').not.toMatch(DATE_PATTERN);
      expect('2023-12-32').not.toMatch(DATE_PATTERN);
    });
  });

  describe('AGE_RANGE_PATTERN', () => {
    it('matches single age', () => {
      expect('18').toMatch(AGE_RANGE_PATTERN);
      expect('65').toMatch(AGE_RANGE_PATTERN);
    });

    it('matches age ranges', () => {
      expect('18-65').toMatch(AGE_RANGE_PATTERN);
      expect('0-100').toMatch(AGE_RANGE_PATTERN);
    });

    it('does not match invalid age ranges', () => {
      expect('18-').not.toMatch(AGE_RANGE_PATTERN);
      expect('-65').not.toMatch(AGE_RANGE_PATTERN);
      expect('18-65-').not.toMatch(AGE_RANGE_PATTERN);
      expect('abc').not.toMatch(AGE_RANGE_PATTERN);
    });
  });

  describe('VALIDATION_MESSAGES', () => {
    it('provides required message', () => {
      expect(VALIDATION_MESSAGES.required).toBe('This field is required');
    });

    it('provides min message', () => {
      expect(VALIDATION_MESSAGES.min(5)).toBe('Must be at least 5 characters');
    });

    it('provides max message', () => {
      expect(VALIDATION_MESSAGES.max(10)).toBe('Must be at most 10 characters');
    });

    it('provides pattern messages', () => {
      expect(VALIDATION_MESSAGES.pattern.date).toBe(`Please enter a valid date in ${DATE_FORMAT} format`);
      expect(VALIDATION_MESSAGES.pattern.ageRange).toBe('Please enter a valid age range (e.g., 18-65 or 18)');
    });

    it('provides number validation messages', () => {
      expect(VALIDATION_MESSAGES.number.min(0)).toBe('Must be at least 0');
      expect(VALIDATION_MESSAGES.number.max(100)).toBe('Must be at most 100');
    });
  });
}); 