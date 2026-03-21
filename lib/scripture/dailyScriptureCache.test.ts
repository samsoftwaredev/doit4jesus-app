import { sanitizeDailyScriptureDateInput } from './dailyScriptureCache';

describe('sanitizeDailyScriptureDateInput', () => {
  it('keeps valid ISO date input', () => {
    expect(sanitizeDailyScriptureDateInput('2026-03-20')).toBe('2026-03-20');
  });

  it('falls back to today UTC for invalid values', () => {
    const value = sanitizeDailyScriptureDateInput('03/20/2026');
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
