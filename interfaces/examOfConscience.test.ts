import { isValidExamSlug } from './examOfConscience';

describe('isValidExamSlug', () => {
  it('returns true for valid slugs', () => {
    expect(isValidExamSlug('child')).toBe(true);
    expect(isValidExamSlug('teen')).toBe(true);
    expect(isValidExamSlug('adult')).toBe(true);
  });

  it('returns false for invalid slugs', () => {
    expect(isValidExamSlug('invalid')).toBe(false);
    expect(isValidExamSlug('')).toBe(false);
    expect(isValidExamSlug('ADULT')).toBe(false);
  });
});
