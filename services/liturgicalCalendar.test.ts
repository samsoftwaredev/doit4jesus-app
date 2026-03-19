import {
  computeEaster,
  resolveLiturgicalDay,
} from '@/services/liturgicalCalendar';

describe('liturgicalCalendar', () => {
  describe('computeEaster', () => {
    it('returns correct Easter dates for known years', () => {
      // computeEaster returns a Date — check month (0-indexed) and date
      const e2024 = computeEaster(2024);
      expect(e2024.getMonth()).toBe(2); // March (0-indexed)
      expect(e2024.getDate()).toBe(31);

      const e2025 = computeEaster(2025);
      expect(e2025.getMonth()).toBe(3); // April
      expect(e2025.getDate()).toBe(20);

      const e2026 = computeEaster(2026);
      expect(e2026.getMonth()).toBe(3); // April
      expect(e2026.getDate()).toBe(5);

      const e2023 = computeEaster(2023);
      expect(e2023.getMonth()).toBe(3); // April
      expect(e2023.getDate()).toBe(9);
    });
  });

  describe('resolveLiturgicalDay', () => {
    it('recognizes Christmas Day', () => {
      const day = resolveLiturgicalDay('2025-12-25');
      expect(day.title).toBe('The Nativity of the Lord (Christmas)');
      expect(day.season).toBe('Christmas');
      expect(day.readings.length).toBeGreaterThan(0);
    });

    it('recognizes Epiphany', () => {
      const day = resolveLiturgicalDay('2025-01-06');
      expect(day.title).toBe('Epiphany of the Lord');
    });

    it('recognizes Immaculate Conception', () => {
      const day = resolveLiturgicalDay('2025-12-08');
      expect(day.title).toBe(
        'Solemnity of the Immaculate Conception of the Blessed Virgin Mary',
      );
    });

    it('recognizes All Saints', () => {
      const day = resolveLiturgicalDay('2025-11-01');
      expect(day.title).toBe('Solemnity of All Saints');
    });

    it('recognizes Easter Sunday', () => {
      // Easter 2025 = April 20
      const day = resolveLiturgicalDay('2025-04-20');
      expect(day.title).toBe('Easter Sunday of the Resurrection of the Lord');
      expect(day.season).toBe('Easter');
    });

    it('recognizes Ash Wednesday', () => {
      // Easter 2025 = April 20, Ash Wednesday = Easter - 46 = March 5
      const day = resolveLiturgicalDay('2025-03-05');
      expect(day.title).toBe('Ash Wednesday');
      expect(day.season).toBe('Lent');
    });

    it('recognizes Pentecost', () => {
      // Easter 2025 = April 20, Pentecost = +49 = June 8
      const day = resolveLiturgicalDay('2025-06-08');
      expect(day.title).toBe('Pentecost Sunday');
      expect(day.season).toBe('Easter');
    });

    it('resolves an Advent day', () => {
      const day = resolveLiturgicalDay('2025-12-01');
      expect(day.season).toBe('Advent');
      expect(day.title).toContain('Advent');
    });

    it('resolves an Ordinary Time day', () => {
      const day = resolveLiturgicalDay('2025-07-15');
      expect(day.season).toBe('Ordinary Time');
      expect(day.title).toContain('Ordinary Time');
    });

    it('resolves a Lenten weekday', () => {
      // March 10, 2025 is during Lent (Ash Wed = March 5)
      const day = resolveLiturgicalDay('2025-03-10');
      expect(day.season).toBe('Lent');
      expect(day.title).toContain('Lent');
    });

    it('always returns at least one reading', () => {
      const day = resolveLiturgicalDay('2025-08-20');
      expect(day.readings.length).toBeGreaterThanOrEqual(1);
    });

    it('sets readings in order', () => {
      const day = resolveLiturgicalDay('2025-12-25');
      const orders = day.readings.map((r) => r.order);
      const sorted = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sorted);
    });
  });
});
